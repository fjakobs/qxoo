#!/usr/bin/env narwhal

var FILE = require("file"),
  OS = require("os"),
  importer = require("importer");

function usage() {
  print("usage: import.js QOOXDOO_PATH");
}

function isQooxdooPath(path)
{
  try {
    var manifestFile = FILE.path(path, "framework", "Manifest.json");
    var manifest = JSON.parse(FILE.read(manifestFile));
    return manifest.info.name == "qooxdoo framework";
  } catch(e) {
    return false;
  }
}

function main(args)
{
  if (args.length !== 2) {
    usage();
    OS.exit(2);
  }
  
  if (!isQooxdooPath(args[1])) {
    print("'" + args[1] + "' does not point to the qooxdoo base path!\n");
    usage();
    OS.exit(1);
  }
  
  var qooxdooPath = args[1];
  
  var binDir = FILE.path(args[0]).dirname();
  var libDir = FILE.path(binDir, "..", "lib");
  
  importer = new importer.Importer(qooxdooPath, libDir);
  importer.importQooxdoo();
  
  require("qxoo/test/All").main();
}

main(system.args);