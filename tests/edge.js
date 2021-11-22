import test from 'tape';
import TreeSanitizer from '../TreeSanitizer.js';

test('Keys with objects that are filter points.', (t) => {
  let data = {
    a: {
      password: {
        username: 'thisisausername',
        password: 'thisisapassword'
      }
    }
  }

  let result = {
    a: {
      password: {
        username: 'thisisausername',
        password: '*password*'
      }
    }
  }

  t.deepEqual(
    new TreeSanitizer(data).run(),
    result
  );

  t.end();
});

test('Converts vales that are arrays into incrementing object properties.', (t) => {
  let data = {
    a: {
      b: {
        data: ['data', 'in', 'password'],
        password: 'thisisapassword'
      }
    }
  }

  let result = {
    a: {
      b: {
        data: {
          0: 'data', 1: 'in', 2: 'this'
        },
        password: '*password*'
      }
    }
  }

  t.deepEqual(
    new TreeSanitizer(data).run(),
    result
  );

  t.end();
});
