/*
 The MIT License (MIT)

 Copyright ( c ) 2014-2015 Teem2 LLC

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in all
 copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 SOFTWARE.

Dreem shared core between client and server

*/

var dr = (function(){
	
	var dr = {}

	// Auto connecting websocket with a queue
	dr.BusClient = (function(){
		function BusClient(url){
			this.url = url
			this.backoff = 1
			this.reconnect()
		}

		BusClient.prototype.disconnect = function(){
			if(this.socket){
				this.socket.onclose = undefined
				this.socket.onerror = undefined
				this.socket.onmessage = undefined
				this.socket.onopen = undefined
				this.socket.close()
				this.socket = undefined
			}
		}

		BusClient.prototype.reconnect = function(){
			this.disconnect()
			if(!this.queue) this.queue = []

			this.socket = new WebSocket('ws://'+location.host)

			this.socket.onopen = function(){
				this.backoff = 1
				for(var i = 0;i<this.queue.length;i++){
					this.socket.send(this.queue[i])
				}
				this.queue = undefined
			}.bind(this)

			this.socket.onerror = function(){
				//this.reconnect()
			}.bind(this)

			this.socket.onclose = function(){
				this.backoff *= 2
				if(this.backoff > 1000) this.backoff = 1000
				setTimeout(function(){
					this.reconnect()
				}.bind(this),this.backoff)
			}.bind(this)

			this.socket.onmessage = function(event){
				var msg = JSON.parse(event.data)
				this.onMessage(msg)
			}.bind(this)
		}

		BusClient.prototype.send = function(msg){
			msg = JSON.stringify(msg)
			if(this.queue) this.queue.push(msg)
			else this.socket.send(msg)
		}

		BusClient.prototype.color = function(data){
			this.send({type:'color', value:data})
		}

		BusClient.prototype.log = function(data){
			this.send({type:'log', value:data})
		}

		// todo use event mechanism
		BusClient.prototype.onMessage = function(message){
		}

		return BusClient
	})()

	// Browser boot code
	if(typeof process !== 'object'){
		// compile a dreemstring and return all dependencies + dreem XML in a JSON-ifyable object structure 
		dr.compile  = function(dreemhtml, callback){

			var compiler = new dr.Compiler()

			compiler.reader = function(file, callback){
				if(file === location.pathname) return callback(null, dreemhtml, file)

				if(!file.indexOf) debugger
				if(file.indexOf('.') === -1) file += '.dre'
				var xhr = new XMLHttpRequest()
				xhr.open("GET", file, true)
				xhr.onreadystatechange = function(){
					if(xhr.readyState == 4){
						if(xhr.status != 200) return callback(new dr.Error('Error loading file ' + file + ' return ' + xhr.status))
						return callback(null, xhr.responseText, file)
					}
				}
				xhr.send()
			}

			compiler.execute(location.pathname,callback)
		}

		dr.busclient = new dr.BusClient(location.href)

		// receive server messages, such as file changes
		dr.busclient.onMessage = function(message){
			if(message.type == 'filechange'){
				// reload self on filechange
				location.href = location.href
			}
			else if(message.type == 'close'){
				window.close()
			}
			else if(message.type == 'delay'){
				console.log('Delaying refresh!')
				setTimeout(function(){
					location.href = location.href
				},1500)
			}
		}

		document.onreadystatechange = function () {
		  if (document.readyState == "complete") {
		  	// find the first view tag
		  	var v = document.getElementsByTagName('view')[0]
		  	// lets pass our innerHtml to our compiler
		  	dr.compile(v.innerHTML, function(error, pkg){

		  		// process error array
		  		if(error){
		  			if(!Array.isArray(error)) error = [error]
		  			error.forEach(function(err){
		  				console.error(err.toString())
		  			})
		  			// send all errors to the server so it can open them in the editor
		  			dr.busclient.send({
		  				type:'error',
		  				errors:error
		  			})
		  			return
		  		}
		  		// something fun
				dr.busclient.color('~br~D~bb~R~bm~E~bg~E~by~M~~ client has successfully parsed!\n')


		  	})
		  }
		}
		// lets start the websocket connection
	}
	else module.exports = dr // otherwise we are in node.js

	// Error class
	dr.Error = (function(){
		function Error(message, path, line, col){
			this.message = message
			this.path = path
			this.line = line
			this.col = col
		}

		Error.prototype.toString = function(){
			return 'Dreem Error: '+this.path+(this.line!==undefined?":"+this.line+(this.col?":"+this.col:""):"")+"- " + this.message 
		}

		return Error
	})()

	dr.Compiler = (function(){

		function Compiler(){
			this.filehash = {} // all the dreem files by file-key
			this.origin_id = 0 // file id counter for json-map-back
		}

		// These tags are ignored for class loading
		Compiler.prototype.builtin = {
			view:1,
			class:1,
			method:1,
			attribute:1,
			handler:1,
			setter:1,
			getter:1,
			layout:1,
			node:1
		}

		// supported languages
		Compiler.prototype.languages = {
			js:{
				lib:'lib/acorn.js',
				compile:function(string, lib, args){
					// this returns a compiled function or an error
					if(!this.module) new Function('module','exports',lib.data)({},this.module = {})
					try{ // we parse it just for errors
						this.module.parse('function __parsetest__('+args.join(',')+'){'+string+'}')
					}
					catch(e){
						return new dr.Error(e.message, undefined, e.loc && e.loc.line - 1, e.loc && e.loc.column)
					}
					return string
				}
			},
			coffee:{
				lib:'lib/coffee-script.js',
				compile:function(string, lib, args){
					// compile coffeescript
					if(!this.module) new Function(lib.data).call(this.module = {})
					// compile the code
					try{
						var out = this.module.CoffeeScript.compile(string)
					}
					catch(e){ // we have an exception. throw it back
						return new dr.Error(e.message, undefined, e.location && e.location.first_line, e.location && e.location.first_column)
					}
					// lets return the blob without the function headers
					return out.split('\n').slice(1,-2).join('\n')
				}
			}
		}

		// default directory prefixes
		Compiler.prototype.class_dir = 'classes/'

		// overload these functions 
		Compiler.prototype.reader = function(name, callback){ throw new Error('Abstract function') }
		
		Compiler.prototype.originError = function(message, origin){
			var orig = origin.split('_')
			var id = orig[0], offset = parseInt(orig[1])
			var line = 1, col = 0
			var file
			var name 
			for(var k in this.filehash) if(this.filehash[k].id == id){
				file = this.filehash[k]
				name = k
				break
			}
			if(!file) return new Error('Cant find origin '+origin, 'unknown')
			var data = file.data
			var path = file.path
			for(var i = 0;i < data.length && i<offset; i++, col++){
				if(data.charCodeAt(i) == 10) line++, col = 1
			}
			return new dr.Error(message, path, line, col)
		}

		// loads  / caches a File
		Compiler.prototype.cache = function(name, callback){
			if(this.filehash[name]) return callback(null, this.filehash[name])
			this.reader(name, function(err, data, fullpath){
				if(err) return callback(err)
				var file = this.filehash[name] = {
					name: name,
					id:	this.origin_id++,
					path: fullpath,
					data: typeof data === 'string'?data:data.toString()
				}

				return callback(null, file)
			}.bind(this))
		}

		Compiler.prototype.parseDre = function(name, callback){

			this.cache(name, function(err, file){
				if(err) return callback(err)

				var parser = new dr.HTMLParser(file.id)
				var jsobj = parser.parse(file.data)

				// forward the parser errors 
				if(parser.errors.length){
					var err = parser.errors.map(function(e){
						return this.originError(e.message, file.id+'_'+e.where)
					}.bind(this))
					
					return callback(err)
				}

				return callback(null, jsobj)
			}.bind(this))
		}

		Compiler.prototype.concatCode = function(node){
			var out = ''
			var children = node.child
			if(!children || !children.length) return ''
			for(var i = 0; i<children.length;i++){
				if(children[i].tag == '$text') out += children[i].value
			}
			return out
		}

		Compiler.prototype.loader = function(node, callback){
			var deps = {} // dependency hash, stores the from-tags for error reporting
			var loading = 0 // number of in flight dependencies
			var errors = [] // the error array
			var output = {node:node, js:{}, classes:{}, methods:[]}
			var method_id = 0
			var loadJS = function(file, from_node){
				// loads javascript
				if(file in output.js) return
				if(!deps[file]){
					deps[file] = [from_node]
					loading++
					this.cache(file, function(err, data){
						if(err){
							errors.push(err)
							var mydep = deps[file]
							for(var i = 0;i < mydep.length; i++){
								errors.push(this.originError('JS file '+name+' used here but could not be loaded', mydep[i]._))
							}
						}
						output.js[file] = data
						if(!--loading) errors.length? callback(errors): callback(null, output)
					})
				}
				else deps[file].push(from_node)
			}.bind(this)

			var loadClass = function(name, from_node){
				if(name in this.builtin) return
				if(name in output.classes) return
				
				output.classes[name] = 2 // mark tag as loading but not defined yet

				if(!deps[name]){
					deps[name] = [from_node]
					loading++
					// we should make the load order deterministic by force serializing the dependency order
					this.parseDre(this.class_dir + name, function(err, jsobj){
						if(!err) walk(jsobj, null, 'js')
						else{
							if(Array.isArray(err)) errors.push.apply(errors, err)
							else errors.push(err)
							// lets push our errors in err
							var mydep = deps[name]
							for(var i = 0;i < mydep.length; i++){
								errors.push(this.originError('class '+name+' used here could not be loaded', mydep[i]._))
							}
						}
						if(!--loading) errors.length? callback(errors): callback(null, output)
					}.bind(this))
				}
				else deps[name].push(from_node)
			}.bind(this)

			var walk = function(node, parent, language){
				if(node.tag.charAt(0)!='$') loadClass(node.tag, node)
				if(node.tag == 'class'){
					if(node.type) language = node.type
					// create a new tag
					output.classes[node.name] = node
					// check extends and view
					if(node.extends){
						node.extends.split(/,\s*/).forEach(function(cls){
							loadClass(cls, node)
						})
					}
					if(node.with){
						node.with.split(/,\s*/).forEach(function(cls){
							loadClass(cls, node)
						})
					}
					if(node.scriptincludes){ // load the script includes
						node.scriptincludes.split(/,\s*/).forEach(function(js){
							loadJS(js, node)
						})
					}
				}
				// lazy load the language processor
				if(node.tag == 'method' || node.tag=='handler' || node.tag == 'getter' || node.tag == 'setter'){
					// potentially 'regexp' createTag or something here?

					if(node.type) language = node.type
					// lets on-demand load the language
					var langproc = this.languages[language]
					if(!langproc){
						errors.push(this.originError('Unknown language used '+language, node._))
						return
					}
					else loadJS(langproc.lib, node)

					// give the method a unique but human readable name
					var name = node.tag + '_' + node.name + '_' + node._ + '_' + language
					if(parent && parent.tag == 'class') name = parent.name + '_' + name

					node.method_id = output.methods.length
					output.methods.push({
						language: language,
						name:name,
						args: node.args? node.args.split(/,\s*/): [],
						source: this.concatCode(node),
						origin: node._
					})
					// clear child
					node.child = undefined
				}
				if(node.child) for(var i = 0;i<node.child.length;i++){
					walk(node.child[i], node, language)
				}
			}.bind(this)

			walk(node, null, 'js')
			// the impossible case of no dependencies
			if(!loading) errors.length? callback(errors): callback(null, output)
		}

		Compiler.prototype.execute = function(rootname, callback){
			// load the root
			this.parseDre(rootname, function(err, jsobj){

				if(err) return callback(err)

				this.loader(jsobj, function(err, output){
					if(err) return callback(err)

					// Compile all methods / getters/setters/handlers using the language it has
					var errors = []
					var methods = output.methods
					var code = ''
					for(var i = 0;i < methods.length; i++){
						var method = methods[i]
						var lang = this.languages[method.language]

						var compiled = lang.compile(method.source, output.js[lang.lib], method.args)
						
						if(compiled instanceof dr.Error){ // the compiler returned an error
							var err = this.originError(compiled.message, method.origin)
							err.line += compiled.line // adjust for origin
							errors.push(err)
						}
						else{
							// lets build a nice function out of it
							code += 'methods['+i+'] = function '+method.name+'('+ method.args.join(', ') + '){\n' + 
								compiled + '\n}\n' 
						}
					}

					if(errors.length) return callback(errors)
					
					// lets package up the output
					var pkg = {
						js: output.js, // key value list of js files
						methods: code, // the methods codeblock 
						root: jsobj,   // the dreem root file passed into execute
						classes: output.classes // the key/value set of dreem classes as JSON-XML
					}

					return callback(null, pkg)
				}.bind(this))

			}.bind(this))
		}
		return Compiler	
	})()

	// the HTML parser
	dr.HTMLParser = (function(){

		var void_tag = {
			'area':1, 'base':1, 'br':1, 'col':1, 'embed':1, 'hr':1, 'img':1, 
			'input':1, 'keygen':1, 'link':1, 'menuitem':1, 'meta':1, 'param':1, 'source':1, 'track':1, 'wbr':1
		}

		function HTMLParser(file_id){
			this.file_id = file_id || 0
		}

		HTMLParser.prototype.reserialize = function(node, spacing, indent){
			if(spacing === undefined) spacing = '\t'
			var ret = ''
			var child = ''
			if(node.child){
				for(var i = 0, l = node.child.length; i<l; i++){
					var sub = node.child[i]
					child += this.reserialize(node.child[i], spacing, indent === undefined?'': indent + spacing)
				}
			}
			if(!node.tag) return child
			if(node.tag.charAt(0) !== '$'){
				ret += indent + '<' + node.tag
				for(var k in node){
					if(k !== 'tag' && k !== 'child' && k !== '_'){
						var val = node[k]
						if(ret[ret.length - 1] != ' ') ret += ' '
						ret += k
						var delim = "'"
						if(val !== 1){
							if(val.indexOf(delim) !== -1) delim = '"'
							ret += '=' + delim + val + delim
						}
					}
				}
				if(child) ret += '>\n' + child + indent + '</' + node.tag + '>\n'
				else ret += '/>\n'
			}
			else{
				if(node.tag == '$text') ret += indent + node.value + '\n' 
				else if(node.tag == '$cdata') ret += indent + '<![CDATA['+node.value+']]>\n'
				else if(node.tag == '$comment') ret += indent + '<!--'+node.value+'-->\n'
				else if(node.tag == '$root') ret += child
			}
			return ret
		}

		// insert a new tag by name
		HTMLParser.prototype.appendChild = function(node, value){
			var i = 0
			if(!node.child) node.child = [value]
			else node.child.push(value)
		}

		HTMLParser.prototype.createNode = function(tag, charpos){
			return {tag:tag, _:this.file_id + '_' + charpos}
		} // text node

		HTMLParser.prototype.error = function(message, where){
			this.errors.push({message:message, where:where})
		}

		var isempty = /^[\r\n\s]+$/ // discard empty textnodes
		HTMLParser.prototype.text = function(value, start){
			if(!value.match(isempty)){
				var node = this.createNode('$text')
				node.value = value
				this.appendChild(this.node,node)
			}
		}

		HTMLParser.prototype.comment = function(value, start, end){
			var node = this.createNode('$comment', start)
			node.value = value
			this.appendChild(this.node, node)
		} // comment node <!-- -->

		HTMLParser.prototype.cdata = function(value, start, end){
			var node = this.createNode('$cdata', start)
			node.value = value
			this.appendChild(this.node, node)
		} // cdata section <![CDATA[ ]]>

		HTMLParser.prototype.process = function(value, start, end){
			var node = this.createNode('$process', start)
			node.value = value
			this.appendChild(this.node, node)
		} // process <? ?>

		HTMLParser.prototype.begin = function(name, start, end){
			var newnode = this.createNode(name, start)

			this.appendChild(this.node, newnode)

			// push the state and set it
			this.parents.push(this.node, this.tagname, this.tagstart)
			this.tagstart = start
			this.tagname = name
			this.node = newnode
			
		} // begin tag

		HTMLParser.prototype.end = function(start, end){
			this.last_attr = undefined
			if(this.tagname in void_tag || this.tagname.charCodeAt(0) == 33){
				this.tagstart = this.parents.pop()
				this.tagname = this.parents.pop()
				this.node = this.parents.pop()
			}
		} // end tag, not called when self closing

		HTMLParser.prototype.close = function(name, start, end){
			this.last_attr = undefined
			// attempt to match closing tag
			if(this.tagname !== name){
				this.error('Tag mismatch </' + name + '> with <' + this.tagname+'>', start, this.tagstart)
			}
			// attempt to fix broken html
			//while(this.node && name !== undefined && this.tagname !== name && this.parents.length){
			//	this.tagname = this.parents.pop()
			//	this.node = this.parents.pop()
			//}
			if(this.parents.length){
				this.tagstart = this.parents.pop()
				this.tagname = this.parents.pop()
				this.node = this.parents.pop()
			}
			else{
				this.error('Dangling closing tag </' + name + '>', start)
			}
		} // close tag
		
		HTMLParser.prototype.selfclose = function(start, end){
			this.close(this.tagname, start)
		}

		HTMLParser.prototype.attr = function(name, start, end){
			if(name == 'tag' || name == 'child'){
				this.error('Attribute name collision with JSON structure'+name, start)
				name = '_' + name
			}
			this.last_attr = name
			if(this.last_attr in this.node){
				this.error('Duplicate attribute ' + name + ' in tag '+this.tagname, start)
			}
			this.node[this.last_attr] = null
		} 
		// attribute name

		HTMLParser.prototype.value = function(val, start, end){
			if(this.last_attr === undefined){
				this.error('Unexpected attribute value ' + val, start)
			}
			else{
				this.node[this.last_attr] = val
			}
		} // attribute value

		// todo use these
		var entities = {
			"amp":"&","gt":">","lt":"<","quot":"\"","apos":"'","AElig":198,"Aacute":193,"Acirc":194,
			"Agrave":192,"Aring":197,"Atilde":195,"Auml":196,"Ccedil":199,"ETH":208,"Eacute":201,"Ecirc":202,
			"Egrave":200,"Euml":203,"Iacute":205,"Icirc":206,"Igrave":204,"Iuml":207,"Ntilde":209,"Oacute":211,
			"Ocirc":212,"Ograve":210,"Oslash":216,"Otilde":213,"Ouml":214,"THORN":222,"Uacute":218,"Ucirc":219,
			"Ugrave":217,"Uuml":220,"Yacute":221,"aacute":225,"acirc":226,"aelig":230,"agrave":224,"aring":229,
			"atilde":227,"auml":228,"ccedil":231,"eacute":233,"ecirc":234,"egrave":232,"eth":240,"euml":235,
			"iacute":237,"icirc":238,"igrave":236,"iuml":239,"ntilde":241,"oacute":243,"ocirc":244,"ograve":242,
			"oslash":248,"otilde":245,"ouml":246,"szlig":223,"thorn":254,"uacute":250,"ucirc":251,"ugrave":249,
			"uuml":252,"yacute":253,"yuml":255,"copy":169,"reg":174,"nbsp":160,"iexcl":161,"cent":162,"pound":163,
			"curren":164,"yen":165,"brvbar":166,"sect":167,"uml":168,"ordf":170,"laquo":171,"not":172,"shy":173,
			"macr":175,"deg":176,"plusmn":177,"sup1":185,"sup2":178,"sup3":179,"acute":180,"micro":181,"para":182,
			"middot":183,"cedil":184,"ordm":186,"raquo":187,"frac14":188,"frac12":189,"frac34":190,"iquest":191,
			"times":215,"divide":247,"OElig":338,"oelig":339,"Scaron":352,"scaron":353,"Yuml":376,"fnof":402,
			"circ":710,"tilde":732,"Alpha":913,"Beta":914,"Gamma":915,"Delta":916,"Epsilon":917,"Zeta":918,
			"Eta":919,"Theta":920,"Iota":921,"Kappa":922,"Lambda":923,"Mu":924,"Nu":925,"Xi":926,"Omicron":927,
			"Pi":928,"Rho":929,"Sigma":931,"Tau":932,"Upsilon":933,"Phi":934,"Chi":935,"Psi":936,"Omega":937,
			"alpha":945,"beta":946,"gamma":947,"delta":948,"epsilon":949,"zeta":950,"eta":951,"theta":952,
			"iota":953,"kappa":954,"lambda":955,"mu":956,"nu":957,"xi":958,"omicron":959,"pi":960,"rho":961,
			"sigmaf":962,"sigma":963,"tau":964,"upsilon":965,"phi":966,"chi":967,"psi":968,"omega":969,
			"thetasym":977,"upsih":978,"piv":982,"ensp":8194,"emsp":8195,"thinsp":8201,"zwnj":8204,"zwj":8205,
			"lrm":8206,"rlm":8207,"ndash":8211,"mdash":8212,"lsquo":8216,"rsquo":8217,"sbquo":8218,"ldquo":8220,
			"rdquo":8221,"bdquo":8222,"dagger":8224,"Dagger":8225,"bull":8226,"hellip":8230,"permil":8240,
			"prime":8242,"Prime":8243,"lsaquo":8249,"rsaquo":8250,"oline":8254,"frasl":8260,"euro":8364,
			"image":8465,"weierp":8472,"real":8476,"trade":8482,"alefsym":8501,"larr":8592,"uarr":8593,
			"rarr":8594,"darr":8595,"harr":8596,"crarr":8629,"lArr":8656,"uArr":8657,"rArr":8658,"dArr":8659,
			"hArr":8660,"forall":8704,"part":8706,"exist":8707,"empty":8709,"nabla":8711,"isin":8712,
			"notin":8713,"ni":8715,"prod":8719,"sum":8721,"minus":8722,"lowast":8727,"radic":8730,"prop":8733,
			"infin":8734,"ang":8736,"and":8743,"or":8744,"cap":8745,"cup":8746,"int":8747,"there4":8756,"sim":8764,
			"cong":8773,"asymp":8776,"ne":8800,"equiv":8801,"le":8804,"ge":8805,"sub":8834,"sup":8835,"nsub":8836,
			"sube":8838,"supe":8839,"oplus":8853,"otimes":8855,"perp":8869,"sdot":8901,"lceil":8968,"rceil":8969,
			"lfloor":8970,"rfloor":8971,"lang":9001,"rang":9002,"loz":9674,"spades":9824,"clubs":9827,"hearts":9829,
			"diams":9830
		}

		// HTML parser function, 110 loc and very forgiving.
		HTMLParser.prototype.parse = function(source){
			// lets create some state
			var root = this.node = this.createNode('$root',0)

			this.errors = []
			this.parents = []
			this.last_attr = undefined
			this.tagname = ''

			if(typeof source != 'string') source = source.toString()
			var len = source.length
			var pos = 0
			var start = pos
			while(pos < len){
				var ch = source.charCodeAt(pos++)
				if(ch == 60){ // <
					var next = source.charCodeAt(pos)
					if(next == 32 || next == 9 || next == 10 || next == 12 || (next >=48 && next <= 57)) continue
					// lets emit textnode since last
					if(start != pos - 1 && this.text) this.text(source.slice(start, pos - 1), start, pos - 1)
					if(next == 33){ // <!
						after = source.charCodeAt(pos+1)
						if(after == 45){ // <!- comment
							pos += 2
							while(pos < len){
								ch = source.charCodeAt(pos++)
								if(ch == 45 && source.charCodeAt(pos) == 45 &&
								    source.charCodeAt(pos + 1) == 62){
									pos += 2
									this.comment(source.slice(start, pos - 3), start - 4, pos)
									break
								}
								else if(pos == len) this.error("Unexpected end of files while reading <!--", start)
							}
							start = pos
							continue
						}
						if(after == 91){ // <![ probably followed by CDATA[ just parse to ]]>
							pos += 8
							start = pos
							while(pos < len){
								ch = source.charCodeAt(pos++)
								if(ch == 93 && source.charCodeAt(pos) == 93 &&
								    source.charCodeAt(pos + 1) == 62){
									pos += 2
									this.cdata(source.slice(start, pos - 3), start - 8, pos)
									break
								}
								else if(pos == len) this.error("Unexpected end of file while reading <![", start)
							}
							start = pos
							continue
						}
					}
					if(next == 63){ // <? command
						pos++
						start = pos
						while(pos < len){
							ch = source.charCodeAt(pos++)
							if(ch == 63 && source.charCodeAt(pos) == 62){
								pos++
								this.process(source.slice(start, pos - 2), start - 1, pos)
								break
							}
							else if(pos == len) this.error("Unexpected end of file while reading <?", start)
						}
						start = pos
						continue
					}
					if(next == 47){ // </ closing tag
						start = pos + 1
						while(pos < len){
							ch = source.charCodeAt(pos++)
							if(ch == 62){
								this.close(source.slice(start, pos - 1), start, pos)
								break
							}
							else if(pos == len) this.error("Unexpected end of file at </"+source.slice(start, pos), start)
						}
						start = pos
						continue
					}
					
					start = pos // try to parse a tag
					var tag = true // first name encountered is tagname
					while(pos < len){
						ch = source.charCodeAt(pos++)
						// whitespace, end of tag or assign
						// if we hit a s
						if(ch == 62 || ch == 47 || ch == 10 || ch == 12 || ch ==32 || ch == 61){
							if(start != pos - 1){
								if(tag){ // lets emit the tagname
									this.begin(source.slice(start, pos - 1), start - 1, pos)
									tag = false
								}// emit attribute name
								else this.attr(source.slice(start, pos - 1), start, pos)
							}
							start = pos
							if(ch == 62){ // >
								this.end(pos)
								break
							}
							else if(ch == 47 && source.charCodeAt(pos) == 62){ // />
								pos++
								this.selfclose(pos)
								break
							}
						}
						else if(ch == 34 || ch == 39){ // " or '
							start = pos
							var end = ch
							while(pos < len){
								ch = source.charCodeAt(pos++)
								if(ch == end){
									this.value(source.slice(start, pos - 1), start, pos)
									break
								}
								else if(pos == len) this.error("Unexpected end of file while reading attribute", start)
							}
							start = pos
						}
						else if(ch == 60) this.error("Unexpected < while parsing a tag", start)
					}
					start = pos
				} 
			}
			if(this.parents.length) this.error("Missign closing tags at end", pos)
			return root
		}

		return HTMLParser
	})()
})()