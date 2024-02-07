import themes from './themes';
import PositionedCharacter from './PositionedCharacter';
import cursors from './cursors';
import setActiveCharacter from './setActiveCharacter';
import aiTurn from './aiTurn';
import { generateTeam } from './generators';
import GameState from './GameState';

import Bowman from './characters/Bowman';
import Daemon from './characters/Daemon';
import Magician from './characters/Magician';
import Swordsman from './characters/Swordsman';
import Undead from './characters/Undead';
import Zombie from './characters/Zombie';

export default class GameController {
    constructor(gamePlay, stateService) {
        this.gamePlay = gamePlay;
        this.stateService = stateService;

        this.userTypeCharacters = [Bowman, Swordsman, Magician];
        this.enemyTypeCharacters = [Undead, Daemon, Zombie];
        this.activeCharacter = undefined;
        this.characterCount = 2;
    }

    newGame() {
        this.gamePlay.removeAllCellListeners();
        this.gamePlay.level = 0;
        this.characterCount = 2;
        this.gamePlay.score = 0;
        this.nextLevel();
        
        this.gamePlay.addCellEnterListener((index) => {
            this.onCellEnter(index);
        });
        this.gamePlay.addCellLeaveListener((index) => {
            this.onCellLeave(index);
        });
        this.gamePlay.addCellClickListener((index) => {
            this.onCellClick(index);
        });
    }

    init() {
        // TODO: add event listeners to gamePlay events
        // TODO: load saved stated from stateService
        this.gamePlay.recordScore = this.stateService.loadRecord();

        this.newGame();

        this.gamePlay.addNewGameListener(() => {
            this.newGame();
            this.gamePlay.showModalMessage('Новая игра загружена');
        });

        this.gamePlay.addSaveGameListener(() => {
            const state = {
                level: this.gamePlay.level,
                boardSize: this.gamePlay.boardSize,
                userPositionedCharacters: this.userPositionedCharacters,
                enemyPositionedCharacters: this.enemyPositionedCharacters,
                score: this.gamePlay.score,
            };
            this.stateService.save(state);
            this.gamePlay.showModalMessage('Игра сохранена');
        });

        this.gamePlay.addLoadGameListener(() => {
            new GameState(this).from(this.stateService.load());
            this.gamePlay.showModalMessage('Игра загружена');
        });
    }

    onCellClick(index) {
        // Реакция при нажатии на ячейку
        let userSelectedCharacter = this.userPositionedCharacters.find((character) => character.position === index);

        if (userSelectedCharacter) { // в ячейке находится персонаж пользователя
            if (this.activeCharacter?.position === index) {
                this.gamePlay.deselectCell(index);
                this.activeCharacter = undefined;
            } else {
                this.gamePlay.deselectAllCells();
                this.gamePlay.selectCell(index);
                this.activeCharacter = setActiveCharacter(userSelectedCharacter, this.gamePlay.boardSize);
            }
            return;
        }

        const enemyPositionedCharacter = this.enemyPositionedCharacters.find((character) => character.position === index);

        if (enemyPositionedCharacter) { // в ячейке находится персонаж противника
            if (this.activeCharacter) {
                if (this.activeCharacter.attack.includes(index)) { // атакуем противника
                    const attacker = this.activeCharacter.character.attack;
                    const damage = Math.floor(Math.max(attacker
                        - enemyPositionedCharacter.character.defence, attacker * 0.1));
                    this.gamePlay.showDamage(index, damage).then(() => {
                        enemyPositionedCharacter.character.health -= damage;
                        this.gamePlay.score += damage; // отображаем нанесенный урон

                        if (enemyPositionedCharacter.character.health <= 0) { // противник не выжил после удара
                            this.gamePlay.score += enemyPositionedCharacter.character.defence;
                            this.activeCharacter.character.levelUp(); // повышаем уровень нашего бойца
                            this.enemyPositionedCharacters.splice(this.enemyPositionedCharacters.indexOf(enemyPositionedCharacter), 1); // минусим погибшего из общего списка

                            if (!this.enemyPositionedCharacters.length) { // если добили уже всех
                                this.nextLevel(); // переходим на новый уровень
                                return;
                            }
                        }
                        // рендерим персонажей на новых позициях
                        this.gamePlay.redrawPositions([
                            ...this.userPositionedCharacters,
                            ...this.enemyPositionedCharacters,
                        ]);
                        // передаем ход компьютеру
                        aiTurn(enemyPositionedCharacter, this);
                    });
                } else {
                    this.gamePlay.showModalMessage('Выбраный персонаж не может атаковать указанного противника', 'error');
                }
            }
            return;
        }

        if (this.activeCharacter?.move.includes(index)) {
            this.gamePlay.deselectCell(this.activeCharacter.position);
            userSelectedCharacter = this.userPositionedCharacters
                .find((positionedCharacter) => positionedCharacter.position === this.activeCharacter.position);
            userSelectedCharacter.position = index;
            this.gamePlay.redrawPositions([
                ...this.userPositionedCharacters,
                ...this.enemyPositionedCharacters]);
            this.activeCharacter = setActiveCharacter(userSelectedCharacter, this.gamePlay.boardSize);
            this.gamePlay.selectCell(index);

            const randomIndex = Math.floor(Math.random() * this.enemyPositionedCharacters.length);
            aiTurn(this.enemyPositionedCharacters[randomIndex], this);
        } else if (this.activeCharacter) {
            this.gamePlay.showModalMessage('Выбраный персонаж не может переместиться в указанную зону', 'error');
        }
    }

