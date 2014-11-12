/**
     * @class dr.abstractart
     * @extends dr.view
     * Component wrapper for object tag.
     * The size of the object matches the width/height of the view when the
     * component is created. dr.abstractart is usually used as a base class
     * for art, but it can be directly to embed svg files into dreem.
     *
     */
/**
        * @attribute {String} [data=""]
        * url to be used by the object.
        * Same meaning as the data attribute in the html object tag.
        */
/**
        * @attribute {String} [type=""]
        * media type of the data specified in the data attribute
        * Same meaning as the type attribute in the html object tag.
        */
/**
        * @method getDom
        * Returns the base of the object dom
        */
/**
        * @event onload 
        * Fired when the object is loaded.
        */
/**
     * @class dr.ace
     * @extends dr.view
     * Ace editor component.
     *
     *     @example
     *     <ace id="editor" width="500" text='Hello World'></ace>
     *
     * The initial text can also be included inline, and include dreem code.
     *
     *     @example
     *     <ace id="editor" width="500"><view width="100%" height="100%" bgcolor="thistle"></view></ace>
     *
     */
/**
        * @attribute {string} [theme='ace/theme/chrome']
        * Specify the ace theme to use.
        */
/**
        * @attribute {string} [mode='ace/mode/dr']
        * Specify the ace mode to use.
        */
/**
        * @attribute {String} [text=""]
        * Initial text for the ace editor.
        */
/**
        * @event ontext
        * Fired when the contents of the ace entry changes
        * @param {dr.ace} view The dr.ace that fired the event
        */
/**
        * @attribute {Number} [pausedelay=500]
        * Time (msec) after user entry stops to fire onpausedelay event.
        * 0 will disable this option.
        */
/**
        * @event onpausedelay
        * Fired when user entries stops for a period of time.
        * @param {dr.ace} view The dr.ace that fired the event
        */
/**
     * @class dr.art
     * @extends dr.abstractart
     * Vector graphics support using svg.
     *
     * This example shows how to include some svg art inline
     *
     *     @example
     *     <art data="/images/cursorshapes.svg" type="image/svg+xml" width="100" height="100" x="10" y="10"></art>
     *
     */
/**
        * @method resizeToView
        * Modify the embedded svg object to use the size of the view.
        * Called in response to the onload event.
        */
/**
     * @class dr.audioplayer
     * @extends dr.node
     * audioplayer wraps the web audio APIs to provide a declarative interface to play audio.
     *
     * This example shows how to load and play an mp3 audio file from the server:
     *
     *     @example
     *     <audioplayer url="music/YACHT_-_09_-_Im_In_Love_With_A_Ripper_Party_Mix_Instrumental.mp3" playing="true"></audioplayer>
     */
/**
        * @attribute {String} url
        * The URL to an audio file to play
        */
/**
        * @attribute {Number} loadprogress
        * @readonly
        * A Number between 0 and 1 representing load progress
        */
/**
        * @attribute {Boolean} loaded
        * @readonly
        * If true, the audio is done loading
        */
/**
        * @attribute {Boolean} playing
        * If true, the audio is playing.
        */
/**
        * @attribute {Boolean} paused
        * If true, the audio is paused.
        */
/**
        * @attribute {Boolean} loop
        * If true, the audio will play continuously.
        */
/**
        * @attribute {Number} time
        * @readonly
        * The number of seconds the file has played, with 0 being the start.
        */
/**
        * @attribute {Number} duration
        * @readonly
        * The duration in seconds.
        */
/**
        * @attribute {Number} fftsize
        * The number of fft frames to use when setting {@link #fft fft}. Must be a non-zero power of two in the range 32 to 2048.
        */
/**
        * @attribute {Number} [fftsmoothing=0.8]
        * The amount of smoothing to apply to the FFT analysis. A value from 0 -> 1 where 0 represents no time averaging with the last FFT analysis frame.
        */
/**
        * @attribute {Number[]} fft
        * @readonly
        * An array of numbers representing the FFT analysis of the audio as it's playing.
        */
/**
     * @class dr.bitmap
     * @extends dr.view
     * Loads an image from a URL.
     *
     *     @example
     *     <bitmap src="../api-examples-resources/shasta.jpg" width="230" height="161"></bitmap>
     */
