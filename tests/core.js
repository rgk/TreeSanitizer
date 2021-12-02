import test from 'tape';
import TreeSanitizer from '../TreeSanitizer.js';

test('A deep nested tree can be sanitized.', (t) => {
  let data = {
    x: {
      a: {
        i: {
          h: {
            username: 'thisisausername',
            password: 'thisisapassword',
            other: 'stuff2',
            stuff: 'other'
          }
        },
        c: {
          username: 'thisisausername3',
          password: 'thisisapassword3',
          other: 'stuff'
        },
        d: {
          b: {
            g: {
              e: {
                username: 'thisisausername2',
                password: 'thisisapassword2',
                other: 'data'
              }
            }
          }
        }
      }
    },
    b: {
      username: 'thisisausername4',
      password: 'thisisapassword4'
    }
  };

  let result = {
    x: {
      a: {
        i: {
          h: {
            username: 'thisisausername',
            password: '*password*',
            other: 'stuff2',
            stuff: 'other'
          }
        },
        c: {
          username: 'thisisausername3',
          password: '*password*',
          other: 'stuff'
        },
        d: {
          b: {
            g: {
              e: {
                username: 'thisisausername2',
                password: '*password*',
                other: 'data'
              }
            }
          }
        }
      }
    },
    b: {
      username: 'thisisausername4',
      password: '*password*'
    }
  };

  t.deepEqual(
    new TreeSanitizer(data).run(),
    result
  );

  t.end();
});

test('Extending filter.', (t) => {
  let data = {
    a: {
      b: {
        username: 'thisisausername',
        password: 'thisisapassword'
      }
    }
  }

  let result = {
    a: {
      b: {
        username: 'thisisausername',
        password: '*password***'
      }
    }
  };

  class newTreeData extends TreeSanitizer {
    filter(key, value) {
      switch(key) {
        case 'password':
          value = '*password***';
          break;
      }
      return value;
    }
  };

  t.deepEqual(
    new newTreeData(data).run(),
    result
  );

  t.end();
});

test('Input can not be nested arrays.', (t) => {
  let data = [[[]]][[]];

  t.deepEqual(
    new TreeSanitizer(data).run(),
    undefined
  );

  t.end();
});

test('Ignore certain keys.', (t) => {
  let data = {
    a: {
      _b: {
        username: 'thisisausername',
        password: 'thisisapassword'
      }
    }
  };

  t.deepEqual(
    new TreeSanitizer(data).run(),
    {}
  );

  t.end();
});

test('Extending ignore.', (t) => {
  let data = {
    a: {
      $b: {
        username: 'thisisausername',
        password: 'thisisapassword'
      }
    }
  };

  class newTreeData extends TreeSanitizer {
    ignore(key) {
      return key.startsWith('$');
    }
  };

  t.deepEqual(
    new newTreeData(data).run(),
    {}
  );

  t.end();
});

test('String input returns undefined.', (t) => {
  let data = "thisisastring";

  t.deepEqual(
    new TreeSanitizer(data).run(),
    undefined
  );

  t.end();
});

test('Boolean input returns undefined.', (t) => {
  let data = true;

  t.deepEqual(
    new TreeSanitizer(data).run(),
    undefined
  );

  t.end();
});

test('Number input returns undefined.', (t) => {
  let data = 13;

  t.deepEqual(
    new TreeSanitizer(data).run(),
    undefined
  );

  t.end();
});
