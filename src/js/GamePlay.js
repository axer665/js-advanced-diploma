import { calcHealthLevel, calcTileType } from './utils';

export default class GamePlay {
    constructor() {
        this.boardSize = 8;
        this.container = null;
        this.boardEl = null;
        this.cells = [];
        this.cellClickListeners = [];
        this.cellEnterListeners = [];
        this.cellLeaveListeners = [];
        this.newGameListeners = [];
        this.saveGameListeners = [];
        this.loadGameListeners = [];
        this.score = 0;
        this.level = 0;
        this.recordScore = 0;
    }

    bindToDOM(container) {
        if (!(container instanceof HTMLElement)) {
            throw new Error('container is not HTMLElement');
        }
        this.container = container;
    }

    /**
     * Draws boardEl with specific theme
     *
     * @param theme
     */
    drawUi(theme) {
        this.checkBinding();

        this.container.innerHTML = `
            <div class="message-container"></div>
            <div class="controls">
                <div class="buttons">
                    <button data-id="action-restart" class="btn">New Game</button>
                    <button data-id="action-save" class="btn">Save Game</button>
                    <button data-id="action-load" class="btn">Load Game</button>
                </div>
                <div class="score">
                    <div class="score-level">
                        Ваш уровень: ${this.level} 
                    </div>
                    <div class="score-current">
                        Ваши очки: ${Math.floor(this.score)} 
                    </div>
                    <div class="score-record">
                        Текущий рекорд: ${Math.floor(this.recordScore)}
                    </div>
                </div>
            </div>
            
            <div class="board-container">
                <div data-id="board" class="board"></div>
            </div>
        `;

        this.newGameEl = this.container.querySelector('[data-id=action-restart]');
        this.saveGameEl = this.container.querySelector('[data-id=action-save]');
        this.loadGameEl = this.container.querySelector('[data-id=action-load]');

        this.newGameEl.addEventListener('click', (event) => this.onNewGameClick(event));
        this.saveGameEl.addEventListener('click', (event) => this.onSaveGameClick(event));
        this.loadGameEl.addEventListener('click', (event) => this.onLoadGameClick(event));

        this.boardEl = this.container.querySelector('[data-id=board]');

        this.boardEl.classList.add(theme);
        this.boardEl.style.setProperty('--grid-columns', this.boardSize);
        for (let i = 0; i < this.boardSize ** 2; i += 1) {
            const cellEl = document.createElement('div');
            cellEl.classList.add('cell', 'map-tile', `map-tile-${calcTileType(i, this.boardSize)}`);
            cellEl.addEventListener('mouseenter', (event) => this.onCellEnter(event));
            cellEl.addEventListener('mouseleave', (event) => this.onCellLeave(event));
            cellEl.addEventListener('click', (event) => this.onCellClick(event));
            this.boardEl.appendChild(cellEl);
        }

        this.cells = Array.from(this.boardEl.children);
    }

    /**
     * Draws positions (with chars) on boardEl
     *
     * @param positions array of PositionedCharacter objects
     */
    redrawPositions(positions) {
        /* eslint-disable no-restricted-syntax */
        for (const cell of this.cells) {
            cell.innerHTML = '';
        }
        /* eslint-disable no-restricted-syntax */
        for (const position of positions) {
            const cellEl = this.boardEl.children[position.position];
            const charEl = document.createElement('div');
            charEl.classList.add('character', position.character.type);

            const healthEl = document.createElement('div');
            healthEl.classList.add('health-level');

            const healthIndicatorEl = document.createElement('div');
            healthIndicatorEl.classList.add(
                'health-level-indicator',
                `health-level-indicator-${calcHealthLevel(position.character.health)}`,
            );
            healthIndicatorEl.style.width = `${position.character.health}%`;
            healthEl.appendChild(healthIndicatorEl);

            charEl.appendChild(healthEl);
            cellEl.appendChild(charEl);

            document.querySelector('.score')
                .innerHTML = `
                    <div class="score-level">
                        Ваш уровень: ${this.level} 
                    </div>
                    <div class="score-current">
                        Ваши очки: ${Math.floor(this.score)} 
                    </div>
                    <div class="score-record">
                        Текущий рекорд: ${Math.floor(this.recordScore)}
                    </div>
                `;
        }
    }

