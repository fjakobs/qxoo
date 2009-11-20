var assert = require("test/assert");
var Assert = require("qx/core/Assert").Assert;
var AssertionError = require("qx/core/AssertionError").AssertionError;

exports.testAssertTrue = function() {
  Assert.assertTrue(true);
  assert.throwsError(function() {
    Assert.assertTrue(false);
  }, AssertionError);
}

if (require.main === module.id)
    require("os").exit(require("test/runner").run(exports));
