/**
   * @class dr.ace {UI Components}
   * @extends dr.view
   * Ace editor component.
   *
   *     @example
   *     <ace id="editor" width="500" text='Hello World'></ace>
   *
   * The initial text can also be included inline, and include dreem code.
   *
   *     @example wide
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