/**
        * @attribute {String} src
        * The bitmap URL to load
        */
/**
             * @event onload 
             * Fired when the bitmap is loaded
             * @param {Object} size An object containing the width and height
             */
/**
             * @event onerror 
             * Fired when there is an error loading the bitmap
             */
/**
     * @class dr.boundslayout
     * @extends dr.layout
     * Sets the parent view's size to match the bounds of its children.
     *
     * Here is a view that contains three sub views that are positioned with a simplelayout. The parent view has a grey background color. Notice that the subviews are visible because they overflow the parent view, but the parent view itself takes up no space.
     *
     *     @example
     *     <view bgcolor="darkgrey">
     *       <simplelayout axis="y"></simplelayout>
     *
     *       <view width="100" height="25" bgcolor="lightpink" opacity=".3"></view>
     *       <view width="100" height="25" bgcolor="plum" opacity=".3"></view>
     *       <view width="100" height="25" bgcolor="lightblue" opacity=".3"></view>
     *     </view>
     *
     * Now we'll add a boundlayout to the parent view. Notice that now the parent view does take up space, and you can see it through the semi-transparent subviews.
     *
     *     @example
     *     <view bgcolor="darkgrey">
     *       <boundslayout></boundslayout>
     *
     *       <simplelayout axis="y"></simplelayout>
     *
     *       <view width="100" height="25" bgcolor="lightpink" opacity=".3"></view>
     *       <view width="100" height="25" bgcolor="plum" opacity=".3"></view>
     *       <view width="100" height="25" bgcolor="lightblue" opacity=".3"></view>
     *     </view>
     */
/**
        * @attribute {""/"width"/"height"} [ignoreattr=""]
        * Optionally skip bounds calculations for a specific axis.
        */
/**
     * @class dr.buttonbase
     * @extends dr.view
     * Base class for button components. Buttons share common elements, 
     * including their ability to be selected, a visual element to display
     * their state, and a default and selected color.
     * The visual element is a dr.view that shows the current state of the
     * button. For example, in a labelbutton the entire button is the visual
     * element. For a checkbutton, the visual element is a square dr.view
     * that is inside the button.
     */
/**
        * @attribute {Number} [padding=3]
        * Amount of padding pixels around the button.
        */
/**
        * @attribute {String} [defaultcolor="#808080"]
        * The default color of the visual button element when not selected.
        */
/**
        * @attribute {String} [selectcolor="#a0a0a0"]
        * The selected color of the visual button element when selected.
        */
/**
        * @attribute {Boolean} [selected=false]
        * The current state of the button.
        */
/**
        * @event onselected
        * Fired when the state of the button changes.
        * @param {dr.buttonbase} view The dr.buttonbase that fired the event
        */
/**
        * @attribute {String} [text=""]
        * Button text.
        */
/**
     * @class dr.checkbutton
     * @extends dr.buttonbase
     * Button class consisting of text and a visual element to show the
     * current state of the component. The state of the
     * button changes each time the button is clicked. The select property
     * holds the current state of the button. The onselected event
     * is generated when the button is the selected state.
     *
     *     @example
     *     <simplelayout axis="y"></simplelayout>
     *
     *     <checkbutton text="pink" selectcolor="pink" defaultcolor="lightgrey" bgcolor="white"></checkbutton>
     *     <checkbutton text="blue" selectcolor="lightblue" defaultcolor="lightgrey" bgcolor="white"></checkbutton>
     *     <checkbutton text="green" selectcolor="lightgreen" defaultcolor="lightgrey" bgcolor="white"></checkbutton>
     *
     * Here we listen for the onselected event on a checkbox and print the value that is passed to the handler.
     *
     *     @example
     *     <simplelayout axis="y"></simplelayout>
     *
     *     <checkbutton text="green" selectcolor="lightgreen" defaultcolor="lightgrey" bgcolor="white">
     *       <handler event="onselected" args="value">
     *         displayselected.setAttribute('text', value);
     *       </handler>
     *     </checkbutton>
     *
     *     <view>
     *       <simplelayout axis="x"></simplelayout>
     *       <text text="Selected:"></text>
     *       <text id="displayselected"></text>
     *     </view>
     *
     */
