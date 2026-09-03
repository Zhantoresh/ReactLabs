/* ====================================================================
   JavaScript Refresher — Task 0
   All solutions are wrapped in IIFEs (Immediately Invoked Function
   Expressions) so that variables from one task don't leak into
   another task's scope.
==================================================================== */

/* ==================== TASK 1 — Variables and Data Types ==================== */
(() => {
  const name = "Diana";
  let age = 22;
  let isActive = true;
  const courses = ["React", "JavaScript", "CSS"];
  const address = { city: "Almaty", street: "Abay 10" };
  let middleName = null;
  let nickname;

  const sentence = `${name} is ${age} years old and is currently ${isActive ? "an active" : "an inactive"} student, taking ${courses.length} courses.`;

  const out = document.getElementById("task1-result");
  out.innerHTML = `
    <div class="line"><span class="k">name</span> = "${name}" (${typeof name})</div>
    <div class="line"><span class="k">age</span> = ${age} (${typeof age})</div>
    <div class="line"><span class="k">isActive</span> = ${isActive} (${typeof isActive})</div>
    <div class="line"><span class="k">courses</span> = [${courses.join(", ")}] (${typeof courses}, is array: ${Array.isArray(courses)})</div>
    <div class="line"><span class="k">address</span> = ${JSON.stringify(address)} (${typeof address})</div>
    <div class="line"><span class="k">middleName</span> = ${middleName} (${typeof middleName})</div>
    <div class="line"><span class="k">nickname</span> = ${nickname} (${typeof nickname})</div>
    <div class="line">— — —</div>
    <div class="line"><span class="k">Template literal:</span> ${sentence}</div>
  `;
})();

/* ==================== TASK 2 — Arrays ==================== */
(() => {
  const numbers = [3, 7, 2, 10, 5];
  const doubled = numbers.map(n => n * 2);
  const above5 = numbers.filter(n => n > 5);
  const firstAbove5 = numbers.find(n => n > 5);
  const sum = numbers.reduce((acc, n) => acc + n, 0);
  const has10 = numbers.includes(10);

  document.getElementById("task2-result").innerHTML = `
    <div class="line"><span class="k">original</span> = [${numbers.join(", ")}]</div>
    <div class="line"><span class="k">doubled</span> = [${doubled.join(", ")}]</div>
    <div class="line"><span class="k">above5</span> = [${above5.join(", ")}]</div>
    <div class="line"><span class="k">firstAbove5</span> = ${firstAbove5}</div>
    <div class="line"><span class="k">sum</span> = ${sum}</div>
    <div class="line"><span class="k">has10</span> = ${has10}</div>
    <div class="line">— — —</div>
    <div class="line"><span class="k">original after ops</span> = [${numbers.join(", ")}] (unchanged)</div>
  `;
})();

/* ==================== TASK 3 — Arrays of Objects ==================== */
(() => {
  const students = [
    { id: 1, name: "Anna", grade: 85 },
    { id: 2, name: "John", grade: 62 },
    { id: 3, name: "Sara", grade: 91 },
    { id: 4, name: "Mike", grade: 55 },
  ];

  const passed = students.filter(s => s.grade >= 70);
  const names = students.map(s => s.name);
  const studentById3 = students.find(s => s.id === 3);
  const topStudent = students.reduce((best, s) => (s.grade > best.grade ? s : best));
  const average = students.reduce((sum, s) => sum + s.grade, 0) / students.length;
  const withStatus = students.map(s => ({ ...s, passed: s.grade >= 70 }));

  document.getElementById("task3-result").innerHTML = `
    <div class="line"><span class="k">passed (grade ≥ 70)</span> = ${passed.map(s => s.name).join(", ")}</div>
    <div class="line"><span class="k">names</span> = [${names.join(", ")}]</div>
    <div class="line"><span class="k">student id=3</span> = ${JSON.stringify(studentById3)}</div>
    <div class="line"><span class="k">topStudent</span> = ${JSON.stringify(topStudent)}</div>
    <div class="line"><span class="k">average</span> = ${average.toFixed(2)}</div>
    <div class="line"><span class="k">withStatus</span>:</div>
    ${withStatus.map(s => `<div class="line">&nbsp;&nbsp;${s.name}: grade ${s.grade} → passed: ${s.passed}</div>`).join("")}
  `;
})();

