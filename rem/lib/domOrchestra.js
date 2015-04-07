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
  delete scope.DREEM_ROOT;
  
  if (config) {
    delete scope.CONFIG;
  } else {
    config = {
      /* Default pipeline library directory prefix */
      LIB_PIPELINE:root + 'rem/lib/',
      
      /* Default library directory prefix */
      LIB_DIR:root + 'lib/',
      
      /* Default class directory prefix */
      CLASSES_DIR:root + 'classes/',
      
      /* The core framework to use. */
      MAKER_FRAMEWORK:'dreem',
      
      /* The file extension for class files to load. */
      CLASS_FILE_EXTENSION:'dre'
    };
    
    // Apply specific overrides to the default config
    for (var key in config) {
      if (scope[key]) {
        config[key] = scope[key];
        delete scope[key];
      }
    }
  }
  
  scope.DREEM = {
    ROOT:root,
    CONFIG:config
  };
  
  // Write out script includes
  var pipelineIncludes = ['dreemBus.js','dreemParser.js', config.MAKER_FRAMEWORK + 'Maker.js','domRunner.js'],
    libPipeline = config.LIB_PIPELINE,
    i = 0, len = pipelineIncludes.length;
  for (; len > i;) document.write('<script src="' + libPipeline + pipelineIncludes[i++] + '"></'+'script>');
})(this)