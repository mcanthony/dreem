/**
    * @class dr.animator {Animation}
    * @extends dr.node
    * Animator class that can animate keys on other objects
    *
    *     @example nested
    *     <view bgcolor="red" x="0" y="0" width="100" height="100">
    *       <animator attribute="x" to="200" duration="1000">
    *         <handler event="onend">
    *           console.log('the animation ended')
    *         </handler>
    *       </animator>
    *     </view>
    */
/**
      * @attribute {Number} delay=0
      * The amount of time to delay the start of the animation
      */
/**
      * @attribute {String} from
      * The value to start the animation from, if not specified is read from the target attribute
      */
/**
      * @attribute {String} to=0
      * The value to animate to. Is identical to specifying a <keyframe at='{duration}'>{to}</keyframe>
      */
/**
      * @attribute {Number} duration=1000
      * The duration of the animation. Is identical to specifying a <keyframe at='{duration}'>{to}</keyframe>
      */
/**
      * @attribute {String} attribute
      * The name of the attribute this animator is animating
      */
/**
      * @attribute {String} target
      * Name of the target object id, not needed if animator is used as a child tag in the target node
      */
/**
      * @attribute {Boolean} paused=false
      * wether or not the animator is paused
      */
/** 
      * @attribute {String} motion=bret
      * name of the motion the animation is following
      * valid values are:
      * 'bezier' use a cubic bezier motion function
      *   use control points in control='x1,y1,x2,y2' 
      *   for example control='0,0,1,1'
      *   bezier control points work the same as the CSS3 cubic-bezier easing
      * 'bret' uses brets animation function, has 2 control points
      *   control='start,end' value near 0 (0.01) will produce a curved line
      *   where values near 1.0 will produce a straight line
      *   this way you can control the 'easing' from 'smooth' (0.01) to 'hard' (1.0)
      *   on each side start / end of the animation
      *   for example control='0.01,1.00' produces an animation with a smooth start and a hard end 
      * 'linear' simple linear motion
      * the following curves can be seen here http://api.jqueryui.com/easings/
      * 'inQuad' use a t^2 curve
      * 'outQuad' t^2 curve on out
      * 'inOutQuad' mix of inQuad and outQuad
      * 'inCubic' use a t^3 curve
      * 'outCubic' t^3 curve on out
      * 'inOutCubic' mix of inCubic and outCubic
      * 'inQuart' t^4 curve
      * 'outQuart' t^4 curve on out
      * 'inOutQuart' mix of inQuart and outQuart
      * 'inQuint' t^5 curve
      * 'outQuint' t^5 curve on out
      * 'inOutQuint' mix of inQuint and outQuint
      * 'inSine' sin(t) curve
      * 'outSine' sin(t) on out
      * 'inOutSine' mix of inSine and outSine
      * 'inExpo' e^t curve
      * 'outExpo' e^t curve on end
      * 'inOutExpo' mix of inExpo and outExpo
      * 'inElastic' elastic (like bounce, but overshoots) curve
      * 'outElastic' elastic on end
      * 'inOutElastic' mix of inElastic and outElastic
      * 'inBack' overshooting curve
      * 'outBack' overshooting on end
      * 'inOutBack' mix of inBack and outBack
      * 'inBounce' Bouncing curve
      * 'outBounce' Bouncing curve on end
      * 'inOutBounce' mix of inBounce and outBounce
      */
/**
      * @attribute {String} control=0.01
      * control points for the bret and bezier motions
      */
/**
      * @attribute {Number} repeat=1
      * how many times to repeat the loop (repeat 2 runs something twice)
      */
/**
      * @attribute {Boolean} bounce=false
      * turn on bounce looping
      */
/**
      * @attribute {Boolean} relative=false
      * animation is relative to original value
      */
/**
      * @event onstart
      * Fired when animation starts
      */
/**
      * @event onend
      * Fired when animation ends
      */
/**
      * @event ontick
      * Fired every step of the animation
      */