/* ==================== TASK 4 — Objects ==================== */
(() => {
  const user = {
    id: 1,
    name: "Diana",
    age: 22,
    address: { city: "Almaty", street: "Abay 10" },
  };

  const readName = user.name;
  const readCity = user.address.city;

  user.age = 23;
  user.email = "diana@mail.com";
  delete user.address.street;

  const { name: userName, age } = user;
  const { address: { city } } = user;

  document.getElementById("task4-result").innerHTML = `
    <div class="line"><span class="k">read name</span> = ${readName}</div>
    <div class="line"><span class="k">read city</span> = ${readCity}</div>
    <div class="line"><span class="k">after changes</span> = ${JSON.stringify(user)}</div>
    <div class="line"><span class="k">destructured</span> → userName: ${userName}, age: ${age}</div>
    <div class="line"><span class="k">nested destructured city</span> = ${city}</div>
  `;
})();

/* ==================== TASK 5 — Values and References ==================== */
(() => {
  let original = { name: "Alice", score: 10 };
  let copy = original;
  copy.score = 99;
  const afterRefAssign = { original: { ...original }, copy: { ...copy } };

  let original2 = { name: "Alice", score: 10 };
  let properCopy = { ...original2 };
  properCopy.score = 50;
  const afterSpreadCopy = { original2: { ...original2 }, properCopy: { ...properCopy } };

  let user2 = { name: "Alice", address: { city: "Almaty" } };
  let shallowCopy = { ...user2 };
  shallowCopy.address.city = "Astana";
  const afterShallow = { user2City: user2.address.city, shallowCopyCity: shallowCopy.address.city };

  let user3 = { name: "Alice", address: { city: "Almaty" } };
  let deepCopy = { ...user3, address: { ...user3.address } };
  deepCopy.address.city = "Shymkent";
  const afterDeep = { user3City: user3.address.city, deepCopyCity: deepCopy.address.city };

  document.getElementById("task5-result").innerHTML = `
    <div class="line"><b>Direct assignment (copy = original):</b></div>
    <div class="line">&nbsp;&nbsp;original.score = ${afterRefAssign.original.score}, copy.score = ${afterRefAssign.copy.score} → both changed!</div>
    <div class="line"><b>Copy via spread { ...original }:</b></div>
    <div class="line">&nbsp;&nbsp;original2.score = ${afterSpreadCopy.original2.score}, properCopy.score = ${afterSpreadCopy.properCopy.score} → original stayed intact</div>
    <div class="line"><b>Spread with a nested object (shallow copy):</b></div>
    <div class="line">&nbsp;&nbsp;user2.address.city = ${afterShallow.user2City}, shallowCopy.address.city = ${afterShallow.shallowCopyCity} → nested object is shared!</div>
    <div class="line"><b>Correct deep copy of address:</b></div>
    <div class="line">&nbsp;&nbsp;user3.address.city = ${afterDeep.user3City}, deepCopy.address.city = ${afterDeep.deepCopyCity} → now independent</div>
  `;
})();

/* ==================== TASK 6 — Functions ==================== */
(() => {
  function isEven(number) { return number % 2 === 0; }
  const isEvenArrow = (number) => number % 2 === 0;
  function getFullName(firstName, lastName) { return `${firstName} ${lastName}`; }
  const calculatePrice = (price, quantity) => price * quantity;
  const calculateDiscount = (price, percent) => price - (price * percent) / 100;
  const getMax = (a, b) => (a > b ? a : b);

  document.getElementById("task6-result").innerHTML = `
    <div class="line"><span class="k">isEven(4)</span> = ${isEven(4)}, <span class="k">isEvenArrow(7)</span> = ${isEvenArrow(7)}</div>
    <div class="line"><span class="k">getFullName("Ann","Lee")</span> = ${getFullName("Ann", "Lee")}</div>
    <div class="line"><span class="k">calculatePrice(200, 3)</span> = ${calculatePrice(200, 3)}</div>
    <div class="line"><span class="k">calculateDiscount(200, 15)</span> = ${calculateDiscount(200, 15)}</div>
    <div class="line"><span class="k">getMax(4, 9)</span> = ${getMax(4, 9)}</div>
  `;
})();

