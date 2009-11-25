var window = require('qxglobals').global;
require('qx/Mixin');
require('qx/core/ObjectRegistry');
require('qx/event/type/Event');
require('qx/event/type/Data');
require('qx/lang/Function');
require('qx/lang/Object');
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
     * Fabian Jakobs (fjakobs)

************************************************************************ */

qx.Mixin.define("qx.core.MBasicEvent",
{
  members :
  {
    __getId : function(type, listener, self) 
    {
      return (
        type + "_" +
        qx.core.ObjectRegistry.toHashCode(listener) +
        (self ? qx.core.ObjectRegistry.toHashCode(self) : "")
      )
    },
    
    
    __createEvent : function(type, clazz, args)
    {
      var clazz = clazz || qx.event.type.Event;
      var event = qx.event.Pool.getInstance().getObject(clazz);
      if (!event) {
        return;
      }
      
      args ? event.init.apply(event, args) : event.init();
      
      if (type) {
        event.setType(type);
      }

      return event;
    },
    
    
    __poolEvent : function(event) {
      qx.event.Pool.getInstance().poolObject(event);
    },
  
    
    /**
     * Add event listener to this object.
     *
     * @param type {String} name of the event type
     * @param listener {Function} event callback function
     * @param self {Object ? null} reference to the 'this' variable inside the callback
     * @return {String} An opaque id, which can be used to remove the event listener
     *         using the {@link #removeListenerById} method.
     */
    addListener : function(type, listener, self)
    {
      this.__eventRegistry || (this.__eventRegistry = {});
      var id = this.__getId(type, listener, self);
      
      if (self) {
        var callback = qx.lang.Function.bind(listener, self);
      } else {
        callback = listener;
      }
      
      this.__eventRegistry[type] || (this.__eventRegistry[type] = {});
      this.__eventRegistry[type][id] = callback;
      
      return id;
    },


    /**
     * Add event listener to this object, which is only called once. After the
     * listener is called the event listener gets removed.
     *
     * @param type {String} name of the event type
     * @param listener {Function} event callback function
     * @param self {Object ? window} reference to the 'this' variable inside the callback
     * @return {String} An opaque id, which can be used to remove the event listener
     *         using the {@link #removeListenerById} method.
     */
    addListenerOnce : function(type, listener, self)
    {
      var callback = function(e)
      {
        listener.call(self||this, e);
        this.removeListener(type, callback, this);
      };

      return this.addListener(type, callback, this);
    },


    /**
     * Remove event listener from this object
     *
     * @param type {String} name of the event type
     * @param listener {Function} event callback function
     * @param self {Object ? null} reference to the 'this' variable inside the callback
     * @param capture {Boolean} Whether to remove the event listener of
     *   the bubbling or of the capturing phase.
     * @return {Boolean} Whether the event was removed successfully (was existend)
     */
    removeListener : function(type, listener, self)
    {
      if (this.$$disposed) {
        return false;
      }
      
      this.__eventRegistry || (this.__eventRegistry = {});
      var id = this.__getId(type, listener, self);
      
      try {      
        delete this.__eventRegistry[type][id];
      } catch (e) {
        return false;
      }
      
      return true;
    },


    /**
     * Removes an event listener from an event target by an id returned by
     * {@link #addListener}
     *
     * @param id {String} The id returned by {@link #addListener}
     * @return {Boolean} Whether the event was removed successfully (was existend)
     */
    removeListenerById : function(id)
    {
      if (this.$$disposed) {
        return false;
      }
      
      var type = id.split("_")[0];
      if (!type) {
        return false;
      }
      
      try {      
        delete this.__eventRegistry[type][id];
      } catch (e) {
        return false;
      }
      
      return true;
    },


    /**
     * Check if there are one or more listeners for an event type.
     *
     * @param type {String} name of the event type
     * @return {Boolean} Whether the object has a listener of the given type.
     */
    hasListener : function(type)
    {
      return !!(
        this.__eventRegistry &&
        this.__eventRegistry[type] &&
        qx.lang.Object.getLength(this.__eventRegistry[type]) > 0
      );
    },


    /**
     * Dispatch an event on this object
     *
     * @param event {qx.event.type.Event} event to dispatch
     * @return {Boolean} whether the event default was prevented or not.
     *     Returns true, when the event was NOT prevented.
     */
    dispatchEvent : function(event)
    {
      var type = event.getType();
      if (this.__eventRegistry && this.__eventRegistry[type])
      {
        var listeners = this.__eventRegistry[type];        
        for (var key in listeners) {
          listeners[key](event);
        }
      }
      
      var preventDefault = event.getDefaultPrevented();
      this.__poolEvent(event);
      return !preventDefault;        
    },


    /**
     * Creates and dispatches an event on this object.
     *
     * @param type {String} Event type to fire
     * @param clazz {Class?qx.event.type.Event} The event class
     * @param args {Array?null} Arguments, which will be passed to
     *       the event's init method.
     * @return {Boolean} whether the event default was prevented or not.
     *     Returns true, when the event was NOT prevented.
     */
    fireEvent : function(type, clazz, args)
    {
      if (this.$$disposed || (!this.hasListener(type))) {
        return true;
      }

      var event = this.__createEvent(type, clazz||null, args);
      this.dispatchEvent(event);
    },


    /**
     * Create an event object and dispatch it on this object.
     * The event dispatched with this method does never bubble! Use only if you
     * are sure that bubbling is not required.
     *
     * @param type {String} Event type to fire
     * @param clazz {Class?qx.event.type.Event} The event class
     * @param args {Array?null} Arguments, which will be passed to
     *       the event's init method.
     * @return {Boolean} whether the event default was prevented or not.
     *     Returns true, when the event was NOT prevented.
     */
    fireNonBubblingEvent : function(type, clazz, args) {
      return this.fireEvent(type, clazz, args);
    },


    /**
     * Creates and dispatches an non-bubbling data event on this object.
     *
     * @param type {String} Event type to fire
     * @param data {var} User defined data attached to the event object
     * @param oldData {var?null} The event's old data (optional)
     * @param cancelable {Boolean?false} Whether or not an event can have its default
     *     action prevented. The default action can either be the browser's
     *     default action of a native event (e.g. open the context menu on a
     *     right click) or the default action of a qooxdoo class (e.g. close
     *     the window widget). The default action can be prevented by calling
     *     {@link #preventDefault}
     * @return {Boolean} whether the event default was prevented or not.
     *     Returns true, when the event was NOT prevented.
     */
    fireDataEvent : function(type, data, oldData, cancelable)
    {
      if (!this.$$disposed)
      {
        if (oldData === undefined) {
          oldData = null;
        }
        return this.fireEvent(
          type, qx.event.type.Data, [data, oldData, !!cancelable]
        );
      }

      return true;
    }
  },


  destruct : function() {
    this.__eventRegistry = null;
  }
});
exports.MBasicEvent = qx.core.MBasicEvent;