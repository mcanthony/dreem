/**
     * @class dr.webpage {UI Components}
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
     *     <webpage src="http://en.wikipedia.org/wiki/San_Francisco" width="300" height="140"></webpage>
     *
     * To make the web page clickable, and to add scrolling:
     *
     *     @example
     *     <webpage src="http://en.wikipedia.org/wiki/San_Francisco" width="300" height="140" scrolling="true" clickable="true"></webpage>
     *
     * The content of the iframe can also be dynamically generated, including
     * adding Dreem code:
     *
     *     @example
     *     <webpage width="300" height="140" contents="Hello"></webpage>
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
