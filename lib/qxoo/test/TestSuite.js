var assert = require("test/assert");
var qx = require("qx");
var TestSuite = require("qx/dev/unit/TestSuite").TestSuite;
var TestClass = require("qx/dev/unit/TestClass").TestClass;
var TestResult = require("qx/dev/unit/TestResult").TestResult;


exports.testCreate = function()
{
  var suite = new TestSuite();
  assert.isTrue(suite instanceof TestSuite);
};


exports.testLoader = function()
{
  var suite = new TestSuite();
  suite.add(require("qx/test/Class").Class);
  
  var testResult = new TestResult();
  
  testResult.addListener("failure", function(e) {
    assert.fail("Test '" + test.getFullName() + "' failed: " + ex.message + " - " + ex.getComment());
  });
  
  testResult.addListener("error", function(e)
  {
    var ex = e.getData().exception;
    assert.fail("The test '" + e.getData().test.getFullName() + "' had an error: " + ex);
  });
  
  testResult.addListener("endTest", function(e)
  {
    print("Finished test '" + e.getData().getFullName() + "'");
  });
  
  suite.run(testResult);
}


if (require.main === module.id)
    require("os").exit(require("test/runner").run(exports));
