Ext.data.JsonP.dr_alignlayout({"tagname":"class","name":"dr.alignlayout","autodetected":{},"files":[{"filename":"classdocs.js","href":"classdocs.html#dr-alignlayout"}],"extends":"dr.variablelayout","members":[{"name":"align","tagname":"attribute","owner":"dr.alignlayout","id":"attribute-align","meta":{}},{"name":"attribute","tagname":"attribute","owner":"dr.constantlayout","id":"attribute-attribute","meta":{}},{"name":"collapseparent","tagname":"attribute","owner":"dr.variablelayout","id":"attribute-collapseparent","meta":{}},{"name":"id","tagname":"attribute","owner":"dr.node","id":"attribute-id","meta":{}},{"name":"name","tagname":"attribute","owner":"dr.node","id":"attribute-name","meta":{}},{"name":"reverse","tagname":"attribute","owner":"dr.variablelayout","id":"attribute-reverse","meta":{}},{"name":"scriptincludes","tagname":"attribute","owner":"dr.node","id":"attribute-scriptincludes","meta":{}},{"name":"scriptincludeserror","tagname":"attribute","owner":"dr.node","id":"attribute-scriptincludeserror","meta":{}},{"name":"subnodes","tagname":"attribute","owner":"dr.node","id":"attribute-subnodes","meta":{"readonly":true}},{"name":"value","tagname":"attribute","owner":"dr.constantlayout","id":"attribute-value","meta":{}},{"name":"inited","tagname":"property","owner":"dr.node","id":"property-inited","meta":{"readonly":true}},{"name":"addSubview","tagname":"method","owner":"dr.layout","id":"method-addSubview","meta":{}},{"name":"canUpdate","tagname":"method","owner":"dr.layout","id":"method-canUpdate","meta":{}},{"name":"destroy","tagname":"method","owner":"dr.node","id":"method-destroy","meta":{}},{"name":"doAfterUpdate","tagname":"method","owner":"dr.variablelayout","id":"method-doAfterUpdate","meta":{}},{"name":"doBeforeUpdate","tagname":"method","owner":"dr.alignlayout","id":"method-doBeforeUpdate","meta":{}},{"name":"doSubnodeAdded","tagname":"method","owner":"dr.node","id":"method-doSubnodeAdded","meta":{}},{"name":"doSubnodeRemoved","tagname":"method","owner":"dr.node","id":"method-doSubnodeRemoved","meta":{}},{"name":"ignore","tagname":"method","owner":"dr.layout","id":"method-ignore","meta":{}},{"name":"removeSubview","tagname":"method","owner":"dr.layout","id":"method-removeSubview","meta":{}},{"name":"sendEvent","tagname":"method","owner":"Eventable","id":"method-sendEvent","meta":{"chainable":true}},{"name":"setAttribute","tagname":"method","owner":"Eventable","id":"method-setAttribute","meta":{"chainable":true}},{"name":"setAttributes","tagname":"method","owner":"Eventable","id":"method-setAttributes","meta":{"chainable":true}},{"name":"skipSubview","tagname":"method","owner":"dr.variablelayout","id":"method-skipSubview","meta":{}},{"name":"startMonitoringAllSubviews","tagname":"method","owner":"dr.layout","id":"method-startMonitoringAllSubviews","meta":{}},{"name":"startMonitoringSubview","tagname":"method","owner":"dr.variablelayout","id":"method-startMonitoringSubview","meta":{}},{"name":"stopMonitoringAllSubviews","tagname":"method","owner":"dr.layout","id":"method-stopMonitoringAllSubviews","meta":{}},{"name":"stopMonitoringSubview","tagname":"method","owner":"dr.variablelayout","id":"method-stopMonitoringSubview","meta":{}},{"name":"update","tagname":"method","owner":"dr.layout","id":"method-update","meta":{}},{"name":"updateParent","tagname":"method","owner":"dr.variablelayout","id":"method-updateParent","meta":{}},{"name":"updateSubview","tagname":"method","owner":"dr.variablelayout","id":"method-updateSubview","meta":{}},{"name":"ondestroy","tagname":"event","owner":"dr.node","id":"event-ondestroy","meta":{}},{"name":"oninit","tagname":"event","owner":"dr.node","id":"event-oninit","meta":{}}],"alternateClassNames":[],"aliases":{},"id":"class-dr.alignlayout","short_doc":"A variablelayout that aligns each view vertically or horizontally\nrelative to all the other views. ...","component":false,"superclasses":["Module","Eventable","dr.node","dr.layout","dr.constantlayout","dr.variablelayout"],"subclasses":[],"mixedInto":[],"mixins":[],"parentMixins":[],"requires":[],"uses":[],"html":"<div><pre class=\"hierarchy\"><h4>Hierarchy</h4><div class='subclass first-child'><a href='#!/api/Module' rel='Module' class='docClass'>Module</a><div class='subclass '><a href='#!/api/Eventable' rel='Eventable' class='docClass'>Eventable</a><div class='subclass '><a href='#!/api/dr.node' rel='dr.node' class='docClass'>dr.node</a><div class='subclass '><a href='#!/api/dr.layout' rel='dr.layout' class='docClass'>dr.layout</a><div class='subclass '><a href='#!/api/dr.constantlayout' rel='dr.constantlayout' class='docClass'>dr.constantlayout</a><div class='subclass '><a href='#!/api/dr.variablelayout' rel='dr.variablelayout' class='docClass'>dr.variablelayout</a><div class='subclass '><strong>dr.alignlayout</strong></div></div></div></div></div></div></div><h4>Files</h4><div class='dependency'><a href='source/classdocs.html#dr-alignlayout' target='_blank'>classdocs.js</a></div></pre><div class='doc-contents'><p>A variablelayout that aligns each view vertically or horizontally\nrelative to all the other views.</p>\n\n<p>If collapseparent is true the parent will be sized to fit the\naligned views such that the view with the greatest extent will have\na position of 0. If instead collapseparent is false the views will\nbe aligned within the inner extent of the parent view.</p>\n\n<pre class='inline-example '><code>&lt;alignlayout align=\"middle\" collapseparent=\"true\"&gt;\n&lt;/alignlayout&gt;\n\n&lt;view width=\"100\" height=\"35\" bgcolor=\"plum\"&gt;&lt;/view&gt;\n&lt;view width=\"100\" height=\"25\" bgcolor=\"lightpink\"&gt;&lt;/view&gt;\n&lt;view width=\"100\" height=\"15\" bgcolor=\"lightblue\"&gt;&lt;/view&gt;\n</code></pre>\n</div><div class='members'><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-attribute'>Attributes</h3><div class='subsection'><div id='attribute-align' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='dr.alignlayout'>dr.alignlayout</span><br/><a href='source/classdocs.html#dr-alignlayout-attribute-align' target='_blank' class='view-source'>view source</a></div><a href='#!/api/dr.alignlayout-attribute-align' class='name expandable'>align</a> : String<span class=\"signature\"></span></div><div class='description'><div class='short'>Determines which way the views are aligned. ...</div><div class='long'><p>Determines which way the views are aligned. Supported values are\n'left', 'center', 'right' and 'top', 'middle' and 'bottom'.</p>\n<p>Defaults to: <code>&#39;middle&#39;</code></p></div></div></div><div id='attribute-attribute' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/dr.constantlayout' rel='dr.constantlayout' class='defined-in docClass'>dr.constantlayout</a><br/><a href='source/classdocs.html#dr-constantlayout-attribute-attribute' target='_blank' class='view-source'>view source</a></div><a href='#!/api/dr.constantlayout-attribute-attribute' class='name expandable'>attribute</a> : String<span class=\"signature\"></span></div><div class='description'><div class='short'>The name of the attribute to update on each subview. ...</div><div class='long'><p>The name of the attribute to update on each subview.</p>\n<p>Defaults to: <code>x</code></p></div></div></div><div id='attribute-collapseparent' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/dr.variablelayout' rel='dr.variablelayout' class='defined-in docClass'>dr.variablelayout</a><br/><a href='source/classdocs.html#dr-variablelayout-attribute-collapseparent' target='_blank' class='view-source'>view source</a></div><a href='#!/api/dr.variablelayout-attribute-collapseparent' class='name expandable'>collapseparent</a> : boolean<span class=\"signature\"></span></div><div class='description'><div class='short'>If true the updateParent method will be called. ...</div><div class='long'><p>If true the updateParent method will be called. The updateParent method\nwill typically resize the parent to fit the newly layed out child views.</p>\n<p>Defaults to: <code>false</code></p></div></div></div><div id='attribute-id' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/dr.node' rel='dr.node' class='defined-in docClass'>dr.node</a><br/><a href='source/layout.html#dr-node-attribute-id' target='_blank' class='view-source'>view source</a></div><a href='#!/api/dr.node-attribute-id' class='name expandable'>id</a> : String<span class=\"signature\"></span></div><div class='description'><div class='short'>Gives this node a global ID, which can be looked up in the global window object. ...</div><div class='long'><p>Gives this node a global ID, which can be looked up in the global window object.\nTake care to not override builtin globals, or override your own instances!</p>\n</div></div></div><div id='attribute-name' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/dr.node' rel='dr.node' class='defined-in docClass'>dr.node</a><br/><a href='source/layout.html#dr-node-attribute-name' target='_blank' class='view-source'>view source</a></div><a href='#!/api/dr.node-attribute-name' class='name expandable'>name</a> : String<span class=\"signature\"></span></div><div class='description'><div class='short'><p>Names this node in its parent scope so it can be referred to later.</p>\n</div><div class='long'><p>Names this node in its parent scope so it can be referred to later.</p>\n</div></div></div><div id='attribute-reverse' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/dr.variablelayout' rel='dr.variablelayout' class='defined-in docClass'>dr.variablelayout</a><br/><a href='source/classdocs.html#dr-variablelayout-attribute-reverse' target='_blank' class='view-source'>view source</a></div><a href='#!/api/dr.variablelayout-attribute-reverse' class='name expandable'>reverse</a> : boolean<span class=\"signature\"></span></div><div class='description'><div class='short'>If true the layout will position the items in the opposite order. ...</div><div class='long'><p>If true the layout will position the items in the opposite order. For\nexample, right to left instead of left to right.</p>\n<p>Defaults to: <code>false</code></p></div></div></div><div id='attribute-scriptincludes' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/dr.node' rel='dr.node' class='defined-in docClass'>dr.node</a><br/><a href='source/layout.html#dr-node-attribute-scriptincludes' target='_blank' class='view-source'>view source</a></div><a href='#!/api/dr.node-attribute-scriptincludes' class='name expandable'>scriptincludes</a> : String<span class=\"signature\"></span></div><div class='description'><div class='short'>A comma separated list of URLs to javascript includes required as dependencies. ...</div><div class='long'><p>A comma separated list of URLs to javascript includes required as dependencies. Useful if you need to ensure a third party library is available.</p>\n</div></div></div><div id='attribute-scriptincludeserror' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/dr.node' rel='dr.node' class='defined-in docClass'>dr.node</a><br/><a href='source/layout.html#dr-node-attribute-scriptincludeserror' target='_blank' class='view-source'>view source</a></div><a href='#!/api/dr.node-attribute-scriptincludeserror' class='name expandable'>scriptincludeserror</a> : String<span class=\"signature\"></span></div><div class='description'><div class='short'><p>An error to show if scriptincludes fail to load</p>\n</div><div class='long'><p>An error to show if scriptincludes fail to load</p>\n</div></div></div><div id='attribute-subnodes' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/dr.node' rel='dr.node' class='defined-in docClass'>dr.node</a><br/><a href='source/layout.html#dr-node-attribute-subnodes' target='_blank' class='view-source'>view source</a></div><a href='#!/api/dr.node-attribute-subnodes' class='name expandable'>subnodes</a> : <a href=\"#!/api/dr.node\" rel=\"dr.node\" class=\"docClass\">dr.node</a>[]<span class=\"signature\"><span class='readonly' >readonly</span></span></div><div class='description'><div class='short'>An array of this node's child nodes ...</div><div class='long'><p>An array of this node's child nodes</p>\n<p>Defaults to: <code>[]</code></p></div></div></div><div id='attribute-value' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/dr.constantlayout' rel='dr.constantlayout' class='defined-in docClass'>dr.constantlayout</a><br/><a href='source/classdocs.html#dr-constantlayout-attribute-value' target='_blank' class='view-source'>view source</a></div><a href='#!/api/dr.constantlayout-attribute-value' class='name expandable'>value</a> : *<span class=\"signature\"></span></div><div class='description'><div class='short'>The value to set the attribute to. ...</div><div class='long'><p>The value to set the attribute to.</p>\n<p>Defaults to: <code>0</code></p></div></div></div></div></div><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-property'>Properties</h3><div class='subsection'><div id='property-inited' class='member first-child inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/dr.node' rel='dr.node' class='defined-in docClass'>dr.node</a><br/><a href='source/layout.html#dr-node-property-inited' target='_blank' class='view-source'>view source</a></div><a href='#!/api/dr.node-property-inited' class='name expandable'>inited</a> : Boolean<span class=\"signature\"><span class='readonly' >readonly</span></span></div><div class='description'><div class='short'><p>True when this node and all its children are completely initialized</p>\n</div><div class='long'><p>True when this node and all its children are completely initialized</p>\n</div></div></div></div></div><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-method'>Methods</h3><div class='subsection'><div id='method-addSubview' class='member first-child inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/dr.layout' rel='dr.layout' class='defined-in docClass'>dr.layout</a><br/><a href='source/layout.html#dr-layout-method-addSubview' target='_blank' class='view-source'>view source</a></div><a href='#!/api/dr.layout-method-addSubview' class='name expandable'>addSubview</a>( <span class='pre'>view</span> ) : void<span class=\"signature\"></span></div><div class='description'><div class='short'>Adds the provided view to the subviews array of this layout. ...</div><div class='long'><p>Adds the provided view to the subviews array of this layout.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>view</span> : <a href=\"#!/api/dr.view\" rel=\"dr.view\" class=\"docClass\">dr.view</a><div class='sub-desc'><p>The view to add to this layout.</p>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>void</span><div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-canUpdate' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/dr.layout' rel='dr.layout' class='defined-in docClass'>dr.layout</a><br/><a href='source/layout.html#dr-layout-method-canUpdate' target='_blank' class='view-source'>view source</a></div><a href='#!/api/dr.layout-method-canUpdate' class='name expandable'>canUpdate</a>( <span class='pre'></span> ) : boolean<span class=\"signature\"></span></div><div class='description'><div class='short'>Checks if the layout is locked or not. ...</div><div class='long'><p>Checks if the layout is locked or not. Should be called by the\n\"update\" method of each layout to check if it is OK to do the update.</p>\n<h3 class='pa'>Returns</h3><ul><li><span class='pre'>boolean</span><div class='sub-desc'><p>true if not locked, false otherwise.</p>\n</div></li></ul></div></div></div><div id='method-destroy' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/dr.node' rel='dr.node' class='defined-in docClass'>dr.node</a><br/><a href='source/layout.html#dr-node-method-destroy' target='_blank' class='view-source'>view source</a></div><a href='#!/api/dr.node-method-destroy' class='name expandable'>destroy</a>( <span class='pre'></span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Destroys this node ...</div><div class='long'><p>Destroys this node</p>\n</div></div></div><div id='method-doAfterUpdate' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/dr.variablelayout' rel='dr.variablelayout' class='defined-in docClass'>dr.variablelayout</a><br/><a href='source/classdocs.html#dr-variablelayout-method-doAfterUpdate' target='_blank' class='view-source'>view source</a></div><a href='#!/api/dr.variablelayout-method-doAfterUpdate' class='name expandable'>doAfterUpdate</a>( <span class='pre'></span> ) : void<span class=\"signature\"></span></div><div class='description'><div class='short'>Called by update after any processing is done but before the optional\ncollapsing of parent is done. ...</div><div class='long'><p>Called by update after any processing is done but before the optional\ncollapsing of parent is done. Gives subviews a chance to do any\nspecial teardown after update is processed.</p>\n<h3 class='pa'>Returns</h3><ul><li><span class='pre'>void</span><div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-doBeforeUpdate' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='dr.alignlayout'>dr.alignlayout</span><br/><a href='source/classdocs.html#dr-alignlayout-method-doBeforeUpdate' target='_blank' class='view-source'>view source</a></div><a href='#!/api/dr.alignlayout-method-doBeforeUpdate' class='name expandable'>doBeforeUpdate</a>( <span class='pre'></span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Determine the maximum subview width/height according to the alignment. ...</div><div class='long'><p>Determine the maximum subview width/height according to the alignment.</p>\n<p>Overrides: <a href=\"#!/api/dr.variablelayout-method-doBeforeUpdate\" rel=\"dr.variablelayout-method-doBeforeUpdate\" class=\"docClass\">dr.variablelayout.doBeforeUpdate</a></p></div></div></div><div id='method-doSubnodeAdded' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/dr.node' rel='dr.node' class='defined-in docClass'>dr.node</a><br/><a href='source/layout.html#dr-node-method-doSubnodeAdded' target='_blank' class='view-source'>view source</a></div><a href='#!/api/dr.node-method-doSubnodeAdded' class='name expandable'>doSubnodeAdded</a>( <span class='pre'>node</span> ) : void<span class=\"signature\"></span></div><div class='description'><div class='short'>Called when a subnode is added to this node. ...</div><div class='long'><p>Called when a subnode is added to this node. Provides a hook for\nsubclasses. No need for subclasses to call super. Do not call this\nmethod to add a subnode. Instead call setParent.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>node</span> : <a href=\"#!/api/dr.node\" rel=\"dr.node\" class=\"docClass\">dr.node</a><div class='sub-desc'><p>The subnode that was added.</p>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>void</span><div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-doSubnodeRemoved' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/dr.node' rel='dr.node' class='defined-in docClass'>dr.node</a><br/><a href='source/layout.html#dr-node-method-doSubnodeRemoved' target='_blank' class='view-source'>view source</a></div><a href='#!/api/dr.node-method-doSubnodeRemoved' class='name expandable'>doSubnodeRemoved</a>( <span class='pre'>node</span> ) : void<span class=\"signature\"></span></div><div class='description'><div class='short'>Called when a subnode is removed from this node. ...</div><div class='long'><p>Called when a subnode is removed from this node. Provides a hook for\nsubclasses. No need for subclasses to call super. Do not call this\nmethod to remove a subnode. Instead call _removeFromParent.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>node</span> : <a href=\"#!/api/dr.node\" rel=\"dr.node\" class=\"docClass\">dr.node</a><div class='sub-desc'><p>The subnode that was removed.</p>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>void</span><div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-ignore' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/dr.layout' rel='dr.layout' class='defined-in docClass'>dr.layout</a><br/><a href='source/layout.html#dr-layout-method-ignore' target='_blank' class='view-source'>view source</a></div><a href='#!/api/dr.layout-method-ignore' class='name expandable'>ignore</a>( <span class='pre'>view</span> ) : boolean<span class=\"signature\"></span></div><div class='description'><div class='short'>Checks if a subview can be added to this Layout or not. ...</div><div class='long'><p>Checks if a subview can be added to this Layout or not. The default\nimplementation returns the 'ignorelayout' attributes of the subview.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>view</span> : <a href=\"#!/api/dr.view\" rel=\"dr.view\" class=\"docClass\">dr.view</a><div class='sub-desc'><p>The view to check.</p>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>boolean</span><div class='sub-desc'><p>True means the subview will be skipped, false otherwise.</p>\n</div></li></ul></div></div></div><div id='method-removeSubview' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/dr.layout' rel='dr.layout' class='defined-in docClass'>dr.layout</a><br/><a href='source/layout.html#dr-layout-method-removeSubview' target='_blank' class='view-source'>view source</a></div><a href='#!/api/dr.layout-method-removeSubview' class='name expandable'>removeSubview</a>( <span class='pre'>view</span> ) : number<span class=\"signature\"></span></div><div class='description'><div class='short'>Removes the provided View from the subviews array of this Layout. ...</div><div class='long'><p>Removes the provided View from the subviews array of this Layout.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>view</span> : <a href=\"#!/api/dr.view\" rel=\"dr.view\" class=\"docClass\">dr.view</a><div class='sub-desc'><p>The view to remove from this layout.</p>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>number</span><div class='sub-desc'><p>the index of the removed subview or -1 if not removed.</p>\n</div></li></ul></div></div></div><div id='method-sendEvent' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Eventable' rel='Eventable' class='defined-in docClass'>Eventable</a><br/><a href='source/layout.html#Eventable-method-sendEvent' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Eventable-method-sendEvent' class='name expandable'>sendEvent</a>( <span class='pre'>name, value</span> ) : <a href=\"#!/api/Eventable\" rel=\"Eventable\" class=\"docClass\">Eventable</a><span class=\"signature\"><span class='chainable' >chainable</span></span></div><div class='description'><div class='short'>Sends an event ...</div><div class='long'><p>Sends an event</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>name</span> : String<div class='sub-desc'><p>the name of the event to send</p>\n</div></li><li><span class='pre'>value</span> : Object<div class='sub-desc'><p>the value to send with the event</p>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'><a href=\"#!/api/Eventable\" rel=\"Eventable\" class=\"docClass\">Eventable</a></span><div class='sub-desc'><p>this</p>\n</div></li></ul></div></div></div><div id='method-setAttribute' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Eventable' rel='Eventable' class='defined-in docClass'>Eventable</a><br/><a href='source/layout.html#Eventable-method-setAttribute' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Eventable-method-setAttribute' class='name expandable'>setAttribute</a>( <span class='pre'>name, value</span> ) : <a href=\"#!/api/Eventable\" rel=\"Eventable\" class=\"docClass\">Eventable</a><span class=\"signature\"><span class='chainable' >chainable</span></span></div><div class='description'><div class='short'>Sets an attribute, calls a setter if there is one, then sends an event with the new value ...</div><div class='long'><p>Sets an attribute, calls a setter if there is one, then sends an event with the new value</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>name</span> : String<div class='sub-desc'><p>the name of the attribute to set</p>\n</div></li><li><span class='pre'>value</span> : Object<div class='sub-desc'><p>the value to set to</p>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'><a href=\"#!/api/Eventable\" rel=\"Eventable\" class=\"docClass\">Eventable</a></span><div class='sub-desc'><p>this</p>\n</div></li></ul></div></div></div><div id='method-setAttributes' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Eventable' rel='Eventable' class='defined-in docClass'>Eventable</a><br/><a href='source/layout.html#Eventable-method-setAttributes' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Eventable-method-setAttributes' class='name expandable'>setAttributes</a>( <span class='pre'>attributes</span> ) : <a href=\"#!/api/Eventable\" rel=\"Eventable\" class=\"docClass\">Eventable</a><span class=\"signature\"><span class='chainable' >chainable</span></span></div><div class='description'><div class='short'>Calls setAttribute for each name/value pair in the attributes object ...</div><div class='long'><p>Calls setAttribute for each name/value pair in the attributes object</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>attributes</span> : Object<div class='sub-desc'><p>An object of name/value pairs to be set</p>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'><a href=\"#!/api/Eventable\" rel=\"Eventable\" class=\"docClass\">Eventable</a></span><div class='sub-desc'><p>this</p>\n</div></li></ul></div></div></div><div id='method-skipSubview' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/dr.variablelayout' rel='dr.variablelayout' class='defined-in docClass'>dr.variablelayout</a><br/><a href='source/classdocs.html#dr-variablelayout-method-skipSubview' target='_blank' class='view-source'>view source</a></div><a href='#!/api/dr.variablelayout-method-skipSubview' class='name expandable'>skipSubview</a>( <span class='pre'>view</span> ) : Boolean<span class=\"signature\"></span></div><div class='description'><div class='short'>Called for each subview in the layout to determine if the view should\nbe updated or not. ...</div><div class='long'><p>Called for each subview in the layout to determine if the view should\nbe updated or not. The default implementation returns true if the\nsubview is not visible.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>view</span> : <a href=\"#!/api/dr.view\" rel=\"dr.view\" class=\"docClass\">dr.view</a><div class='sub-desc'><p>The subview to check.</p>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>Boolean</span><div class='sub-desc'><p>True if the subview should be skipped during\n  layout updates.</p>\n</div></li></ul></div></div></div><div id='method-startMonitoringAllSubviews' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/dr.layout' rel='dr.layout' class='defined-in docClass'>dr.layout</a><br/><a href='source/layout.html#dr-layout-method-startMonitoringAllSubviews' target='_blank' class='view-source'>view source</a></div><a href='#!/api/dr.layout-method-startMonitoringAllSubviews' class='name expandable'>startMonitoringAllSubviews</a>( <span class='pre'></span> ) : void<span class=\"signature\"></span></div><div class='description'><div class='short'>Calls startMonitoringSubview for all views. ...</div><div class='long'><p>Calls startMonitoringSubview for all views. Used by layout\nimplementations when a change occurs to the layout that requires\nrefreshing all the subview monitoring.</p>\n<h3 class='pa'>Returns</h3><ul><li><span class='pre'>void</span><div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-startMonitoringSubview' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/dr.variablelayout' rel='dr.variablelayout' class='defined-in docClass'>dr.variablelayout</a><br/><a href='source/classdocs.html#dr-variablelayout-method-startMonitoringSubview' target='_blank' class='view-source'>view source</a></div><a href='#!/api/dr.variablelayout-method-startMonitoringSubview' class='name expandable'>startMonitoringSubview</a>( <span class='pre'>view</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Provides a default implementation that calls update when the\nvisibility of a subview changes. ...</div><div class='long'><p>Provides a default implementation that calls update when the\nvisibility of a subview changes.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>view</span> : <a href=\"#!/api/dr.view\" rel=\"dr.view\" class=\"docClass\">dr.view</a><div class='sub-desc'>\n</div></li></ul><p>Overrides: <a href=\"#!/api/dr.layout-method-startMonitoringSubview\" rel=\"dr.layout-method-startMonitoringSubview\" class=\"docClass\">dr.layout.startMonitoringSubview</a></p></div></div></div><div id='method-stopMonitoringAllSubviews' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/dr.layout' rel='dr.layout' class='defined-in docClass'>dr.layout</a><br/><a href='source/layout.html#dr-layout-method-stopMonitoringAllSubviews' target='_blank' class='view-source'>view source</a></div><a href='#!/api/dr.layout-method-stopMonitoringAllSubviews' class='name expandable'>stopMonitoringAllSubviews</a>( <span class='pre'></span> ) : void<span class=\"signature\"></span></div><div class='description'><div class='short'>Calls stopMonitoringSubview for all views. ...</div><div class='long'><p>Calls stopMonitoringSubview for all views. Used by Layout\nimplementations when a change occurs to the layout that requires\nrefreshing all the subview monitoring.</p>\n<h3 class='pa'>Returns</h3><ul><li><span class='pre'>void</span><div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-stopMonitoringSubview' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/dr.variablelayout' rel='dr.variablelayout' class='defined-in docClass'>dr.variablelayout</a><br/><a href='source/classdocs.html#dr-variablelayout-method-stopMonitoringSubview' target='_blank' class='view-source'>view source</a></div><a href='#!/api/dr.variablelayout-method-stopMonitoringSubview' class='name expandable'>stopMonitoringSubview</a>( <span class='pre'>view</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Provides a default implementation that calls update when the\nvisibility of a subview changes. ...</div><div class='long'><p>Provides a default implementation that calls update when the\nvisibility of a subview changes.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>view</span> : <a href=\"#!/api/dr.view\" rel=\"dr.view\" class=\"docClass\">dr.view</a><div class='sub-desc'>\n</div></li></ul><p>Overrides: <a href=\"#!/api/dr.layout-method-stopMonitoringSubview\" rel=\"dr.layout-method-stopMonitoringSubview\" class=\"docClass\">dr.layout.stopMonitoringSubview</a></p></div></div></div><div id='method-update' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/dr.layout' rel='dr.layout' class='defined-in docClass'>dr.layout</a><br/><a href='source/layout.html#dr-layout-method-update' target='_blank' class='view-source'>view source</a></div><a href='#!/api/dr.layout-method-update' class='name expandable'>update</a>( <span class='pre'></span> ) : void<span class=\"signature\"></span></div><div class='description'><div class='short'>Updates the layout. ...</div><div class='long'><p>Updates the layout. Subclasses should call canUpdate to check lock state\nbefore doing anything.</p>\n<h3 class='pa'>Returns</h3><ul><li><span class='pre'>void</span><div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-updateParent' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/dr.variablelayout' rel='dr.variablelayout' class='defined-in docClass'>dr.variablelayout</a><br/><a href='source/classdocs.html#dr-variablelayout-method-updateParent' target='_blank' class='view-source'>view source</a></div><a href='#!/api/dr.variablelayout-method-updateParent' class='name expandable'>updateParent</a>( <span class='pre'>attribute, value</span> ) : void<span class=\"signature\"></span></div><div class='description'><div class='short'>Called if the collapseparent attribute is true. ...</div><div class='long'><p>Called if the collapseparent attribute is true. Subclasses should\nimplement this if they want to modify the parent view.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>attribute</span> : String<div class='sub-desc'><p>The name of the attribute to update.</p>\n</div></li><li><span class='pre'>value</span> : *<div class='sub-desc'><p>The value to set on the parent.</p>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>void</span><div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-updateSubview' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/dr.variablelayout' rel='dr.variablelayout' class='defined-in docClass'>dr.variablelayout</a><br/><a href='source/classdocs.html#dr-variablelayout-method-updateSubview' target='_blank' class='view-source'>view source</a></div><a href='#!/api/dr.variablelayout-method-updateSubview' class='name expandable'>updateSubview</a>( <span class='pre'>count, view, attribute, value</span> ) : *<span class=\"signature\"></span></div><div class='description'><div class='short'>Called for each subview in the layout. ...</div><div class='long'><p>Called for each subview in the layout.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>count</span> : Number<div class='sub-desc'><p>The number of subviews that have been layed out\n  including the current one. i.e. count will be 1 for the first\n  subview layed out.</p>\n</div></li><li><span class='pre'>view</span> : <a href=\"#!/api/dr.view\" rel=\"dr.view\" class=\"docClass\">dr.view</a><div class='sub-desc'><p>The subview being layed out.</p>\n</div></li><li><span class='pre'>attribute</span> : String<div class='sub-desc'><p>The name of the attribute to update.</p>\n</div></li><li><span class='pre'>value</span> : *<div class='sub-desc'><p>The value to set on the subview.</p>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>*</span><div class='sub-desc'><p>The value to use for the next subview.</p>\n</div></li></ul></div></div></div></div></div><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-event'>Events</h3><div class='subsection'><div id='event-ondestroy' class='member first-child inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/dr.node' rel='dr.node' class='defined-in docClass'>dr.node</a><br/><a href='source/layout.html#dr-node-event-ondestroy' target='_blank' class='view-source'>view source</a></div><a href='#!/api/dr.node-event-ondestroy' class='name expandable'>ondestroy</a>( <span class='pre'>node</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Fired when this node and all its children are about to be destroyed ...</div><div class='long'><p>Fired when this node and all its children are about to be destroyed</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>node</span> : <a href=\"#!/api/dr.node\" rel=\"dr.node\" class=\"docClass\">dr.node</a><div class='sub-desc'><p>The <a href=\"#!/api/dr.node\" rel=\"dr.node\" class=\"docClass\">dr.node</a> that fired the event</p>\n</div></li></ul></div></div></div><div id='event-oninit' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/dr.node' rel='dr.node' class='defined-in docClass'>dr.node</a><br/><a href='source/layout.html#dr-node-event-oninit' target='_blank' class='view-source'>view source</a></div><a href='#!/api/dr.node-event-oninit' class='name expandable'>oninit</a>( <span class='pre'>node</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Fired when this node and all its children are completely initialized ...</div><div class='long'><p>Fired when this node and all its children are completely initialized</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>node</span> : <a href=\"#!/api/dr.node\" rel=\"dr.node\" class=\"docClass\">dr.node</a><div class='sub-desc'><p>The <a href=\"#!/api/dr.node\" rel=\"dr.node\" class=\"docClass\">dr.node</a> that fired the event</p>\n</div></li></ul></div></div></div></div></div></div></div>","meta":{}});