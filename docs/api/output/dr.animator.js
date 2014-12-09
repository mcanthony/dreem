Ext.data.JsonP.dr_animator({"tagname":"class","name":"dr.animator","autodetected":{},"files":[{"filename":"classdocs.js","href":"classdocs.html#dr-animator"}],"extends":"dr.node","members":[{"name":"attribute","tagname":"attribute","owner":"dr.animator","id":"attribute-attribute","meta":{}},{"name":"bounce","tagname":"attribute","owner":"dr.animator","id":"attribute-bounce","meta":{}},{"name":"control","tagname":"attribute","owner":"dr.animator","id":"attribute-control","meta":{}},{"name":"duration","tagname":"attribute","owner":"dr.animator","id":"attribute-duration","meta":{}},{"name":"from","tagname":"attribute","owner":"dr.animator","id":"attribute-from","meta":{}},{"name":"id","tagname":"attribute","owner":"dr.node","id":"attribute-id","meta":{}},{"name":"motion","tagname":"attribute","owner":"dr.animator","id":"attribute-motion","meta":{}},{"name":"name","tagname":"attribute","owner":"dr.node","id":"attribute-name","meta":{}},{"name":"paused","tagname":"attribute","owner":"dr.animator","id":"attribute-paused","meta":{}},{"name":"relative","tagname":"attribute","owner":"dr.animator","id":"attribute-relative","meta":{}},{"name":"repeat","tagname":"attribute","owner":"dr.animator","id":"attribute-repeat","meta":{}},{"name":"scriptincludes","tagname":"attribute","owner":"dr.node","id":"attribute-scriptincludes","meta":{}},{"name":"scriptincludeserror","tagname":"attribute","owner":"dr.node","id":"attribute-scriptincludeserror","meta":{}},{"name":"start","tagname":"attribute","owner":"dr.animator","id":"attribute-start","meta":{}},{"name":"subnodes","tagname":"attribute","owner":"dr.node","id":"attribute-subnodes","meta":{"readonly":true}},{"name":"target","tagname":"attribute","owner":"dr.animator","id":"attribute-target","meta":{}},{"name":"to","tagname":"attribute","owner":"dr.animator","id":"attribute-to","meta":{}},{"name":"inited","tagname":"property","owner":"dr.node","id":"property-inited","meta":{"readonly":true}},{"name":"destroy","tagname":"method","owner":"dr.node","id":"method-destroy","meta":{}},{"name":"doSubnodeAdded","tagname":"method","owner":"dr.node","id":"method-doSubnodeAdded","meta":{}},{"name":"doSubnodeRemoved","tagname":"method","owner":"dr.node","id":"method-doSubnodeRemoved","meta":{}},{"name":"sendEvent","tagname":"method","owner":"Eventable","id":"method-sendEvent","meta":{"chainable":true}},{"name":"setAttribute","tagname":"method","owner":"Eventable","id":"method-setAttribute","meta":{"chainable":true}},{"name":"setAttributes","tagname":"method","owner":"Eventable","id":"method-setAttributes","meta":{"chainable":true}},{"name":"ondestroy","tagname":"event","owner":"dr.node","id":"event-ondestroy","meta":{}},{"name":"onend","tagname":"event","owner":"dr.animator","id":"event-onend","meta":{}},{"name":"oninit","tagname":"event","owner":"dr.node","id":"event-oninit","meta":{}},{"name":"onstart","tagname":"event","owner":"dr.animator","id":"event-onstart","meta":{}},{"name":"ontick","tagname":"event","owner":"dr.animator","id":"event-ontick","meta":{}}],"alternateClassNames":[],"aliases":{},"id":"class-dr.animator","short_doc":"Animator class that can animate keys on other objects\n\n&lt;view bgcolor=\"red\" x=\"0\" y=\"0\" width=\"100\" height=\"100\"&gt...","component":false,"superclasses":["Module","Eventable","dr.node"],"subclasses":[],"mixedInto":[],"mixins":[],"parentMixins":[],"requires":[],"uses":[],"html":"<div><pre class=\"hierarchy\"><h4>Hierarchy</h4><div class='subclass first-child'><a href='#!/api/Module' rel='Module' class='docClass'>Module</a><div class='subclass '><a href='#!/api/Eventable' rel='Eventable' class='docClass'>Eventable</a><div class='subclass '><a href='#!/api/dr.node' rel='dr.node' class='docClass'>dr.node</a><div class='subclass '><strong>dr.animator</strong></div></div></div></div><h4>Files</h4><div class='dependency'><a href='source/classdocs.html#dr-animator' target='_blank'>classdocs.js</a></div></pre><div class='doc-contents'><p>Animator class that can animate keys on other objects</p>\n\n<pre class='inline-example nested'><code>&lt;view bgcolor=\"red\" x=\"0\" y=\"0\" width=\"100\" height=\"100\"&gt;\n  &lt;animator start=\"100\" attribute=\"x\" to=\"200\" duration=\"1000\" motion=\"outBounce\" repeat=\"1\"&gt;\n    &lt;handler event=\"onend\"&gt;\n      console.log('it ended')\n    &lt;/handler&gt;\n  &lt;/animator&gt;\n&lt;/view&gt;\n</code></pre>\n</div><div class='members'><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-attribute'>Attributes</h3><div class='subsection'><div id='attribute-attribute' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='dr.animator'>dr.animator</span><br/><a href='source/classdocs.html#dr-animator-attribute-attribute' target='_blank' class='view-source'>view source</a></div><a href='#!/api/dr.animator-attribute-attribute' class='name expandable'>attribute</a> : string<span class=\"signature\"></span></div><div class='description'><div class='short'><p>The name of the attribute this animator is animating</p>\n</div><div class='long'><p>The name of the attribute this animator is animating</p>\n</div></div></div><div id='attribute-bounce' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='dr.animator'>dr.animator</span><br/><a href='source/classdocs.html#dr-animator-attribute-bounce' target='_blank' class='view-source'>view source</a></div><a href='#!/api/dr.animator-attribute-bounce' class='name expandable'>bounce</a> : boolean<span class=\"signature\"></span></div><div class='description'><div class='short'><p>turn on bounce looping</p>\n</div><div class='long'><p>turn on bounce looping</p>\n</div></div></div><div id='attribute-control' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='dr.animator'>dr.animator</span><br/><a href='source/classdocs.html#dr-animator-attribute-control' target='_blank' class='view-source'>view source</a></div><a href='#!/api/dr.animator-attribute-control' class='name expandable'>control</a> : string<span class=\"signature\"></span></div><div class='description'><div class='short'><p>control points for the bret and bezier motions</p>\n</div><div class='long'><p>control points for the bret and bezier motions</p>\n</div></div></div><div id='attribute-duration' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='dr.animator'>dr.animator</span><br/><a href='source/classdocs.html#dr-animator-attribute-duration' target='_blank' class='view-source'>view source</a></div><a href='#!/api/dr.animator-attribute-duration' class='name expandable'>duration</a> : number<span class=\"signature\"></span></div><div class='description'><div class='short'>The duration of the animation. ...</div><div class='long'><p>The duration of the animation. Is identical to specifying a <keyframe at='{duration}'>{to}</keyframe></p>\n</div></div></div><div id='attribute-from' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='dr.animator'>dr.animator</span><br/><a href='source/classdocs.html#dr-animator-attribute-from' target='_blank' class='view-source'>view source</a></div><a href='#!/api/dr.animator-attribute-from' class='name expandable'>from</a> : String<span class=\"signature\"></span></div><div class='description'><div class='short'><p>The value to start the animation from, if not specified is read from the target attribute</p>\n</div><div class='long'><p>The value to start the animation from, if not specified is read from the target attribute</p>\n</div></div></div><div id='attribute-id' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/dr.node' rel='dr.node' class='defined-in docClass'>dr.node</a><br/><a href='source/layout.html#dr-node-attribute-id' target='_blank' class='view-source'>view source</a></div><a href='#!/api/dr.node-attribute-id' class='name expandable'>id</a> : String<span class=\"signature\"></span></div><div class='description'><div class='short'>Gives this node a global ID, which can be looked up in the global window object. ...</div><div class='long'><p>Gives this node a global ID, which can be looked up in the global window object.\nTake care to not override builtin globals, or override your own instances!</p>\n</div></div></div><div id='attribute-motion' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='dr.animator'>dr.animator</span><br/><a href='source/classdocs.html#dr-animator-attribute-motion' target='_blank' class='view-source'>view source</a></div><a href='#!/api/dr.animator-attribute-motion' class='name expandable'>motion</a> : string<span class=\"signature\"></span></div><div class='description'><div class='short'>name of the motion the animation is following\nvalid values are:\n'bezier' use a cubic bezier motion function\n  use con...</div><div class='long'><p>name of the motion the animation is following\nvalid values are:\n'bezier' use a cubic bezier motion function\n  use control points in control='x1,y1,x2,y2'\n  for example control='0,0,1,1'\n  bezier control points work the same as the CSS3 cubic-bezier easing\n'bret' uses brets animation function, has 2 control points\n  control='start,end' value near 0 (0.01) will produce a curved line\n  where values near 1.0 will produce a straight line\n  this way you can control the 'easing' from 'smooth' (0.01) to 'hard' (1.0)\n  on each side start / end of the animation\n  for example control='0.01,1.00' produces an animation with a smooth start and a hard end\n'linear' simple linear motion\nthe following curves can be seen here http://api.jqueryui.com/easings/\n'inQuad' use a t<sup>2</sup> curve\n'outQuad' t<sup>2</sup> curve on out\n'inOutQuad' mix of inQuad and outQuad\n'inCubic' use a t<sup>3</sup> curve\n'outCubic' t<sup>3</sup> curve on out\n'inOutCubic' mix of inCubic and outCubic\n'inQuart' t<sup>4</sup> curve\n'outQuart' t<sup>4</sup> curve on out\n'inOutQuart' mix of inQuart and outQuart\n'inQuint' t<sup>5</sup> curve\n'outQuint' t<sup>5</sup> curve on out\n'inOutQuint' mix of inQuint and outQuint\n'inSine' sin(t) curve\n'outSine' sin(t) on out\n'inOutSine' mix of inSine and outSine\n'inExpo' e<sup>t</sup> curve\n'outExpo' e<sup>t</sup> curve on end\n'inOutExpo' mix of inExpo and outExpo\n'inElastic' elastic (like bounce, but overshoots) curve\n'outElastic' elastic on end\n'inOutElastic' mix of inElastic and outElastic\n'inBack' overshooting curve\n'outBack' overshooting on end\n'inOutBack' mix of inBack and outBack\n'inBounce' Bouncing curve\n'outBounce' Bouncing curve on end\n'inOutBounce' mix of inBounce and outBounce</p>\n</div></div></div><div id='attribute-name' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/dr.node' rel='dr.node' class='defined-in docClass'>dr.node</a><br/><a href='source/layout.html#dr-node-attribute-name' target='_blank' class='view-source'>view source</a></div><a href='#!/api/dr.node-attribute-name' class='name expandable'>name</a> : String<span class=\"signature\"></span></div><div class='description'><div class='short'><p>Names this node in its parent scope so it can be referred to later.</p>\n</div><div class='long'><p>Names this node in its parent scope so it can be referred to later.</p>\n</div></div></div><div id='attribute-paused' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='dr.animator'>dr.animator</span><br/><a href='source/classdocs.html#dr-animator-attribute-paused' target='_blank' class='view-source'>view source</a></div><a href='#!/api/dr.animator-attribute-paused' class='name expandable'>paused</a> : boolean<span class=\"signature\"></span></div><div class='description'><div class='short'><p>wether or not the animator is paused</p>\n</div><div class='long'><p>wether or not the animator is paused</p>\n</div></div></div><div id='attribute-relative' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='dr.animator'>dr.animator</span><br/><a href='source/classdocs.html#dr-animator-attribute-relative' target='_blank' class='view-source'>view source</a></div><a href='#!/api/dr.animator-attribute-relative' class='name expandable'>relative</a> : boolean<span class=\"signature\"></span></div><div class='description'><div class='short'><p>animation is relative to original value</p>\n</div><div class='long'><p>animation is relative to original value</p>\n</div></div></div><div id='attribute-repeat' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='dr.animator'>dr.animator</span><br/><a href='source/classdocs.html#dr-animator-attribute-repeat' target='_blank' class='view-source'>view source</a></div><a href='#!/api/dr.animator-attribute-repeat' class='name expandable'>repeat</a> : number<span class=\"signature\"></span></div><div class='description'><div class='short'><p>how many times to repeat the loop (repeat 2 runs something twice)</p>\n</div><div class='long'><p>how many times to repeat the loop (repeat 2 runs something twice)</p>\n</div></div></div><div id='attribute-scriptincludes' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/dr.node' rel='dr.node' class='defined-in docClass'>dr.node</a><br/><a href='source/layout.html#dr-node-attribute-scriptincludes' target='_blank' class='view-source'>view source</a></div><a href='#!/api/dr.node-attribute-scriptincludes' class='name expandable'>scriptincludes</a> : String<span class=\"signature\"></span></div><div class='description'><div class='short'>A comma separated list of URLs to javascript includes required as dependencies. ...</div><div class='long'><p>A comma separated list of URLs to javascript includes required as dependencies. Useful if you need to ensure a third party library is available.</p>\n</div></div></div><div id='attribute-scriptincludeserror' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/dr.node' rel='dr.node' class='defined-in docClass'>dr.node</a><br/><a href='source/layout.html#dr-node-attribute-scriptincludeserror' target='_blank' class='view-source'>view source</a></div><a href='#!/api/dr.node-attribute-scriptincludeserror' class='name expandable'>scriptincludeserror</a> : String<span class=\"signature\"></span></div><div class='description'><div class='short'><p>An error to show if scriptincludes fail to load</p>\n</div><div class='long'><p>An error to show if scriptincludes fail to load</p>\n</div></div></div><div id='attribute-start' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='dr.animator'>dr.animator</span><br/><a href='source/classdocs.html#dr-animator-attribute-start' target='_blank' class='view-source'>view source</a></div><a href='#!/api/dr.animator-attribute-start' class='name expandable'>start</a> : String<span class=\"signature\"></span></div><div class='description'><div class='short'><p>The start time of the animation</p>\n</div><div class='long'><p>The start time of the animation</p>\n</div></div></div><div id='attribute-subnodes' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/dr.node' rel='dr.node' class='defined-in docClass'>dr.node</a><br/><a href='source/layout.html#dr-node-attribute-subnodes' target='_blank' class='view-source'>view source</a></div><a href='#!/api/dr.node-attribute-subnodes' class='name expandable'>subnodes</a> : <a href=\"#!/api/dr.node\" rel=\"dr.node\" class=\"docClass\">dr.node</a>[]<span class=\"signature\"><span class='readonly' >readonly</span></span></div><div class='description'><div class='short'>An array of this node's child nodes ...</div><div class='long'><p>An array of this node's child nodes</p>\n<p>Defaults to: <code>[]</code></p></div></div></div><div id='attribute-target' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='dr.animator'>dr.animator</span><br/><a href='source/classdocs.html#dr-animator-attribute-target' target='_blank' class='view-source'>view source</a></div><a href='#!/api/dr.animator-attribute-target' class='name expandable'>target</a> : string<span class=\"signature\"></span></div><div class='description'><div class='short'><p>Name of the target object id, not needed if animator is used as a child tag in the target node</p>\n</div><div class='long'><p>Name of the target object id, not needed if animator is used as a child tag in the target node</p>\n</div></div></div><div id='attribute-to' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='dr.animator'>dr.animator</span><br/><a href='source/classdocs.html#dr-animator-attribute-to' target='_blank' class='view-source'>view source</a></div><a href='#!/api/dr.animator-attribute-to' class='name expandable'>to</a> : String<span class=\"signature\"></span></div><div class='description'><div class='short'>The value to animate to. ...</div><div class='long'><p>The value to animate to. Is identical to specifying a <keyframe at='{duration}'>{to}</keyframe></p>\n</div></div></div></div></div><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-property'>Properties</h3><div class='subsection'><div id='property-inited' class='member first-child inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/dr.node' rel='dr.node' class='defined-in docClass'>dr.node</a><br/><a href='source/layout.html#dr-node-property-inited' target='_blank' class='view-source'>view source</a></div><a href='#!/api/dr.node-property-inited' class='name expandable'>inited</a> : Boolean<span class=\"signature\"><span class='readonly' >readonly</span></span></div><div class='description'><div class='short'><p>True when this node and all its children are completely initialized</p>\n</div><div class='long'><p>True when this node and all its children are completely initialized</p>\n</div></div></div></div></div><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-method'>Methods</h3><div class='subsection'><div id='method-destroy' class='member first-child inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/dr.node' rel='dr.node' class='defined-in docClass'>dr.node</a><br/><a href='source/layout.html#dr-node-method-destroy' target='_blank' class='view-source'>view source</a></div><a href='#!/api/dr.node-method-destroy' class='name expandable'>destroy</a>( <span class='pre'></span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Destroys this node ...</div><div class='long'><p>Destroys this node</p>\n</div></div></div><div id='method-doSubnodeAdded' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/dr.node' rel='dr.node' class='defined-in docClass'>dr.node</a><br/><a href='source/layout.html#dr-node-method-doSubnodeAdded' target='_blank' class='view-source'>view source</a></div><a href='#!/api/dr.node-method-doSubnodeAdded' class='name expandable'>doSubnodeAdded</a>( <span class='pre'>node</span> ) : void<span class=\"signature\"></span></div><div class='description'><div class='short'>Called when a subnode is added to this node. ...</div><div class='long'><p>Called when a subnode is added to this node. Provides a hook for\nsubclasses. No need for subclasses to call super. Do not call this\nmethod to add a subnode. Instead call setParent.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>node</span> : <a href=\"#!/api/dr.node\" rel=\"dr.node\" class=\"docClass\">dr.node</a><div class='sub-desc'><p>The subnode that was added.</p>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>void</span><div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-doSubnodeRemoved' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/dr.node' rel='dr.node' class='defined-in docClass'>dr.node</a><br/><a href='source/layout.html#dr-node-method-doSubnodeRemoved' target='_blank' class='view-source'>view source</a></div><a href='#!/api/dr.node-method-doSubnodeRemoved' class='name expandable'>doSubnodeRemoved</a>( <span class='pre'>node</span> ) : void<span class=\"signature\"></span></div><div class='description'><div class='short'>Called when a subnode is removed from this node. ...</div><div class='long'><p>Called when a subnode is removed from this node. Provides a hook for\nsubclasses. No need for subclasses to call super. Do not call this\nmethod to remove a subnode. Instead call _removeFromParent.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>node</span> : <a href=\"#!/api/dr.node\" rel=\"dr.node\" class=\"docClass\">dr.node</a><div class='sub-desc'><p>The subnode that was removed.</p>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>void</span><div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-sendEvent' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Eventable' rel='Eventable' class='defined-in docClass'>Eventable</a><br/><a href='source/layout.html#Eventable-method-sendEvent' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Eventable-method-sendEvent' class='name expandable'>sendEvent</a>( <span class='pre'>name, value</span> ) : <a href=\"#!/api/Eventable\" rel=\"Eventable\" class=\"docClass\">Eventable</a><span class=\"signature\"><span class='chainable' >chainable</span></span></div><div class='description'><div class='short'>Sends an event ...</div><div class='long'><p>Sends an event</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>name</span> : String<div class='sub-desc'><p>the name of the event to send</p>\n</div></li><li><span class='pre'>value</span> : Object<div class='sub-desc'><p>the value to send with the event</p>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'><a href=\"#!/api/Eventable\" rel=\"Eventable\" class=\"docClass\">Eventable</a></span><div class='sub-desc'><p>this</p>\n</div></li></ul></div></div></div><div id='method-setAttribute' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Eventable' rel='Eventable' class='defined-in docClass'>Eventable</a><br/><a href='source/layout.html#Eventable-method-setAttribute' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Eventable-method-setAttribute' class='name expandable'>setAttribute</a>( <span class='pre'>name, value</span> ) : <a href=\"#!/api/Eventable\" rel=\"Eventable\" class=\"docClass\">Eventable</a><span class=\"signature\"><span class='chainable' >chainable</span></span></div><div class='description'><div class='short'>Sets an attribute, calls a setter if there is one, then sends an event with the new value ...</div><div class='long'><p>Sets an attribute, calls a setter if there is one, then sends an event with the new value</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>name</span> : String<div class='sub-desc'><p>the name of the attribute to set</p>\n</div></li><li><span class='pre'>value</span> : Object<div class='sub-desc'><p>the value to set to</p>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'><a href=\"#!/api/Eventable\" rel=\"Eventable\" class=\"docClass\">Eventable</a></span><div class='sub-desc'><p>this</p>\n</div></li></ul></div></div></div><div id='method-setAttributes' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Eventable' rel='Eventable' class='defined-in docClass'>Eventable</a><br/><a href='source/layout.html#Eventable-method-setAttributes' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Eventable-method-setAttributes' class='name expandable'>setAttributes</a>( <span class='pre'>attributes</span> ) : <a href=\"#!/api/Eventable\" rel=\"Eventable\" class=\"docClass\">Eventable</a><span class=\"signature\"><span class='chainable' >chainable</span></span></div><div class='description'><div class='short'>Calls setAttribute for each name/value pair in the attributes object ...</div><div class='long'><p>Calls setAttribute for each name/value pair in the attributes object</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>attributes</span> : Object<div class='sub-desc'><p>An object of name/value pairs to be set</p>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'><a href=\"#!/api/Eventable\" rel=\"Eventable\" class=\"docClass\">Eventable</a></span><div class='sub-desc'><p>this</p>\n</div></li></ul></div></div></div></div></div><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-event'>Events</h3><div class='subsection'><div id='event-ondestroy' class='member first-child inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/dr.node' rel='dr.node' class='defined-in docClass'>dr.node</a><br/><a href='source/layout.html#dr-node-event-ondestroy' target='_blank' class='view-source'>view source</a></div><a href='#!/api/dr.node-event-ondestroy' class='name expandable'>ondestroy</a>( <span class='pre'>node</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Fired when this node and all its children are about to be destroyed ...</div><div class='long'><p>Fired when this node and all its children are about to be destroyed</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>node</span> : <a href=\"#!/api/dr.node\" rel=\"dr.node\" class=\"docClass\">dr.node</a><div class='sub-desc'><p>The <a href=\"#!/api/dr.node\" rel=\"dr.node\" class=\"docClass\">dr.node</a> that fired the event</p>\n</div></li></ul></div></div></div><div id='event-onend' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='dr.animator'>dr.animator</span><br/><a href='source/classdocs.html#dr-animator-event-onend' target='_blank' class='view-source'>view source</a></div><a href='#!/api/dr.animator-event-onend' class='name expandable'>onend</a>( <span class='pre'></span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Fired when animation ends ...</div><div class='long'><p>Fired when animation ends</p>\n</div></div></div><div id='event-oninit' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/dr.node' rel='dr.node' class='defined-in docClass'>dr.node</a><br/><a href='source/layout.html#dr-node-event-oninit' target='_blank' class='view-source'>view source</a></div><a href='#!/api/dr.node-event-oninit' class='name expandable'>oninit</a>( <span class='pre'>node</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Fired when this node and all its children are completely initialized ...</div><div class='long'><p>Fired when this node and all its children are completely initialized</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>node</span> : <a href=\"#!/api/dr.node\" rel=\"dr.node\" class=\"docClass\">dr.node</a><div class='sub-desc'><p>The <a href=\"#!/api/dr.node\" rel=\"dr.node\" class=\"docClass\">dr.node</a> that fired the event</p>\n</div></li></ul></div></div></div><div id='event-onstart' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='dr.animator'>dr.animator</span><br/><a href='source/classdocs.html#dr-animator-event-onstart' target='_blank' class='view-source'>view source</a></div><a href='#!/api/dr.animator-event-onstart' class='name expandable'>onstart</a>( <span class='pre'></span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Fired when animation starts ...</div><div class='long'><p>Fired when animation starts</p>\n</div></div></div><div id='event-ontick' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='dr.animator'>dr.animator</span><br/><a href='source/classdocs.html#dr-animator-event-ontick' target='_blank' class='view-source'>view source</a></div><a href='#!/api/dr.animator-event-ontick' class='name expandable'>ontick</a>( <span class='pre'></span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Fired every step of the animation ...</div><div class='long'><p>Fired every step of the animation</p>\n</div></div></div></div></div></div></div>","meta":{}});