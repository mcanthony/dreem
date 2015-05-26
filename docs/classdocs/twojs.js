/**
   * @class dr.twojs {UI Components}
   * @extends dr.view
   * View that is enabled with two dimensional drawing capabilities by making use of the twojs library.
   *
   *     @example
   *     <twojs bgcolor="MistyRose" width="285" height="200">
   *       <handler event="oninit">
   *         var circle = this.two.makeCircle(72, 72, 50);
   *         circle.fill = '#FF8000';
   *         circle.stroke = 'orangered';
   *         circle.linewidth = 5;
   *         this.two.update();
   *       </handler>
   *     </twojs>
   *
   * In addition to having access to the "two" instance, you also have access to the Two namespace, which provides methods and types you may need. Here we create Two.Anchor instances to create a bezier curve. 
   *
   *     @example
   *     <twojs bgcolor="pink" width="100" height="100">
   *       <handler event="oninit">
   *         var a1 = new Two.Anchor(0, 100, 0, 0, 60, -10, Two.Commands.curve);
   *         var a2 = new Two.Anchor(100, 0, -90, 30, 0, 0, Two.Commands.curve);
   *         var poly = this.two.makeCurve([a1,a2], true);
   *         poly.fill = "pink";
   *         this.two.update();
   *       </handler>
   *     </twojs>
   */
/**
    * @attribute {Object} two
    * Reference to the twojs context that provides API's for two dimensional drawing.
    */
