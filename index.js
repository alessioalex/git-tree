'use strict';

var gitSpawnedStream = require('git-spawned-stream');
var streamingParser = require('./lib/parser');

function listTree(repoPath, ops) {
  var opts = ops || {};

  var args = ['ls-tree', '-z', '-l'];

  if (opts.recursive) { args.push('-r'); }
  args.push((opts.rev || 'HEAD'), '--', (opts.path || '.'));

  return streamingParser(gitSpawnedStream(repoPath, args));
}

module.exports = listTree;
