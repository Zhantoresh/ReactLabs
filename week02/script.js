function createTask(name, options = {}) {
  let count = 0;
  let status = "idle";
  let lastDuration = null;
  let lastError = null;

  const minMs = options.minMs ?? 500;
  const maxMs = options.maxMs ?? 2000;
  const failRate = options.failRate ?? 0.3;

  function run() {
    status = "running";
    lastError = null;

    return new Promise((resolve, reject) => {
      const duration = Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs;

      setTimeout(() => {

        count += 1;
        lastDuration = duration;

        const didFail = Math.random() < failRate;
        if (didFail) {
          status = "failed";
          lastError = `${name} failed after ${duration}ms`;
          reject(new Error(lastError)); 
        } else {
          status = "completed";
          resolve({ name, duration, count }); 
        }
      }, duration);
    });
  }

  function getCount() {
    return count;
  }

  function getStatus() {
    return status;
  }

  function getLastDuration() {
    return lastDuration;
  }

  function getLastError() {
    return lastError;
  }

  function reset() {
    count = 0;
    status = "idle";
    lastDuration = null;
    lastError = null;
  }


  return {
    name,
    run,
    getCount,
    getStatus,
    getLastDuration,
    getLastError,
    reset,
  };
}


const tasks = [
  createTask("Load Users"),
  createTask("Load Posts"),
  createTask("Load Comments"),
];

const taskListEl = document.getElementById("task-list");
const runAllBtn = document.getElementById("run-all-btn");
const allTasksBanner = document.getElementById("all-tasks-banner");
const taskCardMap = new Map();


