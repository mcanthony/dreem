/**
 * @class dr.statebutton {UI Components}
 * @extends dr.view
 * A button that may be configured with views associated with named states. Change which view is active by setting the state attribute. If the state names 'default', 'over', and 'down' are used then state changes based on mouse interactions will automatically be configured by default. If those states are not present then mouse interactions will not be automatically configured, and will be left to the developer to implement.
 *
 * Here is a statebutton configured with three bitmaps associated with the states default, over, and down. Notice the mouse interaction is set up by default.
 *
 *     @example
 *     <statebutton width="100" height="100">
 *       <bitmap name="defaultv" width="100%" height="100%" src="../api-examples-resources/default.png">
 *         <attribute name="state" type="string" value="default"></attribute>
 *       </bitmap>
 *
 *       <bitmap name="overv" width="100%" height="100%" src="../api-examples-resources/over.png">
 *         <attribute name="state" type="string" value="over"></attribute>
 *       </bitmap>
 *
 *       <bitmap name="downv" width="100%" height="100%" src="../api-examples-resources/down.png">
 *         <attribute name="state" type="string" value="down"></attribute>
 *       </bitmap>
 *     </statebutton>
 *
 * Setting the interactive attribute to false disables the default hover and down state changes.
 *
 *     @example
 *     <statebutton interactive="false" width="100" height="100">
 *       <bitmap name="defaultv" width="100%" height="100%" src="../api-examples-resources/default.png">
 *         <attribute name="state" type="string" value="default"></attribute>
 *       </bitmap>
 *
 *       <bitmap name="overv" width="100%" height="100%" src="../api-examples-resources/over.png">
 *         <attribute name="state" type="string" value="over"></attribute>
 *       </bitmap>
 *
 *       <bitmap name="downv" width="100%" height="100%" src="../api-examples-resources/down.png">
 *         <attribute name="state" type="string" value="down"></attribute>
 *       </bitmap>
 *     </statebutton>
 *
 * Configuring custom states will also set the interactive flag to false, and then you can add your own custom state changes
 *
 *     @example
 *     <statebutton width="100" height="100">
 *       <attribute name="statetracker" type="number" value="0"></attribute>
 *       <handler event="onclick">
 *         var newStateIndex = this.statetracker + 1;
 *         if (newStateIndex == 3) newStateIndex = 0;
 *         this.setAttribute('statetracker', newStateIndex)
 *         this.setAttribute('state', this.states[newStateIndex])
 *       </handler>
 *  
 *       <bitmap name="onev" width="100%" height="100%" src="../api-examples-resources/default.png">
 *         <attribute name="state" type="string" value="one"></attribute>
 *       </bitmap>
 *
 *       <bitmap name="twov" width="100%" height="100%" src="../api-examples-resources/over.png">
 *         <attribute name="state" type="string" value="two"></attribute>
 *       </bitmap>
 *
 *       <bitmap name="threev" width="100%" height="100%" src="../api-examples-resources/down.png">
 *         <attribute name="state" type="string" value="three"></attribute>
 *       </bitmap>
 *     </statebutton>
 */
/**
    * @attribute {String} [state="default"]
    * The currently active state.
    */
/**
    * @attribute {Boolean} [interactive="true"]
    * When true default, over, and down states are applied automatically based on mouse/touch interactions. Set to false to disable the default behavior.
    */
/**
    * @attribute {String[]} states
    * @readonly
    * An array of the states
  */
/**
    * @attribute {dr.view} activeview
    * @readonly
    * The currently active view
  */
