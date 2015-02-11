Ext.data.JsonP.dr_replicator({"tagname":"class","name":"dr.replicator","autodetected":{},"files":[{"filename":"classdocs.js","href":"classdocs.html#dr-replicator"}],"extends":"dr.node","members":[{"name":"async","tagname":"attribute","owner":"dr.replicator","id":"attribute-async","meta":{}},{"name":"classname","tagname":"attribute","owner":"dr.replicator","id":"attribute-classname","meta":{"required":true}},{"name":"data","tagname":"attribute","owner":"dr.replicator","id":"attribute-data","meta":{}},{"name":"datapath","tagname":"attribute","owner":"dr.replicator","id":"attribute-datapath","meta":{}},{"name":"filterexpression","tagname":"attribute","owner":"dr.replicator","id":"attribute-filterexpression","meta":{}},{"name":"id","tagname":"attribute","owner":"dr.node","id":"attribute-id","meta":{}},{"name":"inited","tagname":"attribute","owner":"dr.node","id":"attribute-inited","meta":{"readonly":true}},{"name":"name","tagname":"attribute","owner":"dr.node","id":"attribute-name","meta":{}},{"name":"pooling","tagname":"attribute","owner":"dr.replicator","id":"attribute-pooling","meta":{}},{"name":"scriptincludes","tagname":"attribute","owner":"dr.node","id":"attribute-scriptincludes","meta":{}},{"name":"scriptincludeserror","tagname":"attribute","owner":"dr.node","id":"attribute-scriptincludeserror","meta":{}},{"name":"sortasc","tagname":"attribute","owner":"dr.replicator","id":"attribute-sortasc","meta":{}},{"name":"sortfield","tagname":"attribute","owner":"dr.replicator","id":"attribute-sortfield","meta":{}},{"name":"subnodes","tagname":"attribute","owner":"dr.node","id":"attribute-subnodes","meta":{"readonly":true}},{"name":"animate","tagname":"method","owner":"dr.node","id":"method-animate","meta":{"chainable":true}},{"name":"createChild","tagname":"method","owner":"dr.node","id":"method-createChild","meta":{}},{"name":"defaultSetAttributeBehavior","tagname":"method","owner":"Eventable","id":"method-defaultSetAttributeBehavior","meta":{}},{"name":"destroy","tagname":"method","owner":"dr.node","id":"method-destroy","meta":{}},{"name":"doSubnodeAdded","tagname":"method","owner":"dr.node","id":"method-doSubnodeAdded","meta":{"private":true}},{"name":"doSubnodeRemoved","tagname":"method","owner":"dr.node","id":"method-doSubnodeRemoved","meta":{"private":true}},{"name":"filterfunction","tagname":"method","owner":"dr.replicator","id":"method-filterfunction","meta":{"abstract":true}},{"name":"refresh","tagname":"method","owner":"dr.replicator","id":"method-refresh","meta":{}},{"name":"sendEvent","tagname":"method","owner":"Eventable","id":"method-sendEvent","meta":{"chainable":true}},{"name":"setAttribute","tagname":"method","owner":"Eventable","id":"method-setAttribute","meta":{"chainable":true}},{"name":"setAttributes","tagname":"method","owner":"Eventable","id":"method-setAttributes","meta":{"chainable":true}},{"name":"ondestroy","tagname":"event","owner":"dr.node","id":"event-ondestroy","meta":{}},{"name":"oninit","tagname":"event","owner":"dr.node","id":"event-oninit","meta":{}},{"name":"onreplicated","tagname":"event","owner":"dr.replicator","id":"event-onreplicated","meta":{}}],"alternateClassNames":[],"aliases":{},"id":"class-dr.replicator","short_doc":"Handles replication and data binding. ...","component":false,"superclasses":["Module","Eventable","dr.node"],"subclasses":[],"mixedInto":[],"mixins":[],"parentMixins":[],"requires":[],"uses":[],"html":"<div><pre class=\"hierarchy\"><h4>Hierarchy</h4><div class='subclass first-child'><a href='#!/api/Module' rel='Module' class='docClass'>Module</a><div class='subclass '><a href='#!/api/Eventable' rel='Eventable' class='docClass'>Eventable</a><div class='subclass '><a href='#!/api/dr.node' rel='dr.node' class='docClass'>dr.node</a><div class='subclass '><strong>dr.replicator</strong></div></div></div></div><h4>Files</h4><div class='dependency'><a href='source/classdocs.html#dr-replicator' target='_blank'>classdocs.js</a></div></pre><div class='doc-contents'><p>Handles replication and data binding.</p>\n\n<p>This example shows the replicator to creating four text instances, each corresponding to an item in the data attribute:</p>\n\n<pre class='inline-example '><code>&lt;spacedlayout&gt;&lt;/spacedlayout&gt;\n&lt;replicator classname=\"text\" data=\"[1,2,3,4]\"&gt;&lt;/replicator&gt;\n</code></pre>\n\n<p>Changing the data attribute to a new array causes the replicator to create a new text for each item:</p>\n\n<pre class='inline-example '><code>&lt;spacedlayout&gt;&lt;/spacedlayout&gt;\n&lt;text onclick=\"repl.setAttribute('data', [5,6,7,8]);\"&gt;Click to change data&lt;/text&gt;\n&lt;replicator id=\"repl\" classname=\"text\" data=\"[1,2,3,4]\"&gt;&lt;/replicator&gt;\n</code></pre>\n\n<p>This example uses a <a href=\"#!/api/dr.replicator-attribute-filterexpression\" rel=\"dr.replicator-attribute-filterexpression\" class=\"docClass\">filterexpression</a> to filter the data to only numbers. Clicking changes <a href=\"#!/api/dr.replicator-attribute-filterexpression\" rel=\"dr.replicator-attribute-filterexpression\" class=\"docClass\">filterexpression</a> to show only non-numbers in the data:</p>\n\n<pre class='inline-example '><code>&lt;spacedlayout&gt;&lt;/spacedlayout&gt;\n&lt;text onclick=\"repl.setAttribute('filterexpression', '[^\\\\d]');\"&gt;Click to change filter&lt;/text&gt;\n&lt;replicator id=\"repl\" classname=\"text\" data=\"['a',1,'b',2,'c',3,4,5]\" filterexpression=\"\\d\"&gt;&lt;/replicator&gt;\n</code></pre>\n\n<p>Replicators can be used to look up <a href=\"#!/api/dr.replicator-attribute-datapath\" rel=\"dr.replicator-attribute-datapath\" class=\"docClass\">datapath</a> expressions to values in JSON data in a <a href=\"#!/api/dr.dataset\" rel=\"dr.dataset\" class=\"docClass\">dr.dataset</a>. This example looks up the color of the bicycle in the <a href=\"#!/api/dr.dataset\" rel=\"dr.dataset\" class=\"docClass\">dr.dataset</a> named bikeshop:</p>\n\n<pre class='inline-example '><code>&lt;dataset name=\"bikeshop\"&gt;\n {\n   \"bicycle\": {\n     \"color\": \"red\",\n     \"price\": 19.95\n   }\n }\n&lt;/dataset&gt;\n&lt;replicator classname=\"text\" datapath=\"$bikeshop/bicycle/color\"&gt;&lt;/replicator&gt;\n</code></pre>\n\n<p>Matching one or more items will cause the replicator to create multiple copies:</p>\n\n<pre class='inline-example '><code>&lt;dataset name=\"bikeshop\"&gt;\n {\n   \"bicycle\": [\n     {\n      \"color\": \"red\",\n      \"price\": 19.95\n     },\n     {\n      \"color\": \"green\",\n      \"price\": 29.95\n     },\n     {\n      \"color\": \"blue\",\n      \"price\": 59.95\n     }\n   ]\n }\n&lt;/dataset&gt;\n&lt;spacedlayout&gt;&lt;/spacedlayout&gt;\n&lt;replicator classname=\"text\" datapath=\"$bikeshop/bicycle[*]/color\"&gt;&lt;/replicator&gt;\n</code></pre>\n\n<p>It's possible to select a single item on from the array using an array index. This selects the second item:</p>\n\n<pre class='inline-example '><code>&lt;dataset name=\"bikeshop\"&gt;\n {\n   \"bicycle\": [\n     {\n      \"color\": \"red\",\n      \"price\": 19.95\n     },\n     {\n      \"color\": \"green\",\n      \"price\": 29.95\n     },\n     {\n      \"color\": \"blue\",\n      \"price\": 59.95\n     }\n   ]\n }\n&lt;/dataset&gt;\n&lt;spacedlayout&gt;&lt;/spacedlayout&gt;\n&lt;replicator classname=\"text\" datapath=\"$bikeshop/bicycle[1]/color\"&gt;&lt;/replicator&gt;\n</code></pre>\n\n<p>It's also possible to replicate a range of items in the array with the [start,end,stepsize] operator. This replicates every other item:</p>\n\n<pre class='inline-example '><code>&lt;dataset name=\"bikeshop\"&gt;\n {\n   \"bicycle\": [\n     {\n      \"color\": \"red\",\n      \"price\": 19.95\n     },\n     {\n      \"color\": \"green\",\n      \"price\": 29.95\n     },\n     {\n      \"color\": \"blue\",\n      \"price\": 59.95\n     }\n   ]\n }\n&lt;/dataset&gt;\n&lt;spacedlayout&gt;&lt;/spacedlayout&gt;\n&lt;replicator classname=\"text\" datapath=\"$bikeshop/bicycle[0,3,2]/color\"&gt;&lt;/replicator&gt;\n</code></pre>\n\n<p>Sometimes it's necessary to have complete control and flexibility over filtering and transforming results. Adding a [@] operator to the end of your datapath causes <a href=\"#!/api/dr.replicator-method-filterfunction\" rel=\"dr.replicator-method-filterfunction\" class=\"docClass\">filterfunction</a> to be called for each result. This example shows bike colors for bikes with a price greater than 20, in reverse order:</p>\n\n<pre class='inline-example '><code>&lt;dataset name=\"bikeshop\"&gt;\n {\n   \"bicycle\": [\n     {\n      \"color\": \"red\",\n      \"price\": 19.95\n     },\n     {\n      \"color\": \"green\",\n      \"price\": 29.95\n     },\n     {\n      \"color\": \"blue\",\n      \"price\": 59.95\n     }\n   ]\n }\n&lt;/dataset&gt;\n&lt;spacedlayout&gt;&lt;/spacedlayout&gt;\n&lt;replicator classname=\"text\" datapath=\"$bikeshop/bicycle[*][@]\"&gt;\n  &lt;method name=\"filterfunction\" args=\"obj, accum\"&gt;\n    // add the color to the beginning of the results if the price is greater than 20\n    if (obj.price &gt; 20)\n      accum.unshift(obj.color);\n    return accum\n  &lt;/method&gt;\n&lt;/replicator&gt;\n</code></pre>\n\n<p>See <a href=\"https://github.com/flitbit/json-path\">https://github.com/flitbit/json-path</a> for more details.</p>\n</div><div class='members'><div class='members-section'><h3 class='members-title icon-attribute'>Attributes</h3><div class='subsection'><div class='definedBy'>Defined By</div><h4 class='members-subtitle'>Required attributes</h3><div id='attribute-classname' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='dr.replicator'>dr.replicator</span><br/><a href='source/classdocs.html#dr-replicator-attribute-classname' target='_blank' class='view-source'>view source</a></div><a href='#!/api/dr.replicator-attribute-classname' class='name expandable'>classname</a> : String<span class=\"signature\"><span class='required' >required</span></span></div><div class='description'><div class='short'><p>The name of the class to be replicated.</p>\n</div><div class='long'><p>The name of the class to be replicated.</p>\n</div></div></div></div><div class='subsection'><div class='definedBy'>Defined By</div><h4 class='members-subtitle'>Optional attributes</h3><div id='attribute-async' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='dr.replicator'>dr.replicator</span><br/><a href='source/classdocs.html#dr-replicator-attribute-async' target='_blank' class='view-source'>view source</a></div><a href='#!/api/dr.replicator-attribute-async' class='name expandable'>async</a> : Boolean<span class=\"signature\"></span></div><div class='description'><div class='short'>If true, create views asynchronously ...</div><div class='long'><p>If true, create views asynchronously</p>\n<p>Defaults to: <code>true</code></p></div></div></div><div id='attribute-data' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='dr.replicator'>dr.replicator</span><br/><a href='source/classdocs.html#dr-replicator-attribute-data' target='_blank' class='view-source'>view source</a></div><a href='#!/api/dr.replicator-attribute-data' class='name expandable'>data</a> : Array<span class=\"signature\"></span></div><div class='description'><div class='short'>The list of items to replicate. ...</div><div class='long'><p>The list of items to replicate. If <a href=\"#!/api/dr.replicator-attribute-datapath\" rel=\"dr.replicator-attribute-datapath\" class=\"docClass\">datapath</a> is set, it is converted to an array and stored here.</p>\n<p>Defaults to: <code>[]</code></p></div></div></div><div id='attribute-datapath' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='dr.replicator'>dr.replicator</span><br/><a href='source/classdocs.html#dr-replicator-attribute-datapath' target='_blank' class='view-source'>view source</a></div><a href='#!/api/dr.replicator-attribute-datapath' class='name expandable'>datapath</a> : String<span class=\"signature\"></span></div><div class='description'><div class='short'>The datapath expression to be replicated. ...</div><div class='long'><p>The datapath expression to be replicated.\nSee <a href=\"https://github.com/flitbit/json-path\">https://github.com/flitbit/json-path</a> for details.</p>\n</div></div></div><div id='attribute-filterexpression' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='dr.replicator'>dr.replicator</span><br/><a href='source/classdocs.html#dr-replicator-attribute-filterexpression' target='_blank' class='view-source'>view source</a></div><a href='#!/api/dr.replicator-attribute-filterexpression' class='name expandable'>filterexpression</a> : String<span class=\"signature\"></span></div><div class='description'><div class='short'>If defined, data will be filtered against a regular expression. ...</div><div class='long'><p>If defined, data will be filtered against a <a href=\"https://developer.mozilla.org/en/docs/Web/JavaScript/Guide/Regular_Expressions\">regular expression</a>.</p>\n<p>Defaults to: <code>&quot;&quot;</code></p></div></div></div><div id='attribute-id' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/dr.node' rel='dr.node' class='defined-in docClass'>dr.node</a><br/><a href='source/layout.html#dr-node-attribute-id' target='_blank' class='view-source'>view source</a></div><a href='#!/api/dr.node-attribute-id' class='name expandable'>id</a> : String<span class=\"signature\"></span></div><div class='description'><div class='short'>Gives this node a global ID, which can be looked up in the global window object. ...</div><div class='long'><p>Gives this node a global ID, which can be looked up in the global window object.\nTake care to not override builtin globals, or override your own instances!</p>\n</div></div></div><div id='attribute-inited' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/dr.node' rel='dr.node' class='defined-in docClass'>dr.node</a><br/><a href='source/layout.html#dr-node-attribute-inited' target='_blank' class='view-source'>view source</a></div><a href='#!/api/dr.node-attribute-inited' class='name expandable'>inited</a> : Boolean<span class=\"signature\"><span class='readonly' >readonly</span></span></div><div class='description'><div class='short'><p>True when this node and all its children are completely initialized</p>\n</div><div class='long'><p>True when this node and all its children are completely initialized</p>\n</div></div></div><div id='attribute-name' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/dr.node' rel='dr.node' class='defined-in docClass'>dr.node</a><br/><a href='source/layout.html#dr-node-attribute-name' target='_blank' class='view-source'>view source</a></div><a href='#!/api/dr.node-attribute-name' class='name expandable'>name</a> : String<span class=\"signature\"></span></div><div class='description'><div class='short'><p>Names this node in its parent scope so it can be referred to later.</p>\n</div><div class='long'><p>Names this node in its parent scope so it can be referred to later.</p>\n</div></div></div><div id='attribute-pooling' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='dr.replicator'>dr.replicator</span><br/><a href='source/classdocs.html#dr-replicator-attribute-pooling' target='_blank' class='view-source'>view source</a></div><a href='#!/api/dr.replicator-attribute-pooling' class='name expandable'>pooling</a> : Boolean<span class=\"signature\"></span></div><div class='description'><div class='short'>If true, reuse views when replicating. ...</div><div class='long'><p>If true, reuse views when replicating.</p>\n<p>Defaults to: <code>false</code></p></div></div></div><div id='attribute-scriptincludes' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/dr.node' rel='dr.node' class='defined-in docClass'>dr.node</a><br/><a href='source/layout.html#dr-node-attribute-scriptincludes' target='_blank' class='view-source'>view source</a></div><a href='#!/api/dr.node-attribute-scriptincludes' class='name expandable'>scriptincludes</a> : String<span class=\"signature\"></span></div><div class='description'><div class='short'>A comma separated list of URLs to javascript includes required as dependencies. ...</div><div class='long'><p>A comma separated list of URLs to javascript includes required as dependencies. Useful if you need to ensure a third party library is available.</p>\n</div></div></div><div id='attribute-scriptincludeserror' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/dr.node' rel='dr.node' class='defined-in docClass'>dr.node</a><br/><a href='source/layout.html#dr-node-attribute-scriptincludeserror' target='_blank' class='view-source'>view source</a></div><a href='#!/api/dr.node-attribute-scriptincludeserror' class='name expandable'>scriptincludeserror</a> : String<span class=\"signature\"></span></div><div class='description'><div class='short'><p>An error to show if scriptincludes fail to load</p>\n</div><div class='long'><p>An error to show if scriptincludes fail to load</p>\n</div></div></div><div id='attribute-sortasc' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='dr.replicator'>dr.replicator</span><br/><a href='source/classdocs.html#dr-replicator-attribute-sortasc' target='_blank' class='view-source'>view source</a></div><a href='#!/api/dr.replicator-attribute-sortasc' class='name expandable'>sortasc</a> : Boolean<span class=\"signature\"></span></div><div class='description'><div class='short'>If true, sort ascending. ...</div><div class='long'><p>If true, sort ascending.</p>\n<p>Defaults to: <code>true</code></p></div></div></div><div id='attribute-sortfield' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='dr.replicator'>dr.replicator</span><br/><a href='source/classdocs.html#dr-replicator-attribute-sortfield' target='_blank' class='view-source'>view source</a></div><a href='#!/api/dr.replicator-attribute-sortfield' class='name expandable'>sortfield</a> : String<span class=\"signature\"></span></div><div class='description'><div class='short'>The field in the data to use for sorting. ...</div><div class='long'><p>The field in the data to use for sorting. Only sort then this</p>\n<p>Defaults to: <code>&quot;&quot;</code></p></div></div></div><div id='attribute-subnodes' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/dr.node' rel='dr.node' class='defined-in docClass'>dr.node</a><br/><a href='source/layout.html#dr-node-attribute-subnodes' target='_blank' class='view-source'>view source</a></div><a href='#!/api/dr.node-attribute-subnodes' class='name expandable'>subnodes</a> : <a href=\"#!/api/dr.node\" rel=\"dr.node\" class=\"docClass\">dr.node</a>[]<span class=\"signature\"><span class='readonly' >readonly</span></span></div><div class='description'><div class='short'><p>An array of this node's child nodes</p>\n</div><div class='long'><p>An array of this node's child nodes</p>\n</div></div></div></div></div><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-method'>Methods</h3><div class='subsection'><div id='method-animate' class='member first-child inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/dr.node' rel='dr.node' class='defined-in docClass'>dr.node</a><br/><a href='source/layout.html#dr-node-method-animate' target='_blank' class='view-source'>view source</a></div><a href='#!/api/dr.node-method-animate' class='name expandable'>animate</a>( <span class='pre'>obj, Number</span> ) : <a href=\"#!/api/dr.node\" rel=\"dr.node\" class=\"docClass\">dr.node</a><span class=\"signature\"><span class='chainable' >chainable</span></span></div><div class='description'><div class='short'>Animates this node's attribute(s) ...</div><div class='long'><p>Animates this node's attribute(s)</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>obj</span> : Object<div class='sub-desc'><p>A hash of attribute names and values to animate to</p>\n</div></li><li><span class='pre'>Number</span> : Object<div class='sub-desc'><p>duration The duration of the animation in milliseconds</p>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'><a href=\"#!/api/dr.node\" rel=\"dr.node\" class=\"docClass\">dr.node</a></span><div class='sub-desc'><p>this</p>\n</div></li></ul></div></div></div><div id='method-createChild' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/dr.node' rel='dr.node' class='defined-in docClass'>dr.node</a><br/><a href='source/layout.html#dr-node-method-createChild' target='_blank' class='view-source'>view source</a></div><a href='#!/api/dr.node-method-createChild' class='name expandable'>createChild</a>( <span class='pre'>Object</span> ) : <a href=\"#!/api/dr.node\" rel=\"dr.node\" class=\"docClass\">dr.node</a><span class=\"signature\"></span></div><div class='description'><div class='short'>Used to create child instances on a node. ...</div><div class='long'><p>Used to create child instances on a node.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>Object</span> : Object<div class='sub-desc'><p>options Should include a class attribute: 'class', e.g. {class: 'view'} unless a <a href=\"#!/api/dr.node\" rel=\"dr.node\" class=\"docClass\">dr.node</a> is desired.</p>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'><a href=\"#!/api/dr.node\" rel=\"dr.node\" class=\"docClass\">dr.node</a></span><div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-defaultSetAttributeBehavior' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Eventable' rel='Eventable' class='defined-in docClass'>Eventable</a><br/><a href='source/layout.html#Eventable-method-defaultSetAttributeBehavior' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Eventable-method-defaultSetAttributeBehavior' class='name expandable'>defaultSetAttributeBehavior</a>( <span class='pre'>name, value</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>The default behavior to execute in setAttribute once setters have been\nrun. ...</div><div class='long'><p>The default behavior to execute in setAttribute once setters have been\nrun. Stores the value on this object and fires an event.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>name</span> : String<div class='sub-desc'><p>the name of the attribute to set</p>\n</div></li><li><span class='pre'>value</span> : Object<div class='sub-desc'><p>the value to set to</p>\n</div></li></ul></div></div></div><div id='method-destroy' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/dr.node' rel='dr.node' class='defined-in docClass'>dr.node</a><br/><a href='source/layout.html#dr-node-method-destroy' target='_blank' class='view-source'>view source</a></div><a href='#!/api/dr.node-method-destroy' class='name expandable'>destroy</a>( <span class='pre'></span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Destroys this node ...</div><div class='long'><p>Destroys this node</p>\n</div></div></div><div id='method-doSubnodeAdded' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/dr.node' rel='dr.node' class='defined-in docClass'>dr.node</a><br/><a href='source/layout.html#dr-node-method-doSubnodeAdded' target='_blank' class='view-source'>view source</a></div><a href='#!/api/dr.node-method-doSubnodeAdded' class='name expandable'>doSubnodeAdded</a>( <span class='pre'>node</span> ) : void<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'>Called when a subnode is added to this node. ...</div><div class='long'><p>Called when a subnode is added to this node. Provides a hook for\nsubclasses. No need for subclasses to call super. Do not call this\nmethod to add a subnode. Instead call setParent.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>node</span> : <a href=\"#!/api/dr.node\" rel=\"dr.node\" class=\"docClass\">dr.node</a><div class='sub-desc'><p>The subnode that was added.</p>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>void</span><div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-doSubnodeRemoved' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/dr.node' rel='dr.node' class='defined-in docClass'>dr.node</a><br/><a href='source/layout.html#dr-node-method-doSubnodeRemoved' target='_blank' class='view-source'>view source</a></div><a href='#!/api/dr.node-method-doSubnodeRemoved' class='name expandable'>doSubnodeRemoved</a>( <span class='pre'>node</span> ) : void<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'>Called when a subnode is removed from this node. ...</div><div class='long'><p>Called when a subnode is removed from this node. Provides a hook for\nsubclasses. No need for subclasses to call super. Do not call this\nmethod to remove a subnode. Instead call _removeFromParent.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>node</span> : <a href=\"#!/api/dr.node\" rel=\"dr.node\" class=\"docClass\">dr.node</a><div class='sub-desc'><p>The subnode that was removed.</p>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>void</span><div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-filterfunction' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='dr.replicator'>dr.replicator</span><br/><a href='source/classdocs.html#dr-replicator-method-filterfunction' target='_blank' class='view-source'>view source</a></div><a href='#!/api/dr.replicator-method-filterfunction' class='name expandable'>filterfunction</a>( <span class='pre'>obj, accum</span> ) : Object[]<span class=\"signature\"><span class='abstract' >abstract</span></span></div><div class='description'><div class='short'>Called to filter data. ...</div><div class='long'><p>Called to filter data.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>obj</span> : Object<div class='sub-desc'><p>An individual item to be processed.</p>\n</div></li><li><span class='pre'>accum</span> : Object[]<div class='sub-desc'><p>The array of items that have been accumulated. To keep a processed item, it must be added to the accum array.</p>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>Object[]</span><div class='sub-desc'><p>The accum array. Must be returned otherwise results will be lost.</p>\n</div></li></ul></div></div></div><div id='method-refresh' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='dr.replicator'>dr.replicator</span><br/><a href='source/classdocs.html#dr-replicator-method-refresh' target='_blank' class='view-source'>view source</a></div><a href='#!/api/dr.replicator-method-refresh' class='name expandable'>refresh</a>( <span class='pre'></span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Refreshes the dataset manually ...</div><div class='long'><p>Refreshes the dataset manually</p>\n</div></div></div><div id='method-sendEvent' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Eventable' rel='Eventable' class='defined-in docClass'>Eventable</a><br/><a href='source/layout.html#Eventable-method-sendEvent' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Eventable-method-sendEvent' class='name expandable'>sendEvent</a>( <span class='pre'>name, value</span> ) : <a href=\"#!/api/Eventable\" rel=\"Eventable\" class=\"docClass\">Eventable</a><span class=\"signature\"><span class='chainable' >chainable</span></span></div><div class='description'><div class='short'>Sends an event ...</div><div class='long'><p>Sends an event</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>name</span> : String<div class='sub-desc'><p>the name of the event to send</p>\n</div></li><li><span class='pre'>value</span> : Object<div class='sub-desc'><p>the value to send with the event</p>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'><a href=\"#!/api/Eventable\" rel=\"Eventable\" class=\"docClass\">Eventable</a></span><div class='sub-desc'><p>this</p>\n</div></li></ul></div></div></div><div id='method-setAttribute' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Eventable' rel='Eventable' class='defined-in docClass'>Eventable</a><br/><a href='source/layout.html#Eventable-method-setAttribute' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Eventable-method-setAttribute' class='name expandable'>setAttribute</a>( <span class='pre'>name, value</span> ) : <a href=\"#!/api/Eventable\" rel=\"Eventable\" class=\"docClass\">Eventable</a><span class=\"signature\"><span class='chainable' >chainable</span></span></div><div class='description'><div class='short'>Sets an attribute on this object, calls a setter function if it exists. ...</div><div class='long'><p>Sets an attribute on this object, calls a setter function if it exists.\nAlso stores the attribute in a property on the object and sends an event\nwith the new value.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>name</span> : String<div class='sub-desc'><p>the name of the attribute to set</p>\n</div></li><li><span class='pre'>value</span> : Object<div class='sub-desc'><p>the value to set to</p>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'><a href=\"#!/api/Eventable\" rel=\"Eventable\" class=\"docClass\">Eventable</a></span><div class='sub-desc'><p>this</p>\n</div></li></ul></div></div></div><div id='method-setAttributes' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Eventable' rel='Eventable' class='defined-in docClass'>Eventable</a><br/><a href='source/layout.html#Eventable-method-setAttributes' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Eventable-method-setAttributes' class='name expandable'>setAttributes</a>( <span class='pre'>attributes</span> ) : <a href=\"#!/api/Eventable\" rel=\"Eventable\" class=\"docClass\">Eventable</a><span class=\"signature\"><span class='chainable' >chainable</span></span></div><div class='description'><div class='short'>Calls setAttribute for each name/value pair in the attributes object ...</div><div class='long'><p>Calls setAttribute for each name/value pair in the attributes object</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>attributes</span> : Object<div class='sub-desc'><p>An object of name/value pairs to be set</p>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'><a href=\"#!/api/Eventable\" rel=\"Eventable\" class=\"docClass\">Eventable</a></span><div class='sub-desc'><p>this</p>\n</div></li></ul></div></div></div></div></div><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-event'>Events</h3><div class='subsection'><div id='event-ondestroy' class='member first-child inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/dr.node' rel='dr.node' class='defined-in docClass'>dr.node</a><br/><a href='source/layout.html#dr-node-event-ondestroy' target='_blank' class='view-source'>view source</a></div><a href='#!/api/dr.node-event-ondestroy' class='name expandable'>ondestroy</a>( <span class='pre'>node</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Fired when this node and all its children are about to be destroyed ...</div><div class='long'><p>Fired when this node and all its children are about to be destroyed</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>node</span> : <a href=\"#!/api/dr.node\" rel=\"dr.node\" class=\"docClass\">dr.node</a><div class='sub-desc'><p>The <a href=\"#!/api/dr.node\" rel=\"dr.node\" class=\"docClass\">dr.node</a> that fired the event</p>\n</div></li></ul></div></div></div><div id='event-oninit' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/dr.node' rel='dr.node' class='defined-in docClass'>dr.node</a><br/><a href='source/layout.html#dr-node-event-oninit' target='_blank' class='view-source'>view source</a></div><a href='#!/api/dr.node-event-oninit' class='name expandable'>oninit</a>( <span class='pre'>node</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Fired when this node and all its children are completely initialized ...</div><div class='long'><p>Fired when this node and all its children are completely initialized</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>node</span> : <a href=\"#!/api/dr.node\" rel=\"dr.node\" class=\"docClass\">dr.node</a><div class='sub-desc'><p>The <a href=\"#!/api/dr.node\" rel=\"dr.node\" class=\"docClass\">dr.node</a> that fired the event</p>\n</div></li></ul></div></div></div><div id='event-onreplicated' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='dr.replicator'>dr.replicator</span><br/><a href='source/classdocs.html#dr-replicator-event-onreplicated' target='_blank' class='view-source'>view source</a></div><a href='#!/api/dr.replicator-event-onreplicated' class='name expandable'>onreplicated</a>( <span class='pre'>replicator</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Fired when the replicator is done ...</div><div class='long'><p>Fired when the replicator is done</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>replicator</span> : <a href=\"#!/api/dr.replicator\" rel=\"dr.replicator\" class=\"docClass\">dr.replicator</a><div class='sub-desc'><p>The <a href=\"#!/api/dr.replicator\" rel=\"dr.replicator\" class=\"docClass\">dr.replicator</a> that fired the event</p>\n</div></li></ul></div></div></div></div></div></div></div>","meta":{}});