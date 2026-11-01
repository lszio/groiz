/* ═══ 视图路由:hash → .view,导航 aria-current 同步。
       P4 Agent-first:home 默认;#/observe、#/run 是旧入口别名,
       分别落到 Agent 的 Activity / Tasks 标签(内容原样移入,业务 JS 不动)。 */
const VIEWS = ['home', 'agent', 'about', 'learn', 'status'];
const ROUTE_ALIAS = { observe: { view: 'agent', tab: 'p-act' }, run: { view: 'agent', tab: 'p-task' } };
function route() {
  const raw = (location.hash || '#/home').replace(/^#\//, '');
  const alias = ROUTE_ALIAS[raw];
  const v = VIEWS.includes(raw) ? raw : alias ? alias.view : 'home';
  document.querySelectorAll('.view').forEach(s => { s.hidden = s.dataset.view !== v; });
  document.querySelectorAll('.topnav a.link').forEach(a => {
    const target = (a.getAttribute('href') || '').replace(/^#\//, '');
    // #/run → Tasks;#/observe 属 Agent 的 Activity → 亮 Agent
    const mapped = alias ? (alias.tab === 'p-task' ? 'run' : 'agent') : raw;
    const hit = target === mapped;
    if (hit) a.setAttribute('aria-current', 'page');
    else a.removeAttribute('aria-current');
  });
  if (alias && v === 'agent') showAgentTab(alias.tab);
}
window.addEventListener('hashchange', route);
route();

/* ═══ Observe:REPLAY/LIVE 数据流 + 回合分组时间线 + Inspector ═══ */
const PHASES = [
  ['complete', 'ask', 'p-ask', 't-ask'],
  ['extract', 'extract', 'p-extract', 't-extract'],
  ['execute', 'execute', 'p-exec', 't-exec'],
  ['candidate?', 'check', 'p-check', 't-check'],
  ['revise', 'revise', 'p-revise', 't-revise'],
];
function phaseOf(name) { for (const p of PHASES) if (p[0] === name) return p; return null; }
const REPLAY = {"cursor":2847,"dropped":0,"events":[{"args":["{complete #<function> execute #<function> max-turns 2}"],"col":17,"depth":4,"kind":"call","line":80,"module":"agent.zio","name":"map?","seq":2581,"tail":false,"truncated":false},{"args":["{complete #<function> execute #<function> max-turns 2}","complete","nil"],"col":20,"depth":4,"kind":"call","line":81,"module":"agent.zio","name":"get","seq":2582,"tail":false,"truncated":false},{"args":["#<function>"],"col":25,"depth":4,"kind":"call","line":82,"module":"agent.zio","name":"fn?","seq":2583,"tail":false,"truncated":false},{"args":["{complete #<function> execute #<function> max-turns 2}","execute","nil"],"col":19,"depth":4,"kind":"call","line":84,"module":"agent.zio","name":"get","seq":2584,"tail":false,"truncated":false},{"args":["#<function>"],"col":24,"depth":4,"kind":"call","line":85,"module":"agent.zio","name":"fn?","seq":2585,"tail":false,"truncated":false},{"args":["{complete #<function> execute #<function> max-turns 2}","max-turns","3"],"col":21,"depth":4,"kind":"call","line":87,"module":"agent.zio","name":"get","seq":2586,"tail":false,"truncated":false},{"args":["{complete #<function> execute #<function> max-turns 2}","extract","#<function>"],"col":19,"depth":4,"kind":"call","line":88,"module":"agent.zio","name":"get","seq":2587,"tail":false,"truncated":false},{"args":["{complete #<function> execute #<function> max-turns 2}","revise","#<function>"],"col":18,"depth":4,"kind":"call","line":89,"module":"agent.zio","name":"get","seq":2588,"tail":false,"truncated":false},{"args":["{complete #<function> execute #<function> max-turns 2}","candidate?","#<function>"],"col":22,"depth":4,"kind":"call","line":90,"module":"agent.zio","name":"get","seq":2589,"tail":false,"truncated":false},{"args":["{complete #<function> execute #<function> max-turns 2}","price","nil"],"col":17,"depth":4,"kind":"call","line":91,"module":"agent.zio","name":"get","seq":2590,"tail":false,"truncated":false},{"args":["0","2"],"col":12,"depth":4,"kind":"call","line":93,"module":"agent.zio","name":">=","seq":2591,"tail":false,"truncated":false},{"args":["\"print the sum 1..10\"","nil"],"col":23,"depth":4,"kind":"call","line":97,"module":"agent.zio","name":"complete","seq":2592,"tail":false,"truncated":false},{"args":["{source \"(println 42)\" text \"{\"source\": \"(println 42)\"}\"}"],"col":24,"depth":4,"kind":"call","line":98,"module":"agent.zio","name":"extract","seq":2681,"tail":false,"truncated":false},{"args":["{source \"(println 42)\" text \"{\"source\": \"(println 42)\"}\"}","source","\"\""],"col":18,"depth":5,"kind":"call","line":47,"module":"agent.zio","name":"get","seq":2682,"tail":false,"truncated":false},{"args":["\"(println 42)\"","\"\""],"col":10,"depth":5,"kind":"call","line":48,"module":"agent.zio","name":"=","seq":2683,"tail":false,"truncated":false},{"args":["\"(println 42)\""],"col":29,"depth":4,"kind":"call","line":99,"module":"agent.zio","name":"nil?","seq":2684,"tail":false,"truncated":false},{"args":["\"(println 42)\""],"col":27,"depth":4,"kind":"call","line":102,"module":"agent.zio","name":"execute","seq":2685,"tail":false,"truncated":false},{"args":["nil"],"col":30,"depth":4,"kind":"call","line":103,"module":"agent.zio","name":"nil?","seq":2702,"tail":false,"truncated":false},{"args":["{error \"capability-denied: process isolation requires Linux namespaces at line 265, col 21\" output \"\" status \"failed\"}"],"col":16,"depth":4,"kind":"call","line":104,"module":"agent.zio","name":"candidate?","seq":2703,"tail":false,"truncated":false},{"args":["{error \"capability-denied: process isolation requires Linux namespaces at line 265, col 21\" output \"\" status \"failed\"}","status","\"failed\""],"col":42,"depth":5,"kind":"call","line":65,"module":"agent.zio","name":"get","seq":2704,"tail":false,"truncated":false},{"args":["\"failed\"","\"completed\""],"col":39,"depth":5,"kind":"call","line":65,"module":"agent.zio","name":"=","seq":2705,"tail":true,"truncated":false},{"args":["0","1"],"col":21,"depth":4,"kind":"call","line":108,"module":"agent.zio","name":"+","seq":2706,"tail":false,"truncated":false},{"args":["{error \"capability-denied: process isolation requires Linux namespaces at line 265, col 21\" output \"\" status \"failed\"}"],"col":32,"depth":4,"kind":"call","line":108,"module":"agent.zio","name":"revise","seq":2707,"tail":false,"truncated":false},{"args":["{error \"capability-denied: process isolation requires Linux namespaces at line 265, col 21\" output \"\" status \"failed\"}","error","\"no error detail was reported\""],"col":12,"depth":5,"kind":"call","line":59,"module":"agent.zio","name":"get","seq":2708,"tail":false,"truncated":false},{"args":["{error \"capability-denied: process isolation requires Linux namespaces at line 265, col 21\" output \"\" status \"failed\"}","turns","0"],"col":12,"depth":5,"kind":"call","line":60,"module":"agent.zio","name":"get","seq":2709,"tail":false,"truncated":false},{"args":["{error \"capability-denied: process isolation requires Linux namespaces at line 265, col 21\" output \"\" status \"failed\"}","status","\"failed\""],"col":13,"depth":5,"kind":"call","line":58,"module":"agent.zio","name":"get","seq":2710,"tail":false,"truncated":false},{"args":["1","2"],"col":12,"depth":4,"kind":"call","line":93,"module":"agent.zio","name":">=","seq":2711,"tail":false,"truncated":false},{"args":["\"print the sum 1..10\"","{error \"capability-denied: process isolation requires Linux namespaces at line 265, col 21\" status \"failed\" turns 0}"],"col":23,"depth":4,"kind":"call","line":97,"module":"agent.zio","name":"complete","seq":2712,"tail":false,"truncated":false},{"args":["{source \"(println 42)\" text \"{\"source\": \"(println 42)\"}\"}"],"col":24,"depth":4,"kind":"call","line":98,"module":"agent.zio","name":"extract","seq":2817,"tail":false,"truncated":false},{"args":["{source \"(println 42)\" text \"{\"source\": \"(println 42)\"}\"}","source","\"\""],"col":18,"depth":5,"kind":"call","line":47,"module":"agent.zio","name":"get","seq":2818,"tail":false,"truncated":false},{"args":["\"(println 42)\"","\"\""],"col":10,"depth":5,"kind":"call","line":48,"module":"agent.zio","name":"=","seq":2819,"tail":false,"truncated":false},{"args":["\"(println 42)\""],"col":29,"depth":4,"kind":"call","line":99,"module":"agent.zio","name":"nil?","seq":2820,"tail":false,"truncated":false},{"args":["\"(println 42)\""],"col":27,"depth":4,"kind":"call","line":102,"module":"agent.zio","name":"execute","seq":2821,"tail":false,"truncated":false},{"args":["nil"],"col":30,"depth":4,"kind":"call","line":103,"module":"agent.zio","name":"nil?","seq":2838,"tail":false,"truncated":false},{"args":["{error \"capability-denied: process isolation requires Linux namespaces at line 265, col 21\" output \"\" status \"failed\"}"],"col":16,"depth":4,"kind":"call","line":104,"module":"agent.zio","name":"candidate?","seq":2839,"tail":false,"truncated":false},{"args":["{error \"capability-denied: process isolation requires Linux namespaces at line 265, col 21\" output \"\" status \"failed\"}","status","\"failed\""],"col":42,"depth":5,"kind":"call","line":65,"module":"agent.zio","name":"get","seq":2840,"tail":false,"truncated":false},{"args":["\"failed\"","\"completed\""],"col":39,"depth":5,"kind":"call","line":65,"module":"agent.zio","name":"=","seq":2841,"tail":true,"truncated":false},{"args":["1","1"],"col":21,"depth":4,"kind":"call","line":108,"module":"agent.zio","name":"+","seq":2842,"tail":false,"truncated":false},{"args":["{error \"capability-denied: process isolation requires Linux namespaces at line 265, col 21\" output \"\" status \"failed\"}"],"col":32,"depth":4,"kind":"call","line":108,"module":"agent.zio","name":"revise","seq":2843,"tail":false,"truncated":false},{"args":["{error \"capability-denied: process isolation requires Linux namespaces at line 265, col 21\" output \"\" status \"failed\"}","error","\"no error detail was reported\""],"col":12,"depth":5,"kind":"call","line":59,"module":"agent.zio","name":"get","seq":2844,"tail":false,"truncated":false},{"args":["{error \"capability-denied: process isolation requires Linux namespaces at line 265, col 21\" output \"\" status \"failed\"}","turns","0"],"col":12,"depth":5,"kind":"call","line":60,"module":"agent.zio","name":"get","seq":2845,"tail":false,"truncated":false},{"args":["{error \"capability-denied: process isolation requires Linux namespaces at line 265, col 21\" output \"\" status \"failed\"}","status","\"failed\""],"col":13,"depth":5,"kind":"call","line":58,"module":"agent.zio","name":"get","seq":2846,"tail":false,"truncated":false},{"args":["2","2"],"col":12,"depth":4,"kind":"call","line":93,"module":"agent.zio","name":">=","seq":2847,"tail":false,"truncated":false}],"task":"print the sum 1..10","result":{"error":null,"output":null,"status":"exhausted","turns":2}};
const SOURCES = { 'agent.zio': ";; ── zio.agent — the agent's own decision logic, in Zio ─────────────\n;;\n;; This module decides — route, validate, revise, stop — and the things\n;; it cannot do itself arrive as a BEHAVIOR TABLE: one per-session map\n;; of decision points, passed in as a parameter (spec §3 L1). No free\n;; variables, no `set!`-installed globals: the loop's behavior is\n;; readable from its argument, and swapping a decision point happens at\n;; a turn boundary by passing a different map.\n;;\n;;   :complete   (fn [task feedback]) → reply map. Required. How to ask\n;;               the model; reference: candidate/make-complete-binding.\n;;   :execute    (fn [source]) → outcome map with :status. Required.\n;;               How to run a candidate; reference:\n;;               candidate/make-execute-binding.\n;;   :extract    (fn [reply]) → source or nil. What counts as a program\n;;               in a reply. Default: source-of.\n;;   :revise     (fn [outcome]) → the feedback map the next turn sees.\n;;               Default: feedback-of.\n;;   :candidate? (fn [outcome]) → does this outcome end the loop as a\n;;               candidate. Default: an outcome whose :status is\n;;               \"completed\".\n;;   :price      (fn [turn reply outcome]) → metering hook, called once\n;;               per turn after execution. A host wires its budget\n;;               ledger here; the loop itself never prices.\n;;   :max-turns  the turn ceiling. The host also meters calls\n;;               independently — a program cannot grant itself more\n;;               turns than the grant allows.\n;;\n;; The split is the point. This file decides *when* to ask the model\n;; and *what* to do with the answer; the behavior decides what a model\n;; call costs, what a program is allowed to reach, and how long it may\n;; run. Required keys are refused, not defaulted: a behavior that\n;; cannot say how to ask or how to run is not a behavior.\n\n;; A reply with no source is not a program. Treating it as one would\n;; hand the host an empty string and report whatever the sandbox said\n;; about it, which reads like a result about the model's code when the\n;; model never wrote any.\n;;\n;; Both reference bindings return keyword-keyed maps — that is the Zio\n;; map convention, and reading them with string keys returns the\n;; default every time, which is how a failed turn ends up looking like\n;; it carried no error at all.\n;; doc: (source-of reply) — extracts the model's program source string from a\n;; doc: reply map, or nil when the reply carries no :source. Reads keyword keys only.\n(defn source-of [reply]\n  (let* [source (get reply :source \"\")]\n    (if (= source \"\")\n      nil\n      source)))\n\n;; The feedback the next turn sees. The error is carried whole, not\n;; summarized: a revision that is shown a paraphrase of why it failed\n;; is a revision guessing.\n;; doc: (feedback-of outcome) — builds the feedback map the next turn sees from an\n;; doc: execute outcome: {:status :error :turns}. The error text is carried whole.\n(defn feedback-of [outcome]\n  {:status (get outcome :status \"failed\")\n   :error (get outcome :error \"no error detail was reported\")\n   :turns (get outcome :turns 0)})\n\n;; The default \"what is a candidate\" decision: an execution outcome\n;; whose status is \"completed\". A behavior overrides this to widen or\n;; narrow what ends the loop.\n(def agent--completed? (fn [outcome] (= (get outcome :status \"failed\") \"completed\")))\n\n;; Run the agent loop.\n;;\n;; `max-turns` in the behavior is the ceiling the host passed in from\n;; the grant, not a number this function decided: the call count is\n;; also metered there, so a program that ignored this argument would\n;; still be stopped.\n;; doc: (agent-run task behavior) — the agent loop over a behavior table\n;; doc: {:complete :execute :extract :revise :candidate? :price :max-turns}.\n;; doc: Returns {:status \"candidate\" :turns :execution} on success or\n;; doc: {:status \"exhausted\" :turns :last} when the ceiling is hit.\n;; doc: :complete and :execute are required; the loop refuses a behavior\n;; doc: that cannot ask or cannot run.\n(defn agent-run [task behavior]\n  (let* [b (if (map? behavior) behavior {})\n         complete (get b :complete nil)\n         _complete (if (fn? complete) true\n                     (error \"loom: agent behavior requires :complete (fn [task feedback])\"))\n         execute (get b :execute nil)\n         _execute (if (fn? execute) true\n                    (error \"loom: agent behavior requires :execute (fn [source])\"))\n         max-turns (get b :max-turns 3)\n         extract (get b :extract source-of)\n         revise (get b :revise feedback-of)\n         candidate? (get b :candidate? agent--completed?)\n         price (get b :price nil)]\n    (loop [turn 0 feedback nil]\n      (if (>= turn max-turns)\n        {:status \"exhausted\"\n         :turns turn\n         :last feedback}\n        (let* [reply (complete task feedback)\n               source (extract reply)\n               outcome (if (nil? source)\n                         {:status \"failed\"\n                          :error \"the model returned no source to execute\"}\n                         (execute source))\n               _metered (if (nil? price) true (price turn reply outcome))]\n          (if (candidate? outcome)\n            {:status \"candidate\"\n             :turns (+ turn 1)\n             :execution outcome}\n            (recur (+ turn 1) (revise outcome))))))))\n\n\n(export agent-run source-of feedback-of)\n" };
const LIVE_BASE = 'https://loom.lszio.space';

let mode = 'replay';
let events = [];
let cursor = null, dropped = 0;
let selectedSeq = null;
let liveTimer = null;

function latestCall() {
  for (let i = events.length - 1; i >= 0; i--) if (events[i].kind === 'call') return events[i];
  return null;
}

/* 回合分组:一个 turn 从 `(if (>= turn max-turns)` 的判定调用开始。
   第一组若不是判定调用,是行为表组装(PRELUDE)。分组依据来自教学
   端口的真实事件——这是展示逻辑,不是循环逻辑。 */
function turnGroups(evs) {
  const groups = [];
  let cur = null;
  for (const ev of evs) {
    const isTurnCheck = ev.kind === 'call' && ev.name === '>=' && ev.line === 93;
    if (isTurnCheck || !cur) {
      cur = { n: groups.length + 1, start: ev, isCheck: isTurnCheck, events: [] };
      groups.push(cur);
    }
    cur.events.push(ev);
  }
  return groups;
}

function selectEvent(ev) {
  selectedSeq = ev ? ev.seq : null;
  renderInspector(ev);
  document.querySelectorAll('#liveTl .ev, #runTl .ev').forEach(el => {
    el.classList.toggle('sel', ev && Number(el.dataset.seq) === selectedSeq);
  });
}

/* 时间线(turn 分组)渲染到任意容器 */
function renderTurnTimeline(container, evs, opts) {
  container.textContent = '';
  if (!evs.length) {
    const d = document.createElement('div');
    d.className = 'empty';
    d.textContent = (opts && opts.empty) || '(没有事件)';
    container.appendChild(d);
    return;
  }
  const follow = opts && opts.follow;
  const groups = turnGroups(evs);
  for (const g of groups) {
    const turn = document.createElement('div');
    turn.className = 'turn';
    const head = document.createElement('div');
    head.className = 'turn-head';
    const label = document.createElement('span');
    let checkText = '';
    if (g.isCheck) {
      label.textContent = `TURN ${g.n}`;
      const nums = (g.start.args || []).slice(-2).map(Number);
      checkText = nums.length === 2 && nums.every(Number.isFinite)
        ? `(>= ${nums[0]} ${nums[1]}) → ${nums[0] >= nums[1] ? '耗尽' : '继续'}`
        : `(>= …)`;
    } else {
      label.textContent = 'PRELUDE';
      checkText = '行为表组装';
    }
    const check = document.createElement('span');
    check.textContent = checkText;
    head.appendChild(label); head.appendChild(check);
    turn.appendChild(head);
    const minDepth = Math.min(...g.events.map(e => e.depth));
    for (const ev of g.events) {
      const row = document.createElement('div');
      row.className = 'ev' + (ev.kind === 'return' ? ' ret' : '');
      row.dataset.seq = ev.seq;
      row.style.paddingLeft = (6 + Math.max(0, ev.depth - minDepth) * 16) + 'px';
      if (ev.kind === 'return') {
        row.textContent = '↩ ' + String(ev.value ?? '').slice(0, 110);
      } else {
        const ph = phaseOf(ev.name);
        if (ph) {
          const chip = document.createElement('span');
          chip.className = 'ph ' + ph[2];
          chip.textContent = ph[1];
          row.appendChild(chip);
        }
        const nm = document.createElement('span');
        nm.className = 'nm';
        nm.textContent = ev.name + (ev.tail ? ' ⁽ᵗ⁾' : '');
        row.appendChild(nm);
        const ar = document.createElement('span');
        ar.className = 'ar';
        ar.textContent = (ev.args.length ? ' ' + ev.args.join(' ') : ' ()').slice(0, 90);
        row.appendChild(ar);
        const at = document.createElement('span');
        at.className = 'ln-at';
        at.textContent = ` @${ev.line}`;
        row.appendChild(at);
        if (ev.truncated) row.title = '实参超上限,已截断';
      }
      row.title = `#${ev.seq} ${ev.module}:${ev.line}:${ev.col}`;
      row.addEventListener('click', () => { selectEvent(ev); });
      turn.appendChild(row);
    }
    container.appendChild(turn);
  }
  if (follow) {
    container.scrollTop = container.scrollHeight;
    const lastCall = latestCall();
    if (lastCall) selectEvent(lastCall);
  }
}

function renderTimelineBar(bar, evs) {
  bar.textContent = '';
  for (const ev of evs.slice(-160)) {
    const tick = document.createElement('span');
    const ph = ev.kind === 'call' ? phaseOf(ev.name) : null;
    tick.className = 'tick ' + (ph ? ph[3] : 't-other');
    tick.style.height = ev.kind === 'call'
      ? (4 + Math.min(10, (ev.args || []).join(' ').length / 24)) + 'px' : '2px';
    tick.title = `#${ev.seq} ${ev.kind} ${ev.name ?? ''}`;
    tick.addEventListener('click', () => { selectEvent(ev); });
    bar.appendChild(tick);
  }
}

/* Inspector:源码窗口 + 事件详情 */
function renderInspector(ev) {
  const current = ev || latestCall();
  const srcPane = document.getElementById('insSrc');
  const detail = document.getElementById('insDetail');
  if (!current) {
    srcPane.textContent = '(no trace yet)';
    return;
  }
  const module = String(current.module).split('/').pop();
  const source = SOURCES[module];
  document.getElementById('insWhere').textContent = module;
  document.getElementById('insFile').textContent = String(current.module);
  if (source == null) {
    srcPane.textContent = `(源码未嵌入: ${module})`;
  } else {
    const lines = source.split('\n');
    const curLine = String(current.module).endsWith(module) ? current.line : 0;
    const from = Math.max(0, (curLine || 1) - 16), to = Math.min(lines.length, (curLine || 1) + 22);
    let html = '';
    for (let i = from; i < to; i++) {
      const cur = (i + 1 === curLine);
      const text = (lines[i] ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;');
      html += `<span class="ln${cur ? ' cur' : ''}" id="insLine${i + 1}"><span class="no">${i + 1}</span>${text}</span>`;
    }
    srcPane.innerHTML = html;
    const el = document.getElementById('insLine' + curLine);
    if (el) srcPane.scrollTop = el.offsetTop - srcPane.clientHeight / 2; // pane 内滚动
  }
  // 详情卡
  detail.textContent = '';
  const kv = (k, v) => {
    const row = document.createElement('div');
    row.className = 'kv';
    const b = document.createElement('b');
    b.textContent = k;
    row.appendChild(b);
    row.appendChild(typeof v === 'string' ? document.createTextNode(v) : v);
    detail.appendChild(row);
  };
  kv('event', `#${current.seq} ${current.kind}`);
  kv('at', `${current.module}:${current.line}:${current.col}`);
  kv('depth', String(current.depth) + (current.tail ? ' · tail call' : ''));
  if (current.kind === 'call') {
    const argsWrap = document.createElement('span');
    (current.args || []).forEach(a => {
      const c = document.createElement('code');
      c.className = 'arg';
      c.textContent = a;
      argsWrap.appendChild(c);
    });
    if (current.truncated) {
      const t = document.createElement('span');
      t.style.cssText = 'color:var(--ph-exec);font-size:11px';
      t.textContent = ' ⋯ 截断';
      argsWrap.appendChild(t);
    }
    kv('args', argsWrap);
  } else {
    kv('value', String(current.value ?? ''));
  }
}

function renderObserve() {
  const follow = document.getElementById('follow').checked;
  renderTimelineBar(document.getElementById('liveTimeline'), events);
  renderTurnTimeline(document.getElementById('liveTl'), events, { follow, empty: mode === 'live' ? '等待 loom 控制台的运行…' : '(没有事件)' });
  if (follow) renderInspector(null);
  renderLiveStat();
}

function renderLiveStat() {
  const stat = document.getElementById('liveStat');
  if (mode === 'replay') {
    const r = REPLAY.result ?? {};
    stat.textContent = `离线运行 · ${events.length} 事件 · status ${r.status ?? '—'} · turns ${r.turns ?? '—'}`;
  } else {
    stat.textContent = `LIVE 轮询 · ${events.length} 事件 · cursor ${cursor ?? '—'}` + (dropped > 0 ? ` · dropped ${dropped}` : '');
  }
}

async function pollLive() {
  if (mode !== 'live') return;
  try {
    const url = cursor === null ? LIVE_BASE + '/api/trace' : LIVE_BASE + '/api/trace?after=' + cursor;
    const r = await fetch(url, {cache: 'no-store'});
    if (!r.ok) return;
    const d = await r.json();
    dropped = d.dropped ?? dropped;
    if (d.events && d.events.length) {
      for (const ev of d.events) events.push(ev);
      if (events.length > 4000) events = events.slice(-3000);
      cursor = d.cursor;
      renderObserve();
    } else if (cursor === null) { cursor = d.cursor ?? 0; renderLiveStat(); }
  } catch (e) { /* 网络抖动:下一次轮询继续 */ }
}

function setMode(m) {
  mode = m;
  document.getElementById('mReplay').className = m === 'replay' ? 'on' : '';
  document.getElementById('mLive').className = m === 'live' ? 'on' : '';
  if (liveTimer) { clearInterval(liveTimer); liveTimer = null; }
  if (m === 'replay') {
    events = REPLAY.events.slice();
    cursor = REPLAY.cursor; dropped = REPLAY.dropped ?? 0;
    renderObserve();
  } else {
    events = []; cursor = null; dropped = 0;
    renderObserve();
    pollLive();
    liveTimer = setInterval(pollLive, 600);
  }
}
document.getElementById('mReplay').onclick = () => setMode('replay');
document.getElementById('mLive').onclick = () => setMode('live');
document.getElementById('follow').addEventListener('change', renderObserve);
setMode('replay');

/* ═══ Run:真实运行(POST /api/run,跨源授权已扩展到一次有界运行)═══ */
let runPreCursor = null;
document.getElementById('runForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const task = document.getElementById('runTask').value.trim();
  if (!task) return;
  const btn = document.getElementById('runBtn');
  const outcome = document.getElementById('runOutcome');
  btn.disabled = true; btn.textContent = '运行中…';
  outcome.className = 'outcome show running';
  document.getElementById('oState').textContent = 'running';
  document.getElementById('oTitle').textContent = '已提交,等待循环终态(同步返回)';
  document.getElementById('oBody').textContent = 'POST ' + LIVE_BASE + '/api/run\n  task: ' + task;
  document.getElementById('runStat').textContent = '';
  renderTurnTimeline(document.getElementById('runTl'), [], { empty: '运行中…(run 是同步的,返回后事件一次性出现)' });
  try {
    // 先固定游标:run 之后按 after=pre 拉取,只取这一轮的事件
    if (runPreCursor === null) {
      try {
        const pre = await fetch(LIVE_BASE + '/api/trace', {cache: 'no-store'});
        if (pre.ok) runPreCursor = (await pre.json()).cursor ?? 0;
      } catch (e2) { runPreCursor = null; }
    }
    const r = await fetch(LIVE_BASE + '/api/run', {
      method: 'POST', headers: {'content-type': 'application/json'},
      body: JSON.stringify({message: task, max_turns: Number(document.getElementById('runTurns').value)})
    });
    if (!r.ok) throw new Error('HTTP ' + r.status);
    const data = await r.json();
    // 终态映射:只展示后端真实产生的状态,不虚构
    const okState = data.status === 'candidate';
    const warnState = data.status === 'exhausted';
    window.__lastRun = { task, status: data.status, turns: data.turns, at: new Date() };
    if (typeof renderAgentAfterRun === 'function') renderAgentAfterRun();
    outcome.className = 'outcome show ' + (okState ? 'ok' : warnState ? 'warn' : 'bad');
    document.getElementById('oState').textContent = data.status;
    document.getElementById('oTitle').textContent =
      okState ? '执行成功 — 程序候选成立' : warnState ? '预算耗尽 — turn 上限到达' : '失败 — 错误作为证据保留';
    document.getElementById('oBody').textContent =
      `turns ${data.turns}` + (data.output != null ? `\noutput: ${JSON.stringify(data.output)}` : '')
      + (data.error ? `\nerror: ${data.error}` : '');
    // 拉这一轮的事件
    const after = runPreCursor !== null ? '?after=' + runPreCursor : '';
    const t = await fetch(LIVE_BASE + '/api/trace' + after, {cache: 'no-store'});
    const td = await t.json();
    const evs = td.events ?? [];
    document.getElementById('runStat').textContent = `${evs.length} 事件`;
    renderTimelineBar(document.getElementById('runTimelineBar'), evs);
    renderTurnTimeline(document.getElementById('runTl'), evs, { follow: true, empty: '(本轮没有 trace 事件)' });
  } catch (err) {
    outcome.className = 'outcome show bad';
    document.getElementById('oState').textContent = 'unreachable';
    document.getElementById('oTitle').textContent = '运行面不可达';
    document.getElementById('oBody').textContent = String(err) + '\n(loom 控制台未就绪或网络失败——不掩盖,不重试伪装)';
    document.getElementById('runStat').textContent = '';
    renderTurnTimeline(document.getElementById('runTl'), [], { empty: '(运行未发生——没有 trace 事件)' });
  }
  btn.disabled = false; btn.textContent = '发起运行';
});

/* ═══ 状态:真实 /api/health(状态视图 + Observe 状态条共用)═══ */
async function pollStatus() {
  const set = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
  try {
    const r = await fetch('https://loom.lszio.space/api/health', {cache: 'no-store'});
    const d = await r.json();
    document.getElementById('dLoom').className = 'dot ok';
    set('loomStatus', d.status ?? '?');
    set('loomTeach', d.teach ? '开启' : '未授予');
    set('loomCursor', String(d['trace-cursor'] ?? '—'));
    // Observe 状态条
    document.getElementById('oLoomDot').className = 'dot ok';
    set('oLoom', d.status ?? '?');
    set('oTeach', d.teach ? '开启' : '未授予');
    set('oCursor', String(d['trace-cursor'] ?? '—'));
    if (typeof renderAgentState === 'function') renderAgentState(true, d);
  } catch (e) {
    document.getElementById('dLoom').className = 'dot down';
    set('loomStatus', 'unreachable');
    set('loomTeach', '—'); set('loomCursor', '—');
    document.getElementById('oLoomDot').className = 'dot down';
    set('oLoom', 'unreachable'); set('oTeach', '—'); set('oCursor', '—');
    if (typeof renderAgentState === 'function') renderAgentState(false, null);
  }
  const token = (document.getElementById('groveToken').value || '').trim();
  try {
    const r = await fetch('https://api.groiz.lszio.space/api/health', {cache: 'no-store'});
    const d = await r.json();
    document.getElementById('dGrove').className = 'dot ok';
    set('groveStatus', d.status ?? '?');
    set('groveSchema', String(d.schema ?? '—'));
    set('groveEpoch', String(d.owner_epoch ?? '—'));
    set('groveSched', d.scheduler_failure == null ? '正常' : String(d.scheduler_failure));
    document.getElementById('oGroveDot').className = 'dot ok';
    set('oGrove', (d.status ?? '?') + (d.scheduler_failure == null ? '' : ' · scheduler 异常'));
  } catch (e) {
    document.getElementById('dGrove').className = 'dot down';
    set('groveStatus', 'unreachable');
    document.getElementById('oGroveDot').className = 'dot down';
    set('oGrove', 'unreachable');
  }
  const runsView = document.getElementById('runsView');
  const dRuns = document.getElementById('dRuns');
  if (!token) {
    dRuns.className = 'dot';
    runsView.textContent = '填入 token 后这里显示运行台账。不带 token 时:认证被拒绝是权限模型在工作,不是故障。';
  } else {
    try {
      const r = await fetch('https://api.groiz.lszio.space/api/runs', {headers: {Authorization: 'Bearer ' + token}});
      if (!r.ok) {
        dRuns.className = 'dot down';
        runsView.textContent = '认证被拒绝(' + r.status + ')——权限模型在工作。';
        if (typeof renderAgentRuns === 'function') renderAgentRuns(null);
      } else {
        const runs = await r.json();
        dRuns.className = 'dot ok';
        runsView.textContent = runs.length
          ? runs.map(x => `${x.id}: ${x.state} ${x.steps_consumed}/${x.steps_budget}`).join('\n')
          : '(当前没有运行)';
        if (typeof renderAgentRuns === 'function') renderAgentRuns(runs);
      }
    } catch (e) { dRuns.className = 'dot down'; runsView.textContent = 'unreachable'; }
  }
}
document.getElementById('groveToken').addEventListener('change', pollStatus);
pollStatus();
setInterval(pollStatus, 8000);

/* ═══ Learn:脚本化 Playground(演示,模型由脚本扮演)═══ */
const CODE_SEGMENTS = {
  loop: `(<span class="cm">;; 循环只认行为表:决定"下一步做什么"的每个判定</span>
<span class="cm">;; 都是表里的一项,宿主在组装时决定,循环无法自扩大。</span>
(<span class="kw">defn</span> <span class="fn">agent-run</span> [task behavior]
  (<span class="kw">let*</span> [b (<span class="kw">if</span> (<span class="fn">map?</span> behavior) behavior {})
         <span class="hl">complete</span>  (<span class="fn">get</span> b <span class="st">:complete</span> nil)   <span class="cm">;; ← ① 问模型(必填)</span>
         <span class="hl">execute</span>   (<span class="fn">get</span> b <span class="st">:execute</span> nil)    <span class="cm">;; ← ② 隔离执行(必填)</span>
         max-turns (<span class="fn">get</span> b <span class="st">:max-turns</span> 3)
         extract   (<span class="fn">get</span> b <span class="st">:extract</span> source-of)
         revise    (<span class="fn">get</span> b <span class="st">:revise</span> feedback-of)
         <span class="hl2">candidate?</span> (<span class="fn">get</span> b <span class="st">:candidate?</span> agent--completed?)]
    (<span class="kw">loop</span> [turn 0 feedback nil]
      (<span class="kw">if</span> (&gt;= turn max-turns)
        {:status <span class="st">"exhausted"</span> :turns turn :last feedback}
        (<span class="kw">let*</span> [reply (<span class="hl2"><span class="fn">complete</span> task feedback)</span>
               source (extract reply)
               outcome (<span class="kw">if</span> (nil? source)
                         {:status <span class="st">"failed"</span> :error <span class="st">"…no source…"</span>}
                         (<span class="hl"><span class="fn">execute</span> source)</span>)]
          (<span class="kw">if</span> (<span class="hl2"><span class="fn">candidate?</span> outcome)</span>
            {:status <span class="st">"candidate"</span> :turns (+ turn 1) :execution outcome}
            (<span class="kw">recur</span> (+ turn 1) (revise outcome))))))))`,
  complete: `(<span class="cm">;; 行为表在应用侧组装(candidate.zio 提供参考绑定)。</span>
<span class="cm">;; API key 只以环境变量"名字" travels——绑定内部经 host/getenv</span>
<span class="cm">;; 读取,名字之外的东西进不了行为表。</span>
(<span class="kw">def</span> <span class="fn">behavior</span>
  {:complete (<span class="hl"><span class="fn">make-complete-binding</span></span>
               {:base-url <span class="st">"…"</span> :model <span class="st">"…"</span>
                <span class="hl2">:api-key-env</span> <span class="st">"LOOM_LLM_API_KEY"</span>})
   :execute  (<span class="fn">make-execute-binding</span> {:zio-bin <span class="st">"…"</span> :scratch <span class="st">"…"</span>})
   :max-turns 3})

(<span class="fn">agent-run</span> task behavior)`,
  extract: `(<span class="cm">;; agent.zio — source-of:第一对 \`\`\` 围栏之间的内容是程序;</span>
<span class="cm">;; 没有围栏的回复不是程序 —— 循环把它当一轮失败,而不是硬跑。</span>
(<span class="kw">defn</span> <span class="fn">source-of</span> [reply]
  (<span class="kw">let*</span> [source (<span class="fn">get</span> reply <span class="st">:source</span> <span class="st">""</span>)]
    (<span class="kw">if</span> (= source <span class="st">""</span>)
      nil
      source)))

<span class="cm">;; 围栏解析在 candidate.zio(candidate--fence-span 等,</span>
<span class="cm">;; 私有以 -- 分隔;公共 API 裸名导出)。</span>`,
  execute: `(<span class="cm">;; candidate.zio — make-execute-binding:返回的闭包把源码</span>
<span class="cm">;; 写进数据根的 agent/ 目录,在 Linux namespace jail 里执行。</span>
(<span class="kw">defn</span> <span class="fn">make-execute-binding</span> [config]        <span class="cm">;; ← ② 隔离执行</span>
  (<span class="kw">fn</span> [source]
    (<span class="kw">let*</span> […
           staged (host/write-atomic (str host-dir <span class="st">"/candidate.zio"</span>)
                    (host/bytes-utf8 source))]
      (<span class="kw">try</span>
        (<span class="kw">let</span> [proc (<span class="hl">host/process-start</span>
                    {:executable zio-bin
                     :argv [<span class="st">"--emit-framed"</span> <span class="st">"--step-limit"</span> <span class="st">"1000000"</span>
                            <span class="st">"--timeout-ms"</span> <span class="st">"60000"</span> jail-path]
                     :cwd jail-scratch :scratch scratch
                     :timeout-ms 60000 :max-cpu-seconds 300 :max-processes 64})
               frame (<span class="hl2">candidate--read-frame proc deadline</span>)]   <span class="cm">;; ← 读信封</span>
          (host/process-kill proc)
          (candidate--outcome-of frame))
        (<span class="kw">catch</span> any
          <span class="cm">;; 无 namespace 的宿主在这里诚实拒绝:</span>
          {:status <span class="st">"failed"</span> :error (<span class="kw">str</span> *error*) :output <span class="st">""</span>})))))`,
  feedback: `(<span class="cm">;; agent.zio — feedback-of:失败即证据。</span>
<span class="cm">;; 错误整条携带,不摘要:看到转述的修订是在猜。</span>
(<span class="kw">defn</span> <span class="fn">feedback-of</span> [outcome]
  {:status (<span class="fn">get</span> outcome <span class="st">:status</span> <span class="st">"failed"</span>)
   :error  (<span class="fn">get</span> outcome <span class="st">:error</span> <span class="st">"no error detail was reported"</span>)
   :turns  (<span class="fn">get</span> outcome <span class="st">:turns</span> 0)})`,
  stop: `(<span class="cm">;; 默认的"什么算候选":执行结果 status = "completed"。</span>
<span class="cm">;; 行为表可以覆盖这个判定(candidate? 项)。</span>
(<span class="kw">def</span> <span class="fn">agent--completed?</span>
  (<span class="kw">fn</span> [outcome] (= (<span class="fn">get</span> outcome <span class="st">:status</span> <span class="st">"failed"</span>) <span class="st">"completed"</span>)))

<span class="cm">;; turn 上限(行为表里的 :max-turns,宿主传进来的)到达时:</span>
{:status <span class="st">"exhausted"</span> :turns 3 :last feedback}
<span class="cm">;; 拒绝所有候选也是有效结果 —— 必须展示真实提议与实验。</span>`,
};

const FILES = {
  loop:   ['libs/loom/agent.zio — agent-run', '循环判定'],
  complete:['libs/loom/candidate.zio — make-complete-binding', '问模型'],
  extract:['libs/loom/agent.zio — source-of', '提取程序'],
  execute:['libs/loom/candidate.zio — make-execute-binding', '隔离执行'],
  feedback:['libs/loom/agent.zio — feedback-of', '失败证据'],
  stop:   ['libs/loom/agent.zio — agent--completed?', '判定'],
};

/* 模型脚本:与仓库 mock provider 一致(先坏后好) */
const MODEL_SCRIPT = [
  { fence: true, body: '(defn main [] (twice-nothing 21))\n(main)' },
  { fence: true, body: '(defn answer [] (println (* 21 2)))\n(answer)' },
  { fence: false, body: '抱歉，我无法完成这个任务。' },
];

/* 执行模拟:镜像真实信封;turn2 起模型回复无围栏 → 无执行 */
function fakeExecute(source, turn) {
  if (turn === 0) {
    return { status: 'failed',
             error: 'symbol not found: twice-nothing at line 1, col 19',
             output: '' };
  }
  if (turn === 1) {
    return { status: 'completed', error: '', output: '42\n' };
  }
  return null;
}

const esc = s => s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
const zio = s => esc(s)
  .replace(/;.*$/gm, m => `<span class="cm">${m}</span>`)
  .replace(/&quot;([^&]*?)&quot;/g, '<span class="st">&quot;$1&quot;</span>')
  .replace(/\(defn |\(loop |\(if |\(let\*? |\(recur |\(require /g, m => `<span class="kw">${m.slice(1)}</span> (`)
  .replace(/\(defn|\(loop|\(if|\(let\*?|\(recur|\(require/g, m => `<span class="kw">${m}</span>`);

/* 阶段序列生成:由当前状态推下一步 */
const MAX_TURNS = 3;
let S = null;

function freshState() {
  return { turn: 0, feedback: null, step: 0, modelTurn: 0, done: false };
}

const $feed = document.getElementById('pgFeed');
const $code = document.getElementById('codeBlock');
const $file = document.getElementById('codeFile');
const $where = document.getElementById('codeWhere');
const $status = document.getElementById('pgStatus');
const $turn = document.getElementById('pgTurn');
const $budget = document.getElementById('pgBudget');

function showCode(key) {
  $code.innerHTML = `<pre class="code">${CODE_SEGMENTS[key]}</pre>`;
  $file.textContent = FILES[key][0];
  $where.textContent = FILES[key][1];
}

function addStage(cls, title, tag, bodyHtml) {
  const div = document.createElement('div');
  div.className = `stage ${cls}`;
  div.innerHTML = `<div class="s-head"><span>${title}</span><span class="tag">${tag}</span></div><div class="s-body">${bodyHtml}</div>`;
  $feed.appendChild(div);
  $feed.scrollTop = $feed.scrollHeight;
  return div;
}

function renderState() {
  $turn.textContent = S.turn;
  $status.textContent = S.step === 0 && S.turn === 0 && !S.feedback ? 'idle'
    : S.done ? ($status.dataset.final || 'exhausted') : 'running';
  const pct = Math.min(100, (S.turn / MAX_TURNS) * 100);
  $budget.style.width = pct + '%';
  $budget.classList.toggle('exhausted', pct >= 100);
  document.querySelectorAll('.loop-node').forEach(n => n.classList.remove('hot'));
  if (!S.done) {
    const map = ['task', 'model', 'model', 'exec', 'feedback', 'stop'];
    const node = map[Math.min(S.step, map.length - 1)];
    const el = document.querySelector(`[data-node="${node}"]`);
    if (el) el.classList.add('hot');
  }
}

function step() {
  if (S.done) return;
  const turn = S.turn;
  switch (S.step) {
    case 0: { /* 任务与预算 */
      showCode('loop');
      addStage('loop', `回合开始 · turn ${turn}`, 'task',
        `<pre class="code">${zio(`task = "计算 21 的两倍并打印结果"
max-turns = 3            ; 宿主授予的上限${S.feedback ? `
feedback = {:status "failed"
            :error "${esc(S.feedback.error).slice(0,52)}…"
            :turns ${S.feedback.turns}}` : `
feedback = nil           ; 首轮没有失败证据`}`)}</pre>`);
      S.step = 1; break;
    }
    case 1: { /* 问模型 */
      showCode('complete');
      const fb = S.feedback;
      const prompt = fb
        ? `Your previous program failed to execute.\n\nTask: 计算 21 的两倍…\n\nExecution report: status=${fb.status} error=${esc(fb.error).slice(0,60)}…\n\nWrite a corrected, complete program…`
        : `Write a complete, self-contained Zio program…\n\nTask: 计算 21 的两倍并打印结果`;
      addStage('model', `complete · turn ${turn}`, 'ASK',
        `<div style="color:var(--muted);font-size:12.5px;margin-bottom:6px">发给模型的 prompt（首行）：</div>
         <pre class="code">${esc(prompt.slice(0, 160))}${prompt.length>160?'…':''}</pre>`);
      S.step = 2; break;
    }
    case 2: { /* 模型回复 + 提取 */
      const reply = MODEL_SCRIPT[S.modelTurn % MODEL_SCRIPT.length];
      showCode('extract');
      addStage('model', `模型回复 · turn ${turn}`, 'REPLY',
        reply.fence
          ? `<pre class="code">${esc('```zio\n' + reply.body + '\n```')}</pre>`
          : `<pre class="code">${esc(reply.body)}</pre>`);
      S.pendingReply = reply;
      S.step = 3; break;
    }
    case 3: { /* 提取判定 */
      const reply = S.pendingReply;
      showCode('extract');
      if (reply.fence) {
        addStage('model', `source-of · turn ${turn}`, 'EXTRACT',
          `<div style="color:var(--muted);font-size:12.5px;margin-bottom:6px">围栏内程序（丢语言标签后）：</div>
           <pre class="code">${zio(reply.body)}</pre>`);
        S.pendingSource = reply.body;
      } else {
        addStage('model', `source-of · turn ${turn}`, 'EXTRACT',
          `<div style="color:var(--err)">无围栏 → nil → 不是程序。循环记为失败轮，不会把散文硬塞给沙箱。</div>`);
        S.pendingSource = null;
      }
      S.step = 4; break;
    }
    case 4: { /* 执行 or 无源失败 */
      if (S.pendingSource == null) {
        showCode('feedback');
        const outcome = { status: 'failed', error: 'the model returned no source to execute' };
        S.feedback = { ...outcome, turns: turn + 1 };
        addStage('loop', `无源失败 · turn ${turn}`, 'FAILED',
          `<pre class="code">${zio('{:status "failed"\n :error "the model returned no source to execute"}')}</pre>
           <div style="color:var(--muted);font-size:12.5px;margin-top:6px">recur(+ turn 1)，错误原样带回。</div>`);
        S.modelTurn++;
        S.turn++; S.step = 0;
        if (S.turn >= MAX_TURNS) finish();
        break;
      }
      showCode('execute');
      const jailCfg = `{executable  zio-bin
 :argv       ["--emit-framed" "--step-limit" "1000000"
              "--timeout-ms" "60000" "/scratch/agent/<clock>/candidate.zio"]
 :cwd        "/scratch"
 :scratch    <数据根>/worker-scratch
 :timeout-ms 60000  :max-cpu-seconds 300  :max-processes 64}`;
      addStage('exec', `jail 内执行 · turn ${turn}`, 'EXECUTE',
        `<div style="color:var(--muted);font-size:12.5px;margin-bottom:6px">host/process-start 配置（宿主定上限，程序选不了）：</div>
         <pre class="code">${esc(jailCfg)}</pre>`);
      S.step = 5; break;
    }
    case 5: { /* 信封与判定 */
      const outcome = fakeExecute(S.pendingSource, S.turn);
      showCode('stop');
      const frame = `{"status":"${outcome.status}",
 "error":"${esc(outcome.error)}",
 "output":"${esc(outcome.output)}",
 "output-truncated":false,"result":null,"steps":0}`;
      const done = outcome.status === 'completed';
      addStage(done ? 'final' : 'exec', `执行信封 · turn ${turn}`, 'FRAME',
        `<pre class="code">${esc(frame)}</pre>
         <div style="margin-top:8px;color:${done ? 'var(--ok)' : 'var(--err)'};font-size:13px">
           ${done
             ? 'status=completed → 循环结束：这一轮程序成为 <b>candidate</b>。'
             : 'status=failed → 错误<b>原样</b>进入下一轮 feedback。'}</div>`);
      if (done) {
        S.done = true;
        $status.dataset.final = 'candidate';
        addStage('final', `回合结束 · turn ${turn + 1}`, 'CANDIDATE',
          `<pre class="code">${zio('{:status "candidate"\n :turns 2\n :execution {:status "completed" :output "42\\n"}}')}</pre>`);
      } else {
        S.feedback = { status: outcome.status, error: outcome.error, turns: turn + 1 };
      }
      S.modelTurn++;
      S.turn++; S.step = 0;
      if (done || S.turn >= MAX_TURNS) { if (!done) finish(); }
      break;
    }
  }
  renderState();
  document.getElementById('btnStep').disabled = S.done;
  document.getElementById('btnRun').disabled = S.done;
}

function finish() {
  S.done = true;
  $status.dataset.final = 'exhausted';
  showCode('stop');
  addStage('loop', `turn 上限到达`, 'EXHAUSTED',
    `<pre class="code">${zio('{:status "exhausted" :turns 3\n :last {:status "failed" :error … :turns 3}}')}</pre>
     <div style="color:var(--muted);font-size:12.5px;margin-top:6px">拒绝所有候选也是有效结果——旧的候选不会被悄悄替换。</div>`);
  renderState();
  document.getElementById('btnStep').disabled = true;
  document.getElementById('btnRun').disabled = true;
}

function reset() {
  S = freshState();
  $feed.innerHTML = '';
  addStage('loop', '等待开始', 'idle',
    `<div style="color:var(--muted)">点击「下一步」开始。任务：<b style="color:var(--text)">“计算 21 的两倍并打印结果”</b>，预算 3 turns。</div>`);
  $status.dataset.final = '';
  showCode('loop');
  renderState();
  document.getElementById('btnStep').disabled = false;
  document.getElementById('btnRun').disabled = false;
}

document.getElementById('btnStep').onclick = step;
document.getElementById('btnRun').onclick = () => {
  const run = () => { if (!S.done) { step(); setTimeout(run, 420); } };
  run();
};
document.getElementById('btnReset').onclick = reset;
reset();

/* ── 主题:system → light → dark 循环,三产品共用 localStorage 键 ── */
window.ztTheme = {
  order: ['system', 'light', 'dark'],
  glyph: { system: '◐', light: '☀', dark: '☾' },
  label: { system: '跟随系统', light: '浅色', dark: '深色' },
  get() { return document.documentElement.dataset.themePref || 'system'; },
  apply(p) {
    const d = p === 'dark' || (p === 'system' && matchMedia('(prefers-color-scheme: dark)').matches);
    document.documentElement.dataset.theme = d ? 'dark' : 'light';
    document.documentElement.dataset.themePref = p;
    const b = document.getElementById('themeBtn');
    if (b) {
      b.textContent = this.glyph[p];
      b.setAttribute('aria-label', '切换主题（当前：' + this.label[p] + '）');
      b.title = '主题：' + this.label[p];
    }
  },
  set(p) { try { localStorage.setItem('zt-theme', p); } catch (e) {} this.apply(p); },
  cycle() { this.set(this.order[(this.order.indexOf(this.get()) + 1) % 3]); },
};
document.getElementById('themeBtn').addEventListener('click', () => ztTheme.cycle());
matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
  if (ztTheme.get() === 'system') ztTheme.apply('system');
});
/* ═══ P4 Agent-first 启动块:DOM 原样搬移 + 真实数据水合 ═══ */
// Activity ← Observe、Tasks ← Run:整段移入 Agent 标签,业务 JS 引用的
// id 全部保留,渲染函数照常工作。移除腾空的旧 section。
(function relocate() {
  const act = document.getElementById('p-act'), run = document.getElementById('runHost');
  const obs = document.getElementById('view-observe'), runView = document.getElementById('view-run');
  if (obs && act) { while (obs.firstChild) act.appendChild(obs.firstChild); obs.remove(); }
  if (runView && run) { while (runView.firstChild) run.appendChild(runView.firstChild); runView.remove(); }
})();

function showAgentTab(pane) {
  document.querySelectorAll('.atab').forEach(b => {
    const on = b.dataset.pane === pane;
    b.classList.toggle('on', on);
    b.setAttribute('aria-selected', String(on));
  });
  document.querySelectorAll('.apane').forEach(p => p.classList.toggle('on', p.id === pane));
}
document.querySelectorAll('.atab').forEach(b =>
  b.addEventListener('click', () => showAgentTab(b.dataset.pane)));

/* 占位导航(Memory/Skills/Evolution/Inbox/Rooms):点击给说明,不出假页面 */
const toast = document.createElement('div');
toast.id = 'toast'; toast.setAttribute('role', 'status');
document.body.appendChild(toast);
let toastTimer = null;
function showToast(text) {
  toast.textContent = text;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 4200);
}
document.querySelectorAll('.topnav .soon').forEach(el => {
  el.addEventListener('click', () => showToast(el.dataset.soon));
  el.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); showToast(el.dataset.soon); } });
});
/* 带 data-tab 的站内链接:跳到 Agent 并打开指定标签(如 Home 的 Activity 链接) */
document.querySelectorAll('a[data-tab]').forEach(a => {
  a.addEventListener('click', () => {
    if (location.hash === '#/agent') showAgentTab(a.dataset.tab);
    else {
      location.hash = '#/agent';
      setTimeout(() => showAgentTab(a.dataset.tab), 0);
    }
  });
});

/* Configuration:agent.zio 全文(与 Inspector 同一数据源 SOURCES) */
document.getElementById('cfgSrc').textContent = SOURCES['agent.zio'];

/* 状态水合:数据全部来自已有 pollStatus / trace 事件,不新造数据 */
function renderAgentState(ok, d) {
  const text = ok ? ((d && d.status) || 'ok') : 'unreachable';
  for (const [b, dot, t] of [['hState', 'hDot', 'hStateText'], ['aState', 'aDot', 'aStateText']]) {
    const badge = document.getElementById(b);
    if (!badge) continue;
    badge.className = 'badge ' + (ok ? 'ok' : 'bad');
    document.getElementById(t).textContent = ok ? '运行中 · session ' + text : '运行面不可达';
  }
  const teach = d ? (d.teach ? '开启' : '未授予') : '—';
  const cursor = d ? String(d['trace-cursor'] ?? '—') : '—';
  const aT = document.getElementById('aTeach'), aC = document.getElementById('aCursor');
  if (aT) aT.textContent = teach;
  if (aC) aC.textContent = cursor;
}
function renderAgentRuns(runs) {
  const box = document.getElementById('aRuns');
  if (!box) return;
  if (runs === undefined) {
    box.innerHTML = '<div class="empty">未填 token——认证被拒绝是权限模型在工作,不是故障。</div>';
  } else if (runs === null) {
    box.innerHTML = '<div class="empty">认证被拒绝——权限模型在工作。核对状态页的 token。</div>';
  } else if (!runs.length) {
    box.innerHTML = '<div class="empty">(grove 当前没有运行记录)</div>';
  } else {
    box.textContent = '';
    for (const x of runs.slice(0, 6)) {
      const row = document.createElement('div');
      row.className = 'kv';
      const dt = document.createElement('dt'); dt.textContent = x.id;
      const dd = document.createElement('dd'); dd.textContent = `${x.state} · ${x.steps_consumed}/${x.steps_budget}`;
      row.append(dt, dd);
      box.appendChild(row);
    }
  }
}
function renderAgentAfterRun() {
  const r = window.__lastRun;
  if (!r) return;
  const line = `${r.task} → ${r.status} · ${r.turns} turns`;
  const a = document.getElementById('aLastRun');
  if (a) a.textContent = line;
  const box = document.getElementById('hTasks');
  if (box && !box.dataset.grove) {
    box.textContent = '';
    const row = document.createElement('div');
    row.className = 'kv';
    const dt = document.createElement('dt'); dt.textContent = '本页最近';
    const dd = document.createElement('dd'); dd.textContent = line;
    row.append(dt, dd);
    box.appendChild(row);
  }
}
/* Home · Currently working:教学端口的最近调用(与 Observe 同一份 events) */
function renderWorking() {
  const box = document.getElementById('hWorking');
  if (!box) return;
  const calls = [];
  for (let i = events.length - 1; i >= 0 && calls.length < 3; i--)
    if (events[i].kind === 'call') calls.push(events[i]);
  if (!calls.length) return;
  box.textContent = '';
  for (const ev of calls.reverse()) {
    const row = document.createElement('div');
    row.className = 'kv';
    const dt = document.createElement('dt');
    const ph = phaseOf(ev.name);
    dt.textContent = (ph ? ph[1] + ' · ' : '') + ev.name;
    const dd = document.createElement('dd');
    dd.textContent = `agent.zio:${ev.line}`;
    row.append(dt, dd);
    box.appendChild(row);
  }
}
setInterval(renderWorking, 1200);
renderWorking();
ztTheme.apply(ztTheme.get());
