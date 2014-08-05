"use strict";

var streamTreeItems = require('./');
var path = require('path');
var repoPath = path.resolve(process.env.REPO || (__dirname + '/.git'));

var tree = {
  files: [],
  folders: [],
  submodules: []
};

streamTreeItems(repoPath, {
  recursive: true
}).on('data', function(item) {
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
});
