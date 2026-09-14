# Departures — Async Task Board

A small vanilla HTML/CSS/JS project for the "JavaScript Runtime and Async"
homework. It simulates an airport departures board where each "flight" is
really an asynchronous task (`Load Users`, `Load Posts`, `Load Comments`),
used to practice closures, the call stack, promises, `async`/`await`, and
the event loop.

## Running it

Open `index.html` in a browser (or via VS Code's Live Server extension —
all three files, `index.html`, `style.css`, and `script.js`, must be in the
same folder). No build step, no dependencies — pure HTML/CSS/JS.

## Project structure

- `index.html` — page structure: task rows, the comparison panel, the event
  loop demo panel.
- `style.css` — the departures-board visual theme.
- `script.js` — all logic: the `createTask` closure factory, UI wiring,
  the "Run All Tasks" coordinator, the sequential-vs-concurrent comparison,
  and the event loop demo.

---

## How the closure keeps the task counter private

Every task is created by calling `createTask(name)`, defined in
`script.js`. Inside that function, `count`, `status`, `lastDuration`, and
`lastError` are declared as local variables with `let` — they exist only
inside `createTask`'s own execution context:

```js
function createTask(name, options = {}) {
  let count = 0;
  let status = "idle";
  // ...

  function run() { /* ... increments count, changes status ... */ }
  function getCount() { return count; }
  function reset() { count = 0; status = "idle"; /* ... */ }

  return { name, run, getCount, getStatus, getLastDuration, getLastError, reset };
}
```

The object that `createTask` returns only exposes **functions**
(`run`, `getCount`, `reset`, ...) — it never exposes `count` itself as a
property. Those returned functions are **closures**: they keep access to
`count` and `status` because they were defined inside `createTask`, even
after `createTask` itself has finished running and returned.

Because there is no `task.count` property, code outside `createTask` can
never read or overwrite the real counter directly. I verified this while
building the project:

```js
taskA.count = 999;              // this just creates an unrelated property
console.log(taskA.getCount());  // still prints the real, untouched count
```

And because every call to `createTask("Load Users")`,
`createTask("Load Posts")`, etc. runs the function fresh, each call creates
its **own** independent `count`/`status` variables. That's why the three
task rows on the board never share or interfere with each other's counts.

## How the call stack works (one example from the app)

Take the "Run All Tasks" button, wired to `runAllTasks()`:

```js
async function runAllTasks() {
  runAllBtn.disabled = true;
  const runningTasks = tasks.map((task) => runSingleTask(task, taskCardMap.get(task)));
  await Promise.all(runningTasks);
  // ...
}
```

When the button is clicked, `runAllTasks()` is pushed onto the call stack.
Inside it, `tasks.map(...)` calls `runSingleTask()` for each task **one
after another, synchronously** — each of those calls is briefly pushed
onto the stack, runs its synchronous part (which calls `task.run()`,
itself pushed and popped), and is popped off again. None of this waits for
any timer; the `setTimeout` inside `task.run()`'s Promise executor is
handed off to the browser's Web APIs, not the call stack, which is why all
three tasks can start "at the same time" even though function calls
themselves happen one by one on a single thread.

Once `.map()` has finished (the stack for `runAllTasks` is otherwise
empty except for the pending `await Promise.all(...)`), `runAllTasks`
itself is suspended and popped off the stack until every task's Promise
settles — at which point its continuation (the code after `await`) is
pushed back onto the stack to finish updating the banner.

## How JavaScript can continue while `setTimeout` is waiting

Inside `createTask`'s `run()` function:

```js
return new Promise((resolve, reject) => {
  const duration = /* random 500–2000ms */;
  setTimeout(() => {
    // decide completed vs failed, then resolve/reject
  }, duration);
});
```

Calling `setTimeout` does **not** block the call stack for `duration`
milliseconds. It just registers the callback with the browser's timer
API and immediately returns control to whatever called `run()`. The
callback is only placed on the **task queue** once the timer expires, and
only actually executes once the call stack is empty again. That's exactly
why clicking three "Run" buttons (or "Run All Tasks") doesn't freeze the
page — the UI stays responsive, other clicks still work, and the three
timers all count down independently in the background.

## Predicted vs. actual Event Loop output

The demo built into the page (`runEventLoopDemo` in `script.js`) contains
two `setTimeout` calls, two `Promise.resolve().then()` calls, and one
`async` function with an `await` — exactly what the assignment asks for.

