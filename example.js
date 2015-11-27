/* eslint-disable no-console, func-names */
'use strict';

var streamTreeItems = require('./');
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
