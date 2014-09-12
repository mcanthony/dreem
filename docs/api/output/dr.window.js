Ext.data.JsonP.dr_window({"tagname":"class","name":"dr.window","autodetected":{},"files":[{"filename":"layout.js","href":"layout.html#dr-window"}],"extends":"Eventable","members":[{"name":"sendEvent","tagname":"method","owner":"Eventable","id":"method-sendEvent","meta":{"chainable":true}},{"name":"setAttribute","tagname":"method","owner":"Eventable","id":"method-setAttribute","meta":{"chainable":true}},{"name":"setAttributes","tagname":"method","owner":"Eventable","id":"method-setAttributes","meta":{"chainable":true}},{"name":"onheight","tagname":"event","owner":"dr.window","id":"event-onheight","meta":{}},{"name":"onvisible","tagname":"event","owner":"dr.window","id":"event-onvisible","meta":{}},{"name":"onwidth","tagname":"event","owner":"dr.window","id":"event-onwidth","meta":{}}],"alternateClassNames":[],"aliases":{},"id":"class-dr.window","short_doc":"Sends window resize events. ...","classIcon":"icon-class","superclasses":["Module","Eventable"],"subclasses":[],"mixedInto":[],"mixins":[],"parentMixins":[],"requires":[],"uses":[],"html":"<div><pre class=\"hierarchy\"><h4>Hierarchy</h4><div class='subclass first-child'><a href='#!/api/Module' rel='Module' class='docClass'>Module</a><div class='subclass '><a href='#!/api/Eventable' rel='Eventable' class='docClass'>Eventable</a><div class='subclass '><strong>dr.window</strong></div></div></div><h4>Files</h4><div class='dependency'><a href='source/layout.html#dr-window' target='_blank'>layout.js</a></div></pre><div class='doc-contents'><p>Sends window resize events. Often used to dynamically reposition views as the window size changes.</p>\n</div><div class='members'><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-method'>Methods</h3><div class='subsection'><div id='method-sendEvent' class='member first-child inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Eventable' rel='Eventable' class='defined-in docClass'>Eventable</a><br/><a href='source/layout.html#Eventable-method-sendEvent' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Eventable-method-sendEvent' class='name expandable'>sendEvent</a>( <span class='pre'>name, value</span> ) : <a href=\"#!/api/Eventable\" rel=\"Eventable\" class=\"docClass\">Eventable</a><span class=\"signature\"><span class='chainable' >chainable</span></span></div><div class='description'><div class='short'>Sends an event ...</div><div class='long'><p>Sends an event</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>name</span> : String<div class='sub-desc'><p>the name of the event to send</p>\n</div></li><li><span class='pre'>value</span> : Object<div class='sub-desc'><p>the value to send with the event</p>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'><a href=\"#!/api/Eventable\" rel=\"Eventable\" class=\"docClass\">Eventable</a></span><div class='sub-desc'><p>this</p>\n</div></li></ul></div></div></div><div id='method-setAttribute' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Eventable' rel='Eventable' class='defined-in docClass'>Eventable</a><br/><a href='source/layout.html#Eventable-method-setAttribute' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Eventable-method-setAttribute' class='name expandable'>setAttribute</a>( <span class='pre'>name, value</span> ) : <a href=\"#!/api/Eventable\" rel=\"Eventable\" class=\"docClass\">Eventable</a><span class=\"signature\"><span class='chainable' >chainable</span></span></div><div class='description'><div class='short'>Sets an attribute, calls a setter if there is one, then sends an event with the new value ...</div><div class='long'><p>Sets an attribute, calls a setter if there is one, then sends an event with the new value</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>name</span> : String<div class='sub-desc'><p>the name of the attribute to set</p>\n</div></li><li><span class='pre'>value</span> : Object<div class='sub-desc'><p>the value to set to</p>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'><a href=\"#!/api/Eventable\" rel=\"Eventable\" class=\"docClass\">Eventable</a></span><div class='sub-desc'><p>this</p>\n</div></li></ul></div></div></div><div id='method-setAttributes' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Eventable' rel='Eventable' class='defined-in docClass'>Eventable</a><br/><a href='source/layout.html#Eventable-method-setAttributes' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Eventable-method-setAttributes' class='name expandable'>setAttributes</a>( <span class='pre'>attributes</span> ) : <a href=\"#!/api/Eventable\" rel=\"Eventable\" class=\"docClass\">Eventable</a><span class=\"signature\"><span class='chainable' >chainable</span></span></div><div class='description'><div class='short'>Calls setAttribute for each name/value pair in the attributes object ...</div><div class='long'><p>Calls setAttribute for each name/value pair in the attributes object</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>attributes</span> : Object<div class='sub-desc'><p>An object of name/value pairs to be set</p>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'><a href=\"#!/api/Eventable\" rel=\"Eventable\" class=\"docClass\">Eventable</a></span><div class='sub-desc'><p>this</p>\n</div></li></ul></div></div></div></div></div><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-event'>Events</h3><div class='subsection'><div id='event-onheight' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='dr.window'>dr.window</span><br/><a href='source/layout.html#dr-window-event-onheight' target='_blank' class='view-source'>view source</a></div><a href='#!/api/dr.window-event-onheight' class='name expandable'>onheight</a>( <span class='pre'>height</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Fired when the window resizes ...</div><div class='long'><p>Fired when the window resizes</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>height</span> : Number<div class='sub-desc'><p>The height of the window</p>\n</div></li></ul></div></div></div><div id='event-onvisible' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='dr.window'>dr.window</span><br/><a href='source/layout.html#dr-window-event-onvisible' target='_blank' class='view-source'>view source</a></div><a href='#!/api/dr.window-event-onvisible' class='name expandable'>onvisible</a>( <span class='pre'>visible</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Fired when the window visibility changes ...</div><div class='long'><p>Fired when the window visibility changes</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>visible</span> : Boolean<div class='sub-desc'><p>True if the window is currently visible</p>\n</div></li></ul></div></div></div><div id='event-onwidth' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='dr.window'>dr.window</span><br/><a href='source/layout.html#dr-window-event-onwidth' target='_blank' class='view-source'>view source</a></div><a href='#!/api/dr.window-event-onwidth' class='name expandable'>onwidth</a>( <span class='pre'>width</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Fired when the window resizes ...</div><div class='long'><p>Fired when the window resizes</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>width</span> : Number<div class='sub-desc'><p>The width of the window</p>\n</div></li></ul></div></div></div></div></div></div></div>","meta":{}});