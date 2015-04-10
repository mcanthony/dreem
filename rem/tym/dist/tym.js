// Object
/** Provides support for Object.keys in IE8 and earlier.
    Taken from: http://whattheheadsaid.com/2010/10/a-safer-object-keys-compatibility-implementation */
Object.keys = Object.keys || (function() {
    var hasOwnProperty = Object.prototype.hasOwnProperty,
        hasDontEnumBug = !{toString:null}.propertyIsEnumerable("toString"),
        DontEnums = [
            'toString',
            'toLocaleString',
            'valueOf',
            'hasOwnProperty',
            'isPrototypeOf',
            'propertyIsEnumerable',
            'constructor'
        ],
        DontEnumsLength = DontEnums.length;
    
    return function(o) {
        if (typeof o !== "object" && typeof o !== "function" || o === null)
            throw new TypeError("Object.keys called on non-object");
        
        var result = [], n;
        for (n in o) {
            if (hasOwnProperty.call(o, n)) result.push(n);
        }
        
        if (hasDontEnumBug) {
            for (var i = 0; i < DontEnumsLength; ++i) {
                if (hasOwnProperty.call(o, DontEnums[i])) result.push(DontEnums[i]);
            }
        }
        
        return result
    }
})();

// Array
/** Provides support for Array.isArray in IE8 and earlier.
    Taken from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/isArray */
Array.isArray = Array.isArray || function(v) {
    return Object.prototype.toString.call(v) === "[object Array]"
};

// String
/** Provides support for String.trim in IE8 and earlier.
    Taken from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/Trim */
if (!String.prototype.trim) {
    String.prototype.trim = function() {
        return this.replace(/^\s+|\s+$/g,'')
    };
    String.prototype.trimLeft = function() {
        return this.replace(/^\s+/,'')
    };
    String.prototype.trimRight = function() {
        return this.replace(/\s+$/,'')
    };
};

// Date
/** Provides support for Date.now in IE8 and ealier.
    Taken from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/now */
Date.now = Date.now || function() {
    return new Date().getTime()
};


JS = {
  KEYWORD_SUPER:'callSuper',
  
  extend: function(destination, source, overwrite) {
    if (destination && source) {
      for (var field in source) {
        if (destination[field] !== source[field] && (overwrite || !destination.hasOwnProperty(field))) {
          destination[field] = source[field];
        }
      }
    }
    return destination;
  },
  
  makeClass: function(parent) {
    var constructor = function() {
      var init = this.initialize;
      return init ? init.apply(this, arguments) || this : this;
    };
    
    var bridge = function() {};
    bridge.prototype = (parent || Object).prototype;
    constructor.prototype = new bridge();
    
    return constructor;
  }
};

JS.Method = JS.makeClass();
JS.extend(JS.Method.prototype, {
  initialize: function(module, name, callable) {
    this.module = module;
    this.name = name;
    this.callable = callable;
    this._hasSuper = typeof callable === 'function' && callable.toString().indexOf(JS.KEYWORD_SUPER) !== -1;
  },

  call: function() {
    return this.callable.call.apply(this.callable, arguments);
  },

  apply: function(receiver, args) {
    return this.callable.apply(receiver, args);
  },

  compile: function(environment) {
    var method = this,
        callable = method.callable,
        keywordCallSuper = JS.Method.keywordCallSuper,
        superFunc = method._hasSuper && keywordCallSuper ? keywordCallSuper : null;
    
    return superFunc === null ? callable : function() {
      var prevValue, prevOwn, 
        existing = this[JS.KEYWORD_SUPER],
        doSuper = !existing || existing.__kwd__;
      
      if (doSuper) {
        prevValue = existing;
        prevOwn = this.hasOwnProperty(JS.KEYWORD_SUPER);
        var kwd = this[JS.KEYWORD_SUPER] = superFunc(method, environment, this, arguments);
        if (kwd) kwd.__kwd__ = true;
      }
      
      var returnValue = callable.apply(this, arguments);
      
      if (doSuper) {
        if (prevOwn) {
          this[JS.KEYWORD_SUPER] = prevValue;
        } else {
          delete this[JS.KEYWORD_SUPER];
        }
      }
      
      return returnValue;
    };
  }
});

JS.Method.create = function(module, name, callable) {
  return (callable && callable.__inc__ && callable.__fns__) || typeof callable !== 'function' ? callable : new this(module, name, callable);
};

JS.Method.compile = function(method, environment) {
  return method instanceof this ? method.compile(environment) : method;
};

JS.Module = JS.makeClass();
JS.extend(JS.Module.prototype, {
  initialize: function(name, methods, options) {
    this.__inc__ = [];
    this.__dep__ = [];
    this.__fns__ = {};
    this.__tgt__ = (options || {})._target;
    this.__anc__ = null;
    this.__mct__ = {};
    
    this.__displayName = name;
    
    this.include(methods, {_resolve:false});
  },

  /** Adds a single named method to a JS.Class/JS.Module. If you’re modifying 
      a class, the method instantly becomes available in instances of the 
      class, and in its subclasses.
      @param name:string The name of the method to add.
      @param callable:function The method implementation.
      @param options:object (optional)
      @returns void */
  define: function(name, callable, options) {
    this.__fns__[name] = JS.Method.create(this, name, callable);
    if ((options || {})._resolve !== false) this.resolve();
  },

  /** Mixes in a module to this module.
      @param module:JS.Module The module to mix in.
      @param options:object (optional)
      @returns JS.Module this module. */
  include: function(module, options) {
    if (module) {
      options = options || {};
      var extend  = module.extend,
          include = module.include,
          extended, field, value, mixins, i, n, resolveFalse;
      
      if (module.__fns__ && module.__inc__) {
        this.__inc__.push(module);
        module.__dep__.push(this);
        
        if (extended = options._extended) {
          // Meta programming hook: Called when a subclass is created of 
          // this module
          if (typeof module.extended === 'function') module.extended(extended);
        } else {
          // Meta programming hook: If you include() a module that has a 
          // singleton method called includedBy, that method will be called.
          if (typeof module.includedBy === 'function') module.includedBy(this);
        }
      } else {
        resolveFalse = {_resolve:false};
        if (this._ignore(extend)) {
          mixins = [].concat(extend);
          for (i = 0, n = mixins.length; i < n;) this.extend(mixins[i++]);
        }
        if (this._ignore(include)) {
          mixins = [].concat(include);
          for (i = 0, n = mixins.length; i < n;) this.include(mixins[i++], resolveFalse);
        }
        for (field in module) {
          if (module.hasOwnProperty(field)) {
            value = module[field];
            if ((field === 'extend' || field === 'include') && this._ignore(value)) continue;
            this.define(field, value, resolveFalse);
          }
        }
      }
      
      if (options._resolve !== false) this.resolve();
    }
    return this;
  },

  /** @private */
  _ignore: function(value) {
    return typeof value !== 'function' || (value.__fns__ && value.__inc__);
  },

  resolve: function(host) {
    host = host || this;
    var target = host.__tgt__,
        inc = this.__inc__,
        fns = this.__fns__,
        i, n, key, compiled;
    
    if (host === this) {
      this.__anc__ = null;
      this.__mct__ = {};
      i = this.__dep__.length;
      while (i) this.__dep__[--i].resolve();
    }

    if (target) {
      for (i = 0, n = inc.length; i < n;) inc[i++].resolve(host);
      
      for (key in fns) {
        compiled = JS.Method.compile(fns[key], host);
        if (target[key] !== compiled) target[key] = compiled;
      }
    }
  },

  /** Gets the ancestor classes array.
      @param list:array (optional) An array of ancestors that will have
        ancestor classes pushed onto. If not provided a new array will
        be created.
      @return array */
  ancestors: function(list) {
    var cachable = !list,
        inc = this.__inc__;
    list = list || [];
    
    if (cachable && this.__anc__) return this.__anc__.slice();
    
    for (var i = 0, n = inc.length; i < n;) inc[i++].ancestors(list);
    
    if (list.indexOf(this) < 0) list.push(this);
    
    if (cachable) this.__anc__ = list.slice();
    return list;
  },

  /** Gets an array of JS.Methods for the provided method name.
      @param name:string The name of the method to lookup.
      @return array An array of JS.Methods from the ancestors chain. */
  lookup: function(name) {
    var cached = this.__mct__[name];
    if (cached) return cached.slice();
    
    var ancestors = this.ancestors(), 
      n = ancestors.length,
      methods = [], fns, i = 0;
    for (; i < n;) {
      fns = ancestors[i++].__fns__;
      if (fns.hasOwnProperty(name)) methods.push(fns[name]);
    }
    this.__mct__[name] = methods.slice();
    return methods;
  },

  /** Checks if this module includes the provided module.
      @param module:JS.Module The module to check for.
      @return boolean True if the module is included, otherwise false. */
  includes: function(module) {
    if (module === this) return true;
    
    var inc = this.__inc__, n = inc.length, i = 0;
    for (; i < n;) {
      if (inc[i++].includes(module)) return true;
    }
    return false;
  },

  /** Extracts a single named method from a module.
      @param name:string The name of the method to extract.
      @return JS.Method The extracted method. */
  instanceMethod: function(name) {
    return this.lookup(name).pop();
  }
});

JS.Kernel = new JS.Module('Kernel', {
  __eigen__: function() {
    var meta = this.__meta__;
    if (meta) return meta;
    meta = this.__meta__ = new JS.Module('', null, {_target: this});
    return meta.include(this.klass, {_resolve: false});
  },

  equals: function(other) {
    return this === other;
  },

  extend: function(module, options) {
    if (module) this.__eigen__().include(module, {_extended:this, _resolve:(options || {})._resolve});
    return this;
  },

  /** Checks if this object includes, extends or is the provided module.
      @param module:JS.Module The module to check for.
      @return boolean */
  isA: function(module) {
    return (typeof module === 'function' && this instanceof module) || this.__eigen__().includes(module);
  },

  method: function(name) {
    var cache = this.__mct__ || (this.__mct__ = {}),
        value = cache[name],
        field = this[name];
    
    if (typeof field !== 'function') return field;
    if (value && field === value._value) return value._bound;
    
    var bound = field.bind(this);
    cache[name] = {_value:field, _bound:bound};
    return bound;
  }
});

JS.Class = JS.makeClass(JS.Module);
JS.extend(JS.Class.prototype, {
  initialize: function(name, parent, methods, options) {
    if (typeof parent !== 'function') {
      options = methods;
      methods = parent;
      parent  = Object;
    }
    
    JS.Module.prototype.initialize.call(this, name);
    
    var resolve = (options || {})._resolve,
      resolveFalse = {_resolve:false},
      klass = JS.makeClass(parent);
    JS.extend(klass, this);
    klass.prototype.constructor = klass.prototype.klass = klass;
    klass.__eigen__().include(parent.__meta__, {_resolve:resolve});
    klass.__tgt__ = klass.prototype;
    
    var parentModule = parent === Object ? {} : (parent.__fns__ ? parent : new JS.Module(parent.prototype, resolveFalse));
    klass.include(JS.Kernel, resolveFalse).include(parentModule, resolveFalse).include(methods, resolveFalse);
     
    if (resolve !== false) klass.resolve();
    
    // Meta programming hook: If a class has a class method called inheritedBy() 
    // it will be called whenever you create a subclass of it
    if (typeof parent.inheritedBy === 'function') parent.inheritedBy(klass);
    
    return klass;
  }
});

(function() {
  var JS_METHOD = JS.Method, JS_KERNEL = JS.Kernel, 
    JS_CLASS = JS.Class, JS_MODULE = JS.Module,
    classify = function(klass, parent) {
      klass.__inc__ = [];
      klass.__dep__ = [];
      var proto = klass.prototype,
        methods = {}, 
        field;
      for (field in proto) {
        if (proto.hasOwnProperty(field)) methods[field] = JS_METHOD.create(klass, field, proto[field]);
      }
      klass.__fns__ = methods;
      klass.__tgt__ = proto;
      
      proto.constructor = proto.klass = klass;
      
      JS.extend(klass, JS_CLASS.prototype);
      klass.include(parent);
      
      klass.constructor = klass.klass = JS_CLASS;
    };
  classify(JS_METHOD, JS_KERNEL);
  classify(JS_MODULE, JS_KERNEL);
  classify(JS_CLASS,  JS_MODULE);
  
  var eigen = JS_KERNEL.instanceMethod('__eigen__');
  eigen.call(JS_METHOD).resolve();
  eigen.call(JS_MODULE).resolve();
  eigen.call(JS_CLASS).include(JS_MODULE.__meta__);
})();

// Must come after classification.
JS.Method.keywordCallSuper = function(method, env, receiver, args) {
  var methods = env.lookup(method.name),
      stackIndex = methods.length - 1,
      params = Array.prototype.slice.call(args);
  
  if (stackIndex === 0) return undefined;
  
  var _super = function() {
    var i = arguments.length;
    while (i) params[--i] = arguments[i];
    
    stackIndex--;
    if (stackIndex === 0) delete receiver[JS.KEYWORD_SUPER];
    var returnValue = methods[stackIndex].apply(receiver, params);
    receiver[JS.KEYWORD_SUPER] = _super;
    stackIndex++;
    
    return returnValue;
  };
  
  return _super;
};

/** Create a single instance of a "private" class. */
JS.Singleton = new JS.Class('Singleton', {
  initialize: function(name, parent, methods) {
    return new (new JS.Class(name, parent, methods));
  }
});

/**
 * Copyright (c) 2015 Teem2 LLC
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
tym = {
    /** Used to generate globally unique IDs. */
    __GUID_COUNTER: 0,
    
    /** Generates a globally unique id, (GUID).
        @return number */
    generateGuid: function() {
        return ++this.__GUID_COUNTER;
    },
    
    /** Takes a '.' separated string such as "foo.bar.baz" and resolves it
        into the value found at that location relative to a starting scope.
        If no scope is provided global scope is used.
        @param objName:string|array The name to resolve or an array of path
            parts in descending order.
        @param scope:Object (optional) The scope to resolve from. If not
            provided global scope is used.
        @returns The referenced object or undefined if resolution failed. */
    resolveName: function(objName, scope) {
        if (!objName || objName.length === 0) return undefined;
        
        var scope = scope || global,
            parts = Array.isArray(objName) ? objName : objName.split("."),
            i = 0, len = parts.length;
        for (; i < len; ++i) {
            scope = scope[parts[i]];
            if (!scope) {
                console.warn("resolveName failed for:", objName, "at part:", i, parts[i]);
                return undefined;
            }
        }
        return scope;
    },
    
    /** Used to wrap the first function with the second function. The first
        function is exposed as this.callSuper within the wrapper function.
        @param fn:function the function to wrap.
        @param wrapperFn:function the wrapper function.
        @returns a wrapped function. */
    wrapFunction: function(fn, wrapperFn) {
        return function() {
            // Store existing callSuper function so we can put it back later.
            var oldSuper = this.callSuper;
            
            // Assign new callSuper and execute wrapperFn
            this.callSuper = fn;
            var retval = wrapperFn.apply(this, arguments);
            
            // Restore existing callSuper or delete new callSuper
            if (oldSuper !== undefined) {
                this.callSuper = oldSuper;
            } else {
                delete this.callSuper;
            }
            
            return retval;
        };
    },
    
    /** A wrapper on myt.global.error.notify
        @param err:Error/string The error or message to dump stack for.
        @param type:string (optional) The type of console message to write.
            Allowed values are 'error', 'warn', 'log' and 'debug'. Defaults to
            'error'.
        @returns void */
    dumpStack: function(err, type) {
        tym.global.error.notify(type || 'error', err, err, err);
    },
    
    // Misc
    /** Memoize a function.
        @param f:function The function to memoize
        @returns function: The memoized function. */
    memoize: function(f) {
        return function() {
            var hash = JSON.stringify(arguments),
                cache = f.__cache || (f.__cache = {});
            return (hash in cache) ? cache[hash] : cache[hash] = f.apply(this, arguments);
        };
    },
    
    /** Copies properties from the source objects to the target object.
        @param targetObj:object The object that properties will be copied into.
        @param sourceObj:object The object that properties will be copied from.
        @param arguments... Additional arguments beyond the second will also
            be used as source objects and copied in order from left to right.
        @param mappingFunction:function (optional) If the last argument is a 
            function it will be used to copy values from the source to the
            target. The function will be passed three values, the key, the 
            target and the source. The mapping function should copy the
            source value into the target value if so desired.
        @returns The target object. */
    extend: function(targetObj, sourceObj) {
        var iterable = targetObj, 
            result = iterable,
            args = arguments, argsLength = args.length, argsIndex = 0,
            key, mappingFunc, ownIndex, ownKeys, length;
        
        if (iterable) {
            if (argsLength > 2 && typeof args[argsLength - 1] === 'function') mappingFunc = args[--argsLength];
            
            while (++argsIndex < argsLength) {
                iterable = args[argsIndex];
                
                if (iterable) {
                    ownIndex = -1;
                    ownKeys = Object.keys(iterable);
                    length = ownKeys ? ownKeys.length : 0;
                    
                    while (++ownIndex < length) {
                        key = ownKeys[ownIndex];
                        if (mappingFunc) {
                            mappingFunc(key, result, iterable);
                        } else {
                            result[key] = iterable[key];
                        }
                    }
                }
            }
        }
        return result
    }
};


/** Apply this mixin to any Object that needs to fire events.
    
    Attributes:
        None
    
    Private Attributes:
        __obsbt:object Stores arrays of tym.Observers and method names 
            by event type
        __aet:object Stores active event type strings. An event type is active
            if it has been fired from this Observable as part of the current 
            call stack. If an event type is "active" it will not be fired 
            again. This provides protection against infinite event loops.
*/
tym.Observable = new JS.Module('Observable', {
    // Methods /////////////////////////////////////////////////////////////////
    /** Adds the observer to the list of event recipients for the event type.
        @param observer:tym.Observer The observer that will observe this
            observable. If methodName is a function this object will be the
            context for the function when it is called.
        @param methodName:string|function The name of the method to call, or
            a function, on the observer when the event fires.
        @param type:string The name of the event the observer will listen to.
        @returns boolean true if the observer was successfully attached, 
            false otherwise. */
    attachObserver: function(observer, methodName, type) {
        if (observer && methodName && type) {
            this.getObservers(type).push(methodName, observer);
            return true;
        }
        return false;
    },
    
    /** Removes the observer from the list of observers for the event type.
        @param observer:tym.Observer The observer that will no longer be
            observing this observable.
        @param methodName:string|function The name of the method that was
            to be called or the function to be called.
        @param type:string The name of the event the observer will no longer
            be listening to.
        @returns boolean true if the observer was successfully detached, 
            false otherwise. */
    detachObserver: function(observer, methodName, type) {
        if (observer && methodName && type) {
            var observersByType = this.__obsbt;
            if (observersByType) {
                var observers = observersByType[type];
                if (observers) {
                    // Remove all instances of the observer and methodName 
                    // combination.
                    var retval = false, i = observers.length;
                    while (i) {
                        // Ensures we decrement twice. First with --i, then 
                        // with i-- since the part after && may not be executed.
                        --i;
                        if (observer === observers[i--] && methodName === observers[i]) {
                            observers.splice(i, 2); // <- Detach Activity that detachAllObservers cares about.
                            retval = true;
                        }
                    }
                    return retval;
                }
            }
        }
        return false;
    },
    
    /** Removes all observers from this Observable.
        @returns void */
    detachAllObservers: function() {
        var observersByType = this.__obsbt;
        if (observersByType) {
            var observers, observer, methodName, i, type;
            for (type in observersByType) {
                observers = observersByType[type];
                i = observers.length;
                while (i) {
                    observer = observers[--i];
                    methodName = observers[--i];
                    
                    // If an observer is registered more than once the list may 
                    // get shortened by observer.detachFrom. If so, just 
                    // continue decrementing downwards.
                    if (observer && methodName) {
                        if (typeof observer.detachFrom !== 'function' || 
                            !observer.detachFrom(this, methodName, type)
                        ) {
                            // Observer may not have a detachFrom function or 
                            // observer may not have attached via 
                            // Observer.attachTo so do default detach activity 
                            // as implemented in Observable.detachObserver
                            observers.splice(i, 2);
                        }
                    }
                }
            }
        }
    },
    
    /** Gets an array of observers and method names for the provided type.
        The array is structured as:
            [methodName1, observerObj1, methodName2, observerObj2,...].
        @param type:string The name of the event to get observers for.
        @returns array: The observers of the event. */
    getObservers: function(type) {
        var observersByType = this.__obsbt || (this.__obsbt = {});
        return observersByType[type] || (observersByType[type] = []);
    },
    
    /** Checks if any observers exist for the provided event type.
        @param type:string The name of the event to check.
        @returns boolean: True if any exist, false otherwise. */
    hasObservers: function(type) {
        var observersByType = this.__obsbt;
        if (!observersByType) return false;
        var observers = observersByType[type];
        return observers && observers.length > 0;
    },
    
    /** Sends the provided Event to all observers for the provided event's type.
        The named method is called on each observer in the order they were 
        registered. If the called method returns true the Event is considerd 
        "consumed" and will not be sent to any other observers. Consuming an 
        event should be used when more than one observer may be listening for 
        an Event but only one observer needs to handle the Event.
        @param event:object The event to fire.
        @param observers:array (Optional) If provided the event will
            be sent to this specific list of observers and no others.
        @return void */
    fireEvent: function(event, observers) {
        if (event && event.source === this) {
            // Determine observers to use
            var type = event.type;
            observers = observers || (this.hasObservers(type) ? this.__obsbt[type] : null);
            
            // Fire event
            if (observers) this.__fireEvent(event, observers);
        }
    },
    
    /** Generates a new event from the provided type and value and fires it
        to the provided observers or the registered observers.
        @param type:string The event type to fire.
        @param value:* The value to set on the event.
        @param observers:array (Optional) If provided the event will
            be sent to this specific list of observers and no others.
        @returns void */
    fireNewEvent: function(type, value, observers) {
        // Determine observers to use
        observers = observers || (this.hasObservers(type) ? this.__obsbt[type] : null);
        
        // Fire event
        if (observers) this.__fireEvent({source:this, type:type, value:value}, observers); // Inlined from this.createEvent
    },
    
    /** Creates a new event with the type and value and using this as 
        the source.
        @param type:string The event type.
        @param value:* The event value.
        @returns An event object consisting of source, type and value. */
    createEvent: function(type, value) {
        return {source:this, type:type, value:value}; // Inlined in this.fireNewEvent
    },
    
    /** Fire the event to the observers.
        @private
        @param event:Object The event to fire.
        @param observers:array An array of method names and contexts to invoke
            providing the event as the sole argument.
        @returns void */
    __fireEvent: function(event, observers) {
        // Prevent "active" events from being fired again
        var activeEventTypes = this.__aet || (this.__aet = {}),
            type = event.type;
        if (activeEventTypes[type] === true) {
            tym.global.error.notifyError('eventLoop', "Attempt to refire active event: " + type);
        } else {
            // Mark event type as "active"
            activeEventTypes[type] = true;
            
            // Walk through observers backwards so that if the observer is
            // detached by the event handler the index won't get messed up.
            // FIXME: If necessary we could queue up detachObserver calls that 
            // come in during iteration or make some sort of adjustment to 'i'.
            var i = observers.length, observer, methodName;
            while (i) {
                observer = observers[--i]
                methodName = observers[--i];
                
                // Sometimes the list gets shortened by the method we called so
                // just continue decrementing downwards.
                if (observer && methodName) {
                    // Stop firing the event if it was "consumed".
                    try {
                        if (typeof methodName === 'function') {
                            if (methodName.call(observer, event)) break;
                        } else {
                            if (observer[methodName](event)) break;
                        }
                    } catch (err) {
                        tym.dumpStack(err);
                    }
                }
            }
            
            // Mark event type as "inactive"
            activeEventTypes[type] = false;
        }
    }
});


/** Provides a mechanism to remember which Observables this instance has 
    registered itself with. This can be useful when we need to cleanup the 
    instance later.
    
    When this module is used registration and unregistration must be done 
    using the methods below. Otherwise, it is possible for the relationship 
    between observer and observable to be broken.
    
    Events:
        None
    
    Attributes:
        None
    
    Private Attributes:
        __obt:object Stores arrays of Observables by event type
        __methodNameCounter:int Used to create unique method names when a
            callback should only be called once.
        __DO_ONCE_*:function The names used for methods that only get run
            one time. */
