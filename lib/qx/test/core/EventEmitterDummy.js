var window = require('qxglobals').global;
require('qx/Class');
require('qx/core/Object');
qx.Class.define("qx.test.core.EventEmitterDummy",
{
  extend    : qx.core.Object,
  events : {
    "plain" : "qx.event.type.Event",
    "error" : "qx.__12345__",
    "data" : "qx.event.type.Data",
    "eventName" : "qx.event.type.Data"
  }
});
exports.EventEmitterDummy = qx.test.core.EventEmitterDummy;