    onCellEnter(index) {
        // Реакция при наведении курсра на ячейку
        const enemyPositionedCharacter = this.enemyPositionedCharacters.find((character) => character.position === index);
        const userPositionedCharacter = this.userPositionedCharacters.find((character) => character.position === index);

        if (this.activeCharacter) {
            this.gamePlay.deselectAllCells();
            this.gamePlay.selectCell(this.activeCharacter.position);

            if (enemyPositionedCharacter && this.activeCharacter.attack.includes(index)) {
                this.gamePlay.setCursor(cursors.crosshair);
                this.gamePlay.selectCell(index, 'red');
            } else if (userPositionedCharacter) {
                this.gamePlay.setCursor(cursors.pointer);
            } else if (!enemyPositionedCharacter && !userPositionedCharacter && this.activeCharacter.move.includes(index)) {
                this.gamePlay.setCursor(cursors.pointer);
                this.gamePlay.selectCell(index, 'green');
            } else {
                this.gamePlay.setCursor(cursors.notallowed);
            }
        }
        if (enemyPositionedCharacter) {
            this.gamePlay.showCellTooltip(enemyPositionedCharacter);
        }
        if (userPositionedCharacter) {
            this.gamePlay.showCellTooltip(userPositionedCharacter);
        }
    }

    onCellLeave(index) {
        // TODO: react to mouse leave
        this.gamePlay.hideCellTooltip(index);
        this.gamePlay.deselectCell(index);
        this.gamePlay.setCursor(cursors.auto);
    }

    nextLevel() {
        this.gamePlay.level += 1;
        /* Уберем ограничение на количество уровней
        * if (this.gamePlay.level > 4) {
        *    GamePlay.showMessage('Game over');
        *    this.gamePlay.removeAllCellListeners();
        * } else {
        *    ...
        * }
        *
        * */
        this.characterCount += 1;
        this.activeCharacter = undefined;
        this.gamePlay.drawUi(Object.values(themes)[(this.gamePlay.level - 1) % 4]);
        this.userTeam = generateTeam(this.userTypeCharacters, this.gamePlay.level, this.characterCount);
        this.enemyTeam = generateTeam(this.enemyTypeCharacters, this.gamePlay.level, this.characterCount);
        const userTeam = this.startPositionList(this.userTeam, 'user');
        const enemyTeam = this.startPositionList(this.enemyTeam, 'enemy');
        this.userPositionedCharacters = userTeam || [];
        this.enemyPositionedCharacters = enemyTeam || [];
        this.gamePlay.deselectAllCells();
        this.gamePlay.redrawPositions([...this.userPositionedCharacters, ...this.enemyPositionedCharacters]);
    }

    startPositionList(team, typeOfTeam, size = this.gamePlay.boardSize) {
        const col = (typeOfTeam === 'user') ? 0 : size - 2;
        const startArray = [];

        for (let i = col; i < size ** 2 - 1; i += size) {
            startArray.push(i);
            startArray.push(i + 1);
        }
        return team.toArray().map((character) => {
            const position = startArray[Math.floor(Math.random() * startArray.length)];
            startArray.splice(startArray.indexOf(position), 1);
            return new PositionedCharacter(character, position);
        });
    }
}