/**
     * @class dr.dataset
     * @extends dr.node
     * Datasets hold onto a set of JSON data, either inline or loaded from a URL.
     * They are used with lz.replicator for data binding.
     *
     * This example shows how to create a dataset with inline JSON data, and use a replicator to show values inside. Inline datasets are useful for prototyping, especially when your backend server isn't ready yet:
     *
     *     @example
     *     <dataset name="example">
     *      {
     *        "store": {
     *          "book": [
     *            {
     *              "category": "reference",
     *              "author": "Nigel Rees",
     *              "title": "Sayings of the Century",
     *              "price": 8.95
     *            },
     *            {
     *              "category": "fiction",
     *              "author": "Evelyn Waugh",
     *              "title": "Sword of Honour",
     *              "price": 12.99
     *            },
     *            {
     *              "category": "fiction",
     *              "author": "Herman Melville",
     *              "title": "Moby Dick",
     *              "isbn": "0-553-21311-3",
     *              "price": 8.99
     *            },
     *            {
     *              "category": "fiction",
     *              "author": "J. R. R. Tolkien",
     *              "title": "The Lord of the Rings",
     *              "isbn": "0-395-19395-8",
     *              "price": 22.99
     *            }
     *          ],
     *          "bicycle": {
     *            "color": "red",
     *            "price": 19.95
     *          }
     *        }
     *      }
     *     </dataset>
     *     <simplelayout></simplelayout>
     *     <replicator classname="text" datapath="$example/store/book[*]/title"></replicator>
     *
     * Data can be loaded from a URL when your backend server is ready, or reloaded to show changes over time:
     *
     *     @example
     *     <dataset name="example" url="/example.json"></dataset>
     *     <simplelayout></simplelayout>
     *     <replicator classname="text" datapath="$example/store/book[*]/title"></replicator>
     */
/**
        * @attribute {String} name (required)
        * The name of the dataset
        */
/**
        * @property {Object} data
        * The data inside the dataset
        */
/**
        * @attribute {String} url
        * The url to load JSON data from.
        */
/**
     * @class dr.dragstate
     * @extends dr.state
     * Allows views to be dragged by the mouse.
     *
     * Here is a view that contains a dragstate. The dragstate is applied when the mouse is down in the view, and then removed when the mouse is up. You can modify the attributes of the draggable view by setting them inside the dragstate, like we do here with bgcolor.
     *
     *     @example
     *     <view width="100" height="100" bgcolor="plum">
     *       <attribute name="mouseIsDown" type="boolean" value="false"></attribute>
     *       <handler event="onmousedown">
     *         this.setAttribute('mouseIsDown', true);
     *       </handler>
     *       <handler event="onmouseup">
     *         this.setAttribute('mouseIsDown', false);
     *       </handler>
     *       <dragstate applied="${this.parent.mouseIsDown}">
     *         <attribute name="bgcolor" type="string" value="purple"></attribute>
     *       </dragstate>
     *     </view>
     *
     * To constrain the motion of the element to either the x or y axis set the dragaxis property. Here the same purple square can only move horizontally.
     *
     *     @example
     *     <view width="100" height="100" bgcolor="plum">
     *       <attribute name="mouseIsDown" type="boolean" value="false"></attribute>
     *       <handler event="onmousedown">
     *         this.setAttribute('mouseIsDown', true);
     *       </handler>
     *       <handler event="onmouseup">
     *         this.setAttribute('mouseIsDown', false);
     *       </handler>
     *       <dragstate applied="${this.parent.mouseIsDown}" dragaxis="x">
     *         <attribute name="bgcolor" type="string" value="purple"></attribute>
     *       </dragstate>
     *     </view>
     */
/**
        * @attribute {"x"/"y"/"both"} [dragaxis="both"]
        * The axes to drag on.
        */