    /**
     * Add listener to mouse enter for cell
     *
     * @param callback
     */
    addCellEnterListener(callback) {
        this.cellEnterListeners.push(callback);
    }

    /**
     * Add listener to mouse leave for cell
     *
     * @param callback
     */
    addCellLeaveListener(callback) {
        this.cellLeaveListeners.push(callback);
    }

    /**
     * Add listener to mouse click for cell
     *
     * @param callback
     */
    addCellClickListener(callback) {
        this.cellClickListeners.push(callback);
    }

    removeAllCellListeners() {
        this.cellEnterListeners = [];
        this.cellLeaveListeners = [];
        this.cellClickListeners = [];
    }

    /**
     * Add listener to "New Game" button click
     *
     * @param callback
     */
    addNewGameListener(callback) {
        this.newGameListeners.push(callback);
    }

    /**
     * Add listener to "Save Game" button click
     *
     * @param callback
     */
    addSaveGameListener(callback) {
        this.saveGameListeners.push(callback);
    }

    /**
     * Add listener to "Load Game" button click
     *
     * @param callback
     */
    addLoadGameListener(callback) {
        this.loadGameListeners.push(callback);
    }

    onCellEnter(event) {
        event.preventDefault();
        const index = this.cells.indexOf(event.currentTarget);
        this.cellEnterListeners.forEach((o) => o.call(null, index));
    }

    onCellLeave(event) {
        event.preventDefault();
        const index = this.cells.indexOf(event.currentTarget);
        this.cellLeaveListeners.forEach((o) => o.call(null, index));
    }

    onCellClick(event) {
        const index = this.cells.indexOf(event.currentTarget);
        this.cellClickListeners.forEach((o) => o.call(null, index));
    }

    onNewGameClick(event) {
        event.preventDefault();
        this.newGameListeners.forEach((o) => o.call(null));
    }

    onSaveGameClick(event) {
        event.preventDefault();
        this.saveGameListeners.forEach((o) => o.call(null));
    }

    onLoadGameClick(event) {
        event.preventDefault();
        this.loadGameListeners.forEach((o) => o.call(null));
    }

    static showError(message) {
    // eslint-disable-next-line no-alert
        alert(message);
    }

    static showMessage(message) {
    // eslint-disable-next-line no-alert
        alert(message);
    }

    selectCell(index, color = 'yellow') {
        this.deselectCell(index);
        this.cells[index].classList.add('selected', `selected-${color}`);
    }

    deselectCell(index) {
        const cell = this.cells[index];
        cell.classList.remove(...Array.from(cell.classList)
            .filter((o) => o.startsWith('selected')));
    }

    deselectAllCells() {
        this.cells.forEach((cell) => {
            cell.classList.remove(...Array.from(cell.classList)
                .filter((o) => o.startsWith('selected')));
        });
    }

    showCellTooltip(positionedCharacter) {
        const char = positionedCharacter.character;
        this.cells[positionedCharacter.position]
            .title = `${char.type}\n\u{1F396}${char.level}\u{2694}${char.attack}\u{1F6E1}${char.defence}\u{2764}${char.health}`;
    }

    hideCellTooltip(index) {
        this.cells[index].title = '';
    }

    showDamage(index, damage) {
        return new Promise((resolve) => {
            const cell = this.cells[index];
            const damageEl = document.createElement('span');
            damageEl.textContent = damage;
            damageEl.classList.add('damage');
            cell.appendChild(damageEl);

            damageEl.addEventListener('animationend', () => {
                cell.removeChild(damageEl);
                resolve();
            });
        });
    }

    setCursor(cursor) {
        this.boardEl.style.cursor = cursor;
    }

    checkBinding() {
        if (this.container === null) {
            throw new Error('GamePlay not bind to DOM');
        }
    }

    showModalMessage(message, type = 'info') {
        const messageContainer = this.container.querySelector('.message-container');
        if (messageContainer) {
            const messageBox = document.createElement('div');
            messageBox.classList.add('messagebox');
            messageBox.textContent = message;
            switch (type) {
                case 'info':
                    messageBox.classList.add('info');
                    break;
                case 'error':
                    messageBox.classList.add('error');
                    break;
                default:
                    break;
            }
            messageContainer.appendChild(messageBox);
            setTimeout(() => {
                messageBox.remove();
            }, 5000);
        }
    }
}
