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

var TestRunner = require("qxoo/test/NodeRunner").TestRunner;
new TestRunner().add(require("qx/test/Class").Class).run();

