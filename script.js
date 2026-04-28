console.log("Calculator loaded!");

// Basic math functions
function add(a, b) {
    return a + b;
}

function subtract(a, b) {
    return a - b;
}

function multiply(a, b) {
    return a * b;
}

function divide(a, b) {
    if (b === 0) {
        return "Error: Cannot divide by zero!";
    }
    return a / b;
}

// Operate function
function operate(operator, num1, num2) {
    num1 = parseFloat(num1);
    num2 = parseFloat(num2);
    
    switch(operator) {
        case '+':
            return add(num1, num2);
        case '-':
            return subtract(num1, num2);
        case '×':
            return multiply(num1, num2);
        case '÷':
            return divide(num1, num2);
        default:
            return null;
    }
}

// Variables to store calculator state
let currentOperand = '0';
let previousOperand = '';
let operation = null;
let shouldResetScreen = false;

// DOM elements
const previousOperandElement = document.querySelector('.previous-operand');
const currentOperandElement = document.querySelector('.current-operand');
const numberButtons = document.querySelectorAll('.number');
const operatorButtons = document.querySelectorAll('.operator');
const equalsButton = document.querySelector('.equals');
const clearButton = document.querySelector('.clear');
const deleteButton = document.querySelector('.delete');
const decimalButton = document.querySelector('.decimal');

// Helper function to update display
function updateDisplay() {
    currentOperandElement.textContent = currentOperand;
    if (operation !== null && previousOperand !== '') {
        previousOperandElement.textContent = `${previousOperand} ${operation}`;
    } else {
        previousOperandElement.textContent = previousOperand;
    }
}

// Function to append number
function appendNumber(number) {
    if (shouldResetScreen) {
        currentOperand = '';
        shouldResetScreen = false;
    }
    
    // Prevent multiple leading zeros
    if (number === '0' && currentOperand === '0') return;
    
    // Limit length to prevent overflow
    if (currentOperand.length >= 12) return;
    
    currentOperand += number;
    updateDisplay();
}

// Function to add decimal point
function addDecimal() {
    if (shouldResetScreen) {
        currentOperand = '0';
        shouldResetScreen = false;
    }
    
    // Prevent multiple decimals
    if (currentOperand.includes('.')) return;
    
    // Add decimal point
    currentOperand += '.';
    updateDisplay();
}

// Function to clear everything
function clear() {
    currentOperand = '0';
    previousOperand = '';
    operation = null;
    shouldResetScreen = false;
    updateDisplay();
}

// Function to delete last digit
function deleteLast() {
    if (shouldResetScreen) return;
    
    if (currentOperand.length === 1 || (currentOperand.length === 2 && currentOperand.startsWith('-'))) {
        currentOperand = '0';
    } else {
        currentOperand = currentOperand.slice(0, -1);
    }
    updateDisplay();
}

// Function to choose operator
function chooseOperator(op) {
    // If there's already an operation in progress, evaluate it first
    if (operation !== null && !shouldResetScreen) {
        evaluate();
    }
    
    operation = op;
    previousOperand = currentOperand;
    shouldResetScreen = true;
    updateDisplay();
}

// Function to evaluate the expression
function evaluate() {
    if (operation === null || shouldResetScreen) return;
    
    const result = operate(operation, previousOperand, currentOperand);
    
    // Handle division by zero error
    if (typeof result === 'string') {
        currentOperand = result;
        operation = null;
        previousOperand = '';
        shouldResetScreen = true;
        updateDisplay();
        return;
    }
    
    // Round to avoid overflow
    const roundedResult = Math.round(result * 1000000) / 1000000;
    
    // Convert to string and limit length
    currentOperand = roundedResult.toString();
    if (currentOperand.length > 12) {
        currentOperand = currentOperand.slice(0, 12);
    }
    
    operation = null;
    previousOperand = '';
    shouldResetScreen = true;
    updateDisplay();
}

// Event Listeners
numberButtons.forEach(button => {
    button.addEventListener('click', () => {
        appendNumber(button.textContent);
    });
});

operatorButtons.forEach(button => {
    button.addEventListener('click', () => {
        chooseOperator(button.textContent);
    });
});

equalsButton.addEventListener('click', evaluate);
clearButton.addEventListener('click', clear);
deleteButton.addEventListener('click', deleteLast);
decimalButton.addEventListener('click', addDecimal);

// Keyboard support (Extra credit)
document.addEventListener('keydown', (e) => {
    // Numbers
    if (e.key >= 0 && e.key <= 9) {
        appendNumber(e.key);
    }
    
    // Operators
    if (e.key === '+') chooseOperator('+');
    if (e.key === '-') chooseOperator('-');
    if (e.key === '*') chooseOperator('×');
    if (e.key === '/') {
        e.preventDefault();
        chooseOperator('÷');
    }
    
    // Enter key for equals
    if (e.key === 'Enter' || e.key === '=') {
        e.preventDefault();
        evaluate();
    }
    
    // Backspace for delete
    if (e.key === 'Backspace') {
        deleteLast();
    }
    
    // Escape or Delete for clear
    if (e.key === 'Escape' || e.key === 'Delete') {
        clear();
    }
    
    // Decimal point
    if (e.key === '.') {
        addDecimal();
    }
});