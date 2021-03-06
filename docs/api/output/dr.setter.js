Ext.data.JsonP.dr_setter({"tagname":"class","name":"dr.setter","autodetected":{},"files":[{"filename":"dreem.js","href":"dreem.html#dr-setter"}],"members":[{"name":"args","tagname":"attribute","owner":"dr.setter","id":"attribute-args","meta":{}},{"name":"name","tagname":"attribute","owner":"dr.setter","id":"attribute-name","meta":{"required":true}},{"name":"type","tagname":"attribute","owner":"dr.setter","id":"attribute-type","meta":{}}],"alternateClassNames":[],"aliases":{},"id":"class-dr.setter","short_doc":"Declares a setter in a node, view, class or other class instance. ...","component":false,"superclasses":[],"subclasses":[],"mixedInto":[],"mixins":[],"parentMixins":[],"requires":[],"uses":[],"html":"<div><pre class=\"hierarchy\"><h4>Files</h4><div class='dependency'><a href='source/dreem.html#dr-setter' target='_blank'>dreem.js</a></div></pre><div class='doc-contents'><p>Declares a setter in a node, view, class or other class instance. Setters can only be created with the &lt;setter>&lt;/setter> tag syntax.</p>\n\n<p>Setters allow the default behavior of attribute changes to be changed.</p>\n\n<p>Specialized handling required when attributes are set can be defined with the builtin '&lt;setter&gt;' tag.  The return value of\na '&lt;setter&gt;' will be the value set in the attribute.</p>\n\n<pre><code>&lt;node id=\"movie\"&gt;\n  &lt;attribute name=\"title\" type=\"string\" value=\"\"&gt;&lt;/attribute&gt;\n\n  &lt;setter name=\"title\" args=\"t\" type=\"coffee\"&gt;\n      t = t.replace(/^The\\s+/, '') if t;\n      return t;\n  &lt;/setter&gt;\n\n&lt;/node&gt;\n</code></pre>\n\n<p>In some cases you may need the value of an attribute to be set by the setter itself and not by the returned value, for\nthese cases a 'noop' object can be returned, indicating that no special action should be taken to automatically set the attribute.</p>\n\n<pre><code>&lt;node id=\"asyncMovie\"&gt;\n  &lt;attribute name=\"title\" type=\"string\" value=\"\"&gt;&lt;/attribute&gt;\n\n  &lt;setter name=\"title\" args=\"t\"&gt;\n      var slf = this;\n      this.performNetworkOperation(t, function(returnedValue){\n        slf.title = returnedValue;\n      });\n      return noop;\n  &lt;/setter&gt;\n\n&lt;/node&gt;\n</code></pre>\n</div><div class='members'><div class='members-section'><h3 class='members-title icon-attribute'>Attributes</h3><div class='subsection'><div class='definedBy'>Defined By</div><h4 class='members-subtitle'>Required attributes</h3><div id='attribute-name' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='dr.setter'>dr.setter</span><br/><a href='source/dreem.html#dr-setter-attribute-name' target='_blank' class='view-source'>view source</a></div><a href='#!/api/dr.setter-attribute-name' class='name expandable'>name</a> : String<span class=\"signature\"><span class='required' >required</span></span></div><div class='description'><div class='short'><p>The name of the method.</p>\n</div><div class='long'><p>The name of the method.</p>\n</div></div></div></div><div class='subsection'><div class='definedBy'>Defined By</div><h4 class='members-subtitle'>Optional attributes</h3><div id='attribute-args' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='dr.setter'>dr.setter</span><br/><a href='source/dreem.html#dr-setter-attribute-args' target='_blank' class='view-source'>view source</a></div><a href='#!/api/dr.setter-attribute-args' class='name expandable'>args</a> : String[]<span class=\"signature\"></span></div><div class='description'><div class='short'><p>A comma separated list of method arguments.</p>\n</div><div class='long'><p>A comma separated list of method arguments.</p>\n</div></div></div><div id='attribute-type' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='dr.setter'>dr.setter</span><br/><a href='source/dreem.html#dr-setter-attribute-type' target='_blank' class='view-source'>view source</a></div><a href='#!/api/dr.setter-attribute-type' class='name expandable'>type</a> : \"js\"/\"coffee\"<span class=\"signature\"></span></div><div class='description'><div class='short'>The compiler to use for this method. ...</div><div class='long'><p>The compiler to use for this method. Inherits from the immediate class if unspecified.</p>\n</div></div></div></div></div></div></div>","meta":{}});