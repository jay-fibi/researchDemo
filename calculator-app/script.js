class Calculator {
    // Constants
    static MAX_HISTORY_LENGTH = 50;
    static WATER_DROPLETS_COUNT = 5;
    static DROPLET_ANIMATION_DELAY = 50;
    static DROPLET_LIFETIME = 1500;
    static ERROR_DISPLAY_DURATION = 2000;
    static FADE_ANIMATION_DELAY = 10;

    static OPERATION_SYMBOLS = {
        add: '+',
        subtract: '−',
        multiply: '×',
        divide: '÷'
    };

    static KEYBOARD_OPERATIONS = {
        '+': 'add',
        '-': 'subtract',
        '*': 'multiply',
        '/': 'divide'
    };

    constructor() {
        this.current = '0';
        this.previous = '';
        this.operation = null;
        this.history = [];
        this.shouldResetDisplay = false;
        this.historyVisible = false;

        this.display = document.getElementById('current');
        this.historyDisplay = document.getElementById('history');
        this.historyPanel = document.getElementById('history-panel');
        this.historyList = document.getElementById('history-list');

        this.init();
        this.loadFromStorage();
    }

    init() {
        // Button event listeners
        document.querySelectorAll('.btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const action = e.target.dataset.action;
                const number = e.target.dataset.number;

                if (number !== undefined) {
                    this.appendNumber(number);
                } else if (action) {
                    this.handleAction(action);
                }
            });
        });

        // Theme toggle
        document.getElementById('theme-toggle').addEventListener('click', () => {
            this.toggleTheme();
        });

        // Clear history
        document.getElementById('clear-history').addEventListener('click', () => {
            this.clearHistory();
        });

        // Keyboard support
        document.addEventListener('keydown', (e) => {
            this.handleKeyboard(e);
        });

        // History panel toggle (double click on display)
        this.display.addEventListener('dblclick', () => {
            this.toggleHistoryPanel();
        });

        // Click outside to close history
        document.addEventListener('click', (e) => {
            if (!this.historyPanel.contains(e.target) && !this.display.contains(e.target)) {
                this.historyPanel.classList.remove('show');
                this.historyVisible = false;
            }
        });
    }

    appendNumber(number) {
        if (!this.isValidNumberInput(number)) {
            return;
        }

        // Add water splash effect for number buttons
        this.createWaterSplash();

        if (this.shouldResetDisplay) {
            this.current = number;
            this.shouldResetDisplay = false;
        } else if (this.current === '0' && number !== '.') {
            this.current = number;
        } else if (!this.wouldCreateInvalidDecimal(number)) {
            this.current += number;
        }

        this.updateDisplay();
    }

    isValidNumberInput(number) {
        return typeof number === 'string' && (/^[0-9]$/.test(number) || number === '.');
    }

    /**
     * Checks if appending a decimal point would create an invalid number
     * @param {string} number - The number input to validate
     * @returns {boolean} True if it would create an invalid decimal
     */
    wouldCreateInvalidDecimal(number) {
        return number === '.' && this.current.includes('.');
    }

    handleAction(action) {
        // Add water splash effect
        this.createWaterSplash();

        switch (action) {
            case 'clear':
                this.clear();
                break;
            case 'clear-all':
                this.clearAll();
                break;
            case 'backspace':
                this.backspace();
                break;
            case 'add':
            case 'subtract':
            case 'multiply':
            case 'divide':
                this.chooseOperation(action);
                break;
            case 'calculate':
                this.calculate();
                break;
        }
    }

    clear() {
        this.current = '0';
        this.updateDisplay();
    }

    clearAll() {
        this.current = '0';
        this.previous = '';
        this.operation = null;
        this.historyDisplay.textContent = '';
        this.updateDisplay();
    }

    backspace() {
        if (this.current.length > 1) {
            this.current = this.current.slice(0, -1);
        } else {
            this.current = '0';
        }
        this.updateDisplay();
    }

    /**
     * Sets the current operation and prepares for the next number input
     * @param {string} operation - The operation to perform (add, subtract, multiply, divide)
     */
    chooseOperation(operation) {
        if (this.current === '0') return;

        if (this.previous !== '') {
            this.calculate();
        }

        this.operation = operation;
        this.previous = this.current;
        this.shouldResetDisplay = true;

        this.historyDisplay.textContent = `${this.formatNumber(this.previous)} ${Calculator.OPERATION_SYMBOLS[operation]}`;
    }

    /**
     * Performs the calculation based on the current operation and updates the display
     */
    calculate() {
        let result;
        const prev = parseFloat(this.previous);
        const current = parseFloat(this.current);

        if (isNaN(prev) || isNaN(current)) return;

        switch (this.operation) {
            case 'add':
                result = prev + current;
                break;
            case 'subtract':
                result = prev - current;
                break;
            case 'multiply':
                result = prev * current;
                break;
            case 'divide':
                if (current === 0) {
                    this.showError('Cannot divide by zero');
                    return;
                }
                result = prev / current;
                break;
            default:
                return;
        }

        // Add to history
        const historyEntry = {
            expression: `${this.formatNumber(this.previous)} ${Calculator.OPERATION_SYMBOLS[this.operation]} ${this.formatNumber(this.current)}`,
            result: result,
            timestamp: new Date().toLocaleTimeString()
        };

        this.history.unshift(historyEntry);
        if (this.history.length > Calculator.MAX_HISTORY_LENGTH) {
            this.history = this.history.slice(0, Calculator.MAX_HISTORY_LENGTH);
        }

        this.saveToStorage();
        this.updateHistoryDisplay();

        this.current = result.toString();
        this.operation = null;
        this.previous = '';
        this.shouldResetDisplay = true;
        this.historyDisplay.textContent = '';
        this.updateDisplay();
    }

    /**
     * Formats a number for display with proper thousand separators
     * @param {number|string} number - The number to format
     * @returns {string} The formatted number string
     */
    formatNumber(number) {
        if (number === null || number === undefined) return '0';

        const stringNumber = number.toString();
        const [integerPart, decimalPart] = stringNumber.split('.');

        let integerDisplay;
        const integerDigits = parseFloat(integerPart);

        if (isNaN(integerDigits)) {
            integerDisplay = '';
        } else {
            integerDisplay = integerDigits.toLocaleString('en', {
                maximumFractionDigits: 0
            });
        }

        return decimalPart != null ? `${integerDisplay}.${decimalPart}` : integerDisplay;
    }

    /**
     * Updates the display with the current value and applies fade-in animation
     */
    updateDisplay() {
        this.display.textContent = this.formatNumber(this.current);

        // Add fade-in animation
        this.display.style.animation = 'none';
        setTimeout(() => {
            this.display.style.animation = 'fadeIn 0.3s ease';
        }, Calculator.FADE_ANIMATION_DELAY);
    }

    /**
     * Displays an error message for a specified duration
     * @param {string} message - The error message to display
     */
    showError(message) {
        this.display.textContent = message;
        this.display.style.color = 'var(--btn-clear)';
        setTimeout(() => {
            this.display.style.color = 'var(--text-primary)';
            this.clearAll();
        }, Calculator.ERROR_DISPLAY_DURATION);
    }

    /**
     * Handles keyboard input for calculator operations
     * @param {KeyboardEvent} e - The keyboard event
     */
    handleKeyboard(e) {
        if (e.key >= '0' && e.key <= '9') {
            this.appendNumber(e.key);
        } else if (e.key === '.') {
            this.appendNumber('.');
        } else if (e.key === 'Enter' || e.key === '=') {
            this.calculate();
        } else if (e.key === 'Backspace') {
            this.backspace();
        } else if (e.key === 'Escape') {
            this.clearAll();
        } else if (e.key === 'c' || e.key === 'C') {
            this.clear();
        } else if (Calculator.KEYBOARD_OPERATIONS[e.key]) {
            this.chooseOperation(Calculator.KEYBOARD_OPERATIONS[e.key]);
        }
    }

    toggleTheme() {
        const html = document.documentElement;
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('calculator-theme', newTheme);
    }

    toggleHistoryPanel() {
        this.historyVisible = !this.historyVisible;
        if (this.historyVisible) {
            this.historyPanel.classList.add('show');
            this.updateHistoryDisplay();
        } else {
            this.historyPanel.classList.remove('show');
        }
    }

    updateHistoryDisplay() {
        this.historyList.innerHTML = '';

        if (this.history.length === 0) {
            this.historyList.innerHTML = '<div class="history-item">No history yet</div>';
            return;
        }

        this.history.forEach((entry, index) => {
            const historyItem = document.createElement('div');
            historyItem.className = 'history-item';
            historyItem.innerHTML = `
                <span>${entry.expression} = ${this.formatNumber(entry.result)}</span>
                <small>${entry.timestamp}</small>
            `;

            historyItem.addEventListener('click', () => {
                this.current = entry.result.toString();
                this.updateDisplay();
                this.historyPanel.classList.remove('show');
                this.historyVisible = false;
            });

            this.historyList.appendChild(historyItem);
        });
    }

    clearHistory() {
        this.history = [];
        this.saveToStorage();
        this.updateHistoryDisplay();
    }

    /**
     * Saves the current history to localStorage with error handling
     */
    saveToStorage() {
        try {
            localStorage.setItem('calculator-history', JSON.stringify(this.history));
        } catch (error) {
            console.warn('Failed to save calculator history to localStorage:', error);
        }
    }

    /**
     * Creates a water splash effect with multiple droplets
     */
    createWaterSplash() {
        // Create multiple water droplets for splash effect
        for (let i = 0; i < Calculator.WATER_DROPLETS_COUNT; i++) {
            setTimeout(() => {
                this.createDroplet();
            }, i * Calculator.DROPLET_ANIMATION_DELAY);
        }
    }

    /**
     * Creates a single water droplet with random properties
     */
    createDroplet() {
        const droplet = document.createElement('div');
        droplet.className = 'water-droplet';

        // Random position around the calculator
        const angle = Math.random() * Math.PI * 2;
        const distance = 100 + Math.random() * 150;
        const x = Math.cos(angle) * distance;
        const y = Math.sin(angle) * distance;

        droplet.style.left = `calc(50% + ${x}px)`;
        droplet.style.top = `calc(50% + ${y}px)`;

        // Random size and animation duration
        const size = 4 + Math.random() * 8;
        droplet.style.width = `${size}px`;
        droplet.style.height = `${size}px`;
        droplet.style.animationDuration = `${0.5 + Math.random() * 1}s`;

        document.body.appendChild(droplet);

        // Remove droplet after animation
        setTimeout(() => {
            if (droplet.parentNode) {
                droplet.parentNode.removeChild(droplet);
            }
        }, Calculator.DROPLET_LIFETIME);
    }

    /**
     * Loads calculator state from localStorage with error handling
     */
    loadFromStorage() {
        try {
            // Load theme
            const savedTheme = localStorage.getItem('calculator-theme');
            if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
                document.documentElement.setAttribute('data-theme', savedTheme);
            } else {
                document.documentElement.setAttribute('data-theme', 'light');
            }

            // Load history
            const savedHistory = localStorage.getItem('calculator-history');
            if (savedHistory) {
                const parsedHistory = JSON.parse(savedHistory);
                if (Array.isArray(parsedHistory)) {
                    // Validate and filter history entries
                    this.history = parsedHistory.filter(entry =>
                        entry &&
                        typeof entry.expression === 'string' &&
                        typeof entry.result === 'number' &&
                        typeof entry.timestamp === 'string'
                    ).slice(0, Calculator.MAX_HISTORY_LENGTH);
                }
            }
        } catch (error) {
            console.warn('Failed to load calculator data from localStorage:', error);
            // Reset to defaults if loading fails
            document.documentElement.setAttribute('data-theme', 'light');
            this.history = [];
        }
    }
}

// Initialize calculator when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new Calculator();
});
