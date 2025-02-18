const buttons = document.querySelectorAll("button");
const screenDisplay = document.querySelector(".screen");

let currentInput = [];
let calculationString = '';

function calculate(button) {
    const buttonValue = button.textContent;

    if (buttonValue === "C") {
        clearDisplay();
    } else if (buttonValue === "=") {
        evaluateCalculation();
    } else {
        appendToCalculation(buttonValue);
    }
}

function clearDisplay() {
    currentInput = [];
    calculationString = '';
    screenDisplay.value = '';
}

function appendToCalculation(value) {
    currentInput.push(value);
    calculationString = currentInput.join('');
    screenDisplay.value = calculationString;
}

function evaluateCalculation() {
    try {
        const result = new Function(`return ${calculationString}`)();
        screenDisplay.value = result;
        currentInput = [result.toString()];
    } catch (error) {
        screenDisplay.value = "Error";
        currentInput = [];
    }
}

buttons.forEach(button => button.addEventListener("click", () => calculate(button)));

let posX = 0, posY = 0;
function moveBackground() {
    posX += 0.01;
    posY += 0.01;
    document.body.style.backgroundPosition = `${posX}px ${posY}px`;
    requestAnimationFrame(moveBackground);
}
moveBackground();