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
    "qx.lang.Array" : ["qx.Bootstrap", "qx.Class", "qx.core.Variant", "qx.lang.Date", "qx.data.IListData"],
    "qx.lang.Function" : ["qx.Bootstrap", "qx.Class", "qx.lang.Array"],    
    
    "qx.dev.StackTrace" : ["qx.Class", "qx.core.Variant", "qx.lang.Array", "qx.lang.Function", "qx.core.ObjectRegistry"],
    "qx.type.BaseError" : ["qx.Class"],
    "qx.core.AssertionError" : ["qx.Class", "qx.type.BaseError", "qx.dev.StackTrace"],
    "qx.util.Json" : ["qx.Class", "qx.lang.Type", "qx.core.Setting"],
    "qx.core.Assert" : ["qx.Bootstrap", "qx.Class", "qx.core.AssertionError", "qx.lang.String", "qx.lang.Type", "qx.core.Object", "qx.util.Json"],
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
  var header = "var qx = require('qx').qx, window = require('qx').window;\n";
  if (deps.length) {
    var deps = deps.map(function(dep) {return dep.replace(/\./g, "/")});
    header += "require('" + deps.join("');\nrequire('") + "');\n";
  }
  return header;
}