tym.Observer = new JS.Module('Observer', {
    // Methods /////////////////////////////////////////////////////////////////
    /** Does the same thing as this.attachToAndCallbackIfAttrNotEqual with
        a value of undefined.
        @param observable:tym.Observable the Observable to attach to.
        @param methodName:string the method name on this instance to execute.
        @param eventType:string the event type to attach for.
        @param attrName:string (optional: the eventType will be used if not
            provided) the name of the attribute on the Observable
            to pull the value from.
        @param once:boolean (optional) if true  this Observer will detach
            from the Observable after the event is handled once.
        @returns void */
    attachToAndCallbackIfAttrExists: function(observable, methodName, eventType, attrName, once) {
        this.attachToAndCallbackIfAttrNotEqual(observable, methodName, eventType, undefined, attrName, once);
    },
    
    /** Does the same thing as this.attachTo and also immediately calls the
        method if the provided attrName on the observable is exactly equal to 
        the provided value.
        @param observable:tym.Observable the Observable to attach to.
        @param methodName:string the method name on this instance to execute.
        @param eventType:string the event type to attach for.
        @param value:* the value to test equality against.
        @param attrName:string (optional: the eventType will be used if not
            provided) the name of the attribute on the Observable
            to pull the value from.
        @param once:boolean (optional) if true  this Observer will detach
            from the Observable after the event is handled once.
        @returns void */
    attachToAndCallbackIfAttrEqual: function(observable, methodName, eventType, value, attrName, once) {
        if (attrName === undefined) attrName = eventType;
        if (observable.get(attrName) === value) {
            this.syncTo(observable, methodName, eventType, attrName, once);
        } else {
            this.attachTo(observable, methodName, eventType, once);
        }
    },
    
    /** Does the same thing as this.attachTo and also immediately calls the
        method if the provided attrName on the observable does not exactly 
        equal the provided value.
        @param observable:tym.Observable the Observable to attach to.
        @param methodName:string the method name on this instance to execute.
        @param eventType:string the event type to attach for.
        @param value:* the value to test inequality against.
        @param attrName:string (optional: the eventType will be used if not
            provided) the name of the attribute on the Observable
            to pull the value from.
        @param once:boolean (optional) if true  this Observer will detach
            from the Observable after the event is handled once.
        @returns void */
    attachToAndCallbackIfAttrNotEqual: function(observable, methodName, eventType, value, attrName, once) {
        if (attrName === undefined) attrName = eventType;
        if (observable.get(attrName) !== value) {
            this.syncTo(observable, methodName, eventType, attrName, once);
        } else {
            this.attachTo(observable, methodName, eventType, once);
        }
    },
    
    /** Does the same thing as this.attachTo and also immediately calls the
        method with an event containing the attributes value. If 'once' is
        true no attachment will occur which means this probably isn't the
        correct method to use in that situation.
        @param observable:tym.Observable the Observable to attach to.
        @param methodName:string the method name on this instance to execute.
        @param eventType:string the event type to attach for.
        @param attrName:string (optional: the eventType will be used if not
            provided) the name of the attribute on the Observable
            to pull the value from.
        @param once:boolean (optional) if true  this Observer will detach
            from the Observable after the event is handled once.
        @returns void */
    syncTo: function(observable, methodName, eventType, attrName, once) {
        if (attrName === undefined) attrName = eventType;
        try {
            this[methodName](observable.createEvent(eventType, observable.get(attrName)));
        } catch (err) {
            tym.dumpStack(err);
        }
        
        // Providing a true value for once means we'll never actually attach.
        if (once) return;
        
        this.attachTo(observable, methodName, eventType, once);
    },
    
    /** Checks if this Observer is attached to the provided observable for
        the methodName and eventType.
        @param observable:tym.Observable the Observable to check with.
        @param methodName:string the method name on this instance to execute.
        @param eventType:string the event type to check for.
        @returns true if attached, false otherwise. */
    isAttachedTo: function(observable, methodName, eventType) {
        if (observable && methodName && eventType) {
            var observablesByType = this.__obt;
            if (observablesByType) {
                var observables = observablesByType[eventType];
                if (observables) {
                    var i = observables.length;
                    while (i) {
                        // Ensures we decrement twice. First with --i, then 
                        // with i-- since the part after && may not be executed.
                        --i;
                        if (observable === observables[i--] && methodName === observables[i]) return true;
                    }
                }
            }
        }
        return false;
    },
    
    /** Gets an array of observables and method names for the provided type.
        The array is structured as:
            [methodName1, observableObj1, methodName2, observableObj2,...].
        @param eventType:string the event type to check for.
        @returns an array of observables. */
    getObservables: function(eventType) {
        var observablesByType = this.__obt || (this.__obt = {});
        return observablesByType[eventType] || (observablesByType[eventType] = []);
    },
    
    /** Checks if any observables exist for the provided event type.
        @param eventType:string the event type to check for.
        @returns true if any exist, false otherwise. */
    hasObservables: function(eventType) {
        var observablesByType = this.__obt;
        if (!observablesByType) return false;
        var observables = observablesByType[eventType];
        return observables && observables.length > 0;
    },
    
    /** Registers this Observer with the provided Observable
        for the provided eventType.
        @param observable:tym.Observable the Observable to attach to.
        @param methodName:string the method name on this instance to execute.
        @param eventType:string the event type to attach for.
        @param once:boolean (optional) if true  this Observer will detach
            from the Observable after the event is handled once.
        @returns boolean true if the observable was successfully registered, 
            false otherwise. */
    attachTo: function(observable, methodName, eventType, once) {
        if (observable && methodName && eventType) {
            var observables = this.getObservables(eventType);
            
            // Setup wrapper method when 'once' is true.
            if (once) {
                var self = this, origMethodName = methodName;
                
                // Generate one time method name.
                if (this.__methodNameCounter === undefined) this.__methodNameCounter = 0;
                methodName = '__DO_ONCE_' + this.__methodNameCounter++;
                
                // Setup wrapper method that will do the detachFrom.
                this[methodName] = function(event) {
                    self.detachFrom(observable, methodName, eventType);
                    delete self[methodName];
                    return self[origMethodName](event);
                };
            }
            
            // Register this observer with the observable
            if (observable.attachObserver(this, methodName, eventType)) {
                observables.push(methodName, observable);
                return true;
            }
        }
        return false;
    },
    
    /** Unregisters this Observer from the provided Observable
        for the provided eventType.
        @param observable:tym.Observable the Observable to attach to.
        @param methodName:string the method name on this instance to execute.
        @param eventType:string the event type to attach for.
        @returns boolean true if one or more detachments occurred, false 
            otherwise. */
    detachFrom: function(observable, methodName, eventType) {
        if (observable && methodName && eventType) {
            // No need to unregister if observable array doesn't exist.
            var observablesByType = this.__obt;
            if (observablesByType) {
                var observables = observablesByType[eventType];
                if (observables) {
                    // Remove all instances of this observer/methodName/eventType 
                    // from the observable
                    var retval = false, i = observables.length;
                    while (i) {
                        --i;
                        if (observable === observables[i--] && methodName === observables[i]) {
                            if (observable.detachObserver(this, methodName, eventType)) {
                                observables.splice(i, 2);
                                retval = true;
                            }
                        }
                    }
                    
                    // Source wasn't found
                    return retval;
                }
            }
        }
        return false;
    },
    
    /** Tries to detach this Observer from all Observables it
        is attached to.
        @returns void */
    detachFromAllObservables: function() {
        var observablesByType = this.__obt;
        if (observablesByType) {
            var observables, i;
            for (var eventType in observablesByType) {
                observables = observablesByType[eventType];
                i = observables.length;
                while (i) observables[--i].detachObserver(this, observables[--i], eventType);
                observables.length = 0;
            }
        }
    }
});


/** Provides the ability to apply and release constraints.
    
    Events:
        None
    
    Attributes:
        None
    
    Private Attributes:
        __cbmn:object Holds arrays of constraints by method name.
*/
tym.Constrainable = new JS.Module('Constrainable', {
    include: [tym.Observer],
    
    
    // Methods /////////////////////////////////////////////////////////////////
    /** Creates a constraint. The method will be executed on this object
        whenever any of the provided observables fire the indicated event type.
        @param methodName:String The name of the method to call on this object.
        @param observables:array An array of observable/type pairs. An observer
            will attach to each observable for the event type.
        @returns void */
    applyConstraint: function(methodName, observables) {
        if (methodName && observables) {
            // Make sure an even number of observable/type was provided
            var len = observables.length;
            if (len % 2 !== 0) {
                console.log("Observables was not even.", this);
                return;
            }
            
            // Lazy instantiate constraints array.
            var constraints = this.__cbmn || (this.__cbmn = {});
            var constraint = constraints[methodName] || (constraints[methodName] = []);
            
            // Don't allow a constraint to be clobbered.
            if (constraint.length > 0) {
                console.log("Constraint already exists for " + methodName + " on " + this);
                return;
            }
            
            var observable, type, i = 0;
            for (; len !== i;) {
                observable = observables[i++];
                type = observables[i++];
                if (observable && type) {
                    this.attachTo(observable, methodName, type);
                    constraint.push(observable, type);
                }
            }
            
            // Call constraint method once so it can "sync" the constraint
            try {
                this[methodName]();
            } catch (err) {
                tym.dumpStack(err);
            }
        }
    },
    
    /** Removes a constraint.
        @returns void */
    releaseConstraint: function(methodName) {
        if (methodName) {
            // No need to remove if the constraint is already empty.
            var constraints = this.__cbmn;
            if (constraints) {
                var constraint = constraints[methodName];
                if (constraint) {
                    var i = constraint.length, type, observable;
                    while (i) {
                        type = constraint[--i];
                        observable = constraint[--i];
                        this.detachFrom(observable, methodName, type);
                    }
                    constraint.length = 0;
                }
            }
        }
    },
    
    /** Removes all constraints.
        @returns void */
    releaseAllConstraints: function() {
        var constraints = this.__cbmn;
        if (constraints) {
            for (var methodName in constraints) this.releaseConstraint(methodName);
        }
    }
});


/** Holds references to "global" objects. Fires events when these globals
    are registered and unregistered.
    
    Events:
        register<key>:object Fired when an object is stored under the key.
        unregister<key>:object Fired when an object is removed from the key.
*/
tym.global = new JS.Singleton('Global', {
    include: [tym.Observable],
    
    
    // Methods /////////////////////////////////////////////////////////////////
    /** Registers the provided global under the key. Fires a register<key>
        event. If a global is already registered under the key the existing
        global is unregistered first.
        @returns void */
    register: function(key, v) {
        if (this.hasOwnProperty(key)) {
            console.log("Warning: tym.global key in use: ", key);
            this.unregister(key);
        }
        this[key] = v;
        this.fireNewEvent('register' + key, v);
    },
    
    /** Unegisters the global for the provided key. Fires an unregister<key>
        event if the key exists.
        @returns void */
    unregister: function(key) {
        if (this.hasOwnProperty(key)) {
            var v = this[key];
            delete this[key];
            this.fireNewEvent('unregister' + key, v);
        } else {
            console.log("Warning: tym.global key not in use: ", key);
        }
    }
});


/** Common functions for the sprite package. */
tym.sprite = {
    /** Based on browser detection from: http://www.quirksmode.org/js/detect.html
        
        Events:
            none
        
        Attributes:
            browser:string The browser name.
            version:number The browser version number.
            os:string The operating system.
    */
    platform: (function() {
        var versionSearchString,
            
            searchString = function(data) {
                var dataItem, i = data.length;
                while (i) {
                    dataItem = data[--i];
                    versionSearchString = dataItem.ver || dataItem.id;
                    if ((dataItem.str && dataItem.str.indexOf(dataItem.sub) >= 0) || dataItem.prop) return dataItem.id;
                }
            },
            
            searchVersion = function(dataString) {
                var index = dataString.indexOf(versionSearchString);
                if (index >= 0) return parseFloat(dataString.substring(index + versionSearchString.length + 1));
            },
            
            userAgent = navigator.userAgent, 
            platform = navigator.platform, 
            unknown = 'UNKNOWN';
        
        return {
            browser:searchString([
                {str:userAgent,        sub:"OmniWeb", id:"OmniWeb",  ver:"OmniWeb/"},
                {prop:window.opera,                   id:"Opera",    ver:"Version"},
                {str:navigator.vendor, sub:"Apple",   id:"Safari",   ver:"Version"},
                {str:userAgent,        sub:"Firefox", id:"Firefox"},
                {str:userAgent,        sub:"Chrome",  id:"Chrome"},
                {str:userAgent,        sub:"MSIE",    id:"Explorer", ver:"MSIE"}
            ]) || unknown,
            
            version:searchVersion(userAgent) || searchVersion(navigator.appVersion) || unknown,
            
            os:searchString([
                {str:userAgent, sub:"iPhone", id:"iPhone/iPod"},
                {str:platform,  sub:"Linux",  id:"Linux"},
                {str:platform,  sub:"Mac",    id:"Mac"},
                {str:platform,  sub:"Win",    id:"Windows"}
            ]) || unknown,
        };
    })(),

    // Sprite Factory
    createSprite: function(view, attrs) {
        var spriteClass;
        if (view.isA(tym.View)) {
            spriteClass = tym.sprite.View;
        }
        
        return new spriteClass(view, attrs);
    },

    // Error Console
    setStackTraceLimit: function(v) {
        Error.stackTraceLimit = v;
        return v;
    },
    
    generateStacktrace: function(eventType, msg, err) {
        if (!err) err = new Error(msg || eventType);
        return err.stack || err.stacktrace;
    },
    
    console: {
        debug: function(msg) {console.debug(msg);},
        info: function(msg) {console.info(msg);},
        warn: function(msg) {console.warn(msg);},
        error: function(msg) {console.error(msg);}
    },
    
    // Event Listener Support
    /** Event listener code Adapted from:
            http://javascript.about.com/library/bllisten.htm
        A more robust solution can be found here:
            http://msdn.microsoft.com/en-us/magazine/ff728624.aspx */
    addEventListener: function() {
        if (global.addEventListener) {
            /** Adds an event listener to a dom element. 
                @param elem:DomElement the dom element to listen to.
                @param type:string the name of the event to listen to.
                @param callback:function the callback function that will be
                    registered for the event.
                @param capture:boolean (optional) indicates if the listener is 
                    registered during the capture phase or bubble phase.
                @returns void */
            return function(elem, type, callback, capture) {
                elem.addEventListener(type, callback, capture || false);
            };
        } else {
            return function(elem, type, callback) {
                var prop = type + callback;
                elem['e' + prop] = callback;
                elem[prop] = function(){elem['e' + prop](window.event);}
                elem.attachEvent('on' + type, elem[prop]);
            };
        }
    }(),
    removeEventListener: function() {
        if (global.addEventListener) {
            return function(elem, type, callback, capture) {
                elem.removeEventListener(type, callback, capture || false);
            };
        } else {
            return function(elem, type, callback) {
                var prop = type + callback;
                elem.detachEvent('on' + type, elem[prop]);
                elem[prop] = null;
                elem["e" + prop] = null;
            };
        }
    }(),
    
    preventDefault: function(platformEvent) {
        platformEvent.preventDefault();
    },
    
    // Focus Management
    focus: {
        lastTraversalWasForward: true,
        focusedView: null,
        prevFocusedView: null,
        focusedDom: null,
        
        /** Sets the currently focused view. */
        setFocusedView: function(v) {
            if (this.focusedView !== v) {
                this.prevFocusedView = this.focusedView; // Remember previous focus
                this.focusedView = v;
                if (v) this.focusedDom = null; // Wipe this since we have actual focus now.
                return true;
            } else {
                return false;
            }
        },
        
        /** Called by a FocusObservable when it has received focus.
            @param focusable:FocusObservable the view that received focus.
            @returns void. */
        notifyFocus: function(focusable) {
            if (this.focusedView !== focusable) tym.global.focus.setFocusedView(focusable);
        },
        
        /** Called by a FocusObservable when it has lost focus.
            @param focusable:FocusObservable the view that lost focus.
            @returns void. */
        notifyBlur: function(focusable) {
            if (this.focusedView === focusable) tym.global.focus.setFocusedView(null);
        },
        
        /** Clears the current focus.
            @returns void */
        clear: function() {
            if (this.focusedView) {
                this.focusedView.blur();
            } else if (this.focusedDom) {
                this.focusedDom.blur();
                this.focusedDom = null;
            }
        },
        
        /** Move focus to the next focusable element.
            @param ignoreFocusTrap:boolean If true focus traps will be skipped over.
            @returns void */
        next: function(ignoreFocusTrap) {
            var next = this.__focusTraverse(true, ignoreFocusTrap);
            if (next) next.focus();
        },
        
        /** Move focus to the previous focusable element.
            @param ignoreFocusTrap:boolean If true focus traps will be skipped over.
            @returns void */
        prev: function(ignoreFocusTrap) {
            var prev = this.__focusTraverse(false, ignoreFocusTrap);
            if (prev) prev.focus();
        },
        
        /** Traverse forward or backward from the currently focused view.
            @param isForward:boolean indicates forward or backward dom traversal.
            @param ignoreFocusTrap:boolean indicates if focus traps should be
                skipped over or not.
            @returns the new view to give focus to, or null if there is no view
                to focus on or an unmanaged dom element will receive focus. */
        __focusTraverse: function(isForward, ignoreFocusTrap) {
            this.lastTraversalWasForward = isForward;
            
            // Determine root element and starting element for traversal.
            var document = global.document,
                activeElem = document.activeElement, 
                rootElem = document.body,
                startElem = rootElem,
                elem = startElem,
                model, progModel,
                focusFuncName = isForward ? 'getNextFocus' : 'getPrevFocus';
            
            if (activeElem) {
                elem = startElem = activeElem;
                model = startElem.model;
                if (!model) model = this.__findModelForDomElement(startElem);
                if (model) {
                    var focusTrap = model.view.getFocusTrap(ignoreFocusTrap);
                    if (focusTrap) rootElem = focusTrap.sprite.platformObject;
                }
            }
            
            // Traverse
            while (elem) {
                if (elem.model && elem.model.view[focusFuncName] &&
                    (progModel = elem.model.view[focusFuncName]())
                ) {
                    // Programatic traverse
                    elem = progModel.sprite.platformObject;
                } else if (isForward) {
                    // Dom traverse forward
                    if (elem.firstChild) {
                        elem = elem.firstChild;
                    } else if (elem === rootElem) {
                        return startElem.model.view; // TODO: why?
                    } else if (elem.nextSibling) {
                        elem = elem.nextSibling;
                    } else {
                        // Jump up and maybe over since we're at a local
                        // deepest last child.
                        while (elem) {
                            elem = elem.parentNode;
                            
                            if (elem === rootElem) {
                                break; // TODO: why?
                            } else if (elem.nextSibling) {
                                elem = elem.nextSibling;
                                break;
                            }
                        }
                    }
                } else {
                    // Dom traverse backward
                    if (elem === rootElem) {
                        elem = this.__getDeepestDescendant(rootElem);
                    } else if (elem.previousSibling) {
                        elem = this.__getDeepestDescendant(elem.previousSibling);
                    } else {
                        elem = elem.parentNode;
                    }
                }
                
                // If we've looped back around return the starting element.
                if (elem === startElem) return startElem.model.view;
                
                // Check that the element is focusable and return it if it is.
                if (elem.nodeType === 1) {
                    model = elem.model;
                    if (model && model instanceof tym.sprite.View) {
                        if (model.view.isFocusable()) return model.view;
                    } else {
                        var nodeName = elem.nodeName;
                        if (nodeName === 'A' || nodeName === 'AREA' || 
                            nodeName === 'INPUT' || nodeName === 'TEXTAREA' || 
                            nodeName === 'SELECT' || nodeName === 'BUTTON'
                        ) {
                            if (!elem.disabled && !isNaN(elem.tabIndex) && 
                                tym.sprite.__isDomElementVisible(elem)
                            ) {
                                // Make sure the dom element isn't inside a maskFocus
                                model = this.__findModelForDomElement(elem);
                                if (model && model.view.searchAncestorsOrSelf(function(n) {return n.maskFocus === true;})) {
                                    // Is a masked dom element so ignore.
                                } else {
                                    elem.focus();
                                    this.focusedDom = elem;
                                    return null;
                                }
                            }
                        }
                    }
                }
            }
            
            return null;
        },
        
        /** Finds the closest model for the provided dom element.
            @param elem:domElement to element to start looking from.
            @returns tym.sprite.View or null if not found.
            @private */
        __findModelForDomElement: function(elem) {
            var model;
            while (elem) {
                model = elem.model;
                if (model && model instanceof tym.sprite.View) return model;
                elem = elem.parentNode;
            }
            return null;
        },
        
        /** Gets the deepest dom element that is a descendant of the provided
            dom element or the element itself.
            @param elem:domElement The dom element to search downward from.
            @returns a dom element.
            @private */
        __getDeepestDescendant: function(elem) {
            while (elem.lastChild) elem = elem.lastChild;
            return elem;
        }
    },
    
    // Dom Utility
    /** Gets the computed style for a dom element.
        @param elem:dom element the dom element to get the style for.
        @returns object the style object. */
    __getComputedStyle: function(elem) {
        // getComputedStyle is IE's proprietary way.
        var g = global;
        return g.getComputedStyle ? g.getComputedStyle(elem, '') : elem.currentStyle;
    },
    
    /** Tests if a dom element is visible or not.
        @param elem:DomElement the element to check visibility for.
        @returns boolean True if visible, false otherwise. */
    __isDomElementVisible: function(elem) {
        // Special Case: hidden input elements should be considered not visible.
        if (elem.nodeName === 'INPUT' && elem.type === 'hidden') return false;
        
        var style;
        while (elem) {
            if (elem === document) return true;
            
            style = this.__getComputedStyle(elem);
            if (style.display === 'none' || style.visibility === 'hidden') break;
            
            elem = elem.parentNode;
        }
        return false;
    }
};


/** Provides global error events and console logging.
    
    Events:
        Error specific events are broadcast. Here is a list of known error
        types.
            eventLoop: Fired by myt.Observable when an infinite event loop
                would occur.
    
    Attributes:
        stackTraceLimit:int Sets the size for stack traces.
        consoleLogging:boolean Turns logging to the console on and off.
*/
new JS.Singleton('GlobalError', {
    include: [tym.Observable],
    
    
    // Constructor /////////////////////////////////////////////////////////////
    initialize: function() {
        this.setStackTraceLimit(50);
        this.setConsoleLogging(true);
        tym.global.register('error', this);
    },
    
    
    // Accessors ///////////////////////////////////////////////////////////////
    setConsoleLogging: function(v) {
        this.consoleLogging = v;
    },
    
    setStackTraceLimit: function(v) {
        this.stackTraceLimit = tym.sprite.setStackTraceLimit(v);
    },
    
    
    // Methods /////////////////////////////////////////////////////////////////
    /** A wrapper on this.notify where consoleFuncName is 'error'. */
    notifyError: function(type, msg, err) {this.notify('error', type, msg, err);},
    
    /** A wrapper on this.notify where consoleFuncName is 'warn'. */
    notifyWarn: function(type, msg, err) {this.notify('warn', type, msg, err);},
    
    /** A wrapper on this.notify where consoleFuncName is 'log'. */
    notifyMsg: function(type, msg, err) {this.notify('log', type, msg, err);},
    
    /** A wrapper on this.notify where consoleFuncName is 'debug'. */
    notifyDebug: function(type, msg, err) {this.notify('debug', type, msg, err);},
    
    /** Broadcasts that an error has occurred and also logs the error to the
        console if so configured.
        @param consoleFuncName:string (optional) The name of the function to 
            call on the console. Standard values are:'error', 'warn', 'log'
            and 'debug'. If not provided no console logging will occur 
            regardless of the value of this.consoleLogging.
        @param evenType:string (optional) The type of the event that will be 
            broadcast. If not provided 'error' will be used.
        @param msg:* (optional) Usually a string, this is additional information
            that will be provided in the value object of the broadcast event.
        @param err:Error (optional) A javascript error object from which a
            stacktrace will be taken. If not provided a stacktrace will be
            automatically generated.
        @private */
    notify: function(consoleFuncName, eventType, msg, err) {
        var stacktrace = tym.sprite.generateStacktrace(eventType, msg, err);
        
        this.fireNewEvent(eventType || 'error', {msg:msg, stacktrace:stacktrace});
        if (this.consoleLogging && consoleFuncName) tym.sprite.console[consoleFuncName](stacktrace);
    }
});


