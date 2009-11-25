require("qx");
var TestResult = require("qx/dev/unit/TestResult").TestResult;
var TestSuite = require("qx/dev/unit/TestSuite").TestSuite;

exports.AbstractRunner = qx.Class.define("qx.dev.unit.AbstractRunner",
{
  extend: qx.core.Object,
  
  construct : function()
  {
    this._suite = new TestSuite();
    this._testResult = new TestResult();    
    
    this._addListeners();
  },
  
  members:
  {
    add : function(varargs)
    {
      for (var i=0; i<arguments.length; i++) {
        this._suite.add(arguments[i]);
      }
      return this;
    },
    
    
    run: function() {
      this._suite.run(this._testResult)
    },
    
    
    _addListeners : function()
    {
      throw new Error("abstract method");
    }
  }
});