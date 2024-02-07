import Character from '../Character';

export default class Magician extends Character {
    constructor(level) {
        super(level, 10, 40, 'Magician');
        this.moveDistance = 1;
        this.attackDistance = 4;
    }
}
