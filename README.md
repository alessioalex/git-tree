# git-tree

Stream the content of a git tree object by shelling out to [git-ls-tree(1)](https://www.kernel.org/pub/software/scm/git/docs/git-ls-tree.html).

[![build status](https://secure.travis-ci.org/alessioalex/git-tree.png)](http://travis-ci.org/alessioalex/git-tree)

## usage

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

streamTreeItems(repoPath, {
  // recursive: true
}).on('data', function(item) {
  item.symlink = (item.mode === '120000') ? true : false;

  console.log(item);
  console.log('------');
}).on('error', function(err) {
  throw err;
}).on('end', function() {
  console.log('That\'s all folks!');
});

/*
{ type: 'blob',
  mode: '100644',
  hash: 'b67a8a8e96c8b4d4e5715be032c0f7e88c49feee',
  size: 108,
  path: '.gitmodules',
  symlink: false }
------
{ type: 'blob',
  mode: '120000',
  hash: '054d92957a328df28686861eac65abc79c65c319',
  size: 24,
  path: 'CONTRIBUTING.md',
  symlink: true }
------
{ type: 'tree',
  mode: '040000',
  hash: '3d474da4fd016ec61ff32d8fde505a53d123fed0',
  size: '-',
  path: 'folder',
  symlink: false }
------
{ type: 'blob',
  mode: '120000',
  hash: 'a0b256310c2b4fb225709c432cad6b9c28dc9a90',
  size: 37,
  path: 'sample-folder',
  symlink: true }
------
{ type: 'commit',
  mode: '160000',
  hash: '10054733bf311044fb68aec24fe2fac6b21bde36',
  size: '-',
  path: 'tiny-each-async',
  symlink: false }
------
That's all folks!
*/
```

## tests

```
npm test
```

## license

[MIT](http://alessioalex.mit-license.org/)
