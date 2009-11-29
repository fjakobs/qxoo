require("qx");

exports.main = function()
{
  if (engine == "node") {
    var TestRunner = require("qxoo/test/NodeRunner").TestRunner;    
  } else {
    var TestRunner = require("qxoo/test/NarwhalRunner").TestRunner;
  }
  new TestRunner().add(
    require("qx/test/Class").Class,
    require("qx/test/Interface").Interface,
    require("qx/test/Mixin").Mixin,
    require("qx/test/lang/Array").Array,
    require("qx/test/data/DataArray").DataArray,
    require("qx/test/data/singlevalue/Simple").Simple,
    require("qx/test/data/singlevalue/Deep").Deep,
    require("qx/test/data/singlevalue/Array").Array
  ).run();
}


if (require.main === module.id)
  require("os").exit(exports.main());

