/* eslint-disable no-console, func-names */
'use strict';

require('should');
var proxyquire = require('proxyquire');
var fs = require('fs');

var streamingParser = require('../lib/parser');

describe('git-tree', function() {
  it('should parse the output', function(done) {
    var inputStream = fs.createReadStream(__dirname + '/fixture.txt', 'utf8');

    var items = [];

    streamingParser(inputStream).on('data', function(item) {
      items.push(item);
    }).on('error', function(err) {
      throw err;
    }).on('end', function() {
      items.should.eql(require(__dirname + '/output.json'));

      done();
    });
  });

  it('should create the command correctly', function(done) {
    var repoPath = '/home/node.git';
    var opts = {
      recursive: true,
      path: '/test',
      rev: 'master'
    };

    var gitTree = proxyquire('../', {
      './lib/parser': function(inputStream) {
        inputStream.should.eql('git-spawned-stream');
      },
      'git-spawned-stream': function(path, args) {
        path.should.eql(repoPath);
        args.should.eql(['ls-tree', '-z', '-l', '-r', opts.rev, '--', opts.path]);

        return 'git-spawned-stream';
      }
    });

    gitTree(repoPath, opts);

    done();
  });
});
