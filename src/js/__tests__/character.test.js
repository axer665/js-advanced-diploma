import Character from '../Character';
import Bowman from '../characters/Bowman';

test('Создание экземпляра Character', () => {
    expect(() => new Character(1)).toThrow();
});

test('Создание персонажа с отрицательным уровнем', () => {
    expect(() => new Bowman(-5)).toThrow();
});

test('Повышение уровня', () => {
    const bowman = new Bowman(1);
    bowman.levelUp();
    expect(bowman).toEqual(
        {
            attack: 32,
            attackDistance: 2,
            defence: 25,
            health: 80,
            level: 2,
            moveDistance: 2,
            type: 'Bowman',
        },
    );
});

test('Повышение уровня с высоким здоровьем (не должен превышать 100)', () => {
    const bowman = new Bowman(1);
    bowman.health = 100;
    bowman.levelUp();
    expect(bowman).toEqual(
        {
            attack: 45,
            attackDistance: 2,
            defence: 25,
            health: 100,
            level: 2,
            moveDistance: 2,
            type: 'Bowman',
        },
    );
});

test('Установка характеристик в зависимости от уровня', () => {
    expect(new Bowman(4)).toEqual({
        attack: 32,
        attackDistance: 2,
        defence: 32,
        health: 50,
        level: 4,
        moveDistance: 2,
        type: 'Bowman',
    });
});
