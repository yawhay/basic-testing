import { mockOne, mockTwo, mockThree } from './index';
import { unmockedFunction } from './index';

jest.mock('./index', () => {
  const originalModule =
    jest.requireActual<typeof import('./index')>('./index');

  return {
    ...originalModule,
    mockOne: jest.fn(),
    mockTwo: jest.fn(),
    mockThree: jest.fn(),
  };
});

describe('partial mocking', () => {
  let consoleLogSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleLogSpy = jest.spyOn(console, 'log');
  });

  afterAll(() => {
    jest.unmock('./index');
    consoleLogSpy.mockRestore();
  });

  test('mockOne, mockTwo, mockThree should not log into console', () => {
    mockOne();
    mockTwo();
    mockThree();

    expect(consoleLogSpy).not.toHaveBeenCalled();
  });

  test('unmockedFunction should log into console', () => {
    const consoleLogSpy = jest.spyOn(console, 'log');
    unmockedFunction();
    expect(consoleLogSpy).toHaveBeenCalledWith('I am not mocked');
    consoleLogSpy.mockRestore();
  });
});
