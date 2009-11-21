exports.testAssert = require("./Assert");
exports.testBootstrap = require("./Bootstrap");
exports.testClass = require("./Class");
//exports.testHashes = require("./TestCase");

if (require.main === module.id)
    require("os").exit(require("test/runner").run(exports));