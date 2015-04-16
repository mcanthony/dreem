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
dr = {
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
    
    /** A wrapper on dr.global.error.notify
        @param err:Error/string The error or message to dump stack for.
        @param type:string (optional) The type of console message to write.
            Allowed values are 'error', 'warn', 'log' and 'debug'. Defaults to
            'error'.
        @returns void */
    dumpStack: function(err, type) {
        dr.global.error.notify(type || 'error', err, err, err);
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
    },
    
    // Dreem Instantiation
    makeChildren: function(target, json) {
        var maker = this.maker, pkg = this.pkg,
            i = 0, len = json.length;
        for (; len > i;) maker.walkDreemJSXML(json[i++], target, pkg);
    },
    
    registerHandlers: function(target, handlers) {
        if (handlers) {
            var len = handlers.length;
            if (len > 0) {
                var i = 0, handler, ref, refTarget;
                for (; len > i;) {
                    handler = handlers[i++];
                    ref = handler.reference;
                    refTarget = target;
                    if (ref) {
                        if (ref === 'this') {
                            refTarget = target;
                        } else if (ref.startsWith('this.')) {
                            refTarget = dr.resolveName(ref.substring(5), target);
                        } else {
                            refTarget = dr.resolveName(ref);
                        }
                    }
                    if (refTarget) target.attachTo(refTarget, handler.name, handler.event);
                }
            }
        }
    },
};


/** Apply this mixin to any Object that needs to fire events.
    
    Attributes:
        None
    
    Private Attributes:
        __obsbt:object Stores arrays of dr.Observers and method names 
            by event type
        __aet:object Stores active event type strings. An event type is active
            if it has been fired from this Observable as part of the current 
            call stack. If an event type is "active" it will not be fired 
            again. This provides protection against infinite event loops.
*/
dr.Observable = new JS.Module('Observable', {
    // Methods /////////////////////////////////////////////////////////////////
    /** Adds the observer to the list of event recipients for the event type.
        @param observer:dr.Observer The observer that will observe this
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
        @param observer:dr.Observer The observer that will no longer be
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
            dr.global.error.notifyError('eventLoop', "Attempt to refire active event: " + type);
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
                        dr.dumpStack(err);
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
dr.Observer = new JS.Module('Observer', {
    // Methods /////////////////////////////////////////////////////////////////
    /** Does the same thing as this.attachToAndCallbackIfAttrNotEqual with
        a value of undefined.
        @param observable:dr.Observable the Observable to attach to.
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
        @param observable:dr.Observable the Observable to attach to.
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
        @param observable:dr.Observable the Observable to attach to.
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
        @param observable:dr.Observable the Observable to attach to.
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
            dr.dumpStack(err);
        }
        
        // Providing a true value for once means we'll never actually attach.
        if (once) return;
        
        this.attachTo(observable, methodName, eventType, once);
    },
    
    /** Checks if this Observer is attached to the provided observable for
        the methodName and eventType.
        @param observable:dr.Observable the Observable to check with.
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
        @param observable:dr.Observable the Observable to attach to.
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
        @param observable:dr.Observable the Observable to attach to.
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
dr.Constrainable = new JS.Module('Constrainable', {
    include: [dr.Observer],
    
    
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
                dr.dumpStack(err);
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
dr.global = new JS.Singleton('Global', {
    include: [dr.Observable],
    
    
    // Methods /////////////////////////////////////////////////////////////////
    /** Registers the provided global under the key. Fires a register<key>
        event. If a global is already registered under the key the existing
        global is unregistered first.
        @returns void */
    register: function(key, v) {
        if (this.hasOwnProperty(key)) {
            console.log("Warning: dr.global key in use: ", key);
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
            console.log("Warning: dr.global key not in use: ", key);
        }
    }
});


