/**
     * @class dr.gyro {Input}
     * @extends dr.node
     * Receives gyroscope and compass data where available. See [https://w3c.github.io/deviceorientation/spec-source-orientation.html#deviceorientation](https://w3c.github.io/deviceorientation/spec-source-orientation.html#deviceorientation) and [https://developer.apple.com/library/safari/documentation/SafariDOMAdditions/Reference/DeviceOrientationEventClassRef/DeviceOrientationEvent/DeviceOrientationEvent.html](https://developer.apple.com/library/safari/documentation/SafariDOMAdditions/Reference/DeviceOrientationEventClassRef/DeviceOrientationEvent/DeviceOrientationEvent.html) for details.
     *
     *     @example
     *     <gyro id="gyro"></gyro>
     *
     *     <spacedlayout axis="y"></spacedlayout>
     *     <text id="text_beta" text="${'x axis: ' + gyro.beta}" fontsize="40"></text>
     *     <text id="text_gamma" text="${'y axis: ' + gyro.gamma}" fontsize="${text_beta.fontsize}"></text>
     *     <text id="text_alpha" text="${'z axis: ' + gyro.alpha}" fontsize="${text_beta.fontsize}"></text>
     *
     */
/**
        * @attribute {Boolean} [active=false] (readonly)
        * True if gyro is supported
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