/** Provides support for getter and setter functions on an object.
    
    Events:
        None
    
    Attributes:
        earlyAttrs:array An array of attribute names that will be set first.
        lateAttrs:array An array of attribute names that will be set last.
*/
tym.AccessorSupport = new JS.Module('AccessorSupport', {
    // Class Methods and Attributes ////////////////////////////////////////////
    extend: {
        /** Generate a setter name for an attribute.
            @returns string */
        generateSetterName: function(attrName) {
            return this.SETTER_NAMES[attrName] || (this.SETTER_NAMES[attrName] = this.generateName(attrName, 'set'));
        },
        
        /** Generate a getter name for an attribute.
            @returns string */
        generateGetterName: function(attrName) {
            return this.GETTER_NAMES[attrName] || (this.GETTER_NAMES[attrName] = this.generateName(attrName, 'get'));
        },
        
        /** Generates a method name by capitalizing the attrName and
            prepending the prefix.
            @returns string */
        generateName: function(attrName, prefix) {
            return prefix + attrName.substring(0,1).toUpperCase() + attrName.substring(1);
        },
        
        /** Creates a standard setter function for the provided attrName on the
            target. This assumes the target is an tym.Observable.
            @returns void */
        createSetterFunction: function(target, attrName) {
            var setterName = this.generateSetterName(attrName);
            if (target[setterName]) console.log("Overwriting setter", setterName);
            target[setterName] = function(v) {
                if (target[attrName] !== v) {
                    target[attrName] = v;
                    if (target.inited) target.fireNewEvent(attrName, v);
                }
            };
        },
        
        /** Creates a standard getter function for the provided attrName on the
            target.
            @returns void */
        createGetterFunction: function(target, attrName) {
            var getterName = this.generateGetterName(attrName);
            if (target[getterName]) console.log("Overwriting getter", getterName);
            target[getterName] = function() {
                return target[attrName];
            };
        },
        
        /** Caches getter names. */
        GETTER_NAMES:{},
        
        /** Caches setter names. */
        SETTER_NAMES:{}
    },
    
    
    // Methods /////////////////////////////////////////////////////////////////
    appendToEarlyAttrs: function() {Array.prototype.push.apply(this.earlyAttrs || (this.earlyAttrs = []), arguments);},
    prependToEarlyAttrs: function() {Array.prototype.unshift.apply(this.earlyAttrs || (this.earlyAttrs = []), arguments);},
    appendToLateAttrs: function() {Array.prototype.push.apply(this.lateAttrs || (this.lateAttrs = []), arguments);},
    prependToLateAttrs: function() {Array.prototype.unshift.apply(this.lateAttrs || (this.lateAttrs = []), arguments);},
    
    /** Calls a setter function for each attribute in the provided map.
        @param attrs:object a map of attributes to set.
        @returns void. */
    callSetters: function(attrs) {
        var earlyAttrs = this.earlyAttrs,
            lateAttrs = this.lateAttrs,
            attrName, extractedLateAttrs, i, len;
        if (earlyAttrs || lateAttrs) {
            // Make a shallow copy of attrs since we can't guarantee that
            // attrs won't be reused
            var copyOfAttrs = {};
            for (attrName in attrs) copyOfAttrs[attrName] = attrs[attrName];
            attrs = copyOfAttrs;
            
            // Do early setters
            if (earlyAttrs) {
                i = 0;
                len = earlyAttrs.length;
                while (len > i) {
                    attrName = earlyAttrs[i++];
                    if (attrName in attrs) {
                        this.set(attrName, attrs[attrName]);
                        delete attrs[attrName];
                    }
                }
            }
            
            // Extract late setters for later execution
            if (lateAttrs) {
                extractedLateAttrs = [];
                i = 0;
                len = lateAttrs.length;
                while (len > i) {
                    attrName = lateAttrs[i++];
                    if (attrName in attrs) {
                        extractedLateAttrs.push(attrName, attrs[attrName]);
                        delete attrs[attrName];
                    }
                }
            }
        }
        
        // Do normal setters
        for (var attrName in attrs) this.set(attrName, attrs[attrName]);
        
        // Do late setters
        if (extractedLateAttrs) {
            i = 0;
            len = extractedLateAttrs.length;
            while (len > i) this.set(extractedLateAttrs[i++], extractedLateAttrs[i++]);
        }
    },
    
    /** A generic getter function that can be called to get a value from this
        object. Will defer to a defined getter if it exists.
        @param attrName:string The name of the attribute to get.
        @returns the attribute value. */
    get: function(attrName) {
        var getterName = tym.AccessorSupport.generateGetterName(attrName);
        return this[getterName] ? this[getterName]() : this[attrName];
    },
    
    /** A generic setter function that can be called to set a value on this
        object. Will defer to a defined setter if it exists. The implementation
        assumes this object is an Observable so it will have a 'fireNewEvent'
        method.
        @param attrName:string The name of the attribute to set.
        @param v:* The value to set.
        @param skipSetter:boolean (optional) If true no attempt will be made to
            invoke a setter function. Useful when you want to invoke standard 
            setter behavior. Defaults to undefined which is equivalent to false.
        @returns void */
    set: function(attrName, v, skipSetter) {
        if (!skipSetter) {
            var setterName = tym.AccessorSupport.generateSetterName(attrName);
            if (this[setterName]) return this[setterName](v);
        }
        
        if (this[attrName] !== v) {
            this[attrName] = v;
            if (this.inited !== false && this.fireNewEvent) this.fireNewEvent(attrName, v); // !== false allows this to work with non-nodes.
        }
    }
});


/** Provides a destroy method that can be used as part of an Object creation
    and destruction lifecycle. When an object is "destroyed" it will have
    a 'destroyed' attribute with a value of true.
    
    Events:
        None
    
    Attributes:
        destroyed:boolean Set to true when the object is in the "destroyed"
            state, undefinded otherwise.
*/
tym.Destructible = new JS.Module('Destructible', {
    // Methods /////////////////////////////////////////////////////////////////
    /** Destroys this Object. Subclasses must call callSuper.
        @returns void */
    destroy: function() {
        // See http://perfectionkills.com/understanding-delete/ for details
        // on how delete works. This is why we use Object.keys below since it
        // avoids iterating over many of the properties that are not deletable.
        var keys, i;
        
        // OPTIMIZATION: Improve garbage collection for JS.Class
        var meta = this.__meta__;
        if (meta) {
            keys = Object.keys(meta);
            i = keys.length;
            while (i) delete meta[keys[--i]];
        }
        
        keys = Object.keys(this);
        i = keys.length;
        while (i) delete this[keys[--i]];
        
        this.destroyed = true;
    }
});


/** Objects that can be used in an myt.AbstractPool should use this mixin and 
    implement the "clean" method. */
tym.Reusable = new JS.Module('Reusable', {
    // Methods /////////////////////////////////////////////////////////////////
    /** Puts this object back into a default state suitable for storage in
        an myt.AbstractPool
        @returns void */
    clean: function() {}
});


/** Implements an object pool. Subclasses must at a minimum implement the 
    createInstance method.
    
    Events:
        None
    
    Attributes:
        None
    
    Private Attributes:
        __objPool:array The array of objects stored in the pool.
*/
tym.AbstractPool = new JS.Class('AbstractPool', {
    include: [tym.Destructible],
    
    
    // Constructor /////////////////////////////////////////////////////////////
    /** Initialize does nothing. */
    initialize: function() {},
    
    
    // Life Cycle //////////////////////////////////////////////////////////////
    /** @overrides myt.Destructible */
    destroy: function() {
        var objPool = this.__objPool;
        if (objPool) objPool.length = 0;
        
        this.callSuper();
    },
    
    
    // Methods /////////////////////////////////////////////////////////////////
    /** Get an instance from the pool.
        @param arguments:arguments (optional) arguments to be passed to the
            createInstance method. Note: these have no effect if an object
            already exists in the pool.
        @returns object */
    getInstance: function() {
        var objPool = this.__objPool;
        if (!objPool) objPool = this.__objPool = [];
        
        return objPool.length ? objPool.pop() : this.createInstance.apply(this, arguments);
    },
    
    /** Creates a new object that can be stored in the pool. The default
        implementation does nothing. */
    createInstance: function() {
        return null;
    },
    
    /** Puts the object back in the pool. The object will be "cleaned"
        before it is stored.
        @param obj:object the object to put in the pool.
        @returns void */
    putInstance: function(obj) {
        var objPool = this.__objPool;
        if (!objPool) objPool = this.__objPool = [];
        
        objPool.push(this.cleanInstance(obj));
    },
    
    /** Cleans the object in preparation for putting it back in the pool. The
        default implementation calls the clean method on the object if it is
        a myt.Reusable. Otherwise it does nothing.
        @param obj:object the object to be cleaned.
        @returns object the cleaned object. */
    cleanInstance: function(obj) {
        if (typeof obj.clean === 'function') obj.clean();
        return obj;
    },
    
    /** Calls the destroy method on all object stored in the pool if they
        have a destroy function.
        @returns void */
    destroyPooledInstances: function() {
        var objPool = this.__objPool;
        if (objPool) {
            var i = objPool.length, obj;
            while (i) {
                obj = objPool[--i];
                if (typeof obj.destroy === 'function') obj.destroy();
            }
        }
    }
});


/** An implementation of an myt.AbstractPool.
    
    Events
        None
    
    Attributes:
        instanceClass:JS.Class (initializer only) the class to use for 
            new instances. Defaults to Object.
        instanceParent:myt.Node (initializer only) The node to create new
            instances on.
*/
tym.SimplePool = new JS.Class('SimplePool', tym.AbstractPool, {
    // Constructor /////////////////////////////////////////////////////////////
    /** Create a new myt.SimplePool
        @param instanceClass:JS.Class the class to create instances from.
        @param instanceParent:object (optional) The place to create instances 
            on. When instanceClass is an myt.Node this will be the node parent.
        @returns void */
    initialize: function(instanceClass, instanceParent) {
        this.callSuper();
        
        this.instanceClass = instanceClass || Object;
        this.instanceParent = instanceParent;
    },
    
    
    // Methods /////////////////////////////////////////////////////////////////
    /** @overrides myt.AbstractPool
        Creates an instance of this.instanceClass and passes in 
        this.instanceParent as the first argument if it exists.
        @param arguments[0]:object (optional) the attrs to be passed to a
            created myt.Node. */
    createInstance: function() {
        // If we ever need full arguments with new, see:
        // http://stackoverflow.com/questions/1606797/use-of-apply-with-new-operator-is-this-possible
        var parent = this.instanceParent, instanceClass = this.instanceClass;
        return parent ? new instanceClass(parent, arguments[0]) : new instanceClass();
    }
});


/** An myt.SimplePool that tracks which objects are "active". An "active"
    object is one that has been obtained by the getInstance method.
    
    Events:
        None
    
    Attributes:
        None
    
    Private Attributes:
        __actives:array an array of active instances.
*/
tym.TrackActivesPool = new JS.Class('TrackActivesPool', tym.SimplePool, {
    // Life Cycle //////////////////////////////////////////////////////////////
    /** @overrides myt.Destructible */
    destroy: function() {
        var actives = this.__actives;
        if (actives) actives.length = 0;
        
        this.callSuper();
    },
    
    
    // Methods /////////////////////////////////////////////////////////////////
    /** @overrides myt.AbstractPool */
    getInstance: function() {
        var instance = this.callSuper();
        (this.__actives || (this.__actives = [])).push(instance);
        return instance;
    },
    
    /** @overrides myt.AbstractPool */
    putInstance: function(obj) {
        var actives = this.__actives;
        if (actives) {
            var i = actives.length;
            while (i) {
                if (actives[--i] === obj) {
                    actives.splice(i, 1);
                    this.callSuper(obj);
                    return;
                }
            }
            console.warn("Attempt to putInstance for a non-active instance.", obj, this);
        } else {
            console.warn("Attempt to putInstance when no actives exist.", obj, this);
        }
    },
    
    /** Gets an array of the active instances.
        @param filterFunc:function (optional) If provided filters the
            results.
        @returns array */
    getActives: function(filterFunc) {
        var actives = this.__actives;
        if (actives) {
            if (filterFunc) {
                var retval = [], len = actives.length, i = 0, active;
                for (; len > i;) {
                    active = actives[i++];
                    if (filterFunc.call(this, active)) retval.push(active);
                }
                return retval;
            }
            return actives.concat();
        }
        return [];
    },
    
    /** Puts all the active instances back in the pool.
        @returns void */
    putActives: function() {
        var actives = this.__actives;
        if (actives) {
            var i = actives.length;
            while (i) this.putInstance(actives[--i]);
        }
    }
});


/** An object that provides accessors, events and simple lifecycle management.
    Useful as a light weight alternative to myt.Node when parent child
    relationships are not needed.
    
    Events:
        None.
    
    Attributes:
        inited:boolean Set to true after this Eventable has completed 
            initializing.
*/
tym.Eventable = new JS.Class('Eventable', {
    include: [tym.AccessorSupport, tym.Destructible, tym.Observable, tym.Constrainable],
    
    
    // Constructor /////////////////////////////////////////////////////////////
    /** The standard JSClass initializer function.
        @param attrs:object (Optional) A map of attribute names and values.
        @param mixins:array (Optional) a list of mixins to be added onto
            the new instance.
        @returns void */
    initialize: function(attrs, mixins) {
        if (mixins) {
            for (var i = 0, len = mixins.length; len > i;) this.extend(mixins[i++]);
        }
        
        this.inited = false;
        this.init(attrs || {});
    },
    
    
    // Life Cycle //////////////////////////////////////////////////////////////
    /** Called during initialization. Calls setter methods and lastly, sets 
        inited to true. Subclasses must callSuper.
        @param attrs:object A map of attribute names and values.
        @returns void */
    init: function(attrs) {
        this.callSetters(attrs);
        this.inited = true;
    },
    
    /** @overrides tym.Destructible. */
    destroy: function() {
        this.releaseAllConstraints();
        this.detachFromAllObservables();
        this.detachAllObservers();
        
        this.callSuper();
    }
});


/** A single node within a tree data structure. A node has zero or one parent 
    node and zero or more child nodes. If a node has no parent it is a 'root' 
    node. If a node has no child nodes it is a 'leaf' node. Parent nodes and 
    parent of parents, etc. are referred to as ancestors. Child nodes and 
    children of children, etc. are referred to as descendants.
    
    Lifecycle management is also provided via the 'initNode', 'doBeforeAdoption',
    'doAfterAdoption', 'destroy', 'destroyBeforeOrphaning' and
    'destroyAfterOrphaning' methods.
    
    Events:
        parent:tym.Node Fired when the parent is set.
    
    Attributes:
        inited:boolean Set to true after this Node has completed initializing.
        parent:tym.Node The parent of this Node.
        name:string The name of this node. Used to reference this Node from
            its parent Node.
        isBeingDestroyed:boolean Indicates that this node is in the process
            of being destroyed. Set to true at the beginning of the destroy
            lifecycle phase. Undefined before that.
        placement:string The name of the subnode of this Node to add nodes to 
            when setParent is called on the subnode. Placement can be nested 
            using '.' For example 'foo.bar'. The special value of '*' means 
            use the default placement. For example 'foo.*' means place in the 
            foo subnode and then in the default placement for foo.
        defaultPlacement:string The name of the subnode to add nodes to when 
            no placement is specified. Defaults to undefined which means add
            subnodes directly to this node.
        ignorePlacement:boolean If set to true placement will not be processed 
            for this Node when it is added to a parent Node.
    
    Private Attributes:
        __animPool:array An tym.TrackActivesPool used by the 'animate' method.
        subnodes:array The array of child nodes for this node. Should be
            accessed through the getSubnodes method.
*/
tym.Node = new JS.Class('Node', {
    include: [
        tym.AccessorSupport, 
        tym.Destructible, 
        tym.Observable, 
        tym.Constrainable
    ],
    
    
    // Class Methods and Attributes ////////////////////////////////////////////
    extend: {
        /** Get the closest ancestor of the provided Node or the Node itself for 
            which the matcher function returns true.
            @param n:tym.Node the Node to start searching from.
            @param matcher:function the function to test for matching Nodes with.
            @returns Node or null if no match is found. */
        getMatchingAncestorOrSelf: function(n, matcherFunc) {
            if (n && matcherFunc) {
                while (n) {
                    if (matcherFunc(n)) return n;
                    n = n.parent;
                }
            }
            return null;
        },
        
        /** Get the youngest ancestor of the provided Node for which the 
            matcher function returns true.
            @param n:tym.Node the Node to start searching from. This Node is not
                tested, but its parent is.
            @param matcher:function the function to test for matching Nodes with.
            @returns Node or null if no match is found. */
        getMatchingAncestor: function(n, matcherFunc) {
            return this.getMatchingAncestorOrSelf(n ? n.parent : null, matcherFunc);
        }
    },
    
    
    // Constructor /////////////////////////////////////////////////////////////
    /** The standard JSClass initializer function. Subclasses should not
        override this function.
        @param parent:Node (or dom element for RootViews) (Optional) the parent 
            of this Node.
        @param attrs:object (Optional) A map of attribute names and values.
        @param mixins:array (Optional) a list of mixins to be added onto
            the new instance.
        @returns void */
    initialize: function(parent, attrs, mixins) {
        if (mixins) {
            var i = 0, len = mixins.length, mixin;
            for (; len > i;) {
                mixin = mixins[i++];
                if (mixin) {
                    this.extend(mixin);
                } else {
                    console.warn("Undefined mixin in initialization of: " + this.klass.__displayName);
                }
            }
        }
        
        this.inited = false;
        this.initNode(parent, attrs || {});
    },
    
    
    // Life Cycle //////////////////////////////////////////////////////////////
    /** Called during initialization. Sets initial state for life cycle attrs,
        calls setter methods, sets parent and lastly, sets inited to true.
        Subclasses must callSuper.
        @param parent:Node (or dom element for RootViews) the parent of 
            this Node.
        @param attrs:object A map of attribute names and values.
        @returns void */
    initNode: function(parent, attrs) {
        this.callSetters(attrs);
        
        this.doBeforeAdoption();
        this.setParent(parent);
        this.doAfterAdoption();
        
        this.inited = true;
    },
    
    /** Provides a hook for subclasses to do things before this Node has its
        parent assigned. This would be the ideal place to create subviews
        so as to avoid unnecessary dom reflows. However, text size can't
        be measured until insertion into the DOM so you may want to use
        doAfterAdoption for creating subviews since it will give you less
        trouble though it will be slower.
        @returns void */
    doBeforeAdoption: function() {},
    
    /** Provides a hook for subclasses to do things after this Node has its
        parent assigned.
        @returns void */
    doAfterAdoption: function() {},
    
    /** @overrides tym.Destructible. */
    destroy: function() {
        // Allows descendants to know destruction is in process
        this.isBeingDestroyed = true;
        
        // Destroy subnodes depth first
        var subs = this.subnodes;
        if (subs) {
            var i = subs.length;
            while (i) subs[--i].destroy();
        }
        
        if (this.__animPool) {
            this.stopActiveAnimators();
            this.__animPool.destroy();
        }
        
        this.destroyBeforeOrphaning();
        if (this.parent) this.setParent(null);
        this.destroyAfterOrphaning();
        
        this.callSuper();
    },
    
    /** Provides a hook for subclasses to do destruction of their internals.
        This method is called after subnodes have been destroyed but before
        the parent has been unset.
        Subclasses should call callSuper.
        @returns void */
    destroyBeforeOrphaning: function() {},
    
    /** Provides a hook for subclasses to do destruction of their internals.
        This method is called after the parent has been unset.
        Subclasses must call callSuper.
        @returns void */
    destroyAfterOrphaning: function() {
        this.releaseAllConstraints();
        this.detachFromAllObservables();
        this.detachAllObservers();
    },
    
    
    // Structural Accessors ////////////////////////////////////////////////////
    setPlacement: function(v) {this.placement = v;},
    setDefaultPlacement: function(v) {this.defaultPlacement = v;},
    setIgnorePlacement: function(v) {this.ignorePlacement = v;},
    
    /** Sets the provided Node as the new parent of this Node. This is the
        most direct method to do reparenting. You can also use the addSubnode
        method but it's just a wrapper around this setter. */
    setParent: function(newParent) {
        // Use placement if indicated
        if (newParent && !this.ignorePlacement) {
            var placement = this.placement || newParent.defaultPlacement;
            if (placement) newParent = newParent.determinePlacement(placement, this);
        }
        
        if (this.parent !== newParent) {
            // Abort if the new parent is in the destroyed life-cycle state.
            if (newParent && newParent.destroyed) return;
            
            // Remove ourselves from our existing parent if we have one.
            var curParent = this.parent;
            if (curParent) {
                var idx = curParent.getSubnodeIndex(this);
                if (idx !== -1) {
                    if (this.name) curParent.__removeNameRef(this);
                    curParent.subnodes.splice(idx, 1);
                    curParent.subnodeRemoved(this);
                }
            }
            
            this.parent = newParent;
            
            // Add ourselves to our new parent
            if (newParent) {
                newParent.getSubnodes().push(this);
                if (this.name) newParent.__addNameRef(this);
                newParent.subnodeAdded(this);
            }
            
            // Fire an event
            if (this.inited) this.fireNewEvent('parent', newParent);
        }
    },
    
    /** The 'name' of a Node allows it to be referenced by name from its
        parent node. For example a Node named 'foo' that is a child of a
        Node stored in the var 'bar' would be referenced like this: bar.foo or
        bar['foo']. */
    setName: function(name) {
        if (this.name !== name) {
            // Remove "name" reference from parent.
            var p = this.parent;
            if (p && this.name) p.__removeNameRef(this);
            
            this.name = name;
            
            // Add "name" reference to parent.
            if (p && name) p.__addNameRef(this);
        }
    },
    
    /** Gets the subnodes for this Node and does lazy instantiation of the 
        subnodes array if no child Nodes exist.
        @returns array of subnodes. */
    getSubnodes: function() {
        return this.subnodes || (this.subnodes = []);
    },
    
    
    // Methods /////////////////////////////////////////////////////////////////
    /** Called from setParent to determine where to insert a subnode in the node
        hierarchy. Subclasses will not typically override this method, but if
        they do, they probably won't need to call callSuper.
        @param placement:string the placement path to use.
        @param subnode:tym.Node the subnode being placed.
        @returns the Node to place a subnode into. */
    determinePlacement: function(placement, subnode) {
        // Parse "active" placement and remaining placement.
        var idx = placement.indexOf('.'), remainder, loc;
        if (idx !== -1) {
            remainder = placement.substring(idx + 1);
            placement = placement.substring(0, idx);
        }
        
        // Evaluate placement of '*' as defaultPlacement.
        if (placement === '*') {
            placement = this.defaultPlacement;
            
            // Default placement may be compound and thus require splitting
            if (placement) {
                idx = placement.indexOf('.');
                if (idx !== -1) {
                    remainder = placement.substring(idx + 1) + (remainder ? '.' + remainder : '');
                    placement = placement.substring(0, idx);
                }
            }
            
            // It's possible that a placement of '*' comes out here if a
            // Node has its defaultPlacement set to '*'. This should result
            // in a null loc when the code below runs which will end up
            // returning 'this'.
        }
        
        loc = this[placement];
        return loc ? (remainder ? loc.determinePlacement(remainder, subnode) : loc) : this;
    },
    
    /** Adds a named reference to a subnode.
        @param node:Node the node to add the name reference for.
        @returns void */
    __addNameRef: function(node) {
        var name = node.name;
        if (this[name] === undefined) {
            this[name] = node;
        } else {
            console.log("Name in use:" + name);
        }
    },
    
    /** Removes a named reference to a subnode.
        @param node:Node the node to remove the name reference for.
        @returns void */
    __removeNameRef: function(node) {
        var name = node.name;
        if (this[name] === node) {
            delete this[name];
        } else {
            console.log("Name not in use:" + name);
        }
    },
    
    // Tree Methods //
    /** Gets the root Node for this Node. The root Node is the oldest
        ancestor or self that has no parent.
        @returns Node */
    getRoot: function() {
        return this.parent ? this.parent.getRoot() : this;
    },
    
    /** Checks if this Node is a root Node.
        @returns boolean */
    isRoot: function() {
        return this.parent == null;
    },
    
    /** Tests if this Node is a descendant of the provided Node or is the
        node itself.
        @returns boolean */
    isDescendantOf: function(node) {
        if (node) {
            if (node === this) return true;
            if (this.parent) return this.parent.isDescendantOf(node);
        }
        return false;
    },
    
    /** Tests if this Node is an ancestor of the provided Node or is the
        node itself.
        @param node:Node the node to check for.
        @returns boolean */
    isAncestorOf: function(node) {
        return node ? node.isDescendantOf(this) : false;
    },
    
    /** Gets the youngest common ancestor of this node and the provided node.
        @param node:tym.Node The node to look for a common ancestor with.
        @returns The youngest common Node or null if none exists. */
    getLeastCommonAncestor: function(node) {
        while (node) {
            if (this.isDescendantOf(node)) return node;
            node = node.parent;
        }
        return null;
    },
    
    /** Find the youngest ancestor Node that is an instance of the class.
        @param klass the Class to search for.
        @returns Node or null if no klass is provided or match found. */
    searchAncestorsForClass: function(klass) {
        return klass ? this.searchAncestors(function(n) {return n instanceof klass;}) : null;
    },
    
    /** Get the youngest ancestor of this Node for which the matcher function 
        returns true. This is a simple wrapper around 
        tym.Node.getMatchingAncestor(this, matcherFunc).
        @param matcherFunc:function the function to test for matching 
            Nodes with.
        @returns Node or null if no match is found. */
    searchAncestors: function(matcherFunc) {
        return tym.Node.getMatchingAncestor(this, matcherFunc);
    },
    
    /** Get the youngest ancestor of this Node or the Node itself for which 
        the matcher function returns true. This is a simple wrapper around 
        tym.Node.getMatchingAncestorOrSelf(this, matcherFunc).
        @param matcherFunc:function the function to test for matching 
            Nodes with.
        @returns Node or null if no match is found. */
    searchAncestorsOrSelf: function(matcherFunc) {
        return tym.Node.getMatchingAncestorOrSelf(this, matcherFunc);
    },
    
    /** Gets an array of ancestor nodes including the node itself.
        @returns array: The array of ancestor nodes. */
    getAncestors: function() {
        var ancestors = [], node = this;
        while (node) {
            ancestors.push(node);
            node = node.parent;
        }
        return ancestors;
    },
    
    // Subnode Methods //
    /** Checks if this Node has the provided Node in the subnodes array.
        @param node:Node the subnode to check for.
        @returns true if the subnode is found, false otherwise. */
    hasSubnode: function(node) {
        return this.getSubnodeIndex(node) !== -1;
    },
    
    /** Gets the index of the provided Node in the subnodes array.
        @param node:Node the subnode to get the index for.
        @returns the index of the subnode or -1 if not found. */
    getSubnodeIndex: function(node) {
        return this.getSubnodes().indexOf(node);
    },
    
    /** A convienence method to make a Node a child of this Node. The
        standard way to do this is to call the setParent method on the
        prospective child Node.
        @param node:Node the subnode to add.
        @returns void */
    addSubnode: function(node) {
        node.setParent(this);
    },
    
    /** A convienence method to make a Node no longer a child of this Node. The
        standard way to do this is to call the setParent method with a value
        of null on the child Node.
        @param node:Node the subnode to remove.
        @returns the removed Node or null if removal failed. */
    removeSubnode: function(node) {
        if (node.parent !== this) return null;
        node.setParent(null);
        return node;
    },
    
    /** Called when a subnode is added to this node. Provides a hook for
        subclasses. No need for subclasses to call callSuper. Do not call this
        method to add a subnode. Instead call addSubnode or setParent.
        @param node:Node the subnode that was added.
        @returns void */
    subnodeAdded: function(node) {},
    
    /** Called when a subnode is removed from this node. Provides a hook for
        subclasses. No need for subclasses to call callSuper. Do not call this
        method to remove a subnode. Instead call removeSubnode or setParent.
        @param node:Node the subnode that was removed.
        @returns void */
    subnodeRemoved: function(node) {},
    
    // Animation
    /** Animates an attribute using the provided parameters.
        @param attribute:string/object the name of the attribute to animate. If
            an object is provided it should be the only argument and its keys
            should be the params of this method. This provides a more concise
            way of passing in sparse optional parameters.
        @param to:number the target value to animate to.
        @param from:number the target value to animate from. (optional)
        @param relative:boolean (optional)
        @param callback:function (optional)
        @param duration:number (optional)
        @param reverse:boolean (optional)
        @param repeat:number (optional)
        @param easingFunction:function (optional)
        @returns The Animator being run. */
    animate: function(attribute, to, from, relative, callback, duration, reverse, repeat, easingFunction) {
        var animPool = this.__getAnimPool();
        
        // ignorePlacement ensures the animator is directly attached to this node
        var anim = animPool.getInstance({ignorePlacement:true});
        
        if (typeof attribute === 'object') {
            // Handle a single map argument if provided
            callback = attribute.callback;
            delete attribute.callback;
            anim.callSetters(attribute);
        } else {
            // Handle individual arguments
            anim.attribute = attribute;
            anim.setTo(to);
            anim.setFrom(from);
            if (duration != null) anim.duration = duration;
            if (relative != null) anim.relative = relative;
            if (repeat != null) anim.repeat = repeat;
            if (reverse != null) anim.setReverse(reverse);
            if (easingFunction != null) anim.setEasingFunction(easingFunction);
        }
        
        // Release the animation when it completes.
        anim.next(function(success) {animPool.putInstance(anim);});
        if (callback) anim.next(callback);
        
        anim.setRunning(true);
        return anim;
    },
    
    /** Gets an array of the currently running animators that were created
        by calls to the animate method.
        @param filterFunc:function/string a function that filters which 
            animations get stopped. The filter should return true for 
            functions to be included. If the provided values is a string it will
            be used as a matching attribute name.
        @returns an array of active animators. */
    getActiveAnimators: function(filterFunc) {
        if (typeof filterFunc === 'string') {
            var attrName = filterFunc;
            filterFunc = function(anim) {return anim.attribute === attrName;};
        }
        return this.__getAnimPool().getActives(filterFunc);
    },
    
    /** Stops all active animations.
        @param filterFunc:function/string a function that filters which 
            animations get stopped. The filter should return true for 
            functions to be stopped. If the provided values is a string it will
            be used as a matching attribute name.
        @returns void */
    stopActiveAnimators: function(filterFunc) {
        var activeAnims = this.getActiveAnimators(filterFunc), i = activeAnims.length, anim;
        if (i > 0) {
            var animPool = this.__getAnimPool();
            while (i) {
                anim = activeAnims[--i];
                anim.reset(false);
                animPool.putInstance(anim);
            }
        }
    },
    
    /** Gets the animation pool if it exists, or lazy instantiates it first
        if necessary.
        @private
        @returns tym.TrackActivesPool */
    __getAnimPool: function() {
        return this.__animPool || (this.__animPool = new tym.TrackActivesPool(tym.Animator, this));
    }
});


