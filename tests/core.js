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
  }

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
  }
  t.deepEqual(
    new TreeSanitizer(data).run(),
    result
  );

  t.end();
});

test('Extending the filter.', (t) => {
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
  }

  class newTreeData extends TreeSanitizer {
    filter(key, value) {
      switch(key) {
        case 'password':
          value = '*password***';
          break;
      }
      return value;
    }
  }
  t.deepEqual(
    new newTreeData(data).run(),
    result
  );

  t.end();
});

test('Extending the filter.', (t) => {
  let data = [[[]]][[]];

  t.deepEqual(
    new TreeSanitizer(data).run(),
    undefined
  );

  t.end();
});

console.log('test ran');

