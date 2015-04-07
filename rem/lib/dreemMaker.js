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
(function(scope){
  var maker = {},
    parser = scope.PARSER;
  
  /**
   * Example traversal of package datastructure
   * Build a dreem class from the XML structure and the methods
   */
  function Builtin_placeholder(){}
  function Baseclass_placeholder(){
    // FIXME: Should return View since that is the default baseclass when no
    // extends is defined.
  }

  maker.walkDreemJSXML = function(node, indent){
    if(!indent) indent = ''
    if(node.tag.indexOf('$') == -1) console.log(indent + '<' + node.tag + '>')
    if(node.child)for(var i =0;i<node.child.length;i++){
      maker.walkDreemJSXML(node.child[i], indent + '  ')
    }
  }

  maker.buildDreemClass = function(table, name, classjsxml, methods){
    if(name in parser.Compiler.prototype.builtin){
      // we have to return a builtin class...
      return Builtin_placeholder
    }

    if(table[name]) return table[name]

    // a new DreemClass
    function Class(){}

    var baseclass = Baseclass_placeholder // base class
    var jsxml = classjsxml[name]

    if(!jsxml) throw new Error('Cannot find class '+name)

    // the mixins
    var mixins = []

    // the baseclasses?
    if(jsxml.extends){ // we cant extend from more than one class
      // FIXME: should look for "with" for mixins.
      jsxml.extends.split(/,\s*/).forEach(function(cls, i){
        // WARNIGN we cant inherit from more than one class
        // so we inherit from the first one and add the second one as a mixin
        // this is pretty bad actually, shouldnt do multiple inheritance
        // only one baseclass and mixins
        // the buildDreemClass is recursive so definition order doesnt matter
        if(i == 0) baseclass = maker.buildDreemClass(table, cls, classjsxml, methods)
        else mixins.push(maker.buildDreemClass(table, cls, classjsxml, methods))
      })
    }

    if(jsxml.with){
      jsxml.with.split(/,\s*/).forEach(function(cls){
        mixins.push(maker.buildDreemClass(table, cls, classjsxml, methods))
      })
    }

    var proto = Class.prototype = Object.create(baseclass.prototype)

    for(var i = 0;i<mixins.length; i++){
      var mixin = mixins[i].prototype
      var keys = Object.keys(mixin)
      for(var j = 0;j<keys.length;j++){
        var key = keys[j]
        proto[key] = mixin[key] // make fancier
      }
    }

    // set the tagname
    proto.tagname = jsxml.name

    // process methods
    var children = jsxml.child
    if(children) for(var i = 0;i<children.length;i++){
      var child = children[i]
      var method
      if(child.method_id !== undefined){ // we have a methodID, look it up
        method = methods[child.method_id]
        if(!method) throw new Error('Cannot find method id' + child.method_id)
      }
      if(child.tag == 'method'){
        proto[child.name] = method
      }
      else if(child.tag == 'handler'){
        // make handler, no idea how to do that
      }
      else if(child.tag == 'getter'){
        proto.__defineGetter__(child.name, method)
      }
      else if(child.tag == 'setter'){
        proto.__defineSetter__(child.name, method)
      }
    }

    // store class
    return table[name] = Class
  }
  
  scope.MAKER = maker;
})(this.DREEM)