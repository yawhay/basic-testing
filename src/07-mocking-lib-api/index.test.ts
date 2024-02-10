// Uncomment the code below and write your tests
import axios from 'axios';
import { THROTTLE_TIME, throttledGetDataFromApi } from './index';

const baseURL = 'https://jsonplaceholder.typicode.com';
const path = 'test/';
const response = { data: 'text' };

describe('throttledGetDataFromApi', () => {
  let axiosGetSpy: jest.SpyInstance;

  beforeAll(() => {
    jest.useFakeTimers();
  });

  beforeEach(() => {
    axiosGetSpy = jest
      .spyOn(axios.Axios.prototype, 'get')
      .mockResolvedValueOnce({ data: response });
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should create instance with provided base url', async () => {
    const axiosCreateSpy = jest.spyOn(axios, 'create');

    throttledGetDataFromApi(path);
    expect(axiosCreateSpy).toBeCalledTimes(1);
    expect(axiosCreateSpy).toBeCalledWith({ baseURL });
  });

  test('should perform request to correct provided url', async () => {
    throttledGetDataFromApi(path);
    jest.advanceTimersByTime(THROTTLE_TIME);
    expect(axiosGetSpy).toBeCalledTimes(1);
    expect(axiosGetSpy).toBeCalledWith(path);
  });

  test('should return response data', async () => {
    expect(await throttledGetDataFromApi(path)).toStrictEqual(response);
  });
});
