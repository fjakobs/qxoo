var FILE = require("file");

exports.Importer = Importer = function(qooxdooPath, libPath)
{
  this.basePath = qooxdooPath;
  this.libPath = libPath;
  this.sourcePath = FILE.path(this.basePath, "framework", "source", "class");
  
  this.CLASSES = {
    "qx.Bootstrap" : [],
    "qx.bom.client.Engine" : ["qx.Bootstrap"],
    "qx.core.Setting" : ["qx.Bootstrap"],
    "qx.core.Variant" : ["qx.Bootstrap", "qx.core.Setting", "qx.bom.client.Engine"],
    "qx.Mixin" : ["qx.Bootstrap", "qx.core.Variant"],
    "qx.Interface" : ["qx.Bootstrap", "qx.core.Variant"],
    "qx.core.Property" : ["qx.Bootstrap", "qx.core.Variant", "qx.core.Setting"],
    "qx.Class" : ["qx.Bootstrap", "qx.core.Variant", "qx.core.Property", "qx.Mixin", "qx.Interface"],
    
    "qx.core.ObjectRegistry" : ["qx.Bootstrap"],
    "qx.core.Object" : ["qx.Class", "qx.core.ObjectRegistry"],
    
    "qx.data.IListData" : ["qx.Interface"],
    "qx.lang.Type" : ["qx.Bootstrap", "qx.Class"],
    "qx.lang.String" : ["qx.Bootstrap", "qx.Class"],
    "qx.lang.Date" : ["qx.Class"],
    "qx.lang.Object" : ["qx.Class", "qx.core.Variant"],
    "qx.lang.Array" : ["qx.Bootstrap", "qx.Class", "qx.core.Variant", "qx.lang.Date", "qx.data.IListData"],
    "qx.lang.Function" : ["qx.Bootstrap", "qx.Class", "qx.lang.Array"],    
    
    "qx.dev.StackTrace" : ["qx.Class", "qx.core.Variant", "qx.lang.Array", "qx.lang.Function", "qx.core.ObjectRegistry"],
    "qx.type.BaseError" : ["qx.Class"],
    "qx.core.AssertionError" : ["qx.Class", "qx.type.BaseError", "qx.dev.StackTrace"],
    "qx.util.Json" : ["qx.Class", "qx.lang.Type", "qx.core.Setting"],
    "qx.core.Assert" : ["qx.Bootstrap", "qx.Class", "qx.core.AssertionError", "qx.lang.String", "qx.lang.Type", "qx.core.Object", "qx.util.Json"],
   
    "qx.util.ObjectPool" : ["qx.Class", "qx.core.Object"],
    "qx.event.Pool" : ["qx.Class", "qx.util.ObjectPool"],
    "qx.event.type.Event" : ["qx.Class", "qx.core.Object", "qx.core.Variant", "qx.core.Assert", "qx.event.Pool"],
    "qx.event.type.Data" : ["qx.Class", "qx.event.type.Event"],
    "qx.core.MBasicEvent" : ["qx.Mixin", "qx.core.ObjectRegistry", "qx.event.type.Event", "qx.event.type.Data", "qx.lang.Function", "qx.lang.Object"],
    
    "qx.core.MAssert" : ["qx.Mixin", "qx.core.Assert"],
    "qx.dev.unit.TestCase" : ["qx.Class", "qx.core.MAssert", "qx.core.Object", "qx.core.Variant", "qx.lang.Function"],
    
    "qx.dev.unit.TestFunction" : ["qx.Class", "qx.core.Object", "qx.dev.unit.TestCase", "qx.lang.Type"],
    "qx.dev.unit.AbstractTestSuite" : ["qx.Class", "qx.core.Object", "qx.dev.unit.TestFunction"],
    "qx.dev.unit.TestClass" : ["qx.Class", "qx.dev.unit.AbstractTestSuite", "qx.dev.unit.TestCase", "qx.lang.Function"],
    "qx.dev.unit.TestSuite" : ["qx.Class", "qx.dev.unit.AbstractTestSuite", "qx.lang.Type", "qx.dev.unit.TestCase", "qx.dev.unit.TestClass"],
   
    "qx.dev.unit.AsyncWrapper" : ["qx.Class", "qx.core.Object", "qx.lang.Type"],
    "qx.dev.unit.TestResult" : ["qx.Class", "qx.core.Object", "qx.type.BaseError", "qx.dev.unit.AsyncWrapper", "qx.core.AssertionError"],
    
    "qx.dev.Debug" : ["qx.Class", "qx.lang.Object"],
    "qx.test.Class" : ["qx.Class", "qx.dev.unit.TestCase", "qx.core.Setting", "qx.core.Variant", "qx.core.Object", "qx.dev.Debug"],
    "qx.test.Interface" : ["qx.Class", "qx.Interface", "qx.dev.unit.TestCase"],
    "qx.test.Mixin" : ["qx.Class", "qx.Mixin", "qx.dev.unit.TestCase"],
    "qx.test.lang.Array" : ["qx.Class", "qx.dev.unit.TestCase", "qx.lang.Array"],

    "qx.data.marshal.MEventBubbling" : ["qx.Mixin", "qx.Class", "qx.lang.Function", "qx.core.Object"],
    "qx.data.Array" : ["qx.Class", "qx.core.Object", "qx.data.marshal.MEventBubbling", "qx.data.IListData", "qx.lang.Array"],
    "qx.test.data.DataArray" : ["qx.Class", "qx.dev.unit.TestCase", "qx.data.Array"],
   
    "qx.log.appender.RingBuffer" : ["qx.Class"],
    "qx.log.Logger" : ["qx.Class", "qx.dev.StackTrace", "qx.core.Variant", "qx.lang.Function", "qx.Bootstrap", "qx.log.appender.RingBuffer", "qx.core.Object"],
    
    "qx.util.ColorUtil" : ["qx.Class"],
    "qx.core.ValidationError" : ["qx.Class", "qx.type.BaseError"],
    "qx.util.Validate" : ["qx.Class", "qx.core.ValidationError", "qx.util.ColorUtil"],
    
    "qx.data.Conversion" : ["qx.Class"],
    
    "qx.data.SingleValueBinding" : ["qx.Class", "qx.lang.String", "qx.lang.Function", "qx.data.IListData", "qx.core.ValidationError", "qx.log.Logger"],
    "qx.data.MBinding" : ["qx.Mixin", "qx.data.SingleValueBinding"],
    "qx.test.data.singlevalue.TextFieldDummy" : ["qx.Class", "qx.core.Object"],
    "qx.test.data.singlevalue.Simple" : ["qx.Class", "qx.dev.unit.TestCase", "qx.core.Object", "qx.data.SingleValueBinding", "qx.core.Variant", "qx.util.Validate", "qx.data.Conversion", "qx.test.data.singlevalue.TextFieldDummy"],
    "qx.test.data.singlevalue.Deep" : ["qx.Class", "qx.dev.unit.TestCase", "qx.core.Object", "qx.data.SingleValueBinding", "qx.core.Variant", "qx.data.Array", "qx.test.data.singlevalue.TextFieldDummy"],
    "qx.test.data.singlevalue.Array" : ["qx.Class", "qx.dev.unit.TestCase", "qx.core.Object", "qx.data.SingleValueBinding", "qx.core.Variant", "qx.core.Object", "qx.data.Array", "qx.test.data.singlevalue.TextFieldDummy"]
  }
}


Importer.prototype.importQooxdoo = function() 
{
  print("import ...");
  for (var cls in this.CLASSES)
  {
    var deps = this.CLASSES[cls];    
    this.importClass(cls, deps);
  }
}


Importer.prototype.importClass = function(className, deps)
{
  var classSplit = className.split(".");
  var file = FILE.path.apply(this, classSplit) + ".js";
  
  var sourceFile = FILE.path(this.sourcePath, file);
  var targetFile = FILE.path(this.libPath, file);
  var targetDir = FILE.path(targetFile.dirname());
  
  targetDir.mkdirs();
  
  var content = sourceFile.read();
  
  var basename = classSplit[classSplit.length-1];
  var footer = "exports." + basename + " = " + className + ";";
  targetFile.write(this.header(deps) + content + footer);
}


Importer.prototype.header = function(deps) 
{
  var header = "var window = require('qxglobals').global;\n";
  if (deps.length) {
    var deps = deps.map(function(dep) {return dep.replace(/\./g, "/")});
    header += "require('" + deps.join("');\nrequire('") + "');\n";
  }
  return header;
}