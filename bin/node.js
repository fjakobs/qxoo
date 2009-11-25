#!/usr/bin/env node

process.mixin(GLOBAL, require("sys"));

function libDir() {
  var parts = __filename.split("/");
  parts.pop();
  parts.pop();
  parts.push("lib");
  return(parts.join("/"));
}

require.paths.push(libDir());
require("qxoo/test/All").main();