/* ==================== TASK 7 — Functions as Values ==================== */
(() => {
  const add = (a, b) => a + b;
  const multiply = (a, b) => a * b;
  function calculate(a, b, operation) { return operation(a, b); }

  document.getElementById("task7-result").innerHTML = `
    <div class="line"><span class="k">calculate(5, 3, add)</span> = ${calculate(5, 3, add)}</div>
    <div class="line"><span class="k">calculate(5, 3, multiply)</span> = ${calculate(5, 3, multiply)}</div>
    <div class="line"><span class="k">typeof add</span> = ${typeof add} (this is the function itself)</div>
    <div class="line"><span class="k">typeof add(2,3)</span> = ${typeof add(2, 3)} (this is the result of calling it)</div>
  `;
})();

/* ==================== TASK 8 — Scope ==================== */
(() => {
  const message = "global";
  const log = [];

  function showScopes() {
    let message = "function";
    log.push(`inside the function: ${message}`);
    if (true) {
      let message = "block";
      log.push(`inside the if-block: ${message}`);
    }
    log.push(`after the block (back to function): ${message}`);
  }
  showScopes();
  log.push(`outside the function (global): ${message}`);

  let varResult, letError;
  if (true) {
    var varVal = "var value";
    let letVal = "let value";
    const constVal = "const value";
  }
  try { varResult = varVal; } catch (e) { varResult = "error"; }
  try { letError = letVal; } catch (e) { letError = "ReferenceError (not defined outside the block)"; }

  document.getElementById("task8-result").innerHTML = `
    ${log.map(l => `<div class="line">${l}</div>`).join("")}
    <div class="line">— — —</div>
    <div class="line"><span class="k">var outside the block</span> = "${varResult}" (accessible)</div>
    <div class="line"><span class="k">let outside the block</span> = ${letError}</div>
  `;
})();

/* ==================== TASK 9 — Closure ==================== */
(() => {
  function createCounter() {
    let count = 0;
    return function () {
      count += 1;
      return count;
    };
  }
  const counter = createCounter();
  const c1 = counter(), c2 = counter(), c3 = counter();
  const counter2 = createCounter();
  const c2first = counter2();

  function createAdder(value) {
    return function (num) { return num + value; };
  }
  const addFive = createAdder(5);

  document.getElementById("task9-result").innerHTML = `
    <div class="line"><span class="k">counter()</span> → ${c1}, ${c2}, ${c3}</div>
    <div class="line"><span class="k">counter2()</span> (new counter) → ${c2first} (its own independent count)</div>
    <div class="line"><span class="k">addFive(10)</span> = ${addFive(10)}</div>
    <div class="line"><span class="k">addFive(20)</span> = ${addFive(20)}</div>
  `;
})();

/* ==================== TASK 10 — Destructuring, Spread and Rest ==================== */
(() => {
  const numbers = [10, 20, 30, 40];
  const [first, second] = numbers;

  const user = { id: 1, name: "Anna", age: 21 };
  const { name, age } = user;

  const withNewNumber = [...numbers, 50];
  const olderUser = { ...user, age: 22 };
  const userWithEmail = { ...user, email: "anna@mail.com" };

  const arrA = [1, 2];
  const arrB = [3, 4];
  const combined = [...arrA, ...arrB];

  function sum(...nums) { return nums.reduce((acc, n) => acc + n, 0); }

  document.getElementById("task10-result").innerHTML = `
    <div class="line"><span class="k">first, second</span> = ${first}, ${second}</div>
    <div class="line"><span class="k">name, age</span> = ${name}, ${age}</div>
    <div class="line"><span class="k">withNewNumber</span> = [${withNewNumber.join(", ")}] (numbers unchanged: [${numbers.join(", ")}])</div>
    <div class="line"><span class="k">olderUser</span> = ${JSON.stringify(olderUser)}</div>
    <div class="line"><span class="k">userWithEmail</span> = ${JSON.stringify(userWithEmail)} (user unchanged)</div>
    <div class="line"><span class="k">combined</span> = [${combined.join(", ")}]</div>
    <div class="line"><span class="k">sum(1,2)</span> = ${sum(1, 2)}, <span class="k">sum(1,2,3,4)</span> = ${sum(1, 2, 3, 4)}</div>
  `;
})();

