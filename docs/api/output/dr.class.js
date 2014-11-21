Ext.data.JsonP.dr_class({"tagname":"class","name":"dr.class","autodetected":{},"files":[{"filename":"layout.js","href":"layout.html#dr-class"}],"members":[{"name":"extends","tagname":"attribute","owner":"dr.class","id":"attribute-extends","meta":{}},{"name":"name","tagname":"attribute","owner":"dr.class","id":"attribute-name","meta":{"required":true}},{"name":"type","tagname":"attribute","owner":"dr.class","id":"attribute-type","meta":{}}],"alternateClassNames":[],"aliases":{},"id":"class-dr.class","short_doc":"Allows new tags to be created. ...","component":false,"superclasses":[],"subclasses":[],"mixedInto":[],"mixins":[],"parentMixins":[],"requires":[],"uses":[],"html":"<div><pre class=\"hierarchy\"><h4>Files</h4><div class='dependency'><a href='source/layout.html#dr-class' target='_blank'>layout.js</a></div></pre><div class='doc-contents'><p>Allows new tags to be created. Classes only be created with the &lt;class>&lt;/class> tag syntax.</p>\n\n<p>Classes can extend any other class, and they extend <a href=\"#!/api/dr.view\" rel=\"dr.view\" class=\"docClass\">dr.view</a> by default.</p>\n\n<p>Once declared, classes invoked with the declarative syntax, e.g. &lt;classname>&lt;/classname>.</p>\n\n<p>If a class can't be found in the document, dreem will automatically attempt to load it from the classes/* directory.</p>\n\n<p>Like views and nodes, classes can contain methods, handlers, setters, constraints, attributes and other view, node or class instances.</p>\n\n<p>Here is a class called 'tile' that extends <a href=\"#!/api/dr.view\" rel=\"dr.view\" class=\"docClass\">dr.view</a>. It sets the bgcolor, width, and height attributes. An instance of tile is created using declarative syntax.</p>\n\n<pre class='inline-example '><code>&lt;class name=\"tile\" extends=\"view\" bgcolor=\"thistle\" width=\"100\" height=\"100\"&gt;&lt;/class&gt;\n\n&lt;tile&gt;&lt;/tile&gt;\n</code></pre>\n\n<p>Now we'll extend the tile class with a class called 'labeltile', which contains a label inside of the box. We'll declare one each of tile and labeltile, and position them with a spacedlayout.</p>\n\n<pre class='inline-example '><code>&lt;class name=\"tile\" extends=\"view\" bgcolor=\"thistle\" width=\"100\" height=\"100\"&gt;&lt;/class&gt;\n\n&lt;class name=\"labeltile\" extends=\"tile\"&gt;\n  &lt;text text=\"Tile\"&gt;&lt;/text&gt;\n&lt;/class&gt;\n\n&lt;spacedlayout&gt;&lt;/spacedlayout&gt;\n&lt;tile&gt;&lt;/tile&gt;\n&lt;labeltile&gt;&lt;/labeltile&gt;\n</code></pre>\n\n<p>Attributes that are declared inside of a class definition can be set when the instance is declared. Here we bind the label text to the value of an attribute called label.</p>\n\n<pre class='inline-example '><code>&lt;class name=\"tile\" extends=\"view\" bgcolor=\"thistle\" width=\"100\" height=\"100\"&gt;&lt;/class&gt;\n\n&lt;class name=\"labeltile\" extends=\"tile\"&gt;\n  &lt;attribute name=\"label\" type=\"string\" value=\"\"&gt;&lt;/attribute&gt;\n  &lt;text text=\"${this.parent.label}\"&gt;&lt;/text&gt;\n&lt;/class&gt;\n\n&lt;spacedlayout&gt;&lt;/spacedlayout&gt;\n&lt;tile&gt;&lt;/tile&gt;\n&lt;labeltile label=\"The Tile\"&gt;&lt;/labeltile&gt;\n</code></pre>\n</div><div class='members'><div class='members-section'><h3 class='members-title icon-attribute'>Attributes</h3><div class='subsection'><div class='definedBy'>Defined By</div><h4 class='members-subtitle'>Required attributes</h3><div id='attribute-name' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='dr.class'>dr.class</span><br/><a href='source/layout.html#dr-class-attribute-name' target='_blank' class='view-source'>view source</a></div><a href='#!/api/dr.class-attribute-name' class='name expandable'>name</a> : String<span class=\"signature\"><span class='required' >required</span></span></div><div class='description'><div class='short'><p>The name of the new tag.</p>\n</div><div class='long'><p>The name of the new tag.</p>\n</div></div></div></div><div class='subsection'><div class='definedBy'>Defined By</div><h4 class='members-subtitle'>Optional attributes</h3><div id='attribute-extends' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='dr.class'>dr.class</span><br/><a href='source/layout.html#dr-class-attribute-extends' target='_blank' class='view-source'>view source</a></div><a href='#!/api/dr.class-attribute-extends' class='name expandable'>extends</a> : String<span class=\"signature\"></span></div><div class='description'><div class='short'>The name of a class that should be extended. ...</div><div class='long'><p>The name of a class that should be extended.</p>\n<p>Defaults to: <code>view</code></p></div></div></div><div id='attribute-type' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='dr.class'>dr.class</span><br/><a href='source/layout.html#dr-class-attribute-type' target='_blank' class='view-source'>view source</a></div><a href='#!/api/dr.class-attribute-type' class='name expandable'>type</a> : \"js\"/\"coffee\"<span class=\"signature\"></span></div><div class='description'><div class='short'>The default compiler to use for methods, setters and handlers. ...</div><div class='long'><p>The default compiler to use for methods, setters and handlers. Either 'js' or 'coffee'</p>\n<p>Defaults to: <code>js</code></p></div></div></div></div></div></div></div>","meta":{}});