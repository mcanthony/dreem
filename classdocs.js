/**
     * @class lz.ace
     * @extends lz.view
     * Ace editor component.
     */
/**
        * @cfg {String} [text=""]
        * Initial text for the ace editor.
        */
/**
        * @event ontext
        * Fired when the contents of the ace entry changes
        * @param {lz.ace} view The lz.ace that fired the event
        */
/**
        * @cfg {Number} [pausedelay=500]
        * Time (msec) after user entry stops to fire onpausedelay event.
        * 0 will disable this option.
        */
/**
        * @event onpausedelay
        * Fired when user entries stops for a period of time.
        * @param {lz.ace} view The lz.ace that fired the event
        */
/**
     * @class lz.boundslayout
     * @extends lz.layout
     * Sets the parent view's size to match the bounds of its children.
     */
/**
        * @cfg {""/"width"/"height"} [ignoreattr=""]
        * Optionally skip bounds calculations for a specific axis.
        */
/**
     * @class lz.buttonbase
     * @extends lz.view
     * Base class for button components. Buttons share common elements, 
     * including their ability to be selected, a visual element to display
     * their state, and a default and selected color.
     * The visual element is a lz.view that shows the current state of the
     * button. For example, in a labelbutton the entire button is the visual
     * element. For a checkbutton, the visual element is a square lz.view
     * that is inside the button.
     */
/**
        * @cfg {Number} [padding=3]
        * Amount of padding pixels around the button.
        */
/**
        * @cfg {String} [defaultcolor="#808080"]
        * The default color of the visual button element when not selected.
        */
/**
        * @cfg {String} [selectcolor="#a0a0a0"]
        * The selected color of the visual button element when selected.
        */
/**
        * @cfg {Boolean} [selected=false]
        * The current state of the button.
        */
/**
        * @event onselected
        * Fired when the state of the button changes.
        * @param {lz.buttonbase} view The lz.buttonbase that fired the event
        */
/**
        * @cfg {String} [text=""]
        * Button text.
        */
/**
     * @class lz.checkbutton
     * @extends lz.buttonbase
     * Button class consisting of text and a visual element to show the
     * current state of the component. The state of the
     * button changes each time the button is clicked. The select property
     * holds the current state of the button. The onselected event
     * is generated when the button is the selected state.
     */
/**
     * @class lz.dragstate
     * @extends lz.state
     * Allows views to be dragged by the mouse.
     */
/**
        * @cfg {"x"/"y"/"both"} [dragaxis="both"]
        * The axes to drag on.
        */
/**
     * @class lz.dreem_iframe
     * @extends lz.view
     * iframe component for embedding dreem code or html in a dreem application.
     * The size of the iframe matches the width/height of the view when the
     * component is created.
     * The file '/iframe_stub.html' contains the html to load into the iframe,
     * including the required script elements to run dreem code.
     */
/**
        * @cfg {String} [contents=""]
        * string to write into the iframe body. This is dreem code, or html
        * that is written inside the iframe's body tag.
        */
/**
     * @class lz.gyro
     * @extends lz.node
     * Receives gyroscope and compass data where available. See [https://w3c.github.io/deviceorientation/spec-source-orientation.html#deviceorientation](https://w3c.github.io/deviceorientation/spec-source-orientation.html#deviceorientation) and [https://developer.apple.com/library/safari/documentation/SafariDOMAdditions/Reference/DeviceOrientationEventClassRef/DeviceOrientationEvent/DeviceOrientationEvent.html](https://developer.apple.com/library/safari/documentation/SafariDOMAdditions/Reference/DeviceOrientationEventClassRef/DeviceOrientationEvent/DeviceOrientationEvent.html) for details.
     */
/**
        * @cfg {Number} [x=0] (readonly)
        * The accelerometer x value
        */
/**
        * @cfg {Number} [y=0] (readonly)
        * The accelerometer y value
        */
/**
        * @cfg {Number} [z=0] (readonly)
        * The accelerometer z value
        */
/**
        * @cfg {Number} [alpha=0] (readonly)
        * The gyro alpha value rotating around the z axis
        */
