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

Teem server, for commandline node teem.js --help
*/

/* Entry point */
function main(){
	var args = {}
	var argv = process.argv
	for(var lastkey='', arg, i = 0; i<argv.length; i++){
		arg = argv[i]
		if(arg.charAt(0) == '-') lastkey = arg, args[lastkey] = true
		else args[lastkey] = arg
	}

	if(args['-web']){
		args['-edit'] = true
		args['-notify'] = true
		args['-devtools'] = true
		args['-delay'] = true
		args['-browser'] = args['-web']
	}

	if(args['-h'] || args['-help'] || args['--h']|| args['--help']){
		console.color('~by~Teem~~ Server ~bm~2.0~~\n')
		console.color('commandline: node teem.js <flags>\n')
		console.color('~bc~-web htmlfile.html~~ Short for -edit -notify -devtools -delay -browser htmlfile.html\n')	
		console.color('~bc~-port ~br~[port]~~ Server port\n')
		console.color('~bc~-nomoni ~~ Start process without monitor\n')
		console.color('~bc~-iface ~br~[interface]~~ Server interface\n')
		console.color('~bc~-browser~~ Opens webbrowser on default app\n')
		console.color('~bc~-notify~~ Shows errors in system notification\n')
		console.color('~bc~-devtools~~ Automatically opens devtools in the browser\n')
		console.color('~bc~-close~~ Auto closes your tab when reloading the server\n')
		console.color('~bc~-delay~~ Delay reloads your pages when reloading the server\n')
		console.color('~bc~-restart~~ Auto restarts after crash (Handy for client dev, not server dev)\n')
		console.color('~bc~-edit~~ Automatically open an exception in your code editor at the right line\n')
		return process.exit(0)
	}

	if(args['-nomoni']){
		if(args['-dali']){
			new DaliGen(args)
		}
		else{
			new Server(args)
		}
	}
	else{
		new Monitor(args)
	}
}

/* Hook the nodeJS module loader to send encoded dependency-filenames to our outer process (Monitor)*/
var fs = require('fs')
var modproto = require('module').Module.prototype
var _compile = modproto._compile
modproto._compile = function(content, filename){
	if(process.argv.indexOf('-nomoni') != -1)
		process.stderr.write('\x0F'+filename+'\n', function(){})
	return _compile.call(this, content, filename)
}

/* dreem compiler */
var dr = require('./dreem.js')

/* dependencies */
var crypto = require('crypto')
var http = require('http')
var child_process = require('child_process')
var os = require('os')
var path = require('path')

/**
 * @class BusServer {}
 * Packs together websockets and parses/stringifies JSON
 */
var BusServer = (function(){
    /**
      * @constructor
      */
	function BusServer(){
		this.sockets = []
	}
    /**
      * @method addWebSocket
      * adds a WebSocket to the BusServer
      * @param {WebSocket} sock socket to add
      */
	BusServer.prototype.addWebSocket = function(sock){
		this.sockets.push(sock)
		var self = this
		sock.onEnd = function(){
			self.sockets.splice(self.sockets.indexOf(this), 1)
			sock.onEnd = undefined
		}
		sock.onMessage = function(message){
			self.onMessage(JSON.parse(message), sock)
		}
	}

    /**
      * @event onMessage
      * Called when a new message appears on any of the sockets
      * @param {Object} message
      * @param {WebSocket} socket
      */
	BusServer.prototype.onMessage = function(message, socket){
	}

    /**
      * @method broadcast
      * Send a message to all connected sockets
      * @param {Object} message
      */
	BusServer.prototype.broadcast = function(message){
		message = JSON.stringify(message)
		for(var i = 0;i<this.sockets.length;i++){
			this.sockets[i].send(message)
		}
	}

	return BusServer
})()

/**
 * @class Composition {}
 * Holder of the dreem <composition> for the server
 * Manages all iOT objects and the BusServer for each Composition
 */
