import Character from '../Character';

export default class Zombie extends Character {
    constructor(level) {
        super(level, 10, 25, 'Zombie');
        this.moveDistance = 1;
        this.attackDistance = 1;
    }
}
