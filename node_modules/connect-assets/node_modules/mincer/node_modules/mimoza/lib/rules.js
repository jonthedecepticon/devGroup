// Mime rules data loader. That's don for 2 reasons:
//
// - cache fs for new instanses preload
// - substitude with embedded data for browserified version
//
'use strict';


var path  = require('path');
var fs    = require('fs');


module.exports = {
  mimeTypes: fs.readFileSync(path.join(__dirname, '../types/mime.types'), 'ascii'),
  nodeTypes: fs.readFileSync(path.join(__dirname, '../types/node.types'), 'ascii'),
  compressibleTypes: fs.readFileSync(path.join(__dirname, '../types/compressible.types'), 'ascii')
};