Source order of the logging statements: **A, B, C, D, E, F, G, H**.

My first instinct (before testing) was that the order would just follow
the source code line by line: `A → B → C → D → E → F → G → H`. That
prediction is **wrong** — running it confirmed the actual order is:

```
Actual order: A → D → H → C → F → E → B → G
```

Explanation using **Call Stack → Microtask Queue → Task Queue → Event
Loop**:

1. **Call Stack (synchronous code first):** `A` prints immediately.
   Calling `asyncDemo()` runs synchronously up to its first `await`, so
   `D` prints next — *before* the rest of the main script has even
   finished. Once `asyncDemo` hits `await`, it's suspended and control
   returns to the main script, which finishes its remaining synchronous
   line and prints `H`. So the full synchronous phase is `A, D, H`.
2. **Microtask Queue:** once the call stack is empty, *all* queued
   microtasks run before anything else touches the stack again. In the
   order they were queued: the first `.then()` (`C`), the continuation
   after `await` inside `asyncDemo` (`F`), then the second `.then()`
   (`E`). So: `C, F, E`.
3. **Task Queue (macrotasks):** only once the microtask queue is
   completely drained does the event loop take the next macrotask. Both
   `setTimeout(..., 0)` callbacks are already sitting in the task queue by
   this point; they run in the order they were scheduled: `B`, then `G`.

Full actual order: **A → D → H → C → F → E → B → G**.

## The difference between tasks (macrotasks) and microtasks

- **Microtasks** — Promise reactions (`.then`/`.catch`/`.finally`), the
  code that runs after an `await`, `queueMicrotask`. The **entire**
  microtask queue is drained before the event loop does anything else,
  including rendering or running the next macrotask.
- **Tasks (macrotasks)** — `setTimeout`/`setInterval` callbacks, I/O
  callbacks, UI events. Only **one** macrotask is taken per turn of the
  event loop, and only after the microtask queue is empty.

This is exactly why, in the event loop demo above, `C`, `F`, and `E`
(all microtasks) print before `B` and `G` (macrotasks) — even though both
`setTimeout` calls used a `0`ms delay and were scheduled *earlier in the
source code* than the second `.then()` and the `await` continuation.
"Microtasks always win" over same-tick macrotasks, regardless of source
order.

## How multiple Promises and errors are handled

Each task's `run()` returns a Promise that can `resolve` (task
"completed") or `reject` (task "failed") — this is simulated with a random
chance inside the `setTimeout` callback.

- **Individually:** `runSingleTask` wraps `await task.run()` in a
  `try/catch/finally`, so a rejected task never becomes an uncaught error —
  it just updates that task's card to show `failed` and re-enables its
  button in the `finally` block.
- **"Run All Tasks":** all three `runSingleTask(...)` calls (each already
  catching its own errors) are collected into an array and awaited with
  `Promise.all(...)`. Because every individual failure is already caught
  before it reaches `Promise.all`, none of them ever rejects the
  combined Promise — `Promise.all` always resolves once all three are
  *settled* (completed or failed), which is what lets the banner
  correctly report `"All tasks finished — X completed, Y failed"`
  instead of stopping early on the first failure.

## The difference between sequential and concurrent execution

Demonstrated directly in the "Single Counter vs Multiple Counters" panel,
using three dedicated tasks (`Check-in`, `Security`, `Boarding`):

```js
// Sequential — one counter open
for (const task of compareTasks) {
  await task.run();
}

// Concurrent — three counters open
await Promise.all(compareTasks.map((task) => task.run()));
```

**Sequential:** each `await` fully pauses the loop until that task's timer
finishes before the *next* task's `run()` is even called — so its total
time is roughly the **sum** of all three durations (measured in testing:
~3600ms for three ~1200ms tasks).

**Concurrent:** `.map()` calls `run()` on all three tasks *before* any
`await` happens, so all three `setTimeout` timers start counting down at
the same time. `Promise.all` then just waits for the slowest one to
finish — so its total time is roughly the duration of the **single
slowest task** (measured: ~1200ms for the same three tasks — about 3x
faster).

This is the practical payoff of understanding the event loop: whenever
independent async operations don't depend on each other's results,
starting them concurrently (`Promise.all`) instead of sequentially
(`await` in a loop) can make a real, measurable difference.