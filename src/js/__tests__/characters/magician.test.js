import Magician from '../../characters/Magician';

test('Создание мага', () => {
    const expected = {
        attack: 10,
        attackDistance: 4,
        defence: 40,
        health: 50,
        level: 1,
        moveDistance: 1,
        type: 'Magician',
    };
    expect(new Magician(1)).toEqual(expected);
});
