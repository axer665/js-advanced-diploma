import Character from '../Character';

export default class Daemon extends Character {
    constructor(level) {
        super(level, 10, 10, 'Daemon');
        this.moveDistance = 1;
        this.attackDistance = 4;
    }
}
