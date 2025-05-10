class AstroCalc {
    constructor() {
        this.buttons = document.querySelectorAll('button');
        this.screenDisplay = document.querySelector('.screen');
        this.currentInput = [];
        this.calculationString = '';

        this.handleButtonClick = this.handleButtonClick.bind(this);
        this.handleKeyboardInput = this.handleKeyboardInput.bind(this);
    }

    init() {
        this.buttons.forEach(button => {
            button.addEventListener('click', this.handleButtonClick);
            button.setAttribute('tabindex', '0');
            button.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.handleButtonClick({ currentTarget: button });
                }
            });
        });
        document.addEventListener('keydown', this.handleKeyboardInput);
        this.clearDisplay();
    }

    handleButtonClick(event) {
        const button = event.currentTarget;
        const buttonValue = button.textContent;
        button.classList.add('active');
        setTimeout(() => button.classList.remove('active'), 100);
        this.processInput(buttonValue);
    }

    handleKeyboardInput(event) {
        const key = event.key;
        if (/^[0-9]$/.test(key) || ['+', '-', '*', '/', '.'].includes(key)) {
            event.preventDefault();
            this.processInput(key);
        } else if (key === 'Enter' || key === '=') {
            event.preventDefault();
            this.processInput('=');
        } else if (key === 'Escape' || key === 'c' || key === 'C') {
            event.preventDefault();
            this.processInput('C');
        } else if (key === 'Backspace') {
            event.preventDefault();
            this.backspace();
        }
    }

    processInput(value) {
        if (value === 'C') {
            this.clearDisplay();
        } else if (value === '=') {
            this.evaluateCalculation();
        } else {
            this.appendToCalculation(value);
        }
    }

    clearDisplay() {
        this.currentInput = [];
        this.calculationString = '';
        this.updateDisplay('0');
    }

    backspace() {
        if (this.currentInput.length > 0) {
            this.currentInput.pop();
            this.calculationString = this.currentInput.join('');
            this.updateDisplay(this.calculationString || '0');
        }
    }

    appendToCalculation(value) {
        const lastChar = this.currentInput.length > 0 ? this.currentInput[this.currentInput.length - 1] : '';
        if (value === '.' && lastChar.includes('.')) {
            return;
        }
        if (['+', '-', '*', '/'].includes(value) && ['+', '-', '*', '/'].includes(lastChar)) {
            this.currentInput.pop();
        }
        this.currentInput.push(value);
        this.calculationString = this.currentInput.join('');
        this.updateDisplay(this.calculationString);
    }

    evaluateCalculation() {
        if (this.currentInput.length === 0) return;
        try {
            if (!/^[0-9+\-*/.()]+$/.test(this.calculationString)) {
                throw new Error("Invalid characters in expression");
            }
            const result = parseFloat(new Function(`return ${this.calculationString}`)());
            if (!isFinite(result)) {
                throw new Error("Result is not a finite number");
            }
            const formattedResult = this.formatResult(result);
            this.updateDisplay(formattedResult);
            this.currentInput = [formattedResult.toString()];
            this.calculationString = formattedResult.toString();
        } catch (error) {
            this.updateDisplay('Error');
            this.currentInput = [];
            this.calculationString = '';
            setTimeout(() => this.updateDisplay('0'), 1500);
        }
    }

    formatResult(result) {
        if (Number.isInteger(result)) {
            return result.toString();
        }
        const resultString = result.toString();
        if (resultString.includes('e')) {
            return result.toPrecision(10);
        }
        if (resultString.length > 10) {
            return result.toPrecision(10);
        }
        return resultString;
    }

    updateDisplay(value) {
        this.screenDisplay.value = value;
    }

    initBackgroundAnimation() {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            document.body.classList.add('reduced-motion');
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const calculator = new AstroCalc();
    calculator.init();
    calculator.initBackgroundAnimation();
});