import Team from '../Team';
import Magician from '../characters/Magician';
import Bowman from '../characters/Bowman';

test('Добавление лучгика в команду', () => {
    const member = new Bowman(1);
    const team = new Team();
    team.add(member);
    expect(team.members).toEqual(new Set([
        {
            attack: 25,
            defence: 25,
            attackDistance: 2,
            moveDistance: 2,
            health: 50,
            level: 1,
            type: 'Bowman',
        }]));
});

test('Повторное добавление лучника в команду', () => {
    const member = new Bowman(1);
    const team = new Team();
    team.add(member);
    expect(() => team.add(member)).toThrow();
});

test('Создание команды', () => {
    const member1 = new Bowman(1);
    const member2 = new Magician(1);
    const team = new Team();
    team.addAll(member1, member2);

    expect(team.members).toEqual(new Set([
        {
            attack: 25,
            defence: 25,
            attackDistance: 2,
            moveDistance: 2,
            health: 50,
            level: 1,
            type: 'Bowman',
        },
        {
            attack: 10,
            defence: 40,
            attackDistance: 4,
            moveDistance: 1,
            health: 50,
            level: 1,
            type: 'Magician',
        },
    ]));
});

test('Добавляем несколько персонажей в команду', () => {
    const member1 = new Bowman(1);
    const member2 = new Magician(1);
    const team = new Team();
    team.addAll(member1, member2, member1);
    expect(team.members).toEqual(new Set([
        {
            attack: 25,
            defence: 25,
            attackDistance: 2,
            moveDistance: 2,
            health: 50,
            level: 1,
            type: 'Bowman',
        },
        {
            attack: 10,
            defence: 40,
            attackDistance: 4,
            moveDistance: 1,
            health: 50,
            level: 1,
            type: 'Magician',
        },
    ]));
});

test('Команду превращаем в массив', () => {
    const member1 = new Bowman(1);
    const member2 = new Magician(1);
    const team = new Team();
    team.add(member1);
    team.add(member2);
    expect(team.toArray()).toEqual([
        {
            attack: 25,
            defence: 25,
            attackDistance: 2,
            moveDistance: 2,
            health: 50,
            level: 1,
            type: 'Bowman',
        },
        {
            attack: 10,
            defence: 40,
            attackDistance: 4,
            moveDistance: 1,
            health: 50,
            level: 1,
            type: 'Magician',
        },
    ]);
});

test('Проверяем итератор', () => {
    const member1 = new Bowman(1);
    const member2 = new Magician(1);
    const team = new Team();
    team.addAll(member1, member2);
    const iterator = team[Symbol.iterator]();

    expect(iterator.next().value).toEqual(member1);
    expect(iterator.next().value).toEqual(member2);
    expect(iterator.next().value).toBeUndefined();
});

test('Проверяем генератор', () => {
    const member1 = new Bowman(1);
    const member2 = new Magician(1);
    const team = new Team();
    team.addAll(member1, member2);
    const random = team.randomIterator();
    expect(team.toArray().includes(random.next().value)).toBeTruthy();
    expect(team.toArray().includes(random.next().value)).toBeTruthy();
    expect(team.toArray().includes(random.next().value)).toBeTruthy();
});