/**
     * @class dr.dreem_iframe
     * @extends dr.view
     * iframe component for embedding dreem code or html in a dreem application.
     * The size of the iframe matches the width/height of the view when the
     * component is created. The iframe component can show a web page by
     * using the src attribute, or to show dynamic content using the
     * contents attribute.
     *
     * This example shows how to display a web page in an iframe. The 
     * contents of the iframe are not editable:
     *
     *     @example
     *     <dreem_iframe src="http://en.wikipedia.org/wiki/San_Francisco" width="400" height="150"></dreem_iframe>
     *
     * To make the web page clickable, and to add scrolling:
     *
     *     @example
     *     <dreem_iframe src="http://en.wikipedia.org/wiki/San_Francisco" width="400" height="150" scrolling="true" clickable="true"></dreem_iframe>
     *
     * The content of the iframe can also be dynamically generated, including
     * adding Dreem code:
     *
     *     @example
     *     <dreem_iframe width="300" height="150" contents="Hello"></dreem_iframe>
     *
     */
/**
        * @attribute {String} [src="/iframe_stub.html"]
        * url to load inside the iframe. By default, a file is loaded that has
        * an empty body but includes the libraries needed to support Dreem code.
        */
/**
        * @attribute {Boolean} [scrolling="false"]
        * Controls scrollbar display in the iframe.
        */
/**
        * @attribute {String} [contents=""]
        * string to write into the iframe body. This is dreem/html code
        * that is written inside the iframe's body tag. If you want to display
        * static web pages, specify the src attribute, but do not use contents.
        */
/**
     * @class dr.gyro
     * @extends dr.node
     * Receives gyroscope and compass data where available. See [https://w3c.github.io/deviceorientation/spec-source-orientation.html#deviceorientation](https://w3c.github.io/deviceorientation/spec-source-orientation.html#deviceorientation) and [https://developer.apple.com/library/safari/documentation/SafariDOMAdditions/Reference/DeviceOrientationEventClassRef/DeviceOrientationEvent/DeviceOrientationEvent.html](https://developer.apple.com/library/safari/documentation/SafariDOMAdditions/Reference/DeviceOrientationEventClassRef/DeviceOrientationEvent/DeviceOrientationEvent.html) for details.
     */
/**
        * @attribute {Number} [x=0] (readonly)
        * The accelerometer x value
        */
/**
        * @attribute {Number} [y=0] (readonly)
        * The accelerometer y value
        */
/**
        * @attribute {Number} [z=0] (readonly)
        * The accelerometer z value
        */
/**
        * @attribute {Number} [alpha=0] (readonly)
        * The gyro alpha value rotating around the z axis
        */
/**
        * @attribute {Number} [beta=0] (readonly)
        * The gyro beta value rotating around the x axis
        */
/**
        * @attribute {Number} [gamma=0] (readonly)
        * The gyro gamma value rotating around the y axis
        */
/**
        * @attribute {Number} [compass=0] (readonly)
        * The compass orientation, see [https://developer.apple.com/library/safari/documentation/SafariDOMAdditions/Reference/DeviceOrientationEventClassRef/DeviceOrientationEvent/DeviceOrientationEvent.html](https://developer.apple.com/library/safari/documentation/SafariDOMAdditions/Reference/DeviceOrientationEventClassRef/DeviceOrientationEvent/DeviceOrientationEvent.html) for details.
        */
/**
        * @attribute {Number} [compassaccuracy=0] (readonly)
        * The compass accuracy, see [https://developer.apple.com/library/safari/documentation/SafariDOMAdditions/Reference/DeviceOrientationEventClassRef/DeviceOrientationEvent/DeviceOrientationEvent.html](https://developer.apple.com/library/safari/documentation/SafariDOMAdditions/Reference/DeviceOrientationEventClassRef/DeviceOrientationEvent/DeviceOrientationEvent.html) for details.
        */
/**
     * @class dr.labelbutton
     * @extends dr.buttonbase
     * Button class consisting of text centered in a view. The onclick event
     * is generated when the button is clicked. The visual state of the 
     * button changes during onmousedown/onmouseup.
     *
     *     @example
     *     <simplelayout axis="y"></simplelayout>
     *
     *     <labelbutton text="click me" defaultcolor="plum" selectcolor="orchid">
     *       <handler event="onclick">
     *         hello.setAttribute('text', 'Hello Universe!');
     *       </handler>
     *     </labelbutton>
     *
     *     <text id="hello"></text>
     */
