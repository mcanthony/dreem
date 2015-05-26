/**
      * @class dr.dragstate {UI Components}
      * @extends dr.state
      * Allows views to be dragged by the mouse.
      *
      * Here is a view that contains a dragstate. The dragstate is applied when
      * the mouse is down in the view, and then removed when the mouse is up. 
      * You can modify the attributes of the draggable view by setting them 
      * inside the dragstate, like we do here with bgcolor.
      *
      *     @example
      *     <view width="100" height="100" bgcolor="plum">
      *       <text text="DRAG ME!"></text>
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
      * To constrain the motion of the element to either the x or y axis set 
      * the dragaxis property. Here the same purple square can only move 
      * horizontally.
      *
      *     @example
      *     <view width="100" height="100" bgcolor="plum">
      *       <text text="DRAG ME!"></text>
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
