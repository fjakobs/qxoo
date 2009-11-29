
var glob;

try {
  glob = GLOBAL;
  var engine = "node";
} catch (e) {
  try {
    glob = global;
    var engine = "narwhal"
  } catch(e) {};
}

glob.engine = engine;

glob.qxsettings = {
};

glob.qxvariants = {
  "qx.debug": false,
};
  
glob.navigator = {
  userAgent: "Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10.6; de; rv:1.9.1.5) Gecko/20091102 Firefox/3.5.5",
  product: "Gecko"
};

glob.document = {};
glob.location = {};

glob.controllers = {};

if (engine == "node") {
  var sys = require("sys");
  glob.alert = function(text) { sys.print(text + "\n"); }
} else {
  glob.alert = print();
}

exports.global = glob;
