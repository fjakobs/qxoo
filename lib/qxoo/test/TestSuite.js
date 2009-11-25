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


exports.testTestRunner = function()
{
  var TestRunner = require("./NarwhalRunner").TestRunner;
  new TestRunner().add(require("qx/test/Class").Class).run();
}


if (require.main === module.id)
    require("os").exit(require("test/runner").run(exports));