/** A counter that can be incremented and decremented and will update an
    'exceeded' attribute when a threshold is crossed. */
tym.ThresholdCounter = new JS.Class('ThresholdCounter', {
    include: [tym.AccessorSupport, tym.Destructible, tym.Observable],
    
    // Class Methods and Attributes ////////////////////////////////////////////
    extend: {
        /** Mixes ThresholdCounter functionality onto the provided scope.
            @param scope:Observable|Class|Module the scope to mix onto.
            @param exceededAttrName:string the name of the boolean attribute
                that will indicate if the threshold is exceeded or not.
            @param counterAttrName:string (Optional) the name of the number
                attribute that will get adjusted up and down. If not provided
                the 'exceeded' attribute name will be used with 'Counter'
                appended to it. For example if the exceeded
                attribute was 'locked' this would be 'lockedCounter'.
            @param thresholdAttrName:string (Optional) the name of the number
                attribute that determines when we are exceeded or not. If not 
                provided the 'exceeded' attribute name will be used with 
                'Threshold' appended to it. For example if the exceeded
                attribute was 'locked' this would be 'lockedThreshold'.
            @returns boolean True if creation succeeded, false otherwise. */
        createThresholdCounter: function(scope, exceededAttrName, counterAttrName, thresholdAttrName) {
            var genNameFunc = tym.AccessorSupport.generateName;
            counterAttrName = counterAttrName || genNameFunc('counter', exceededAttrName);
            thresholdAttrName = thresholdAttrName || genNameFunc('threshold', exceededAttrName);
            
            var incrName = genNameFunc(counterAttrName, 'increment'),
                decrName = genNameFunc(counterAttrName, 'decrement'),
                thresholdSetterName = tym.AccessorSupport.generateSetterName(thresholdAttrName),
                isModuleOrClass = typeof scope === 'function' || scope instanceof JS.Module;
            
            // Prevent clobbering
            if ((isModuleOrClass ? scope.instanceMethod(incrName) : scope[incrName]) !== undefined) {
                console.warn("Can't clobber existing property during setup of ThresholdCounter increment function.", incrName, scope);
                return false;
            }
            if ((isModuleOrClass ? scope.instanceMethod(decrName) : scope[decrName]) !== undefined) {
                console.warn("Can't clobber existing property during setup of ThresholdCounter decrement function.", decrName, scope);
                return false;
            }
            if ((isModuleOrClass ? scope.instanceMethod(thresholdSetterName) : scope[thresholdSetterName]) !== undefined) {
                console.warn("Can't clobber existing property during setup of ThresholdCounter threshold setter function.", thresholdSetterName, scope);
                return false;
            }
            
            // Define the "module".
            var mod = {};
            
            /** Increments the counter attribute on the scope object by the 
                provided value or 1 if no value was provided.
                @param amount:number (Optional) the amount to increment the 
                    counter by. If not provided, 1 will be used.
                @returns void */
            mod[incrName] = function(amount) {
                if (amount == null) amount = 1;
                var curValue = this[counterAttrName],
                    value = curValue + amount;
                
                // Counters must be non-negative.
                if (0 > value) {
                    console.warn("Attempt to decrement a counter below 0.", this, counterAttrName, amount);
                    value = 0;
                }
                
                if (curValue !== value) {
                    this[counterAttrName] = value;
                    this.fireNewEvent(counterAttrName, value);
                    this.set(exceededAttrName, value >= this[thresholdAttrName]); // Check threshold
                }
            };
            
            /** Decrements the counter attribute on the scope object by the 
                provided value or 1 if no value was provided.
                @param amount:number (Optional) the amount to increment the 
                    counter by. If not provided, 1 will be used.
                @returns void */
            mod[decrName] = function(amount) {
                if (amount == null) amount = 1;
                this[incrName](-amount);
            };
            
            /** Sets the threshold attribute and performs a threshold check.
                @returns void */
            mod[thresholdSetterName] = function(v) {
                if (this[thresholdAttrName] === v) return;
                this[thresholdAttrName] = v;
                this.fireNewEvent(thresholdAttrName, v);
                this.set(exceededAttrName, this[counterAttrName] >= v); // Check threshold
            };
            
            // Mixin in the "module"
            if (isModuleOrClass) {
                scope.include(mod);
            } else {
                scope.extend(mod);
            }
            
            return true;
        },
        
        /** Set initial value and threshold on a ThresholdCounter instance.
            This also executes a 'check' so the 'exceeded' attribute will have
            the correct value.
            @returns void */
        initializeThresholdCounter: function(
            scope, initialValue, thresholdValue, exceededAttrName, counterAttrName, thresholdAttrName
        ) {
            var genNameFunc = tym.AccessorSupport.generateName;
            counterAttrName = counterAttrName || genNameFunc('counter', exceededAttrName);
            thresholdAttrName = thresholdAttrName || genNameFunc('threshold', exceededAttrName);
            
            scope[counterAttrName] = initialValue;
            scope[thresholdAttrName] = thresholdValue;
            scope.set(exceededAttrName, initialValue >= thresholdValue); // Check threshold
        },
        
        /** Mixes ThresholdCounter functionality with a fixed threshold onto 
            the provided scope.
            @param scope:Observable|Class|Module the scope to mix onto.
            @param thresholdValue:number the fixed threshold value.
            @param exceededAttrName:string the name of the boolean attribute
                that will indicate if the threshold is exceeded or not.
            @param counterAttrName:string (Optional) the name of the number
                attribute that will get adjusted up and down. If not provided
                the 'exceeded' attribute name will be used with 'Counter'
                appended to it. For example if the exceeded
                attribute was 'locked' this would be 'lockedCounter'.
            @returns boolean True if creation succeeded, false otherwise. */
        createFixedThresholdCounter: function(scope, thresholdValue, exceededAttrName, counterAttrName) {
            var genNameFunc = tym.AccessorSupport.generateName;
            counterAttrName = counterAttrName || genNameFunc('counter', exceededAttrName);
            
            var incrName = genNameFunc(counterAttrName, 'increment'),
                decrName = genNameFunc(counterAttrName, 'decrement'),
                isModuleOrClass = typeof scope === 'function' || scope instanceof JS.Module;
            
            // Prevent clobbering
            if ((isModuleOrClass ? scope.instanceMethod(incrName) : scope[incrName]) !== undefined) {
                console.warn("Can't clobber existing property during setup of ThresholdCounter increment function.", incrName, scope);
                return false;
            }
            if ((isModuleOrClass ? scope.instanceMethod(decrName) : scope[decrName]) !== undefined) {
                console.warn("Can't clobber existing property during setup of ThresholdCounter decrement function.", decrName, scope);
                return false;
            }
            
            // Define the "module".
            var mod = {};
            
            /** Increments the counter attribute on the scope object by 1.
                @returns void */
            mod[incrName] = function() {
                var value = this[counterAttrName] + 1;
                this[counterAttrName] = value;
                this.fireNewEvent(counterAttrName, value);
                if (value === thresholdValue) this.set(exceededAttrName, true);
            };
            
            /** Decrements the counter attribute on the scope object by 1.
                @returns void */
            mod[decrName] = function() {
                var curValue = this[counterAttrName];
                if (curValue === 0) return;
                var value = curValue - 1;
                this[counterAttrName] = value;
                this.fireNewEvent(counterAttrName, value);
                if (curValue === thresholdValue) this.set(exceededAttrName, false);
            };
            
            // Mixin in the "module"
            if (isModuleOrClass) {
                scope.include(mod);
            } else {
                scope.extend(mod);
            }
            
            return true;
        },
        
        /** Set initial value on a ThresholdCounter instance.
            This also executes a 'check' so the 'exceeded' attribute will have
            the correct value.
            @returns void */
        initializeFixedThresholdCounter: function(
            scope, initialValue, thresholdValue, exceededAttrName, counterAttrName
        ) {
            counterAttrName = counterAttrName || tym.AccessorSupport.generateName('counter', exceededAttrName);
            
            scope[counterAttrName] = initialValue;
            scope.set(exceededAttrName, initialValue >= thresholdValue);
        }
    },
    
    
    // Constructor /////////////////////////////////////////////////////////////
    initialize: function(initialValue, thresholdValue) {
        tym.ThresholdCounter.initializeThresholdCounter(
            this, initialValue, thresholdValue, 'exceeded', 'counter', 'threshold'
        );
    },
    
    
    // Life Cycle //////////////////////////////////////////////////////////////
    /** @overrides tym.Destructible */
    destroy: function() {
        this.detachAllObservers();
        this.callSuper();
    }
});

/** Create default counter functions for the ThresholdCounter class. */
tym.ThresholdCounter.createThresholdCounter(
    tym.ThresholdCounter, 'exceeded', 'counter', 'threshold'
);


/** A layout controls the positioning of views within a parent view.
    
    Events:
        None
    
    Attributes:
        locked:boolean When true, the layout will not update.
        lockedCounter:number Counter created by tym.ThresholdCounter.
    
    Private Attributes:
        subviews:array An array of Views managed by this layout.
        __deferredLayout:boolean Marks a layout as deferred if the global
            layout lock, tym.Layout.locked, is true during a call to 
            'canUpdate' on the layout.
*/
tym.Layout = new JS.Class('Layout', tym.Node, {
    // Class Methods ///////////////////////////////////////////////////////////
    extend: {
        deferredLayouts: [],
        
        /** Increments the global lock that prevents all layouts from updating.
            @returns void */
        incrementGlobalLock: function() {
            var L = tym.Layout;
            if (L._lockCount === undefined) L._lockCount = 0;
            
            L._lockCount++;
            if (L._lockCount === 1) L.__setLocked(true);
        },
        
        /** Decrements the global lock that prevents all layouts from updating.
            @returns void */
        decrementGlobalLock: function() {
            var L = tym.Layout;
            if (L._lockCount === undefined) L._lockCount = 0;
            
            if (L._lockCount !== 0) {
                L._lockCount--;
                if (L._lockCount === 0) L.__setLocked(false);
            }
        },
        
        /** Adds a layout to a list of layouts that will get updated when the
            global lock is no longer locked.
            @param layout:tym.Layout the layout to defer an update for.
            @returns void */
        deferLayoutUpdate: function(layout) {
            // Don't add a layout that is already deferred.
            if (!layout.__deferredLayout) {
                tym.Layout.deferredLayouts.push(layout);
                layout.__deferredLayout = true;
            }
        },
        
        /** Called to set/unset the global lock. Updates all the currently 
            deferred layouts.
            @private */
        __setLocked: function(v) {
            var L = tym.Layout;
            if (L.locked === v) return;
            L.locked = v;
            
            if (!v) {
                var layouts = L.deferredLayouts, i = layouts.length, layout;
                while (i) {
                    layout = layouts[--i];
                    layout.__deferredLayout = false;
                    layout.update();
                }
                layouts.length = 0;
            }
        }
    },
    
    
    // Life Cycle //////////////////////////////////////////////////////////////
    /** @overrides tym.Node */
    initNode: function(parent, attrs) {
        this.subviews = [];
        
        // Start the layout in the locked state.
        this.locked = true;
        this.lockedCounter = 1;
        
        // Remember how initial locking state should be set
        var initiallyLocked = attrs.locked === true;
        delete attrs.locked;
        
        this.callSuper(parent, attrs);
        
        // Unlock if initial locking state calls for it.
        if (!initiallyLocked) this.decrementLockedCounter();
        
        this.update();
    },
    
    /** @overrides tym.Node */
    destroyAfterOrphaning: function() {
        this.callSuper();
        this.subviews.length = 0;
    },
    
    
    // Accessors ///////////////////////////////////////////////////////////////
    /** @overrides tym.Node */
    setParent: function(parent) {
        if (this.parent !== parent) {
            // Lock during parent change so that old parent is not updated by
            // the calls to removeSubview and addSubview.
            var wasNotLocked = !this.locked;
            if (wasNotLocked) this.locked = true;
            
            // Stop monitoring parent
            var svs, i, len;
            if (this.parent) {
                svs = this.subviews;
                i = svs.length;
                while (i) this.removeSubview(svs[--i]);
                
                this.detachFrom(this.parent, '__handleParentSubviewAddedEvent', 'subviewAdded');
                this.detachFrom(this.parent, '__handleParentSubviewRemovedEvent', 'subviewRemoved');
            }
            
            this.callSuper(parent);
            
            // Start monitoring new parent
            if (this.parent) {
                svs = this.parent.getSubviews();
                for (i = 0, len = svs.length; len > i; ++i) this.addSubview(svs[i]);
                
                this.attachTo(this.parent, '__handleParentSubviewAddedEvent', 'subviewAdded');
                this.attachTo(this.parent, '__handleParentSubviewRemovedEvent', 'subviewRemoved');
            }
            
            // Clear temporary lock and update if this happened after initialization.
            if (wasNotLocked) {
                this.locked = false;
                if (this.inited && this.parent) this.update();
            }
        }
    },
    
    
    // Methods /////////////////////////////////////////////////////////////////
    /** Checks if the layout is locked or not. Should be called by the
        "update" method of each layout to check if it is OK to do the update.
        If tym.Layout.locked is true (the global layout lock) then a deferred
        layout update will be setup for this Layout. Once the global lock is
        unlocked this Layout's 'update' method will be invoked.
        @returns true if not locked, false otherwise. */
    canUpdate: function() {
        if (tym.Layout.locked) {
            tym.Layout.deferLayoutUpdate(this);
            return false;
        }
        return !this.locked;
    },
    
    /** Updates the layout. Subclasses should call canUpdate to check lock 
        state before trying to do anything.
        @returns void */
    update: function() {},
    
    // Subview Methods //
    /** Checks if this Layout has the provided View in the subviews array.
        @param sv:View the view to check for.
        @returns true if the subview is found, false otherwise. */
    hasSubview: function(sv) {
        return this.getSubviewIndex(sv) !== -1;
    },
    
    /** Gets the index of the provided View in the subviews array.
        @param sv:View the view to check for.
        @returns the index of the subview or -1 if not found. */
    getSubviewIndex: function(sv) {
        return this.subviews.indexOf(sv);
    },
    
    /** Adds the provided View to the subviews array of this Layout.
        @param sv:View the view to add to this layout.
        @returns void */
    addSubview: function(sv) {
        if (this.ignore(sv)) return;
        
        this.subviews.push(sv);
        this.startMonitoringSubview(sv);
        if (!this.locked) this.update();
    },
    
    /** Subclasses should implement this method to start listening to
        events from the subview that should trigger the update method.
        @param sv:View the view to start monitoring for changes.
        @returns void */
    startMonitoringSubview: function(sv) {},
    
    /** Calls startMonitoringSubview for all views. Used by Layout 
        implementations when a change occurs to the layout that requires
        refreshing all the subview monitoring.
        @returns void */
    startMonitoringAllSubviews: function() {
        var svs = this.subviews, i = svs.length;
        while (i) this.startMonitoringSubview(svs[--i]);
    },
    
    /** Removes the provided View from the subviews array of this Layout.
        @param sv:View the view to remove from this layout.
        @returns the index of the removed subview or -1 if not removed. */
    removeSubview: function(sv) {
        if (this.ignore(sv)) return -1;
        
        var idx = this.getSubviewIndex(sv);
        if (idx !== -1) {
            this.stopMonitoringSubview(sv);
            this.subviews.splice(idx, 1);
            if (!this.locked) this.update();
        }
        return idx;
    },
    
    /** Subclasses should implement this method to stop listening to
        events from the subview that would trigger the update method. This
        should remove all listeners that were setup in startMonitoringSubview.
        @param sv:View the view to stop monitoring for changes.
        @returns void */
    stopMonitoringSubview: function(sv) {},
    
    /** Calls stopMonitoringSubview for all views. Used by Layout 
        implementations when a change occurs to the layout that requires
        refreshing all the subview monitoring.
        @returns void */
    stopMonitoringAllSubviews: function() {
        var svs = this.subviews, i = svs.length;
        while (i) this.stopMonitoringSubview(svs[--i]);
    },
    
    /** Checks if a subview can be added to this Layout or not. The default 
        implementation returns the 'ignoreLayout' attributes of the subview.
        @param sv:tym.View the view to check.
        @returns boolean true means the subview will be skipped, false
            otherwise. */
    ignore: function(sv) {
        return sv.ignoreLayout;
    },
    
    /** If our parent adds a new subview we should add it.
        @private */
    __handleParentSubviewAddedEvent: function(event) {
        var v = event.value;
        if (v.parent === this.parent) this.addSubview(v);
    },
    
    /** If our parent removes a subview we should remove it.
        @private */
    __handleParentSubviewRemovedEvent: function(event) {
        var v = event.value;
        if (v.parent === this.parent) this.removeSubview(v);
    },
    
    // Subview ordering //
    /** Sorts the subviews array according to the provided sort function.
        @param sortFunc:function the sort function to sort the subviews with.
        @returns void */
    sortSubviews: function(sortFunc) {
        this.subviews.sort(sortFunc);
    },
    
    /** Moves the subview before the target subview in the order the subviews
        are layed out. If no target subview is provided, or it isn't in the
        layout the subview will be moved to the front of the list.
        @returns void */
    moveSubviewBefore: function(sv, target) {
        this.__moveSubview(sv, target, false);
    },
    
    /** Moves the subview after the target subview in the order the subviews
        are layed out. If no target subview is provided, or it isn't in the
        layout the subview will be moved to the back of the list.
        @returns void */
    moveSubviewAfter: function(sv, target) {
        this.__moveSubview(sv, target, true);
    },
    
    /** Implements moveSubviewBefore and moveSubviewAfter.
        @private */
    __moveSubview: function(sv, target, after) {
        var curIdx = this.getSubviewIndex(sv);
        if (curIdx >= 0) {
            var svs = this.subviews,
                targetIdx = this.getSubviewIndex(target);
            svs.splice(curIdx, 1);
            if (targetIdx >= 0) {
                if (curIdx < targetIdx) --targetIdx;
                svs.splice(targetIdx + after ? 1 : 0, 0, sv);
            } else {
                // Make first or last since target was not found
                if (after) {
                    svs.push(sv);
                } else {
                    svs.unshift(sv);
                }
            }
        }
    }
});

/** Create locked counter functions for the tym.Layout class. */
tym.ThresholdCounter.createFixedThresholdCounter(tym.Layout, 1, 'locked');


/** A layout that sets the target attribute name to the target value for 
    each subview.
    
    Events:
        targetAttrName:string
        targetValue:*
    
    Attributes:
        targetAttrName:string the name of the attribute to set on each subview.
        targetValue:* the value to set the attribute to.
        setterName:string the name of the setter method to call on the subview
            for the targetAttrName. This value is updated when
            setTargetAttrName is called.
*/
tym.ConstantLayout = new JS.Class('ConstantLayout', tym.Layout, {
    // Accessors ///////////////////////////////////////////////////////////////
    setTargetAttrName: function(v) {
        if (this.targetAttrName !== v) {
            this.targetAttrName = v;
            this.setterName = tym.AccessorSupport.generateSetterName(v);
            if (this.inited) {
                this.fireNewEvent('targetAttrName', v);
                this.update();
            }
        }
    },
    
    setTargetValue: function(v) {
        if (this.targetValue !== v) {
            this.targetValue = v;
            if (this.inited) {
                this.fireNewEvent('targetValue', v);
                this.update();
            }
        }
    },
    
    
    // Methods /////////////////////////////////////////////////////////////////
    /** @overrides tym.Layout */
    update: function() {
        if (this.canUpdate()) {
            var setterName = this.setterName, 
                value = this.targetValue, 
                svs = this.subviews, len = svs.length, sv,
                setter, i = 0;
            for (; len > i;) {
                sv = svs[i++];
                setter = sv[setterName];
                if (setter) setter.call(sv, value);
            }
        }
    }
});