var Composition = (function(){

    /**
      * @construtor
      * @param {Object} args Process arguments
      * @param {String} file_root File server root
      * @param {String} name Name of the composition .dre
      */	
	function Composition(args, file_root, name){

		this.args = args
		this.name = name
		this.file_root = file_root

		this.busserver = new BusServer()

		this.busserver.onMessage = function(msg){
			if(msg.type == 'color'){
				console.color(msg.value)
			}
			if(msg.type == 'log'){
				console.log(msg.value)
			}
			if(msg.type == 'error'){ // lets process some errors
				msg.errors.forEach(function(err){
					if(err.path) err.path = file_root + err.path
				})
				this.showErrors(msg.errors, 'Client')
			}
		}.bind(this)

		this.watcher = new FileWatcher()
		this.watcher.onChange = function(){
			// lets reload this app
			this.onChange()
		}.bind(this)
	}

    /**
      * @method showErrors
      * Shows error array and responds with notifications/opening editors
      * @param {Array} errors
      * @param {String} prefix Output prefix
      */
	Composition.prototype.showErrors = function(errors, prefix){
		var w = 0
		errors.forEach(function(err){
			console.color("~br~"+prefix+" Error ~y~" + err.path + "~bg~" + (err.line!==undefined?":"+ err.line + (err.col?":" + err.col:""):"")+"~~ "+err.message+"\n")
			if(!err.path) w++
		})
		if(!errors[w]) return
		if(this.args['-notify']){
			Spawner.notify('Exception',errors[w].message)
		}
		if(this.args['-edit']){
			if(fs.existsSync(errors[w].path))
				Spawner.editor(errors[w].path, errors[w].line, errors[w].col - 1)
		}
	}

    /**
      * @event onChange
      * Called when any of the dependent files change for this composition
      */
	Composition.prototype.onChange = function(){
	}


    /**
      * @method reload
      * Reloads the composition and gives callback with either errors or resulting package
      * @param {Function} callback(error, package)
      */
	Composition.prototype.reload = function(callback){
		
		var compiler = new dr.Compiler()

		compiler.onRead = function(name, callback){
			if(name.indexOf('.') === -1) name += ".dre"
			var full_path = path.join(this.file_root, name) 

			fs.readFile(full_path, function(err, data){
				if(err) return callback(err)

				this.watcher.watch(full_path)

				return callback(null, data, full_path)
			}.bind(this))
		}.bind(this)

		if(this.name === null) return callback(null,null)

		compiler.execute(this.name, function(err, pkg){
			if(err){
				if(!Array.isArray(err)) err = [err]
				this.showErrors(err, 'Server')
				callback(err)
			}
			else callback(null, pkg)
		}.bind(this))
	}

    /**
      * @method request
      * Handle server request for this Composition
      * @param {Request} req
	  * @param {Response} res
      */
	Composition.prototype.request = function(req, res){
		var app = req.url.split('/')[1] || 'default'
		// ok so, we need to serve the right view.
		res.write('HI')
		res.end()
	}

	return Composition
})()

// mime type lookup

/**
  * @class MimeTypes
  * MimeType lookup table
  */
var MimeTypes = {
	htm: "text/html",
	html: "text/html",
	js: "application/javascript",
	jpg: "image/jpeg",
	jpeg: "image/jpeg",
	txt: "text/plain",
	css: "text/css",
	ico:  "image/x-icon",
	png: "image/png",
	gif: "image/gif"
}
MimeTypes.regex = new RegExp("\\.(" + Object.keys(MimeTypes).join("|") + ")$")
/**
  * @method fromFileName
  * Looks up mimetype by filename
  * @param {String] name Name of file
  */
MimeTypes.fromFilename = function( name ){
	var ext = name.match(this.regex)
	return ext && this[ ext[1] ] || "text/plain"
}

/**
 * @class Server {}
 * Main NodeJS HTTP server with support for WebSockets, static file handling and 
 * Composition objects
 */
