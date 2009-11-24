var assert = require("test/assert");
var qx = require("qx");

exports.testHasListener = function()
{
  var obj = new qx.Object();
  assert.isFalse(obj.hasListener("juhu"));
  
  obj.addListener("juhu", function() {});
  assert.isTrue(obj.hasListener("juhu"));
}


exports.testFireEvent = function()
{
  var obj = new qx.Object();  
  
  var called = false;
  var context;
  var that = {};
  
  obj.addListener("custom", function() {
    called = true;
    context = this;
  }, that);
  
  obj.fireEvent("custom");
  
  assert.isTrue(called);
  assert.eq(context, that);
}


exports.testFireDataEvent = function()
{
  var obj = new qx.Object();  
  
  var data;
  
  obj.addListener("custom", function(e) {
    data = e.getData();
  });
  
  obj.fireDataEvent("custom", "Juhu");
  assert.is("Juhu", data);  
}

if (require.main === module.id)
    require("os").exit(require("test/runner").run(exports));