/**
     * @class dr.labeltoggle
     * @extends dr.labelbutton
     * Button class consisting of text centered in a view. The state of the
     * button changes each time the button is clicked. The select property
     * holds the current state of the button. The onselected event
     * is generated when the button is the selected state.
     */
/**
     * @class dr.logger
     * @extends dr.node
     * Logs all attribute setting behavior
     *
     * This example shows how to log all setAttribute() calls for a replicator to console.log():
     *
     *     @example
     *     <dataset name="topmovies" url="/top_movies.json"></dataset>
     *     <replicator datapath="$topmovies/searchResponse/results[*]/movie[take(/releaseYear,/duration,/rating)]" classname="logger"></replicator>
     */
/**
   * @class dr.rangeslider
   * @extends dr.slider
   * An input component whose upper and lower bounds are changed when the mouse is dragged.
   *
   *     @example
   *
   *     <rangeslider name="hslide" y="5" width="250" height="10" lowvalue="30" highvalue="70" exclusive="true" lowselectcolor="#00CCFF" highselectcolor="33CCFF"></rangeslider>
   *
   */
/**
      * @attribute {Number} [minvalue=0]
      * The minimum value of the slider
      */
/**
    * @attribute {Number} [minhighvalue=0]
    * The minimum value of the right slider
    */
/**
      * @attribute {Number} [maxvalue=100]
      * The maximum value of the slider
      */
/**
      * @attribute {Number} [maxlowvalue=100]
      * The maximum value of the lower bound slider
      */
/**
      * @attribute {"x"/"y"} [axis=x]
      * The axis to track on
      */
/**
      * @attribute {Boolean} [invert=false]
      * Set to false to have the scale run lower to higher, true to run higher to lower.
      */
/**
      * @attribute {Boolean} [exclusive=false]
      * Set to true to highlight the outer (exclusive) values of the range, false to select the inner (inclusive) values.
      */
/**
      * @attribute {Number} [lowvalue=50]
      * The current value of the left slider.
      * Use changeLowValue() to range check the number and set the value.
      */
/**
      * @attribute {Number} [highvalue=50]
      * The current value of the right slider.
      * Use changeHighValue() to range check the number and set the value.
      */
/**
      * @method changeLowValue
      * Given a new value for the slider position, constrain the value
      * between minvalue and maxvalue or maxlowvalue (whichever is lower) and then calls setAttribute.
      * @param {Number} v The new value of the component.
      */
/**
      * @method changeHighValue
      * Given a new value for the slider position, constrain the value
      * between minvalue or minhighvalue (whichever is higher) and maxvalue and then calls setAttribute.
      * @param {Number} v The new value of the component.
      */
/**
      * @attribute {String} [lowselectcolor="#a0a0a0"]
      * The selected color of the lower bound slider.
      */
/**
      * @attribute {String} [highselectcolor="#a0a0a0"]
      * The selected color of the upper bound slider.
      */