var Server = (function(){

	/** 
	  * @constructor 
	  * @param {Object} args Process arguments
	  */
	function Server(args){
		this.compositions = {}

		this.args = args
		var port = this.args['-port'] || 8080
		var iface = this.args['-iface'] || '0.0.0.0'

		this.server = http.createServer(this.request.bind(this))
		this.server.listen(port, iface)
		this.server.on('upgrade', this.upgrade.bind(this))

		if(iface == '0.0.0.0'){
			var ifaces = os.networkInterfaces()
			var txt = ''
			Object.keys(ifaces).forEach(function (ifname) {
				var alias = 0;
				ifaces[ifname].forEach(function (iface) {
					if ('IPv4' !== iface.family ) return
					var addr = 'http://'+iface.address+':'+port+'/'
					if(!this.address) this.address = addr
					txt += ' ~~on ~c~'+addr
				}.bind(this))
			}.bind(this))
			console.color('Server running' + txt+'~~ Ready to go!\n')
		}
		else {
			this.address = 'http://' + iface + ':' + port + '/' 
			console.color('Server running on ~c~'+this.address+"~~\n")
		}
		// use the browser spawner
		var browser = this.args['-browser']
		if(browser && (!this.args['-delay'] || this.args['-count'] ==0 )){
			Spawner.browser(this.address+(browser===true?'':browser), this.args['-devtools'])
		}

		this.watcher = new FileWatcher()
		this.watcher.onChange = function(file){
			if(file.indexOf('dreem.js') !== -1){
				return this.broadcast({type:'delay'})
			}
			this.broadcast({
				type:'filechange',
				file:file.slice(this.file_root.length)
			})

		}.bind(this)

		this.busserver = new BusServer()

		process.on('SIGHUP', function(){
			if(this.args['-close']) this.broadcast({type:'close'})
			if(this.args['-delay']) this.broadcast({type:'delay'})
		}.bind(this))
	}

	/** 
	  * @method broadcast
	  * Send a message to all my connected websockets and those on the compositions
	  * @param {Object} msg JSON Serializable message to send
	  */
	Server.prototype.broadcast = function(msg){
		this.busserver.broadcast(msg)
		for(var k in this.compositions){
			this.compositions[k].busserver.broadcast(msg)
		}
	}

	/** 
	  * @attribute {String} default_comp
	  * Default composition name 
	  */
	Server.prototype.default_comp = null

	/** 
	  * @attribute {String} file_root
	  * Root of the file serevr
	  */
	Server.prototype.file_root = path.resolve(__dirname)

	/** 
	  * @method bgetComposition
	  * Find composition object by url 
	  * @param {String} url 
	  * @return {Composition|undefined} 
	  */
	Server.prototype.getComposition = function(url){
		if(url.indexOf('.')!== -1) return
		var path = url.split('/')
		var name = path[0] || this.default_comp
		if(!this.compositions[name]) this.compositions[name] = new Composition(this.args, this.file_root, name)
		return this.compositions[name]
	}

	/** 
	  * @method upgrade
	  * Handle protocol upgrade to WebSocket
	  * @param {Request} req 
	  * @param {Socket} sock
	  * @param {Object} head 
	  */
	Server.prototype.upgrade = function(req, sock, head){
		// lets connect the sockets to the app
		var sock = new WebSocket(req, sock, head)

		var composition = this.getComposition(req.url)
		if(!composition) this.busserver.addWebSocket(sock)
		else composition.busserver.addWebSocket(sock)
	}

	/** 
	  * @method request
	  * Handle main http server request
	  * @param {Request} req 
	  * @param {Response} res
	  */
	Server.prototype.request = function(req, res){
		// lets delegate to
		var host = req.headers.host
		var url = req.url
		var composition = this.getComposition(url)

		// if we are a composition request, send it to composition
		if(composition) return composition.request(req, res)

		// otherwise handle as static file
		var file = path.join(this.file_root, req.url)
		fs.stat(file, function(err, stat){
			if(err || !stat.isFile()){
				res.writeHead(403)
				res.end()
				if(url =='/favicon.ico') return
				console.color('~br~Error~y~ '+file+'~~ File not found, returning 403\n')
				return
			}
			var header = {
				"Cache-control":"max-age=0",
				"Content-Type": MimeTypes.fromFilename(file),
			}
			var stream = fs.createReadStream(file)
			res.writeHead(200, header)
			stream.pipe(res)

			this.watcher.watch(file)
		}.bind(this))
	}

	// the websocket class
	return Server
})()

