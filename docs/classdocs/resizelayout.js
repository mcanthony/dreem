/**
      * @class dr.resizelayout {Layout}
      * @extends dr.spacedlayout
      * An extension of spaced layout that allows one or more "stretchy" views 
      * to fill in any remaining space.
      *
      * A view can be made stretchy by giving it a layouthint with a numerical
      * value, typically 1. Extra space is divided proportionally between all
      * strechy views based on that views percentage of the sum of the
      * "stretchiness" of all stretchy views. For example, a view with a
      * layouthint of 2 will get twice as much space as another view with
      * a layouthint of 1.
      *
      * Since resizelayouts rely on the presence of extra space, the
      * updateparent and updateparent attributes are not applicable to a 
      * resizelayout. Similarly, using auto sizing on the parent view along 
      * the same axis as the resizelayout will result in unexpected behavior 
      * and should therefore be avoided.
      *
      * Warning, providing no layouthint defaults the weight to 0, which will cause the view not to render.
      *
      *     @example
      *     <resizelayout spacing="10" inset="10" outset="10">
      *     </resizelayout>
      *
      *     <view y="10" height="20" bgcolor="pink" layouthint='{"weight":2}'></view>
      *     <view y="10" height="20" bgcolor="plum" layouthint='{"weight":3}'></view>
      *     <view y="10" height="20" bgcolor="lightgreen" layouthint='{"weight":1}'></view>
      *
      */
