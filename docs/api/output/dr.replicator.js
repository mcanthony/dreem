Ext.data.JsonP.dr_replicator({"tagname":"class","name":"dr.replicator","autodetected":{},"files":[{"filename":"classdocs.js","href":"classdocs.html#dr-replicator"}],"extends":"dr.node","members":[{"name":"classname","tagname":"cfg","owner":"dr.replicator","id":"cfg-classname","meta":{"required":true}},{"name":"data","tagname":"cfg","owner":"dr.replicator","id":"cfg-data","meta":{}},{"name":"datapath","tagname":"cfg","owner":"dr.replicator","id":"cfg-datapath","meta":{}},{"name":"filterexpression","tagname":"cfg","owner":"dr.replicator","id":"cfg-filterexpression","meta":{}},{"name":"id","tagname":"cfg","owner":"dr.node","id":"cfg-id","meta":{}},{"name":"name","tagname":"cfg","owner":"dr.node","id":"cfg-name","meta":{}},{"name":"pooling","tagname":"cfg","owner":"dr.replicator","id":"cfg-pooling","meta":{}},{"name":"scriptincludes","tagname":"cfg","owner":"dr.node","id":"cfg-scriptincludes","meta":{}},{"name":"sortasc","tagname":"cfg","owner":"dr.replicator","id":"cfg-sortasc","meta":{}},{"name":"sortfield","tagname":"cfg","owner":"dr.replicator","id":"cfg-sortfield","meta":{}},{"name":"inited","tagname":"property","owner":"dr.node","id":"property-inited","meta":{"readonly":true}},{"name":"subnodes","tagname":"property","owner":"dr.node","id":"property-subnodes","meta":{"readonly":true}},{"name":"destroy","tagname":"method","owner":"dr.node","id":"method-destroy","meta":{}},{"name":"sendEvent","tagname":"method","owner":"Eventable","id":"method-sendEvent","meta":{"chainable":true}},{"name":"setAttribute","tagname":"method","owner":"Eventable","id":"method-setAttribute","meta":{"chainable":true}},{"name":"setAttributes","tagname":"method","owner":"Eventable","id":"method-setAttributes","meta":{"chainable":true}},{"name":"ondestroy","tagname":"event","owner":"dr.node","id":"event-ondestroy","meta":{}},{"name":"oninit","tagname":"event","owner":"dr.node","id":"event-oninit","meta":{}},{"name":"onsubnodes","tagname":"event","owner":"dr.node","id":"event-onsubnodes","meta":{}}],"alternateClassNames":[],"aliases":{},"id":"class-dr.replicator","short_doc":"Handles replication and data binding. ...","component":false,"superclasses":["Module","Eventable","dr.node"],"subclasses":[],"mixedInto":[],"mixins":[],"parentMixins":[],"requires":[],"uses":[],"html":"<div><pre class=\"hierarchy\"><h4>Hierarchy</h4><div class='subclass first-child'><a href='#!/api/Module' rel='Module' class='docClass'>Module</a><div class='subclass '><a href='#!/api/Eventable' rel='Eventable' class='docClass'>Eventable</a><div class='subclass '><a href='#!/api/dr.node' rel='dr.node' class='docClass'>dr.node</a><div class='subclass '><strong>dr.replicator</strong></div></div></div></div><h4>Files</h4><div class='dependency'><a href='source/classdocs.html#dr-replicator' target='_blank'>classdocs.js</a></div></pre><div class='doc-contents'><p>Handles replication and data binding.</p>\n\n<p>This example shows the replicator to creating four text instances, each corresponding to an item in the data attribute:</p>\n\n<pre class='inline-example '><code>&lt;simplelayout&gt;&lt;/simplelayout&gt;\n&lt;replicator classname=\"text\" data=\"[1,2,3,4]\"&gt;&lt;/replicator&gt;\n</code></pre>\n\n<p>Changing the data attribute to a new array causes the replicator to create a new text for each item:</p>\n\n<pre class='inline-example '><code>&lt;simplelayout&gt;&lt;/simplelayout&gt;\n&lt;text onclick=\"repl.setAttribute('data', [5,6,7,8]);\"&gt;Click to change data&lt;/text&gt;\n&lt;replicator id=\"repl\" classname=\"text\" data=\"[1,2,3,4]\"&gt;&lt;/replicator&gt;\n</code></pre>\n\n<p>This example uses a <a href=\"#!/api/dr.replicator-cfg-filterexpression\" rel=\"dr.replicator-cfg-filterexpression\" class=\"docClass\">filterexpression</a> to filter the data to only numbers. Clicking changes <a href=\"#!/api/dr.replicator-cfg-filterexpression\" rel=\"dr.replicator-cfg-filterexpression\" class=\"docClass\">filterexpression</a> to show only non-numbers in the data:</p>\n\n<pre class='inline-example '><code>&lt;simplelayout&gt;&lt;/simplelayout&gt;\n&lt;text onclick=\"repl.setAttribute('filterexpression', '[^\\\\d]');\"&gt;Click to change filter&lt;/text&gt;\n&lt;replicator id=\"repl\" classname=\"text\" data=\"['a',1,'b',2,'c',3,4,5]\" filterexpression=\"\\d\"&gt;&lt;/replicator&gt;\n</code></pre>\n\n<p>Replicators can be used to look up <a href=\"#!/api/dr.replicator-cfg-datapath\" rel=\"dr.replicator-cfg-datapath\" class=\"docClass\">datapath</a> expressions to values in JSON data in a <a href=\"#!/api/dr.dataset\" rel=\"dr.dataset\" class=\"docClass\">dr.dataset</a>. This example looks up the color of the bicycle in the <a href=\"#!/api/dr.dataset\" rel=\"dr.dataset\" class=\"docClass\">dr.dataset</a> named bikeshop:</p>\n\n<pre class='inline-example '><code>&lt;dataset name=\"bikeshop\"&gt;\n {\n   \"bicycle\": {\n     \"color\": \"red\",\n     \"price\": 19.95\n   }\n }\n&lt;/dataset&gt;\n&lt;replicator classname=\"text\" datapath=\"$bikeshop/bicycle/color\"&gt;&lt;/replicator&gt;\n</code></pre>\n\n<p>Matching one or more items will cause the replicator to create multiple copies:</p>\n\n<pre class='inline-example '><code>&lt;dataset name=\"bikeshop\"&gt;\n {\n   \"bicycle\": [\n     {\n      \"color\": \"red\",\n      \"price\": 19.95\n     },\n     {\n      \"color\": \"green\",\n      \"price\": 29.95\n     },\n     {\n      \"color\": \"blue\",\n      \"price\": 59.95\n     }\n   ]\n }\n&lt;/dataset&gt;\n&lt;simplelayout&gt;&lt;/simplelayout&gt;\n&lt;replicator classname=\"text\" datapath=\"$bikeshop/bicycle[*]/color\"&gt;&lt;/replicator&gt;\n</code></pre>\n\n<p>It's possible to select a single item on from the array using an array index. This selects the second item:</p>\n\n<pre class='inline-example '><code>&lt;dataset name=\"bikeshop\"&gt;\n {\n   \"bicycle\": [\n     {\n      \"color\": \"red\",\n      \"price\": 19.95\n     },\n     {\n      \"color\": \"green\",\n      \"price\": 29.95\n     },\n     {\n      \"color\": \"blue\",\n      \"price\": 59.95\n     }\n   ]\n }\n&lt;/dataset&gt;\n&lt;simplelayout&gt;&lt;/simplelayout&gt;\n&lt;replicator classname=\"text\" datapath=\"$bikeshop/bicycle[1]/color\"&gt;&lt;/replicator&gt;\n</code></pre>\n\n<p>It's also possible to replicate a range of items in the array with the [start,end,stepsize] operator. This replicates every other item:</p>\n\n<pre class='inline-example '><code>&lt;dataset name=\"bikeshop\"&gt;\n {\n   \"bicycle\": [\n     {\n      \"color\": \"red\",\n      \"price\": 19.95\n     },\n     {\n      \"color\": \"green\",\n      \"price\": 29.95\n     },\n     {\n      \"color\": \"blue\",\n      \"price\": 59.95\n     }\n   ]\n }\n&lt;/dataset&gt;\n&lt;simplelayout&gt;&lt;/simplelayout&gt;\n&lt;replicator classname=\"text\" datapath=\"$bikeshop/bicycle[0,3,2]/color\"&gt;&lt;/replicator&gt;\n</code></pre>\n</div><div class='members'><div class='members-section'><h3 class='members-title icon-cfg'>Config options</h3><div class='subsection'><div class='definedBy'>Defined By</div><h4 class='members-subtitle'>Required config options</h3><div id='cfg-classname' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='dr.replicator'>dr.replicator</span><br/><a href='source/classdocs.html#dr-replicator-cfg-classname' target='_blank' class='view-source'>view source</a></div><a href='#!/api/dr.replicator-cfg-classname' class='name expandable'>classname</a> : String<span class=\"signature\"><span class='required' >required</span></span></div><div class='description'><div class='short'><p>The name of the class to be replicated.</p>\n</div><div class='long'><p>The name of the class to be replicated.</p>\n</div></div></div></div><div class='subsection'><div class='definedBy'>Defined By</div><h4 class='members-subtitle'>Optional config options</h3><div id='cfg-data' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='dr.replicator'>dr.replicator</span><br/><a href='source/classdocs.html#dr-replicator-cfg-data' target='_blank' class='view-source'>view source</a></div><a href='#!/api/dr.replicator-cfg-data' class='name expandable'>data</a> : Array<span class=\"signature\"></span></div><div class='description'><div class='short'>The list of items to replicate. ...</div><div class='long'><p>The list of items to replicate. If <a href=\"#!/api/dr.replicator-cfg-datapath\" rel=\"dr.replicator-cfg-datapath\" class=\"docClass\">datapath</a> is set, it is converted to an array and stored here.</p>\n<p>Defaults to: <code>[]</code></p></div></div></div><div id='cfg-datapath' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='dr.replicator'>dr.replicator</span><br/><a href='source/classdocs.html#dr-replicator-cfg-datapath' target='_blank' class='view-source'>view source</a></div><a href='#!/api/dr.replicator-cfg-datapath' class='name expandable'>datapath</a> : String<span class=\"signature\"></span></div><div class='description'><div class='short'>The datapath expression to be replicated. ...</div><div class='long'><p>The datapath expression to be replicated.\nSee <a href=\"https://github.com/flitbit/json-path\">https://github.com/flitbit/json-path</a> for details.</p>\n</div></div></div><div id='cfg-filterexpression' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='dr.replicator'>dr.replicator</span><br/><a href='source/classdocs.html#dr-replicator-cfg-filterexpression' target='_blank' class='view-source'>view source</a></div><a href='#!/api/dr.replicator-cfg-filterexpression' class='name expandable'>filterexpression</a> : String<span class=\"signature\"></span></div><div class='description'><div class='short'>If defined, data will be filtered against a regular expression. ...</div><div class='long'><p>If defined, data will be filtered against a <a href=\"https://developer.mozilla.org/en/docs/Web/JavaScript/Guide/Regular_Expressions\">regular expression</a>.</p>\n<p>Defaults to: <code>&quot;&quot;</code></p></div></div></div><div id='cfg-id' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/dr.node' rel='dr.node' class='defined-in docClass'>dr.node</a><br/><a href='source/layout.html#dr-node-cfg-id' target='_blank' class='view-source'>view source</a></div><a href='#!/api/dr.node-cfg-id' class='name expandable'>id</a> : String<span class=\"signature\"></span></div><div class='description'><div class='short'>Gives this node a global ID, which can be looked up in the global window object. ...</div><div class='long'><p>Gives this node a global ID, which can be looked up in the global window object.\nTake care to not override builtin globals, or override your own instances!</p>\n</div></div></div><div id='cfg-name' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/dr.node' rel='dr.node' class='defined-in docClass'>dr.node</a><br/><a href='source/layout.html#dr-node-cfg-name' target='_blank' class='view-source'>view source</a></div><a href='#!/api/dr.node-cfg-name' class='name expandable'>name</a> : String<span class=\"signature\"></span></div><div class='description'><div class='short'><p>Names this node in its parent scope so it can be referred to later.</p>\n</div><div class='long'><p>Names this node in its parent scope so it can be referred to later.</p>\n</div></div></div><div id='cfg-pooling' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='dr.replicator'>dr.replicator</span><br/><a href='source/classdocs.html#dr-replicator-cfg-pooling' target='_blank' class='view-source'>view source</a></div><a href='#!/api/dr.replicator-cfg-pooling' class='name expandable'>pooling</a> : Boolean<span class=\"signature\"></span></div><div class='description'><div class='short'>If true, reuse views when replicating. ...</div><div class='long'><p>If true, reuse views when replicating.</p>\n<p>Defaults to: <code>false</code></p></div></div></div><div id='cfg-scriptincludes' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/dr.node' rel='dr.node' class='defined-in docClass'>dr.node</a><br/><a href='source/layout.html#dr-node-cfg-scriptincludes' target='_blank' class='view-source'>view source</a></div><a href='#!/api/dr.node-cfg-scriptincludes' class='name expandable'>scriptincludes</a> : String<span class=\"signature\"></span></div><div class='description'><div class='short'>A comma separated list of URLs to javascript includes required as dependencies. ...</div><div class='long'><p>A comma separated list of URLs to javascript includes required as dependencies. Useful if you need to ensure a third party library is available.</p>\n</div></div></div><div id='cfg-sortasc' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='dr.replicator'>dr.replicator</span><br/><a href='source/classdocs.html#dr-replicator-cfg-sortasc' target='_blank' class='view-source'>view source</a></div><a href='#!/api/dr.replicator-cfg-sortasc' class='name expandable'>sortasc</a> : Boolean<span class=\"signature\"></span></div><div class='description'><div class='short'>If true, sort ascending. ...</div><div class='long'><p>If true, sort ascending.</p>\n<p>Defaults to: <code>true</code></p></div></div></div><div id='cfg-sortfield' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='dr.replicator'>dr.replicator</span><br/><a href='source/classdocs.html#dr-replicator-cfg-sortfield' target='_blank' class='view-source'>view source</a></div><a href='#!/api/dr.replicator-cfg-sortfield' class='name expandable'>sortfield</a> : String<span class=\"signature\"></span></div><div class='description'><div class='short'>The field in the data to use for sorting. ...</div><div class='long'><p>The field in the data to use for sorting. Only sort then this</p>\n<p>Defaults to: <code>&quot;&quot;</code></p></div></div></div></div></div><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-property'>Properties</h3><div class='subsection'><div id='property-inited' class='member first-child inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/dr.node' rel='dr.node' class='defined-in docClass'>dr.node</a><br/><a href='source/layout.html#dr-node-property-inited' target='_blank' class='view-source'>view source</a></div><a href='#!/api/dr.node-property-inited' class='name expandable'>inited</a> : Boolean<span class=\"signature\"><span class='readonly' >readonly</span></span></div><div class='description'><div class='short'><p>True when this node and all its children are completely initialized</p>\n</div><div class='long'><p>True when this node and all its children are completely initialized</p>\n</div></div></div><div id='property-subnodes' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/dr.node' rel='dr.node' class='defined-in docClass'>dr.node</a><br/><a href='source/layout.html#dr-node-property-subnodes' target='_blank' class='view-source'>view source</a></div><a href='#!/api/dr.node-property-subnodes' class='name expandable'>subnodes</a> : <a href=\"#!/api/dr.node\" rel=\"dr.node\" class=\"docClass\">dr.node</a>[]<span class=\"signature\"><span class='readonly' >readonly</span></span></div><div class='description'><div class='short'>An array of this node's child nodes ...</div><div class='long'><p>An array of this node's child nodes</p>\n<p>Defaults to: <code>[]</code></p></div></div></div></div></div><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-method'>Methods</h3><div class='subsection'><div id='method-destroy' class='member first-child inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/dr.node' rel='dr.node' class='defined-in docClass'>dr.node</a><br/><a href='source/layout.html#dr-node-method-destroy' target='_blank' class='view-source'>view source</a></div><a href='#!/api/dr.node-method-destroy' class='name expandable'>destroy</a>( <span class='pre'></span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Destroys this node ...</div><div class='long'><p>Destroys this node</p>\n</div></div></div><div id='method-sendEvent' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Eventable' rel='Eventable' class='defined-in docClass'>Eventable</a><br/><a href='source/layout.html#Eventable-method-sendEvent' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Eventable-method-sendEvent' class='name expandable'>sendEvent</a>( <span class='pre'>name, value</span> ) : <a href=\"#!/api/Eventable\" rel=\"Eventable\" class=\"docClass\">Eventable</a><span class=\"signature\"><span class='chainable' >chainable</span></span></div><div class='description'><div class='short'>Sends an event ...</div><div class='long'><p>Sends an event</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>name</span> : String<div class='sub-desc'><p>the name of the event to send</p>\n</div></li><li><span class='pre'>value</span> : Object<div class='sub-desc'><p>the value to send with the event</p>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'><a href=\"#!/api/Eventable\" rel=\"Eventable\" class=\"docClass\">Eventable</a></span><div class='sub-desc'><p>this</p>\n</div></li></ul></div></div></div><div id='method-setAttribute' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Eventable' rel='Eventable' class='defined-in docClass'>Eventable</a><br/><a href='source/layout.html#Eventable-method-setAttribute' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Eventable-method-setAttribute' class='name expandable'>setAttribute</a>( <span class='pre'>name, value</span> ) : <a href=\"#!/api/Eventable\" rel=\"Eventable\" class=\"docClass\">Eventable</a><span class=\"signature\"><span class='chainable' >chainable</span></span></div><div class='description'><div class='short'>Sets an attribute, calls a setter if there is one, then sends an event with the new value ...</div><div class='long'><p>Sets an attribute, calls a setter if there is one, then sends an event with the new value</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>name</span> : String<div class='sub-desc'><p>the name of the attribute to set</p>\n</div></li><li><span class='pre'>value</span> : Object<div class='sub-desc'><p>the value to set to</p>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'><a href=\"#!/api/Eventable\" rel=\"Eventable\" class=\"docClass\">Eventable</a></span><div class='sub-desc'><p>this</p>\n</div></li></ul></div></div></div><div id='method-setAttributes' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Eventable' rel='Eventable' class='defined-in docClass'>Eventable</a><br/><a href='source/layout.html#Eventable-method-setAttributes' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Eventable-method-setAttributes' class='name expandable'>setAttributes</a>( <span class='pre'>attributes</span> ) : <a href=\"#!/api/Eventable\" rel=\"Eventable\" class=\"docClass\">Eventable</a><span class=\"signature\"><span class='chainable' >chainable</span></span></div><div class='description'><div class='short'>Calls setAttribute for each name/value pair in the attributes object ...</div><div class='long'><p>Calls setAttribute for each name/value pair in the attributes object</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>attributes</span> : Object<div class='sub-desc'><p>An object of name/value pairs to be set</p>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'><a href=\"#!/api/Eventable\" rel=\"Eventable\" class=\"docClass\">Eventable</a></span><div class='sub-desc'><p>this</p>\n</div></li></ul></div></div></div></div></div><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-event'>Events</h3><div class='subsection'><div id='event-ondestroy' class='member first-child inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/dr.node' rel='dr.node' class='defined-in docClass'>dr.node</a><br/><a href='source/layout.html#dr-node-event-ondestroy' target='_blank' class='view-source'>view source</a></div><a href='#!/api/dr.node-event-ondestroy' class='name expandable'>ondestroy</a>( <span class='pre'>node</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Fired when this node and all its children are about to be destroyed ...</div><div class='long'><p>Fired when this node and all its children are about to be destroyed</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>node</span> : <a href=\"#!/api/dr.node\" rel=\"dr.node\" class=\"docClass\">dr.node</a><div class='sub-desc'><p>The <a href=\"#!/api/dr.node\" rel=\"dr.node\" class=\"docClass\">dr.node</a> that fired the event</p>\n</div></li></ul></div></div></div><div id='event-oninit' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/dr.node' rel='dr.node' class='defined-in docClass'>dr.node</a><br/><a href='source/layout.html#dr-node-event-oninit' target='_blank' class='view-source'>view source</a></div><a href='#!/api/dr.node-event-oninit' class='name expandable'>oninit</a>( <span class='pre'>node</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Fired when this node and all its children are completely initialized ...</div><div class='long'><p>Fired when this node and all its children are completely initialized</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>node</span> : <a href=\"#!/api/dr.node\" rel=\"dr.node\" class=\"docClass\">dr.node</a><div class='sub-desc'><p>The <a href=\"#!/api/dr.node\" rel=\"dr.node\" class=\"docClass\">dr.node</a> that fired the event</p>\n</div></li></ul></div></div></div><div id='event-onsubnodes' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/dr.node' rel='dr.node' class='defined-in docClass'>dr.node</a><br/><a href='source/layout.html#dr-node-event-onsubnodes' target='_blank' class='view-source'>view source</a></div><a href='#!/api/dr.node-event-onsubnodes' class='name expandable'>onsubnodes</a>( <span class='pre'>node</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Fired when this node's subnodes array has changed ...</div><div class='long'><p>Fired when this node's subnodes array has changed</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>node</span> : <a href=\"#!/api/dr.node\" rel=\"dr.node\" class=\"docClass\">dr.node</a><div class='sub-desc'><p>The <a href=\"#!/api/dr.node\" rel=\"dr.node\" class=\"docClass\">dr.node</a> that fired the event</p>\n</div></li></ul></div></div></div></div></div></div></div>","meta":{}});