/**
     * @class dr.touch {Input}
     * @extends dr.node
     * Receives touch and multitouch data where available.
     * 
     *      @example
     *      <touch>
     *        <handler event="ontouches" args="touch_data">
     *          if (!touch_data.length) return;
     *          
     *          follow.setAttribute('x', touch_data[0].x);
     *          follow.setAttribute('y', touch_data[0].y);
     
     *          if (!touch_data.length) return;
     * 
     *          if (touch_data[0]) {
     *            follow.setAttribute('x', touch_data[0].x);
     *            follow.setAttribute('y', touch_data[0].y);
     *          }
     *
     *          if (touch_data[1]) {
     *            follow2.setAttribute('x', touch_data[1].x);
     *            follow2.setAttribute('y', touch_data[1].y);
     *          }
     *        </handler>
     *      </touch>
     *
     *      <view id="follow" width="50" height="50" x="0" y="0" bgcolor="pink"></view>
     *      <view id="follow2" width="50" height="50" x="50" y="50" bgcolor="thistle"></view>
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
