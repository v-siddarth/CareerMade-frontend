import { authStorage } from '../lib/api-client';

describe('authStorage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('sets and gets access token', () => {
    authStorage.setAccessToken('abc');
    expect(authStorage.getAccessToken()).toBe('abc');
  });

  it('sets and gets user object', () => {
    const user = { id: '1', role: 'jobseeker' };
    authStorage.setUser(user);
    expect(authStorage.getUser()).toEqual(user);
  });
});
