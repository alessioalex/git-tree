/* eslint-disable no-console, func-names */
'use strict';

var proxyquire = require('proxyquire');
var fs = require('fs');
var streamingParser = require('../lib/parser');
var it = require('tape');

it('should parse the output', function(t) {
  var inputStream = fs.createReadStream(__dirname + '/fixture.txt', 'utf8');

  var items = [];

  streamingParser(inputStream).on('data', function(item) {
    items.push(item);
  }).on('error', function(err) {
    throw err;
  }).on('end', function() {
    t.deepEqual(items, require(__dirname + '/output.json'));

    t.end();
  });
});

it('should create the command correctly', function(t) {
  var repoPath = '/home/node.git';
  var opts = {
    recursive: true,
    path: '/test',
    rev: 'master'
  };

  var gitTree = proxyquire('../', {
    './lib/parser': function(inputStream) {
      t.deepEqual(inputStream, 'git-spawned-stream');
    },
    'git-spawned-stream': function(path, args) {
      t.equal(path, repoPath);
      t.deepEqual(args, ['ls-tree', '-z', '-l', '-r', opts.rev, '--', opts.path]);

      return 'git-spawned-stream';
    }
  });

  gitTree(repoPath, opts);

  t.end();
});
