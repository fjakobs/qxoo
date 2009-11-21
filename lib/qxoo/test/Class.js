var assert = require("test/assert");
var qx = require("qxoo");

exports.testDefine = function()
{
  var Juhu = qx.Class.define("Juhu");
  assert.is("object", typeof Juhu);
  delete global.Juhu;
};


exports.testMember = function()
{
  var Juhu = qx.Class.define("Juhu", {
    extend: Object,
    members: {
      juhu: function() {
        return "juhu";
      }
    }
  });
  
  assert.is("juhu", new Juhu().juhu());
  delete global.Juhu;
}


exports.testProperty = function() 
{
  require("qx/core/Assert");
  
  var Juhu = qx.Class.define("Juhu", {
    extend: Object,
    properties : {
      juhu : {
        check: "String"
      }
    }
  });
  
  var juhu = new Juhu();
  juhu.setJuhu("kinners");
  assert.is("kinners", juhu.getJuhu());
  delete global.Juhu;
}

if (require.main === module.id)
    require("os").exit(require("test/runner").run(exports));
