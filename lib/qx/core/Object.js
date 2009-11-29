var window = require('qxglobals').global;
require('qx/Class');
require('qx/core/ObjectRegistry');
/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2004-2008 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Sebastian Werner (wpbasti)
     * Andreas Ecker (ecker)
     * Fabian Jakobs (fjakobs)

************************************************************************ */

/* ************************************************************************

#require(qx.core.Property)
#require(qx.core.ObjectRegistry)

************************************************************************ */

/**
 * The qooxdoo root class. All other classes are direct or indirect subclasses of this one.
 *
 * This class contains methods for:
 *
 * * object management (creation and destruction)
 * * interfaces for event system
 * * generic setter/getter support
 * * interfaces for logging console
 * * user friendly OO interfaces like {@link #self} or {@link #base}
 */
qx.Class.define("qx.core.Object",
{
  extend : Object,

  /*
  *****************************************************************************
     CONSTRUCTOR
  *****************************************************************************
  */

  /**
   * Create a new instance
   */
  construct : function() {
    qx.core.ObjectRegistry.register(this);
  },




  /*
  *****************************************************************************
     STATICS
  *****************************************************************************
  */

  statics :
  {
    /** Internal type */
    $$type : "Object"
  },






  /*
  *****************************************************************************
     MEMBERS
  *****************************************************************************
  */

  members :
  {
    /*
    ---------------------------------------------------------------------------
      BASICS
    ---------------------------------------------------------------------------
    */

    /**
     * Return unique hash code of object
     *
     * @return {Integer} unique hash code of the object
     */
    toHashCode : function() {
      return this.$$hash;
    },


    /**
     * Returns a string representation of the qooxdoo object.
     *
     * @return {String} string representation of the object
     */
    toString : function() {
      return this.classname + "[" + this.$$hash + "]";
    },


    /**
     * Call the same method of the super class.
     *
     * @param args {arguments} the arguments variable of the calling method
     * @param varags {var} variable number of arguments passed to the overwritten function
     * @return {var} the return value of the method of the base class.
     */
    base : function(args, varags)
    {
      if (qx.core.Variant.isSet("qx.debug", "on"))
      {
        if (!qx.Bootstrap.isFunction(args.callee.base)) {
          throw new Error(
            "Cannot call super class. Method is not derived: " +
            args.callee.displayName
          );
        }
      }

      if (arguments.length === 1) {
        return args.callee.base.call(this);
      } else {
        return args.callee.base.apply(this, Array.prototype.slice.call(arguments, 1));
      }
    },


    /**
     * Returns the static class (to access static members of this class)
     *
     * @param args {arguments} the arguments variable of the calling method
     * @return {var} the return value of the method of the base class.
     */
    self : function(args) {
      return args.callee.self;
    },





    /*
    ---------------------------------------------------------------------------
      CLONE/SERIALIZE SUPPORT
    ---------------------------------------------------------------------------
    */

    /**
     * EXPERIMENTAL - NOT READY FOR PRODUCTION
     *
     * Returns a clone of this object. Copies over all user configured
     * property values. Do not configure a parent nor apply the appearance
     * styles directly.
     *
     * @return {qx.core.Object} The clone
     */
    clone : function()
    {
      var clazz = this.constructor
      var clone = new clazz;
      var props = qx.Class.getProperties(clazz);
      var user = qx.core.Property.$$store.user;
      var setter = qx.core.Property.$$method.set;
      var name;

      // Iterate through properties
      for (var i=0, l=props.length; i<l; i++)
      {
        name = props[i];
        if (this.hasOwnProperty(user[name])) {
          clone[setter[name]](this[user[name]]);
        }
      }

      // Return clone
      return clone;
    },


    /**
     * EXPERIMENTAL - NOT READY FOR PRODUCTION
     *
     * Returns a json map of the object configuration.
     *
     * @return {Map} The json result
     */
    serialize : function()
    {
      var clazz = this.constructor
      var props = qx.Class.getProperties(clazz);
      var user = qx.core.Property.$$store.user;
      var name, value;

      var result =
      {
        classname : clazz.classname,
        properties : {}
      };

      // Iterate through properties
      for (var i=0, l=props.length; i<l; i++)
      {
        name = props[i];
        if (this.hasOwnProperty(user[name]))
        {
          value = this[user[name]];
          if (value instanceof qx.core.Object) {
            result.properties[name] = { $$hash : value.$$hash };
          } else {
            result.properties[name] = value;
          }
        }
      }

      // Return clone
      return result;
    },




    /*
    ---------------------------------------------------------------------------
      COMMON SETTER/GETTER/RESETTER SUPPORT
    ---------------------------------------------------------------------------
    */

    /**
     * Sets multiple properties at once by using a property list or
     * sets one property and its value by the first and second argument.
     * As a fallback, if no generated property setter could be found, a
     * handwritten setter will be searched and invoked if available.
     *
     * @param data {Map | String} a map of property values. The key is the name of the property.
     * @param value {var?} the value, only used when <code>data</code> is a string.
     * @return {Object} this instance.
     * @throws an Exception if a property defined does not exist
     */
    set : function(data, value)
    {
      var setter = qx.core.Property.$$method.set;

      if (qx.Bootstrap.isString(data))
      {
        if (!this[setter[data]])
        {
          if (this["set" + qx.Bootstrap.firstUp(data)] != undefined) {
            this["set" + qx.Bootstrap.firstUp(data)](value);
            return;
          }

          if (qx.core.Variant.isSet("qx.debug", "on"))
          {
            qx.Bootstrap.error("No such property: " + data);
            return this;
          }
        }


        return this[setter[data]](value);
      }
      else
      {
        for (var prop in data)
        {
          if (!this[setter[prop]])
          {
            if (this["set" + qx.Bootstrap.firstUp(prop)] != undefined) {
              this["set" + qx.Bootstrap.firstUp(prop)](data[prop]);
              continue;
            }

            if (qx.core.Variant.isSet("qx.debug", "on"))
            {
              qx.Bootstrap.error("No such property: " + prop);
              return this;
            }
          }

          this[setter[prop]](data[prop]);
        }

        return this;
      }
    },


    /**
     * Returns the value of the given property. If no generated getter could be
     * found, a fallback tries to access a handwritten getter.
     *
     * @param prop {String} Name of the property.
     * @return {var} The value of the value
     * @throws an Exception if a property defined does not exist
     */
    get : function(prop)
    {
      var getter = qx.core.Property.$$method.get;

      if (!this[getter[prop]])
      {
        if (this["get" + qx.Bootstrap.firstUp(prop)] != undefined) {
          return this["get" + qx.Bootstrap.firstUp(prop)]();
        }

        if (qx.core.Variant.isSet("qx.debug", "on"))
        {
          qx.Bootstrap.error("No such property: " + prop);
          return this;
        }
      }


      return this[getter[prop]]();
    },


    /**
     * Resets the value of the given property. If no generated resetter could be
     * found, a handwritten resetter will be invoked, if available.
     *
     * @param prop {String} Name of the property.
     * @throws an Exception if a property defined does not exist
     */
    reset : function(prop)
    {
      var resetter = qx.core.Property.$$method.reset;

      if (!this[resetter[prop]])
      {
        if (this["reset" + qx.Bootstrap.firstUp(prop)] != undefined) {
          this["reset" + qx.Bootstrap.firstUp(prop)]();
          return;
        }

        if (qx.core.Variant.isSet("qx.debug", "on"))
        {
          qx.Bootstrap.error("No such property: " + prop);
          return this;
        }
      }


      this[resetter[prop]]();
    },



    /*
    ---------------------------------------------------------------------------
      USER DATA
    ---------------------------------------------------------------------------
    */

    /** {Map} stored user data */
    __userData : null,


    /**
     * Store user defined data inside the object.
     *
     * @param key {String} the key
     * @param value {Object} the value of the user data
     * @return {void}
     */
    setUserData : function(key, value)
    {
      if (!this.__userData) {
        this.__userData = {};
      }

      this.__userData[key] = value;
    },


    /**
     * Load user defined data from the object
     *
     * @param key {String} the key
     * @return {Object} the user data
     */
    getUserData : function(key)
    {
      if (!this.__userData) {
        return null;
      }
      var data = this.__userData[key];
      return data === undefined ? null : data;
    },


    /*
    ---------------------------------------------------------------------------
      DEBUG
    ---------------------------------------------------------------------------
    */
  
  
    /**
     * Logs a debug message.
     *
     * @param msg {var} the message to log. If this is not a string, the
     *          object dump will be logged.
     * @return {void}
     */
    debug : function(msg) {
      qx.Bootstrap.debug(this, msg);
    },
  
  
    /**
     * Logs an info message.
     *
     * @param msg {var} the message to log. If this is not a string, the
     *      object dump will be logged.
     * @return {void}
     */
    info : function(msg) {
      qx.Bootstrap.info(this, msg);
    },
  
  
    /**
     * Logs a warning message.
     *
     * @param msg {var} the message to log. If this is not a string, the
     *      object dump will be logged.
     * @return {void}
     */
    warn : function(msg) {
      qx.Bootstrap.warn(this, msg);
    },
  
  
    /**
     * Logs an error message.
     *
     * @param msg {var} the message to log. If this is not a string, the
     *      object dump will be logged.
     * @return {void}
     */
    error : function(msg) {
      qx.Bootstrap.error(this, msg);
    },
  
  
    /**
     * Prints the current stack trace
     *
     * @return {void}
     */
    trace : function() {
      qx.Bootstrap.trace(this);
    },

    
    /*
    ---------------------------------------------------------------------------
      DISPOSER
    ---------------------------------------------------------------------------
    */

    /**
     * Returns true if the object is disposed.
     *
     * @return {Boolean} whether the object has been disposed
     */
    isDisposed : function() {
      return this.$$disposed || false;
    },


    /**
     * Dispose this object
     *
     * @return {void}
     */
    dispose : function()
    {
      // Check first
      if (this.$$disposed) {
        return;
      }

      // Mark as disposed (directly, not at end, to omit recursions)
      this.$$disposed = true;
      this.$$instance = null;
      this.$$allowconstruct = null;

      // Debug output
      if (qx.core.Variant.isSet("qx.debug", "on"))
      {
        if (qx.core.Setting.get("qx.disposerDebugLevel") > 1) {
          qx.Bootstrap.debug(this, "Disposing " + this.classname + "[" + this.toHashCode() + "]");
        }
      }

      // Deconstructor support for classes
      var clazz = this.constructor;
      var mixins;

      while (clazz.superclass)
      {
        // Processing this class...
        if (clazz.$$destructor) {
          clazz.$$destructor.call(this);
        }

        // Destructor support for mixins
        if (clazz.$$includes)
        {
          mixins = clazz.$$flatIncludes;

          for (var i=0, l=mixins.length; i<l; i++)
          {
            if (mixins[i].$$destructor) {
              mixins[i].$$destructor.call(this);
            }
          }
        }

        // Jump up to next super class
        clazz = clazz.superclass;
      }

      // Additional checks
      if (qx.core.Variant.isSet("qx.debug", "on"))
      {
        if (qx.core.Setting.get("qx.disposerDebugLevel") > 0)
        {
          var key, value;
          for (key in this)
          {
            value = this[key];

            // Check for Objects but respect values attached to the prototype itself
            if (value !== null && typeof value === "object" && !(qx.Bootstrap.isString(value)))
            {
              // Check prototype value
              // undefined is the best, but null may be used as a placeholder for
              // private variables (hint: checks in qx.Class.define). We accept both.
              if (this.constructor.prototype[key] != null) {
                continue;
              }

              qx.Bootstrap.warn(this, "Missing destruct definition for '" + key + "' in " + this.classname + "[" + this.toHashCode() + "]: " + value);
              delete this[key];
            }
          }
        }
      }
    },


    /*
    ---------------------------------------------------------------------------
      DISPOSER UTILITIES
    ---------------------------------------------------------------------------
    */

    /**
     * Disconnects given fields from instance.
     *
     * @param varargs {arguments} List of fields to dispose
     * @deprecated Performance: Don't use '_disposeFields' - instead
     *      assign directly to <code>null</code>
     */
    _disposeFields : function(varargs)
    {
      qx.log.Logger.deprecatedMethodWarning(
        arguments.callee,
        "Don't use '_disposeFields' - instead assign directly to 'null'"
      );

      qx.util.DisposeUtil.disposeFields(this, arguments);
    },


    /**
     * Disconnects and disposes given objects from instance.
     * Only works with qx.core.Object based objects e.g. Widgets.
     *
     * @param varargs {arguments} List of fields (which store objects) to dispose
     * @return {void}
     */
    _disposeObjects : function(varargs) {
      qx.util.DisposeUtil.disposeObjects(this, arguments);
    },


    /**
     * Disposes all members of the given array and deletes
     * the field which refers to the array afterwards.
     *
     * @param field {String} Name of the field which refers to the array
     * @return {void}
     */
    _disposeArray : function(field) {
      qx.util.DisposeUtil.disposeArray(this, field);
    },


    /**
     * Disposes all members of the given map and deletes
     * the field which refers to the map afterwards.
     *
     * @param field {String} Name of the field which refers to the map
     * @return {void}
     */
    _disposeMap : function(field) {
      qx.util.DisposeUtil.disposeMap(this, field);
    }
  },


  settings : {
    "qx.disposerDebugLevel" : 0
  },

  
  defer : function(statics)
  {
    // add asserts into each debug build
    if (qx.core.Variant.isSet("qx.debug", "on")) {
      qx.Class.include(qx.core.Object, qx.core.MAssert);
    }
  },
  

  destruct : function()
  {
    // Cleanup object registry
    qx.core.ObjectRegistry.unregister(this);

    // Cleanup user data
    this.__userData = null;

    // Cleanup properties
    // TODO: Is this really needed for non DOM/JS links?
    var store = qx.core.Property.$$store;
    var storeUser = store.user;
    var storeTheme = store.theme;
    var storeInherit = store.inherit;
    var storeUseinit = store.useinit;
    var storeInit = store.init;

    var properties = this.constructor.$$properties;
    if (properties)
    {
      for (var name in properties)
      {
        if (properties[name].dispose) {
          this[storeUser[name]] = this[storeTheme[name]] = this[storeInherit[name]] = this[storeUseinit[name]] = this[storeInit[name]] = undefined;
        }
      }
    }
  }
});
exports.Object = qx.core.Object;