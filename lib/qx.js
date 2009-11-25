exports.Bootstrap = require("qx/Bootstrap").Bootstrap;
exports.Interface = require("qx/Interface").Interface;
exports.Mixin = require("qx/Mixin").Mixin;
exports.Class = require("qx/Class").Class;

exports.Object = require("qx/core/Object").Object;
require("qx/core/MBasicEvent");

qx.Class.include(qx.core.Object, qx.core.MBasicEvent);