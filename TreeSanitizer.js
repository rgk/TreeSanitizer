export default class TreeSanitizer {
  constructor(tree) {
    this.original = tree;
  }

  run(data = this.original, newTree = {}, parents = []) {
    if (typeof data !== 'object') return;
    for (const [key, value] of Object.entries(data)) {
      if (typeof value === 'object') {
        parents.push(key);
        newTree = this.run(value, newTree, parents);
        parents.pop();
        continue;
      }

      const newValue = this.filter(key, value);

      let branch = { [key]: newValue };
      for (let i = parents.length - 1; i !== -1; i--) {
        branch = { [parents[i]]: branch };
      }

      newTree = this.mergeTree(newTree, branch);
    }

    return newTree;
  }

  // Extend and customize the filter, this is the default by example.
  filter(key, value) {
    switch(key) {
      case 'password':
        value = '*password*';
        break;
    }

    return value;
  }

  mergeProperties(mainTree, branchTree, key) {
    if (branchTree === undefined || branchTree[key] === undefined) {
      return mainTree[key];
    } else if (typeof(mainTree[key]) === "object") {
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
