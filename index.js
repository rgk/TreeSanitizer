export default class TreeSanitizer {
  original = {};
  sanitized = {};
  constructor(tree) {
    this.original = tree;
    this.sanitized = {};
  }

  run(data = this.original, newTree = {}, parents = []) {
    if (typeof data !== 'object') return;

    for (const [key, value] of Object.entries(data)) {
      const option = this.options(key, value);
      if (option === true) continue;
      if (option !== false) value = option;

      if (typeof value === 'object') {
        newTree = this.run(value, newTree, [ ...parents, key ]);
        continue;
      }

      let branch = { [key]: this.filter(key, value) };
      for (let i = parents.length - 1; ~i; i--) {
        branch = { [parents[i]]: branch };
      }

      newTree = this.mergeTree(newTree, branch);
    }

    if (!parents.length) {
      this.original = data;
      this.sanitized = newTree;
    }

    return newTree;
  }

  // Extend ignoring keys, must return TRUE to ignore, this is the default by example.
  ignore(key) {
    return key.startsWith('_');
  }

  // Extend filtering, must return expected value, this is the default by example.
  filter(key, value) {
    switch(key) {
      case 'password':
        value = '*password*';
        break;
    }

    return value;
  }

  // Extend options to add or remove logic, can return value which will replace the current value.
  options(key, value) {
    if (this.ignore(key)) return true;

    return false;
  }

  mergeProperties(mainTree, branchTree, key) {
    if (branchTree === undefined || branchTree[key] === undefined) {
      return mainTree[key];
    } else if (typeof mainTree[key] === "object") {
      return this.mergeTree(branchTree[key], mainTree[key]);
    }

    return branchTree[key];
  }

  mergeTree(mainTree, branchTree) {
    const mergedTree = {};

    for (const key of Object.keys(mainTree)) {
      mergedTree[key] = this.mergeProperties(mainTree, branchTree, key);
    }

    for (const key of Object.keys(branchTree)) {
      mergedTree[key] = this.mergeProperties(branchTree, mainTree, key);
    }

    return mergedTree;
  }
}
