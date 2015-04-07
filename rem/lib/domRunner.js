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
 
Orchestrates the overall process of parsing, instantiating and running a
dreem application.
*/
(function(scope){
  var runner = {},
    parser = scope.PARSER,
    maker = scope.MAKER,
    bus = scope.BUS,
    conf = scope.CONFIG;
  
  function showErrors(error){
    if(!error) return
    if(!Array.isArray(error)) error = [error]
    error.forEach(function(err){
      console.error(err.toString())
    })
    // send all errors to the server so it can open them in the editor
    runner.busClient.send({
      type:'error',
      errors:error
    })
  }

  // Browser side usage of Compiler
  function compile(dreemhtml, callback){
    var compiler = new parser.Compiler()

    compiler.onRead = function(file, callback){
      // ourself is read from the html we pass in
      if(file === location.pathname) return callback(null, dreemhtml, file)

      // If no file extension use the default file extension
      var parts = file.split('/'), lastPart = parts[parts.length - 1];
      if(lastPart.indexOf('.') === -1) file += '.' + conf.CLASS_FILE_EXTENSION

      // load JS via script tag, just cause its cleaner in a browser.
      if(file.indexOf('.js') === file.length-3){
        var script = document.createElement('script')
        script.src = file
        script.onload = function(){
          callback(null, '', file) // just return empty string
        }
        script.onerror = function(e){
          callback(new parser.Error('File not found '+file))
        }
        document.head.appendChild(script)
        return
      }
      // otherwise we XHR
      var xhr = new XMLHttpRequest()
      xhr.open("GET", file, true)
      xhr.onreadystatechange = function(){
        if(xhr.readyState == 4){
          if(xhr.status != 200) return callback(new parser.Error('Error loading file ' + file + ' return ' + xhr.status))
          return callback(null, xhr.responseText, file)
        }
      }
      xhr.send()
    }

    compiler.execute(location.pathname,function(error, pkg){
      if(error) return showErrors(error)
      callback(error, pkg)
    })
  }

  // Our always available websocket connection to the server
  runner.busClient = new bus.Client(location.href)

  // receive server messages, such as file changes
  runner.busClient.onMessage = function(message){
    if(message.type == 'filechange'){
      location.href = location.href // reload on filechange
    } else if(message.type == 'close'){
      window.close() // close the window
    } else if(message.type == 'delay'){ // a delay refresh message
      console.log('Got delay refresh from server!')
      setTimeout(function(){
        location.href = location.href
      },1500)
    }
  }

  // Only start processing dreem tags when the document is ready
  document.onreadystatechange = function () {
    if (document.readyState == "complete") {
      // find the first view tag
      var views = document.getElementsByTagName('view')
      if(!views || views.length == 0) return console.log('No views to process!')
      
      // lets pass our innerHtml to our compiler
      compile(views[0].innerHTML, function(error, pkg){
        if (error) return
        
        // ok so we have a dreem pkg file
        console.log('This is the dreem package:', pkg)
        
        // lets first make our methods
        try{
          var methods = []
          new Function('methods', pkg.methods)(methods)
        }
        catch(e){
          showErrors(new parser.Error('Exception in evaluating methods ' + e.message))
          return
        }
        
        // alright lets build all our dreemclasses
        var classtable = {}
        
        // build up all the dreem classes
        for(var cls in pkg.classes){
          maker.buildDreemClass(classtable, cls, pkg.classes, methods)
        }
        console.log('Built class table:', classtable)
        
        // just walk the root dreem code
        // replace this with instancing and such
        console.log('This is the root datastructure')
        maker.walkDreemJSXML(pkg.root)
      })
    }
  }
  
  scope.RUNNER = runner;
})(this.DREEM)