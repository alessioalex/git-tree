"use strict";

var proxyquire = require('proxyquire');
var should = require('should');
var fs = require('fs');

var streamingParser = require('../lib/parser');

describe('git-tree', function() {
  it('should parse the output', function(done) {
    var inputStream = fs.createReadStream(__dirname + '/fixture.txt', 'utf8');

    var tree = {
      files: [],
      folders: [],
      submodules: []
    };

    streamingParser(inputStream).on('data', function(item) {
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
      tree.should.eql(require(__dirname + '/output.json'));
      done();
    });
  });

  it('should create the command correctly', function(done) {
    var repoPath = '/home/node.git';
    var opts = {
      all: true,
      path: '/test',
      rev: 'master'
    };

    var gitTree = proxyquire('../', {
      './lib/parser': function(inputStream) {
        inputStream.should.eql('git-spawned-stream');
      },
      'git-spawned-stream': function(path, args) {
        path.should.eql(repoPath);
        args.should.eql(["ls-tree", "-z", "-l", "-r", opts.rev, "--", opts.path]);

        return 'git-spawned-stream';
      }
    });

    gitTree(repoPath, opts);

    done();
  });
});
