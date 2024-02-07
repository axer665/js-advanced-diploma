import PositionedCharacter from '../PositionedCharacter';
import Bowman from '../characters/Bowman';

test('Позиционирование персонажа', () => {
    const character = new Bowman(1);
    expect(new PositionedCharacter(character, 1)).toEqual({
        character: {
            attack: 25,
            attackDistance: 2,
            defence: 25,
            health: 50,
            level: 1,
            moveDistance: 2,
            type: 'Bowman',
        },
        position: 1,
    });
});

test('Неправильная позиция персонажа', () => {
    const character = new Bowman(1);
    expect(() => new PositionedCharacter(character, 'Bowman')).toThrow();
});

test('неправильный класс персонажа', () => {
    expect(() => new PositionedCharacter('character', 1)).toThrow();
});
