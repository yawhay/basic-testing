// Uncomment the code below and write your tests
import {
  getBankAccount,
  InsufficientFundsError,
  SynchronizationFailedError,
  TransferFailedError,
} from '.';

const account1 = getBankAccount(100);
const account2 = getBankAccount(10);

describe('BankAccount', () => {
  test('should create account with initial balance', () => {
    expect(account1.getBalance()).toBe(100);
  });

  test('should throw InsufficientFundsError error when withdrawing more than balance', () => {
    expect(() => account1.withdraw(200)).toThrow(InsufficientFundsError);
  });

  test('should throw error when transferring more than balance', () => {
    expect(() => account1.transfer(200, account2)).toThrow(
      InsufficientFundsError,
    );
  });

  test('should throw error when transferring to the same account', () => {
    expect(() => account1.transfer(1000, account1)).toThrow(
      TransferFailedError,
    );
  });

  test('should deposit money', () => {
    expect(account1.deposit(10)).toBeTruthy();
  });

  test('should withdraw money', () => {
    expect(account2.withdraw(2)).toBeTruthy();
  });

  test('should transfer money', () => {
    expect(account1.transfer(2, account2)).toBe(account1);
  });

  test('fetchBalance should return number in case if request did not failed', async () => {
    const fetch = await account1.fetchBalance();
    if (fetch) {
      expect(fetch).toEqual(expect.any(Number));
    }
  });

  test('should set new balance if fetchBalance returned number', async () => {
    jest.spyOn(account1, 'fetchBalance').mockResolvedValue(50);
    await account1.synchronizeBalance();
    expect(account1.getBalance()).toBe(50);
  });

  test('should throw SynchronizationFailedError if fetchBalance returned null', async () => {
    jest.spyOn(account1, 'fetchBalance').mockResolvedValue(null);
    await expect(() => account1.synchronizeBalance()).rejects.toThrow(
      SynchronizationFailedError,
    );
  });
});
