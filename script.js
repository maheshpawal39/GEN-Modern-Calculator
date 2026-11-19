// ============================================================
// GEN Modern Calculator — script.js
// This file contains all the logic that makes the calculator work.
// ============================================================

// Get the two parts of the display we need to change.
const currentDisplay = document.getElementById("current-display");
const previousDisplay = document.getElementById("previous-display");

// These variables remember what the user is doing.
let currentInput = "";      // The number the user is typing right now
let previousInput = "";     // The first number in a calculation
let operation = null;       // The chosen operator (+, -, ×, ÷)
let justEvaluated = false;  // True right after pressing "="

// ------------------------------------------------------------
// Display helpers
// ------------------------------------------------------------

// Put the right text onto the screen.
function updateDisplay() {
  // Show the first number and the operator on the small top line.
  if (operation === null) {
    previousDisplay.textContent = "";
  } else {
    previousDisplay.textContent = previousInput + " " + operation;
  }

  // Show the number being typed on the big bottom line (or "0").
  if (currentInput === "") {
    currentDisplay.textContent = "0";
  } else {
    currentDisplay.textContent = currentInput;
  }
}

// Turn a messy number like 0.30000000000000004 into a clean "0.3".
function formatResult(number) {
  if (Number.isInteger(number)) {
    return String(number);
  }
  return String(parseFloat(number.toFixed(10)));
}

// Show an error on screen and reset the calculator.
function showError() {
  previousDisplay.textContent = "";
  currentDisplay.textContent = "Error";
  currentInput = "";
  previousInput = "";
  operation = null;
  justEvaluated = true;
}

// ------------------------------------------------------------
// Number buttons
// ------------------------------------------------------------

// Add a digit (0-9) to the end of the current number.
function appendNumber(number) {
  // After "=", typing a number starts a fresh calculation.
  if (justEvaluated) {
    currentInput = "";
    justEvaluated = false;
  }

  // Replace a leading "0" instead of building something like "05".
  if (currentInput === "0") {
    currentInput = number;
  } else {
    currentInput = currentInput + number;
  }

  updateDisplay();
}

// Add a decimal point to the current number.
function appendDecimal() {
  // After "=", start a new number.
  if (justEvaluated) {
    currentInput = "0";
    justEvaluated = false;
  }

  // If nothing is typed yet, begin with "0".
  if (currentInput === "") {
    currentInput = "0";
  }

  // Only add a dot if there is not already one.
  if (currentInput.includes(".") === false) {
    currentInput = currentInput + ".";
  }

  updateDisplay();
}

// ------------------------------------------------------------
// Operator and function buttons
// ------------------------------------------------------------

// Remember an operator so we can calculate later.
function chooseOperator(op) {
  // If the user has not typed anything yet, ignore the operator.
  if (currentInput === "" && previousInput === "") {
    return;
  }

  // If two numbers are already waiting, calculate them first (chaining).
  if (currentInput !== "" && previousInput !== "" && operation !== null) {
    calculate();
  }

  // Move the current number into the "first number" slot.
  if (currentInput !== "") {
    previousInput = currentInput;
  }

  operation = op;
  currentInput = "";
  updateDisplay();
}

// Do the actual math when "=" is pressed.
function calculate() {
  // We need both numbers and an operator before we can calculate.
  if (currentInput === "" || previousInput === "" || operation === null) {
    return;
  }

  // Convert the text into real numbers.
  const first = parseFloat(previousInput);
  const second = parseFloat(currentInput);
  let result;

  // Perform the chosen operation using simple if/else checks.
  if (operation === "+") {
    result = first + second;
  } else if (operation === "-") {
    result = first - second;
  } else if (operation === "×") {
    result = first * second;
  } else if (operation === "÷") {
    // Division by zero is not allowed.
    if (second === 0) {
      showError();
      return;
    }
    result = first / second;
  } else {
    return;
  }

  // Store the result and keep it ready for the next calculation.
  currentInput = formatResult(result);
  previousInput = "";
  operation = null;
  justEvaluated = true;
  updateDisplay();
}

// Reset everything back to the start (AC button).
function clearAll() {
  currentInput = "";
  previousInput = "";
  operation = null;
  justEvaluated = false;
  updateDisplay();
}

// Remove the last typed character (DEL button).
function deleteLast() {
  // Do not let the user delete a result they just calculated.
  if (justEvaluated) {
    return;
  }

  // Remove the final character of the current number.
  currentInput = currentInput.slice(0, -1);
  updateDisplay();
}

// Divide the current number by 100 (% button).
function percent() {
  if (currentInput === "") {
    return;
  }

  const value = parseFloat(currentInput) / 100;
  currentInput = formatResult(value);
  updateDisplay();
}

// Flip the current number between negative and positive (+/- button).
function toggleSign() {
  // Nothing to change if there is no number (or it is just "0").
  if (currentInput === "" || currentInput === "0") {
    return;
  }

  // If it starts with "-", remove it; otherwise add one.
  if (currentInput.charAt(0) === "-") {
    currentInput = currentInput.slice(1);
  } else {
    currentInput = "-" + currentInput;
  }

  updateDisplay();
}

// ------------------------------------------------------------
// Connect the buttons to their actions
// ------------------------------------------------------------

// Every digit button has a data-number attribute, e.g. data-number="7".
const numberButtons = document.querySelectorAll("[data-number]");

numberButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    appendNumber(button.dataset.number);
  });
});

// Every other button has a data-action attribute, e.g. data-action="add".
const actionButtons = document.querySelectorAll("[data-action]");

actionButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    handleAction(button.dataset.action);
  });
});

// Decide what to do for each kind of action.
function handleAction(action) {
  if (action === "clear") {
    clearAll();
  } else if (action === "delete") {
    deleteLast();
  } else if (action === "percent") {
    percent();
  } else if (action === "sign") {
    toggleSign();
  } else if (action === "equals") {
    calculate();
  } else if (action === "add") {
    chooseOperator("+");
  } else if (action === "subtract") {
    chooseOperator("-");
  } else if (action === "multiply") {
    chooseOperator("×");
  } else if (action === "divide") {
    chooseOperator("÷");
  } else if (action === "decimal") {
    appendDecimal();
  }
}

// Show the starting "0" when the page loads.
updateDisplay();
