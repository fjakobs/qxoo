#!/usr/bin/env node

var sys = require("sys");
for (var key in sys)
    GLOBAL[key] = sys[key];

function libDir() {
  var parts = __filename.split("/");
  parts.pop();
  parts.pop();
  parts.push("lib");
  return(parts.join("/"));
}

require.paths.push(libDir());
require("qxoo/test/All").main();
