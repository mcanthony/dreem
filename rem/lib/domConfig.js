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

Sets up default configuration for the in browser invocation of dreem.
*/
(function(scope){
  // Look for config information in the enclosing scope, otherwise use a 
  // default values.
  var config = scope.CONFIG,
    root = scope.DREEM_ROOT ? scope.DREEM_ROOT : '../../';
  if (!config) {
    config = {
      /* Default library directory prefix */
      LIB_DIR:scope.LIB_DIR ? scope.LIB_DIR : root + 'lib/',
      
      /* Default class directory prefix */
      CLASSES_DIR:scope.CLASSES_DIR ? scope.CLASSES_DIR : root + 'classes/',
      
      CLASS_FILE_EXTENSION:scope.CLASS_FILE_EXTENSION ? scope.CLASS_FILE_EXTENSION : 'dre'
    };
  }
  
  // Clean out scope since everything will live inside scope.DREEM
  delete scope.CONFIG;
  delete scope.DREEM_ROOT;
  
  scope.DREEM = {
    ROOT:root,
    CONFIG:config
  };
})(this)