/**
     * @class dr.replicator
     * @extends dr.node
     * Handles replication and data binding.
     *
     * This example shows the replicator to creating four text instances, each corresponding to an item in the data attribute:
     *
     *     @example
     *     <simplelayout></simplelayout>
     *     <replicator classname="text" data="[1,2,3,4]"></replicator>
     *
     * Changing the data attribute to a new array causes the replicator to create a new text for each item:
     *
     *     @example
     *     <simplelayout></simplelayout>
     *     <text onclick="repl.setAttribute('data', [5,6,7,8]);">Click to change data</text>
     *     <replicator id="repl" classname="text" data="[1,2,3,4]"></replicator>
     *
     * This example uses a {@link #filterexpression filterexpression} to filter the data to only numbers. Clicking changes {@link #filterexpression filterexpression} to show only non-numbers in the data:
     *
     *     @example
     *     <simplelayout></simplelayout>
     *     <text onclick="repl.setAttribute('filterexpression', '[^\\d]');">Click to change filter</text>
     *     <replicator id="repl" classname="text" data="['a',1,'b',2,'c',3,4,5]" filterexpression="\d"></replicator>
     *
     * Replicators can be used to look up {@link #datapath datapath} expressions to values in JSON data in a dr.dataset. This example looks up the color of the bicycle in the dr.dataset named bikeshop:
     *
     *     @example
     *     <dataset name="bikeshop">
     *      {
     *        "bicycle": {
     *          "color": "red",
     *          "price": 19.95
     *        }
     *      }
     *     </dataset>
     *     <replicator classname="text" datapath="$bikeshop/bicycle/color"></replicator>
     *
     * Matching one or more items will cause the replicator to create multiple copies:
     *
     *     @example
     *     <dataset name="bikeshop">
     *      {
     *        "bicycle": [
     *          {
     *           "color": "red",
     *           "price": 19.95
     *          },
     *          {
     *           "color": "green",
     *           "price": 29.95
     *          },
     *          {
     *           "color": "blue",
     *           "price": 59.95
     *          }
     *        ]
     *      }
     *     </dataset>
     *     <simplelayout></simplelayout>
     *     <replicator classname="text" datapath="$bikeshop/bicycle[*]/color"></replicator>
     *
     * It's possible to select a single item on from the array using an array index. This selects the second item:
     *
     *     @example
     *     <dataset name="bikeshop">
     *      {
     *        "bicycle": [
     *          {
     *           "color": "red",
     *           "price": 19.95
     *          },
     *          {
     *           "color": "green",
     *           "price": 29.95
     *          },
     *          {
     *           "color": "blue",
     *           "price": 59.95
     *          }
     *        ]
     *      }
     *     </dataset>
     *     <simplelayout></simplelayout>
     *     <replicator classname="text" datapath="$bikeshop/bicycle[1]/color"></replicator>
     *
     * It's also possible to replicate a range of items in the array with the [start,end,stepsize] operator. This replicates every other item:
     *
     *     @example
     *     <dataset name="bikeshop">
     *      {
     *        "bicycle": [
     *          {
     *           "color": "red",
     *           "price": 19.95
     *          },
     *          {
     *           "color": "green",
     *           "price": 29.95
     *          },
     *          {
     *           "color": "blue",
     *           "price": 59.95
     *          }
     *        ]
     *      }
     *     </dataset>
     *     <simplelayout></simplelayout>
     *     <replicator classname="text" datapath="$bikeshop/bicycle[0,3,2]/color"></replicator>
     *
     * Sometimes it's necessary to have complete control and flexibility over filtering and transforming results. Adding a [@] operator to the end of your datapath causes {@link #filterfunction filterfunction} to be called for each result. This example shows bike colors for bikes with a price greater than 20, in reverse order:
     *
     *     @example
     *     <dataset name="bikeshop">
     *      {
     *        "bicycle": [
     *          {
     *           "color": "red",
     *           "price": 19.95
     *          },
     *          {
     *           "color": "green",
     *           "price": 29.95
     *          },
     *          {
     *           "color": "blue",
     *           "price": 59.95
     *          }
     *        ]
     *      }
     *     </dataset>
     *     <simplelayout></simplelayout>
     *     <replicator classname="text" datapath="$bikeshop/bicycle[*][@]">
     *       <method name="filterfunction" args="obj, accum">
     *         // add the color to the beginning of the results if the price is greater than 20
     *         if (obj.price > 20)
     *           accum.unshift(obj.color);
     *         return accum
     *       </method>
     *     </replicator>
     *
     * See [https://github.com/flitbit/json-path](https://github.com/flitbit/json-path) for more details.
     */
/**
        * @attribute {Boolean} [pooling=false]
        * If true, reuse views when replicating.
        */
/**
        * @attribute {Array} [data=[]]
        * The list of items to replicate. If {@link #datapath datapath} is set, it is converted to an array and stored here.
        */
/**
        * @attribute {String} classname (required)
        * The name of the class to be replicated.
        */
/**
        * @attribute {String} datapath
        * The datapath expression to be replicated.
        * See [https://github.com/flitbit/json-path](https://github.com/flitbit/json-path) for details.
        */
/**
        * @attribute {String} [sortfield=""]
        * The field in the data to use for sorting. Only sort then this 
        */
/**
        * @attribute {Boolean} [sortasc=true]
        * If true, sort ascending.
        */