/**
        * @cfg {Number} [beta=0] (readonly)
        * The gyro beta value rotating around the x axis
        */
/**
        * @cfg {Number} [gamma=0] (readonly)
        * The gyro gamma value rotating around the y axis
        */
/**
        * @cfg {Number} [compass=0] (readonly)
        * The compass orientation, see [https://developer.apple.com/library/safari/documentation/SafariDOMAdditions/Reference/DeviceOrientationEventClassRef/DeviceOrientationEvent/DeviceOrientationEvent.html](https://developer.apple.com/library/safari/documentation/SafariDOMAdditions/Reference/DeviceOrientationEventClassRef/DeviceOrientationEvent/DeviceOrientationEvent.html) for details.
        */
/**
        * @cfg {Number} [compassaccuracy=0] (readonly)
        * The compass accuracy, see [https://developer.apple.com/library/safari/documentation/SafariDOMAdditions/Reference/DeviceOrientationEventClassRef/DeviceOrientationEvent/DeviceOrientationEvent.html](https://developer.apple.com/library/safari/documentation/SafariDOMAdditions/Reference/DeviceOrientationEventClassRef/DeviceOrientationEvent/DeviceOrientationEvent.html) for details.
        */
/**
     * @class lz.labelbutton
     * @extends lz.buttonbase
     * Button class consisting of text centered in a view. The onclick event
     * is generated when the button is clicked. The visual state of the 
     * button changes during onmousedown/onmouseup.
     */
/**
     * @class lz.labeltoggle
     * @extends lz.labelbutton
     * Button class consisting of text centered in a view. The state of the
     * button changes each time the button is clicked. The select property
     * holds the current state of the button. The onselected event
     * is generated when the button is the selected state.
     */
/**
     * @class lz.shim
     * @extends lz.node
     * Connects to the shared event bus. When data is sent with a given type, a corresponding event is sent. For example, send('blah', {}) sends data with the 'blah' type, other shims will receive the object via an 'onblah' event.
     */
/**
        * @cfg {Boolean} [connected=false] (readonly)
        * If true, we are connected to the server
        */
/**
        * @cfg {Number} [pingtime=1000]
        * The frequency used to reconnect to the server
        */
/**
        * @cfg {Boolean} [websockets=false]
        * If true, use websockets to connect to the server
        */
/**
        * @method send
        * Sends some data over the event bus.
        * @param {String} type The type of event to be sent.
        * @param {Object} data The data to be sent.
        */
/**
     * @class lz.simplelayout
     * @extends lz.layout
     * A layout that stacks views on the x or y axis.
     */
/**
        * @cfg {Number} [inset=0]
        * Amount to inset the layout
        */
/**
        * @cfg {Number} [spacing=15]
        * Amount of spacing between views
        */
/**
        * @cfg {"x"/"y"} [axis=x]
        * The axis to stack on
        */
/**
     * @class lz.text
     * @extends lz.view
     * Text component that supports single and multi-line text. The text
     * component can be fixed size, or sized to fit the size of the text.
     *
     *     @example
     *     <text text="Hello World!" bgcolor="red"></text>
     */
/**
        * @cfg {Boolean} [multiline=false]
        * Set to true to show multi-line text.
        */
/**
        * @cfg {Boolean} [measuresize=true]
        * By default, the text component is sized to the size of the text.
        * By setting measuresize=false, the component size is not modified
        * when the text changes.
        */
/**
        * @cfg {String} [text=""]
        * Component text.
        */
/**
        * @method format
        * Format the text to be displayed. The default behavior is to 
        * return the text intact. Override to change formatting.
        * @param {String} str The current value of the text component.
        * @return {String} The formated string to display in the component.
        */
/**
     * @class lz.touch
     * @extends lz.node
     * Receives touch and multitouch data where available.
     */
/**
        * @cfg {Number} [x=0] (readonly)
        * The touch x value for the first finger.
        */
/**
        * @cfg {Number} [y=0] (readonly)
        * The touch y value for the first finger.
        */
/**
        * @cfg {String} touches (readonly)
        * An array of x/y coordinates for all fingers, where available. See [https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Touch_events](https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Touch_events) for more details
        */