/** An extension of ConstantLayout that allows for variation based on the
    index and subview. An updateSubview method is provided that can be
    overriden to provide variable behavior.
    
    Events:
        collapseParent:boolean
        reverse:boolean
    
    Attributes:
        collapseParent:boolean If true the updateParent method will be called.
            The updateParent method will typically resize the parent to fit
            the newly layed out child views. Defaults to false.
        reverse:boolean If true the layout will position the items in the
            opposite order. For example, right to left instead of left to right.
            Defaults to false.
*/
tym.VariableLayout = new JS.Class('VariableLayout', tym.ConstantLayout, {
    // Life Cycle //////////////////////////////////////////////////////////////
    /** @overrides tym.Node */
    initNode: function(parent, attrs) {
        this.collapseParent = this.reverse = false;
        
        this.callSuper(parent, attrs);
    },
    
    
    // Accessors ///////////////////////////////////////////////////////////////
    setCollapseParent: function(v) {
        if (this.collapseParent !== v) {
            this.collapseParent = v;
            if (this.inited) {
                this.fireNewEvent('collapseParent', v);
                this.update();
            }
        }
    },
    
    setReverse: function(v) {
        if (this.reverse !== v) {
            this.reverse = v;
            if (this.inited) {
                this.fireNewEvent('reverse', v);
                this.update();
            }
        }
    },
    
    
    // Methods /////////////////////////////////////////////////////////////////
    /** @overrides tym.ConstantLayout */
    update: function() {
        if (this.canUpdate()) {
            // Prevent inadvertent loops
            this.incrementLockedCounter();
            
            this.doBeforeUpdate();
            
            var setterName = this.setterName, value = this.targetValue,
                svs = this.subviews, len = svs.length, i, sv, count = 0;
            
            if (this.reverse) {
                i = len;
                while(i) {
                    sv = svs[--i];
                    if (this.skipSubview(sv)) continue;
                    value = this.updateSubview(++count, sv, setterName, value);
                }
            } else {
                i = 0;
                while(len > i) {
                    sv = svs[i++];
                    if (this.skipSubview(sv)) continue;
                    value = this.updateSubview(++count, sv, setterName, value);
                }
            }
            
            this.doAfterUpdate();
            
            if (this.collapseParent && !this.parent.isBeingDestroyed) {
                this.updateParent(setterName, value);
            }
            
            this.decrementLockedCounter();
        }
    },
    
    /** Called by update before any processing is done. Gives subviews a
        chance to do any special setup before update is processed.
        @returns void */
    doBeforeUpdate: function() {
        // Subclasses to implement as needed.
    },
    
    /** Called by update after any processing is done but before the optional
        collapsing of parent is done. Gives subviews a chance to do any 
        special teardown after update is processed.
        @returns void */
    doAfterUpdate: function() {
        // Subclasses to implement as needed.
    },
    
    /** @overrides tym.Layout
        Provides a default implementation that calls update when the
        visibility of a subview changes. */
    startMonitoringSubview: function(sv) {
        this.attachTo(sv, 'update', 'visible');
    },
    
    /** @overrides tym.Layout
        Provides a default implementation that calls update when the
        visibility of a subview changes. */
    stopMonitoringSubview: function(sv) {
        this.detachFrom(sv, 'update', 'visible');
    },
    
    /** Called for each subview in the layout.
        @param count:int the number of subviews that have been layed out
            including the current one. i.e. count will be 1 for the first
            subview layed out.
        @param sv:View the subview being layed out.
        @param setterName:string the name of the setter method to call.
        @param value:* the layout value.
        @returns the value to use for the next subview. */
    updateSubview: function(count, sv, setterName, value) {
        sv[setterName](value);
        return value;
    },
    
    /** Called for each subview in the layout to determine if the view should
        be positioned or not. The default implementation returns true if the 
        subview is not visible.
        @param sv:View The subview to test.
        @returns true if the subview should be skipped during layout updates.*/
    skipSubview: function(sv) {
        return !sv.visible;
    },
    
    /** Called if the collapseParent attribute is true. Subclasses should 
        implement this if they want to modify the parent view.
        @param setterName:string the name of the setter method to call on
            the parent.
        @param value:* the value to set on the parent.
        @returns void */
    updateParent: function(setterName, value) {
        // Subclasses to implement as needed.
    }
});


/** Provides a mechanism to remember which PlatformObservables this 
    PlatformObserver has attached itself to. This is useful when the instance 
    is being destroyed to automatically cleanup the observer/observable 
    relationships.
    
    When this mixin is used attachment and detachment should be done 
    using the 'attachToPlatform' and 'detachFromPlatform' methods of this 
    mixin. If this is not done, it is possible for the relationship between 
    observer and observable to become broken.
    
    Events:
        None
    
    Attributes:
        None
    
    Private Attributes:
        __dobt: (Object) Holds arrays of PlatformObservables by event type.
*/
tym.PlatformObserver = new JS.Module('PlatformObserver', {
    // Methods /////////////////////////////////////////////////////////////////
    /** Attaches this PlatformObserverAdapter to the a SpriteBacked Node
        for an event type.
        @returns void */
    attachToPlatform: function(spriteBacked, methodName, eventType, capture) {
        if (spriteBacked && methodName && eventType) {
            capture = !!capture;
            
            var observable = spriteBacked.getSprite();
            if (observable.attachPlatformObserver) {
                // Lazy instantiate __dobt map.
                var observablesByType = this.__dobt || (this.__dobt = {});
                var observables = observablesByType[eventType] || (observablesByType[eventType] = []);
                
                // Attach this PlatformObserver to the PlatformObservable
                if (observable.attachPlatformObserver(this, methodName, eventType, capture)) {
                    observables.push(capture, methodName, observable);
                }
            }
        }
    },
    
    /** Detaches this PlatformObserverAdapter from a SpriteBacked Node for an
        event type.
        @returns boolean True if detachment succeeded, false otherwise. */
    detachFromPlatform: function(spriteBacked, methodName, eventType, capture) {
        if (spriteBacked && methodName && eventType) {
            capture = !!capture;
            
            var observable = spriteBacked.getSprite();
            if (observable.detachPlatformObserver) {
                // No need to detach if observable array doesn't exist.
                var observablesByType = this.__dobt;
                if (observablesByType) {
                    var observables = observablesByType[eventType];
                    if (observables) {
                        // Remove all instances of this observer/methodName/type/capture 
                        // from the observable
                        var retval = false, i = observables.length;
                        while (i) {
                            i -= 3;
                            if (observable === observables[i + 2] && 
                                methodName === observables[i + 1] && 
                                capture === observables[i]
                            ) {
                                if (observable.detachPlatformObserver(this, methodName, eventType, capture)) {
                                    observables.splice(i, 3);
                                    retval = true;
                                }
                            }
                        }
                        
                        // Observable wasn't found
                        return retval;
                    }
                }
            }
        }
        return false;
    },
    
    /** Detaches this PlatformObserver from all PlatformObservables it is attached to.
        @returns void */
    detachFromAllPlatformSources: function() {
        var observablesByType = this.__dobt;
        if (observablesByType) {
            var observables, i, eventType;
            for (eventType in observablesByType) {
                observables = observablesByType[eventType];
                i = observables.length;
                while (i) observables[--i].detachPlatformObserver(this, observables[--i], eventType, observables[--i]);
                observables.length = 0;
            }
        }
    }
});


/** Indicates that a tym.Node is backed by a sprite. */
tym.SpriteBacked = new JS.Module('SpriteBacked', {
    // Accessors ///////////////////////////////////////////////////////////////
    setSprite: function(sprite) {
        if (this.sprite) {
            tym.dumpStack('Attempt to reset sprite.');
        } else {
            this.sprite = sprite;
        }
    },
    
    getSprite: function() {
        return this.sprite;
    },
    
    
    // Methods /////////////////////////////////////////////////////////////////
    createSprite: function(attrs) {
        return tym.sprite.createSprite(this, attrs);
    }
});


/** Generates Platform Events and passes them on to one or more event observers.
    
    Events:
        None
    
    Attributes:
        None
    
    Private Attributes:
        __dobsbt:object Stores arrays of tym.sprite.PlatformObservers and 
            method names by event type.
*/
tym.sprite.PlatformObservable = new JS.Module('sprite.PlatformObservable', {
    // Methods /////////////////////////////////////////////////////////////////
    /** Adds the observer to the list of event recipients for the event type.
        @param platformObserver:tym.sprite.PlatformObserver The observer that 
            will be notified when a platform event occurs.
        @param methodName:string The method name to call on the platform 
            observer.
        @param eventType:string The type of platform event to register for.
        @param capture:boolean (optional) Indicates if the event registration
            is during capture or bubble phase. Defaults to false, bubble phase.
        @returns boolean True if the observer was successfully registered, 
            false otherwise.*/
    attachPlatformObserver: function(platformObserver, methodName, eventType, capture) {
        if (platformObserver && methodName && eventType) {
            capture = !!capture;
            
            var methodRef = this.createPlatformMethodRef(platformObserver, methodName, eventType);
            if (methodRef) {
                var platformObserversByType = this.__dobsbt || (this.__dobsbt = {});
                
                // Lazy instantiate platform observers array for type and insert observer.
                var platformObservers = platformObserversByType[eventType];
                if (!platformObservers) {
                    // Create list with observer
                    platformObserversByType[eventType] = [platformObserver, methodName, methodRef, capture];
                } else {
                    // Add platform observer to the end of the list
                    platformObservers.push(platformObserver, methodName, methodRef, capture);
                }
                
                tym.sprite.addEventListener(this.platformObject, eventType, methodRef, capture);
                
                return true;
            }
        }
        return false;
    },
    
    /** Creates a function that will handle the platform event when it is fired
        by the browser. Must be implemented by the object this mixin is 
        applied to.
        @param platformObserver:tym.sprite.PlatformObserver the observer that 
            must be notified when the platform event fires.
        @param methodName:string the name of the function to pass the event to.
        @param eventType:string the type of the event to fire.
        @returns a function to handle the platform event or null if the event
            is not supported. */
    createPlatformMethodRef: function(platformObserver, methodName, eventType) {
        return null;
    },
    
    /** Used by the createPlatformMethodRef implementations of submixins of 
        tym.sprite.PlatformObservable to implement the standard methodRef.
        @param platformObserver:tym.sprite.PlatformObserver the observer that 
            must be notified when the platform event fires.
        @param methodName:string the name of the function to pass the event to.
        @param eventType:string the type of the event to fire.
        @param observableClass:JS.Class The class that has the common event.
        @param preventDefault:boolean (Optional) If true the default behavior
            of the platform event will be prevented.
        @returns a function to handle the platform event or undefined if the 
            event will not be handled. */
    createStandardPlatformMethodRef: function(platformObserver, methodName, eventType, observableClass, preventDefault) {
        if (observableClass.EVENT_TYPES[eventType]) {
            var self = this, 
                event = observableClass.EVENT;
            return function(platformEvent) {
                if (!platformEvent) var platformEvent = global.event;
                
                event.source = self;
                event.type = platformEvent.type;
                event.value = platformEvent;
                
                var allowBubble = platformObserver[methodName](event);
                if (!allowBubble) {
                    platformEvent.cancelBubble = true;
                    if (platformEvent.stopPropagation) platformEvent.stopPropagation();
                    
                    if (preventDefault) tym.sprite.preventDefault(platformEvent);
                }
                
                event.source = undefined;
            };
        }
    },
    
    /** Removes the observer from the list of platform observers for the 
        event type.
        @param platformObserver:tym.sprite.PlatformObserver The platform 
            observer to unregister.
        @param methodName:string The method name to unregister for.
        @param eventType:string The platform event type to unregister for.
        @param capture:boolean (optional) The event phase to unregister for.
            Defaults to false if not provided.
        @returns boolean True if the observer was successfully unregistered, 
            false otherwise.*/
    detachPlatformObserver: function(platformObserver, methodName, eventType, capture) {
        if (platformObserver && methodName && eventType) {
            capture = !!capture;
            
            var platformObserversByType = this.__dobsbt;
            if (platformObserversByType) {
                var platformObservers = platformObserversByType[eventType];
                if (platformObservers) {
                    // Remove platform observer
                    var retval = false, platformObject = this.platformObject, i = platformObservers.length;
                    while (i) {
                        i -= 4;
                        if (platformObserver === platformObservers[i] && 
                            methodName === platformObservers[i + 1] && 
                            capture === platformObservers[i + 3]
                        ) {
                            if (platformObject) tym.sprite.removeEventListener(platformObject, eventType, platformObservers[i + 2], capture);
                            platformObservers.splice(i, 4);
                            retval = true;
                        }
                    }
                    return retval;
                }
            }
        }
        return false;
    },
    
    /** Detaches all platform observers from this PlatformObservable.
        @returns void */
    detachAllPlatformObservers: function() {
        var platformObject = this.platformObject;
        if (platformObject) {
            var platformObserversByType = this.__dobsbt;
            if (platformObserversByType) {
                var platformObservers, methodRef, capture, i, eventType;
                for (eventType in platformObserversByType) {
                    platformObservers = platformObserversByType[eventType];
                    i = platformObservers.length;
                    while (i) {
                        capture = platformObservers[--i];
                        methodRef = platformObservers[--i];
                        i -= 2; // methodName and platformObserver
                        tym.sprite.removeEventListener(platformObject, eventType, methodRef, capture);
                    }
                    platformObservers.length = 0;
                }
            }
        }
    }
});


/** Generates Mouse Events and passes them on to one or more event observers.
    Also provides the capability to capture contextmenu events and mouse
    wheel events.
    
    Requires: tym.sprite.PlatformObservable callSuper mixin.
*/
tym.sprite.MouseObservable = new JS.Module('sprite.MouseObservable', {
    // Class Methods and Attributes ////////////////////////////////////////////
    extend: {
        /** A map of supported mouse event types. */
        EVENT_TYPES:{
            mouseover:true,
            mouseout:true,
            mousedown:true,
            mouseup:true,
            click:true,
            dblclick:true,
            mousemove:true,
            contextmenu:true,
            wheel:true
        },
        
        /** The common mouse event that gets reused. */
        EVENT:{source:null, type:null, value:null},
        
        /** Gets the mouse coordinates from the provided event.
            @param event
            @returns object: An object with 'x' and 'y' keys containing the
                x and y mouse position. */
        getMouseFromEvent: function(event) {
            var platformEvent = event.value;
            return {x:platformEvent.pageX, y:platformEvent.pageY};
        },
        
        getMouseFromEventRelativeToView: function(event, view) {
            var viewPos = view.getAbsolutePosition(),
                pos = this.getMouseFromEvent(event);
            pos.x -= viewPos.x;
            pos.y -= viewPos.y;
            return pos;
        }
    },
    
    
    // Methods /////////////////////////////////////////////////////////////////
    /** @overrides tym.sprite.PlatformObservable */
    createPlatformMethodRef: function(platformObserver, methodName, type) {
        return this.createStandardPlatformMethodRef(platformObserver, methodName, type, tym.sprite.MouseObservable, true) || 
            this.callSuper(platformObserver, methodName, type);
    }
});


/** Generates Key Events and passes them on to one or more event observers.
    Requires tym.DomObservable as a callSuper mixin. */
tym.sprite.KeyObservable = new JS.Module('sprite.KeyObservable', {
    // Class Methods and Attributes ////////////////////////////////////////////
    extend: {
        /** A map of supported key event types. */
        EVENT_TYPES:{
            keypress:true,
            keydown:true,
            keyup:true
        },
        
        /** The common key event that gets reused. */
        EVENT:{source:null, type:null, value:null},
        
        /** Gets the key code from the provided key event.
            @param event:event
            @returns number The keycode from the event. */
        getKeyCodeFromEvent: function(event) {
            var platformEvent = event.value, 
                keyCode = platformEvent.keyCode;
            return keyCode || platformEvent.charCode;
        }
    },
    
    
    // Methods /////////////////////////////////////////////////////////////////
    /** @overrides tym.sprite.PlatformObservable */
    createPlatformMethodRef: function(platformObserver, methodName, type) {
        return this.createStandardPlatformMethodRef(platformObserver, methodName, type, tym.sprite.KeyObservable) || 
            this.callSuper(platformObserver, methodName, type);
    }
});


/** Tracks focus and provides global focus events. Registered with tym.global 
    as 'focus'.
    
    Events:
        focused:View Fired when the focused view changes. The event value is
            the newly focused view.
    
    Attributes:
        lastTraversalWasForward:boolean indicates if the last traversal was
            in the forward direction or not. If false this implies the last
            traversal was in the backward direction. This value is initalized
            to true.
        focusedView:View the view that currently has focus.
        prevFocusedView:View the view that previously had focus.
*/
new JS.Singleton('GlobalFocus', {
    include: [tym.Observable],
    
    
    // Constructor /////////////////////////////////////////////////////////////
    initialize: function() {
        tym.global.register('focus', this);
    },
    
    
    // Accessors ///////////////////////////////////////////////////////////////
    /** Sets the currently focused view. */
    setFocusedView: function(v) {
        if (tym.sprite.focus.setFocusedView(v)) this.fireNewEvent('focused', v);
    },
    
    
    // Methods /////////////////////////////////////////////////////////////////
    /** Called by a FocusObservable when it has received focus.
        @param focusable:FocusObservable the view that received focus.
        @returns void. */
    notifyFocus: function(focusable) {
        tym.sprite.focus.notifyFocus(focusable);
    },
    
    /** Called by a FocusObservable when it has lost focus.
        @param focusable:FocusObservable the view that lost focus.
        @returns void. */
    notifyBlur: function(focusable) {
        tym.sprite.focus.notifyBlur(focusable);
    },
    
    /** Clears the current focus.
        @returns void */
    clear: function() {
        tym.sprite.focus.clear();
    },
    
    // Focus Traversal //
    /** Move focus to the next focusable element.
        @param ignoreFocusTrap:boolean If true focus traps will be skipped over.
        @returns void */
    next: function(ignoreFocusTrap) {
        tym.sprite.focus.next(ignoreFocusTrap);
    },
    
    /** Move focus to the previous focusable element.
        @param ignoreFocusTrap:boolean If true focus traps will be skipped over.
        @returns void */
    prev: function(ignoreFocusTrap) {
        tym.sprite.focus.prev(ignoreFocusTrap);
    }
});


/** Generates focus and blur events and passes them on to one or more 
    event observers. Also provides focus related events to a view. When a view
    is focused or blurred, tym.global.focus will be notified via the
    'notifyFocus' and 'notifyBlur' methods.
    
    Requires tym.sprite.DomObservable as a callSuper mixin.
    
    Events:
        focused:object Fired when this view gets focus. The value is this view.
        focus:object Fired when this view gets focus. The value is a dom
            focus event.
        blur:object Fired when this view loses focus. The value is a dom
            focus event.
    
    Attributes:
        focused:boolean Indicates if this view has focus or not.
        focusable:boolean Indicates if this view can have focus or not.
        focusEmbellishment:boolean Indicates if the focus embellishment should
            be shown for this view or not when it has focus.
*/
tym.sprite.FocusObservable = new JS.Module('sprite.FocusObservable', {
    // Class Methods and Attributes ////////////////////////////////////////////
    extend: {
        /** A map of supported focus event types. */
        EVENT_TYPES:{
            focus:true,
            blur:true
        },
        
        /** The common focus/blur event that gets reused. */
        EVENT:{source:null, type:null, value:null}
    },
    
    
    // Accessors ///////////////////////////////////////////////////////////////
    setFocusable: function(v) {
        var view = this.view;
        if (v) {
            this.platformObject.tabIndex = 0; // Make focusable. -1 is programtic only
            view.attachToPlatform(view, '__handleFocus', 'focus');
            view.attachToPlatform(view, '__handleBlur', 'blur');
        } else if (wasFocusable) {
            this.platformObject.removeAttribute('tabIndex'); // Make unfocusable
            view.detachFromPlatform(view, '__handleFocus', 'focus');
            view.detachFromPlatform(view, '__handleBlur', 'blur');
        }
        return v;
    },
    
    
    // Methods /////////////////////////////////////////////////////////////////
    showFocusEmbellishment: function() {
        // IE
        this.platformObject.hideFocus = false;
        
        // Mozilla and Webkit
        var s = this.styleObj;
        s.outlineWidth = 'thin';
        s.outlineColor = '#88bbff';
        s.outlineStyle = 'solid';
        s.outlineOffset = '0px';
    },
    
    hideFocusEmbellishment: function() {
        // IE
        this.platformObject.hideFocus = true;
        
        // Mozilla and Webkit
        this.styleObj.outlineStyle = 'none';
    },
    
    /** Calling this method will set focus onto this view if it is focusable.
        @param noScroll:boolean (optional) if true is provided no auto-scrolling
            will occur when focus is set.
        @returns void */
    focus: function(noScroll) {
        var po = this.platformObject;
        if (noScroll) {
            // Maintain scrollTop/scrollLeft
            var ancestors = this.getAncestorArray(po),
                len = ancestors.length, i = len, ancestor,
                scrollPositions = [], scrollPosition;
            while (i) {
                ancestor = ancestors[--i];
                scrollPositions.unshift({scrollTop:ancestor.scrollTop, scrollLeft:ancestor.scrollLeft});
            }
            
            po.focus();
            
            // Restore scrollTop/scrollLeft
            i = len;
            while (i) {
                ancestor = ancestors[--i];
                scrollPosition = scrollPositions[i];
                ancestor.scrollTop = scrollPosition.scrollTop;
                ancestor.scrollLeft = scrollPosition.scrollLeft;
            }
        } else {
            po.focus();
        }
    },
    
    /** Removes the focus from this view. Do not call this method directly.
        @private
        @returns void */
    blur: function() {
        this.platformObject.blur();
    },
    
    /** @overrides tym.PlatformObservable */
    createPlatformMethodRef: function(platformObserver, methodName, type) {
        if (tym.sprite.FocusObservable.EVENT_TYPES[type]) {
            var self = this;
            return function(platformEvent) {
                if (!platformEvent) var platformEvent = global.event;
                
                // OPTIMIZATION: prevent extra focus events under special 
                // circumstances. See tym.VariableLayout for more detail.
                if (self._ignoreFocus) {
                    platformEvent.cancelBubble = true;
                    if (platformEvent.stopPropagation) platformEvent.stopPropagation();
                    tym.sprite.preventDefault(platformEvent);
                    return;
                }
                
                // Configure common focus event.
                var event = tym.sprite.FocusObservable.EVENT;
                event.source = self;
                event.type = platformEvent.type;
                event.value = platformEvent;
                
                var allowBubble = platformObserver[methodName](event);
                if (!allowBubble) {
                    platformEvent.cancelBubble = true;
                    if (platformEvent.stopPropagation) platformEvent.stopPropagation();
                }
                
                event.source = undefined;
            };
        }
        
        return this.callSuper(platformObserver, methodName, type);
    }
});


