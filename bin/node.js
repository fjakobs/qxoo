#!/usr/bin/env node

var sys = require("sys");

function libDir() {
  var parts = __filename.split("/");
  parts.pop();
  parts.pop();
  parts.push("lib");
  return(parts.join("/"));
}

require.paths.push(libDir());


require("qx");

var o = new qx.core.Object();
sys.print(o + "\n");


