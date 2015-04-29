Ext.data.JsonP.startingwithdreem({"guide":"<h1 id='startingwithdreem-section-starting-out-with-dreem-%28using-windows%29'>Starting out with Dreem (using windows)</h1>\n<div class='toc'>\n<p><strong>Contents</strong></p>\n<ol>\n<li><a href='#!/guide/startingwithdreem-section-downloading-and-installing'>Downloading and installing</a></li>\n<li><a href='#!/guide/startingwithdreem-section-building-a-thing-with-dreem'>Building a thing with Dreem</a></li>\n<li><a href='#!/guide/startingwithdreem-section-general-observations'>General observations</a></li>\n<li><a href='#!/guide/startingwithdreem-section-open-questions%2Fmissing-parts'>Open questions/missing parts</a></li>\n</ol>\n</div>\n\n<h2 id='startingwithdreem-section-downloading-and-installing'>Downloading and installing</h2>\n\n<ul>\n<li>download server and client</li>\n<li>install node.js</li>\n<li>read the server readme to find out about the environment settings needed for the dreem server to work</li>\n<li>on windows - this means:\n\n<ul>\n<li>set DREEM_ROOT = dreemfolder (relative to server)</li>\n<li>set DREEM_PROJECTS_ROOT = an optional extra folder to be used for your own projects (also relative to serveR)</li>\n</ul>\n</li>\n<li>The projects folder is server on localhost:8080/projects/</li>\n<li>The dreem folder contains a folder /docs and /examples that can be used to find out more about the system\n/docs/api contains autogenerated documentation about Dreem</li>\n<li>install the coffeescript compiler if you want/need to edit the main dreem.coffee file</li>\n<li>run the server: node server.js</li>\n<li>To build the docs, you need to:\n\n<ul>\n<li>install Ruby 2+</li>\n<li>install the developer tools.. make sure to install the mingw64-32 version.</li>\n<li>JSDuck version 5.3.4 (\"gem install jsduck\")</li>\n<li>GEM might need an upgrade for the SSL cert -> https://gist.github.com/luislavena/f064211759ee0f806c88</li>\n<li>Warning - empty .md files will kill jsduck with cryptic messages!</li>\n<li>Also - new guides in Markdown format need a #document header. or else.</li>\n</ul>\n</li>\n</ul>\n\n\n<h2 id='startingwithdreem-section-building-a-thing-with-dreem'>Building a thing with Dreem</h2>\n\n<ul>\n<li><p>Start with a blank html document that loads the Dreem layout script and its dependencies in the header:\n<del>{.html}\n  <script type=\"text/javascript\" src=\"../boilerplate.js\"></script>\n  <style>\n  html,body\n  {\n      height:100%;\n      margin:0px;\n      padding:0px;\n      border:0px none;\n  }\n  body\n  {\n      font-family:Arial, Helvetica, sans-serif;\n      font-size:14px;\n  }\n  </style>\n</del></p>\n\n<p>  @example\n  <attribute name=\"firstName\" type=\"string\" value=\"Lumpy\"></attribute>\n  <attribute name=\"middleName\" type=\"string\" value=\"Space\"></attribute>\n  <attribute name=\"lastName\" type=\"string\" value=\"Princess\"></attribute></p>\n\n<p>  <text text=\"${this.parent.firstName + ' ' + this.parent.middleName + ' ' + this.parent.lastName}\"\n        color=\"hotpink\">\n  </text></p></li>\n<li><p>Add a root \"view\" tag to replace the usual \"body\"</p>\n\n<p>  @example small\n  <view width=\"200\" height=\"100\" bgcolor=\"lightpink\">\n  <view width=\"100%\" height=\"100%\" bgcolor=\"lightblue\"></view>\n  </view></p></li>\n<li><p>Add components\n  @example small\n  <view width=\"200\" height=\"100\" bgcolor=\"lightpink\">\n      <labelbutton text=\"I'm a button!\" x=\"0\" y=\"40\"></labelbutton>\n      <text text=\"I'm not!\" x=\"20\" y=\"30\"></text>\n  </view></p></li>\n<li>Components are fixed to 0,0 unless you either give them an x or y property, or you add a \"layout\" class node to the main container\n\n<ul>\n<li>spacedlayout can stack things horizontally or vertically using fixed spacing\n@example small\n<view width=\"200\" height=\"100\" bgcolor=\"lightpink\">\n  <spacedlayout axis=\"y\" spacing=\"4\" updateparent=\"true\"></spacedlayout>\n  <view>\n      <spacedlayout axis=\"y\" spacing=\"4\" updateparent=\"true\"></spacedlayout>\n      <labelbutton text=\"We\" x=\"0\" y=\"40\"></labelbutton>\n      <labelbutton text=\"are\" x=\"0\" y=\"40\"></labelbutton>\n      <labelbutton text=\"evenly\" x=\"0\" y=\"40\"></labelbutton>\n      <labelbutton text=\"spaced\" x=\"0\" y=\"40\"></labelbutton>\n      <labelbutton text=\"vertically!\" x=\"0\" y=\"40\"></labelbutton>\n  </view>\n  <view>\n      <spacedlayout axis=\"x\" spacing=\"4\" updateparent=\"true\"></spacedlayout>\n      <labelbutton text=\"We\" x=\"0\" y=\"40\"></labelbutton>\n      <labelbutton text=\"are\" x=\"0\" y=\"40\"></labelbutton>\n      <labelbutton text=\"evenly\" x=\"0\" y=\"40\"></labelbutton>\n      <labelbutton text=\"spaced\" x=\"0\" y=\"40\"></labelbutton>\n      <labelbutton text=\"horizontally!\" x=\"0\" y=\"40\"></labelbutton>         <br/>\n  </view>\n</view></li>\n</ul>\n</li>\n</ul>\n\n\n<h2 id='startingwithdreem-section-general-observations'>General observations</h2>\n\n<ul>\n<li>new classes default to \"view\" type</li>\n<li>setter functions are \"filters\" - you return the value you actually want to be set on the property</li>\n<li>Handlers are created INSIDE the instance of the thing that fires the event.</li>\n</ul>\n\n\n<h2 id='startingwithdreem-section-open-questions%2Fmissing-parts'>Open questions/missing parts</h2>\n\n<ul>\n<li>figure out missing parts</li>\n<li>sane layouting constructs + defaults\n\n<ul>\n<li>the way of the least surprise.. the defaults should work + look good.</li>\n</ul>\n</li>\n<li>updateparent is currently NOT the default for layouts?</li>\n<li>looper/replicator needs work?\n\n<ul>\n<li>Always rebuilds all items on data update</li>\n<li>Samples dont really show how the data attribute is used to fill in the component</li>\n</ul>\n</li>\n<li>when does an expression get re-evaluated?</li>\n<li>margin/padding for views</li>\n<li>split view abstraction (automatically add draggers between all subviews?)</li>\n<li>list view abstraction (contain + scroll stuff..)</li>\n<li>tree views</li>\n<li>slidered containerviews</li>\n</ul>\n\n","title":"Starting out with Dreem (using windows)\r"});