/** Provides an interface to platform specific View functionality. */
tym.sprite.View = new JS.Class('sprite.View', {
    include: [
        tym.Destructible,
        tym.sprite.PlatformObservable,
        tym.sprite.KeyObservable,
        tym.sprite.MouseObservable,
        tym.sprite.FocusObservable
    ],
    
    
    // Constructor /////////////////////////////////////////////////////////////
    /** The standard JSClass initializer function. Subclasses should not
        override this function.
        @param view:tym.View The view this sprite is backing.
        @param attrs:object A map of attribute names and values.
        @returns void */
    initialize: function(view, attrs) {
        this.view = view;
        this.platformObject = this.createPlatformObject(attrs || {});
        this.platformObject.model = this;
        this.styleObj = this.platformObject.style;
    },


    // Life Cycle //////////////////////////////////////////////////////////////
    createPlatformObject: function(attrs) {
        var document = global.document,
            elem = document.createElement('div'),
            s = elem.style;
        s.position = 'absolute';
        
        // Necessary since x and y of 0 won't update deStyle so this gets
        // things initialized correctly. Without this RootViews will have
        // an incorrect initial position for x or y of 0.
        s.left = s.top = '0px';
        
        // Root views need to be attached to an existing dom element
        if (attrs.__isRootView) document.getElementsByTagName('body')[0].appendChild(elem);
        
        return elem;
    },
    
    destroy: function() {
        delete this.platformObject.model;
        this.detachAllPlatformObservers();
        this.callSuper();
    },
    
    
    // Attributes //////////////////////////////////////////////////////////////
    setX: function(v) {
        if (this.view.visible) this.styleObj.left = v + 'px';
        return v;
    },
    
    setY: function(v) {
        if (this.view.visible) this.styleObj.top = v + 'px';
        return v;
    },
    
    setWidth: function(v) {
        // Dom elements don't support negative width
        if (0 > v) v = 0;
        this.styleObj.width = v + 'px';
        return v;
    },
    
    setHeight: function(v, supressEvent) {
        // Dom elements don't support negative height
        if (0 > v) v = 0;
        this.styleObj.height = v + 'px';
        return v;
    },
    
    setBgcolor: function(v) {
        this.styleObj.backgroundColor = v;
        return v;
    },
    
    setOpacity: function(v) {
        this.styleObj.opacity = v;
        return v;
    },
    
    setVisible: function(v) {
        var s = this.styleObj;
        s.visibility = v ? 'inherit' : 'hidden';
        
        // Move invisible elements to a very negative location so they won't
        // effect scrollable area. Ideally we could use display:none but we
        // can't because that makes measuring bounds not work.
        s.left = v ? this.view.x + 'px' : '-100000px';
        s.top = v ? this.view.y + 'px' : '-100000px';
        return v;
    },
    
    setCursor: function(v) {
        this.styleObj.cursor = v || 'auto';
        return v;
    },
    
    
    // Methods /////////////////////////////////////////////////////////////////
    appendSprite: function(sprite) {
        this.platformObject.appendChild(sprite.platformObject);
    },
    
    removeSprite: function(sprite) {
        this.platformObject.removeChild(sprite.platformObject);
    },
    
    /** Gets the computed style for a dom element.
        @returns object the style object.
        @private */
    __getComputedStyle: function() {
        return tym.sprite.__getComputedStyle(this.platformObject);
    },
    
    /** Gets the x and y position of the dom element relative to the 
        ancestor dom element or the page. Transforms are not supported.
        @param ancestorView:View (optional) An ancestor View
            that if encountered will halt the page position calculation
            thus giving the position relative to ancestorView.
        @returns object with 'x' and 'y' keys or null if an error has
            occurred. */
    getAbsolutePosition: function(ancestorView) {
        var elem = this.platformObject,
            ancestorElem = ancestorView ? ancestorView.sprite.platformObject : null;
            x = 0, y = 0, s,
            borderMultiplier = tym.sprite.platform.browser === 'Firefox' ? 2 : 1; // I have no idea why firefox needs it twice, but it does.
        
        // elem.nodeName !== "BODY" test prevents looking at the body
        // which causes problems when the document is scrolled on webkit.
        while (elem && elem.nodeName !== "BODY" && elem !== ancestorElem) {
            x += elem.offsetLeft;
            y += elem.offsetTop;
            elem = elem.offsetParent;
            if (elem && elem.nodeName !== "BODY") {
                s = this.getComputedStyle();
                x += borderMultiplier * parseInt(s.borderLeftWidth, 10) - elem.scrollLeft;
                y += borderMultiplier * parseInt(s.borderTopWidth, 10) - elem.scrollTop;
            }
        }
        
        return {x:x, y:y};
    },
    
    /** Gets an array of ancestor platform objects including the platform
        object for this sprite.
        @param ancestor (optional) The platform element to stop
            getting ancestors at.
        @returns an array of ancestor elements. */
    getAncestorArray: function(ancestor) {
        var ancestors = [],
            elem = this.platformObject
        while (elem) {
            ancestors.push(elem);
            if (elem === ancestor) break;
            elem = elem.parentNode;
        }
        return ancestors;
    }
});


/** A Node that can be viewed. Instances of view are typically backed by
    an absolutely positioned div element.
    
    Events:
        x:number
        y:number
        width:number (supressable)
        height:number (supressable)
        boundsWidth:number Fired when the bounds width of the view changes.
        boundsHeight:number Fired when the bounds height of the view changes.
        bgcolor:string
        opacity:number
        visible:boolean
        subviewAdded:tym.View Fired when a subview is added to this view.
        subviewRemoved:tym.View Fired when a subview is removed from this view.
        layoutAdded:tym.Layout Fired when a layout is added to this view.
        layoutRemoved:tym.Layout Fired when a layout is removed from this view.
    
    Attributes:
        focusTrap:boolean Determines if focus traversal can move above this view
            or not. The default is undefined which is equivalent to false. Can 
            be ignored using a key modifier. The key modifier is 
            typically 'option'.
        focusCage:boolean Determines if focus traversal can move above this view
            or not. The default is undefined which is equivalent to false. This
            is the same as focusTrap except it can't be ignored using a 
            key modifier.
        maskFocus:boolean Prevents focus from traversing into this view or any
            of its subviews. The default is undefined which is equivalent 
            to false.
        ignoreLayout:boolean Determines if this view should be included in 
            layouts or not. Default is undefined which is equivalent to false.
        x:number The x-position of this view in pixels. Defaults to 0.
        y:number The y-position of this view in pixels. Defaults to 0.
        width:number The width of this view in pixels. Defaults to 0.
        height:number the height of this view in pixels. Defaults to 0.
        boundsWidth:number (read only) The actual bounds of the view in the
            x-dimension. This value is in pixels relative to the RootView and
            thus compensates for rotation and scaling.
        boundsHeight:number (read only) The actual bounds of the view in the
            y-dimension. This value is in pixels relative to the RootView and
            thus compensates for rotation and scaling.
        bgcolor:string The background color of this view. Use a value of 
            'transparent' to make this view transparent. Defaults 
            to 'transparent'.
        opacity:number The opacity of this view. The value should be a number 
            between 0 and 1. Defaults to 1.
        visible:boolean Makes this view visible or not. The default value is 
            true which means visbility is inherited from the parent view.
        cursor:string Determines what cursor to show when moused over the view.
            Allowed values: 'auto', 'move', 'no-drop', 'col-resize', 
            'all-scroll', 'pointer', 'not-allowed', 'row-resize', 'crosshair', 
            'progress', 'e-resize', 'ne-resize', 'default', 'text', 'n-resize', 
            'nw-resize', 'help', 'vertical-text', 's-resize', 'se-resize', 
            'inherit', 'wait', 'w-resize', 'sw-resize'. Defaults to undefined 
            which is equivalent to 'auto'.
    
    Private Attributes:
        subviews:array The array of child tym.Views for this view. Should 
            be accessed through the getSubviews method.
        layouts:array The array of child tym.Layouts for this view. Should
            be accessed through the getLayouts method.
*/
tym.View = new JS.Class('View', tym.Node, {
    include: [
        tym.SpriteBacked,
        tym.PlatformObserver
    ],
    
    
    // Life Cycle //////////////////////////////////////////////////////////////
    /** @overrides tym.Node */
    initNode: function(parent, attrs) {
        this.x = this.y = this.width = this.height = 0;
        this.opacity = 1;
        this.visible = true;
        
        this.focusable = false;
        this.focusEmbellishment = true;
        
        this.setSprite(this.createSprite(attrs));
        
        this.callSuper(parent, attrs);
    },
    
    /** @overrides tym.Node */
    destroyBeforeOrphaning: function() {
        this.giveAwayFocus();
        this.callSuper();
    },
    
    /** @overrides tym.Node */
    destroyAfterOrphaning: function() {
        this.callSuper();
        
        this.detachFromAllPlatformSources();
        this.sprite.destroy();
    },
    
    
    // Accessors ///////////////////////////////////////////////////////////////
    /** Does lazy instantiation of the subviews array. */
    getSubviews: function() {
        return this.subviews || (this.subviews = []);
    },
    
    /** Gets the views that are our siblings.
        @returns array of tym.View or null if this view is orphaned. */
    getSiblingViews: function() {
        if (!this.parent) return null;
        
        // Get a copy of the subviews since we will filter it.
        var svs = this.parent.getSubviews().concat();
        
        // Filter out ourself
        tym.filterArray(svs, this);
        
        return svs;
    },
    
    // Layout Attributes //
    /** Does lazy instantiation of the layouts array. */
    getLayouts: function() {
        return this.layouts || (this.layouts = []);
    },
    
    setIgnoreLayout: function(v) {
        if (this.ignoreLayout !== v) {
            // Add or remove ourselves from any layouts on our parent.
            var ready = this.inited && this.parent, layouts, i;
            if (v) {
                if (ready) {
                    layouts = this.parent.getLayouts();
                    i = layouts.length;
                    while (i) layouts[--i].removeSubview(this);
                }
                this.ignoreLayout = v;
            } else {
                this.ignoreLayout = v;
                if (ready) {
                    layouts = this.parent.getLayouts();
                    i = layouts.length;
                    while (i) layouts[--i].addSubview(this);
                }
            }
        }
    },
    
    // Focus Attributes //
    setFocusTrap: function(v) {this.focusTrap = v;},
    setFocusCage: function(v) {this.focusCage = v;},
    setMaskFocus: function(v) {this.maskFocus = v;},
    
    setFocused: function(v) {
        if (this.focused !== v) {
            this.focused = v;
            if (this.inited) {
                this.fireNewEvent('focused', v);
                var gf = tym.global.focus;
                if (v) {
                    gf.notifyFocus(this);
                } else {
                    gf.notifyBlur(this);
                }
            }
        }
    },
    
    setFocusable: function(v) {
        if (this.focusable !== v) {
            this.focusable = this.sprite.setFocusable(v);
            if (this.inited) this.fireNewEvent('focusable', this.focusable);
        }
    },
    
    setFocusEmbellishment: function(v) {
        if (this.focusEmbellishment !== v) {
            this.focusEmbellishment = v;
            if (this.focused) {
                if (v) {
                    this.showFocusEmbellishment();
                } else {
                    this.hideFocusEmbellishment();
                }
            }
        }
    },
    
    // Visual Attributes //
    setX: function(v) {
        if (this.x !== v) {
            this.x = this.sprite.setX(v);
            if (this.inited) this.fireNewEvent('x', this.x);
        }
    },
    
    setY: function(v) {
        if (this.y !== v) {
            this.y = this.sprite.setY(v);
            if (this.inited) this.fireNewEvent('y', this.y);
        }
    },
    
    setWidth: function(v) {
        if (this.width !== v) {
            this.width = this.sprite.setWidth(v);
            if (this.inited) {
                this.__updateBounds(this.width, this.height);
                this.fireNewEvent('width', this.width);
            }
        }
    },
    
    setHeight: function(v) {
        if (this.height !== v) {
            this.height = this.sprite.setHeight(v);
            if (this.inited) {
                this.__updateBounds(this.width, this.height);
                this.fireNewEvent('height', this.height);
            }
        }
    },
    
    setBgcolor: function(v) {
        if (this.bgcolor !== v) {
            this.bgcolor = this.sprite.setBgcolor(v);
            if (this.inited) this.fireNewEvent('bgcolor', this.bgcolor);
        }
    },
    
    setOpacity: function(v) {
        if (this.opacity !== v) {
            this.opacity = this.sprite.setOpacity(v);
            if (this.inited) this.fireNewEvent('opacity', this.opacity);
        }
    },
    
    setVisible: function(v) {
        if (this.visible !== v) {
            this.visible = this.sprite.setVisible(v);
            if (this.inited) this.fireNewEvent('visible', this.visible);
        }
    },
    
    setCursor: function(v) {
        if (this.cursor !== v) {
            this.cursor = this.sprite.setCursor(v);
            if (this.inited) this.fireNewEvent('cursor', v);
        }
    },
    
    /** Updates the boundsWidth and boundsHeight attributes.
        @private
        @param w:number the boundsWidth to set.
        @param h:number the boundsHeight to set.
        @returns void */
    __updateBounds: function(w, h) {
        if (this.boundsWidth !== w) {
            this.boundsWidth = w;
            this.fireNewEvent('boundsWidth', w);
        }
        
        if (this.boundsHeight !== h) {
            this.boundsHeight = h;
            this.fireNewEvent('boundsHeight', h);
        }
    },
    
    
    // Methods /////////////////////////////////////////////////////////////////,
    /** Gets the x and y position of the underlying dom element relative to
        the page. Transforms are not supported.
        @returns object with 'x' and 'y' keys or null if no position could
            be determined. */
    getAbsolutePosition: function() {
        return this.sprite.getAbsolutePosition();
    },
    
    /** Checks if this view is visible and each view in the parent chain to
        the RootView is also visible. Dom elements are not explicitly
        checked. If you need to check that use tym.DomElementProxy.isDomElementVisible.
        @returns true if this view is visible, false otherwise. */
    isVisible: function() {
        return this.searchAncestorsOrSelf(function(v) {return !v.visible;}) === null;
    },
    
    /** @overrides tym.Node
        Calls this.subviewAdded if the added subnode is a tym.View. 
        @fires subviewAdded event with the provided Node if it's a View. 
        @fires layoutAdded event with the provided node if it's a Layout. */
    subnodeAdded: function(node) {
        if (node instanceof tym.View) {
            this.sprite.appendSprite(node.sprite);
            this.getSubviews().push(node);
            this.fireNewEvent('subviewAdded', node);
            this.subviewAdded(node);
        } else if (node instanceof tym.Layout) {
            this.getLayouts().push(node);
            this.fireNewEvent('layoutAdded', node);
            this.layoutAdded(node);
        }
    },
    
    /** @overrides tym.Node
        Calls this.subviewRemoved if the remove subnode is a tym.View.
        @fires subviewRemoved event with the provided Node if it's a View
            and removal succeeds. 
        @fires layoutRemoved event with the provided Node if it's a Layout
            and removal succeeds. */
    subnodeRemoved: function(node) {
        var idx;
        if (node instanceof tym.View) {
            idx = this.getSubviewIndex(node);
            if (idx !== -1) {
                this.fireNewEvent('subviewRemoved', node);
                this.sprite.removeSprite(node.sprite);
                this.subviews.splice(idx, 1);
                this.subviewRemoved(node);
            }
        } else if (node instanceof tym.Layout) {
            idx = this.getLayoutIndex(node);
            if (idx !== -1) {
                this.fireNewEvent('layoutRemoved', node);
                this.layouts.splice(idx, 1);
                this.layoutRemoved(node);
            }
        }
    },
    
    // Subviews //
    /** Checks if this View has the provided View in the subviews array.
        @param sv:View the view to look for.
        @returns true if the subview is found, false otherwise. */
    hasSubview: function(sv) {
        return this.getSubviewIndex(sv) !== -1;
    },
    
    /** Gets the index of the provided View in the subviews array.
        @param sv:View the view to look for.
        @returns the index of the subview or -1 if not found. */
    getSubviewIndex: function(sv) {
        return this.getSubviews().indexOf(sv);
    },
    
    /** Called when a View is added to this View. Do not call this method to 
        add a View. Instead call addSubnode or setParent.
        @param sv:View the view that was added.
        @returns void */
    subviewAdded: function(sv) {},
    
    /** Called when a View is removed from this View. Do not call this method 
        to remove a View. Instead call removeSubnode or setParent.
        @param sv:View the view that was removed.
        @returns void */
    subviewRemoved: function(sv) {},
    
    // Layouts //
    /** Checks if this View has the provided Layout in the layouts array.
        @param layout:Layout the layout to look for.
        @returns true if the layout is found, false otherwise. */
    hasLayout: function(layout) {
        return this.getLayoutIndex(layout) !== -1;
    },
    
    /** Gets the index of the provided Layout in the layouts array.
        @param layout:Layout the layout to look for.
        @returns the index of the layout or -1 if not found. */
    getLayoutIndex: function(layout) {
        return this.getLayouts().indexOf(layout);
    },
    
    /** Called when a Layout is added to this View. Do not call this method to 
        add a Layout. Instead call addSubnode or setParent.
        @param layout:Layout the layout that was added.
        @returns void */
    layoutAdded: function(layout) {},
    
    /** Called when a Layout is removed from this View. Do not call this 
        method to remove a Layout. Instead call removeSubnode or setParent.
        @param layout:Layout the layout that was removed.
        @returns void */
    layoutRemoved: function(layout) {},
    
    // Focus //
    /** Finds the youngest ancestor (or self) that is a focusTrap or focusCage.
        @param ignoreFocusTrap:boolean indicates focusTraps should be
            ignored.
        @returns a View with focusTrap set to true or null if not found. */
    getFocusTrap: function(ignoreFocusTrap) {
        return this.searchAncestorsOrSelf(
            function(v) {
                return v.focusCage || (v.focusTrap && !ignoreFocusTrap);
            }
        );
    },
    
    /** Tests if this view is in a state where it can receive focus.
        @returns boolean True if this view is visible, enabled, focusable and
            not focus masked, false otherwise. */
    isFocusable: function() {
        return this.focusable && !this.disabled && this.isVisible() && 
            this.searchAncestorsOrSelf(function(n) {return n.maskFocus === true;}) === null;
    },
    
    /** Gives the focus to the next focusable element or, if nothing else
        is focusable, blurs away from this element.
        @returns void */
    giveAwayFocus: function() {
        if (this.focused) {
            // Try to go to next focusable element.
            tym.global.focus.next();
            
            // If focus loops around to ourself make sure we don't keep it.
            if (this.focused) this.blur();
        }
    },
    
    /** @private */
    __handleFocus: function(event) {
        if (!this.focused) {
            this.setFocused(true);
            this.doFocus();
        }
    },
    
    /** @private */
    __handleBlur: function(event) {
        if (this.focused) {
            this.doBlur();
            this.setFocused(false);
        }
    },
    
    doFocus: function() {
        if (this.focusEmbellishment) {
            this.showFocusEmbellishment();
        } else {
            this.hideFocusEmbellishment();
        }
    },
    
    doBlur: function() {
        if (this.focusEmbellishment) this.hideFocusEmbellishment();
    },
    
    showFocusEmbellishment: function() {
        this.sprite.showFocusEmbellishment();
    },
    
    hideFocusEmbellishment: function() {
        this.sprite.hideFocusEmbellishment();
    },
    
    /** Calling this method will set focus onto this view if it is focusable.
        @param noScroll:boolean (optional) if true is provided no auto-scrolling
            will occur when focus is set.
        @returns void */
    focus: function(noScroll) {
        if (this.isFocusable()) this.sprite.focus(noScroll);
    },
    
    /** Removes the focus from this view. Do not call this method directly.
        @private
        @returns void */
    blur: function() {
        this.sprite.blur();
    },
    
    /** Implement this method to return the next view that should have focus.
        If null/undefined is returned or the method is not implemented, 
        normal dom traversal will occur. */
    getNextFocus: function() {},
    
    /** Implement this method to return the previous view that should have 
        focus. If null/undefined is returned or the method is not implemented, 
        normal dom traversal will occur. */
    getPrevFocus: function() {}
});


/** Provides events when a new tym.RootView is created or destroyed.
    Registered in tym.global as 'roots'.
    
    Events:
        rootAdded:RootView Fired when a RootView is added. The value is the 
            RootView added.
        rootRemoved:RootView Fired when a RootView is removed. The value is the 
            RootView removed.
    
    Attributes:
        None
    
    Private Attributes:
        __roots:array Holds an array of RootViews.
*/
new JS.Singleton('GlobalRootViewRegistry', {
    include: [tym.Observable],
    
    
    // Life Cycle //////////////////////////////////////////////////////////////
    initialize: function() {
        this.__roots = [];
        tym.global.register('roots', this);
    },
    
    
    // Accessors ///////////////////////////////////////////////////////////////
    /** Gets the list of global root views.
        @returns array of RootViews. */
    getRoots: function() {
        return this.__roots;
    },
    
    
    // Methods /////////////////////////////////////////////////////////////////
    /** Add a rootable to the global list of root views.
        @param r:RootView the RootView to add.
        @returns void */
    addRoot: function(r) {
        this.__roots.push(r);
        this.fireNewEvent('rootAdded', r);
    },
    
    /** Remove a rootable from the global list of root views.
        @param r:RootView the RootView to remove.
        @returns void */
    removeRoot: function(r) {
        var roots = this.__roots, i = roots.length, root;
        while(i) {
            root = roots[--i];
            if (root === r) {
                roots.splice(i, 1);
                this.fireNewEvent('rootRemoved', root);
                break;
            }
        }
    }
});


/** Allows a view to act as a "root" for a view hierarchy. A "root" view is 
    backed by a dom element from the page rather than a dom element created 
    by the view.
    
    Events:
        None
*/
tym.RootView = new JS.Module('RootView', {
    // Life Cycle //////////////////////////////////////////////////////////////
    initNode: function(parent, attrs) {
        this.callSuper(parent, attrs);
        tym.global.roots.addRoot(this);
    },
    
    createSprite: function(attrs) {
        attrs.__isRootView = true;
        return tym.sprite.createSprite(this, attrs);
    },
    
    /** @overrides tym.View */
    destroyAfterOrphaning: function() {
        tym.global.roots.removeRoot(this);
        this.callSuper();
    },
    
    
    // Accessors ///////////////////////////////////////////////////////////////
    /** @overrides tym.Node */
    setParent: function(parent) {
        // A root view doesn't have a parent view.
        this.callSuper(undefined);
    }
});


/** Provides an interface to platform specific viewport resize functionality. */
tym.sprite.GlobalViewportResize = new JS.Class('sprite.GlobalViewportResize', {
    // Constructor /////////////////////////////////////////////////////////////
    /** The standard JSClass initializer function. Subclasses should not
        override this function.
        @param attrs:object A map of attribute names and values.
        @returns void */
    initialize: function(view, attrs) {
        this.view = view;
        
        var self = this;
        tym.sprite.addEventListener(global, 'resize', function(domEvent) {
            view.__handleResizeEvent(self.getViewportWidth(), self.getViewportHeight());
        });
    },
    
    
    // Methods /////////////////////////////////////////////////////////////////
    getViewportWidth: function() {
        return global.innerWidth;
    },
    
    getViewportHeight: function() {
        return global.innerHeight;
    }
});


/** Provides events when the viewport is resized. Registered with tym.global
    as 'viewportResize'.
    
    Events:
        resize:object Fired when the viewport is resized. This is a
            reused event stored at tym.global.viewportResize.EVENT. The type
            is 'resize' and the value is an object containing:
                w:number the new viewport width.
                h:number the new viewport height.
    
    Attributes:
        EVENT:object The common resize event that gets fired.
    
    Private Attributes:
        __viewportWidth:number The width of the viewport.
        __viewportHeight:number The height of the viewport.
*/
new JS.Singleton('GlobalViewportResize', {
    include: [
        tym.SpriteBacked,
        tym.Observable
    ],
    
    
    // Life Cycle //////////////////////////////////////////////////////////////
    initialize: function() {
        this.setSprite(this.createSprite());
        
        // The common resize event that gets reused.
        this.EVENT = {
            source:this, type:'resize', 
            value:{w:this.getWidth(), h:this.getHeight()}
        };
        
        tym.global.register('viewportResize', this);
    },
    
    createSprite: function(attrs) {
        return new tym.sprite.GlobalViewportResize(this);
    },
    
    
    // Accessors ///////////////////////////////////////////////////////////////
    /** Gets the window's innerWidth.
        @returns the current width of the window. */
    getWidth: function() {
        return this.__viewportWidth || (this.__viewportWidth = this.sprite.getViewportWidth());
    },
    
    /** Gets the window's innerHeight.
        @returns the current height of the window. */
    getHeight: function() {
        return this.__viewportHeight || (this.__viewportHeight = this.sprite.getViewportHeight());
    },
    
    
    // Methods /////////////////////////////////////////////////////////////////
    /** @private */
    __handleResizeEvent: function(w, h) {
        var event = this.EVENT,
            eventValue = event.value,
            isChanged = false;
        if (w !== eventValue.w) {
            eventValue.w = this.__viewportWidth = w;
            isChanged = true;
        }
        if (h !== eventValue.h) {
            eventValue.h = this.__viewportHeight = h;
            isChanged = true;
        }
        if (isChanged) this.fireEvent(event);
    }
});


