import Character from '../Character';

export default class Swordsman extends Character {
    constructor(level) {
        super(level, 40, 10, 'Swordsman');
        this.moveDistance = 4;
        this.attackDistance = 1;
    }
}
