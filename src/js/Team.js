/**
 * Класс, представляющий персонажей команды
 *
 * @todo Самостоятельно продумайте хранение персонажей в классе
 * Например
 * @example
 * ```js
 * const characters = [new Swordsman(2), new Bowman(1)]
 * const team = new Team(characters);
 *
 * team.characters // [swordsman, bowman]
 * ```
 * */
export default class Team {
    // TODO: write your logic here
    constructor() {
        this.members = new Set();
    }

    add(character) {
        if (this.members.has(character)) {
            throw new Error('Этот персонаж уже присутствует в команде');
        }
        this.members.add(character);
    }

    addAll(...characters) {
        characters.forEach((character) => {
            if (!this.members.has(character)) {
                this.members.add(character);
            }
        });
    }

    toArray() {
        return Array.from(this.members);
    }

    * [Symbol.iterator]() {
        // eslint-disable-next-line no-restricted-syntax
        for (const member of this.members) {
            yield member;
        }
    }

    * randomIterator() {
        while (true) {
            const index = Math.floor(Math.random() * this.members.size);
            yield this.toArray()[index];
        }
    }
}