/** Common functions for the sprite package. */
dr.sprite = {
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
        if (view.isA(dr.View)) {
            spriteClass = dr.sprite.View;
        }
        
        return new spriteClass(view, attrs);
    },

    // Error Console
    set_stackTraceLimit: function(v) {
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
        set_focusedView: function(v) {
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
            if (this.focusedView !== focusable) dr.global.focus.set_focusedView(focusable);
        },
        
        /** Called by a FocusObservable when it has lost focus.
            @param focusable:FocusObservable the view that lost focus.
            @returns void. */
        notifyBlur: function(focusable) {
            if (this.focusedView === focusable) dr.global.focus.set_focusedView(null);
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
                    if (model && model instanceof dr.sprite.View) {
                        if (model.view.isFocusable()) return model.view;
                    } else {
                        var nodeName = elem.nodeName;
                        if (nodeName === 'A' || nodeName === 'AREA' || 
                            nodeName === 'INPUT' || nodeName === 'TEXTAREA' || 
                            nodeName === 'SELECT' || nodeName === 'BUTTON'
                        ) {
                            if (!elem.disabled && !isNaN(elem.tabIndex) && 
                                dr.sprite.__isDomElementVisible(elem)
                            ) {
                                // Make sure the dom element isn't inside a maskfocus
                                model = this.__findModelForDomElement(elem);
                                if (model && model.view.searchAncestorsOrSelf(function(n) {return n.maskfocus === true;})) {
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
            @returns dr.sprite.View or null if not found.
            @private */
        __findModelForDomElement: function(elem) {
            var model;
            while (elem) {
                model = elem.model;
                if (model && model instanceof dr.sprite.View) return model;
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
            eventLoop: Fired by dr.Observable when an infinite event loop
                would occur.
    
    Attributes:
        stackTraceLimit:int Sets the size for stack traces.
        consoleLogging:boolean Turns logging to the console on and off.
*/
new JS.Singleton('GlobalError', {
    include: [dr.Observable],
    
    
    // Constructor /////////////////////////////////////////////////////////////
    initialize: function() {
        this.set_stackTraceLimit(50);
        this.set_consoleLogging(true);
        dr.global.register('error', this);
    },
    
    
    // Accessors ///////////////////////////////////////////////////////////////
    set_consoleLogging: function(v) {
        this.consoleLogging = v;
    },
    
    set_stackTraceLimit: function(v) {
        this.stackTraceLimit = dr.sprite.set_stackTraceLimit(v);
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
        var stacktrace = dr.sprite.generateStacktrace(eventType, msg, err);
        
        this.fireNewEvent(eventType || 'error', {msg:msg, stacktrace:stacktrace});
        if (this.consoleLogging && consoleFuncName) dr.sprite.console[consoleFuncName](stacktrace);
    }
});


// Acorn is a tiny, fast JavaScript parser written in JavaScript.
//
// Acorn was written by Marijn Haverbeke and released under an MIT
// license. The Unicode regexps (for identifiers and whitespace) were
// taken from [Esprima](http://esprima.org) by Ariya Hidayat.
//
// Git repositories for Acorn are available at
//
//     http://marijnhaverbeke.nl/git/acorn
//     https://github.com/marijnh/acorn.git
//
// Please use the [github bug tracker][ghbt] to report issues.
//
// [ghbt]: https://github.com/marijnh/acorn/issues
//
// This file defines the main parser interface. The library also comes
// with a [error-tolerant parser][dammit] and an
// [abstract syntax tree walker][walk], defined in other files.
//
// [dammit]: acorn_loose.js
// [walk]: util/walk.js

(function(mod) {
  if (typeof exports == "object" && typeof module == "object") return mod(exports); // CommonJS
  if (typeof define == "function" && define.amd) return define(["exports"], mod); // AMD
  mod(self.acorn || (self.acorn = {})); // Plain browser env
})(function(exports) {
  "use strict";

  exports.version = "0.1.01";

  // The main exported interface (under `self.acorn` when in the
  // browser) is a `parse` function that takes a code string and
  // returns an abstract syntax tree as specified by [Mozilla parser
  // API][api], with the caveat that the SpiderMonkey-specific syntax
  // (`let`, `yield`, inline XML, etc) is not recognized.
  //
  // [api]: https://developer.mozilla.org/en-US/docs/SpiderMonkey/Parser_API

  var options, input, inputLen, sourceFile;

  exports.parse = function(inpt, opts) {
    input = String(inpt); inputLen = input.length;
    setOptions(opts);
    initTokenState();
    return parseTopLevel(options.program);
  };

  // A second optional argument can be given to further configure
  // the parser process. These options are recognized:

  var defaultOptions = exports.defaultOptions = {
    // `ecmaVersion` indicates the ECMAScript version to parse. Must
    // be either 3 or 5. This
    // influences support for strict mode, the set of reserved words, and
    // support for getters and setter.
    ecmaVersion: 5,
    // Turn on `strictSemicolons` to prevent the parser from doing
    // automatic semicolon insertion.
    strictSemicolons: false,
    // When `allowTrailingCommas` is false, the parser will not allow
    // trailing commas in array and object literals.
    allowTrailingCommas: true,
    // By default, reserved words are not enforced. Enable
    // `forbidReserved` to enforce them.
    forbidReserved: false,
    // When `locations` is on, `loc` properties holding objects with
    // `start` and `end` properties in `{line, column}` form (with
    // line being 1-based and column 0-based) will be attached to the
    // nodes.
    locations: false,
    // A function can be passed as `onComment` option, which will
    // cause Acorn to call that function with `(block, text, start,
    // end)` parameters whenever a comment is skipped. `block` is a
    // boolean indicating whether this is a block (`/* */`) comment,
    // `text` is the content of the comment, and `start` and `end` are
    // character offsets that denote the start and end of the comment.
    // When the `locations` option is on, two more parameters are
    // passed, the full `{line, column}` locations of the start and
    // end of the comments.
    onComment: null,
    // Nodes have their start and end characters offsets recorded in
    // `start` and `end` properties (directly on the node, rather than
    // the `loc` object, which holds line/column data. To also add a
    // [semi-standardized][range] `range` property holding a `[start,
    // end]` array with the same numbers, set the `ranges` option to
    // `true`.
    //
    // [range]: https://bugzilla.mozilla.org/show_bug.cgi?id=745678
    ranges: false,
    // It is possible to parse multiple files into a single AST by
    // passing the tree produced by parsing the first file as
    // `program` option in subsequent parses. This will add the
    // toplevel forms of the parsed file to the `Program` (top) node
    // of an existing parse tree.
    program: null,
    // When `location` is on, you can pass this to record the source
    // file in every node's `loc` object.
    sourceFile: null
  };

  function setOptions(opts) {
    options = opts || {};
    for (var opt in defaultOptions) if (!options.hasOwnProperty(opt))
      options[opt] = defaultOptions[opt];
    sourceFile = options.sourceFile || null;
  }

  // The `getLineInfo` function is mostly useful when the
  // `locations` option is off (for performance reasons) and you
  // want to find the line/column position for a given character
  // offset. `input` should be the code string that the offset refers
  // into.

  var getLineInfo = exports.getLineInfo = function(input, offset) {
    for (var line = 1, cur = 0;;) {
      lineBreak.lastIndex = cur;
      var match = lineBreak.exec(input);
      if (match && match.index < offset) {
        ++line;
        cur = match.index + match[0].length;
      } else break;
    }
    return {line: line, column: offset - cur};
  };

  // Acorn is organized as a tokenizer and a recursive-descent parser.
  // The `tokenize` export provides an interface to the tokenizer.
  // Because the tokenizer is optimized for being efficiently used by
  // the Acorn parser itself, this interface is somewhat crude and not
  // very modular. Performing another parse or call to `tokenize` will
  // reset the internal state, and invalidate existing tokenizers.

  exports.tokenize = function(inpt, opts) {
    input = String(inpt); inputLen = input.length;
    setOptions(opts);
    initTokenState();

    var t = {};
    function getToken(forceRegexp) {
      readToken(forceRegexp);
      t.start = tokStart; t.end = tokEnd;
      t.startLoc = tokStartLoc; t.endLoc = tokEndLoc;
      t.type = tokType; t.value = tokVal;
      return t;
    }
    getToken.jumpTo = function(pos, reAllowed) {
      tokPos = pos;
      if (options.locations) {
        tokCurLine = tokLineStart = lineBreak.lastIndex = 0;
        var match;
        while ((match = lineBreak.exec(input)) && match.index < pos) {
          ++tokCurLine;
          tokLineStart = match.index + match[0].length;
        }
      }
      var ch = input.charAt(pos - 1);
      tokRegexpAllowed = reAllowed;
      skipSpace();
    };
    return getToken;
  };

  // State is kept in (closure-)global variables. We already saw the
  // `options`, `input`, and `inputLen` variables above.

  // The current position of the tokenizer in the input.

  var tokPos;

  // The start and end offsets of the current token.

  var tokStart, tokEnd;

  // When `options.locations` is true, these hold objects
  // containing the tokens start and end line/column pairs.

  var tokStartLoc, tokEndLoc;

  // The type and value of the current token. Token types are objects,
  // named by variables against which they can be compared, and
  // holding properties that describe them (indicating, for example,
  // the precedence of an infix operator, and the original name of a
  // keyword token). The kind of value that's held in `tokVal` depends
  // on the type of the token. For literals, it is the literal value,
  // for operators, the operator name, and so on.

  var tokType, tokVal;

  // Interal state for the tokenizer. To distinguish between division
  // operators and regular expressions, it remembers whether the last
  // token was one that is allowed to be followed by an expression.
  // (If it is, a slash is probably a regexp, if it isn't it's a
  // division operator. See the `parseStatement` function for a
  // caveat.)

  var tokRegexpAllowed;

  // When `options.locations` is true, these are used to keep
  // track of the current line, and know when a new line has been
  // entered.

  var tokCurLine, tokLineStart;

  // These store the position of the previous token, which is useful
  // when finishing a node and assigning its `end` position.

  var lastStart, lastEnd, lastEndLoc;

  // This is the parser's state. `inFunction` is used to reject
  // `return` statements outside of functions, `labels` to verify that
  // `break` and `continue` have somewhere to jump to, and `strict`
  // indicates whether strict mode is on.

  var inFunction, labels, strict;

  // This function is used to raise exceptions on parse errors. It
  // takes an offset integer (into the current `input`) to indicate
  // the location of the error, attaches the position to the end
  // of the error message, and then raises a `SyntaxError` with that
  // message.

  function raise(pos, message) {
    var loc = getLineInfo(input, pos);
    message += " (" + loc.line + ":" + loc.column + ")";
    var err = new SyntaxError(message);
    err.pos = pos; err.loc = loc; err.raisedAt = tokPos;
    throw err;
  }

  // ## Token types

  // The assignment of fine-grained, information-carrying type objects
  // allows the tokenizer to store the information it has about a
  // token in a way that is very cheap for the parser to look up.

  // All token type variables start with an underscore, to make them
  // easy to recognize.

  // These are the general types. The `type` property is only used to
  // make them recognizeable when debugging.

  var _num = {type: "num"}, _regexp = {type: "regexp"}, _string = {type: "string"};
  var _name = {type: "name"}, _eof = {type: "eof"};

  // Keyword tokens. The `keyword` property (also used in keyword-like
  // operators) indicates that the token originated from an
  // identifier-like word, which is used when parsing property names.
  //
  // The `beforeExpr` property is used to disambiguate between regular
  // expressions and divisions. It is set on all token types that can
  // be followed by an expression (thus, a slash after them would be a
  // regular expression).
  //
  // `isLoop` marks a keyword as starting a loop, which is important
  // to know when parsing a label, in order to allow or disallow
  // continue jumps to that label.

  var _break = {keyword: "break"}, _case = {keyword: "case", beforeExpr: true}, _catch = {keyword: "catch"};
  var _continue = {keyword: "continue"}, _debugger = {keyword: "debugger"}, _default = {keyword: "default"};
  var _do = {keyword: "do", isLoop: true}, _else = {keyword: "else", beforeExpr: true};
  var _finally = {keyword: "finally"}, _for = {keyword: "for", isLoop: true}, _function = {keyword: "function"};
  var _if = {keyword: "if"}, _return = {keyword: "return", beforeExpr: true}, _switch = {keyword: "switch"};
  var _throw = {keyword: "throw", beforeExpr: true}, _try = {keyword: "try"}, _var = {keyword: "var"};
  var _while = {keyword: "while", isLoop: true}, _with = {keyword: "with"}, _new = {keyword: "new", beforeExpr: true};
  var _this = {keyword: "this"};

  // The keywords that denote values.

  var _null = {keyword: "null", atomValue: null}, _true = {keyword: "true", atomValue: true};
  var _false = {keyword: "false", atomValue: false};

  // Some keywords are treated as regular operators. `in` sometimes
  // (when parsing `for`) needs to be tested against specifically, so
  // we assign a variable name to it for quick comparing.

  var _in = {keyword: "in", binop: 7, beforeExpr: true};

  // Map keyword names to token types.

  var keywordTypes = {"break": _break, "case": _case, "catch": _catch,
                      "continue": _continue, "debugger": _debugger, "default": _default,
                      "do": _do, "else": _else, "finally": _finally, "for": _for,
                      "function": _function, "if": _if, "return": _return, "switch": _switch,
                      "throw": _throw, "try": _try, "var": _var, "while": _while, "with": _with,
                      "null": _null, "true": _true, "false": _false, "new": _new, "in": _in,
                      "instanceof": {keyword: "instanceof", binop: 7, beforeExpr: true}, "this": _this,
                      "typeof": {keyword: "typeof", prefix: true, beforeExpr: true},
                      "void": {keyword: "void", prefix: true, beforeExpr: true},
                      "delete": {keyword: "delete", prefix: true, beforeExpr: true}};

  // Punctuation token types. Again, the `type` property is purely for debugging.

  var _bracketL = {type: "[", beforeExpr: true}, _bracketR = {type: "]"}, _braceL = {type: "{", beforeExpr: true};
  var _braceR = {type: "}"}, _parenL = {type: "(", beforeExpr: true}, _parenR = {type: ")"};
  var _comma = {type: ",", beforeExpr: true}, _semi = {type: ";", beforeExpr: true};
  var _colon = {type: ":", beforeExpr: true}, _dot = {type: "."}, _question = {type: "?", beforeExpr: true};

  // Operators. These carry several kinds of properties to help the
  // parser use them properly (the presence of these properties is
  // what categorizes them as operators).
  //
  // `binop`, when present, specifies that this operator is a binary
  // operator, and will refer to its precedence.
  //
  // `prefix` and `postfix` mark the operator as a prefix or postfix
  // unary operator. `isUpdate` specifies that the node produced by
  // the operator should be of type UpdateExpression rather than
  // simply UnaryExpression (`++` and `--`).
  //
  // `isAssign` marks all of `=`, `+=`, `-=` etcetera, which act as
  // binary operators with a very low precedence, that should result
  // in AssignmentExpression nodes.

  var _slash = {binop: 10, beforeExpr: true}, _eq = {isAssign: true, beforeExpr: true};
  var _assign = {isAssign: true, beforeExpr: true}, _plusmin = {binop: 9, prefix: true, beforeExpr: true};
  var _incdec = {postfix: true, prefix: true, isUpdate: true}, _prefix = {prefix: true, beforeExpr: true};
  var _bin1 = {binop: 1, beforeExpr: true}, _bin2 = {binop: 2, beforeExpr: true};
  var _bin3 = {binop: 3, beforeExpr: true}, _bin4 = {binop: 4, beforeExpr: true};
  var _bin5 = {binop: 5, beforeExpr: true}, _bin6 = {binop: 6, beforeExpr: true};
  var _bin7 = {binop: 7, beforeExpr: true}, _bin8 = {binop: 8, beforeExpr: true};
  var _bin10 = {binop: 10, beforeExpr: true};

  // Provide access to the token types for external users of the
  // tokenizer.

  exports.tokTypes = {bracketL: _bracketL, bracketR: _bracketR, braceL: _braceL, braceR: _braceR,
                      parenL: _parenL, parenR: _parenR, comma: _comma, semi: _semi, colon: _colon,
                      dot: _dot, question: _question, slash: _slash, eq: _eq, name: _name, eof: _eof,
                      num: _num, regexp: _regexp, string: _string};
  for (var kw in keywordTypes) exports.tokTypes[kw] = keywordTypes[kw];

  // This is a trick taken from Esprima. It turns out that, on
  // non-Chrome browsers, to check whether a string is in a set, a
  // predicate containing a big ugly `switch` statement is faster than
  // a regular expression, and on Chrome the two are about on par.
  // This function uses `eval` (non-lexical) to produce such a
  // predicate from a space-separated string of words.
  //
  // It starts by sorting the words by length.

  function makePredicate(words) {
    words = words.split(" ");
    var f = "", cats = [];
    out: for (var i = 0; i < words.length; ++i) {
      for (var j = 0; j < cats.length; ++j)
        if (cats[j][0].length == words[i].length) {
          cats[j].push(words[i]);
          continue out;
        }
      cats.push([words[i]]);
    }
    function compareTo(arr) {
      if (arr.length == 1) return f += "return str === " + JSON.stringify(arr[0]) + ";";
      f += "switch(str){";
      for (var i = 0; i < arr.length; ++i) f += "case " + JSON.stringify(arr[i]) + ":";
      f += "return true}return false;";
    }

    // When there are more than three length categories, an outer
    // switch first dispatches on the lengths, to save on comparisons.

    if (cats.length > 3) {
      cats.sort(function(a, b) {return b.length - a.length;});
      f += "switch(str.length){";
      for (var i = 0; i < cats.length; ++i) {
        var cat = cats[i];
        f += "case " + cat[0].length + ":";
        compareTo(cat);
      }
      f += "}";

    // Otherwise, simply generate a flat `switch` statement.

    } else {
      compareTo(words);
    }
    return new Function("str", f);
  }

  // The ECMAScript 3 reserved word list.

  var isReservedWord3 = makePredicate("abstract boolean byte char class double enum export extends final float goto implements import int interface long native package private protected public short static super synchronized throws transient volatile");

  // ECMAScript 5 reserved words.

  var isReservedWord5 = makePredicate("class enum extends super const export import");

  // The additional reserved words in strict mode.

  var isStrictReservedWord = makePredicate("implements interface let package private protected public static yield");

  // The forbidden variable names in strict mode.

  var isStrictBadIdWord = makePredicate("eval arguments");

  // And the keywords.

  var isKeyword = makePredicate("break case catch continue debugger default do else finally for function if return switch throw try var while with null true false instanceof typeof void delete new in this");

  // ## Character categories

  // Big ugly regular expressions that match characters in the
  // whitespace, identifier, and identifier-start categories. These
  // are only applied when a character is found to actually have a
  // code point above 128.

  var nonASCIIwhitespace = /[\u1680\u180e\u2000-\u200a\u2028\u2029\u202f\u205f\u3000\ufeff]/;
  var nonASCIIidentifierStartChars = "\xaa\xb5\xba\xc0-\xd6\xd8-\xf6\xf8-\u02c1\u02c6-\u02d1\u02e0-\u02e4\u02ec\u02ee\u0370-\u0374\u0376\u0377\u037a-\u037d\u0386\u0388-\u038a\u038c\u038e-\u03a1\u03a3-\u03f5\u03f7-\u0481\u048a-\u0527\u0531-\u0556\u0559\u0561-\u0587\u05d0-\u05ea\u05f0-\u05f2\u0620-\u064a\u066e\u066f\u0671-\u06d3\u06d5\u06e5\u06e6\u06ee\u06ef\u06fa-\u06fc\u06ff\u0710\u0712-\u072f\u074d-\u07a5\u07b1\u07ca-\u07ea\u07f4\u07f5\u07fa\u0800-\u0815\u081a\u0824\u0828\u0840-\u0858\u08a0\u08a2-\u08ac\u0904-\u0939\u093d\u0950\u0958-\u0961\u0971-\u0977\u0979-\u097f\u0985-\u098c\u098f\u0990\u0993-\u09a8\u09aa-\u09b0\u09b2\u09b6-\u09b9\u09bd\u09ce\u09dc\u09dd\u09df-\u09e1\u09f0\u09f1\u0a05-\u0a0a\u0a0f\u0a10\u0a13-\u0a28\u0a2a-\u0a30\u0a32\u0a33\u0a35\u0a36\u0a38\u0a39\u0a59-\u0a5c\u0a5e\u0a72-\u0a74\u0a85-\u0a8d\u0a8f-\u0a91\u0a93-\u0aa8\u0aaa-\u0ab0\u0ab2\u0ab3\u0ab5-\u0ab9\u0abd\u0ad0\u0ae0\u0ae1\u0b05-\u0b0c\u0b0f\u0b10\u0b13-\u0b28\u0b2a-\u0b30\u0b32\u0b33\u0b35-\u0b39\u0b3d\u0b5c\u0b5d\u0b5f-\u0b61\u0b71\u0b83\u0b85-\u0b8a\u0b8e-\u0b90\u0b92-\u0b95\u0b99\u0b9a\u0b9c\u0b9e\u0b9f\u0ba3\u0ba4\u0ba8-\u0baa\u0bae-\u0bb9\u0bd0\u0c05-\u0c0c\u0c0e-\u0c10\u0c12-\u0c28\u0c2a-\u0c33\u0c35-\u0c39\u0c3d\u0c58\u0c59\u0c60\u0c61\u0c85-\u0c8c\u0c8e-\u0c90\u0c92-\u0ca8\u0caa-\u0cb3\u0cb5-\u0cb9\u0cbd\u0cde\u0ce0\u0ce1\u0cf1\u0cf2\u0d05-\u0d0c\u0d0e-\u0d10\u0d12-\u0d3a\u0d3d\u0d4e\u0d60\u0d61\u0d7a-\u0d7f\u0d85-\u0d96\u0d9a-\u0db1\u0db3-\u0dbb\u0dbd\u0dc0-\u0dc6\u0e01-\u0e30\u0e32\u0e33\u0e40-\u0e46\u0e81\u0e82\u0e84\u0e87\u0e88\u0e8a\u0e8d\u0e94-\u0e97\u0e99-\u0e9f\u0ea1-\u0ea3\u0ea5\u0ea7\u0eaa\u0eab\u0ead-\u0eb0\u0eb2\u0eb3\u0ebd\u0ec0-\u0ec4\u0ec6\u0edc-\u0edf\u0f00\u0f40-\u0f47\u0f49-\u0f6c\u0f88-\u0f8c\u1000-\u102a\u103f\u1050-\u1055\u105a-\u105d\u1061\u1065\u1066\u106e-\u1070\u1075-\u1081\u108e\u10a0-\u10c5\u10c7\u10cd\u10d0-\u10fa\u10fc-\u1248\u124a-\u124d\u1250-\u1256\u1258\u125a-\u125d\u1260-\u1288\u128a-\u128d\u1290-\u12b0\u12b2-\u12b5\u12b8-\u12be\u12c0\u12c2-\u12c5\u12c8-\u12d6\u12d8-\u1310\u1312-\u1315\u1318-\u135a\u1380-\u138f\u13a0-\u13f4\u1401-\u166c\u166f-\u167f\u1681-\u169a\u16a0-\u16ea\u16ee-\u16f0\u1700-\u170c\u170e-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176c\u176e-\u1770\u1780-\u17b3\u17d7\u17dc\u1820-\u1877\u1880-\u18a8\u18aa\u18b0-\u18f5\u1900-\u191c\u1950-\u196d\u1970-\u1974\u1980-\u19ab\u19c1-\u19c7\u1a00-\u1a16\u1a20-\u1a54\u1aa7\u1b05-\u1b33\u1b45-\u1b4b\u1b83-\u1ba0\u1bae\u1baf\u1bba-\u1be5\u1c00-\u1c23\u1c4d-\u1c4f\u1c5a-\u1c7d\u1ce9-\u1cec\u1cee-\u1cf1\u1cf5\u1cf6\u1d00-\u1dbf\u1e00-\u1f15\u1f18-\u1f1d\u1f20-\u1f45\u1f48-\u1f4d\u1f50-\u1f57\u1f59\u1f5b\u1f5d\u1f5f-\u1f7d\u1f80-\u1fb4\u1fb6-\u1fbc\u1fbe\u1fc2-\u1fc4\u1fc6-\u1fcc\u1fd0-\u1fd3\u1fd6-\u1fdb\u1fe0-\u1fec\u1ff2-\u1ff4\u1ff6-\u1ffc\u2071\u207f\u2090-\u209c\u2102\u2107\u210a-\u2113\u2115\u2119-\u211d\u2124\u2126\u2128\u212a-\u212d\u212f-\u2139\u213c-\u213f\u2145-\u2149\u214e\u2160-\u2188\u2c00-\u2c2e\u2c30-\u2c5e\u2c60-\u2ce4\u2ceb-\u2cee\u2cf2\u2cf3\u2d00-\u2d25\u2d27\u2d2d\u2d30-\u2d67\u2d6f\u2d80-\u2d96\u2da0-\u2da6\u2da8-\u2dae\u2db0-\u2db6\u2db8-\u2dbe\u2dc0-\u2dc6\u2dc8-\u2dce\u2dd0-\u2dd6\u2dd8-\u2dde\u2e2f\u3005-\u3007\u3021-\u3029\u3031-\u3035\u3038-\u303c\u3041-\u3096\u309d-\u309f\u30a1-\u30fa\u30fc-\u30ff\u3105-\u312d\u3131-\u318e\u31a0-\u31ba\u31f0-\u31ff\u3400-\u4db5\u4e00-\u9fcc\ua000-\ua48c\ua4d0-\ua4fd\ua500-\ua60c\ua610-\ua61f\ua62a\ua62b\ua640-\ua66e\ua67f-\ua697\ua6a0-\ua6ef\ua717-\ua71f\ua722-\ua788\ua78b-\ua78e\ua790-\ua793\ua7a0-\ua7aa\ua7f8-\ua801\ua803-\ua805\ua807-\ua80a\ua80c-\ua822\ua840-\ua873\ua882-\ua8b3\ua8f2-\ua8f7\ua8fb\ua90a-\ua925\ua930-\ua946\ua960-\ua97c\ua984-\ua9b2\ua9cf\uaa00-\uaa28\uaa40-\uaa42\uaa44-\uaa4b\uaa60-\uaa76\uaa7a\uaa80-\uaaaf\uaab1\uaab5\uaab6\uaab9-\uaabd\uaac0\uaac2\uaadb-\uaadd\uaae0-\uaaea\uaaf2-\uaaf4\uab01-\uab06\uab09-\uab0e\uab11-\uab16\uab20-\uab26\uab28-\uab2e\uabc0-\uabe2\uac00-\ud7a3\ud7b0-\ud7c6\ud7cb-\ud7fb\uf900-\ufa6d\ufa70-\ufad9\ufb00-\ufb06\ufb13-\ufb17\ufb1d\ufb1f-\ufb28\ufb2a-\ufb36\ufb38-\ufb3c\ufb3e\ufb40\ufb41\ufb43\ufb44\ufb46-\ufbb1\ufbd3-\ufd3d\ufd50-\ufd8f\ufd92-\ufdc7\ufdf0-\ufdfb\ufe70-\ufe74\ufe76-\ufefc\uff21-\uff3a\uff41-\uff5a\uff66-\uffbe\uffc2-\uffc7\uffca-\uffcf\uffd2-\uffd7\uffda-\uffdc";
  var nonASCIIidentifierChars = "\u0371-\u0374\u0483-\u0487\u0591-\u05bd\u05bf\u05c1\u05c2\u05c4\u05c5\u05c7\u0610-\u061a\u0620-\u0649\u0672-\u06d3\u06e7-\u06e8\u06fb-\u06fc\u0730-\u074a\u0800-\u0814\u081b-\u0823\u0825-\u0827\u0829-\u082d\u0840-\u0857\u08e4-\u08fe\u0900-\u0903\u093a-\u093c\u093e-\u094f\u0951-\u0957\u0962-\u0963\u0966-\u096f\u0981-\u0983\u09bc\u09be-\u09c4\u09c7\u09c8\u09d7\u09df-\u09e0\u0a01-\u0a03\u0a3c\u0a3e-\u0a42\u0a47\u0a48\u0a4b-\u0a4d\u0a51\u0a66-\u0a71\u0a75\u0a81-\u0a83\u0abc\u0abe-\u0ac5\u0ac7-\u0ac9\u0acb-\u0acd\u0ae2-\u0ae3\u0ae6-\u0aef\u0b01-\u0b03\u0b3c\u0b3e-\u0b44\u0b47\u0b48\u0b4b-\u0b4d\u0b56\u0b57\u0b5f-\u0b60\u0b66-\u0b6f\u0b82\u0bbe-\u0bc2\u0bc6-\u0bc8\u0bca-\u0bcd\u0bd7\u0be6-\u0bef\u0c01-\u0c03\u0c46-\u0c48\u0c4a-\u0c4d\u0c55\u0c56\u0c62-\u0c63\u0c66-\u0c6f\u0c82\u0c83\u0cbc\u0cbe-\u0cc4\u0cc6-\u0cc8\u0cca-\u0ccd\u0cd5\u0cd6\u0ce2-\u0ce3\u0ce6-\u0cef\u0d02\u0d03\u0d46-\u0d48\u0d57\u0d62-\u0d63\u0d66-\u0d6f\u0d82\u0d83\u0dca\u0dcf-\u0dd4\u0dd6\u0dd8-\u0ddf\u0df2\u0df3\u0e34-\u0e3a\u0e40-\u0e45\u0e50-\u0e59\u0eb4-\u0eb9\u0ec8-\u0ecd\u0ed0-\u0ed9\u0f18\u0f19\u0f20-\u0f29\u0f35\u0f37\u0f39\u0f41-\u0f47\u0f71-\u0f84\u0f86-\u0f87\u0f8d-\u0f97\u0f99-\u0fbc\u0fc6\u1000-\u1029\u1040-\u1049\u1067-\u106d\u1071-\u1074\u1082-\u108d\u108f-\u109d\u135d-\u135f\u170e-\u1710\u1720-\u1730\u1740-\u1750\u1772\u1773\u1780-\u17b2\u17dd\u17e0-\u17e9\u180b-\u180d\u1810-\u1819\u1920-\u192b\u1930-\u193b\u1951-\u196d\u19b0-\u19c0\u19c8-\u19c9\u19d0-\u19d9\u1a00-\u1a15\u1a20-\u1a53\u1a60-\u1a7c\u1a7f-\u1a89\u1a90-\u1a99\u1b46-\u1b4b\u1b50-\u1b59\u1b6b-\u1b73\u1bb0-\u1bb9\u1be6-\u1bf3\u1c00-\u1c22\u1c40-\u1c49\u1c5b-\u1c7d\u1cd0-\u1cd2\u1d00-\u1dbe\u1e01-\u1f15\u200c\u200d\u203f\u2040\u2054\u20d0-\u20dc\u20e1\u20e5-\u20f0\u2d81-\u2d96\u2de0-\u2dff\u3021-\u3028\u3099\u309a\ua640-\ua66d\ua674-\ua67d\ua69f\ua6f0-\ua6f1\ua7f8-\ua800\ua806\ua80b\ua823-\ua827\ua880-\ua881\ua8b4-\ua8c4\ua8d0-\ua8d9\ua8f3-\ua8f7\ua900-\ua909\ua926-\ua92d\ua930-\ua945\ua980-\ua983\ua9b3-\ua9c0\uaa00-\uaa27\uaa40-\uaa41\uaa4c-\uaa4d\uaa50-\uaa59\uaa7b\uaae0-\uaae9\uaaf2-\uaaf3\uabc0-\uabe1\uabec\uabed\uabf0-\uabf9\ufb20-\ufb28\ufe00-\ufe0f\ufe20-\ufe26\ufe33\ufe34\ufe4d-\ufe4f\uff10-\uff19\uff3f";
  var nonASCIIidentifierStart = new RegExp("[" + nonASCIIidentifierStartChars + "]");
  var nonASCIIidentifier = new RegExp("[" + nonASCIIidentifierStartChars + nonASCIIidentifierChars + "]");

  // Whether a single character denotes a newline.

  var newline = /[\n\r\u2028\u2029]/;

  // Matches a whole line break (where CRLF is considered a single
  // line break). Used to count lines.

  var lineBreak = /\r\n|[\n\r\u2028\u2029]/g;

  // Test whether a given character code starts an identifier.

  function isIdentifierStart(code) {
    if (code < 65) return code === 36;
    if (code < 91) return true;
    if (code < 97) return code === 95;
    if (code < 123)return true;
    return code >= 0xaa && nonASCIIidentifierStart.test(String.fromCharCode(code));
  }

  // Test whether a given character is part of an identifier.

  function isIdentifierChar(code) {
    if (code < 48) return code === 36;
    if (code < 58) return true;
    if (code < 65) return false;
    if (code < 91) return true;
    if (code < 97) return code === 95;
    if (code < 123)return true;
    return code >= 0xaa && nonASCIIidentifier.test(String.fromCharCode(code));
  }

  // ## Tokenizer

  // These are used when `options.locations` is on, for the
  // `tokStartLoc` and `tokEndLoc` properties.

  function line_loc_t() {
    this.line = tokCurLine;
    this.column = tokPos - tokLineStart;
  }

  // Reset the token state. Used at the start of a parse.

  function initTokenState() {
    tokCurLine = 1;
    tokPos = tokLineStart = 0;
    tokRegexpAllowed = true;
    skipSpace();
  }

  // Called at the end of every token. Sets `tokEnd`, `tokVal`, and
  // `tokRegexpAllowed`, and skips the space after the token, so that
  // the next one's `tokStart` will point at the right position.

  function finishToken(type, val) {
    tokEnd = tokPos;
    if (options.locations) tokEndLoc = new line_loc_t;
    tokType = type;
    skipSpace();
    tokVal = val;
    tokRegexpAllowed = type.beforeExpr;
  }

  function skipBlockComment() {
    var startLoc = options.onComment && options.locations && new line_loc_t;
    var start = tokPos, end = input.indexOf("*/", tokPos += 2);
    if (end === -1) raise(tokPos - 2, "Unterminated comment");
    tokPos = end + 2;
    if (options.locations) {
      lineBreak.lastIndex = start;
      var match;
      while ((match = lineBreak.exec(input)) && match.index < tokPos) {
        ++tokCurLine;
        tokLineStart = match.index + match[0].length;
      }
    }
    if (options.onComment)
      options.onComment(true, input.slice(start + 2, end), start, tokPos,
                        startLoc, options.locations && new line_loc_t);
  }

  function skipLineComment() {
    var start = tokPos;
    var startLoc = options.onComment && options.locations && new line_loc_t;
    var ch = input.charCodeAt(tokPos+=2);
    while (tokPos < inputLen && ch !== 10 && ch !== 13 && ch !== 8232 && ch !== 8329) {
      ++tokPos;
      ch = input.charCodeAt(tokPos);
    }
    if (options.onComment)
      options.onComment(false, input.slice(start + 2, tokPos), start, tokPos,
                        startLoc, options.locations && new line_loc_t);
  }

  // Called at the start of the parse and after every token. Skips
  // whitespace and comments, and.

  function skipSpace() {
    while (tokPos < inputLen) {
      var ch = input.charCodeAt(tokPos);
      if (ch === 32) { // ' '
        ++tokPos;
      } else if(ch === 13) {
        ++tokPos;
        var next = input.charCodeAt(tokPos);
        if(next === 10) {
          ++tokPos;
        }
        if(options.locations) {
          ++tokCurLine;
          tokLineStart = tokPos;
        }
      } else if (ch === 10) {
        ++tokPos;
        ++tokCurLine;
        tokLineStart = tokPos;
      } else if(ch < 14 && ch > 8) {
        ++tokPos;
      } else if (ch === 47) { // '/'
        var next = input.charCodeAt(tokPos+1);
        if (next === 42) { // '*'
          skipBlockComment();
        } else if (next === 47) { // '/'
          skipLineComment();
        } else break;
      } else if ((ch < 14 && ch > 8) || ch === 32 || ch === 160) { // ' ', '\xa0'
        ++tokPos;
      } else if (ch >= 5760 && nonASCIIwhitespace.test(String.fromCharCode(ch))) {
        ++tokPos;
      } else {
        break;
      }
    }
  }

  // ### Token reading

  // This is the function that is called to fetch the next token. It
  // is somewhat obscure, because it works in character codes rather
  // than characters, and because operator parsing has been inlined
  // into it.
  //
  // All in the name of speed.
  //
  // The `forceRegexp` parameter is used in the one case where the
  // `tokRegexpAllowed` trick does not work. See `parseStatement`.

  function readToken_dot() {
    var next = input.charCodeAt(tokPos+1);
    if (next >= 48 && next <= 57) return readNumber(true);
    ++tokPos;
    return finishToken(_dot);
  }

  function readToken_slash() { // '/'
    var next = input.charCodeAt(tokPos+1);
    if (tokRegexpAllowed) {++tokPos; return readRegexp();}
    if (next === 61) return finishOp(_assign, 2);
    return finishOp(_slash, 1);
  }

  function readToken_mult_modulo() { // '%*'
    var next = input.charCodeAt(tokPos+1);
    if (next === 61) return finishOp(_assign, 2);
    return finishOp(_bin10, 1);
  }

  function readToken_pipe_amp(code) { // '|&'
    var next = input.charCodeAt(tokPos+1);
    if (next === code) return finishOp(code === 124 ? _bin1 : _bin2, 2);
    if (next === 61) return finishOp(_assign, 2);
    return finishOp(code === 124 ? _bin3 : _bin5, 1);
  }

  function readToken_caret() { // '^'
    var next = input.charCodeAt(tokPos+1);
    if (next === 61) return finishOp(_assign, 2);
    return finishOp(_bin4, 1);    
  }

  function readToken_plus_min(code) { // '+-'
    var next = input.charCodeAt(tokPos+1);
    if (next === code) return finishOp(_incdec, 2);
    if (next === 61) return finishOp(_assign, 2);
    return finishOp(_plusmin, 1);    
  }

  function readToken_lt_gt(code) { // '<>'
    var next = input.charCodeAt(tokPos+1);
    var size = 1;
    if (next === code) {
      size = code === 62 && input.charCodeAt(tokPos+2) === 62 ? 3 : 2;
      if (input.charCodeAt(tokPos + size) === 61) return finishOp(_assign, size + 1);
      return finishOp(_bin8, size);
    }
    if (next === 61)
      size = input.charCodeAt(tokPos+2) === 61 ? 3 : 2;
    return finishOp(_bin7, size);
  }
  
  function readToken_eq_excl(code) { // '=!'
    var next = input.charCodeAt(tokPos+1);
    if (next === 61) return finishOp(_bin6, input.charCodeAt(tokPos+2) === 61 ? 3 : 2);
    return finishOp(code === 61 ? _eq : _prefix, 1);
  }

  function getTokenFromCode(code) {
    switch(code) {
      // The interpretation of a dot depends on whether it is followed
      // by a digit.
    case 46: // '.'
      return readToken_dot();

      // Punctuation tokens.
    case 40: ++tokPos; return finishToken(_parenL);
    case 41: ++tokPos; return finishToken(_parenR);
    case 59: ++tokPos; return finishToken(_semi);
    case 44: ++tokPos; return finishToken(_comma);
    case 91: ++tokPos; return finishToken(_bracketL);
    case 93: ++tokPos; return finishToken(_bracketR);
    case 123: ++tokPos; return finishToken(_braceL);
    case 125: ++tokPos; return finishToken(_braceR);
    case 58: ++tokPos; return finishToken(_colon);
    case 63: ++tokPos; return finishToken(_question);

      // '0x' is a hexadecimal number.
    case 48: // '0'
      var next = input.charCodeAt(tokPos+1);
      if (next === 120 || next === 88) return readHexNumber();
      // Anything else beginning with a digit is an integer, octal
      // number, or float.
    case 49: case 50: case 51: case 52: case 53: case 54: case 55: case 56: case 57: // 1-9
      return readNumber(false);

      // Quotes produce strings.
    case 34: case 39: // '"', "'"
      return readString(code);

    // Operators are parsed inline in tiny state machines. '=' (61) is
    // often referred to. `finishOp` simply skips the amount of
    // characters it is given as second argument, and returns a token
    // of the type given by its first argument.

    case 47: // '/'
      return readToken_slash(code);

    case 37: case 42: // '%*'
      return readToken_mult_modulo();

    case 124: case 38: // '|&'
      return readToken_pipe_amp(code);

    case 94: // '^'
      return readToken_caret();

    case 43: case 45: // '+-'
      return readToken_plus_min(code);

    case 60: case 62: // '<>'
      return readToken_lt_gt(code);

    case 61: case 33: // '=!'
      return readToken_eq_excl(code);

    case 126: // '~'
      return finishOp(_prefix, 1);
    }

    return false;
  }

  function readToken(forceRegexp) {
    if (!forceRegexp) tokStart = tokPos;
    else tokPos = tokStart + 1;
    if (options.locations) tokStartLoc = new line_loc_t;
    if (forceRegexp) return readRegexp();
    if (tokPos >= inputLen) return finishToken(_eof);

    var code = input.charCodeAt(tokPos);
    // Identifier or keyword. '\uXXXX' sequences are allowed in
    // identifiers, so '\' also dispatches to that.
    if (isIdentifierStart(code) || code === 92 /* '\' */) return readWord();
    
    var tok = getTokenFromCode(code);

    if (tok === false) {
      // If we are here, we either found a non-ASCII identifier
      // character, or something that's entirely disallowed.
      var ch = String.fromCharCode(code);
      if (ch === "\\" || nonASCIIidentifierStart.test(ch)) return readWord();
      raise(tokPos, "Unexpected character '" + ch + "'");
    } 
    return tok;
  }

  function finishOp(type, size) {
    var str = input.slice(tokPos, tokPos + size);
    tokPos += size;
    finishToken(type, str);
  }

  // Parse a regular expression. Some context-awareness is necessary,
  // since a '/' inside a '[]' set does not end the expression.

  function readRegexp() {
    var content = "", escaped, inClass, start = tokPos;
    for (;;) {
      if (tokPos >= inputLen) raise(start, "Unterminated regular expression");
      var ch = input.charAt(tokPos);
      if (newline.test(ch)) raise(start, "Unterminated regular expression");
      if (!escaped) {
        if (ch === "[") inClass = true;
        else if (ch === "]" && inClass) inClass = false;
        else if (ch === "/" && !inClass) break;
        escaped = ch === "\\";
      } else escaped = false;
      ++tokPos;
    }
    var content = input.slice(start, tokPos);
    ++tokPos;
    // Need to use `readWord1` because '\uXXXX' sequences are allowed
    // here (don't ask).
    var mods = readWord1();
    if (mods && !/^[gmsiy]*$/.test(mods)) raise(start, "Invalid regexp flag");
    return finishToken(_regexp, new RegExp(content, mods));
  }

  // Read an integer in the given radix. Return null if zero digits
  // were read, the integer value otherwise. When `len` is given, this
  // will return `null` unless the integer has exactly `len` digits.

  function readInt(radix, len) {
    var start = tokPos, total = 0;
    for (var i = 0, e = len == null ? Infinity : len; i < e; ++i) {
      var code = input.charCodeAt(tokPos), val;
      if (code >= 97) val = code - 97 + 10; // a
      else if (code >= 65) val = code - 65 + 10; // A
      else if (code >= 48 && code <= 57) val = code - 48; // 0-9
      else val = Infinity;
      if (val >= radix) break;
      ++tokPos;
      total = total * radix + val;
    }
    if (tokPos === start || len != null && tokPos - start !== len) return null;

    return total;
  }

  function readHexNumber() {
    tokPos += 2; // 0x
    var val = readInt(16);
    if (val == null) raise(tokStart + 2, "Expected hexadecimal number");
    if (isIdentifierStart(input.charCodeAt(tokPos))) raise(tokPos, "Identifier directly after number");
    return finishToken(_num, val);
  }

  // Read an integer, octal integer, or floating-point number.
  
  function readNumber(startsWithDot) {
    var start = tokPos, isFloat = false, octal = input.charCodeAt(tokPos) === 48;
    if (!startsWithDot && readInt(10) === null) raise(start, "Invalid number");
    if (input.charCodeAt(tokPos) === 46) {
      ++tokPos;
      readInt(10);
      isFloat = true;
    }
    var next = input.charCodeAt(tokPos);
    if (next === 69 || next === 101) { // 'eE'
      next = input.charCodeAt(++tokPos);
      if (next === 43 || next === 45) ++tokPos; // '+-'
      if (readInt(10) === null) raise(start, "Invalid number")
      isFloat = true;
    }
    if (isIdentifierStart(input.charCodeAt(tokPos))) raise(tokPos, "Identifier directly after number");

    var str = input.slice(start, tokPos), val;
    if (isFloat) val = parseFloat(str);
    else if (!octal || str.length === 1) val = parseInt(str, 10);
    else if (/[89]/.test(str) || strict) raise(start, "Invalid number");
    else val = parseInt(str, 8);
    return finishToken(_num, val);
  }

  // Read a string value, interpreting backslash-escapes.

  function readString(quote) {
    tokPos++;
    var out = "";
    for (;;) {
      if (tokPos >= inputLen) raise(tokStart, "Unterminated string constant");
      var ch = input.charCodeAt(tokPos);
      if (ch === quote) {
        ++tokPos;
        return finishToken(_string, out);
      }
      if (ch === 92) { // '\'
        ch = input.charCodeAt(++tokPos);
        var octal = /^[0-7]+/.exec(input.slice(tokPos, tokPos + 3));
        if (octal) octal = octal[0];
        while (octal && parseInt(octal, 8) > 255) octal = octal.slice(0, octal.length - 1);
        if (octal === "0") octal = null;
        ++tokPos;
        if (octal) {
          if (strict) raise(tokPos - 2, "Octal literal in strict mode");
          out += String.fromCharCode(parseInt(octal, 8));
          tokPos += octal.length - 1;
        } else {
          switch (ch) {
          case 110: out += "\n"; break; // 'n' -> '\n'
          case 114: out += "\r"; break; // 'r' -> '\r'
          case 120: out += String.fromCharCode(readHexChar(2)); break; // 'x'
          case 117: out += String.fromCharCode(readHexChar(4)); break; // 'u'
          case 85: out += String.fromCharCode(readHexChar(8)); break; // 'U'
          case 116: out += "\t"; break; // 't' -> '\t'
          case 98: out += "\b"; break; // 'b' -> '\b'
          case 118: out += "\v"; break; // 'v' -> '\u000b'
          case 102: out += "\f"; break; // 'f' -> '\f'
          case 48: out += "\0"; break; // 0 -> '\0'
          case 13: if (input.charCodeAt(tokPos) === 10) ++tokPos; // '\r\n'
          case 10: // ' \n'
            if (options.locations) { tokLineStart = tokPos; ++tokCurLine; }
            break;
          default: out += String.fromCharCode(ch); break;
          }
        }
      } else {
        if (ch === 13 || ch === 10 || ch === 8232 || ch === 8329) raise(tokStart, "Unterminated string constant");
        out += String.fromCharCode(ch); // '\'
        ++tokPos;
      }
    }
  }

  // Used to read character escape sequences ('\x', '\u', '\U').

  function readHexChar(len) {
    var n = readInt(16, len);
    if (n === null) raise(tokStart, "Bad character escape sequence");
    return n;
  }

  // Used to signal to callers of `readWord1` whether the word
  // contained any escape sequences. This is needed because words with
  // escape sequences must not be interpreted as keywords.

  var containsEsc;

  // Read an identifier, and return it as a string. Sets `containsEsc`
  // to whether the word contained a '\u' escape.
  //
  // Only builds up the word character-by-character when it actually
  // containeds an escape, as a micro-optimization.

  function readWord1() {
    containsEsc = false;
    var word, first = true, start = tokPos;
    for (;;) {
      var ch = input.charCodeAt(tokPos);
      if (isIdentifierChar(ch)) {
        if (containsEsc) word += input.charAt(tokPos);
        ++tokPos;
      } else if (ch === 92) { // "\"
        if (!containsEsc) word = input.slice(start, tokPos);
        containsEsc = true;
        if (input.charCodeAt(++tokPos) != 117) // "u"
          raise(tokPos, "Expecting Unicode escape sequence \\uXXXX");
        ++tokPos;
        var esc = readHexChar(4);
        var escStr = String.fromCharCode(esc);
        if (!escStr) raise(tokPos - 1, "Invalid Unicode escape");
        if (!(first ? isIdentifierStart(esc) : isIdentifierChar(esc)))
          raise(tokPos - 4, "Invalid Unicode escape");
        word += escStr;
      } else {
        break;
      }
      first = false;
    }
    return containsEsc ? word : input.slice(start, tokPos);
  }

  // Read an identifier or keyword token. Will check for reserved
  // words when necessary.

  function readWord() {
    var word = readWord1();
    var type = _name;
    if (!containsEsc) {
      if (isKeyword(word)) type = keywordTypes[word];
      else if (options.forbidReserved &&
               (options.ecmaVersion === 3 ? isReservedWord3 : isReservedWord5)(word) ||
               strict && isStrictReservedWord(word))
        raise(tokStart, "The keyword '" + word + "' is reserved");
    }
    return finishToken(type, word);
  }

  // ## Parser

  // A recursive descent parser operates by defining functions for all
  // syntactic elements, and recursively calling those, each function
  // advancing the input stream and returning an AST node. Precedence
  // of constructs (for example, the fact that `!x[1]` means `!(x[1])`
  // instead of `(!x)[1]` is handled by the fact that the parser
  // function that parses unary prefix operators is called first, and
  // in turn calls the function that parses `[]` subscripts — that
  // way, it'll receive the node for `x[1]` already parsed, and wraps
  // *that* in the unary operator node.
  //
  // Acorn uses an [operator precedence parser][opp] to handle binary
  // operator precedence, because it is much more compact than using
  // the technique outlined above, which uses different, nesting
  // functions to specify precedence, for all of the ten binary
  // precedence levels that JavaScript defines.
  //
  // [opp]: http://en.wikipedia.org/wiki/Operator-precedence_parser

  // ### Parser utilities

  // Continue to the next token.
  
  function next() {
    lastStart = tokStart;
    lastEnd = tokEnd;
    lastEndLoc = tokEndLoc;
    readToken();
  }

  // Enter strict mode. Re-reads the next token to please pedantic
  // tests ("use strict"; 010; -- should fail).

  function setStrict(strct) {
    strict = strct;
    tokPos = lastEnd;
    skipSpace();
    readToken();
  }

  // Start an AST node, attaching a start offset.

  function node_t() {
    this.type = null;
    this.start = tokStart;
    this.end = null;
  }

  function node_loc_t() {
    this.start = tokStartLoc;
    this.end = null;
    if (sourceFile !== null) this.source = sourceFile;
  }

  function startNode() {
    var node = new node_t();
    if (options.locations)
      node.loc = new node_loc_t();
    if (options.ranges)
      node.range = [tokStart, 0];
    return node;
  }

  // Start a node whose start offset information should be based on
  // the start of another node. For example, a binary operator node is
  // only started after its left-hand side has already been parsed.

  function startNodeFrom(other) {
    var node = new node_t();
    node.start = other.start;
    if (options.locations) {
      node.loc = new node_loc_t();
      node.loc.start = other.loc.start;
    }
    if (options.ranges)
      node.range = [other.range[0], 0];

    return node;
  }

  // Finish an AST node, adding `type` and `end` properties.

  function finishNode(node, type) {
    node.type = type;
    node.end = lastEnd;
    if (options.locations)
      node.loc.end = lastEndLoc;
    if (options.ranges)
      node.range[1] = lastEnd;
    return node;
  }

  // Test whether a statement node is the string literal `"use strict"`.

  function isUseStrict(stmt) {
    return options.ecmaVersion >= 5 && stmt.type === "ExpressionStatement" &&
      stmt.expression.type === "Literal" && stmt.expression.value === "use strict";
  }

  // Predicate that tests whether the next token is of the given
  // type, and if yes, consumes it as a side effect.

  function eat(type) {
    if (tokType === type) {
      next();
      return true;
    }
  }

  // Test whether a semicolon can be inserted at the current position.

  function canInsertSemicolon() {
    return !options.strictSemicolons &&
      (tokType === _eof || tokType === _braceR || newline.test(input.slice(lastEnd, tokStart)));
  }

  // Consume a semicolon, or, failing that, see if we are allowed to
  // pretend that there is a semicolon at this position.

  function semicolon() {
    if (!eat(_semi) && !canInsertSemicolon()) unexpected();
  }

  // Expect a token of a given type. If found, consume it, otherwise,
  // raise an unexpected token error.

  function expect(type) {
    if (tokType === type) next();
    else unexpected();
  }

  // Raise an unexpected token error.

  function unexpected() {
    raise(tokStart, "Unexpected token");
  }

  // Verify that a node is an lval — something that can be assigned
  // to.

  function checkLVal(expr) {
    if (expr.type !== "Identifier" && expr.type !== "MemberExpression")
      raise(expr.start, "Assigning to rvalue");
    if (strict && expr.type === "Identifier" && isStrictBadIdWord(expr.name))
      raise(expr.start, "Assigning to " + expr.name + " in strict mode");
  }

  // ### Statement parsing

  // Parse a program. Initializes the parser, reads any number of
  // statements, and wraps them in a Program node.  Optionally takes a
  // `program` argument.  If present, the statements will be appended
  // to its body instead of creating a new node.

  function parseTopLevel(program) {
    lastStart = lastEnd = tokPos;
    if (options.locations) lastEndLoc = new line_loc_t;
    inFunction = strict = null;
    labels = [];
    readToken();

    var node = program || startNode(), first = true;
    if (!program) node.body = [];
    while (tokType !== _eof) {
      var stmt = parseStatement();
      node.body.push(stmt);
      if (first && isUseStrict(stmt)) setStrict(true);
      first = false;
    }
    return finishNode(node, "Program");
  }

  var loopLabel = {kind: "loop"}, switchLabel = {kind: "switch"};

  // Parse a single statement.
  //
  // If expecting a statement and finding a slash operator, parse a
  // regular expression literal. This is to handle cases like
  // `if (foo) /blah/.exec(foo);`, where looking at the previous token
  // does not help.

  function parseStatement() {
    if (tokType === _slash)
      readToken(true);

    var starttype = tokType, node = startNode();

    // Most types of statements are recognized by the keyword they
    // start with. Many are trivial to parse, some require a bit of
    // complexity.

    switch (starttype) {
    case _break: case _continue:
      next();
      var isBreak = starttype === _break;
      if (eat(_semi) || canInsertSemicolon()) node.label = null;
      else if (tokType !== _name) unexpected();
      else {
        node.label = parseIdent();
        semicolon();
      }

      // Verify that there is an actual destination to break or
      // continue to.
      for (var i = 0; i < labels.length; ++i) {
        var lab = labels[i];
        if (node.label == null || lab.name === node.label.name) {
          if (lab.kind != null && (isBreak || lab.kind === "loop")) break;
          if (node.label && isBreak) break;
        }
      }
      if (i === labels.length) raise(node.start, "Unsyntactic " + starttype.keyword);
      return finishNode(node, isBreak ? "BreakStatement" : "ContinueStatement");

    case _debugger:
      next();
      semicolon();
      return finishNode(node, "DebuggerStatement");

    case _do:
      next();
      labels.push(loopLabel);
      node.body = parseStatement();
      labels.pop();
      expect(_while);
      node.test = parseParenExpression();
      semicolon();
      return finishNode(node, "DoWhileStatement");

      // Disambiguating between a `for` and a `for`/`in` loop is
      // non-trivial. Basically, we have to parse the init `var`
      // statement or expression, disallowing the `in` operator (see
      // the second parameter to `parseExpression`), and then check
      // whether the next token is `in`. When there is no init part
      // (semicolon immediately after the opening parenthesis), it is
      // a regular `for` loop.

    case _for:
      next();
      labels.push(loopLabel);
      expect(_parenL);
      if (tokType === _semi) return parseFor(node, null);
      if (tokType === _var) {
        var init = startNode();
        next();
        parseVar(init, true);
        if (init.declarations.length === 1 && eat(_in))
          return parseForIn(node, init);
        return parseFor(node, init);
      }
      var init = parseExpression(false, true);
      if (eat(_in)) {checkLVal(init); return parseForIn(node, init);}
      return parseFor(node, init);

    case _function:
      next();
      return parseFunction(node, true);

    case _if:
      next();
      node.test = parseParenExpression();
      node.consequent = parseStatement();
      node.alternate = eat(_else) ? parseStatement() : null;
      return finishNode(node, "IfStatement");

    case _return:
      if (!inFunction) raise(tokStart, "'return' outside of function");
      next();

      // In `return` (and `break`/`continue`), the keywords with
      // optional arguments, we eagerly look for a semicolon or the
      // possibility to insert one.
      
      if (eat(_semi) || canInsertSemicolon()) node.argument = null;
      else { node.argument = parseExpression(); semicolon(); }
      return finishNode(node, "ReturnStatement");

    case _switch:
      next();
      node.discriminant = parseParenExpression();
      node.cases = [];
      expect(_braceL);
      labels.push(switchLabel);

      // Statements under must be grouped (by label) in SwitchCase
      // nodes. `cur` is used to keep the node that we are currently
      // adding statements to.
      
      for (var cur, sawDefault; tokType != _braceR;) {
        if (tokType === _case || tokType === _default) {
          var isCase = tokType === _case;
          if (cur) finishNode(cur, "SwitchCase");
          node.cases.push(cur = startNode());
          cur.consequent = [];
          next();
          if (isCase) cur.test = parseExpression();
          else {
            if (sawDefault) raise(lastStart, "Multiple default clauses"); sawDefault = true;
            cur.test = null;
          }
          expect(_colon);
        } else {
          if (!cur) unexpected();
          cur.consequent.push(parseStatement());
        }
      }
      if (cur) finishNode(cur, "SwitchCase");
      next(); // Closing brace
      labels.pop();
      return finishNode(node, "SwitchStatement");

    case _throw:
      next();
      if (newline.test(input.slice(lastEnd, tokStart)))
        raise(lastEnd, "Illegal newline after throw");
      node.argument = parseExpression();
      semicolon();
      return finishNode(node, "ThrowStatement");

    case _try:
      next();
      node.block = parseBlock();
      node.handlers = [];
      while (tokType === _catch) {
        var clause = startNode();
        next();
        expect(_parenL);
        clause.param = parseIdent();
        if (strict && isStrictBadIdWord(clause.param.name))
          raise(clause.param.start, "Binding " + clause.param.name + " in strict mode");
        expect(_parenR);
        clause.guard = null;
        clause.body = parseBlock();
        node.handlers.push(finishNode(clause, "CatchClause"));
      }
      node.finalizer = eat(_finally) ? parseBlock() : null;
      if (!node.handlers.length && !node.finalizer)
        raise(node.start, "Missing catch or finally clause");
      return finishNode(node, "TryStatement");

    case _var:
      next();
      node = parseVar(node);
      semicolon();
      return node;

    case _while:
      next();
      node.test = parseParenExpression();
      labels.push(loopLabel);
      node.body = parseStatement();
      labels.pop();
      return finishNode(node, "WhileStatement");

    case _with:
      if (strict) raise(tokStart, "'with' in strict mode");
      next();
      node.object = parseParenExpression();
      node.body = parseStatement();
      return finishNode(node, "WithStatement");

    case _braceL:
      return parseBlock();

    case _semi:
      next();
      return finishNode(node, "EmptyStatement");

      // If the statement does not start with a statement keyword or a
      // brace, it's an ExpressionStatement or LabeledStatement. We
      // simply start parsing an expression, and afterwards, if the
      // next token is a colon and the expression was a simple
      // Identifier node, we switch to interpreting it as a label.

    default:
      var maybeName = tokVal, expr = parseExpression();
      if (starttype === _name && expr.type === "Identifier" && eat(_colon)) {
        for (var i = 0; i < labels.length; ++i)
          if (labels[i].name === maybeName) raise(expr.start, "Label '" + maybeName + "' is already declared");
        var kind = tokType.isLoop ? "loop" : tokType === _switch ? "switch" : null;
        labels.push({name: maybeName, kind: kind});
        node.body = parseStatement();
        labels.pop();
        node.label = expr;
        return finishNode(node, "LabeledStatement");
      } else {
        node.expression = expr;
        semicolon();
        return finishNode(node, "ExpressionStatement");
      }
    }
  }

  // Used for constructs like `switch` and `if` that insist on
  // parentheses around their expression.

  function parseParenExpression() {
    expect(_parenL);
    var val = parseExpression();
    expect(_parenR);
    return val;
  }

  // Parse a semicolon-enclosed block of statements, handling `"use
  // strict"` declarations when `allowStrict` is true (used for
  // function bodies).

  function parseBlock(allowStrict) {
    var node = startNode(), first = true, strict = false, oldStrict;
    node.body = [];
    expect(_braceL);
    while (!eat(_braceR)) {
      var stmt = parseStatement();
      node.body.push(stmt);
      if (first && isUseStrict(stmt)) {
        oldStrict = strict;
        setStrict(strict = true);
      }
      first = false
    }
    if (strict && !oldStrict) setStrict(false);
    return finishNode(node, "BlockStatement");
  }

  // Parse a regular `for` loop. The disambiguation code in
  // `parseStatement` will already have parsed the init statement or
  // expression.

  function parseFor(node, init) {
    node.init = init;
    expect(_semi);
    node.test = tokType === _semi ? null : parseExpression();
    expect(_semi);
    node.update = tokType === _parenR ? null : parseExpression();
    expect(_parenR);
    node.body = parseStatement();
    labels.pop();
    return finishNode(node, "ForStatement");
  }

  // Parse a `for`/`in` loop.

  function parseForIn(node, init) {
    node.left = init;
    node.right = parseExpression();
    expect(_parenR);
    node.body = parseStatement();
    labels.pop();
    return finishNode(node, "ForInStatement");
  }

  // Parse a list of variable declarations.

  function parseVar(node, noIn) {
    node.declarations = [];
    node.kind = "var";
    for (;;) {
      var decl = startNode();
      decl.id = parseIdent();
      if (strict && isStrictBadIdWord(decl.id.name))
        raise(decl.id.start, "Binding " + decl.id.name + " in strict mode");
      decl.init = eat(_eq) ? parseExpression(true, noIn) : null;
      node.declarations.push(finishNode(decl, "VariableDeclarator"));
      if (!eat(_comma)) break;
    }
    return finishNode(node, "VariableDeclaration");
  }

  // ### Expression parsing

  // These nest, from the most general expression type at the top to
  // 'atomic', nondivisible expression types at the bottom. Most of
  // the functions will simply let the function(s) below them parse,
  // and, *if* the syntactic construct they handle is present, wrap
  // the AST node that the inner parser gave them in another node.

  // Parse a full expression. The arguments are used to forbid comma
  // sequences (in argument lists, array literals, or object literals)
  // or the `in` operator (in for loops initalization expressions).

  function parseExpression(noComma, noIn) {
    var expr = parseMaybeAssign(noIn);
    if (!noComma && tokType === _comma) {
      var node = startNodeFrom(expr);
      node.expressions = [expr];
      while (eat(_comma)) node.expressions.push(parseMaybeAssign(noIn));
      return finishNode(node, "SequenceExpression");
    }
    return expr;
  }

  // Parse an assignment expression. This includes applications of
  // operators like `+=`.

  function parseMaybeAssign(noIn) {
    var left = parseMaybeConditional(noIn);
    if (tokType.isAssign) {
      var node = startNodeFrom(left);
      node.operator = tokVal;
      node.left = left;
      next();
      node.right = parseMaybeAssign(noIn);
      checkLVal(left);
      return finishNode(node, "AssignmentExpression");
    }
    return left;
  }

  // Parse a ternary conditional (`?:`) operator.

  function parseMaybeConditional(noIn) {
    var expr = parseExprOps(noIn);
    if (eat(_question)) {
      var node = startNodeFrom(expr);
      node.test = expr;
      node.consequent = parseExpression(true);
      expect(_colon);
      node.alternate = parseExpression(true, noIn);
      return finishNode(node, "ConditionalExpression");
    }
    return expr;
  }

  // Start the precedence parser.

  function parseExprOps(noIn) {
    return parseExprOp(parseMaybeUnary(noIn), -1, noIn);
  }

  // Parse binary operators with the operator precedence parsing
  // algorithm. `left` is the left-hand side of the operator.
  // `minPrec` provides context that allows the function to stop and
  // defer further parser to one of its callers when it encounters an
  // operator that has a lower precedence than the set it is parsing.

  function parseExprOp(left, minPrec, noIn) {
    var prec = tokType.binop;
    if (prec != null && (!noIn || tokType !== _in)) {
      if (prec > minPrec) {
        var node = startNodeFrom(left);
        node.left = left;
        node.operator = tokVal;
        next();
        node.right = parseExprOp(parseMaybeUnary(noIn), prec, noIn);
        var node = finishNode(node, /&&|\|\|/.test(node.operator) ? "LogicalExpression" : "BinaryExpression");
        return parseExprOp(node, minPrec, noIn);
      }
    }
    return left;
  }

  // Parse unary operators, both prefix and postfix.

  function parseMaybeUnary(noIn) {
    if (tokType.prefix) {
      var node = startNode(), update = tokType.isUpdate;
      node.operator = tokVal;
      node.prefix = true;
      next();
      node.argument = parseMaybeUnary(noIn);
      if (update) checkLVal(node.argument);
      else if (strict && node.operator === "delete" &&
               node.argument.type === "Identifier")
        raise(node.start, "Deleting local variable in strict mode");
      return finishNode(node, update ? "UpdateExpression" : "UnaryExpression");
    }
    var expr = parseExprSubscripts();
    while (tokType.postfix && !canInsertSemicolon()) {
      var node = startNodeFrom(expr);
      node.operator = tokVal;
      node.prefix = false;
      node.argument = expr;
      checkLVal(expr);
      next();
      expr = finishNode(node, "UpdateExpression");
    }
    return expr;
  }

  // Parse call, dot, and `[]`-subscript expressions.

  function parseExprSubscripts() {
    return parseSubscripts(parseExprAtom());
  }

  function parseSubscripts(base, noCalls) {
    if (eat(_dot)) {
      var node = startNodeFrom(base);
      node.object = base;
      node.property = parseIdent(true);
      node.computed = false;
      return parseSubscripts(finishNode(node, "MemberExpression"), noCalls);
    } else if (eat(_bracketL)) {
      var node = startNodeFrom(base);
      node.object = base;
      node.property = parseExpression();
      node.computed = true;
      expect(_bracketR);
      return parseSubscripts(finishNode(node, "MemberExpression"), noCalls);
    } else if (!noCalls && eat(_parenL)) {
      var node = startNodeFrom(base);
      node.callee = base;
      node.arguments = parseExprList(_parenR, false);
      return parseSubscripts(finishNode(node, "CallExpression"), noCalls);
    } else return base;
  }

  // Parse an atomic expression — either a single token that is an
  // expression, an expression started by a keyword like `function` or
  // `new`, or an expression wrapped in punctuation like `()`, `[]`,
  // or `{}`.

  function parseExprAtom() {
    switch (tokType) {
    case _this:
      var node = startNode();
      next();
      return finishNode(node, "ThisExpression");
    case _name:
      return parseIdent();
    case _num: case _string: case _regexp:
      var node = startNode();
      node.value = tokVal;
      node.raw = input.slice(tokStart, tokEnd);
      next();
      return finishNode(node, "Literal");

    case _null: case _true: case _false:
      var node = startNode();
      node.value = tokType.atomValue;
      node.raw = tokType.keyword
      next();
      return finishNode(node, "Literal");

    case _parenL:
      var tokStartLoc1 = tokStartLoc, tokStart1 = tokStart;
      next();
      var val = parseExpression();
      val.start = tokStart1;
      val.end = tokEnd;
      if (options.locations) {
        val.loc.start = tokStartLoc1;
        val.loc.end = tokEndLoc;
      }
      if (options.ranges)
        val.range = [tokStart1, tokEnd];
      expect(_parenR);
      return val;

    case _bracketL:
      var node = startNode();
      next();
      node.elements = parseExprList(_bracketR, true, true);
      return finishNode(node, "ArrayExpression");

    case _braceL:
      return parseObj();

    case _function:
      var node = startNode();
      next();
      return parseFunction(node, false);

    case _new:
      return parseNew();

    default:
      unexpected();
    }
  }

  // New's precedence is slightly tricky. It must allow its argument
  // to be a `[]` or dot subscript expression, but not a call — at
  // least, not without wrapping it in parentheses. Thus, it uses the 

  function parseNew() {
    var node = startNode();
    next();
    node.callee = parseSubscripts(parseExprAtom(), true);
    if (eat(_parenL)) node.arguments = parseExprList(_parenR, false);
    else node.arguments = [];
    return finishNode(node, "NewExpression");
  }

  // Parse an object literal.

  function parseObj() {
    var node = startNode(), first = true, sawGetSet = false;
    node.properties = [];
    next();
    while (!eat(_braceR)) {
      if (!first) {
        expect(_comma);
        if (options.allowTrailingCommas && eat(_braceR)) break;
      } else first = false;

      var prop = {key: parsePropertyName()}, isGetSet = false, kind;
      if (eat(_colon)) {
        prop.value = parseExpression(true);
        kind = prop.kind = "init";
      } else if (options.ecmaVersion >= 5 && prop.key.type === "Identifier" &&
                 (prop.key.name === "get" || prop.key.name === "set")) {
        isGetSet = sawGetSet = true;
        kind = prop.kind = prop.key.name;
        prop.key = parsePropertyName();
        if (tokType !== _parenL) unexpected();
        prop.value = parseFunction(startNode(), false);
      } else unexpected();

      // getters and setters are not allowed to clash — either with
      // each other or with an init property — and in strict mode,
      // init properties are also not allowed to be repeated.

      if (prop.key.type === "Identifier" && (strict || sawGetSet)) {
        for (var i = 0; i < node.properties.length; ++i) {
          var other = node.properties[i];
          if (other.key.name === prop.key.name) {
            var conflict = kind == other.kind || isGetSet && other.kind === "init" ||
              kind === "init" && (other.kind === "get" || other.kind === "set");
            if (conflict && !strict && kind === "init" && other.kind === "init") conflict = false;
            if (conflict) raise(prop.key.start, "Redefinition of property");
          }
        }
      }
      node.properties.push(prop);
    }
    return finishNode(node, "ObjectExpression");
  }

  function parsePropertyName() {
    if (tokType === _num || tokType === _string) return parseExprAtom();
    return parseIdent(true);
  }

  // Parse a function declaration or literal (depending on the
  // `isStatement` parameter).

  function parseFunction(node, isStatement) {
    if (tokType === _name) node.id = parseIdent();
    else if (isStatement) unexpected();
    else node.id = null;
    node.params = [];
    var first = true;
    expect(_parenL);
    while (!eat(_parenR)) {
      if (!first) expect(_comma); else first = false;
      node.params.push(parseIdent());
    }

    // Start a new scope with regard to labels and the `inFunction`
    // flag (restore them to their old value afterwards).
    var oldInFunc = inFunction, oldLabels = labels;
    inFunction = true; labels = [];
    node.body = parseBlock(true);
    inFunction = oldInFunc; labels = oldLabels;

    // If this is a strict mode function, verify that argument names
    // are not repeated, and it does not try to bind the words `eval`
    // or `arguments`.
    if (strict || node.body.body.length && isUseStrict(node.body.body[0])) {
      for (var i = node.id ? -1 : 0; i < node.params.length; ++i) {
        var id = i < 0 ? node.id : node.params[i];
        if (isStrictReservedWord(id.name) || isStrictBadIdWord(id.name))
          raise(id.start, "Defining '" + id.name + "' in strict mode");
        if (i >= 0) for (var j = 0; j < i; ++j) if (id.name === node.params[j].name)
          raise(id.start, "Argument name clash in strict mode");
      }
    }

    return finishNode(node, isStatement ? "FunctionDeclaration" : "FunctionExpression");
  }

  // Parses a comma-separated list of expressions, and returns them as
  // an array. `close` is the token type that ends the list, and
  // `allowEmpty` can be turned on to allow subsequent commas with
  // nothing in between them to be parsed as `null` (which is needed
  // for array literals).

  function parseExprList(close, allowTrailingComma, allowEmpty) {
    var elts = [], first = true;
    while (!eat(close)) {
      if (!first) {
        expect(_comma);
        if (allowTrailingComma && options.allowTrailingCommas && eat(close)) break;
      } else first = false;

      if (allowEmpty && tokType === _comma) elts.push(null);
      else elts.push(parseExpression(true));
    }
    return elts;
  }

  // Parse the next token as an identifier. If `liberal` is true (used
  // when parsing properties), it will also convert keywords into
  // identifiers.

  function parseIdent(liberal) {
    var node = startNode();
    node.name = tokType === _name ? tokVal : (liberal && !options.forbidReserved && tokType.keyword) || unexpected();
    next();
    return finishNode(node, "Identifier");
  }


	//
	// AST walker
	//

	var walk = {
		Literal:              {}, // 1 single node
		Identifier:           {}, // 2 array of nodes
		Program:              {body:2}, // 3 keyss structure
		ExpressionStatement:  {expression:1}, // 4 value endpoint
		BreakStatement:       {},
		ContinueStatement:    {},
		DebuggerStatement:    {},
		DoWhileStatement:     {body:1, test:1},
		ReturnStatement:      {argument:1},
		SwitchStatement:      {discriminant:1,cases:2},
		SwitchCase:           {consequent:2,test:1},
		WhileStatement:       {test:1, body:1},
		WithStatement:        {object:1,body:1},
		EmptyStatement:       {},
		LabeledStatement:     {body:1,label:4},
		BlockStatement:       {body:2},
		ForStatement:         {init:1,test:1,update:1,body:1},
		ForInStatement:       {left:1,right:1,body:1},
		VariableDeclaration:  {declarations:2},
		VariableDeclarator:   {id:4,init:1},
		SequenceExpression:   {expressions:2},
		AssignmentExpression: {left:1,right:1},
		ConditionalExpression:{test:1,consequent:1,alternate:1},
		LogicalExpression:    {left:1,right:1},
		BinaryExpression:     {left:1,right:1},
		UpdateExpression:     {argument:1},
		UnaryExpression:      {argument:1},
		CallExpression:       {callee:1,arguments:2},
		ThisExpression:       {},
		ArrayExpression:      {elements:2},
		NewExpression:        {callee:1,arguments:2},
		FunctionDeclaration:  {id:4,params:2,body:1},
		FunctionExpression:   {id:4,params:2,body:1},
		ObjectExpression:     {properties:3},
		MemberExpression:     {object:1,property:1},
		IfStatement:          {test:1,consequent:1,alternate:1},
		ThrowStatement:       {argument:1},
		TryStatement:         {block:1,handlers:2,finalizer:1},
		CatchClause:          {param:1,guard:1,body:1}
	}

	function walkDown(n, o, p){
		var f = o[n.type]
		if(f){
			var result = f(n, p);
			if(result) return result;
		}
		var w = walk[n.type]
		for(var k in w){
			var t = w[k] // type
			var m = n[k] // node prop
			if(t == 2){ // array
				if(!Array.isArray(m))throw new Error("invalid type")
				for(var i = 0; i < m.length; i++){
					walkDown(m[i], o, {up:p, sub:k, node:n, index:i} )
				}
			} else if(t == 3){ // keys
				if(!Array.isArray(m))throw new Error("invalid type")
				for(var i = 0; i < m.length; i++){
					walkDown(m[i].value, o, {up:p, sub:k, node:n, index:i, key:m[i].key} )
				}
			} else { // single  node or value
				if(m) walkDown(m, o, {up:p, sub:k, node:n})
			}
		}
	}

	function walkUp(p, o){
		while(p){
			var f = o[p.node.type]
			if(f && f(p.node, p)) break
			p = p.up
		}
	}
	exports.walkDown = walkDown
	exports.walkUp = walkUp

	//
	// AST serializer
	//

	var sSep

	function sExp(e){
		if(!e || !e.type) return ''
		return sTab[e.type](e)
	}

	function sBlk(b){
		var s = ''
		for(var i = 0;i<b.length;i++)	s += sExp(b[i]) + sSep
		return s
	}

	function sSeq(b){
		var s = ''
		for(var i = 0;i<b.length;i++){
			if(i) s += ', '
			s += sExp(b[i])
		}
		return s
	}

	var sTab = {
		Literal:              function(n){ return n.raw },
		Identifier:           function(n){ return n.name },
		Program:              function(n){ return sBlk(n.body) },
		ExpressionStatement:  function(n){ return sExp(n.expression) },
		BreakStatement:       function(n){ return 'break' },
		ContinueStatement:    function(n){ return 'continue' },
		DebuggerStatement:    function(n){ return 'debugger' },
		DoWhileStatement:     function(n){ return 'do'+sExp(n.body)+sSep+'while('+sExp(n.test)+')' },
		ReturnStatement:      function(n){ return 'return '+sExp(n.argument) },
		SwitchStatement:      function(n){ return 'switch('+sExp(n.discriminant)+'){'+sBlk(n.cases)+'}' },
		SwitchCase:           function(n){ return 'case '+sExp(n.test)+':'+sSep+sBlk(n.consequent) },	
		WhileStatement:       function(n){ return 'while('+sExp(n.test)+')'+sExp(n.body) },
		WithStatement:        function(n){ return 'with('+sExp(n.object)+')'+sExp(n.body) },
		EmptyStatement:       function(n){ return '' },
		LabeledStatement:     function(n){ return sExp(n.label) + ':' + sSep + sExp(n.body) },
		BlockStatement:       function(n){ return '{'+sSep+sBlk(n.body)+'}' },
		ForStatement:          function(n){ return 'for('+sExp(n.init)+';'+sExp(n.test)+';'+sExp(n.update)+')'+sExp(n.body) },
		ForInStatement:       function(n){ return 'for('+sExp(n.left)+' in '+sExp(n.right)+')'+sExp(n.body) },		
		VariableDeclarator:   function(n){ return sExp(n.id)+' = ' +sExp(n.init) },
		VariableDeclaration:  function(n){ return 'var '+sSeq(n.declarations) },
		SequenceExpression:   function(n){ return sSeq(n.expressions) },
		AssignmentExpression: function(n){ return sExp(n.left)+n.operator+sExp(n.right) },
		ConditionalExpression:function(n){ return sExp(n.test)+'?'+sExp(n.consequent)+':'+sExp(n.alternate) },
		LogicalExpression:    function(n){ return sExp(n.left)+n.operator+sExp(n.right) },
		BinaryExpression:     function(n){ return sExp(n.left)+n.operator+sExp(n.right) },
		UpdateExpression:     function(n){ return n.prefix?n.operator+sExp(n.argument):sExp(n.argument)+n.operator },
		UnaryExpression:      function(n){ return n.prefix?n.operator+sExp(n.argument):sExp(n.argument)+n.operator },
		CallExpression:       function(n){ return sExp(n.callee)+'('+sSeq(n.arguments)+')' },
		ThisExpression:       function(n){ return 'this' },
		ArrayExpression:      function(n){ return '['+sSeq(n.elements)+']' },
		NewExpression:        function(n){ return 'new '+sExp(n.callee)+'('+sSeq(n.arguments)+')' },
		FunctionDeclaration:  function(n){ return 'function'+(n.id?' '+sExp(n.id):'')+'('+sSeq(n.params)+')'+sExp(n.body) },
		FunctionExpression:   function(n){ return 'function'+(n.id?' '+sExp(n.id):'')+'('+sSeq(n.params)+')'+sExp(n.body) },
		ObjectExpression:     function(n){
			var s = '{'
			var b = n.properties
			for(var i = 0;i<b.length;i++){
				if(i) s += ', '
				s += sExp(b.key) + ':' + sExp(b.value)
			}
			s += '}'
			return s
		},
		MemberExpression:     function(n){
			if(n.computed)	return sExp(n.object)+'['+sExp(n.property)+']'
			return sExp(n.object)+'.'+sExp(n.property)
		},
		IfStatement:          function(n){ 
			return 'if('+sExp(n.test)+')' + sExp(n.consequent) + sSep +
			       (n.alternate ? 'else ' + sExp(n.alternate) + sSep : '') 
		},
		ThrowStatement:       function(n){ return 'throw '+sExp(n.argument) },
		TryStatement:         function(n){ 
			return 'try '+sExp(n.block)+sSep+sBlk(n.handlers)+sSep+
			       (n.finalizer? 'finally ' + sBlk(n.finalizer) : '')
		},
		CatchClause:          function(n){
			return 'catch(' + sExp(n.param) + (n.guard?' if '+sExp(n.guard):')') + sExp(n.body)
		}
	}

	function stringify(n, sep){
		sSep = sep || '\n'
		return sExp(n)
	}

	exports.stringify = stringify


});


/** Provides support for getter and setter functions on an object.
    
    Events:
        None
    
    Attributes:
        earlyAttrs:array An array of attribute names that will be set first.
        lateAttrs:array An array of attribute names that will be set last.
*/
dr.AccessorSupport = new JS.Module('AccessorSupport', {
    // Class Methods and Attributes ////////////////////////////////////////////
    extend: {
        /** Generate a setter name for an attribute.
            @returns string */
        generateSetterName: function(attrName) {
            return this.SETTER_NAMES[attrName] || (this.SETTER_NAMES[attrName] = this.generateName(attrName, 'set_'));
        },
        
        /** Generate a getter name for an attribute.
            @returns string */
        generateGetterName: function(attrName) {
            return this.GETTER_NAMES[attrName] || (this.GETTER_NAMES[attrName] = this.generateName(attrName, 'get_'));
        },
        
        /** Generate a config name for an attribute.
            @returns string */
        generateConfigAttrName: function(attrName) {
            return this.CONFIG_ATTR_NAMES[attrName] || (this.CONFIG_ATTR_NAMES[attrName] = this.generateName(attrName, '__cfg_'));
        },
        
        /** Generate a constraint function name for an attribute.
            @returns string */
        generateConstraintFunctionName: function(attrName) {
            return this.CONSTRAINT_FUNCTION_NAMES[attrName] || (this.CONSTRAINT_FUNCTION_NAMES[attrName] = this.generateName(attrName, '__fnc_'));
        },
        
        /** Generates a method name by capitalizing the attrName and
            prepending the prefix.
            @returns string */
        generateName: function(attrName, prefix) {
            return prefix + attrName;
        },
        
        /** Caches getter names. */
        GETTER_NAMES:{},
        
        /** Caches setter names. */
        SETTER_NAMES:{},
        
        /** Caches config attribute names. */
        CONFIG_ATTR_NAMES:{},
        
        /** Caches constraint function names. */
        CONSTRAINT_FUNCTION_NAMES:{},
        
        CONSTRAINTS: {
            BINDINGS:{},
            SCOPES: null,
            PROPERTY_BINDINGS: {
                MemberExpression: function(n, parent) {
                    // avoid binding to CallExpressions whose parent is a 
                    // function call, e.g. Math.round(...) shouldn't attempt 
                    // to bind to 'round' on Math
                    if (parent.node.type !== 'CallExpression' || parent.sub !== 'callee') {
                        dr.AccessorSupport.CONSTRAINTS.SCOPES.push({
                            binding:acorn.stringify(n.object),
                            property:n.property.name
                        });
                    }
                    return true;
                }
            },
            
            REGISTERED_CONSTRAINTS: [],
            
            readyForConstraints:false,
            
            isReadyForConstraints: function() {
                return this.readyForConstraints;
            },
            
            notifyReadyForConstraints: function() {
                this.readyForConstraints = true;
                this.bindConstraints();
            },
            
            registerConstraint: function(node, attrName, expression) {
                this.REGISTERED_CONSTRAINTS.push(node, attrName, expression);
                if (this.isReadyForConstraints()) this.bindConstraints();
            },
            
            bindConstraints: function() {
                var rcs = this.REGISTERED_CONSTRAINTS;
                while (rcs.length) rcs.shift().bindConstraint(rcs.shift(), rcs.shift(), true);
            }
        }
    },
    
    
    // Methods /////////////////////////////////////////////////////////////////
    appendToEarlyAttrs: function() {Array.prototype.push.apply(this.earlyAttrs || (this.earlyAttrs = []), arguments);},
    prependToEarlyAttrs: function() {Array.prototype.unshift.apply(this.earlyAttrs || (this.earlyAttrs = []), arguments);},
    appendToLateAttrs: function() {Array.prototype.push.apply(this.lateAttrs || (this.lateAttrs = []), arguments);},
    prependToLateAttrs: function() {Array.prototype.unshift.apply(this.lateAttrs || (this.lateAttrs = []), arguments);},
    
    coerce: function(value, type, defaultValue) {
        switch (type) {
            case 'number':
                value = Number(value);
                if (isNaN(value)) {
                    if (defaultValue !== undefined) {
                        value = defaultValue;
                    } else {
                        this.dumpStack("NaN encountered parsing value as number with no default: " + value);
                    }
                }
                break;
            case 'boolean':
                if (value == null) {
                    value = defaultValue !== undefined ? defaultValue : false;
                } else if (typeof value === 'string') {
                    value = value === 'true';
                } else {
                    value = value ? true : false;
                }
                break;
            case 'string':
                if (value == null) {
                    value = defaultValue !== undefined ? defaultValue : '';
                } else {
                    value = '' + value;
                }
                break;
            case 'color':
                if (value == null) {
                    value = defaultValue !== undefined ? defaultValue : 'transparent';
                } else {
                    value = '' + value;
                }
                break;
            case 'easing_function':
                // Lookup easing function if a string is provided.
                if (typeof value === 'string') value = dr.Animator.easingFunctions[value];
                
                // Use default if invalid
                if (!value) value = dr.Animator.DEFAULT_EASING_FUNCTION;
                break;
            case 'json':
                value = JSON.parse(value);
                break;
            case 'expression':
            case '*':
                if (typeof value === 'string') {
                    value = (new Function('return ' + value)).bind(this)();
                }
                break;
            case 'object':
            case 'function':
            default:
        }
        return value;
    },
    
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
        var getterName = dr.AccessorSupport.generateGetterName(attrName);
        return this[getterName] ? this[getterName]() : this[attrName];
    },
    
    /** A generic setter function that can be called to set a value on this
        object. Will defer to a defined setter if it exists. The implementation
        assumes this object is an Observable so it will have a 'fireNewEvent'
        method.
        @param attrName:string The name of the attribute to set.
        @param value:* The value to set.
        @returns void */
    set: function(attrName, value, isActual) {
        if (isActual) {
            var setterName = dr.AccessorSupport.generateSetterName(attrName);
            if (this[setterName]) {
                this[setterName](value);
            } else {
                this.setActual(attrName, value);
            }
        } else {
            var cfgAttrName = dr.AccessorSupport.generateConfigAttrName(attrName);
            if (this[cfgAttrName] !== value) {
                this[cfgAttrName] = value;
                
                // Teardown Constraint if one already exists
                this.unbindConstraint(attrName);
                
                // Bind New Constraint if necessary and return actual value
                if (!this.setupConstraint(attrName, value)) {
                    // Call set for the actual value
                    this.set(attrName, value, true);
                }
            }
        }
    },
    
    /** Provides compatibility with existing dreem syntax. */
    setAttribute: function(attrName, v) {
        this.set(attrName, v, false);
    },
    
    // Common Setter Helpers //
    /** Sets the actual value of an attribute on an object and fires an
        event if the value has changed.
        @param attrName:string The name of the attribute to set.
        @param value:* The value to set.
        @param type:string The type to try to coerce the value to.
        @param defaultValue:* (optional) The default value to use when
            coercion fails.
        @param beforeEventFunc:function (optional) A function that gets called
            before the event may be fired.
        @returns boolean: True if the value was changed, false otherwise. */
    setActual: function(attrName, value, type, defaultValue, beforeEventFunc) {
        if (this[attrName] !== (value = this.coerce(value, type, defaultValue))) {
            // Store value and invoke setter on sprite if it exists
            var setterName = dr.AccessorSupport.generateSetterName(attrName),
                sprite = this.sprite;
            this[attrName] = (sprite && sprite[setterName]) ? sprite[setterName](value) : value;
            
            // Invoke the beforeEventFunc if possible
            if (beforeEventFunc) beforeEventFunc();
            
            // Fire an event if possible
            if (this.inited !== false && this.fireNewEvent) { // !== false allows this to work with non-nodes.
                this.fireNewEvent(attrName, this[attrName]);
            }
            return true;
        }
        return false;
    },
    
    /** Sets the actual value of an attribute on an object.
        @param attrName:string The name of the attribute to set.
        @param value:* The value to set.
        @returns boolean: True if the value was changed, false otherwise. */
    setSimpleActual: function(attrName, value) {
        if (this[attrName] !== value) {
            this[attrName] = value;
            return true;
        }
        return false;
    },
    
    // Constraints //
    unbindConstraint: function(attrName) {
        var constraints = this.constraints,
            constraintInfo = constraints ? constraints[attrName] : null;
        if (constraintInfo) {
            var funcName = constraintInfo.funcName,
                bindings = constraintInfo.bindings, i = bindings.length, binding;
            while (i) {
                binding = bindings[--i];
                this.detachFrom(binding.target, funcName, binding.eventName);
            }
            delete this[funcName];
            delete constraints[attrName];
        }
    },
    
    /** Attempts to setup the provided value as a constraint.
        @param attrName:string The name of the attribute the constraint is for.
        @param value:* The value, possibly a constraint expression, to set.
        @return boolean True if the value was a constraint, false otherwise. */
    setupConstraint: function(attrName, value) {
        if (typeof value === 'string' && value.startsWith('${') && value.endsWith('}')) {
            var CONSTRAINTS = dr.AccessorSupport.CONSTRAINTS,
                expression = value.substring(2, value.length - 1);
            if (CONSTRAINTS.isReadyForConstraints()) {
                // Bind immediately if the view system is ready for constraints.
                this.bindConstraint(attrName, expression, false);
            } else {
                // Defer constraint resolution until later.
                CONSTRAINTS.registerConstraint(this, attrName, expression);
            }
            return true;
        }
        return false;
    },
    
    /** @private */
    bindConstraint: function(attrName, expression, isAsync) {
        // Unbind again in case multiple constraints got registered for the
        // same attribute during initialization.
        if (isAsync) this.unbindConstraint(attrName);
        
        // Find Bindings
        var AS = dr.AccessorSupport,
            CONSTRAINTS = AS.CONSTRAINTS,
            bindingCache = CONSTRAINTS.BINDINGS;
        if (!(expression in bindingCache)) {
            CONSTRAINTS.SCOPES = [];
            acorn.walkDown(acorn.parse(expression), CONSTRAINTS.PROPERTY_BINDINGS);
            bindingCache[expression] = CONSTRAINTS.SCOPES;
        }
        
        // Create function to be called for the constraint.
        var fn = (new Function('this.set("' + attrName + '",' + expression + ', true)')).bind(this);
        
        // Resolve binding paths and start listening to binding targets
        if (fn) {
            var funcName = AS.generateConstraintFunctionName(attrName),
                bindings = [],
                scopes = bindingCache[expression], i = scopes.length, 
                scope, eventName, target, binding;
            while (i) {
                scope = scopes[--i];
                
                binding = scope.binding;
                if (binding === 'this') {
                    target = this;
                } else if (binding.startsWith('this.')) {
                    target = dr.resolveName(binding.substring(5), this);
                } else {
                    target = dr.resolveName(binding);
                }
                
                if (target) {
                    eventName = scope.property;
                    this.attachTo(target, funcName, eventName);
                    bindings.push({target:target, eventName:eventName});
                }
            }
            (this.constraints || (this.constraints = {}))[attrName] = {funcName:funcName, bindings:bindings};
            
            // Assign function to this object and execute immediately
            this[funcName] = fn;
            fn();
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
dr.Destructible = new JS.Module('Destructible', {
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


/** Objects that can be used in an dr.AbstractPool should use this mixin and 
    implement the "clean" method. */
dr.Reusable = new JS.Module('Reusable', {
    // Methods /////////////////////////////////////////////////////////////////
    /** Puts this object back into a default state suitable for storage in
        an dr.AbstractPool
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
dr.AbstractPool = new JS.Class('AbstractPool', {
    include: [dr.Destructible],
    
    
    // Constructor /////////////////////////////////////////////////////////////
    /** Initialize does nothing. */
    initialize: function() {},
    
    
    // Life Cycle //////////////////////////////////////////////////////////////
    /** @overrides dr.Destructible */
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
        a dr.Reusable. Otherwise it does nothing.
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


/** An implementation of an dr.AbstractPool.
    
    Events
        None
    
    Attributes:
        instanceClass:JS.Class (initializer only) the class to use for 
            new instances. Defaults to Object.
        instanceParent:dr.Node (initializer only) The node to create new
            instances on.
*/
dr.SimplePool = new JS.Class('SimplePool', dr.AbstractPool, {
    // Constructor /////////////////////////////////////////////////////////////
    /** Create a new dr.SimplePool
        @param instanceClass:JS.Class the class to create instances from.
        @param instanceParent:object (optional) The place to create instances 
            on. When instanceClass is an dr.Node this will be the node parent.
        @returns void */
    initialize: function(instanceClass, instanceParent) {
        this.callSuper();
        
        this.instanceClass = instanceClass || Object;
        this.instanceParent = instanceParent;
    },
    
    
    // Methods /////////////////////////////////////////////////////////////////
    /** @overrides dr.AbstractPool
        Creates an instance of this.instanceClass and passes in 
        this.instanceParent as the first argument if it exists.
        @param arguments[0]:object (optional) the attrs to be passed to a
            created dr.Node. */
    createInstance: function() {
        // If we ever need full arguments with new, see:
        // http://stackoverflow.com/questions/1606797/use-of-apply-with-new-operator-is-this-possible
        var parent = this.instanceParent, instanceClass = this.instanceClass;
        return parent ? new instanceClass(parent, arguments[0]) : new instanceClass();
    }
});


/** An dr.SimplePool that tracks which objects are "active". An "active"
    object is one that has been obtained by the getInstance method.
    
    Events:
        None
    
    Attributes:
        None
    
    Private Attributes:
        __actives:array an array of active instances.
*/
dr.TrackActivesPool = new JS.Class('TrackActivesPool', dr.SimplePool, {
    // Life Cycle //////////////////////////////////////////////////////////////
    /** @overrides dr.Destructible */
    destroy: function() {
        var actives = this.__actives;
        if (actives) actives.length = 0;
        
        this.callSuper();
    },
    
    
    // Methods /////////////////////////////////////////////////////////////////
    /** @overrides dr.AbstractPool */
    getInstance: function() {
        var instance = this.callSuper();
        (this.__actives || (this.__actives = [])).push(instance);
        return instance;
    },
    
    /** @overrides dr.AbstractPool */
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
    Useful as a light weight alternative to dr.Node when parent child
    relationships are not needed.
    
    Events:
        None.
    
    Attributes:
        inited:boolean Set to true after this Eventable has completed 
            initializing.
*/
dr.Eventable = new JS.Class('Eventable', {
    include: [dr.AccessorSupport, dr.Destructible, dr.Observable, dr.Constrainable],
    
    
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
    
    /** @overrides dr.Destructible. */
    destroy: function() {
        this.releaseAllConstraints();
        this.detachFromAllObservables();
        this.detachAllObservers();
        
        this.callSuper();
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
dr.PlatformObserver = new JS.Module('PlatformObserver', {
    // Methods /////////////////////////////////////////////////////////////////
    /** Attaches this PlatformObserverAdapter to the a SpriteBacked Node
        for an event type.
        @returns void */
    attachToPlatform: function(spriteBacked, methodName, eventType, capture) {
        if (spriteBacked && methodName && eventType) {
            capture = !!capture;
            
            var observable = spriteBacked.get_sprite();
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
            
            var observable = spriteBacked.get_sprite();
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


/** Indicates that a dr.Node is backed by a sprite. */
dr.SpriteBacked = new JS.Module('SpriteBacked', {
    // Accessors ///////////////////////////////////////////////////////////////
    set_sprite: function(sprite) {
        if (this.sprite) {
            dr.dumpStack('Attempt to reset sprite.');
        } else {
            this.sprite = sprite;
        }
    },
    
    get_sprite: function() {
        return this.sprite;
    },
    
    
    // Methods /////////////////////////////////////////////////////////////////
    createSprite: function(attrs) {
        return dr.sprite.createSprite(this, attrs);
    }
});


/** Generates Platform Events and passes them on to one or more event observers.
    
    Events:
        None
    
    Attributes:
        None
    
    Private Attributes:
        __dobsbt:object Stores arrays of dr.sprite.PlatformObservers and 
            method names by event type.
*/
dr.sprite.PlatformObservable = new JS.Module('sprite.PlatformObservable', {
    // Methods /////////////////////////////////////////////////////////////////
    /** Adds the observer to the list of event recipients for the event type.
        @param platformObserver:dr.sprite.PlatformObserver The observer that 
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
                
                dr.sprite.addEventListener(this.platformObject, eventType, methodRef, capture);
                
                return true;
            }
        }
        return false;
    },
    
    /** Creates a function that will handle the platform event when it is fired
        by the browser. Must be implemented by the object this mixin is 
        applied to.
        @param platformObserver:dr.sprite.PlatformObserver the observer that 
            must be notified when the platform event fires.
        @param methodName:string the name of the function to pass the event to.
        @param eventType:string the type of the event to fire.
        @returns a function to handle the platform event or null if the event
            is not supported. */
    createPlatformMethodRef: function(platformObserver, methodName, eventType) {
        return null;
    },
    
    /** Used by the createPlatformMethodRef implementations of submixins of 
        dr.sprite.PlatformObservable to implement the standard methodRef.
        @param platformObserver:dr.sprite.PlatformObserver the observer that 
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
                    
                    if (preventDefault) dr.sprite.preventDefault(platformEvent);
                }
                
                event.source = undefined;
            };
        }
    },
    
    /** Removes the observer from the list of platform observers for the 
        event type.
        @param platformObserver:dr.sprite.PlatformObserver The platform 
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
                            if (platformObject) dr.sprite.removeEventListener(platformObject, eventType, platformObservers[i + 2], capture);
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
                        dr.sprite.removeEventListener(platformObject, eventType, methodRef, capture);
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
    
    Requires: dr.sprite.PlatformObservable callSuper mixin.
*/
dr.sprite.MouseObservable = new JS.Module('sprite.MouseObservable', {
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
    /** @overrides dr.sprite.PlatformObservable */
    createPlatformMethodRef: function(platformObserver, methodName, type) {
        return this.createStandardPlatformMethodRef(platformObserver, methodName, type, dr.sprite.MouseObservable, true) || 
            this.callSuper(platformObserver, methodName, type);
    }
});


/** Generates Key Events and passes them on to one or more event observers.
    Requires dr.DomObservable as a callSuper mixin. */
dr.sprite.KeyObservable = new JS.Module('sprite.KeyObservable', {
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
    /** @overrides dr.sprite.PlatformObservable */
    createPlatformMethodRef: function(platformObserver, methodName, type) {
        return this.createStandardPlatformMethodRef(platformObserver, methodName, type, dr.sprite.KeyObservable) || 
            this.callSuper(platformObserver, methodName, type);
    }
});


/** Tracks focus and provides global focus events. Registered with dr.global 
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
    include: [dr.Observable],
    
    
    // Constructor /////////////////////////////////////////////////////////////
    initialize: function() {
        dr.global.register('focus', this);
    },
    
    
    // Accessors ///////////////////////////////////////////////////////////////
    /** Sets the currently focused view. */
    set_focusedView: function(v) {
        if (dr.sprite.focus.set_focusedView(v)) this.fireNewEvent('focused', v);
    },
    
    
    // Methods /////////////////////////////////////////////////////////////////
    /** Called by a FocusObservable when it has received focus.
        @param focusable:FocusObservable the view that received focus.
        @returns void. */
    notifyFocus: function(focusable) {
        dr.sprite.focus.notifyFocus(focusable);
    },
    
    /** Called by a FocusObservable when it has lost focus.
        @param focusable:FocusObservable the view that lost focus.
        @returns void. */
    notifyBlur: function(focusable) {
        dr.sprite.focus.notifyBlur(focusable);
    },
    
    /** Clears the current focus.
        @returns void */
    clear: function() {
        dr.sprite.focus.clear();
    },
    
    // Focus Traversal //
    /** Move focus to the next focusable element.
        @param ignoreFocusTrap:boolean If true focus traps will be skipped over.
        @returns void */
    next: function(ignoreFocusTrap) {
        dr.sprite.focus.next(ignoreFocusTrap);
    },
    
    /** Move focus to the previous focusable element.
        @param ignoreFocusTrap:boolean If true focus traps will be skipped over.
        @returns void */
    prev: function(ignoreFocusTrap) {
        dr.sprite.focus.prev(ignoreFocusTrap);
    }
});


/** Generates focus and blur events and passes them on to one or more 
    event observers. Also provides focus related events to a view. When a view
    is focused or blurred, dr.global.focus will be notified via the
    'notifyFocus' and 'notifyBlur' methods.
    
    Requires dr.sprite.DomObservable as a callSuper mixin.
    
    Events:
        focused:object Fired when this view gets focus. The value is this view.
        focus:object Fired when this view gets focus. The value is a dom
            focus event.
        blur:object Fired when this view loses focus. The value is a dom
            focus event.
    
    Attributes:
        focusable:boolean Indicates if this view can have focus or not.
*/
dr.sprite.FocusObservable = new JS.Module('sprite.FocusObservable', {
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
    set_focusable: function(v) {
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
    
    /** @overrides dr.PlatformObservable */
    createPlatformMethodRef: function(platformObserver, methodName, type) {
        if (dr.sprite.FocusObservable.EVENT_TYPES[type]) {
            var self = this;
            return function(platformEvent) {
                if (!platformEvent) var platformEvent = global.event;
                
                // OPTIMIZATION: prevent extra focus events under special 
                // circumstances. See dr.VariableLayout for more detail.
                if (self._ignoreFocus) {
                    platformEvent.cancelBubble = true;
                    if (platformEvent.stopPropagation) platformEvent.stopPropagation();
                    dr.sprite.preventDefault(platformEvent);
                    return;
                }
                
                // Configure common focus event.
                var event = dr.sprite.FocusObservable.EVENT;
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
dr.sprite.View = new JS.Class('sprite.View', {
    include: [
        dr.Destructible,
        dr.sprite.PlatformObservable,
        dr.sprite.KeyObservable,
        dr.sprite.MouseObservable,
        dr.sprite.FocusObservable
    ],
    
    
    // Constructor /////////////////////////////////////////////////////////////
    /** The standard JSClass initializer function. Subclasses should not
        override this function.
        @param view:dr.View The view this sprite is backing.
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
    set_x: function(v) {
        if (this.view.visible) this.styleObj.left = v + 'px';
        return v;
    },
    
    set_y: function(v) {
        if (this.view.visible) this.styleObj.top = v + 'px';
        return v;
    },
    
    set_width: function(v) {
        // Dom elements don't support negative width
        if (0 > v) v = 0;
        this.styleObj.width = v + 'px';
        return v;
    },
    
    set_height: function(v, supressEvent) {
        // Dom elements don't support negative height
        if (0 > v) v = 0;
        this.styleObj.height = v + 'px';
        return v;
    },
    
    set_bgcolor: function(v) {
        this.styleObj.backgroundColor = v;
        return v;
    },
    
    set_opacity: function(v) {
        this.styleObj.opacity = v;
        return v;
    },
    
    set_visible: function(v) {
        var s = this.styleObj;
        s.visibility = v ? 'inherit' : 'hidden';
        
        // Move invisible elements to a very negative location so they won't
        // effect scrollable area. Ideally we could use display:none but we
        // can't because that makes measuring bounds not work.
        s.left = v ? this.view.x + 'px' : '-100000px';
        s.top = v ? this.view.y + 'px' : '-100000px';
        return v;
    },
    
    set_cursor: function(v) {
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
        return dr.sprite.__getComputedStyle(this.platformObject);
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
            borderMultiplier = dr.sprite.platform.browser === 'Firefox' ? 2 : 1; // I have no idea why firefox needs it twice, but it does.
        
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


/** A single node within a tree data structure. A node has zero or one parent 
    node and zero or more child nodes. If a node has no parent it is a 'root' 
    node. If a node has no child nodes it is a 'leaf' node. Parent nodes and 
    parent of parents, etc. are referred to as ancestors. Child nodes and 
    children of children, etc. are referred to as descendants.
    
    Lifecycle management is also provided via the 'initNode', 'doBeforeAdoption',
    'doAfterAdoption', 'destroy', 'destroyBeforeOrphaning' and
    'destroyAfterOrphaning' methods.
    
    Events:
        parent:dr.Node Fired when the parent is set.
    
    Attributes:
        parent:dr.Node The parent of this Node.
        name:string The name of this node. Used to reference this Node from
            its parent Node.
        id:string The unique ID of this node in the global namespace.
        
        Lifecycle Related:
            inited:boolean Set to true after this Node has completed 
                initializing.
            isBeingDestroyed:boolean (read only) Indicates that this node is in 
                the process of being destroyed. Set to true at the beginning of 
                the destroy lifecycle phase. Undefined before that.
        
        Placement Related:
            placement:string The name of the subnode of this Node to add nodes 
                to when set_parent is called on the subnode. Placement can be 
                nested using '.' For example 'foo.bar'. The special value of 
                '*' means use the default placement. For example 'foo.*' means 
                place in the foo subnode and then in the default placement 
                for foo.
            defaultplacement:string The name of the subnode to add nodes to when 
                no placement is specified. Defaults to undefined which means add
                subnodes directly to this node.
            ignoreplacement:boolean If set to true placement will not be 
                processed for this Node when it is added to a parent Node.
    
    Private Attributes:
        __animPool:array An dr.TrackActivesPool used by the 'animate' method.
        subnodes:array The array of child nodes for this node. Should be
            accessed through the getSubnodes method.
*/
dr.Node = new JS.Class('Node', {
    include: [
        dr.AccessorSupport, 
        dr.Destructible, 
        dr.Observable, 
        dr.Constrainable
    ],
    
    
    // Class Methods and Attributes ////////////////////////////////////////////
    extend: {
        /** Get the closest ancestor of the provided Node or the Node itself for 
            which the matcher function returns true.
            @param n:dr.Node the Node to start searching from.
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
            @param n:dr.Node the Node to start searching from. This Node is not
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
        
        var defaultKlassAttrValues = this.klass.defaultAttrValues;
        if (defaultKlassAttrValues) attrs = dr.extend({}, defaultKlassAttrValues, attrs);
        
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
        this.set_parent(parent);
        this.doAfterAdoption();
        this.__makeChildren();
        this.__registerHandlers();
        
        this.inited = true;
        this.fireNewEvent('oninit', true);
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
    
    /** @private */
    __makeChildren: function() {},
    
    /** @private */
    __registerHandlers: function() {},
    
    /** @overrides dr.Destructible. */
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
        if (this.parent) this.set_parent(null);
        this.destroyAfterOrphaning();
        
        // Remove from global namespace if necessary
        if (this.id) this.set_id();
        
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
    
    
    // Accessors ///////////////////////////////////////////////////////////////
    /** Sets the provided Node as the new parent of this Node. This is the
        most direct method to do reparenting. You can also use the addSubnode
        method but it's just a wrapper around this setter. */
    set_parent: function(newParent) {
        // Use placement if indicated
        if (newParent && !this.ignoreplacement) {
            var placement = this.placement || newParent.defaultplacement;
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
    set_name: function(name) {
        if (this.name !== name) {
            // Remove "name" reference from parent.
            var p = this.parent;
            if (p && this.name) p.__removeNameRef(this);
            
            this.name = name;
            
            // Add "name" reference to parent.
            if (p && name) p.__addNameRef(this);
        }
    },
    
    /** Stores this instance in the global scope under the provided id. */
    set_id: function(v) {
        var existing = this.id;
        if (v !== existing) {
            delete global[existing];
            this.id = v;
            if (v) global[v] = this;
            if (this.inited) this.fireNewEvent('id', v);
        }
    },
    
    /** Gets the subnodes for this Node and does lazy instantiation of the 
        subnodes array if no child Nodes exist.
        @returns array of subnodes. */
    getSubnodes: function() {
        return this.subnodes || (this.subnodes = []);
    },
    
    // Placement Accessors /////////////////////////////////////////////////////
    set_placement: function(v) {this.setSimpleActual('placement', v);},
    set_defaultplacement: function(v) {this.setSimpleActual('defaultplacement', v);},
    set_ignoreplacement: function(v) {this.setSimpleActual('ignoreplacement', v);},
    
    
    // Methods /////////////////////////////////////////////////////////////////
    createChild: function(attrs, mixins) {
        var classname = 'node', parent = this, klass;
        
        if (attrs) {
            if (attrs.class) {
                classname = attrs.class;
                delete attrs.class;
            }
            
            if (attrs.parent) {
                parent = attrs.parent;
                delete attrs.parent;
            }
        }
        
        klass = dr[classname];
        if (typeof klass === 'function') {
            return new klass(parent, attrs, mixins);
        } else {
            dr.dumpStack("Unrecognized class in createChild", classname);
        }
    },
    
    /** Called from set_parent to determine where to insert a subnode in the node
        hierarchy. Subclasses will not typically override this method, but if
        they do, they probably won't need to call callSuper.
        @param placement:string the placement path to use.
        @param subnode:dr.Node the subnode being placed.
        @returns the Node to place a subnode into. */
    determinePlacement: function(placement, subnode) {
        // Parse "active" placement and remaining placement.
        var idx = placement.indexOf('.'), remainder, loc;
        if (idx !== -1) {
            remainder = placement.substring(idx + 1);
            placement = placement.substring(0, idx);
        }
        
        // Evaluate placement of '*' as defaultplacement.
        if (placement === '*') {
            placement = this.defaultplacement;
            
            // Default placement may be compound and thus require splitting
            if (placement) {
                idx = placement.indexOf('.');
                if (idx !== -1) {
                    remainder = placement.substring(idx + 1) + (remainder ? '.' + remainder : '');
                    placement = placement.substring(0, idx);
                }
            }
            
            // It's possible that a placement of '*' comes out here if a
            // Node has its defaultplacement set to '*'. This should result
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
        @param node:dr.Node The node to look for a common ancestor with.
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
        dr.Node.getMatchingAncestor(this, matcherFunc).
        @param matcherFunc:function the function to test for matching 
            Nodes with.
        @returns Node or null if no match is found. */
    searchAncestors: function(matcherFunc) {
        return dr.Node.getMatchingAncestor(this, matcherFunc);
    },
    
    /** Get the youngest ancestor of this Node or the Node itself for which 
        the matcher function returns true. This is a simple wrapper around 
        dr.Node.getMatchingAncestorOrSelf(this, matcherFunc).
        @param matcherFunc:function the function to test for matching 
            Nodes with.
        @returns Node or null if no match is found. */
    searchAncestorsOrSelf: function(matcherFunc) {
        return dr.Node.getMatchingAncestorOrSelf(this, matcherFunc);
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
        standard way to do this is to call the set_parent method on the
        prospective child Node.
        @param node:Node the subnode to add.
        @returns void */
    addSubnode: function(node) {
        node.set_parent(this);
    },
    
    /** A convienence method to make a Node no longer a child of this Node. The
        standard way to do this is to call the set_parent method with a value
        of null on the child Node.
        @param node:Node the subnode to remove.
        @returns the removed Node or null if removal failed. */
    removeSubnode: function(node) {
        if (node.parent !== this) return null;
        node.set_parent(null);
        return node;
    },
    
    /** Called when a subnode is added to this node. Provides a hook for
        subclasses. No need for subclasses to call callSuper. Do not call this
        method to add a subnode. Instead call addSubnode or set_parent.
        @param node:Node the subnode that was added.
        @returns void */
    subnodeAdded: function(node) {},
    
    /** Called when a subnode is removed from this node. Provides a hook for
        subclasses. No need for subclasses to call callSuper. Do not call this
        method to remove a subnode. Instead call removeSubnode or set_parent.
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
        
        // ignoreplacement ensures the animator is directly attached to this node
        var anim = animPool.getInstance({ignoreplacement:true});
        
        if (typeof attribute === 'object') {
            // Handle a single map argument if provided
            callback = attribute.callback;
            delete attribute.callback;
            anim.callSetters(attribute);
        } else {
            // Handle individual arguments
            anim.attribute = attribute;
            anim.set_to(to);
            anim.set_from(from);
            if (duration != null) anim.duration = duration;
            if (relative != null) anim.relative = relative;
            if (repeat != null) anim.repeat = repeat;
            if (reverse != null) anim.set_reverse(reverse);
            if (easingFunction != null) anim.set_easingfunction(easingFunction);
        }
        
        // Release the animation when it completes.
        anim.next(function(success) {animPool.putInstance(anim);});
        if (callback) anim.next(callback);
        
        anim.set_running(true);
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
        @returns dr.TrackActivesPool */
    __getAnimPool: function() {
        return this.__animPool || (this.__animPool = new dr.TrackActivesPool(dr.Animator, this));
    }
});


/** Marks subclasses as layouts. */
dr.BaseLayout = new JS.Class('BaseLayout', dr.Node, {});


/** A counter that can be incremented and decremented and will update an
    'exceeded' attribute when a threshold is crossed. */
dr.ThresholdCounter = new JS.Class('ThresholdCounter', {
    include: [dr.AccessorSupport, dr.Destructible, dr.Observable],
    
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
                attribute was 'locked' this would be 'lockedcounter'.
            @param thresholdAttrName:string (Optional) the name of the number
                attribute that determines when we are exceeded or not. If not 
                provided the 'exceeded' attribute name will be used with 
                'Threshold' appended to it. For example if the exceeded
                attribute was 'locked' this would be 'lockedThreshold'.
            @returns boolean True if creation succeeded, false otherwise. */
        createThresholdCounter: function(scope, exceededAttrName, counterAttrName, thresholdAttrName) {
            var genNameFunc = dr.AccessorSupport.generateName;
            counterAttrName = counterAttrName || genNameFunc('counter', exceededAttrName);
            thresholdAttrName = thresholdAttrName || genNameFunc('threshold', exceededAttrName);
            
            var incrName = genNameFunc(counterAttrName, 'increment_'),
                decrName = genNameFunc(counterAttrName, 'decrement_'),
                thresholdSetterName = dr.AccessorSupport.generateSetterName(thresholdAttrName),
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
                    this.setActual(exceededAttrName, value >= this[thresholdAttrName], 'boolean'); // Check threshold
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
                this.setActual(exceededAttrName, this[counterAttrName] >= v, 'boolean'); // Check threshold
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
            var genNameFunc = dr.AccessorSupport.generateName;
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
                attribute was 'locked' this would be 'lockedcounter'.
            @returns boolean True if creation succeeded, false otherwise. */
        createFixedThresholdCounter: function(scope, thresholdValue, exceededAttrName, counterAttrName) {
            var genNameFunc = dr.AccessorSupport.generateName;
            counterAttrName = counterAttrName || genNameFunc('counter', exceededAttrName);
            
            var incrName = genNameFunc(counterAttrName, 'increment_'),
                decrName = genNameFunc(counterAttrName, 'decrement_'),
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
                if (value === thresholdValue) this.setActual(exceededAttrName, true, 'boolean');
            };
            
            /** Decrements the counter attribute on the scope object by 1.
                @returns void */
            mod[decrName] = function() {
                var curValue = this[counterAttrName];
                if (curValue === 0) return;
                var value = curValue - 1;
                this[counterAttrName] = value;
                this.fireNewEvent(counterAttrName, value);
                if (curValue === thresholdValue) this.setActual(exceededAttrName, false, 'boolean');
            };
            
            // Mix in the "module"
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
            counterAttrName = counterAttrName || dr.AccessorSupport.generateName('counter', exceededAttrName);
            
            scope[counterAttrName] = initialValue;
            scope.set(exceededAttrName, initialValue >= thresholdValue);
        }
    },
    
    
    // Constructor /////////////////////////////////////////////////////////////
    initialize: function(initialValue, thresholdValue) {
        dr.ThresholdCounter.initializeThresholdCounter(
            this, initialValue, thresholdValue, 'exceeded', 'counter', 'threshold'
        );
    },
    
    
    // Life Cycle //////////////////////////////////////////////////////////////
    /** @overrides dr.Destructible */
    destroy: function() {
        this.detachAllObservers();
        this.callSuper();
    }
});

/** Create default counter functions for the ThresholdCounter class. */
dr.ThresholdCounter.createThresholdCounter(
    dr.ThresholdCounter, 'exceeded', 'counter', 'threshold'
);


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
        subviewAdded:dr.View Fired when a subview is added to this view.
        subviewRemoved:dr.View Fired when a subview is removed from this view.
        layoutAdded:dr.BaseLayout Fired when a layout is added to this view.
        layoutRemoved:dr.BaseLayout Fired when a layout is removed from this view.
    
    Attributes:
        Layout Related:
            ignorelayout:json Defaults to false.
                Indicates if layouts should ignore this view or not. A variety 
                of configuration mechanisms are supported. Provided true or 
                false will cause the view to be ignored or not by all layouts. 
                If instead a serialized map is provided the keys of the map 
                will target values the layouts with matching names. A special 
                key of '*' indicates a default value for all layouts not 
                specifically mentioned in the map.
            layouthint:json Default to empty
                Provides per view hinting to layouts. The specific hints 
                supported are layout specific. Hints are provided as a map. A 
                map key may be prefixied with the name of a layout followed by 
                a '/'. This will target that hint at a specific layout. If 
                the prefix is ommitted or a prefix of '*' is used the hint 
                will be targeted to all layouts.
        
        Focus Related:
            focustrap:boolean Determines if focus traversal can move above this 
                view or not. The default is undefined which is equivalent to 
                false. Can be ignored using a key modifier. The key modifier is 
                typically 'option'.
            focuscage:boolean Determines if focus traversal can move above this 
                view or not. The default is undefined which is equivalent to 
                false. This is the same as focustrap except it can't be ignored 
                using a key modifier.
            maskfocus:boolean Prevents focus from traversing into this view or 
                any of its subviews. The default is undefined which is 
                equivalent to false.
            focusable:boolean Indicates if this view can have focus or not.
                Defaults to false.
            focused:boolean Indicates if this view has focus or not.
            focusembellishment:boolean Indicates if the focus embellishment 
                should be shown for this view or not when it has focus.
        
        Visual Related:
            x:number The x-position of this view in pixels. Defaults to 0.
            y:number The y-position of this view in pixels. Defaults to 0.
            width:number The width of this view in pixels. Defaults to 0.
            height:number the height of this view in pixels. Defaults to 0.
            boundsWidth:number (read only) The actual bounds of the view in the
                x-dimension. This value is in pixels relative to the RootView 
                and thus compensates for rotation and scaling.
            boundsHeight:number (read only) The actual bounds of the view in 
                the y-dimension. This value is in pixels relative to the 
                RootView and thus compensates for rotation and scaling.
            bgcolor:string The background color of this view. Use a value of 
                'transparent' to make this view transparent. Defaults 
                to 'transparent'.
            opacity:number The opacity of this view. The value should be a 
                number between 0 and 1. Defaults to 1.
            visible:boolean Makes this view visible or not. The default value 
                is true which means visbility is inherited from the parent view.
            cursor:string Determines what cursor to show when moused over 
                the view. Allowed values: 'auto', 'move', 'no-drop', 
                'col-resize', 'all-scroll', 'pointer', 'not-allowed', 
                'row-resize', 'crosshair', 'progress', 'e-resize', 'ne-resize', 
                'default', 'text', 'n-resize', 'nw-resize', 'help', 
                'vertical-text', 's-resize', 'se-resize', 'inherit', 'wait', 
                'w-resize', 'sw-resize'. Defaults to undefined which is 
                equivalent to 'auto'.
    
    Private Attributes:
        subviews:array The array of child dr.Views for this view. Should 
            be accessed through the getSubviews method.
        layouts:array The array of child dr.BaseLayouts for this view. Should
            be accessed through the getLayouts method.
*/
dr.View = new JS.Class('View', dr.Node, {
    include: [
        dr.SpriteBacked,
        dr.PlatformObserver
    ],
    
    
    // Life Cycle //////////////////////////////////////////////////////////////
    /** @overrides dr.Node */
    initNode: function(parent, attrs) {
        this.x = this.y = this.width = this.height = 0;
        this.opacity = 1;
        this.visible = this.focusembellishment = true;
        this.focusable = this.ignorelayout = false;
        this.bgcolor = 'transparent';
        this.cursor = 'auto';
        
        this.set_sprite(this.createSprite(attrs));
        
        this.callSuper(parent, attrs);
    },
    
    /** @overrides dr.Node */
    destroyBeforeOrphaning: function() {
        this.giveAwayFocus();
        this.callSuper();
    },
    
    /** @overrides dr.Node */
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
        @returns array of dr.View or null if this view is orphaned. */
    getSiblingViews: function() {
        if (!this.parent) return null;
        
        // Get a copy of the subviews since we will filter it.
        var svs = this.parent.getSubviews().concat();
        
        // Filter out ourself
        dr.filterArray(svs, this);
        
        return svs;
    },
    
    // Layout Attributes //
    /** Does lazy instantiation of the layouts array. */
    getLayouts: function() {
        return this.layouts || (this.layouts = []);
    },
    
    set_ignorelayout: function(v) {this.setActual('ignorelayout', v, 'json', 'false');},
    set_layouthint: function(v) {this.setActual('layouthint', v, 'json', '');},
    
    // Focus Attributes //
    set_focustrap: function(v) {this.setActual('focustrap', v, 'boolean', false);},
    set_focuscage: function(v) {this.setActual('focuscage', v, 'boolean', false);},
    set_maskfocus: function(v) {this.setActual('maskfocus', v, 'boolean', false);},
    set_focusable: function(v) {this.setActual('focusable', v, 'boolean', false);},
    
    set_focused: function(v) {
        if (this.setActual('focused', v, 'boolean', false)) {
            if (this.inited) {
                dr.global.focus[v ? 'notifyFocus' : 'notifyBlur'](this);
            }
        }
    },
    
    set_focusembellishment: function(v) {
        if (this.setActual('focusembellishment', v, 'boolean', true)) {
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
    set_bgcolor: function(v) {this.setActual('bgcolor', v, 'color', 'transparent');},
    set_opacity: function(v) {this.setActual('opacity', v, 'number', 1);},
    set_visible: function(v) {this.setActual('visible', v, 'boolean', true);},
    set_cursor: function(v) {this.setActual('cursor', v, 'string', 'auto');},
    set_x: function(v) {this.setActual('x', v, 'number', 0);},
    set_y: function(v) {this.setActual('y', v, 'number', 0);},
    set_width: function(v) {this.setActual('width', v, 'number', 0, this.__updateBounds.bind(this));},
    set_height: function(v) {this.setActual('height', v, 'number', 0, this.__updateBounds.bind(this));},
    
    /** Updates the boundsWidth and boundsHeight attributes.
        @private
        @returns void */
    __updateBounds: function() {
        this.setActual('boundsWidth', this.width, 'number', 0);
        this.setActual('boundsHeight', this.height, 'number', 0);
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
        checked. If you need to check that use dr.DomElementProxy.isDomElementVisible.
        @returns true if this view is visible, false otherwise. */
    isVisible: function() {
        return this.searchAncestorsOrSelf(function(v) {return !v.visible;}) === null;
    },
    
    /** @overrides dr.Node
        Calls this.subviewAdded if the added subnode is a dr.View. 
        @fires subviewAdded event with the provided Node if it's a View. 
        @fires layoutAdded event with the provided node if it's a Layout. */
    subnodeAdded: function(node) {
        if (node instanceof dr.View) {
            this.sprite.appendSprite(node.sprite);
            this.getSubviews().push(node);
            this.fireNewEvent('subviewAdded', node);
            this.subviewAdded(node);
        } else if (node instanceof dr.BaseLayout) {
            this.getLayouts().push(node);
            this.fireNewEvent('layoutAdded', node);
            this.layoutAdded(node);
        }
    },
    
    /** @overrides dr.Node
        Calls this.subviewRemoved if the remove subnode is a dr.View.
        @fires subviewRemoved event with the provided Node if it's a View
            and removal succeeds. 
        @fires layoutRemoved event with the provided Node if it's a Layout
            and removal succeeds. */
    subnodeRemoved: function(node) {
        var idx;
        if (node instanceof dr.View) {
            idx = this.getSubviewIndex(node);
            if (idx !== -1) {
                this.fireNewEvent('subviewRemoved', node);
                this.sprite.removeSprite(node.sprite);
                this.subviews.splice(idx, 1);
                this.subviewRemoved(node);
            }
        } else if (node instanceof dr.BaseLayout) {
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
        add a View. Instead call addSubnode or set_parent.
        @param sv:View the view that was added.
        @returns void */
    subviewAdded: function(sv) {},
    
    /** Called when a View is removed from this View. Do not call this method 
        to remove a View. Instead call removeSubnode or set_parent.
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
        add a Layout. Instead call addSubnode or set_parent.
        @param layout:Layout the layout that was added.
        @returns void */
    layoutAdded: function(layout) {},
    
    /** Called when a Layout is removed from this View. Do not call this 
        method to remove a Layout. Instead call removeSubnode or set_parent.
        @param layout:Layout the layout that was removed.
        @returns void */
    layoutRemoved: function(layout) {},
    
    /** Gets the value of a named layout hint.
        @param layoutName:string The name of the layout to match.
        @param hintName:string The name of the hint to match.
        @return * The value of the hint or undefined if not found. */
    getLayoutHint: function(layoutName, hintName) {
        var hints = this.layouthint;
        if (hints) {
            var hint = hints[layoutName + '/' + hintName];
            if (hint) return hint;
            
            hint = hints[hintName];
            if (hint) return hint;
            
            hint = hints['*/' + hintName];
            if (hint) return hint;
        } else {
          // No hints exist
        }
    },
    
    // Focus //
    /** Finds the youngest ancestor (or self) that is a focustrap or focuscage.
        @param ignoreFocusTrap:boolean indicates focustraps should be
            ignored.
        @returns a View with focustrap set to true or null if not found. */
    getFocusTrap: function(ignoreFocusTrap) {
        return this.searchAncestorsOrSelf(
            function(v) {
                return v.focuscage || (v.focustrap && !ignoreFocusTrap);
            }
        );
    },
    
    /** Tests if this view is in a state where it can receive focus.
        @returns boolean True if this view is visible, enabled, focusable and
            not focus masked, false otherwise. */
    isFocusable: function() {
        return this.focusable && !this.disabled && this.isVisible() && 
            this.searchAncestorsOrSelf(function(n) {return n.maskfocus === true;}) === null;
    },
    
    /** Gives the focus to the next focusable element or, if nothing else
        is focusable, blurs away from this element.
        @returns void */
    giveAwayFocus: function() {
        if (this.focused) {
            // Try to go to next focusable element.
            dr.global.focus.next();
            
            // If focus loops around to ourself make sure we don't keep it.
            if (this.focused) this.blur();
        }
    },
    
    /** @private */
    __handleFocus: function(event) {
        if (!this.focused) {
            this.set_focused(true);
            this.doFocus();
        }
    },
    
    /** @private */
    __handleBlur: function(event) {
        if (this.focused) {
            this.doBlur();
            this.set_focused(false);
        }
    },
    
    doFocus: function() {
        if (this.focusembellishment) {
            this.showFocusEmbellishment();
        } else {
            this.hideFocusEmbellishment();
        }
    },
    
    doBlur: function() {
        if (this.focusembellishment) this.hideFocusEmbellishment();
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


/** Provides events when a new dr.RootView is created or destroyed.
    Registered in dr.global as 'roots'.
    
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
    include: [dr.Observable],
    
    
    // Life Cycle //////////////////////////////////////////////////////////////
    initialize: function() {
        this.__roots = [];
        dr.global.register('roots', this);
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
dr.RootView = new JS.Module('RootView', {
    // Life Cycle //////////////////////////////////////////////////////////////
    initNode: function(parent, attrs) {
        this.callSuper(parent, attrs);
        dr.global.roots.addRoot(this);
    },
    
    createSprite: function(attrs) {
        attrs.__isRootView = true;
        return dr.sprite.createSprite(this, attrs);
    },
    
    /** @overrides dr.View */
    destroyAfterOrphaning: function() {
        dr.global.roots.removeRoot(this);
        this.callSuper();
    },
    
    
    // Accessors ///////////////////////////////////////////////////////////////
    /** @overrides dr.Node */
    set_parent: function(parent) {
        // A root view doesn't have a parent view.
        this.callSuper(undefined);
    }
});


/** Provides an interface to platform specific viewport resize functionality. */
dr.sprite.GlobalViewportResize = new JS.Class('sprite.GlobalViewportResize', {
    // Constructor /////////////////////////////////////////////////////////////
    /** The standard JSClass initializer function. Subclasses should not
        override this function.
        @param attrs:object A map of attribute names and values.
        @returns void */
    initialize: function(view, attrs) {
        this.view = view;
        
        var self = this;
        dr.sprite.addEventListener(global, 'resize', function(domEvent) {
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


/** Provides events when the viewport is resized. Registered with dr.global
    as 'viewportResize'.
    
    Events:
        resize:object Fired when the viewport is resized. This is a
            reused event stored at dr.global.viewportResize.EVENT. The type
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
        dr.SpriteBacked,
        dr.Observable
    ],
    
    
    // Life Cycle //////////////////////////////////////////////////////////////
    initialize: function() {
        this.set_sprite(this.createSprite());
        
        // The common resize event that gets reused.
        this.EVENT = {
            source:this, type:'resize', 
            value:{w:this.getWidth(), h:this.getHeight()}
        };
        
        dr.global.register('viewportResize', this);
    },
    
    createSprite: function(attrs) {
        return new dr.sprite.GlobalViewportResize(this);
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
        resizedimension:string The dimension to resize in. Supported values
            are 'width', 'height' and 'both'. Defaults to 'both'.
        minwidth:number the minimum width below which this view will not 
            resize its width. Defaults to 0.
        minheight:number the minimum height below which this view will not
            resize its height. Defaults to 0.
*/
dr.SizeToViewport = new JS.Module('SizeToViewport', {
    include: [dr.RootView],
    
    
    // Life Cycle //////////////////////////////////////////////////////////////
    /** @overrides */
    initNode: function(parent, attrs) {
        this.minwidth = this.minheight = 0;
        if (attrs.resizedimension === undefined) attrs.resizedimension = 'both';
        
        this.attachTo(dr.global.viewportResize, '__handleResize', 'resize');
        this.callSuper(parent, attrs);
    },
    
    
    // Accessors ///////////////////////////////////////////////////////////////
    set_resizedimension: function(v) {
        if (this.setActual('resizedimension', v, 'string', 'both')) {
            this.__handleResize();
        }
    },
    
    set_minwidth: function(v) {
        if (this.setActual('minwidth', v, 'number', 0)) {
            this.__handleResize();
        }
    },
    
    set_minheight: function(v) {
        if (this.setActual('minheight', v, 'number', 0)) {
            this.__handleResize();
        }
    },
    
    
    // Methods /////////////////////////////////////////////////////////////////
    /** @private */
    __handleResize: function(event) {
        var v = dr.global.viewportResize.EVENT.value, // Ignore the provided event.
            dim = this.resizedimension;
        if (dim === 'width' || dim === 'both') this.set_width(Math.max(this.minwidth, v.w));
        if (dim === 'height' || dim === 'both') this.set_height(Math.max(this.minheight, v.h));
    }
});


/** Provides an interface to platform specific Idle functionality. */
dr.sprite.GlobalIdle = new JS.Class('sprite.GlobalIdle', {
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
                view.fireNewEvent('onidle', event);
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


/** Provides idle events. Registered with dr.global as 'idle'.
    
    Events:
        onidle:object Fired when a browser idle event occurs. The event value is
            an object containing:
                delta: The time in millis since the last idle evnet.
                time: The time in millis of this idle event.
    
    Attributes:
        running:boolean Indicates if idle events are currently being fired
            or not.
        lastTime:number The millis of the last idle event fired.
    
    Private Attributes:
        __timerId:number The ID of the last onidle event in the browser.
        __doIdle:function The function that gets executed on idle.
        __event:object The onidle event object that gets reused.
*/
new JS.Singleton('GlobalIdle', {
    include: [
        dr.SpriteBacked,
        dr.Observable
    ],
    
    
    // Constructor /////////////////////////////////////////////////////////////
    initialize: function() {
        this.running = false;
        this.set_sprite(this.createSprite());
        
        // Stores Eventables for callOnIdle
        this.__callOnIdleRegistry = {};
        
        // Store in dr namespace for backwards compatibility with dreem
        if (dr.idle) {
            dr.dumpStack('dr.idle already set.');
        } else {
            dr.idle = this;
        }
        
        dr.global.register('idle', this);
    },
    
    createSprite: function(attrs) {
        return new dr.sprite.GlobalIdle(this);
    },
    
    
    // Methods /////////////////////////////////////////////////////////////////
    /** @overrides dr.Observable */
    attachObserver: function(observer, methodName, type) {
        var retval = this.callSuper(observer, methodName, type);
        
        // Start firing onidle events
        if (!this.running && this.hasObservers('onidle')) {
            this.running = true;
            this.sprite.start();
        }
        
        return retval;
    },
    
    /** @overrides dr.Observable */
    detachObserver: function(observer, methodName, type) {
        var retval = this.callSuper(observer, methodName, type);
        
        // Stop firing onidle events
        if (this.running && !this.hasObservers('onidle')) {
            this.sprite.stop();
            this.running = false;
        }
        
        return retval;
    },
    
    /** Invokes the provided callback function once on the next idle event.
        @param callback:function The function to call.
        @returns void */
    callOnIdle: function(callback) {
        if (callback) {
            var guid = dr.generateGuid(),
                registry = this.__callOnIdleRegistry,
                observer = registry[guid] = new dr.Eventable({}, [{
                invoke: function(event) {
                        try {
                            var value = event.value;
                            callback(value.time, value.delta);
                        } catch (e) {
                            dr.dumpStack(e);
                        } finally {
                            delete registry[guid];
                            this.destroy();
                        }
                    }
                }]);
            observer.attachTo(this, 'invoke', 'onidle', true);
        }
    }
});


/** Changes the value of an attribute on a target over time.
    
    Events:
        running:boolean Fired when the animation starts or stops.
        paused:boolean Fired when the animation is paused or unpaused.
        reverse:boolean
        easingfunction:function
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
        easingfunction:string/function Controls the rate of animation.
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
dr.Animator = new JS.Class('Animator', dr.Node, {
    include: [dr.Reusable],
    
    
    // Life Cycle //////////////////////////////////////////////////////////////
    /** @overrides dr.Node */
    initNode: function(parent, attrs) {
        this.duration = 1000;
        this.relative = this.reverse = this.running = this.paused = false;
        this.repeat = 1;
        this.easingfunction = dr.Animator.DEFAULT_EASING_FUNCTION;
        
        this.callSuper(parent, attrs);
        
        this.__reset();
    },
    
    
    // Accessors ///////////////////////////////////////////////////////////////
    set_attribute: function(v) {this.setActual('attribute', v, 'string');},
    set_target: function(v) {this.setActual('target', v, 'object');},
    set_from: function(v) {this.setActual('from', v, 'number');},
    set_to: function(v) {this.setActual('to', v, 'number');},
    set_duration: function(v) {this.setActual('duration', v, 'number', 1000);},
    set_easingfunction: function(v) {this.setActual('easingfunction', v, 'easing_function');},
    set_relative: function(v) {this.setActual('relative', v, 'boolean', false);},
    set_repeat: function(v) {this.setActual('repeat', v, 'number', 1);},
    
    set_reverse: function(v) {
        if (this.setActual('reverse', v, 'boolean', false)) {
            if (!this.running) this.__reset();
        }
    },
    
    set_running: function(v) {
        if (this.setActual('running', v, 'boolean', false)) {
            if (!this.paused) {
                if (v) {
                    this.attachTo(dr.global.idle, '__update', 'onidle');
                } else {
                    if (this.__temporaryFrom) this.from = undefined;
                    this.__reset();
                    this.detachFrom(dr.global.idle, '__update', 'onidle');
                }
            }
        }
    },
    
    set_paused: function(v) {
        if (this.setActual('paused', v, 'boolean', false)) {
            if (this.running) {
                if (v) {
                    this.detachFrom(dr.global.idle, '__update', 'onidle');
                } else {
                    this.attachTo(dr.global.idle, '__update', 'onidle');
                }
            }
        }
    },
    
    set_callback: function(v) {this.setSimpleActual('callback', v);},
    
    
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
            this.set_callback(function(success) {
                existingCallback.call(anim, success);
                callback.call(anim, success);
            });
        } else {
            this.set_callback(callback);
        }
    },
    
    /** Puts the animator back to an initial configured state.
        @param executeCallback:boolean (optional) if true the callback, if
            it exists, will be executed.
        @returns void */
    reset: function(executeCallback) {
        this.__reset();
        
        this.set_running(false);
        this.set_paused(false);
        
        if (executeCallback && this.callback) this.callback.call(this, false);
    },
    
    /** @overrides dr.Reusable */
    clean: function() {
        this.to = this.from = this.attribute = this.callback = undefined;
        this.duration = 1000;
        this.relative = this.reverse = false;
        this.repeat = 1;
        this.easingfunction = dr.Animator.DEFAULT_EASING_FUNCTION;
        
        this.reset(false);
    },
    
    /** @private */
    __reset: function() {
        this.__temporaryFrom = false;
        this.__loopCount = this.reverse ? this.repeat - 1 : 0;
        this.__progress = this.reverse ? this.duration : 0;
    },
    
    /** @private */
    __update: function(onidleEvent) {
        this.__advance(onidleEvent.value.delta);
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
                    newValue = this.easingfunction(this.__progress, attrDiff, duration);
                if (this.relative) {
                    // Need to calculate old value since it's possible for
                    // multiple animators to be animating the same attribute
                    // at one time.
                    var oldValue = this.easingfunction(oldProgress, attrDiff, duration),
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
                    this.set_running(false);
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
                this.set_running(false);
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
dr.Animator.easingFunctions = {
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
        return c - dr.Animator.easingFunctions.easeOutBounce(d-t, c, d);
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
        if (t < d/2) return dr.Animator.easingFunctions.easeInBounce(t*2, c, d) * .5;
        return dr.Animator.easingFunctions.easeOutBounce(t*2-d, c, d) * .5 + c*.5;
    }
};

/** Setup the default easing function. */
dr.Animator.DEFAULT_EASING_FUNCTION = dr.Animator.easingFunctions.easeInOutQuad;


/** Adds the capability for an dr.View to be "activated". A doActivated method
    is added that gets called when the view is "activated". */
dr.Activateable = new JS.Module('Activateable', {
    // Methods /////////////////////////////////////////////////////////////////
    /** Called when this view should be activated.
        @returns void */
    doActivated: function() {
        this.fireNewEvent('activated', true);
    }
});


/** Adds an udpateUI method that should be called to update the UI. Various
    mixins will rely on the updateUI method to trigger visual updates.
    
    Events:
        None
    
    Attributes:
        None
*/
dr.UpdateableUI = new JS.Module('UpdateableUI', {
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


/** Adds the capability to be "disabled" to an dr.Node. When an dr.Node is 
    disabled the user should typically not be able to interact with it.
    
    When disabled becomes true an attempt will be made to give away the focus
    using dr.FocusObservable's giveAwayFocus method.
    
    Events:
        disabled:boolean Fired when the disabled attribute is modified
            via set_disabled.
    
    Attributes:
        disabled:boolean Indicates that this component is disabled.
*/
dr.Disableable = new JS.Module('Disableable', {
    // Life Cycle //////////////////////////////////////////////////////////////
    /** @overrides */
    initNode: function(parent, attrs) {
        if (attrs.disabled === undefined) attrs.disabled = false;
        
        this.callSuper(parent, attrs);
    },
    
    
    // Accessors ///////////////////////////////////////////////////////////////
    set_disabled: function(v) {
        if (this.setActual('disabled', v, 'boolean', false)) this.doDisabled();
    },
    
    
    // Methods /////////////////////////////////////////////////////////////////
    /** Called after the disabled attribute is set. Default behavior attempts
        to give away focus and calls the updateUI method of dr.UpdateableUI if 
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


/** Provides a 'mouseover' attribute that tracks mouse over/out state. Also
    provides a mechanism to smoothe over/out events so only one call to
    'doSmoothMouseOver' occurs per onidle event.
    
    Requires dr.Disableable and dr.MouseObservable callSuper mixins.
    
    Events:
        None
    
    Attributes:
        mouseover:boolean Indicates if the mouse is over this view or not.
    
    Private Attributes:
        __attachedToOverIdle:boolean Used by the code that smoothes out
            mouseover events. Indicates that we are registered with the
            onidle event.
        __lastOverIdleValue:boolean Used by the code that smoothes out
            mouseover events. Stores the last mouseover value.
*/
dr.MouseOver = new JS.Module('MouseOver', {
    // Life Cycle //////////////////////////////////////////////////////////////
    /** @overrides */
    initNode: function(parent, attrs) {
        if (attrs.mouseover === undefined) attrs.mouseover = false;
        
        this.callSuper(parent, attrs);
        
        this.attachToPlatform(this, 'doMouseOver', 'mouseover');
        this.attachToPlatform(this, 'doMouseOut', 'mouseout');
    },
    
    
    // Accessors ///////////////////////////////////////////////////////////////
    set_mouseover: function(v) {
        if (this.setActual('mouseover', v, 'boolean', false)) {
            // Smooth over/out events by delaying until the next onidle event.
            if (this.inited && !this.__attachedToOverIdle) {
                this.__attachedToOverIdle = true;
                this.attachTo(dr.global.idle, '__doMouseOverOnIdle', 'onidle');
            }
        }
    },
    
    /** @overrides dr.Disableable */
    set_disabled: function(v) {
        // When about to disable make sure mouseover is not true. This 
        // helps prevent unwanted behavior of a disabled view.
        if (v && this.mouseover) this.set_mouseover(false);
        
        this.callSuper(v);
    },
    
    
    // Methods /////////////////////////////////////////////////////////////////
    /** @private */
    __doMouseOverOnIdle: function() {
        this.detachFrom(dr.global.idle, '__doMouseOverOnIdle', 'onidle');
        this.__attachedToOverIdle = false;
        
        // Only call doSmoothOver if the over/out state has changed since the
        // last time it was called.
        var isOver = this.mouseover;
        if (this.__lastOverIdleValue !== isOver) {
            this.__lastOverIdleValue = isOver;
            this.doSmoothMouseOver(isOver);
        }
    },
    
    /** Called when mouseover state changes. This method is called after
        an event filtering process has reduced frequent over/out events
        originating from the dom.
        @returns void */
    doSmoothMouseOver: function(isOver) {
        if (this.inited && this.updateUI) this.updateUI();
    },
    
    /** Called when the mouse is over this view. Subclasses must call callSuper.
        @returns void */
    doMouseOver: function(event) {
        if (!this.disabled) this.set_mouseover(true);
    },
    
    /** Called when the mouse leaves this view. Subclasses must call callSuper.
        @returns void */
    doMouseOut: function(event) {
        if (!this.disabled) this.set_mouseover(false);
    }
});


/** Provides an interface to platform specific global mouse functionality. */
dr.sprite.GlobalMouse = new JS.Class('sprite.GlobalMouse', {
    include: [
        dr.sprite.PlatformObservable,
        dr.sprite.MouseObservable
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
    viewport. Registered with dr.global as 'mouse'. */
new JS.Singleton('GlobalMouse', {
    include: [
        dr.SpriteBacked,
        dr.Observable
    ],
    
    
    // Constructor /////////////////////////////////////////////////////////////
    initialize: function() {
        this.set_sprite(this.createSprite());
        
        // Store in dr namespace for backwards compatibility with dreem
        if (dr.mouse) {
            dr.dumpStack('dr.mouse already set.');
        } else {
            dr.mouse = this;
        }
        
        dr.global.register('mouse', this);
    },
    
    createSprite: function(attrs) {
        return new dr.sprite.GlobalMouse(this);
    }
});


/** Provides a 'mousedown' attribute that tracks mouse up/down state.
    
    Requires: dr.MouseOver, dr.Disableable, dr.MouseObservable super mixins.
    
    Suggested: dr.UpdateableUI and dr.Activateable callSuper mixins.
    
    Events:
        None
    
    Attributes:
        mousedown:boolean Indicates if the mouse is down or not.
*/
dr.MouseDown = new JS.Module('MouseDown', {
    // Life Cycle //////////////////////////////////////////////////////////////
    /** @overrides */
    initNode: function(parent, attrs) {
        if (attrs.mousedown === undefined) attrs.mousedown = false;
        
        this.callSuper(parent, attrs);
        
        this.attachToPlatform(this, 'doMouseDown', 'mousedown');
        this.attachToPlatform(this, 'doMouseUp', 'mouseup');
    },
    
    
    // Accessors ///////////////////////////////////////////////////////////////
    set_mousedown: function(v) {
        if (this.setActual('mousedown', v, 'boolean', false)) {
            if (this.inited) {
                if (this.mousedown) this.focus(true);
                if (this.updateUI) this.updateUI();
            }
        }
    },
    
    /** @overrides dr.Disableable */
    set_disabled: function(v) {
        // When about to disable the view make sure mousedown is not true. This 
        // helps prevent unwanted activation of a disabled view.
        if (v && this.mousedown) this.set_mousedown(false);
        
        this.callSuper(v);
    },
    
    
    // Methods /////////////////////////////////////////////////////////////////
    /** @overrides dr.MouseOver */
    doMouseOver: function(event) {
        this.callSuper(event);
        if (this.mousedown) this.detachFromPlatform(dr.global.mouse, 'doMouseUp', 'mouseup', true);
    },
    
    /** @overrides dr.MouseOver */
    doMouseOut: function(event) {
        this.callSuper(event);
        
        // Wait for a mouse up anywhere if the user moves the mouse out of the
        // view while the mouse is still down. This allows the user to move
        // the mouse in and out of the view with the view still behaving 
        // as moused down.
        if (!this.disabled && this.mousedown) this.attachToPlatform(dr.global.mouse, 'doMouseUp', 'mouseup', true);
    },
    
    /** Called when the mouse is down on this view. Subclasses must call callSuper.
        @returns void */
    doMouseDown: function(event) {
        if (!this.disabled) this.set_mousedown(true);
    },
    
    /** Called when the mouse is up on this view. Subclasses must call callSuper.
        @returns void */
    doMouseUp: function(event) {
        // Cleanup global mouse listener since the mouseUp occurred outside
        // the view.
        if (!this.mouseover) this.detachFromPlatform(dr.global.mouse, 'doMouseUp', 'mouseup', true);
        
        if (!this.disabled && this.mousedown) {
            this.set_mousedown(false);
            
            // Only do mouseUpInside if the mouse is actually over the view.
            // This means the user can mouse down on a view, move the mouse
            // out and then mouse up and not "activate" the view.
            if (this.mouseover) this.doMouseUpInside(event);
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
dr.MouseOverAndDown = new JS.Module('MouseOverAndDown', {
    include: [dr.MouseOver, dr.MouseDown]
});


/** Provides an interface to platform specific global keyboard functionality. */
dr.sprite.GlobalKeys = new JS.Class('sprite.GlobalKeys', {
    include: [
        dr.sprite.PlatformObservable,
        dr.sprite.KeyObservable
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
        var isFirefox = dr.sprite.platform.browser === 'Firefox';
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
        return dr.sprite.platform.os === 'Mac' ? this.isCommandKeyDown() : this.isControlKeyDown();
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
            var prevFocused = dr.sprite.focus.prevFocusedView;
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
        var keyCode = dr.sprite.KeyObservable.getKeyCodeFromEvent(event),
            platformEvent = event.value;
        if (this.__shouldPreventDefault(keyCode, platformEvent.target)) dr.sprite.preventDefault(platformEvent);
        
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
                var ift = this.view.ignoreFocusTrap(), gf = dr.global.focus;
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
        var keyCode = dr.sprite.KeyObservable.getKeyCodeFromEvent(event);
        this.view.fireNewEvent('keypress', keyCode);
    },
    
    /** @private */
    __handleKeyUp: function(event) {
        var keyCode = dr.sprite.KeyObservable.getKeyCodeFromEvent(event),
            platformEvent = event.value;
        if (this.__shouldPreventDefault(keyCode, platformEvent.target)) dr.sprite.preventDefault(platformEvent);
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


/** Provides global keyboard events. Registered with dr.global as 'keys'.
    
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
        dr.SpriteBacked,
        dr.PlatformObserver,
        dr.Observable,
        dr.Observer
    ],
    
    
    // Constructor /////////////////////////////////////////////////////////////
    initialize: function() {
        this.set_sprite(this.createSprite());
        
        this.attachTo(dr.global.focus, '__handleFocused', 'focused');
        
        this.sprite.__listenToDocument();
        
        // Store in dr namespace for backwards compatibility with dreem
        if (dr.keys) {
            dr.dumpStack('dr.keys already set.');
        } else {
            dr.keys = this;
        }
        
        dr.global.register('keys', this);
    },
    
    createSprite: function(attrs) {
        return new dr.sprite.GlobalKeys(this, attrs);
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
    
    Events:
        None
    
    Attributes:
        activationkeys:array of chars The keys that when keyed down will
            activate this component. Note: The value is not copied so
            modification of the array outside the scope of this object will
            effect behavior.
        activateKeyDown:number (read only) The keycode of the activation key that is
            currently down. This will be -1 when no key is down.
        repeatkeydown:boolean Indicates if doActivationKeyDown will be called
            for repeated keydown events or not. Defaults to false.
*/
dr.KeyActivation = new JS.Module('KeyActivation', {
    // Class Methods and Attributes ////////////////////////////////////////////
    extend: {
        /** The default activation keys are enter (13) and spacebar (32). */
        DEFAULT_ACTIVATION_KEYS: [13,32]
    },
    
    
    // Life Cycle //////////////////////////////////////////////////////////////
    /** @overrides */
    initNode: function(parent, attrs) {
        this.activateKeyDown = -1;
        
        if (attrs.activationkeys === undefined) {
            attrs.activationkeys = dr.KeyActivation.DEFAULT_ACTIVATION_KEYS;
        }
        
        this.callSuper(parent, attrs);
        
        this.attachToPlatform(this, '__handleKeyDown', 'keydown');
        this.attachToPlatform(this, '__handleKeyPress', 'keypress');
        this.attachToPlatform(this, '__handleKeyUp', 'keyup');
    },
    
    
    // Accessors ///////////////////////////////////////////////////////////////
    set_activationkeys: function(v) {this.setSimpleActual('activationkeys', v);},
    set_repeatkeydown: function(v) {this.setSimpleActual('repeatkeydown', v);},
    
    
    // Methods /////////////////////////////////////////////////////////////////
    /** @private */
    __handleKeyDown: function(event) {
        if (!this.disabled) {
            if (this.activateKeyDown === -1 || this.repeatkeydown) {
                var keyCode = dr.sprite.KeyObservable.getKeyCodeFromEvent(event),
                    keys = this.activationkeys, i = keys.length;
                while (i) {
                    if (keyCode === keys[--i]) {
                        if (this.activateKeyDown === keyCode) {
                            this.doActivationKeyDown(keyCode, true);
                        } else {
                            this.activateKeyDown = keyCode;
                            this.doActivationKeyDown(keyCode, false);
                        }
                        dr.sprite.preventDefault(event.value);
                        return;
                    }
                }
            }
        }
    },
    
    /** @private */
    __handleKeyPress: function(event) {
        if (!this.disabled) {
            var keyCode = dr.sprite.KeyObservable.getKeyCodeFromEvent(event);
            if (this.activateKeyDown === keyCode) {
                var keys = this.activationkeys, i = keys.length;
                while (i) {
                    if (keyCode === keys[--i]) {
                        dr.sprite.preventDefault(event.value);
                        return;
                    }
                }
            }
        }
    },
    
    /** @private */
    __handleKeyUp: function(event) {
        if (!this.disabled) {
            var keyCode = dr.sprite.KeyObservable.getKeyCodeFromEvent(event);
            if (this.activateKeyDown === keyCode) {
                var keys = this.activationkeys, i = keys.length;
                while (i) {
                    if (keyCode === keys[--i]) {
                        this.activateKeyDown = -1;
                        this.doActivationKeyUp(keyCode);
                        dr.sprite.preventDefault(event.value);
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


/** Provides button functionality to an dr.View. Most of the functionality 
    comes from the mixins included by this mixin. This mixin resolves issues 
    that arise when the various mixins are used together.
    
    By default dr.Button instances are focusable.
    
    Events:
        None
    
    Attributes:
        None
    
    Private Attributes:
        __restoreCursor:string The cursor to restore to when the button is
            no longer disabled.
*/
dr.Button = new JS.Module('Button', {
    include: [
        dr.Activateable, 
        dr.UpdateableUI, 
        dr.Disableable, 
        dr.MouseOverAndDown, 
        dr.KeyActivation
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
    /** @overrides dr.FocusObservable */
    set_focused: function(v) {
        var existing = this.focused;
        this.callSuper(v);
        if (this.inited && this.focused !== existing) this.updateUI();
    },
    
    
    // Methods /////////////////////////////////////////////////////////////////
    /** @overrides dr.KeyActivation. */
    doActivationKeyDown: function(key, isRepeat) {
        // Prevent unnecessary UI updates when the activation key is repeating.
        if (!isRepeat) this.updateUI();
    },
    
    /** @overrides dr.KeyActivation. */
    doActivationKeyUp: function(key) {
        this.callSuper(key);
        this.updateUI();
    },
    
    /** @overrides dr.KeyActivation. */
    doActivationKeyAborted: function(key) {
        this.callSuper(key);
        this.updateUI();
    },
    
    /** @overrides dr.UpdateableUI. */
    updateUI: function() {
        if (this.disabled) {
            // Remember the cursor to change back to, but don't re-remember
            // if we're already remembering one.
            if (this.__restoreCursor == null) this.__restoreCursor = this.cursor;
            this.set_cursor('not-allowed');
            this.drawDisabledState();
        } else {
            var rc = this.__restoreCursor;
            if (rc) {
                this.set_cursor(rc);
                this.__restoreCursor = null;
            }
            
            if (this.activateKeyDown !== -1 || this.mousedown) {
                this.drawActiveState();
            } else if (this.focused) {
                this.drawFocusedState();
            } else if (this.mouseover) {
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


/** Provides a dependency target that pulls in all of the dr package. */
dr.all = true;