/* ==================== TASK 11 — Optional Chaining and Default Values ==================== */
(() => {
  const userWithAddress = { name: "Anna", address: { city: "Almaty" } };
  const userWithoutAddress = { name: "John" };

  const cityA = userWithAddress.address?.city;
  const cityB = userWithoutAddress.address?.city;

  const displayCityA = userWithAddress.address?.city ?? "City not specified";
  const displayCityB = userWithoutAddress.address?.city ?? "City not specified";

  const testValues = [0, "", false, null, undefined];
  const comparison = testValues.map(v => ({
    value: String(v),
    or: (v || "fallback"),
    nullish: (v ?? "fallback"),
  }));

  document.getElementById("task11-result").innerHTML = `
    <div class="line"><span class="k">cityA (optional chaining)</span> = ${cityA}</div>
    <div class="line"><span class="k">cityB (no address)</span> = ${cityB}</div>
    <div class="line"><span class="k">displayCityA (?? fallback)</span> = ${displayCityA}</div>
    <div class="line"><span class="k">displayCityB (?? fallback)</span> = ${displayCityB}</div>
    <div class="line">— — —</div>
    <table>
      <tr><th>value</th><th>value || "fallback"</th><th>value ?? "fallback"</th></tr>
      ${comparison.map(c => `<tr><td>${c.value}</td><td>${String(c.or)}</td><td>${String(c.nullish)}</td></tr>`).join("")}
    </table>
  `;
})();

/* ==================== FINAL TASK ==================== */
(() => {
  const students = [
    { id: 1, name: "Anna",  age: 20, grades: [85, 90, 78] },
    { id: 2, name: "John",  age: 21, grades: [60, 55, 65] },
    { id: 3, name: "Sara",  age: 22, grades: [91, 95, 89] },
    { id: 4, name: "Mike",  age: 20, grades: [50, 48, 60] },
    { id: 5, name: "Diana", age: 23, grades: [72, 80, 75] },
  ];

  const getAverage = (grades) => grades.reduce((sum, g) => sum + g, 0) / grades.length;
  const getStudentAverage = (student) => getAverage(student.grades);
  const getPassedStudents = (studentsArr) => studentsArr.filter(s => getStudentAverage(s) >= 60);
  const getStudentNames = (studentsArr) => studentsArr.map(s => s.name);
  const findStudent = (studentsArr, id) => studentsArr.find(s => s.id === id);
  const getTopStudent = (studentsArr) =>
    studentsArr.reduce((best, s) => (getStudentAverage(s) > getStudentAverage(best) ? s : best));

  const summary = students.map(s => ({
    id: s.id,
    name: s.name,
    average: Number(getStudentAverage(s).toFixed(1)),
    passed: getStudentAverage(s) >= 60,
  }));

  const passedNames = getStudentNames(getPassedStudents(students));
  const top = getTopStudent(students);
  const found = findStudent(students, 3);

  document.getElementById("final-result").innerHTML = `
    <div class="line"><span class="k">passed students</span> = ${passedNames.join(", ")}</div>
    <div class="line"><span class="k">top student</span> = ${top.name} (avg ${getStudentAverage(top).toFixed(1)})</div>
    <div class="line"><span class="k">findStudent(id=3)</span> = ${found.name}</div>
    <div class="line">— — —</div>
    <table>
      <tr><th>id</th><th>name</th><th>average</th><th>passed</th></tr>
      ${summary.map(s => `<tr><td>${s.id}</td><td>${s.name}</td><td>${s.average}</td><td>${s.passed}</td></tr>`).join("")}
    </table>
  `;
})();