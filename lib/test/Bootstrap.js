var assert = require("test/assert");
var qx = require("qxoo");

exports.testDefine = function()
{
  var Juhu = qx.Bootstrap.define("Juhu");
  assert.is("object", typeof Juhu);
};


exports.testMember = function()
{
  var Juhu = qx.Bootstrap.define("Juhu", {
    members: {
      juhu: function() {
        return "juhu";
      }
    }
  });
  
  assert.is("juhu", new Juhu().juhu());
}

if (require.main === module.id)
    require("os").exit(require("test/runner").run(exports));
