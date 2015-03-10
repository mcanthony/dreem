Ext.data.JsonP.dr_mouse({"tagname":"class","name":"dr.mouse","autodetected":{},"files":[{"filename":"layout.js","href":"layout.html#dr-mouse"}],"extends":"Eventable","members":[{"name":"x","tagname":"attribute","owner":"dr.mouse","id":"attribute-x","meta":{"readonly":true}},{"name":"y","tagname":"attribute","owner":"dr.mouse","id":"attribute-y","meta":{"readonly":true}},{"name":"defaultSetAttributeBehavior","tagname":"method","owner":"Eventable","id":"method-defaultSetAttributeBehavior","meta":{}},{"name":"sendEvent","tagname":"method","owner":"Eventable","id":"method-sendEvent","meta":{"chainable":true}},{"name":"setAndFire","tagname":"method","owner":"Eventable","id":"method-setAndFire","meta":{}},{"name":"setAttribute","tagname":"method","owner":"Eventable","id":"method-setAttribute","meta":{"chainable":true}},{"name":"setAttributes","tagname":"method","owner":"Eventable","id":"method-setAttributes","meta":{"chainable":true}},{"name":"onclick","tagname":"event","owner":"dr.mouse","id":"event-onclick","meta":{}},{"name":"onmousedown","tagname":"event","owner":"dr.mouse","id":"event-onmousedown","meta":{}},{"name":"onmousemove","tagname":"event","owner":"dr.mouse","id":"event-onmousemove","meta":{}},{"name":"onmouseout","tagname":"event","owner":"dr.mouse","id":"event-onmouseout","meta":{}},{"name":"onmouseover","tagname":"event","owner":"dr.mouse","id":"event-onmouseover","meta":{}},{"name":"onmouseup","tagname":"event","owner":"dr.mouse","id":"event-onmouseup","meta":{}}],"alternateClassNames":[],"aliases":{},"id":"class-dr.mouse","short_doc":"Sends mouse events. ...","component":false,"superclasses":["Module","Eventable"],"subclasses":[],"mixedInto":[],"mixins":[],"parentMixins":[],"requires":[],"uses":[],"html":"<div><pre class=\"hierarchy\"><h4>Hierarchy</h4><div class='subclass first-child'><a href='#!/api/Module' rel='Module' class='docClass'>Module</a><div class='subclass '><a href='#!/api/Eventable' rel='Eventable' class='docClass'>Eventable</a><div class='subclass '><strong>dr.mouse</strong></div></div></div><h4>Files</h4><div class='dependency'><a href='source/layout.html#dr-mouse' target='_blank'>layout.js</a></div></pre><div class='doc-contents'><p>Sends mouse events. Often used to listen to onmouseover/x/y events to follow the mouse position.</p>\n\n<p>Here we attach events handlers to the onx and ony events of <a href=\"#!/api/dr.mouse\" rel=\"dr.mouse\" class=\"docClass\">dr.mouse</a>, and set the x,y coordinates of a square view so it follows the mouse.</p>\n\n<pre class='inline-example '><code>&lt;view id=\"mousetracker\" width=\"20\" height=\"20\" bgcolor=\"MediumTurquoise\"&gt;&lt;/view&gt;\n\n&lt;handler event=\"onx\" args=\"x\" reference=\"<a href=\"#!/api/dr.mouse\" rel=\"dr.mouse\" class=\"docClass\">dr.mouse</a>\"&gt;\n  mousetracker.setAttribute('x', x);\n&lt;/handler&gt;\n\n&lt;handler event=\"ony\" args=\"y\" reference=\"<a href=\"#!/api/dr.mouse\" rel=\"dr.mouse\" class=\"docClass\">dr.mouse</a>\"&gt;\n  mousetracker.setAttribute('y', y);\n&lt;/handler&gt;\n</code></pre>\n</div><div class='members'><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-attribute'>Attributes</h3><div class='subsection'><div id='attribute-x' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='dr.mouse'>dr.mouse</span><br/><a href='source/layout.html#dr-mouse-attribute-x' target='_blank' class='view-source'>view source</a></div><a href='#!/api/dr.mouse-attribute-x' class='name expandable'>x</a> : Number<span class=\"signature\"><span class='readonly' >readonly</span></span></div><div class='description'><div class='short'><p>The x position of the mouse</p>\n</div><div class='long'><p>The x position of the mouse</p>\n</div></div></div><div id='attribute-y' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='dr.mouse'>dr.mouse</span><br/><a href='source/layout.html#dr-mouse-attribute-y' target='_blank' class='view-source'>view source</a></div><a href='#!/api/dr.mouse-attribute-y' class='name expandable'>y</a> : Number<span class=\"signature\"><span class='readonly' >readonly</span></span></div><div class='description'><div class='short'><p>The y position of the mouse</p>\n</div><div class='long'><p>The y position of the mouse</p>\n</div></div></div></div></div><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-method'>Methods</h3><div class='subsection'><div id='method-defaultSetAttributeBehavior' class='member first-child inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Eventable' rel='Eventable' class='defined-in docClass'>Eventable</a><br/><a href='source/layout.html#Eventable-method-defaultSetAttributeBehavior' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Eventable-method-defaultSetAttributeBehavior' class='name expandable'>defaultSetAttributeBehavior</a>( <span class='pre'>name, value</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>The default behavior to execute in setAttribute once setters have been\nrun. ...</div><div class='long'><p>The default behavior to execute in setAttribute once setters have been\nrun. Stores the value on this object and fires an event.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>name</span> : String<div class='sub-desc'><p>the name of the attribute to set</p>\n</div></li><li><span class='pre'>value</span> : Object<div class='sub-desc'><p>the value to set to</p>\n</div></li></ul></div></div></div><div id='method-sendEvent' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Eventable' rel='Eventable' class='defined-in docClass'>Eventable</a><br/><a href='source/layout.html#Eventable-method-sendEvent' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Eventable-method-sendEvent' class='name expandable'>sendEvent</a>( <span class='pre'>name, value</span> ) : <a href=\"#!/api/Eventable\" rel=\"Eventable\" class=\"docClass\">Eventable</a><span class=\"signature\"><span class='chainable' >chainable</span></span></div><div class='description'><div class='short'>Sends an event ...</div><div class='long'><p>Sends an event</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>name</span> : String<div class='sub-desc'><p>the name of the event to send</p>\n</div></li><li><span class='pre'>value</span> : Object<div class='sub-desc'><p>the value to send with the event</p>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'><a href=\"#!/api/Eventable\" rel=\"Eventable\" class=\"docClass\">Eventable</a></span><div class='sub-desc'><p>this</p>\n</div></li></ul></div></div></div><div id='method-setAndFire' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Eventable' rel='Eventable' class='defined-in docClass'>Eventable</a><br/><a href='source/layout.html#Eventable-method-setAndFire' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Eventable-method-setAndFire' class='name expandable'>setAndFire</a>( <span class='pre'>name, value</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Stores the value on this object and fires an event. ...</div><div class='long'><p>Stores the value on this object and fires an event.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>name</span> : String<div class='sub-desc'><p>the name of the attribute to set</p>\n</div></li><li><span class='pre'>value</span> : Object<div class='sub-desc'><p>the value to set to</p>\n</div></li></ul></div></div></div><div id='method-setAttribute' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Eventable' rel='Eventable' class='defined-in docClass'>Eventable</a><br/><a href='source/layout.html#Eventable-method-setAttribute' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Eventable-method-setAttribute' class='name expandable'>setAttribute</a>( <span class='pre'>name, value</span> ) : <a href=\"#!/api/Eventable\" rel=\"Eventable\" class=\"docClass\">Eventable</a><span class=\"signature\"><span class='chainable' >chainable</span></span></div><div class='description'><div class='short'>Sets an attribute on this object, calls a setter function if it exists. ...</div><div class='long'><p>Sets an attribute on this object, calls a setter function if it exists.\nAlso stores the attribute in a property on the object and sends an event\nwith the new value.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>name</span> : String<div class='sub-desc'><p>the name of the attribute to set</p>\n</div></li><li><span class='pre'>value</span> : Object<div class='sub-desc'><p>the value to set to</p>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'><a href=\"#!/api/Eventable\" rel=\"Eventable\" class=\"docClass\">Eventable</a></span><div class='sub-desc'><p>this</p>\n</div></li></ul></div></div></div><div id='method-setAttributes' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Eventable' rel='Eventable' class='defined-in docClass'>Eventable</a><br/><a href='source/layout.html#Eventable-method-setAttributes' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Eventable-method-setAttributes' class='name expandable'>setAttributes</a>( <span class='pre'>attributes</span> ) : <a href=\"#!/api/Eventable\" rel=\"Eventable\" class=\"docClass\">Eventable</a><span class=\"signature\"><span class='chainable' >chainable</span></span></div><div class='description'><div class='short'>Calls setAttribute for each name/value pair in the attributes object ...</div><div class='long'><p>Calls setAttribute for each name/value pair in the attributes object</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>attributes</span> : Object<div class='sub-desc'><p>An object of name/value pairs to be set</p>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'><a href=\"#!/api/Eventable\" rel=\"Eventable\" class=\"docClass\">Eventable</a></span><div class='sub-desc'><p>this</p>\n</div></li></ul></div></div></div></div></div><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-event'>Events</h3><div class='subsection'><div id='event-onclick' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='dr.mouse'>dr.mouse</span><br/><a href='source/layout.html#dr-mouse-event-onclick' target='_blank' class='view-source'>view source</a></div><a href='#!/api/dr.mouse-event-onclick' class='name expandable'>onclick</a>( <span class='pre'>view</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Fired when the mouse is clicked ...</div><div class='long'><p>Fired when the mouse is clicked</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>view</span> : <a href=\"#!/api/dr.view\" rel=\"dr.view\" class=\"docClass\">dr.view</a><div class='sub-desc'><p>The <a href=\"#!/api/dr.view\" rel=\"dr.view\" class=\"docClass\">dr.view</a> that fired the event</p>\n</div></li></ul></div></div></div><div id='event-onmousedown' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='dr.mouse'>dr.mouse</span><br/><a href='source/layout.html#dr-mouse-event-onmousedown' target='_blank' class='view-source'>view source</a></div><a href='#!/api/dr.mouse-event-onmousedown' class='name expandable'>onmousedown</a>( <span class='pre'>view</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Fired when the mouse goes down on a view ...</div><div class='long'><p>Fired when the mouse goes down on a view</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>view</span> : <a href=\"#!/api/dr.view\" rel=\"dr.view\" class=\"docClass\">dr.view</a><div class='sub-desc'><p>The <a href=\"#!/api/dr.view\" rel=\"dr.view\" class=\"docClass\">dr.view</a> that fired the event</p>\n</div></li></ul></div></div></div><div id='event-onmousemove' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='dr.mouse'>dr.mouse</span><br/><a href='source/layout.html#dr-mouse-event-onmousemove' target='_blank' class='view-source'>view source</a></div><a href='#!/api/dr.mouse-event-onmousemove' class='name expandable'>onmousemove</a>( <span class='pre'>coordinates</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Fired when the mouse moves ...</div><div class='long'><p>Fired when the mouse moves</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>coordinates</span> : Object<div class='sub-desc'><p>The x and y coordinates of the mouse</p>\n</div></li></ul></div></div></div><div id='event-onmouseout' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='dr.mouse'>dr.mouse</span><br/><a href='source/layout.html#dr-mouse-event-onmouseout' target='_blank' class='view-source'>view source</a></div><a href='#!/api/dr.mouse-event-onmouseout' class='name expandable'>onmouseout</a>( <span class='pre'>view</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Fired when the mouse moves off a view ...</div><div class='long'><p>Fired when the mouse moves off a view</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>view</span> : <a href=\"#!/api/dr.view\" rel=\"dr.view\" class=\"docClass\">dr.view</a><div class='sub-desc'><p>The <a href=\"#!/api/dr.view\" rel=\"dr.view\" class=\"docClass\">dr.view</a> that fired the event</p>\n</div></li></ul></div></div></div><div id='event-onmouseover' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='dr.mouse'>dr.mouse</span><br/><a href='source/layout.html#dr-mouse-event-onmouseover' target='_blank' class='view-source'>view source</a></div><a href='#!/api/dr.mouse-event-onmouseover' class='name expandable'>onmouseover</a>( <span class='pre'>view</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Fired when the mouse moves over a view ...</div><div class='long'><p>Fired when the mouse moves over a view</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>view</span> : <a href=\"#!/api/dr.view\" rel=\"dr.view\" class=\"docClass\">dr.view</a><div class='sub-desc'><p>The <a href=\"#!/api/dr.view\" rel=\"dr.view\" class=\"docClass\">dr.view</a> that fired the event</p>\n</div></li></ul></div></div></div><div id='event-onmouseup' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='dr.mouse'>dr.mouse</span><br/><a href='source/layout.html#dr-mouse-event-onmouseup' target='_blank' class='view-source'>view source</a></div><a href='#!/api/dr.mouse-event-onmouseup' class='name expandable'>onmouseup</a>( <span class='pre'>view</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Fired when the mouse goes up on a view ...</div><div class='long'><p>Fired when the mouse goes up on a view</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>view</span> : <a href=\"#!/api/dr.view\" rel=\"dr.view\" class=\"docClass\">dr.view</a><div class='sub-desc'><p>The <a href=\"#!/api/dr.view\" rel=\"dr.view\" class=\"docClass\">dr.view</a> that fired the event</p>\n</div></li></ul></div></div></div></div></div></div></div>","meta":{}});