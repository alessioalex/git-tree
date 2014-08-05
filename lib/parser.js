"use strict";

var splitStream = require('split-transform-stream');

module.exports = function streamTreeData(inputStream, path) {
  path = path || '';

  function write(line, enc, cb) {
    if (!line) {
      cb();
      return;
    }

    var matched = line.match(/^([0-9]+) (.+) ([0-9a-fA-F]{40}) +(-|[0-9]+)\t(.+)$/);
    var type = matched[2];

    if (type === 'commit') { type = 'submodule'; }

    this.push({
      type: type,
      mode: matched[1],
      hash: matched[3],
      size: parseInt(matched[4], 10) || '-',
      path: matched[5].replace(path, '')
    }, 'utf8');

    cb();
  }

  // last argument is the char to split by
  return splitStream(inputStream, write, null, '\0');
};
