import { cookieExtractor } from './jwt.strategy';

describe('cookieExtractor', () => {
  it('should correctly extract the JWT from the request', () => {
    const authToken = 'some-random-jwt-xyz';

    const req = {
      headers: {
        cookie: `Authorization=${authToken}`,
      },
    };

    expect(cookieExtractor(req)).toEqual(authToken);
  });

  it('should not throw an error if the cookies are empty. Instead it should return null', () => {
    const req = {
      headers: {},
    };

    const extractFn = () => cookieExtractor(req);
    expect(extractFn).not.toThrow();
  });

  it('should work when they are multiple cookies', () => {
    const authToken = 'some-random-jwt-xyz';

    const authCookie = `Authorization=${authToken}`;
    const otherCookie = `aaa=bbb`;
    const anotherCookie = `ccc=ddd`;
    const cookie = `${otherCookie}; ${authCookie}; ${anotherCookie};`;
    const req = {
      headers: {
        cookie,
      },
    };

    expect(cookieExtractor(req)).toEqual(authToken);
  });
});
