import Character from './Character';

export default class PositionedCharacter {
    constructor(character, position) {
        if (!(character instanceof Character)) {
            throw new Error('Персонаж должен быть экземпляром Character');
        }

        if (typeof position !== 'number') {
            throw new Error('Позиция может быть только числом');
        }

        this.character = character;
        this.position = position;
    }
}
