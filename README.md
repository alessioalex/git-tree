# git-tree

Stream the content of a git tree object by shelling out to [git-ls-tree(1)](https://www.kernel.org/pub/software/scm/git/docs/git-ls-tree.html).

## Usage

```js
streamTreeItems(repoPath, [options])
```

Where `options` is an object that can contain the following properties:

- `rev`: revision
- `path`: use a specific path instead of the root
- `all`: show all files (recurse into sub-trees)

Example:

```js
var streamTreeItems = require('git-tree');
var path = require('path');
var repoPath = path.resolve(process.env.REPO || (__dirname + '/.git'));

var tree = {
  files: [],
  folders: [],
  submodules: []
};

// show all files in the root of the git repo, HEAD revision
streamTreeItems(repoPath).on('data', function(item) {
  var type;

  if (item.type === 'blob') {
    type = 'files';
  } else if (item.type === 'tree') {
    type = 'folders';
  } else if (item.type === 'submodule') {
    type = 'submodules';
  }

  delete item.type;
  tree[type].push(item);
}).on('error', function(err) {
  throw err;
}).on('end', function() {
  console.log(tree);
  console.log("\n==================");
  console.log("That's all, folks!");
});
```

## Tests

```
npm test
```

## License

MIT