/**
 * @class WebSocket
 * Clean and simple websocket implementation for node
 */
var WebSocket = (function(){

	/** 
	  * @constructor 
	  * @param {Request} req The node request object to construct from
	  * @param {Socket} socket The socket object to connect to
	  */
	function WebSocket(req, socket){
		var version = req.headers['sec-websocket-version']
		if(version != 13){
			console.log("Incompatible websocket version requested (need 13) " + version)
			return socket.destroy()
		}

		this.socket = socket

	 	// calc key
		var key = req.headers['sec-websocket-key']
		var sha1 = crypto.createHash('sha1');
		sha1.update(key + "258EAFA5-E914-47DA-95CA-C5AB0DC85B11");
		var ack = 'HTTP/1.1 101 Switching Protocols\r\n'+
			'Upgrade: websocket\r\n'+
			'Connection: Upgrade\r\n'+
			'Sec-WebSocket-Accept: ' + sha1.digest('base64') +'\r\n\r\n'

		this.socket.write(ack)

		this.max = 100000000 // maximum receive buffer size (10 megs)
		this.header = new Buffer(14) // header
		this.output = new Buffer(10000) // output
		this.state = this.opcode // start in the opcode state
		this.expected = 1 // the bytes expected for the next state
		this.written = 0 // how much we have written in the output buffers
		this.read = 0 // the bytes we've read
		this.input = 0 // the input buffer received from the socket
		this.maskoff = 0 // the offset in the mask
		this.maskcount = 0 // mask counter
		this.paylen = 0 // payload length

		// 10 second ping frames
		var pf = new Buffer(2)
		pf[0] = 9 | 128
		pf[1] = 0

		this.ping_interval = setInterval(function(){
			if(!this.socket) clearInterval(this.ping_interval)
			else this.socket.write(pf)
		}.bind(this), 10000)		

		// Main socket data loop, uses state function to parse
		this.socket.on('data', function(data){
			this.input = data
			this.read = 0
			while(this.state());
		}.bind(this))

		this.socket.on('close', function(){
			this.close()
		}.bind(this))
	}

	/** 
	  * @event onMessage 
	  * @param {String} message The incoming message
	  */
	WebSocket.prototype.onMessage = function(message){
	}

	/** 
	  * @event onClose
	  */
	WebSocket.prototype.onClose = function(){
	}

	/** 
	  * @event onError
	  * @param {String} error The error
	  */
	WebSocket.prototype.onError = function(error){
	}

	WebSocket.prototype.error = function(t){
		console.log("Error on websocket " + t)
		this.onError(t)
		this.close()
	}

	/** 
	  * @method send
	  * Send message on socket
	  * @param {String|Buffer} data Data to send
	  */
	WebSocket.prototype.send = function(data){
		if(!this.socket) return
		var head
		var buf = new Buffer(data)
		if(buf.length < 126){
			head = new Buffer(2)
			head[1] = buf.length
		} 
		else if (buf.length<=65535){
			head = new Buffer(4)
			head[1] = 126
			head.writeUInt16BE(buf.length, 2)
		} 
		else {
			head = new Buffer(10)
			head[1] = 127
			head[2] = head[3] = head[4] = head[5] = 0
			head.writeUInt32BE(buf.length, 6)
		}
		head[0] = 128 | 1
		this.socket.write(head)
		this.socket.write(buf)
	}

	/** 
	  * @method close
	  * Close socket
	  */
	WebSocket.prototype.close = function(){
		if(this.socket){
			this.onClose()
			this.socket.destroy()
			clearInterval(this.ping_interval)
		}
		this.socket = undefined
	}

	/* Internal head state */
	WebSocket.prototype.head = function(){
		var se = this.expected
		while(this.expected > 0 && this.read < this.input.length && this.written < this.header.length){
			this.header[this.written++] = this.input[this.read++], this.expected--
		}
		if(this.written > this.header.length) return this.err("unexpected data in header"+ se + s.toString())
		return this.expected != 0
	}

	/* Internal data state */
	WebSocket.prototype.data = function(){
		while(this.expected > 0 && this.read < this.input.length){
			this.output[this.written++] = this.input[this.read++] ^ this.header[this.maskoff + (this.maskcount++&3)]
			this.expected--
		}
		if(this.expected) return false
		this.onMessage(this.output.toString('utf8', 0, this.written))
		this.expected = 1
		this.written = 0
		this.state = this.opcode
		return true
	}

	/* Internal mask state*/
	WebSocket.prototype.mask = function(){
		if(this.head()) return false
		if(!this.paylen){
			this.expected = 1
			this.written = 0
			this.state = this.opcode
			return true
		}
		this.maskoff = this.written - 4
		this.written = this.maskcount = 0
		this.expected = this.paylen
		if(this.paylen > this.max) return this.error("buffer size request too large " + l + " > " + max)
		if(this.paylen > this.output.length) this.output = new Buffer(this.paylen)
		this.state = this.data
		return true
	}

	/* Internal len8 state*/
	WebSocket.prototype.len8 = function(){
		if(this.head()) return false
		this.paylen = this.header.readUInt32BE(this.written - 4)
		this.expected = 4
		this.state = this.mask
		return true
	}

	/* Internal len2 state*/
	WebSocket.prototype.len2 = function(){
		if(this.head()) return 
		this.paylen = this.header.readUInt16BE(this.written - 2)
		this.expected = 4
		this.state = this.mask
		return true
	}

	/* Internal len1 state*/
	WebSocket.prototype.len1 = function(){
		if(this.head()) return false
		if(!(this.header[this.written  - 1] & 128)) return this.error("only masked data")
		var type = this.header[this.written - 1] & 127
		if(type < 126){
			this.paylen = type
			this.expected = 4
			this.state = this.mask
		}
		else if(type == 126){
			this.expected = 2
			this.state = this.len2
		}
		else if(type == 127){
			this.expected = 8
			this.state = this.len8
		}
		return true
	}

	/* Internal pong state*/
	WebSocket.prototype.pong = function(){
		if(this.head()) return false
		if(this.header[this.written - 1] & 128){
			this.expected = 4
			this.paylen = 0
			this.state = this.mask
			return true
		}
		this.expected = 1
		this.written = 0 
		this.state = this.opcode
		return true
	}

	WebSocket.prototype.opcode = function(){
		if(this.head()) return
		var frame = this.header[0] & 128
		var type = this.header[0] & 15
		if(type == 1){
			if(!frame) return this.error("only final frames supported")
			this.expected = 1
			this.state = this.len1
			return true
		}
		if(type == 8) return this.close()
		if(type == 10){
			this.expected = 1
			this.state = this.pong
			return true
		}
		return this.error("opcode not supported " + t)
	}

	return WebSocket
})()

