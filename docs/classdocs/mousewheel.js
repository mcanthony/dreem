/**
 * @class dr.mousewheel {Input}
 * @extends dr.node
 *
 * Mixin that allows any view to receive mousewheel events.
 *
 *     @example
 *     <view x="10" y="10" height="120" width="300" bgcolor="#ED56F4" with="mousewheel">
 *       <text name="wheeltext" color="white" text="Scroll the wheel in this view."></text>
 *       <handler event="onwheel" args="delta">
 *         this.wheeltext.setAttribute("text", "The wheel is @ (x:"+ delta.x + ", y:" + delta.y + ")")
 *       </handler>
 *
 *     </view>
 *
 */
