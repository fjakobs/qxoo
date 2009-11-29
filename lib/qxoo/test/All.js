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
    require("qx/test/core/Object").Object,
    require("qx/test/core/Property").Property,
    require("qx/test/core/Validation").Validation,
    require("qx/test/lang/Array").Array,
    require("qx/test/lang/Object").Object,
    require("qx/test/lang/String").String,
    require("qx/test/lang/Type").Type,
    require("qx/test/data/DataArray").DataArray,
    require("qx/test/data/singlevalue/Simple").Simple,
    require("qx/test/data/singlevalue/Deep").Deep,
    require("qx/test/data/singlevalue/Array").Array,
    require("qx/test/data/marshal/Json").Json,
    require("qx/test/util/ColorUtil").ColorUtil
  ).run();
}


if (require.main === module.id)
  require("os").exit(exports.main());

