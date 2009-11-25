require("qx");
var TestResult = require("qx/dev/unit/TestResult").TestResult;
var TestSuite = require("qx/dev/unit/TestSuite").TestSuite;
var AbstractRunner = require("./AbstractRunner").AbstractRunner;

exports.TestRunner = qx.Class.define("qx.dev.unit.NodeRunner",
{
  extend: AbstractRunner,
  
  members:
  {
    _addListeners : function()
    {
      var testResult = this._testResult;
      var assert = require("mjsunit");
      
      testResult.addListener("failure", function(e)
      {
        var test = e.getData().test;
        var ex = e.getData().exception;
        assert.assertTrue(false, "Test '" + test.getFullName() + "' failed: " + ex.message + " - " + ex.getComment());
      });
      
      testResult.addListener("error", function(e)
      {
        var ex = e.getData().exception;
        assert.assertTrue(false, "The test '" + e.getData().test.getFullName() + "' had an error: " + ex);
      });
      
      testResult.addListener("startTest", function(e)
      {
        puts("  + Running '" + e.getData().getFullName() + "'");
      });
    }
  }
});