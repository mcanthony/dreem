/**
     * @class dr.teem {Util, Events}
     * @extends dr.node
     * Connects to the shared event bus. When data is sent with a given type, a corresponding event is sent. For example, send('blah', {}) sends data with the 'blah' type, other shims will receive the object via an 'onblah' event.
     *
     * Here is an example of sending data via dr.teem. View the example in mutiple devices and see the value update in both.
     *
     *     @example
     *     <teem id="bus">
     *       <handler event="onrandnum" args="data">
     *          output.setAttribute('text', data.txt);
     *       </handler>
     *     </teem>
     *     
     *     <spacedlayout axis="y"></spacedlayout>
     *
     *     <labelbutton text="send message">
     *        <handler event="onclick">
     *          bus.send('randnum', {"txt":'another random number: ' + Math.floor(Math.random() * 100000)});
     *        </handler>
     *     </labelbutton>
     *     <text id="output"></text>
     */
/**
        * @attribute {Number} [pingtime=5000]
        * The frequency used to ping to the server
        */
/**
        * @method send
        * Sends some data over the event bus.
        * @param {String} type The type of event to be sent.
        * @param {Object} data The data to be sent.
        */
