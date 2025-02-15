import { SkyAppRuntimeConfigParams } from './params';

describe('SkyAppRuntimeConfigParams', () => {
  const allowed = {
    a1: {},
    a3: {},
  };

  it('should parse allowed params from a url', () => {
    const params = new SkyAppRuntimeConfigParams(
      'https://example.com/?a1=a&b2=jkl&a3=b',
      allowed
    );

    expect(params.getAllKeys()).toEqual(['a1', 'a3']);
    expect(params.get('a1')).toEqual('a');
    expect(params.get('b2')).not.toEqual('jkl');
    expect(params.get('a3')).toEqual('b');
    expect(params.getAll()).toEqual({
      a1: 'a',
      a3: 'b',
    });
  });

  it('should only let allowed params be set', () => {
    const params = new SkyAppRuntimeConfigParams('?a1=b&b2=c', allowed);
    expect(params.get('a1')).toEqual('b');
    expect(params.get('b2')).not.toEqual('c');
  });

  it('should add the current params to a url with a querystring', () => {
    const params = new SkyAppRuntimeConfigParams('?a1=b', allowed);
    expect(params.getUrl('https://mysite.com?c=d')).toEqual(
      'https://mysite.com?c=d&a1=b'
    );
  });

  it("should exclude certain parameters from being added to a url's querystring", () => {
    const params = new SkyAppRuntimeConfigParams('?a1=b&b2=c3&z4=y', {
      a1: true,
      b2: {
        required: true,
      },
      z4: {
        excludeFromRequests: true,
      },
    });

    expect(params.getUrl('https://mysite.com?c=d')).toEqual(
      'https://mysite.com?c=d&a1=b&b2=c3'
    );
  });

  it('should not add a current param if the url already has it', () => {
    const params = new SkyAppRuntimeConfigParams('?a1=b', allowed);
    expect(params.getUrl('https://mysite.com?a1=c&a3=e')).toEqual(
      'https://mysite.com?a1=c&a3=e'
    );
  });

  it('should add the current params to a url without a querystring', () => {
    const params = new SkyAppRuntimeConfigParams('?a1=b', allowed);
    expect(params.getUrl('https://mysite.com')).toEqual(
      'https://mysite.com?a1=b'
    );
  });

  it('should return the current url if no params set (do not add ?)', () => {
    const params = new SkyAppRuntimeConfigParams('', allowed);
    expect(params.getUrl('https://mysite.com')).toEqual('https://mysite.com');
  });

  it('should not add double-encoded params to a url', () => {
    const params = new SkyAppRuntimeConfigParams('?a1=%2F', allowed);
    expect(params.getUrl('https://mysite.com')).toEqual(
      'https://mysite.com?a1=%2F'
    );
  });

  it('should allow querystring param keys to be case insensitive', () => {
    const params = new SkyAppRuntimeConfigParams('?A1=b&A3=c', allowed);
    expect(params.get('a1')).toEqual('b');
    expect(params.get('a3')).toEqual('c');
  });

  it('should expose a `has` method for testing if a param exists', () => {
    const params = new SkyAppRuntimeConfigParams('?a1=b&a2=c', allowed);
    expect(params.has('a1')).toEqual(true);
    expect(params.has('a2')).toEqual(false);
    expect(params.has('a3')).toEqual(false);
  });

  it('should allow default values to be specified', () => {
    const params = new SkyAppRuntimeConfigParams('?a1=b&a2=c&a4=x', {
      // Allowed with simple boolean flag
      a1: true,
      // Disallowed but present in the query string
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      a2: undefined as any,
      // Allowed with explicit default value
      a3: {
        value: 'd',
      },
      // Allowed with explicit default value of undefined
      a4: {
        value: undefined,
      },
    });

    expect(params.get('a1')).toBe('b');
    expect(params.get('a2')).toBe(undefined);
    expect(params.get('a3')).toBe('d');
    expect(params.get('a4')).toBe('x');
    expect(params.get('a5')).toBe(undefined);
  });

  it('should allow default values to be overridden by the query string', () => {
    const params = new SkyAppRuntimeConfigParams('?a1=b&a2=c', {
      a1: {
        value: 'x',
      },
      a2: {},
    });

    expect(params.get('a1')).toBe('b');
    expect(params.get('a2')).toBe('c');
  });

  it('should support excluding default values in getAll() if specified', () => {
    const params = new SkyAppRuntimeConfigParams(
      '?a2=a2Value&a3=a3CustomValue',
      {
        // Allowed with simple boolean flag
        a1: {
          value: 'a1DefaultValue',
        },
        a2: true,
        a3: {
          value: 'a3DefaultValue',
        },
      }
    );

    expect(params.getAll(true)).toEqual({
      a2: 'a2Value',
      a3: 'a3CustomValue',
    });
  });

  it('should decode query string values but not default values', () => {
    const params = new SkyAppRuntimeConfigParams('?a=%2F', {
      a: true,
      b: {
        value: '%2F',
      },
    });

    expect(params.get('a')).toBe('/');
    expect(params.get('b')).toBe('%2F');
  });

  it('should allow queryParam values to be required', () => {
    const params = new SkyAppRuntimeConfigParams('', {
      a1: {
        value: 'test',
        required: true,
      },
    });

    expect(params.isRequired('a1')).toEqual(true);
    expect(params.hasAllRequiredParams()).toBe(true);
  });

  it('should expose a `hasAllRequiredParams` method for testing if all required params are defined', () => {
    const params = new SkyAppRuntimeConfigParams('', {
      a1: {
        required: true,
      },
    });

    expect(params.hasAllRequiredParams()).toBe(false);
  });

  it('should expose a `hasAllRequiredParams` method that returns true if no required params are defined', () => {
    const params = new SkyAppRuntimeConfigParams('', {
      a1: true,
    });

    expect(params.hasAllRequiredParams()).toBe(true);
  });

  it('should expose a `hasAllRequiredParams` method that returns false if any required params are undefined', () => {
    const params = new SkyAppRuntimeConfigParams('', {
      a1: {
        value: '1',
        required: true,
      },
      a2: {
        required: true,
      },
    });

    expect(params.hasAllRequiredParams()).toBe(false);
  });

  it('should handle a url with a querystring and fragment (#)', () => {
    const params = new SkyAppRuntimeConfigParams(
      '?A1=b&A3=c#hash-better=have-my-money',
      allowed
    );
    expect(params.get('a1')).toEqual('b');
    expect(params.get('a3')).toEqual('c');
    expect(params.getUrl('example.com')).not.toContain(
      'hash-better=have-my-money'
    );
  });

  it('should ignore params in a fragment', () => {
    const params = new SkyAppRuntimeConfigParams(
      'https://example.com#A1=b',
      allowed
    );

    expect(params.get('a1')).not.toEqual('b');
  });

  it('should handle a url without a querystring', () => {
    const params = new SkyAppRuntimeConfigParams(
      'https://example.com',
      allowed
    );

    expect(params.getAllKeys()).toEqual([]);
  });

  it('should add provided params to a url link', () => {
    const params = new SkyAppRuntimeConfigParams('', allowed);
    expect(
      params.getLinkUrl('https://mysite.com', { queryParams: { q1: '5' } })
    ).toEqual('https://mysite.com?q1=5');
  });

  it('should add provided params to a url link with a query string', () => {
    const params = new SkyAppRuntimeConfigParams('', {
      q3: { value: 3 },
      q4: { value: 4, excludeFromLinks: true },
    });
    expect(
      params.getLinkUrl('https://mysite.com?q1=1&q2=2', {
        queryParams: {
          q1: '5',
          q7: '',
          q8: 'false',
        },
      })
    ).toEqual('https://mysite.com?q1=5&q2=2&q7=&q8=false&q3=3');
  });

  it("should exclude certain parameters from being added to a link's querystring", () => {
    const params = new SkyAppRuntimeConfigParams('https://mysite.com?a=1&b=2', {
      a: true,
      b: {
        required: true,
      },
      c: true,
      d: {
        excludeFromRequests: true,
      },
      e: {
        excludeFromLinks: true,
      },
      f: {
        excludeFromRequests: true,
      },
    });

    expect(params.getLinkUrl('https://mysite.com?c=3&f=6&g=9#foobar')).toEqual(
      'https://mysite.com?c=3&g=9&a=1&b=2#foobar'
    );
  });

  it('should combine app config params, provided params, and url params', () => {
    const params = new SkyAppRuntimeConfigParams(
      'https://mysite.com?a=1&b=2&c=3',
      {
        b: {
          excludeFromRequests: true,
        },
        c: {
          value: 42,
        },
        d: {
          value: 43,
        },
        m: {
          excludeFromRequests: true,
        },
        n: {
          excludeFromLinks: true,
        },
      }
    );

    expect(
      params.getLinkUrl('https://mysite.com?a=10&c=13&f=6&m=14#foobar', {
        queryParams: {
          a: '5',
          m: '10',
          n: '11',
        },
      })
    ).toEqual('https://mysite.com?a=5&c=13&f=6&m=10&n=11&d=43#foobar');
  });

  it('should support query params with multiple values', () => {
    const params = new SkyAppRuntimeConfigParams('?a1=b', allowed);

    expect(params.getUrl('https://mysite.com?c=d&c=e')).toEqual(
      'https://mysite.com?c=d&c=e&a1=b'
    );
  });

  it('should preserve query string component encoding', () => {
    const params = new SkyAppRuntimeConfigParams('?a1=%20', allowed);

    expect(params.getUrl('https://mysite.com?%3F%26=%26%3F')).toEqual(
      'https://mysite.com?%3F%26=%26%3F&a1=%20'
    );

    expect(
      params.getLinkUrl('https://mysite.com?foobar=Robert+Hernandez')
    ).toEqual('https://mysite.com?foobar=Robert+Hernandez&a1=%20');
  });

  it('should validate query string encoding', () => {
    const params = new SkyAppRuntimeConfigParams('?a1=str+1', {
      a4: {
        value: 'str+4',
      },
    });

    expect(
      params.getLinkUrl('https://mysite.com?a2=str+2', {
        queryParams: { a3: 'str+3' },
      })
    ).toEqual('https://mysite.com?a2=str+2&a3=str%2B3&a4=str%2B4');
  });
});
