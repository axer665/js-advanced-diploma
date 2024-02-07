import GameController from '../GameController';

describe('GameController', () => {
    let gameController;

    beforeEach(() => {
        const gamePlayMock = {
            addCellEnterListener: jest.fn(),
            addCellLeaveListener: jest.fn(),
            addCellClickListener: jest.fn(),
            addNewGameListener: jest.fn(),
            addSaveGameListener: jest.fn(),
            addLoadGameListener: jest.fn(),
            removeAllCellListeners: jest.fn(),
            drawUi: jest.fn(),
            deselectAllCells: jest.fn(),
            redrawPositions: jest.fn(),
        };
        const stateServiceMock = {
            loadRecord: () => {},
        };
        gameController = new GameController(gamePlayMock, stateServiceMock);
    });

    test('Создание новой игры', () => {
        gameController.startPositionList = jest.fn();
        gameController.newGame();
        expect(gameController.startPositionList).toHaveBeenCalled();
    });
});