/** A mixin that sizes a RootView to the viewport width, height or both.
    
    Events:
        None
    
    Attributes:
        resizeDimension:string The dimension to resize in. Supported values
            are 'width', 'height' and 'both'. Defaults to 'both'.
        minWidth:number the minimum width below which this view will not 
            resize its width. Defaults to 0.
        minWidth:number the minimum height below which this view will not
            resize its height. Defaults to 0.
*/
tym.SizeToViewport = new JS.Module('SizeToViewport', {
    include: [tym.RootView],
    
    
    // Life Cycle //////////////////////////////////////////////////////////////
    /** @overrides */
    initNode: function(parent, attrs) {
        this.minWidth = this.minHeight = 0;
        if (attrs.resizeDimension === undefined) attrs.resizeDimension = 'both';
        
        this.attachTo(tym.global.viewportResize, '__handleResize', 'resize');
        this.callSuper(parent, attrs);
    },
    
    
    // Accessors ///////////////////////////////////////////////////////////////
    setResizeDimension: function(v) {
        if (this.resizeDimension !== v) {
            this.resizeDimension = v;
            this.__handleResize();
        }
    },
    
    setMinWidth: function(v) {
        if (this.minWidth !== v) {
            this.minWidth = v;
            this.__handleResize();
        }
    },
    
    setMinHeight: function(v) {
        if (this.minHeight !== v) {
            this.minHeight = v;
            this.__handleResize();
        }
    },
    
    
    // Methods /////////////////////////////////////////////////////////////////
    /** @private */
    __handleResize: function(event) {
        var v = tym.global.viewportResize.EVENT.value, // Ignore the provided event.
            dim = this.resizeDimension;
        if (dim === 'width' || dim === 'both') this.setWidth(Math.max(this.minWidth, v.w));
        if (dim === 'height' || dim === 'both') this.setHeight(Math.max(this.minHeight, v.h));
    }
});


/** Provides an interface to platform specific Idle functionality. */
tym.sprite.GlobalIdle = new JS.Class('sprite.GlobalIdle', {
    // Constructor /////////////////////////////////////////////////////////////
    /** The standard JSClass initializer function. Subclasses should not
        override this function.
        @param attrs:object A map of attribute names and values.
        @returns void */
    initialize: function(view, attrs) {
        this.view = view;
        
        var vendor, vendors = ['webkit','moz','ms','o'], g = global;
        for (var i = 0; i < vendors.length && !g.requestAnimationFrame; ++i) {
            vendor = vendors[i];
            g.requestAnimationFrame = g[vendor + 'RequestAnimationFrame'];
            g.cancelAnimationFrame = g[vendor + 'CancelAnimationFrame'] || g[vendor + 'CancelRequestAnimationFrame'];
        }
        
        // Setup callback function
        var self = this;
        this.__event = {};
        this.__doIdle = function doIdle(time) {
            self.__timerId = g.requestAnimationFrame(doIdle);
            var lastTime = self.lastTime;
            if (lastTime !== -1) {
                time = Math.round(time);
                var event = self.__event;
                event.delta = time - lastTime;
                event.time = time;
                view.fireNewEvent('idle', event);
            }
            self.lastTime = time;
        };
    },
    
    
    // Methods /////////////////////////////////////////////////////////////////
    start: function() {
        this.lastTime = -1;
        this.__timerId = global.requestAnimationFrame(this.__doIdle);
    },
    
    stop: function() {
        global.cancelAnimationFrame(this.__timerId);
    }
});


/** Provides idle events. Registered with tym.global as 'idle'.
    
    Events:
        idle:object Fired when a browser idle event occurs. The event value is
            an object containing:
                delta: The time in millis since the last idle evnet.
                time: The time in millis of this idle event.
    
    Attributes:
        running:boolean Indicates if idle events are currently being fired
            or not.
        lastTime:number The millis of the last idle event fired.
    
    Private Attributes:
        __timerId:number The ID of the last idle event in the browser.
        __doIdle:function The function that gets executed on idle.
        __event:object The idle event object that gets reused.
*/
new JS.Singleton('GlobalIdle', {
    include: [
        tym.SpriteBacked,
        tym.Observable
    ],
    
    
    // Constructor /////////////////////////////////////////////////////////////
    initialize: function() {
        this.running = false;
        this.setSprite(this.createSprite());
        tym.global.register('idle', this);
    },
    
    createSprite: function(attrs) {
        return new tym.sprite.GlobalIdle(this);
    },
    
    
    // Methods /////////////////////////////////////////////////////////////////
    /** @overrides tym.Observable */
    attachObserver: function(observer, methodName, type) {
        var retval = this.callSuper(observer, methodName, type);
        
        // Start firing idle events
        if (!this.running && this.hasObservers('idle')) {
            this.running = true;
            this.sprite.start();
        }
        
        return retval;
    },
    
    /** @overrides tym.Observable */
    detachObserver: function(observer, methodName, type) {
        var retval = this.callSuper(observer, methodName, type);
        
        // Stop firing idle events
        if (this.running && !this.hasObservers('idle')) {
            this.sprite.stop();
            this.running = false;
        }
        
        return retval;
    }
});


/** Changes the value of an attribute on a target over time.
    
    Events:
        running:boolean Fired when the animation starts or stops.
        paused:boolean Fired when the animation is paused or unpaused.
        reverse:boolean
        easingFunction:function
        from:number
        to:number
        repeat:Fired when the animation repeats. The value is the current
            loop count.
        
    Attributes:
        attribute:string The attribute to animate.
        target:object The object to animate the attribute on. The default is 
            the parent of this node.
        from:number The starting value of the attribute. If not specified the 
            current value on the target will be used.
        to:number The ending value of the attribute.
        duration:number The length of time the animation will run in millis.
            The default value is 1000.
        easingFunction:string/function Controls the rate of animation.
            string: See http://easings.net/ for more info. One of the following:
                linear, 
                easeInQuad, easeOutQuad, easeInOutQuad(default), 
                easeInCubic, easeOutCubic, easeInOutCubic, 
                easeInQuart, easeOutQuart, easeInOutQuart, 
                easeInQuint, easeOutQuint, easeInOutQuint, 
                easeInSine, easeOutSine, easeInOutSine,
                easeInExpo ,easeOutExpo, easeInOutExpo, 
                easeInCirc, easeOutCirc, easeInOutCirc,
                easeInElastic ,easeOutElastic, easeInOutElastic, 
                easeInBack, easeOutBack, easeInOutBack, 
                easeInBounce, easeOutBounce, easeInOutBounce
            
            function: A function that determines the rate of change of the 
                attribute. The arguments to the easing function are:
                t: Animation progress in millis
                c: Value change (to - from)
                d: Animation duration in millis
        relative:boolean Determines if the animated value is set on the target 
            (false), or added to the exiting value on the target (true). Note
            that this means the difference between the from and to values
            will be "added" to the existing value on the target. The default 
            value is false.
        repeat:number The number of times to repeat the animation. If negative 
            the animation will repeat forever. The default value is 1.
        reverse:boolean If true, the animation is run in reverse.
        running:boolean Indicates if the animation is currently running. The 
            default value is false.
        paused:boolean Indicates if the animation is temporarily paused. The 
            default value is false.
        callback:function A function that gets called when the animation
            completes. A boolean value is passed into the function and will be
            true if the animation completed successfully or false if not.
    
    Private Attributes:
        __loopCount:number the loop currently being run.
        __progress:number the number of millis currently used during the
            current animation loop.
        __temporaryFrom:boolean Indicates no "from" was set on the animator so 
            we will have to generate one when needed. We want to reset back to 
            undefined after the animation completes so that subsequent calls 
            to start the animation will behave the same.
*/
tym.Animator = new JS.Class('Animator', tym.Node, {
    include: [tym.Reusable],
    
    
    // Life Cycle //////////////////////////////////////////////////////////////
    /** @overrides tym.Node */
    initNode: function(parent, attrs) {
        this.duration = 1000;
        this.relative = this.reverse = this.running = this.paused = false;
        this.repeat = 1;
        this.easingFunction = tym.Animator.DEFAULT_EASING_FUNCTION;
        
        this.callSuper(parent, attrs);
        
        this.__reset();
    },
    
    
    // Accessors ///////////////////////////////////////////////////////////////
    setRunning: function(v) {
        if (this.running !== v) {
            this.running = v;
            if (this.inited) this.fireNewEvent('running', v);
            
            if (!this.paused) {
                if (v) {
                    this.attachTo(tym.global.idle, '__update', 'idle');
                } else {
                    if (this.__temporaryFrom) this.from = undefined;
                    this.__reset();
                    this.detachFrom(tym.global.idle, '__update', 'idle');
                }
            }
        }
    },
    
    setPaused: function(v) {
        if (this.paused !== v) {
            this.paused = v;
            if (this.inited) this.fireNewEvent('paused', v);
            
            if (this.running) {
                if (v) {
                    this.detachFrom(tym.global.idle, '__update', 'idle');
                } else {
                    this.attachTo(tym.global.idle, '__update', 'idle');
                }
            }
        }
    },
    
    setReverse: function(v) {
        if (this.reverse !== v) {
            this.reverse = v;
            if (this.inited) this.fireNewEvent('reverse', v);
            
            if (!this.running) this.__reset();
        }
    },
    
    setEasingFunction: function(v) {
        // Lookup easing function if a string is provided.
        if (typeof v === 'string') v = tym.Animator.easingFunctions[v];
        
        // Use default if invalid
        if (!v) v = tym.Animator.DEFAULT_EASING_FUNCTION;
        
        if (this.easingFunction !== v) {
            this.easingFunction = v;
            if (this.inited) this.fireNewEvent('easingFunction', v);
        }
    },
    
    setFrom: function(v) {
        if (this.from !== v) {
            this.from = v;
            if (this.inited) this.fireNewEvent('from', v);
        }
    },
    
    setTo: function(v) {
        if (this.to !== v) {
            this.to = v;
            if (this.inited) this.fireNewEvent('to', v);
        }
    },
    
    setCallback: function(v) {this.callback = v;},
    
    
    // Methods /////////////////////////////////////////////////////////////////
    /** A convienence method to set the callback to run when the animator
        stops running. If a callback already exists the provided callback
        will be executed after the existing one.
        @param callback:function the function to run.
        @param replace:boolean (optional) if true the existing callback will 
            be replaced with the new callback.
        @returns void */
    next: function(callback, replace) {
        var existingCallback = this.callback;
        if (existingCallback && !replace) {
            var anim = this;
            this.setCallback(function(success) {
                existingCallback.call(anim, success);
                callback.call(anim, success);
            });
        } else {
            this.setCallback(callback);
        }
    },
    
    /** Puts the animator back to an initial configured state.
        @param executeCallback:boolean (optional) if true the callback, if
            it exists, will be executed.
        @returns void */
    reset: function(executeCallback) {
        this.__reset();
        
        this.setRunning(false);
        this.setPaused(false);
        
        if (executeCallback && this.callback) this.callback.call(this, false);
    },
    
    /** @overrides tym.Reusable */
    clean: function() {
        this.to = this.from = this.attribute = this.callback = undefined;
        this.duration = 1000;
        this.relative = this.reverse = false;
        this.repeat = 1;
        this.easingFunction = tym.Animator.DEFAULT_EASING_FUNCTION;
        
        this.reset(false);
    },
    
    /** @private */
    __reset: function() {
        this.__temporaryFrom = false;
        this.__loopCount = this.reverse ? this.repeat - 1 : 0;
        this.__progress = this.reverse ? this.duration : 0;
    },
    
    /** @private */
    __update: function(idleEvent) {
        this.__advance(idleEvent.value.delta);
    },
    
    /** @private */
    __advance: function(timeDiff) {
        if (this.running && !this.paused) {
            var reverse = this.reverse, 
                duration = this.duration, 
                repeat = this.repeat, 
                attr = this.attribute;
            
            // An animation in reverse is like time going backward.
            if (reverse) timeDiff = timeDiff * -1;
            
            // Determine how much time to move forward by.
            var oldProgress = this.__progress;
            this.__progress += timeDiff;
            
            // Check for overage
            var remainderTime = 0;
            if (this.__progress > duration) {
                remainderTime = this.__progress - duration;
                this.__progress = duration;
                
                // Increment loop count and halt looping if necessary
                if (++this.__loopCount === repeat) remainderTime = 0;
            } else if (0 > this.__progress) {
                // Reverse case
                remainderTime = -this.__progress; // Flip reverse time back to forward time
                this.__progress = 0;
                
                // Decrement loop count and halt looping if necessary
                if (0 > --this.__loopCount && repeat > 0) remainderTime = 0;
            }
            
            var target = this.target || this.parent;
            if (target) {
                // Apply to attribute
                if (this.from == null) {
                    this.__temporaryFrom = true;
                    this.from = this.relative ? 0 : target.get(attr);
                }
                var from = this.from,
                    attrDiff = this.to - from,
                    newValue = this.easingFunction(this.__progress, attrDiff, duration);
                if (this.relative) {
                    // Need to calculate old value since it's possible for
                    // multiple animators to be animating the same attribute
                    // at one time.
                    var oldValue = this.easingFunction(oldProgress, attrDiff, duration),
                        curValue = target.get(attr);
                    target.set(attr, curValue + newValue - oldValue);
                } else {
                    target.set(attr, from + newValue);
                }
                
                if (
                    (!reverse && this.__loopCount === repeat) || // Forward check
                    (reverse && 0 > this.__loopCount && repeat > 0) // Reverse check
                ) {
                    // Stop animation since loop count exceeded repeat count.
                    this.setRunning(false);
                    if (this.callback) this.callback.call(this, true);
                } else if (remainderTime > 0) {
                    // Advance again if time is remaining. This occurs when
                    // the timeDiff provided was greater than the animation
                    // duration and the animation loops.
                    this.fireNewEvent('repeat', this.__loopCount);
                    this.__progress = reverse ? duration : 0;
                    this.__advance(remainderTime);
                }
            } else {
                console.log("No target found for animator.", this);
                this.setRunning(false);
                if (this.callback) this.callback.call(this, false);
            }
        }
    }
});


/*
 * TERMS OF USE - EASING EQUATIONS
 * 
 * Open source under the BSD License. 
 * 
 * Copyright © 2001 Robert Penner
 * All rights reserved.
 * 
 * Redistribution and use in source and binary forms, with or without modification, 
 * are permitted provided that the following conditions are met:
 * 
 * Redistributions of source code must retain the above copyright notice, this list of 
 * conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright notice, this list 
 * of conditions and the following disclaimer in the documentation and/or other materials 
 * provided with the distribution.
 * 
 * Neither the name of the author nor the names of contributors may be used to endorse 
 * or promote products derived from this software without specific prior written permission.
 * 
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY 
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
 * COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 * EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE
 * GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED 
 * AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 * NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED 
 * OF THE POSSIBILITY OF SUCH DAMAGE. 
 *
 * ============================================================
 * jQuery Easing v1.3 - http://gsgd.co.uk/sandbox/jquery/easing/
 *
 * Open source under the BSD License.
 *
 * Copyright © 2008 George McGinley Smith
 * All rights reserved.
 * https://raw.github.com/danro/jquery-easing/master/LICENSE
 * ============================================================
 */
tym.Animator.easingFunctions = {
    linear:function(t, c, d) {
        return c*(t/d);
    },
    easeInQuad:function(t, c, d) {
        return c*(t/=d)*t;
    },
    easeOutQuad:function(t, c, d) {
        return -c *(t/=d)*(t-2);
    },
    easeInOutQuad:function(t, c, d) {
        if ((t/=d/2) < 1) return c/2*t*t;
        return -c/2 * ((--t)*(t-2) - 1);
    },
    easeInCubic:function(t, c, d) {
        return c*(t/=d)*t*t;
    },
    easeOutCubic:function(t, c, d) {
        return c*((t=t/d-1)*t*t + 1);
    },
    easeInOutCubic:function(t, c, d) {
        if ((t/=d/2) < 1) return c/2*t*t*t;
        return c/2*((t-=2)*t*t + 2);
    },
    easeInQuart:function(t, c, d) {
        return c*(t/=d)*t*t*t;
    },
    easeOutQuart:function(t, c, d) {
        return -c * ((t=t/d-1)*t*t*t - 1);
    },
    easeInOutQuart:function(t, c, d) {
        if ((t/=d/2) < 1) return c/2*t*t*t*t;
        return -c/2 * ((t-=2)*t*t*t - 2);
    },
    easeInQuint:function(t, c, d) {
        return c*(t/=d)*t*t*t*t;
    },
    easeOutQuint:function(t, c, d) {
        return c*((t=t/d-1)*t*t*t*t + 1);
    },
    easeInOutQuint:function(t, c, d) {
        if ((t/=d/2) < 1) return c/2*t*t*t*t*t;
        return c/2*((t-=2)*t*t*t*t + 2);
    },
    easeInSine: function (t, c, d) {
        return -c * Math.cos(t/d * (Math.PI/2)) + c;
    },
    easeOutSine: function (t, c, d) {
        return c * Math.sin(t/d * (Math.PI/2));
    },
    easeInOutSine: function (t, c, d) {
        return -c/2 * (Math.cos(Math.PI*t/d) - 1);
    },
    easeInExpo: function (t, c, d) {
        return (t===0) ? 0 : c * Math.pow(2, 10 * (t/d - 1));
    },
    easeOutExpo: function (t, c, d) {
        return (t===d) ? c : c * (-Math.pow(2, -10 * t/d) + 1);
    },
    easeInOutExpo: function (t, c, d) {
        if (t===0) return 0;
        if (t===d) return c;
        if ((t/=d/2) < 1) return c/2 * Math.pow(2, 10 * (t - 1));
        return c/2 * (-Math.pow(2, -10 * --t) + 2);
    },
    easeInCirc: function (t, c, d) {
        return -c * (Math.sqrt(1 - (t/=d)*t) - 1);
    },
    easeOutCirc: function (t, c, d) {
        return c * Math.sqrt(1 - (t=t/d-1)*t);
    },
    easeInOutCirc: function (t, c, d) {
        if ((t/=d/2) < 1) return -c/2 * (Math.sqrt(1 - t*t) - 1);
        return c/2 * (Math.sqrt(1 - (t-=2)*t) + 1);
    },
    easeInElastic: function (t, c, d) {
        var s = 1.70158, p = 0, a = c;
        if (t===0) return 0;
        if ((t/=d)===1) return c;
        if (!p) p = d*.3;
        if (a < Math.abs(c)) {
            //a = c;
            s = p/4;
        } else {
            s = p/(2*Math.PI) * Math.asin(c/a);
        }
        return -(a*Math.pow(2,10*(t-=1)) * Math.sin((t*d-s)*(2*Math.PI)/p));
    },
    easeOutElastic: function (t, c, d) {
        var s = 1.70158, p = 0, a = c;
        if (t===0) return 0;
        if ((t/=d)===1) return c;
        if (!p) p = d*.3;
        if (a < Math.abs(c)) {
            //a = c;
            s = p/4;
        } else {
            s = p/(2*Math.PI) * Math.asin(c/a);
        }
        return a*Math.pow(2,-10*t) * Math.sin((t*d-s)*(2*Math.PI)/p) + c;
    },
    easeInOutElastic: function (t, c, d) {
        var s = 1.70158, p = 0, a = c;
        if (t===0) return 0;
        if ((t/=d/2)===2) return c;
        if (!p) p = d*(.3*1.5);
        if (a < Math.abs(c)) {
            //a = c;
            s = p/4;
        } else {
            s = p/(2*Math.PI) * Math.asin(c/a);
        }
        if (t < 1) return -.5*(a*Math.pow(2,10*(t-=1)) * Math.sin((t*d-s)*(2*Math.PI)/p));
        return a*Math.pow(2,-10*(t-=1)) * Math.sin((t*d-s)*(2*Math.PI)/p)*.5 + c;
    },
    easeInBack: function (t, c, d, s) {
        if (s === undefined) s = 1.70158;
        return c*(t/=d)*t*((s+1)*t - s);
    },
    easeOutBack: function (t, c, d, s) {
        if (s === undefined) s = 1.70158;
        return c*((t=t/d-1)*t*((s+1)*t + s) + 1);
    },
    easeInOutBack: function (t, c, d, s) {
        if (s === undefined) s = 1.70158; 
        if ((t/=d/2) < 1) return c/2*(t*t*(((s*=(1.525))+1)*t - s));
        return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2);
    },
    easeInBounce: function (t, c, d) {
        return c - tym.Animator.easingFunctions.easeOutBounce(d-t, c, d);
    },
    easeOutBounce: function (t, c, d) {
        if ((t/=d) < (1/2.75)) {
            return c*(7.5625*t*t);
        } else if (t < (2/2.75)) {
            return c*(7.5625*(t-=(1.5/2.75))*t + .75);
        } else if (t < (2.5/2.75)) {
            return c*(7.5625*(t-=(2.25/2.75))*t + .9375);
        } else {
            return c*(7.5625*(t-=(2.625/2.75))*t + .984375);
        }
    },
    easeInOutBounce: function (t, c, d) {
        if (t < d/2) return tym.Animator.easingFunctions.easeInBounce(t*2, c, d) * .5;
        return tym.Animator.easingFunctions.easeOutBounce(t*2-d, c, d) * .5 + c*.5;
    }
};

/** Setup the default easing function. */
tym.Animator.DEFAULT_EASING_FUNCTION = tym.Animator.easingFunctions.easeInOutQuad;


/** Adds the capability for an tym.View to be "activated". A doActivated method
    is added that gets called when the view is "activated". */
tym.Activateable = new JS.Module('Activateable', {
    // Methods /////////////////////////////////////////////////////////////////
    /** Called when this view should be activated.
        @returns void */
    doActivated: function() {
        // Subclasses to implement as needed.
    }
});


/** Adds an udpateUI method that should be called to update the UI. Various
    mixins will rely on the updateUI method to trigger visual updates.
    
    Events:
        None
    
    Attributes:
        None
*/
tym.UpdateableUI = new JS.Module('UpdateableUI', {
    // Life Cycle //////////////////////////////////////////////////////////////
    /** @overrides */
    initNode: function(parent, attrs) {
        this.callSuper(parent, attrs);
        
        // Call updateUI one time after initialization is complete to give
        // this View a chance to update itself.
        this.updateUI();
    },
    
    
    // Methods /////////////////////////////////////////////////////////////////
    /** Updates the UI whenever a change occurs that requires a visual update.
        Subclasses should implement this as needed.
        @returns void */
    updateUI: function() {
        // Subclasses to implement as needed.
    }
});


/** Adds the capability to be "disabled" to an tym.Node. When an tym.Node is 
    disabled the user should typically not be able to interact with it.
    
    When disabled becomes true an attempt will be made to give away the focus
    using tym.FocusObservable's giveAwayFocus method.
    
    Events:
        disabled:boolean Fired when the disabled attribute is modified
            via setDisabled.
    
    Attributes:
        disabled:boolean Indicates that this component is disabled.
*/
tym.Disableable = new JS.Module('Disableable', {
    // Life Cycle //////////////////////////////////////////////////////////////
    /** @overrides */
    initNode: function(parent, attrs) {
        if (attrs.disabled === undefined) attrs.disabled = false;
        
        this.callSuper(parent, attrs);
    },
    
    
    // Accessors ///////////////////////////////////////////////////////////////
    setDisabled: function(v) {
        if (this.disabled !== v) {
            this.disabled = v;
            if (this.inited) this.fireNewEvent('disabled', v);
            
            this.doDisabled();
        }
    },
    
    
    // Methods /////////////////////////////////////////////////////////////////
    /** Called after the disabled attribute is set. Default behavior attempts
        to give away focus and calls the updateUI method of tym.UpdateableUI if 
        it is defined.
        @returns void */
    doDisabled: function() {
        if (this.inited) {
            // Give away focus if we become disabled and this instance is
            // a FocusObservable
            if (this.disabled && this.giveAwayFocus) this.giveAwayFocus();
            
            if (this.updateUI) this.updateUI();
        }
    }
});


/** Provides a 'mouseOver' attribute that tracks mouse over/out state. Also
    provides a mechanism to smoothe over/out events so only one call to
    'doSmoothMouseOver' occurs per idle event.
    
    Requires tym.Disableable and tym.MouseObservable callSuper mixins.
    
    Events:
        None
    
    Attributes:
        mouseOver:boolean Indicates if the mouse is over this view or not.
    
    Private Attributes:
        __attachedToOverIdle:boolean Used by the code that smoothes out
            mouseover events. Indicates that we are registered with the
            idle event.
        __lastOverIdleValue:boolean Used by the code that smoothes out
            mouseover events. Stores the last mouseOver value.
*/
tym.MouseOver = new JS.Module('MouseOver', {
    // Life Cycle //////////////////////////////////////////////////////////////
    /** @overrides */
    initNode: function(parent, attrs) {
        if (attrs.mouseOver === undefined) attrs.mouseOver = false;
        
        this.callSuper(parent, attrs);
        
        this.attachToPlatform(this, 'doMouseOver', 'mouseover');
        this.attachToPlatform(this, 'doMouseOut', 'mouseout');
    },
    
    
    // Accessors ///////////////////////////////////////////////////////////////
    setMouseOver: function(v) {
        if (this.mouseOver !== v) {
            this.mouseOver = v;
            // No event needed
            
            // Smooth out over/out events by delaying until the next idle event.
            if (this.inited && !this.__attachedToOverIdle) {
                this.__attachedToOverIdle = true;
                this.attachTo(tym.global.idle, '__doMouseOverOnIdle', 'idle');
            }
        }
    },
    
    /** @overrides tym.Disableable */
    setDisabled: function(v) {
        // When about to disable make sure mouseOver is not true. This 
        // helps prevent unwanted behavior of a disabled view.
        if (v && this.mouseOver) this.setMouseOver(false);
        
        this.callSuper(v);
    },
    
    
    // Methods /////////////////////////////////////////////////////////////////
    /** @private */
    __doMouseOverOnIdle: function() {
        this.detachFrom(tym.global.idle, '__doMouseOverOnIdle', 'idle');
        this.__attachedToOverIdle = false;
        
        // Only call doSmoothOver if the over/out state has changed since the
        // last time it was called.
        var isOver = this.mouseOver;
        if (this.__lastOverIdleValue !== isOver) {
            this.__lastOverIdleValue = isOver;
            this.doSmoothMouseOver(isOver);
        }
    },
    
    /** Called when mouseOver state changes. This method is called after
        an event filtering process has reduced frequent over/out events
        originating from the dom.
        @returns void */
    doSmoothMouseOver: function(isOver) {
        if (this.inited && this.updateUI) this.updateUI();
    },
    
    /** Called when the mouse is over this view. Subclasses must call callSuper.
        @returns void */
    doMouseOver: function(event) {
        if (!this.disabled) this.setMouseOver(true);
    },
    
    /** Called when the mouse leaves this view. Subclasses must call callSuper.
        @returns void */
    doMouseOut: function(event) {
        if (!this.disabled) this.setMouseOver(false);
    }
});


