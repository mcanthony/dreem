/*
 The MIT License (MIT)

 Copyright ( c ) 2014-2015 Teem2 LLC

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in all
 copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 SOFTWARE.

Instantiates dreem classes from package JSON.
*/
define(function(require, exports){
  var dreemMaker = exports
  var domRunner = require('./domRunner.js')
  var dreemParser = require('./dreemParser.js')

  // require our external 'global' require things, these should be restructured to AMD
  require('$LIB_DIR/one_base.js')
  require('$LIB_DIR/jquery-1.9.1.js')
  require('/core/dist/layout.js')
  
  // Builtin modules, belongs here
  dreemMaker.builtin = {
    /* Built in tags that dont resolve to class files */
    // Classes
    node:true,
    view:true,
    layout:true,
    
    // Class Definition
    class:true,
    
    // Special child tags for a Class or Class instance
    method:true,
    attribute:true,
    handler:true,
    state:true,
    setter:true
  }

  dreemMaker.makeFromPackage = function(pkg) {
    // Compile methods
    var methods = [];
    try {
      new Function('methods', pkg.methods)(methods);
      pkg.compiledMethods = methods;
      pkg.methods = undefined // dont delete, set to undefined
    } catch(e) {
      domRunner.showErrors(new parser.Error('Exception in evaluating methods ' + e.message));
      return;
    }
    var dr = {}
    pkg.compiledClasses = {
      node: dr.node || function(){},
      view: dr.view || function(){},
      layout: dr.layout || function(){}
    };
    
    dreemMaker.walkDreemJSXML(pkg.root, pkg);
  };

  dreemMaker.walkDreemJSXML = function(node, pkg) {
    var tagName = node.tag,
      children = node.child;
    
    if (!tagName.startsWith('$')) {
      var klass = dreemMaker.lookupClass(tagName, pkg);
    } else {
      console.log("Unhandled tag: ", tagName);
    }
    
    if (children) {
      // keep loops like this, it is NOT faster to do otherwise
      // it confuses people that the for loop has no loop iterator or
      for (var i = 0, len = children.length; i < len; i++){
        dreemMaker.walkDreemJSXML(children[i], pkg)
      }
    }
  };
  
  dreemMaker.lookupClass = function(tagName, pkg) {
    var classTable = pkg.compiledClasses
    var compiledMethods = pkg.compiledMethods
    
    // First look for a compiled class
    if (tagName in classTable) return classTable[tagName];
    
    // Ignore built in tags
    if (tagName in dreemMaker.builtin) return null;
    
    // Try to build a class
    var klassjsxml = pkg.classes[tagName];
    if (!klassjsxml) throw new Error('Cannot find class ' + tagName);
    delete pkg.classes[tagName];

    // Determine base class
    var baseclass = classTable.view;
    if (klassjsxml.extends) { // we cant extend from more than one class
      baseclass = dreemMaker.lookupClass(klassjsxml.extends, pkg);
    }

    // Get Mixins
    var mixins = []
    var mixinNames = klassjsxml.with;
    if (mixinNames) {
      mixinNames.split(/,\s*/).forEach(
        function(mixinName) {
          mixins.push(dreemMaker.lookupClass(mixinName, pkg));
        }
      );
    }
    
    // Instantiate the Class
    // FIXME: need dreem class constructor that is dom independent
    function Klass(){};
    var proto = Klass.prototype = Object.create(baseclass.prototype)

    // Mix in the mixins
    // FIXME: dreem will do this in the constructor
    for (var i = 0; i < mixins.length; i++) {
      var mixin = mixins[i].prototype
      var keys = Object.keys(mixin)
      for (var j = 0; j < keys.length; j++) {
        var key = keys[j]
        proto[key] = mixin[key] // make fancier
      }
    }

    // set the tagname
    proto.tagname = klassjsxml.attr.name
    classTable[tagName] = Klass;

    // Process Children
    var children = klassjsxml.child;

    if (!children) return Klass

    for (var i = 0, len = children.length; i < len; i++) { 
      var childNode = children[i];
      var childTagName = childNode.tag;
      switch (childTagName) {
        case 'setter':
        case 'method':
          // FIXME: add method to class definition
          var methodId = childNode.method_id;
          if (methodId) {
            var compiledMethod = compiledMethods[methodId];
            if (compiledMethod) {
              proto[childNode.name] = compiledMethod;
            } else {
              throw new Error('Cannot find method id' + methodId);
            }
          }
          break;
        case 'handler':
          console.log('HANDLER', childNode.method_id, childNode);
          // FIXME: add handler to class definition
          break;
        case 'attribute':
          console.log('ATTRIBUTE', childNode);
          // FIXME: add attribute to class definition
          break;
        case 'state':
          console.log('STATE', childNode);
          // FIXME: add state to class definition
          break;
        case 'getter':
          // Not supported in dreem
          break;
        default:
          dreemMaker.walkDreemJSXML(childNode, pkg);
      }
    }
  
    // Store and return class
    return Klass
  }
})