/**
 * @class Spawner
 * Exernal utility spawning api
 */
var Spawner = {
	/**
	 * @method browser
	 * Opens a webbrowser on the specified url 
	 * @param {String} url Url to open
	 * @param {Bool} withdevtools Open developer tools too (gives focus on OSX)
	 */
	browser:function(url, withdevtools){
		if(process.platform == 'darwin'){
			// Spawn google chrome
			child_process.spawn(
				"/Applications/Google chrome.app/Contents/MacOS/Google Chrome",
				["--incognito",url])
			// open the devtools 
			if(withdevtools){
				setTimeout(function(){
					child_process.exec('osascript -e \'tell application "Chrome"\n\treopen\nend tell\ntell application "System Events" to keystroke "j" using {option down, command down}\'')
				},200)
			}
		}
		else{
			console.log("Sorry your platform "+process.platform+" is not supported for browser spawn")
		}

	},
	/**
	 * @method editor
	 * Opens a code editor on the file / line /columnt
	 * @param {String} file File to open
	 * @param {Int} line Line to set cursor to
	 * @param {Int} file File to open
	 */
	editor:function(file, line, col){
		if(process.platform == 'darwin'){
			// Only support sublime for now
			child_process.spawn(
				"/Applications/Sublime\ Text.app/Contents/SharedSupport/bin/subl",
				[file + ':' + line + (col!==undefined?':'+col:'')])
		}
		else{
			console.log("Sorry your platform "+process.platform+" is not supported for editor spawn")
		}
	},
	/**
	 * @method notify
	 * Opens a tray notification
	 * @param {String} body Body of the notification
	 * @param {String} title Title of notification
	 * @param {String} subtitle Subtitle
	 */
	notify:function(body, title, subtitle){
		if(process.platform == 'darwin'){
			child_process.spawn("osascript",
				["-e",'display notification \"'+body.replace(/"/g,'\\"')+'\" '+(title?'with title \"'+title.replace(/"/g,'\\"')+'\" ':'')+(subtitle?'subtitle \"'+subtitle.replace(/"/g,'\\"')+'\"':'')])
		}
		else{
			console.log("Sorry your platform "+process.platform+" is not supported for notify spawn")
		}
	}
}

/*
Create a colorization function (ANSI output) use ~rb~ to set color in string
r - red
g - green
b - blue
y - yellow
m - magenta
c - cyan
w - white
br - bold red
bg - bold green
bb - bold blue
by - bold yellow
bm - bold magenta
bc - bold cyan
bw - bold white
*/
function colorize(output) {
	var colors = {
		bl:"30",bo:"1",r:"0;31",g:"0;32",y:"0;33",b:"0;34",m:"0;35",c:"0;36",
		w:"0;37",br:"1;31",bg:"1;32",by:"1;33",bb:"1;34",bm:"1;35",bc:"1;36",bw:"1;37"
	}
	return function(){
		for (var v = Array.prototype.slice.call(arguments), i = 0; i < v.length; i++) {
			v[i] = String(v[i]).replace(/~(\w*)~/g, function(m, a) {
				return "\033[" + (colors[a] || 0) + "m";
			}) + "\033[0m";
			output(v[i])
		}
	}
}

console.color = colorize(function(v){
	process.stdout.write(v)
})

/**
 * @class DaliGen
 * Class to create dali JS app (testing)
 */
DaliGen = (function(){
	// lets monitor all our dependencies and terminate if they change

	function DaliGen(args){
		this.args = args

		// lets load up a composition
		console.log("Running in DaliGen mode")
		var file = 'dalitest.dre'
		if(args['-dali'] !== true) file = args['-dali']
		var comp = new Composition(args, path.resolve(__dirname), file)
		var child
		comp.onChange = function(){
			if(child) child.kill()
			child = null
			comp.reload(function(err, pkg){
				if(err) return
				// output dali application
				var code = 'var dreem_classes = ' + JSON.stringify(pkg.classes) + '\n'
				code += 'var dreem_root = ' + JSON.stringify(pkg.root) + '\n'
				code += 'var methods = []\n' + pkg.methods + '\n'
				code += fs.readFileSync('dalihead.js')
				fs.writeFileSync('dalitest.js', code)
				child = child_process.spawn('dalirun',['dalitest.js'])
				console.log('Written new new dalitest.js')
			})
		}
		comp.onChange()
	}

	return DaliGen
})()

/* Promisify turns a node-callback using function into a promise using function*/
function Promisify(call){
	return function(){
		var arg = Array.prototype.slice.call(arguments)
		return new Promise(function(resolve, reject){
			arg.push(function(err, result){
				if(err) reject(err)
				else resolve(result)
			})
			call.apply(this, arg)
		}.bind(this))
	}
}

/**
 * @class FileWatcher
 * Reliable and most importantly FAST responding file monitoring API
 * Node.JS builtin has a huge lag and can be unreliable
 * It also scales cleanly with number of files in terms of polling overhead
 */
FileWatcher = (function(){

	/**
	 * @constructor
	 */
	function FileWatcher(){
		this.files = {}
		this.timeout = 100
		this.poll = this.poll.bind(this)
		this.itv = setTimeout(this.poll, 0)
		this.lastfire = 0
		this.firelimit = 1000
	}

	fs.statPromise = Promisify(fs.stat)

	/**
	 * @event onChange
	 * @param {String} file File that changed
	 */
	FileWatcher.prototype.onChange = function(file){
	}

	/* Internal poll method */
	FileWatcher.prototype.poll = function(file){
		var stats = []
		var names = []
		for(var k in this.files){
			names.push(k)
			stats.push(fs.statPromise(k))
		}
		Promise.all(stats).then(function(results){
			for(var i = 0;i<results.length;i++){
				var file = names[i]
				var res = results[i]
				res.atime = null
				var str = JSON.stringify(res)
				// lets make sure we dont fire too often

				if(this.files[file] !== null && this.files[file] !== str){
					var now = Date.now()
					if(now - this.lastfire > this.firelimit){
						this.lastfire = now
						this.onChange(file)
					}
				}
				this.files[file] = str
			}
			setTimeout(this.poll, this.timeout)
		}.bind(this)).catch(function(err){
			// TODO lets unwatch the files that errored?
		})
	}

	/**
	 * @method watch
	 * @param {String} file File to watch
	 */
	FileWatcher.prototype.watch = function(file){
		if(!(file in this.files)) this.files[file] = null
	}

	return FileWatcher
})()

/**
 * @class Monitor
 * Monitor class executes ourselves as a subprocess, receives the dependency file names
 * from the child process and manages restart/killing when files change
 */
Monitor = (function(){
	/**
	 * @constructor
	 * Parses the arguments
	 * @param {Array} argv Pass process.argv
	 */
	function Monitor(args){
		// lets process args into hash
		this.args = args
		this.restart_count = 0

		this.watcher = new FileWatcher()
		this.watcher.onChange = function(file){
			console.color('~g~Got filechange: ~y~'+file+'~~ restarting server\n')
			// lets restart this.child
			if(this.child){
				this.child.kill('SIGHUP')
				setTimeout(function(){
					if(this.child) this.child.kill('SIGTERM')
				}.bind(this), 50)
			}
			else{
				this.start()
			}
		}.bind(this)

		this.start()
	}

	/* Internal. start the monitored process again*/
	Monitor.prototype.start = function(){
		var subarg = process.argv.slice(1)

		subarg.push('-nomoni')
		subarg.push('-count')
		subarg.push(this.restart_count++)

		var stdio = [process.stdin, process.stdout,'pipe']
		this.was_exception = false
		this.watcher.watch(subarg[0])

		this.child = child_process.spawn(process.execPath, subarg, {
			stdio: stdio
		})

		this.child.stderr.on('data', function(err){
			// we haz exception, wait for filechange
			var data = err.toString()
			if(data.indexOf('\x0F')!= -1){
				var files = data.split('\x0F')
				for(var i = 0;i<files.length;i++){
					var file = files[i].replace(/\n/,'')
					if(file){
						this.watcher.watch(file)
					}
				}
				return
			}

			this.was_exception = true
			var m = data.match(/^(\/[^\:]+)\:(\d+)\n/)
			var ln = data.split(/\n/)
			if(m){ // open error in code editor
				if(this.args['-notify']) Spawner.notify(ln[1]+'\n'+ln[2],ln[3])
				if(this.args['-edit']) Spawner.editor(m[1],m[2])
			}
			process.stdout.write(err)
		}.bind(this))

		this.child.on('close', function(code){
			// lets have a start per second
			this.child = undefined
			if(this.was_exception && !this.args['-restart']) return console.log("Exception detected, not restarting")
			if(Date.now() - this.last >= this.restart_delay){
				this.start()
			}
			else{
				setTimeout(function(){
					this.start()
				}.bind(this), this.restart_delay)
			}
		}.bind(this))		
	}

	/**
	 * @attribute restart_delay
	 * When in infinite restart loop, wait atleast this long (ms)
	 */
	Monitor.prototype.restart_delay = 1000

	return Monitor
})()

/* Start it up */
main()