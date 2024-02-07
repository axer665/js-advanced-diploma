import PositionedCharacter from './PositionedCharacter';
import Bowman from './characters/Bowman';
import Daemon from './characters/Daemon';
import Magician from './characters/Magician';
import Swordsman from './characters/Swordsman';
import Undead from './characters/Undead';
import Zombie from './characters/Zombie';

export default class GameState {
    constructor(gameController) {
        if (!gameController) {
            throw new Error('GameController instance is required');
        }
        this.gameController = gameController;
    }

    /* eslint-disable class-methods-use-this */
    getPositionedCharacters(characters) {
        const classList = {
            Bowman,
            Daemon,
            Magician,
            Swordsman,
            Undead,
            Zombie,
        };

        return characters.map((item) => {
            const character = new classList[item.character.type](item.character.level);
            character.health = item.character.health;
            character.defence = item.character.defence;
            character.attack = item.character.attack;
            return new PositionedCharacter(character, item.position);
        });
    }

    from(state) {
    // TODO: create object
        if (!state) {
            throw new Error('Got wrong state');
        }

        try {
            this.gameController.gamePlay.level = state.level;
            this.gameController.activeCharacter = undefined;
            this.gameController.gamePlay.boardSize = state.boardSize;
            this.gameController.gamePlay.score = state.score;
            this.gameController.userPositionedCharacters = this.getPositionedCharacters(state.userPositionedCharacters);
            this.gameController.enemyPositionedCharacters = this.getPositionedCharacters(state.enemyPositionedCharacters);
            this.gameController.gamePlay.deselectAllCells();
            this.gameController.gamePlay.redrawPositions(
                [...state.userPositionedCharacters, ...state.enemyPositionedCharacters],
            );
        } catch (e) {
            throw new Error('Got wrong state data');
        }
    }
}
