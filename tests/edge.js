import test from 'tape';
import TreeSanitizer from '../index.js';

test('Keys that are filter values should not be filtered.', (t) => {
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

test('Convert values that are arrays into incrementing object properties.', (t) => {
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
          0: 'data', 1: 'in', 2: 'password'
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

test('String object input is treated like an array.', (t) => {
  let data = new String("thisisastring");

  t.deepEqual(
    new TreeSanitizer(data).run(),
    { 0: 't', 1: 'h', 2: 'i', 3: 's', 4: 'i', 5: 's', 6: 'a', 7: 's', 8: 't', 9: 'r', 10: 'i', 11: 'n', 12: 'g' }
  );

  t.end();
});

test('Boolean object input returns a empty object.', (t) => {
  let data = new Boolean(true);

  t.deepEqual(
    new TreeSanitizer(data).run(),
    {}
  );

  t.end();
});

test('Number object input returns a empty object.', (t) => {
  let data = new Number(13);

  t.deepEqual(
    new TreeSanitizer(data).run(),
    {}
  );

  t.end();
});
