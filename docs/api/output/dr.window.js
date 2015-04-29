Ext.data.JsonP.dr_window({"tagname":"class","name":"dr.window","autodetected":{},"files":[{"filename":"dreem.js","href":"dreem.html#dr-window"}],"extends":"Eventable","members":[{"name":"height","tagname":"attribute","owner":"dr.window","id":"attribute-height","meta":{"readonly":true}},{"name":"visible","tagname":"attribute","owner":"dr.window","id":"attribute-visible","meta":{"readonly":true}},{"name":"width","tagname":"attribute","owner":"dr.window","id":"attribute-width","meta":{"readonly":true}},{"name":"defaultSetAttributeBehavior","tagname":"method","owner":"Eventable","id":"method-defaultSetAttributeBehavior","meta":{}},{"name":"sendEvent","tagname":"method","owner":"Eventable","id":"method-sendEvent","meta":{"chainable":true}},{"name":"setAndFire","tagname":"method","owner":"Eventable","id":"method-setAndFire","meta":{}},{"name":"setAttribute","tagname":"method","owner":"Eventable","id":"method-setAttribute","meta":{"chainable":true}},{"name":"setAttributes","tagname":"method","owner":"Eventable","id":"method-setAttributes","meta":{"chainable":true}}],"alternateClassNames":[],"aliases":{},"id":"class-dr.window","short_doc":"Sends window resize events. ...","component":false,"superclasses":["Module","Eventable"],"subclasses":[],"mixedInto":[],"mixins":[],"parentMixins":[],"requires":[],"uses":[],"html":"<div><pre class=\"hierarchy\"><h4>Hierarchy</h4><div class='subclass first-child'><a href='#!/api/Module' rel='Module' class='docClass'>Module</a><div class='subclass '><a href='#!/api/Eventable' rel='Eventable' class='docClass'>Eventable</a><div class='subclass '><strong>dr.window</strong></div></div></div><h4>Files</h4><div class='dependency'><a href='source/dreem.html#dr-window' target='_blank'>dreem.js</a></div></pre><div class='doc-contents'><p>Sends window resize events. Often used to dynamically reposition views as the window size changes.\n#\n    <handler event=\"onwidth\" reference=\"dr.window\" args=\"newWidth\">\n      //adjust views\n    </handler>\n#\n    <handler event=\"onheight\" reference=\"dr.window\" args=\"newHeight\">\n      //adjust views\n    </handler>\n#\n#</p>\n</div><div class='members'><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-attribute'>Attributes</h3><div class='subsection'><div id='attribute-height' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='dr.window'>dr.window</span><br/><a href='source/dreem.html#dr-window-attribute-height' target='_blank' class='view-source'>view source</a></div><a href='#!/api/dr.window-attribute-height' class='name expandable'>height</a> : Number<span class=\"signature\"><span class='readonly' >readonly</span></span></div><div class='description'><div class='short'><p>Set when the window height changes</p>\n</div><div class='long'><p>Set when the window height changes</p>\n</div></div></div><div id='attribute-visible' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='dr.window'>dr.window</span><br/><a href='source/dreem.html#dr-window-attribute-visible' target='_blank' class='view-source'>view source</a></div><a href='#!/api/dr.window-attribute-visible' class='name expandable'>visible</a> : Boolean<span class=\"signature\"><span class='readonly' >readonly</span></span></div><div class='description'><div class='short'>Set when the window visibility changes, true if the window is currently visible ...</div><div class='long'><p>Set when the window visibility changes, true if the window is currently visible</p>\n<p>Defaults to: <code>true</code></p></div></div></div><div id='attribute-width' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='dr.window'>dr.window</span><br/><a href='source/dreem.html#dr-window-attribute-width' target='_blank' class='view-source'>view source</a></div><a href='#!/api/dr.window-attribute-width' class='name expandable'>width</a> : Number<span class=\"signature\"><span class='readonly' >readonly</span></span></div><div class='description'><div class='short'><p>Set when the window width changes</p>\n</div><div class='long'><p>Set when the window width changes</p>\n</div></div></div></div></div><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-method'>Methods</h3><div class='subsection'><div id='method-defaultSetAttributeBehavior' class='member first-child inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Eventable' rel='Eventable' class='defined-in docClass'>Eventable</a><br/><a href='source/dreem.html#Eventable-method-defaultSetAttributeBehavior' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Eventable-method-defaultSetAttributeBehavior' class='name expandable'>defaultSetAttributeBehavior</a>( <span class='pre'>name, value</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>The default behavior to execute in setAttribute once setters have been\nrun. ...</div><div class='long'><p>The default behavior to execute in setAttribute once setters have been\nrun. Stores the value on this object and fires an event.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>name</span> : String<div class='sub-desc'><p>the name of the attribute to set</p>\n</div></li><li><span class='pre'>value</span> : Object<div class='sub-desc'><p>the value to set to</p>\n</div></li></ul></div></div></div><div id='method-sendEvent' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Eventable' rel='Eventable' class='defined-in docClass'>Eventable</a><br/><a href='source/dreem.html#Eventable-method-sendEvent' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Eventable-method-sendEvent' class='name expandable'>sendEvent</a>( <span class='pre'>name, value</span> ) : <a href=\"#!/api/Eventable\" rel=\"Eventable\" class=\"docClass\">Eventable</a><span class=\"signature\"><span class='chainable' >chainable</span></span></div><div class='description'><div class='short'>Sends an event ...</div><div class='long'><p>Sends an event</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>name</span> : String<div class='sub-desc'><p>the name of the event to send</p>\n</div></li><li><span class='pre'>value</span> : Object<div class='sub-desc'><p>the value to send with the event</p>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'><a href=\"#!/api/Eventable\" rel=\"Eventable\" class=\"docClass\">Eventable</a></span><div class='sub-desc'><p>this</p>\n</div></li></ul></div></div></div><div id='method-setAndFire' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Eventable' rel='Eventable' class='defined-in docClass'>Eventable</a><br/><a href='source/dreem.html#Eventable-method-setAndFire' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Eventable-method-setAndFire' class='name expandable'>setAndFire</a>( <span class='pre'>name, value</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Stores the value on this object and fires an event. ...</div><div class='long'><p>Stores the value on this object and fires an event.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>name</span> : String<div class='sub-desc'><p>the name of the attribute to set</p>\n</div></li><li><span class='pre'>value</span> : Object<div class='sub-desc'><p>the value to set to</p>\n</div></li></ul></div></div></div><div id='method-setAttribute' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Eventable' rel='Eventable' class='defined-in docClass'>Eventable</a><br/><a href='source/dreem.html#Eventable-method-setAttribute' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Eventable-method-setAttribute' class='name expandable'>setAttribute</a>( <span class='pre'>name, value</span> ) : <a href=\"#!/api/Eventable\" rel=\"Eventable\" class=\"docClass\">Eventable</a><span class=\"signature\"><span class='chainable' >chainable</span></span></div><div class='description'><div class='short'>Sets an attribute on this object, calls a setter function if it exists. ...</div><div class='long'><p>Sets an attribute on this object, calls a setter function if it exists.\nAlso stores the attribute in a property on the object and sends an event\nwith the new value.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>name</span> : String<div class='sub-desc'><p>the name of the attribute to set</p>\n</div></li><li><span class='pre'>value</span> : Object<div class='sub-desc'><p>the value to set to</p>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'><a href=\"#!/api/Eventable\" rel=\"Eventable\" class=\"docClass\">Eventable</a></span><div class='sub-desc'><p>this</p>\n</div></li></ul></div></div></div><div id='method-setAttributes' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Eventable' rel='Eventable' class='defined-in docClass'>Eventable</a><br/><a href='source/dreem.html#Eventable-method-setAttributes' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Eventable-method-setAttributes' class='name expandable'>setAttributes</a>( <span class='pre'>attributes</span> ) : <a href=\"#!/api/Eventable\" rel=\"Eventable\" class=\"docClass\">Eventable</a><span class=\"signature\"><span class='chainable' >chainable</span></span></div><div class='description'><div class='short'>Calls setAttribute for each name/value pair in the attributes object ...</div><div class='long'><p>Calls setAttribute for each name/value pair in the attributes object</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>attributes</span> : Object<div class='sub-desc'><p>An object of name/value pairs to be set</p>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'><a href=\"#!/api/Eventable\" rel=\"Eventable\" class=\"docClass\">Eventable</a></span><div class='sub-desc'><p>this</p>\n</div></li></ul></div></div></div></div></div></div></div>","meta":{}});