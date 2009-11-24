var assert = require("test/assert");
var qx = require("qx");

//require("qx/dev/unit/TestSuite");
//require("qx/dev/unit/TestResult");

var TestCase = require("qx/dev/unit/TestCase").TestCase;
var AssertionError = require("qx/core/AssertionError").AssertionError;

exports.testCreate = function()
{
  var tc = new TestCase();
  assert.isTrue(tc instanceof TestCase);
};


exports.testSubclass = function()
{
  var MyTest = qx.Class.define("MyTest", {
    extend : TestCase,
    members : {
      testFail : function() {
        this.fail();
      }
    } 
  });
  
  var test = new MyTest();
  assert.throwsError(function() {
    test.testFail()
  }, AssertionError);  

  delete global.MyTest;
}


//exports.testLoader = function()
//{
//  var suite = new qx.dev.unit.TestSuite();
//  
//  require("qx/test/Class");
//  suite.add(qx.test.Class);
//  
//  var testResult = new qx.dev.unit.TestResult();
//  
//  testResult.addListener("failure", function(e)
//  {
//    var ex = e.getData().exception;
//    var test = e.getData().test;
//    print("Test '" + test.getFullName() + "' failed: " + ex.message + " - " + ex.getComment());
//    print("Stack trace: " + ex.getStackTrace().join("\n"));
//  });
//
//  testResult.addListener("error", function(e)
//  {
//    var ex = e.getData().exception;
//    print("The test '" + e.getData().test.getFullName() + "' had an error: " + ex);
//  });
//
//  testResult.addListener("endTest", function(e)
//  {
//    print("Finished test '" + e.getData().test.getFullName() + "'");
//  });
//
//  suite.run(testResult);
//}


if (require.main === module.id)
    require("os").exit(require("test/runner").run(exports));
