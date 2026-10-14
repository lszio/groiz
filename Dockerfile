# Groiz: the Zio checkout it builds against, the launcher, the console
# assets and a locked CPU worker venv. The site (WASM playground, docs,
# language pages) is a separate repository and owns the public origin and
# the `/wasm/*` bundle; Groiz serves only its own control plane.
#
# Zio is fetched from GitHub rather than read out of the build context:
# this repository is standalone, and a Docker build only ever sees its own
# directory. ZIO_REF names the revision to build against — a branch, tag or
# commit — and must accept `--app-env`, which is how the launcher grants its
# token names.
FROM rust:1-bookworm AS zio-build
ARG ZIO_REF=main
# libclang is the same build dependency the Zio image needs: zio-js binds
# QuickJS with rquickjs' `bindgen` feature.
RUN apt-get update \
 && apt-get install -y --no-install-recommends clang libclang-dev git ca-certificates \
 && rm -rf /var/lib/apt/lists/*
RUN git clone --filter=blob:none https://github.com/lszio/zio /src/zio \
 && git -C /src/zio checkout "$ZIO_REF"
WORKDIR /src/zio
RUN cargo build --release -p zio-cli

FROM python:3.12-slim-bookworm AS worker-venv
COPY workers/torch/requirements.txt /tmp/requirements.txt
RUN python -m venv /opt/grove-venv && \
    /opt/grove-venv/bin/pip install --no-cache-dir \
      --index-url https://download.pytorch.org/whl/cpu -r /tmp/requirements.txt

# The runtime stage is the same python image the venv was built on, not
# plain debian-slim: the venv's bin/python symlinks into /usr/local, and
# the jail mounts the container's /usr, so the base interpreter must live
# there or the venv cannot exec after pivot_root.
FROM python:3.12-slim-bookworm
RUN apt-get update && apt-get install -y --no-install-recommends \
      util-linux ca-certificates bash && rm -rf /var/lib/apt/lists/*
# `unshare` from util-linux is the isolation primitive Groiz refuses to
# train without; installing the binary is not the same as being granted
# namespaces.
COPY --from=worker-venv /opt/grove-venv /opt/grove-venv
COPY --from=zio-build /src/zio /opt/zio
COPY . /opt/groiz
RUN rm -rf /opt/groiz/.git /opt/groiz/target
RUN useradd --system --create-home --home-dir /srv/grove grove && \
    mkdir -p /srv/grove/data/worker-scratch && \
    chown -R grove:grove /srv/grove
USER grove
# The launcher reads the GROIZ_* names and finds its Zio checkout through
# ZIO_ROOT; the worker and its interpreter are granted from here, never
# named by the application.
ENV ZIO_ROOT=/opt/zio \
    ZIO_BIN=/opt/zio/target/release/zio-cli \
    GROIZ_APP_ROOT=/opt/groiz \
    GROIZ_ROOT=/srv/grove/data \
    GROIZ_WORKERS=2 \
    GROIZ_BIND=0.0.0.0:8787 \
    GROIZ_TENSOR_PYTHON=/opt/grove-venv/bin/python \
    GROIZ_WORKER_SCRIPT=/opt/groiz/workers/torch/worker.py
EXPOSE 8787
# Health asks the running service, it does not start a second one: two
# owners on one store would fight over the coordinator epoch. The body is
# checked because the API answers 200 with status "degraded" while the
# scheduler cannot advance — a stalled queue must not report healthy.
HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
  CMD ["/opt/grove-venv/bin/python", "-c", "import urllib.request,json,sys; r=urllib.request.urlopen('http://127.0.0.1:8787/api/health', timeout=3); sys.exit(0 if r.status == 200 and json.load(r).get('status') == 'ok' else 1)"]
CMD ["/opt/groiz/tools/groiz", "serve", "--root", "/srv/grove/data"]
