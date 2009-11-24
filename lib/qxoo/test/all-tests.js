exports.testAssert = require("./Assert");
exports.testBootstrap = require("./Bootstrap");
exports.testClass = require("./Class");
exports.testEvents = require("./Event");
exports.testTestCase = require("./TestCase");
exports.testTestSuite = require("./TestSuite");

if (require.main === module.id)
    require("os").exit(require("test/runner").run(exports));