/**
        * @attribute {String} [filterexpression=""]
        * If defined, data will be filtered against a [regular expression](https://developer.mozilla.org/en/docs/Web/JavaScript/Guide/Regular_Expressions). 
        */
/**
        * @method refresh
        * Refreshes the dataset manually
        */
/**
        * @method filterfunction
        * @abstract
        * Called to filter data.
        * @param obj An individual item to be processed.
        * @param {Object[]} accum The array of items that have been accumulated. To keep a processed item, it must be added to the accum array.
        * @returns {Object[]} The accum array. Must be returned otherwise results will be lost.
        */
/**
     * @class dr.shim
     * @extends dr.node
     * Connects to the shared event bus. When data is sent with a given type, a corresponding event is sent. For example, send('blah', {}) sends data with the 'blah' type, other shims will receive the object via an 'onblah' event.
     */
/**
        * @attribute {Boolean} [connected=false] (readonly)
        * If true, we are connected to the server
        */
/**
        * @attribute {Number} [pingtime=1000]
        * The frequency used to reconnect to the server
        */
/**
        * @attribute {Boolean} [websockets=false]
        * If true, use websockets to connect to the server
        */
/**
        * @method send
        * Sends some data over the event bus.
        * @param {String} type The type of event to be sent.
        * @param {Object} data The data to be sent.
        */
/**
     * @class dr.simplelayout
     * @extends dr.layout
     * A layout that stacks views on the x or y axis.
     *
     *
     *     @example
     *     <simplelayout axis="y"></simplelayout>
     *
     *     <view width="100" height="25" bgcolor="lightpink"></view>
     *     <view width="100" height="25" bgcolor="plum"></view>
     *     <view width="100" height="25" bgcolor="lightblue"></view>
     */
/**
        * @attribute {Number} [inset=0]
        * Amount to inset the layout
        */
/**
        * @attribute {Number} [spacing=15]
        * Amount of spacing between views
        */
/**
        * @attribute {"x"/"y"} [axis=x]
        * The axis to stack on
        */
/**
     * @class dr.slider
     * @extends dr.view
     * An input component whose state is changed when the mouse is dragged.
     *
     *     @example
     *
     *     <slider name="hslide" y="5" width="250" height="10" value="50" bgcolor="#808080"></slider>
     * Slider with a label:
     *
     *     @example
     *     
     *     <simplelayout axis="x" spacing="8"></simplelayout>
     *     <slider name="hslide" y="5" width="250" height="10" value="50" bgcolor="#808080"></slider>
     *     <text text="${Math.round(this.parent.hslide.value)}" y="${this.parent.hslide.y + (this.parent.hslide.height-this.height)/2}"></text>
     */
/**
        * @attribute {Number} [minvalue=0]
        * The minimum value of the slider
        */
/**
        * @attribute {Number} [maxvalue=100]
        * The maximum value of the slider
        */
/**
        * @attribute {"x"/"y"} [axis=x]
        * The axis to track on
        */
/**
        * @attribute {Boolean} [invert=false]
        * Set to true to invert the direction of the slider.
        */
/**
        * @attribute {Number} [value=0]
        * The current value of the slider.
        * Use changeValue() to range check the number and set the value.
        */
/**
        * @method changeValue
        * Given a new value for the slider position, constrain the value
        * between minvalue and maxvalue and then calls setAttribute.
        * @param {Number} v The new value of the component.
        */
/**
        * @attribute {String} [selectcolor="#a0a0a0"]
        * The selected color of the slider.
        */
/**
     * @class dr.stats
     * @extends dr.view
     * wraps the three.js stats control which shows framerate over time
     *
     * This example shows how use the stats control to monitor framerate:
     *
     *     @example
     *     <stats></stats>
     */
/**
     * @class dr.touch
     * @extends dr.node
     * Receives touch and multitouch data where available.
     */
/**
        * @attribute {Number} [x=0] (readonly)
        * The touch x value for the first finger.
        */
/**
        * @attribute {Number} [y=0] (readonly)
        * The touch y value for the first finger.
        */
/**
        * @attribute {Object[]} touches (readonly)
        * An array of x/y coordinates for all fingers, where available. See [https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Touch_events](https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Touch_events) for more details
        */
