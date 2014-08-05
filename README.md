# git-tree

Stream the content of a git tree object by shelling out to [git-ls-tree(1)](https://www.kernel.org/pub/software/scm/git/docs/git-ls-tree.html).
[![build status](https://secure.travis-ci.org/alessioalex/git-tree.png)](http://travis-ci.org/alessioalex/git-tree)

## Usage

```js
streamTreeItems(repoPath, [options])
```

Where `options` is an object that can contain the following properties:

- `rev`: revision
- `path`: use a specific path instead of the root
- `recursive`: show all files (recurse into sub-trees)

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

Output:

```js
{
  "files": [
    {
      "mode": "100644",
      "hash": "bc96284375bd0c48781c96b45d81d87068e7d5e5",
      "size": 508,
      "path": ".gitignore"
    }, {
      "mode": "100644",
      "hash": "5a199dd569f1412adbe273a3789969fcfc04b123",
      "size": 78,
      "path": ".gitmodules"
    }
  ],
  "folders": [
    {
      "mode": "040000",
      "hash": "6003a3fe411e6edf6bc1f3e8ad85e3e5802ca893",
      "size": "-",
      "path": "actionmailer"
    }, {
      "mode": "040000",
      "hash": "46aa09b6349846238f2d05ab61aa32e4e4b9f47b",
      "size": "-",
      "path": "actionpack"
    }
  ],
  "submodules": [
    {
      "mode": "160000",
      "hash": "c67be4624545b4263184c4a0e8f887efd0a66320",
      "size": "-",
      "path": "rack"
    }
  ]
}
```

## Tests

```
npm test
```

## License

MIT
