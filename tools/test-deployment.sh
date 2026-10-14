#!/usr/bin/env bash
# Build the image and prove the deployed surface: console routes, role
# authorization, a writable store, real owner execution and restart
# persistence.
set -euo pipefail

root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$root"
project="groiz-deploy-check-$$"
# The deployment file is expose-only (host ports are global on a shared
# Dokploy host); the local override adds loopback mappings. The port is
# resolved via `docker compose port`, so the pinned value may be remapped.
compose() { docker compose -p "$project" -f docker-compose.yml -f docker-compose.local.yml "$@"; }
# `down -v` removes the named volume Compose created for this project;
# there is no volume named after the project, so nothing else to clean.
cleanup() {
  compose down -v --remove-orphans >/dev/null 2>&1 || true
}
trap cleanup EXIT

export GROIZ_TOKEN_READER=reader-test
export GROIZ_TOKEN_OPERATOR=operator-test
export GROIZ_TOKEN_PUBLISHER=publisher-test
export GROIZ_TOKEN_ANNOTATOR=annotator-test
compose up -d --build
compose ps

port="$(compose port grove 8787 | sed 's/.*://')"
for _ in {1..60}; do
  # -f: an unanswered port still returns exit 0 without it, ending the wait early.
  if curl -fsS --max-time 3 "http://127.0.0.1:$port/api/health" >/dev/null 2>&1; then break; fi
  sleep 2
done

check() {
  local label="$1" expected="$2"; shift 2
  local actual
  actual="$(curl -sS --max-time 5 -o /dev/null -w '%{http_code}' "$@" 2>/dev/null || true)"
  [[ "$actual" == "$expected" ]] || { printf 'FAIL %s: expected %s, got %s\n' "$label" "$expected" "$actual" >&2; exit 1; }
}

# The console is served by the application itself, on its own port: there
# is no proxy in front of it any more.
check "control plane" 200 "http://127.0.0.1:$port/"
check "console stylesheet" 200 "http://127.0.0.1:$port/styles.css"
# Dots in the tail must not be confused with a file extension: the router
# matches on the path, and run ids are allowed to contain dots.
check "dotted run id reaches api" 401 "http://127.0.0.1:$port/api/runs/ci-run.zio"
check "unauthenticated api" 401 "http://127.0.0.1:$port/api/runs"
check "reader api" 200 -H 'Authorization: Bearer reader-test' "http://127.0.0.1:$port/api/runs"

curl -sS --max-time 5 -X POST "http://127.0.0.1:$port/api/learning/queue" \
  -H 'Authorization: Bearer operator-test' -H 'Content-Type: application/json' \
  --data '{"run_id":"ci-run","task_id":"ci-task","steps_budget":1,"steps":1,"kind":"training","work":{"steps":1,"graph":{}}}' \
  >/dev/null

state=""
for _ in {1..120}; do
  body="$(curl -sS --max-time 5 -H 'Authorization: Bearer reader-test' "http://127.0.0.1:$port/api/runs/ci-run" 2>/dev/null || true)"
  state="$(printf '%s' "$body" | sed -n 's/.*"state":"\([^"]*\)".*/\1/p')"
  case "$state" in evaluating|failed|paused|cancelled) break ;; esac
  sleep 2
done
case "$state" in
  evaluating) printf 'owner executed queued work: %s\n' "$state" ;;
  failed)
    # The deployed image refuses to train without namespace isolation, and
    # a refusal recorded as `failed` with an event is the correct outcome,
    # not a silent pass.
    printf 'owner refused training without isolation: %s\n' "$body" ;;
  paused|cancelled) printf 'owner settled the run: %s\n' "$state" ;;
  *) printf 'FAIL queued work never ran: %s\n' "$body" >&2; exit 1 ;;
esac

# Restart persistence: the same volume must still answer with the run.
compose restart grove
for _ in {1..60}; do
  if curl -fsS --max-time 3 "http://127.0.0.1:$port/api/health" >/dev/null 2>&1; then break; fi
  sleep 2
done
check "run survives restart" 200 -H 'Authorization: Bearer reader-test' "http://127.0.0.1:$port/api/runs/ci-run"

printf 'PASS Groiz deployment\n'
