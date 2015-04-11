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
  var maker = exports;
  var domRunner = require('./domRunner.js');
  var dreemParser = require('./dreemParser.js');

  require('$ROOT/rem/tym/dist/tym.js');

  // Builtin modules, belongs here
  maker.builtin = {
    /* Built in tags that dont resolve to class files */
    // Classes
    node:true,
    view:true,
    layout:true,
    Button:true,
    
    // Class Definition
    class:true,
    mixin:true,
    
    // Special child tags for a Class or Class instance
    method:true,
    attribute:true,
    handler:true,
    state:true,
    setter:true
  }

  maker.makeFromPackage = function(pkg) {
    // Compile methods
    var methods = [];
    try {
      // Transform this["super"]( into this.callSuper(
      pkg.methods = pkg.methods.split('this["super"](').join('this.callSuper(');
      
      new Function('methods', pkg.methods)(methods);
      pkg.compiledMethods = methods;
      delete pkg.methods;
    } catch(e) {
      domRunner.showErrors(new parser.Error('Exception in evaluating methods ' + e.message));
      return;
    }
    
    pkg.compiledClasses = {
      node:tym.Node,
      view:tym.View,
      layout:tym.Layout,
      Button:tym.Button
    };
    
    // Make pkg available to tym
    tym.maker = maker;
    tym.pkg = pkg;
    
    maker.walkDreemJSXML(pkg.root.child[0], null, pkg);
  };

  maker.walkDreemJSXML = function(node, parentInstance, pkg) {
    var compiledMethods = pkg.compiledMethods,
      tagName = node.tag,
      children = node.child;
    
    var klass;
    if (tagName.startsWith('$')) {
      if (tagName === '$comment') {
        // Ignore comments
        return;
      } else if (tagName === '$text') {
        console.log('Body Text: ', node.value);
        return;
      } else {
        console.log("Unexpected tag: ", tagName);
        return;
      }
    } else {
      klass = maker.lookupClass(tagName, pkg);
    }
    
    // Instantiate
    var attrs = node.attr || {},
      mixins = [],
      instanceMixin = {},
      instanceChildrenJson,
      instanceHandlers;
    
    // Get Mixins
    var mixinNames = attrs.with;
    delete attrs.with;
    if (mixinNames) {
      mixinNames.split(/,\s*/).forEach(
        function(mixinName) {
          mixins.push(maker.lookupClass(mixinName, pkg));
        }
      );
    }
    
    var i, len, childNode, childTagName;
    if (children) {
      i = 0;
      len = children.length;
      for (; len > i;) {
        childNode = children[i++];
        childTagName = childNode.tag;
        switch (childTagName) {
          case 'setter':
          case 'method':
            var methodId = childNode.method_id;
            if (methodId != null) {
              var compiledMethod = compiledMethods[methodId];
              if (compiledMethod) {
                instanceMixin[childNode.name] = compiledMethod;
              } else {
                throw new Error('Cannot find method id' + methodId);
              }
            }
            break;
          case 'handler':
            if (!instanceHandlers) attrs._instanceHandlers = instanceHandlers = [];
            var methodId = childNode.method_id;
            if (methodId != null) {
              var compiledMethod = compiledMethods[methodId];
              if (compiledMethod) {
                var methodName = '__handler_' + methodId;
                instanceMixin[methodName] = compiledMethod;
                instanceHandlers.push({name:methodName, event:childNode.attr.event, reference:childNode.attr.reference});
              } else {
                throw new Error('Cannot find method id' + methodId);
              }
            }
            break;
          case 'attribute':
            console.log('TYM ATTRIBUTE', childNode);
            // FIXME: add attribute to instance definition
            break;
          case 'state':
            console.log('TYM STATE', childNode);
            // FIXME: add state to instance definition
            break;
          default:
            if (!instanceChildrenJson) attrs._instanceChildrenJson = instanceChildrenJson = [];
            instanceChildrenJson.push(childNode);
        }
      }
    }
    
    // Build default attributes
    var combinedAttrs = {};
    len = mixins.length;
    if (len > 0) {
      i = 0;
      for (; len > i;) {
        tym.extend(combinedAttrs, mixins[i++].defaultAttrValues);
      }
    }
    tym.extend(combinedAttrs, attrs);
    
    mixins.push(instanceMixin);
    if (!parentInstance) mixins.push(tym.SizeToViewport); // Root View case
    
    new klass(parentInstance, combinedAttrs, mixins);
  };
  
  maker.lookupClass = function(tagName, pkg) {
    var classTable = pkg.compiledClasses,
      compiledMethods = pkg.compiledMethods;
    
    // First look for a compiled class
    if (tagName in classTable) return classTable[tagName];
    
    // Ignore built in tags
    if (tagName in maker.builtin) return null;
    
    
    // Try to build a class
    var klassjsxml = pkg.classes[tagName];
    if (!klassjsxml) throw new Error('Cannot find class ' + tagName);
    delete pkg.classes[tagName];
    
    var isMixin = klassjsxml.tag === 'mixin';
    var klassAttrs = klassjsxml.attr || {};
    
    // Determine base class
    var baseclass, extendsAttr;
    if (!isMixin) {
      baseclass = classTable.view;
      extendsAttr = klassAttrs.extends;
      delete klassAttrs.extends;
      if (extendsAttr) baseclass = maker.lookupClass(extendsAttr, pkg);
    }

    // Get Mixins
    var mixins = [],
      mixinNames = klassAttrs.with;
    delete klassAttrs.with;
    if (mixinNames) {
      mixinNames.split(/,\s*/).forEach(
        function(mixinName) {
          mixins.push(maker.lookupClass(mixinName, pkg));
        }
      );
    }
    
    // Process Children
    var children = klassjsxml.child,
      klassBody = {},
      klassChildrenJson,
      klassHandlers,
      i, len, childNode, childTagName;
    if (children) {
      i = 0;
      len = children.length;
      for (; len > i;) {
        childNode = children[i++];
        childTagName = childNode.tag;
        switch (childTagName) {
          case 'setter':
          case 'method':
            var methodId = childNode.method_id;
            if (methodId != null) {
              var compiledMethod = compiledMethods[methodId];
              if (compiledMethod) {
                klassBody[childNode.name] = compiledMethod;
              } else {
                throw new Error('Cannot find method id' + methodId);
              }
            }
            break;
          case 'handler':
            if (!klassHandlers) klassHandlers = [];
            var methodId = childNode.method_id;
            if (methodId != null) {
              var compiledMethod = compiledMethods[methodId];
              if (compiledMethod) {
                var methodName = '__handler_' + methodId;
                klassBody[methodName] = compiledMethod;
                klassHandlers.push({name:methodName, event:childNode.attr.event, reference:childNode.attr.reference});
              } else {
                throw new Error('Cannot find method id' + methodId);
              }
            }
            break;
          case 'attribute':
            console.log('TYM ATTRIBUTE', childNode);
            // FIXME: add attribute to class definition
            break;
          case 'state':
            console.log('TYM STATE', childNode);
            // FIXME: add state to class definition
            break;
          default:
            if (!klassChildrenJson) klassChildrenJson = [];
            klassChildrenJson.push(childNode);
        }
      }
    }
    
    // Setup __makeChildren method if klassChildren exist
    if (klassChildrenJson) {
      klassBody.__makeChildren = new Function('tym.makeChildren(this, ' + JSON.stringify(klassChildrenJson) + '); this.callSuper();');
    }
    
    // Setup __registerHandlers method if klassHandlers exist
    if (klassHandlers) {
      klassBody.__registerHandlers = new Function('tym.registerHandlers(this, ' + JSON.stringify(klassHandlers) + '); this.callSuper();');
    }
    
    // Instantiate the Class
    if (mixins.length > 0) klassBody.include = mixins;
    var Klass;
    if (isMixin) {
      Klass = tym[tagName] = new JS.Module(tagName, klassBody);
    } else {
      Klass = tym[tagName] = new JS.Class(tagName, baseclass, klassBody);
    }
    
    // Build default class attributes
    var defaultAttrValues = {};
    if (!isMixin && baseclass.defaultAttrValues) tym.extend(defaultAttrValues, baseclass.defaultAttrValues);
    len = mixins.length;
    if (len > 0) {
      i = 0;
      for (; len > i;) {
        tym.extend(defaultAttrValues, mixins[i++].defaultAttrValues);
      }
    }
    tym.extend(defaultAttrValues, klassAttrs);
    delete defaultAttrValues.name;
    delete defaultAttrValues.id;
    Klass.defaultAttrValues = defaultAttrValues;
    
    // Store and return class
    return classTable[tagName] = Klass;
  }
})

/*
TODO:
  - Setter return values and default behavior
  - Declared Attributes
  - Constraints
*/