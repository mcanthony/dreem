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

Micro AMD module loader for browser and node.js
*/

if(typeof window !== 'undefined')(function(){ // browser implementation
  // if define was already defined use it as a config store
  var config_define = window.define

  // the main define function
  function define(factory){
    if(arguments.length == 2){ // precompiled version
      define.factory[factory] = arguments[1]
      return
    }
    define.last_factory = factory // store for the script tag
  }
    
  // default config variables
  define.ROOT = '/'
  define.CLASSES_DIR = '$ROOT/classes/'
  define.DREEM_MAKER = '$ROOT/rem/lib/dreemMaker.js'
  define.DREEM_ROOT = '$ROOT/'
  define.LIB_DIR = '$ROOT/lib/'

  // pulls the path out of a filename
  function filePath(file){
    if(!file) return ''
    file = file.replace(/\.\//g, '')
    var m = file.match(/([\s\S]*)\/[^\/]*$/)
    return m ? m[1] : ''
  }

  // cleans a path from double slashes
  function cleanPath(path){
    return path.replace(/^\/+/,'/').replace(/([^:])\/+/g,'$1/')
  }

  // makes relative paths absolute
  function absPath(base, relative){
    if(relative.charAt(0) != '.'){ // relative is already absolute
      var path = location.origin + (relative.charAt(0) == '/'? relative: '/' + relative) 
      return cleanPath(path)
    }
    base = base.split(/\//)
    relative = relative.replace(/\.\.\//g,function(){ base.pop(); return ''}).replace(/\.\//g, '')
    return cleanPath(base.join('/') + '/' + relative)
  }

  // copy configuration onto define
  if(typeof config_define == 'object') for(var key in config_define){
    define[key] = config_define[key]
  }

  // storage structures
  define.script_tags = {}
  define.module = {}
  define.factory = {}

  define.expandVariables = function(str){
    return cleanPath(str.replace(/\$([^\/$]*)/g, function(all, lut){
      if(!(lut in define)) throw new Error("Cannot find $" + lut + " used in require")
      return define.expandVariables(define[lut])
    }))
  }

  // the require function passed into the factory is local
  function localRequire(base_path){
    function require(dep_path){
      abs_path = absPath(base_path, define.expandVariables(dep_path))
      // lets look it up
      var module = define.module[abs_path]
      if(module) return module.exports

      // otherwise lets initialize the module
      var factory = define.factory[abs_path]
      module = {exports:{}}
      define.module[abs_path] = module

      if(factory === null) return null // its not an AMD module, but accept that
      if(!factory) throw new Error("Cannot find factory for module:" + abs_path)

      // call the factory
      factory(localRequire(filePath(abs_path)), module.exports, module)
      return module.exports
    }
    return require
  }
  
  var app_root = filePath(window.location.href)

  function startMain(){
    // lets find our main and execute the factory
    var main_mod = absPath(app_root, define.MAIN)
    var factory = define.factory[main_mod]
    if(!factory) throw new Error("Cannot find main: " + main_mod)

    // lets boot up
    factory(localRequire(filePath(main_mod)))
  }

  // the main dependency download queue counter
  var downloads = 0

  function insertScriptTag(script_url, from_file){
    var script = document.createElement('script')
    var base_path = filePath(script_url)

    script.type = 'text/javascript'
    script.src = script_url
    define.script_tags[script_url] = script
      
    downloads++
    function onLoad(){
      // pull out the last factor
      var factory = define.factory[script_url] = define.last_factory || null
      define.last_factory = undefined
      // parse the function for other requires
      if(factory) factory.toString().replace(/\/\*[\s\S]*?\*\//g,'').replace(/\/\/[^\n]/g,'').replace(/require\s*\(\s*["']([^"']+)["']\s*\)/g, function(m, path){
        // Make path absolute and process variables
        var dep_path = absPath(base_path, define.expandVariables(path))
        // automatic .js appending if not given
        if(dep_path.indexOf(".js") != dep_path.length -3) dep_path += '.js'
        // load it
        if(!define.script_tags[dep_path]) insertScriptTag(dep_path, script_url)
      })
      if(!--downloads) startMain() // no more deps
    }
    script.onerror = function(){ console.error("Error loading " + script.src + " from " + from_file) }
    script.onload = onLoad
    script.onreadystatechange = function(){
      if(s.readyState == 'loaded' || s.readyState == 'complete') onLoad()
    }
    document.getElementsByTagName('head')[0].appendChild(script)
  }

  // make it available globally
  window.define = define

  // boot up using the MAIN property
  if(define.MAIN){
    insertScriptTag(absPath(app_root, define.expandVariables(define.MAIN)), window.location.href)
  }
})()
else (function(){ // nodeJS implementation


})()