/** Provides an interface to platform specific global mouse functionality. */
tym.sprite.GlobalMouse = new JS.Class('sprite.GlobalMouse', {
    include: [
        tym.sprite.PlatformObservable,
        tym.sprite.MouseObservable
    ],
    
    
    // Constructor /////////////////////////////////////////////////////////////
    /** The standard JSClass initializer function. Subclasses should not
        override this function.
        @param attrs:object A map of attribute names and values.
        @returns void */
    initialize: function(view, attrs) {
        this.view = view;
        this.platformObject = global.document;
    }
});


/** Provides global mouse events by listening to mouse events on the 
    viewport. Registered with tym.global as 'mouse'. */
new JS.Singleton('GlobalMouse', {
    include: [
        tym.SpriteBacked,
        tym.Observable
    ],
    
    
    // Constructor /////////////////////////////////////////////////////////////
    initialize: function() {
        this.setSprite(this.createSprite());
        
        tym.global.register('mouse', this);
    },
    
    createSprite: function(attrs) {
        return new tym.sprite.GlobalMouse(this);
    }
});


/** Provides a 'mouseDown' attribute that tracks mouse up/down state.
    
    Requires: tym.MouseOver, tym.Disableable, tym.MouseObservable callSuper mixins.
    
    Suggested: tym.UpdateableUI and tym.Activateable callSuper mixins.
    
    Events:
        None
    
    Attributes:
        mouseDown:boolean Indicates if the mouse is down or not. */
tym.MouseDown = new JS.Module('MouseDown', {
    // Life Cycle //////////////////////////////////////////////////////////////
    /** @overrides */
    initNode: function(parent, attrs) {
        if (attrs.mouseDown === undefined) attrs.mouseDown = false;
        
        this.callSuper(parent, attrs);
        
        this.attachToPlatform(this, 'doMouseDown', 'mousedown');
        this.attachToPlatform(this, 'doMouseUp', 'mouseup');
    },
    
    
    // Accessors ///////////////////////////////////////////////////////////////
    setMouseDown: function(v) {
        if (this.mouseDown !== v) {
            this.mouseDown = v;
            // No event needed
            if (this.inited) {
                if (v) this.focus(true);
                if (this.updateUI) this.updateUI();
            }
        }
    },
    
    /** @overrides tym.Disableable */
    setDisabled: function(v) {
        // When about to disable the view make sure mouseDown is not true. This 
        // helps prevent unwanted activation of a disabled view.
        if (v && this.mouseDown) this.setMouseDown(false);
        
        this.callSuper(v);
    },
    
    
    // Methods /////////////////////////////////////////////////////////////////
    /** @overrides tym.MouseOver */
    doMouseOver: function(event) {
        this.callSuper(event);
        if (this.mouseDown) this.detachFromPlatform(tym.global.mouse, 'doMouseUp', 'mouseup', true);
    },
    
    /** @overrides tym.MouseOver */
    doMouseOut: function(event) {
        this.callSuper(event);
        
        // Wait for a mouse up anywhere if the user moves the mouse out of the
        // view while the mouse is still down. This allows the user to move
        // the mouse in and out of the view with the view still behaving 
        // as moused down.
        if (!this.disabled && this.mouseDown) this.attachToPlatform(tym.global.mouse, 'doMouseUp', 'mouseup', true);
    },
    
    /** Called when the mouse is down on this view. Subclasses must call callSuper.
        @returns void */
    doMouseDown: function(event) {
        if (!this.disabled) this.setMouseDown(true);
    },
    
    /** Called when the mouse is up on this view. Subclasses must call callSuper.
        @returns void */
    doMouseUp: function(event) {
        // Cleanup global mouse listener since the mouseUp occurred outside
        // the view.
        if (!this.mouseOver) this.detachFromPlatform(tym.global.mouse, 'doMouseUp', 'mouseup', true);
        
        if (!this.disabled && this.mouseDown) {
            this.setMouseDown(false);
            
            // Only do mouseUpInside if the mouse is actually over the view.
            // This means the user can mouse down on a view, move the mouse
            // out and then mouse up and not "activate" the view.
            if (this.mouseOver) this.doMouseUpInside(event);
        }
    },
    
    /** Called when the mouse is up and we are still over the view. Executes
        the 'doActivated' method by default.
        @returns void */
    doMouseUpInside: function(event) {
        if (this.doActivated) this.doActivated();
    }
});


/** Provides both MouseOver and MouseDown mixins as a single mixin. */
tym.MouseOverAndDown = new JS.Module('MouseOverAndDown', {
    include: [tym.MouseOver, tym.MouseDown]
});


/** Provides an interface to platform specific global keyboard functionality. */
tym.sprite.GlobalKeys = new JS.Class('sprite.GlobalKeys', {
    include: [
        tym.sprite.PlatformObservable,
        tym.sprite.KeyObservable
    ],
    
    
    // Constructor /////////////////////////////////////////////////////////////
    /** The standard JSClass initializer function. Subclasses should not
        override this function.
        @param attrs:object A map of attribute names and values.
        @returns void */
    initialize: function(view, attrs) {
        this.view = view;
        this.platformObject = global.document;
        
        // Constants
        this.KEYCODE_SHIFT = 16;
        this.KEYCODE_CONTROL = 17;
        this.KEYCODE_ALT = 18;
        var isFirefox = tym.sprite.platform.browser === 'Firefox';
        this.KEYCODE_COMMAND = isFirefox ? 224 : 91;
        this.KEYCODE_RIGHT_COMMAND = isFirefox ? 224 : 93;
        
        this.__keysDown = {};
    },
    
    
    // Methods /////////////////////////////////////////////////////////////////
    /** Tests if a key is currently pressed down or not.
        @param keyCode:number the key to test.
        @returns true if the key is down, false otherwise. */
    isKeyDown: function(keyCode) {return !!this.__keysDown[keyCode];},
    
    /** Tests if the 'shift' key is down. */
    isShiftKeyDown: function() {return this.isKeyDown(this.KEYCODE_SHIFT);},
    
    /** Tests if the 'control' key is down. */
    isControlKeyDown: function() {return this.isKeyDown(this.KEYCODE_CONTROL);},
    
    /** Tests if the 'alt' key is down. */
    isAltKeyDown: function() {return this.isKeyDown(this.KEYCODE_ALT);},
    
    /** Tests if the 'command' key is down. */
    isCommandKeyDown: function() {
        return this.isKeyDown(this.KEYCODE_COMMAND) || this.isKeyDown(this.KEYCODE_RIGHT_COMMAND);
    },
    
    /** Tests if the platform specific "accelerator" key is down. */
    isAcceleratorKeyDown: function() {
        return tym.sprite.platform.os === 'Mac' ? this.isCommandKeyDown() : this.isControlKeyDown();
    },
    
    /** @private */
    handleFocusChange: function(focused) {
        var view = this.view;
        if (focused) {
            this.__unlistenToDocument();
            
            view.attachToPlatform(focused, '__handleKeyDown', 'keydown');
            view.attachToPlatform(focused, '__handleKeyPress', 'keypress');
            view.attachToPlatform(focused, '__handleKeyUp', 'keyup');
        } else {
            var prevFocused = tym.sprite.focus.prevFocusedView;
            if (prevFocused) {
                view.detachFromPlatform(prevFocused, '__handleKeyDown', 'keydown');
                view.detachFromPlatform(prevFocused, '__handleKeyPress', 'keypress');
                view.detachFromPlatform(prevFocused, '__handleKeyUp', 'keyup');
            }
            
            this.__listenToDocument();
        }
    },
    
    /** @private */
    __listenToDocument: function() {
        var view = this.view;
        view.attachToPlatform(view, '__handleKeyDown', 'keydown');
        view.attachToPlatform(view, '__handleKeyPress', 'keypress');
        view.attachToPlatform(view, '__handleKeyUp', 'keyup');
    },
    
    /** @private */
    __unlistenToDocument: function() {
        var view = this.view;
        view.detachFromPlatform(view, '__handleKeyDown', 'keydown');
        view.detachFromPlatform(view, '__handleKeyPress', 'keypress');
        view.detachFromPlatform(view, '__handleKeyUp', 'keyup');
    },
    
    /** @private */
    __handleKeyDown: function(event) {
        var keyCode = tym.sprite.KeyObservable.getKeyCodeFromEvent(event),
            platformEvent = event.value;
        if (this.__shouldPreventDefault(keyCode, platformEvent.target)) tym.sprite.preventDefault(platformEvent);
        
        // Keyup events do not fire when command key is down so fire a keyup
        // event immediately. Not an issue for other meta keys: shift, ctrl 
        // and option.
        if (this.isCommandKeyDown() && keyCode !== 16 && keyCode !== 17 && keyCode !== 18) {
            this.view.fireNewEvent('keydown', keyCode);
            this.view.fireNewEvent('keyup', keyCode);
            
            // Assume command key goes back up since it is common for the page
            // to lose focus after the command key is used. Do this for every 
            // key other than 'z' since repeated undo/redo is 
            // nice to have and doesn't typically result in loss of focus 
            // to the page.
            if (keyCode !== 90) {
                this.view.fireNewEvent('keyup', this.KEYCODE_COMMAND);
                this.__keysDown[this.KEYCODE_COMMAND] = false;
            }
        } else {
            this.__keysDown[keyCode] = true;
            
            // Check for 'tab' key and do focus traversal.
            if (keyCode === 9) {
                var ift = this.view.ignoreFocusTrap(), gf = tym.global.focus;
                if (this.isShiftKeyDown()) {
                    gf.prev(ift);
                } else {
                    gf.next(ift);
                }
            }
            
            this.view.fireNewEvent('keydown', keyCode);
        }
    },
    
    /** @private */
    __handleKeyPress: function(event) {
        var keyCode = tym.sprite.KeyObservable.getKeyCodeFromEvent(event);
        this.view.fireNewEvent('keypress', keyCode);
    },
    
    /** @private */
    __handleKeyUp: function(event) {
        var keyCode = tym.sprite.KeyObservable.getKeyCodeFromEvent(event),
            platformEvent = event.value;
        if (this.__shouldPreventDefault(keyCode, platformEvent.target)) tym.sprite.preventDefault(platformEvent);
        this.__keysDown[keyCode] = false;
        this.view.fireNewEvent('keyup', keyCode);
    },
    
    /** @private */
    __shouldPreventDefault: function(keyCode, targetElem) {
        switch (keyCode) {
            case 8: // Backspace
                // Catch backspace since it navigates the history. Allow it to
                // go through for text input elements though.
                var nodeName = targetElem.nodeName;
                if (nodeName === 'TEXTAREA' || 
                    (nodeName === 'INPUT' && (targetElem.type === 'text' || targetElem.type === 'password')) ||
                    (nodeName === 'DIV' && targetElem.contentEditable === 'true' && targetElem.firstChild)
                ) return false;
                
                return true;
                
            case 9: // Tab
                // Tab navigation is handled by the framework.
                return true;
        }
        return false;
    }
});


/** Provides global keyboard events. Registered with tym.global as 'keys'.
    
    Also works with GlobalFocus to navigate the focus hierarchy when the 
    focus traversal keys are used.
    
    Events:
        keydown:number fired when a key is pressed down. The value is the
            keycode of the key pressed down.
        keypress:number fired when a key is pressed. The value is the
            keycode of the key pressed.
        keyup:number fired when a key is released up. The value is the
            keycode of the key released up.
    
    Keycodes:
        backspace          8
        tab                9
        enter             13
        shift             16
        ctrl              17
        alt               18
        pause/break       19
        caps lock         20
        escape            27
        spacebar          32
        page up           33
        page down         34
        end               35
        home              36
        left arrow        37
        up arrow          38
        right arrow       39
        down arrow        40
        insert            45
        delete            46
        0                 48
        1                 49
        2                 50
        3                 51
        4                 52
        5                 53
        6                 54
        7                 55
        8                 56
        9                 57
        a                 65
        b                 66
        c                 67
        d                 68
        e                 69
        f                 70
        g                 71
        h                 72
        i                 73
        j                 74
        k                 75
        l                 76
        m                 77
        n                 78
        o                 79
        p                 80
        q                 81
        r                 82
        s                 83
        t                 84
        u                 85
        v                 86
        w                 87
        x                 88
        y                 89
        z                 90
        left window key   91
        right window key  92
        select key        93
        numpad 0          96
        numpad 1          97
        numpad 2          98
        numpad 3          99
        numpad 4         100
        numpad 5         101
        numpad 6         102
        numpad 7         103
        numpad 8         104
        numpad 9         105
        multiply         106
        add              107
        subtract         109
        decimal point    110
        divide           111
        f1               112
        f2               113
        f3               114
        f4               115
        f5               116
        f6               117
        f7               118
        f8               119
        f9               120
        f10              121
        f11              122
        f12              123
        num lock         144
        scroll lock      145
        semi-colon       186
        equal sign       187
        comma            188
        dash             189
        period           190
        forward slash    191
        grave accent     192
        open bracket     219
        back slash       220
        close braket     221
        single quote     222
*/
new JS.Singleton('GlobalKeys', {
    include: [
        tym.SpriteBacked,
        tym.PlatformObserver,
        tym.Observable,
        tym.Observer
    ],
    
    
    // Constructor /////////////////////////////////////////////////////////////
    initialize: function() {
        this.setSprite(this.createSprite());
        
        this.attachTo(tym.global.focus, '__handleFocused', 'focused');
        
        this.sprite.__listenToDocument();
        
        tym.global.register('keys', this);
    },
    
    createSprite: function(attrs) {
        return new tym.sprite.GlobalKeys(this, attrs);
    },
    
    
    // Methods /////////////////////////////////////////////////////////////////
    /** Tests if a key is currently pressed down or not.
        @param keyCode:number the key to test.
        @returns true if the key is down, false otherwise. */
    isKeyDown: function(keyCode) {
        return this.sprite.isKeyDown(keyCode);
    },
    
    /** Tests if the 'shift' key is down. */
    isShiftKeyDown: function() {
        return this.sprite.isShiftKeyDown();
    },
    
    /** Tests if the 'control' key is down. */
    isControlKeyDown: function() {
        return this.sprite.isControlKeyDown();
    },
    
    /** Tests if the 'alt' key is down. */
    isAltKeyDown: function() {
        return this.sprite.isAltKeyDown();
    },
    
    /** Tests if the 'command' key is down. */
    isCommandKeyDown: function() {
        return this.sprite.isCommandKeyDown();
    },
    
    /** Tests if the platform specific "accelerator" key is down. */
    isAcceleratorKeyDown: function() {
        return this.sprite.isAcceleratorKeyDown();
    },
    
    ignoreFocusTrap: function() {
        return this.isAltKeyDown();
    },
    
    /** @private */
    __handleKeyDown: function(event) {
        this.sprite.__handleKeyDown(event);
    },
    
    /** @private */
    __handleKeyPress: function(event) {
        this.sprite.__handleKeyPress(event);
    },
    
    /** @private */
    __handleKeyUp: function(event) {
        this.sprite.__handleKeyUp(event);
    },
    
    /** @private */
    __handleFocused: function(event) {
        this.sprite.handleFocusChange(event.value);
    }
});


/** Provides keyboard handling to "activate" the component when a key is 
    pressed down or released up. By default, when a keyup event occurs for
    an activation key and this view is not disabled, the 'doActivated' method
    will get called.
    
    Requires: myt.Activateable, myt.Disableable, myt.KeyObservable and 
        myt.FocusObservable callSuper mixins.
    
    Events:
        None
    
    Attributes:
        activationKeys:array of chars The keys that when keyed down will
            activate this component. Note: The value is not copied so
            modification of the array outside the scope of this object will
            effect behavior.
        activateKeyDown:number the keycode of the activation key that is
            currently down. This will be -1 when no key is down.
        repeatKeyDown:boolean Indicates if doActivationKeyDown will be called
            for repeated keydown events or not. Defaults to false.
*/
tym.KeyActivation = new JS.Module('KeyActivation', {
    // Class Methods and Attributes ////////////////////////////////////////////
    extend: {
        /** The default activation keys are enter (13) and spacebar (32). */
        DEFAULT_ACTIVATION_KEYS: [13,32]
    },
    
    
    // Life Cycle //////////////////////////////////////////////////////////////
    /** @overrides */
    initNode: function(parent, attrs) {
        this.activateKeyDown = -1;
        
        if (attrs.activationKeys === undefined) {
            attrs.activationKeys = tym.KeyActivation.DEFAULT_ACTIVATION_KEYS;
        }
        
        this.callSuper(parent, attrs);
        
        this.attachToPlatform(this, '__handleKeyDown', 'keydown');
        this.attachToPlatform(this, '__handleKeyPress', 'keypress');
        this.attachToPlatform(this, '__handleKeyUp', 'keyup');
    },
    
    
    // Accessors ///////////////////////////////////////////////////////////////
    setActivationKeys: function(v) {this.activationKeys = v;},
    setRepeatKeyDown: function(v) {this.repeatKeyDown = v;},
    
    
    // Methods /////////////////////////////////////////////////////////////////
    /** @private */
    __handleKeyDown: function(event) {
        if (!this.disabled) {
            if (this.activateKeyDown === -1 || this.repeatKeyDown) {
                var keyCode = tym.sprite.KeyObservable.getKeyCodeFromEvent(event),
                    keys = this.activationKeys, i = keys.length;
                while (i) {
                    if (keyCode === keys[--i]) {
                        if (this.activateKeyDown === keyCode) {
                            this.doActivationKeyDown(keyCode, true);
                        } else {
                            this.activateKeyDown = keyCode;
                            this.doActivationKeyDown(keyCode, false);
                        }
                        tym.sprite.preventDefault(event.value);
                        return;
                    }
                }
            }
        }
    },
    
    /** @private */
    __handleKeyPress: function(event) {
        if (!this.disabled) {
            var keyCode = tym.sprite.KeyObservable.getKeyCodeFromEvent(event);
            if (this.activateKeyDown === keyCode) {
                var keys = this.activationKeys, i = keys.length;
                while (i) {
                    if (keyCode === keys[--i]) {
                        tym.sprite.preventDefault(event.value);
                        return;
                    }
                }
            }
        }
    },
    
    /** @private */
    __handleKeyUp: function(event) {
        if (!this.disabled) {
            var keyCode = tym.sprite.KeyObservable.getKeyCodeFromEvent(event);
            if (this.activateKeyDown === keyCode) {
                var keys = this.activationKeys, i = keys.length;
                while (i) {
                    if (keyCode === keys[--i]) {
                        this.activateKeyDown = -1;
                        this.doActivationKeyUp(keyCode);
                        tym.sprite.preventDefault(event.value);
                        return;
                    }
                }
            }
        }
    },
    
    doBlur: function() {
        this.callSuper();
        
        if (!this.disabled) {
            var keyThatWasDown = this.activateKeyDown;
            if (keyThatWasDown !== -1) {
                this.activateKeyDown = -1;
                this.doActivationKeyAborted(keyThatWasDown);
            }
        }
    },
    
    /** Called when an activation key is pressed down. Default implementation
        does nothing.
        @param key:number the keycode that is down.
        @param isRepeat:boolean Indicates if this is a key repeat event or not.
        @returns void */
    doActivationKeyDown: function(key, isRepeat) {
        // Subclasses to implement as needed.
    },
    
    /** Called when an activation key is release up. This executes the
        'doActivated' method by default. 
        @param key:number the keycode that is up.
        @returns void */
    doActivationKeyUp: function(key) {
        this.doActivated();
    },
    
    /** Called when focus is lost while an activation key is down. Default 
        implementation does nothing.
        @param key:number the keycode that is down.
        @returns void */
    doActivationKeyAborted: function(key) {
        // Subclasses to implement as needed.
    }
});


/** Provides button functionality to an tym.View. Most of the functionality 
    comes from the mixins included by this mixin. This mixin resolves issues 
    that arise when the various mixins are used together.
    
    By default myt.Button instances are focusable.
    
    Events:
        None
    
    Attributes:
        None
    
    Private Attributes:
        __restoreCursor:string The cursor to restore to when the button is
            no longer disabled.
*/
tym.Button = new JS.Module('Button', {
    include: [
        tym.Activateable, 
        tym.UpdateableUI, 
        tym.Disableable, 
        tym.MouseOverAndDown, 
        tym.KeyActivation
    ],
    
    
    // Class Methods and Attributes ////////////////////////////////////////////
    extend: {
        DEFAULT_DISABLED_OPACITY: 0.5
    },
    
    
    // Life Cycle //////////////////////////////////////////////////////////////
    /** @overrides */
    initNode: function(parent, attrs) {
        if (attrs.focusable === undefined) attrs.focusable = true;
        if (attrs.cursor === undefined) attrs.cursor = 'pointer';
        
        this.callSuper(parent, attrs);
    },
    
    
    // Accessors ///////////////////////////////////////////////////////////////
    /** @overrides tym.FocusObservable */
    setFocused: function(v) {
        var existing = this.focused;
        this.callSuper(v);
        if (this.inited && this.focused !== existing) this.updateUI();
    },
    
    
    // Methods /////////////////////////////////////////////////////////////////
    /** @overrides tym.KeyActivation. */
    doActivationKeyDown: function(key, isRepeat) {
        // Prevent unnecessary UI updates when the activation key is repeating.
        if (!isRepeat) this.updateUI();
    },
    
    /** @overrides tym.KeyActivation. */
    doActivationKeyUp: function(key) {
        this.callSuper(key);
        this.updateUI();
    },
    
    /** @overrides tym.KeyActivation. */
    doActivationKeyAborted: function(key) {
        this.callSuper(key);
        this.updateUI();
    },
    
    /** @overrides tym.UpdateableUI. */
    updateUI: function() {
        if (this.disabled) {
            // Remember the cursor to change back to, but don't re-remember
            // if we're already remembering one.
            if (this.__restoreCursor == null) this.__restoreCursor = this.cursor;
            this.setCursor('not-allowed');
            this.drawDisabledState();
        } else {
            var rc = this.__restoreCursor;
            if (rc) {
                this.setCursor(rc);
                this.__restoreCursor = null;
            }
            
            if (this.activateKeyDown !== -1 || this.mouseDown) {
                this.drawActiveState();
            } else if (this.focused) {
                this.drawFocusedState();
            } else if (this.mouseOver) {
                this.drawHoverState();
            } else {
                this.drawReadyState();
            }
        }
    },
    
    /** Draw the UI when the component is in the disabled state.
        @returns void */
    drawDisabledState: function() {
        // Subclasses to implement as needed.
    },
    
    /** Draw the UI when the component has focus. The default implementation
        calls drawHoverState.
        @returns void */
    drawFocusedState: function() {
        this.drawHoverState();
    },
    
    /** Draw the UI when the component is on the verge of being interacted 
        with. For mouse interactions this corresponds to the over state.
        @returns void */
    drawHoverState: function() {
        // Subclasses to implement as needed.
    },
    
    /** Draw the UI when the component has a pending activation. For mouse
        interactions this corresponds to the down state.
        @returns void */
    drawActiveState: function() {
        // Subclasses to implement as needed.
    },
    
    /** Draw the UI when the component is ready to be interacted with. For
        mouse interactions this corresponds to the enabled state when the
        mouse is not over the component.
        @returns void */
    drawReadyState: function() {
        // Subclasses to implement as needed.
    }
});


/** Provides a dependency target that pulls in all of the tym package. */
tym.all = true;

