var fs = require('fs');

var timeout = 60;
var filter = undefined
var path = "/smoke/";
var exitCode = 0;

var system = require('system');
var args = system.args;

if (args[1]) {
  if(parseInt(args[1]) == args[1])
    timeout = parseInt(args[1]);
  else
    filter = args[1]
}

var list = fs.list("." + path);
var files = [];
for(var i = 0; i < list.length; i++){
  var file = list[i]
  if (file.indexOf('.html') > 0) {
    files.unshift(file);
  }
}

var runTest = function (file, callback) {
  var out = [];
  var errors = [];

  var tId;
  var processOutput = function() {

    // Below shouldn't have to duplicate this code, but can't find a way to use or pass phantom.version.major
    // in/into the 'evaluateJavaScript' without it blowing up (even building a string beforehand), but it works fine like this.
    // This maybe a bug in phantomjs, or maybe I'm dumb, but either way, if this can be cleaned up in the future, pls do.
    var jsfunction;
    if (phantom.version.major == 1) {
      jsfunction = function () {
        var retarry = [];
        $('expectedoutput[excludever!="1"]').contents().filter(function(){
          return this.nodeType == 8;
        }).each(function(i, e) { retarry.push($.trim(e.nodeValue)) });
        return retarry;
      };
    } else {
      jsfunction = function () {
        var retarry = [];
        $('expectedoutput[excludever!="2"]').contents().filter(function(){
          return this.nodeType == 8;
        }).each(function(i, e) { retarry.push($.trim(e.nodeValue)) });
        return retarry;
      };
    }
    // (once we move completely to phantomjs2.0, the above can be removed and replaced with a single function
    // checking expectedoutput without the excludever clause)

    var expectedarry = page.evaluateJavaScript(jsfunction);

    var gotoutput = out.join("\n")
    var expectedoutput = expectedarry.join("\n")
    if (gotoutput !== expectedoutput) {
      console.log('ERROR: unexpected output:');
      console.log('+++expected++++++++++++++++++++++++++++++++');
      console.log(expectedoutput)
      console.log('---actual----------------------------------');
      console.log(gotoutput)
      console.log('===========================================');
      console.log("\n")
    }
    if (errors.length > 0 && (gotoutput !== expectedoutput || expectedarry.length == 0)) {
      console.error(errors.join("\n"))
    }

    page.close();
    callback();
  }
  var updateTimer = function(ms) {
    if (ms == null) {
      var pageTimeout = page.evaluateJavaScript(function () {
        return $('testingtimer').contents()[0];
      });
      ms = pageTimeout == null ? timeout : Number(pageTimeout.nodeValue);
    }
    if (tId) clearTimeout(tId);
    tId = setTimeout(processOutput, ms);
  }
  var page = require('webpage').create();
  page.onError = function(msg, trace) {
    var msgStack = ['ERROR: ' + msg];
    if (trace && trace.length) {
      msgStack.push('TRACE:');
      trace.forEach(function(t) {
        msgStack.push(' -> ' + (t.file || t.sourceURL) + ': ' + t.line + (t.function ? ' (in function ' + t.function +')' : ''));
      });
    }
    out.push(msg)
    errors.push(msgStack.join('\n'))
    updateTimer(0);
    exitCode = 1;
  };
  page.onInitialized = function () {
    // this is executed 'after the web page is created but before a URL is loaded.
    // The callback may be used to change global objects.' ... according to the docs
    page.evaluate(function () {
      window.addEventListener('dreeminit', function (e) { console.log('~~DONE~~') }, false);
    });
    // add missing methods to phantom, specifically Function.bind(). See https://github.com/ariya/phantomjs/issues/10522
    page.injectJs('./lib/es5-shim.min.js');
  };
  page.onResourceError = function(resourceError) {
    var err = 'RESOURCE ERROR: ' + resourceError.errorString + ', URL: ' + resourceError.url + ', File: ' + file;
    errors.push(err)
    out.push(err)
    updateTimer(0);
  };
  page.onConsoleMessage = function(msg, lineNum, sourceId) {
    if (msg === '~~DONE~~') {
      updateTimer();
      return;
    }
    out.push(msg)
  };
  page.open('http://127.0.0.1:8080' + path + file + '?test');
}

var loadNext = function() {
  var file = files.pop();
  if (file) {
    if(filter !== undefined){
      if(file.indexOf(filter) !== -1){
        console.log("FILTERED TEST: ", file)
        runTest(file, loadNext);
      }
      else loadNext()
    }
    else{
      console.log("RUNNING TEST: ", file)
      runTest(file, loadNext);
    }
  } else {
    phantom.exit(exitCode);
  }
}

loadNext();