function capitalize(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

function renderTaskCard(task) {
  const card = document.createElement("div");
  card.className = "task-card";
  card.dataset.taskName = task.name;

  card.innerHTML = `
    <div class="task-status status-${task.getStatus()}">${task.name} ${capitalize(task.getStatus())}</div>
    <div class="task-meta">
      <span>runs: <span class="js-count">${task.getCount()}</span></span>
      <span>last time: <span class="js-duration">${task.getLastDuration() ?? "—"}</span>${task.getLastDuration() ? "ms" : ""}</span>
    </div>
    <div class="task-actions">
      <button class="btn js-run-btn">Run</button>
      <button class="btn js-reset-btn">Reset</button>
    </div>
  `;

  const runBtn = card.querySelector(".js-run-btn");
  runBtn.addEventListener("click", () => runSingleTask(task, card));

  const resetBtn = card.querySelector(".js-reset-btn");
  resetBtn.addEventListener("click", () => {

    task.reset();
    updateCardUI(task, card);
  });

  return card;
}

function updateCardUI(task, card) {
  const statusEl = card.querySelector(".task-status");
  const countEl = card.querySelector(".js-count");
  const durationEl = card.querySelector(".js-duration");

  const status = task.getStatus();
 
  statusEl.textContent = `${task.name} ${capitalize(status)}`;
  statusEl.className = `task-status status-${status}`;

  countEl.textContent = task.getCount();
  const duration = task.getLastDuration();
  durationEl.textContent = duration !== null ? `${duration}ms` : "—";
}

async function runSingleTask(task, card) {
  const runBtn = card.querySelector(".js-run-btn");
  const resetBtn = card.querySelector(".js-reset-btn");
  runBtn.disabled = true;
  resetBtn.disabled = true;
  const runPromise = task.run();
  updateCardUI(task, card);

  try {
    await runPromise;
  } catch (err) {

  } finally {
    updateCardUI(task, card);
    runBtn.disabled = false;
    resetBtn.disabled = false;
  }
}

function renderAllTaskCards() {
  taskListEl.innerHTML = "";
  taskCardMap.clear();
  tasks.forEach((task) => {
    const card = renderTaskCard(task);
    taskCardMap.set(task, card);
    taskListEl.appendChild(card);
  });
}

renderAllTaskCards();


async function runAllTasks() {
  runAllBtn.disabled = true;
  allTasksBanner.className = "banner banner-info";
  allTasksBanner.textContent = "Boarding all tasks…";


  const runningTasks = tasks.map((task) => runSingleTask(task, taskCardMap.get(task)));


  await Promise.all(runningTasks);

  const completedCount = tasks.filter((t) => t.getStatus() === "completed").length;
  const failedCount = tasks.filter((t) => t.getStatus() === "failed").length;

  allTasksBanner.className = "banner banner-done";
  allTasksBanner.textContent =
    `All tasks finished — ${completedCount} completed, ${failedCount} failed`;

  runAllBtn.disabled = false;
}

runAllBtn.addEventListener("click", runAllTasks);



const compareTasks = [
  createTask("Check-in", { minMs: 500, maxMs: 1200, failRate: 0 }),
  createTask("Security", { minMs: 500, maxMs: 1200, failRate: 0 }),
  createTask("Boarding", { minMs: 500, maxMs: 1200, failRate: 0 }),
];

const compareBtn = document.getElementById("compare-btn");
const compareResultsEl = document.getElementById("compare-results");

async function runComparison() {
  compareBtn.disabled = true;
  compareResultsEl.textContent = "Running sequential pass (one counter open)…";


  const seqStart = performance.now();
  for (const task of compareTasks) {
    await task.run();
  }
  const seqTime = performance.now() - seqStart;

  compareResultsEl.textContent = "Sequential pass done. Running concurrent pass (three counters open)…";


  const conStart = performance.now();
  await Promise.all(compareTasks.map((task) => task.run()));
  const conTime = performance.now() - conStart;

  const diff = seqTime - conTime;

  compareResultsEl.innerHTML = `
    <span class="compare-line compare-line-seq">Sequential (1 counter): ${seqTime.toFixed(0)}ms</span>
    <span class="compare-line compare-line-con">Concurrent (3 counters): ${conTime.toFixed(0)}ms</span>
    <span class="compare-line compare-line-explain">
      Concurrent finished ~${diff.toFixed(0)}ms faster. Sequential time is roughly the
      <strong>sum</strong> of all three durations, because each <code>await</code> waits
      for the previous task to fully settle before starting the next one. Concurrent time
      is roughly the <strong>slowest single task</strong>, because <code>Promise.all</code>
      starts all three timers at once and only waits for the last one to finish.
    </span>
  `;

  compareBtn.disabled = false;
}

compareBtn.addEventListener("click", runComparison);


const eventLoopBtn = document.getElementById("event-loop-btn");
const predictionInput = document.getElementById("prediction-input");
const consoleFeedEl = document.getElementById("console-feed");
const eventLoopExplanationEl = document.getElementById("event-loop-explanation");

function logToFeed(label, kind) {
  const line = document.createElement("div");
  line.className = `console-line console-${kind}`;
  line.textContent = label;
  consoleFeedEl.appendChild(line);
  console.log(label);
}

async function runEventLoopDemo() {
  eventLoopBtn.disabled = true;
  consoleFeedEl.innerHTML = "";
  eventLoopExplanationEl.textContent = "";

  const actualOrder = [];
  function record(label, kind) {
    actualOrder.push(label[0]);
    logToFeed(label, kind);
  }


  record("A: script start", "sync");

  setTimeout(() => {
    record("B: timeout #1 (0ms)", "macrotask");
  }, 0);

  Promise.resolve().then(() => {
    record("C: promise #1 .then()", "microtask");
  });

  async function asyncDemo() {
    record("D: inside async function (before await)", "sync");
    await Promise.resolve();
    record("F: inside async function (after await)", "microtask");
  }

  const asyncDemoPromise = asyncDemo();

  Promise.resolve().then(() => {
    record("E: promise #2 .then()", "microtask");
  });

  setTimeout(() => {
    record("G: timeout #2 (0ms)", "macrotask");
  }, 0);

  record("H: script end", "sync");

  await asyncDemoPromise;
  await new Promise((resolve) => setTimeout(resolve, 50));

  const predicted = predictionInput.value
    .split(/[,\s]+/)
    .map((s) => s.trim().toUpperCase())
    .filter(Boolean);

  const matchCount = actualOrder.filter((letter, i) => predicted[i] === letter).length;
  const allMatched = matchCount === actualOrder.length && predicted.length === actualOrder.length;

  eventLoopExplanationEl.innerHTML = `
    <span class="compare-line">Actual order: ${actualOrder.join(" → ")}</span>
    <span class="compare-line">Your prediction: ${predicted.join(" → ") || "(empty)"}</span>
    <span class="compare-line ${allMatched ? "compare-line-con" : "compare-line-seq"}">
      ${matchCount}/${actualOrder.length} positions matched your prediction.
    </span>
    <span class="compare-line compare-line-explain">
      <strong>Call Stack:</strong> all synchronous code runs first — A, D, H. Note D prints
      before H because calling <code>asyncDemo()</code> runs synchronously up to its first
      <code>await</code>, then returns control back to the main script.
      <strong>Microtask Queue:</strong> once the stack is empty, ALL queued microtasks run
      before anything else — both <code>.then()</code> callbacks and the code after
      <code>await</code> (C, F, E), in the order they were queued.
      <strong>Task Queue:</strong> only after the microtask queue is fully drained does the
      event loop take a macrotask — the two <code>setTimeout</code> callbacks (B, G), in the
      order they were scheduled.
    </span>
  `;

  eventLoopBtn.disabled = false;
}

eventLoopBtn.addEventListener("click", runEventLoopDemo);