/**
 * @class dr.microphone {UI Components}
 * @extends dr.node
 * Enables audio capture from the microphone device.
 *
 * This example uses the microphone to monitor the audio traffic, while also
 * amplifying the audio signal
 *
 *     @example
 *     <text italic="true" fontsize="14">(please open the console to see the output of this example)</text>
 *     <microphone id="mic" modifystream="true" visualize="false" stream="true">
 *       <method name="processStream" args="audio">
 *         if (!audio) return;
 *
 *         var inputBuffer = audio.inputBuffer;
 *         var left = inputBuffer.getChannelData(0);
 *         var right = inputBuffer.getChannelData(1);
 *
 *         var min = Math.min.apply(null, left);
 *         var max = Math.max.apply(null, right);
 *       </method>
 *     </microphone>
 *     <labelbutton text="Stop Recording">
 *       <handler event="onclick">
 *         mic.setAttribute('recording', !mic.recording)
 *         this.setAttribute('text', (mic.recording ? 'Stop' : 'Start') + ' Recording')
 *       </handler>
 *     </labelbutton>
 *
 */
/**
    * @attribute {Boolean} [visualize=true]
    * When set to true, fft visualization data is computed and available in the fft attribute.
    */
/**
    * @attribute {Number} fftsize
    * The number of fft frames to use when setting {@link #fft fft}. Must be a non-zero power of two in the range 32 to 2048.
    */
/**
    * @attribute {Number} [fftsmoothing=0.8]
    * The amount of smoothing to apply to the FFT analysis. A value from 0 -> 1 where 0 represents no time averaging with the last FFT analysis frame.
    */
/**
    * @attribute {Boolean} [modifystream=false]
    * When set to true the audio stream is passed to processStream method.
    * The audio object has an inputBuffer and outputBuffer. If you pass the
    * inputBuffer data to the outputBuffer, the audio will be passed to the
    * speaker.
    */
/**
    * @attribute {Boolean} [stream=false]
    * When set to true the user will be asked permission to access the device, and if permission is granted the stream will be started. When set to false the stream will be stopped. The {@link #streaming streaming} attribute indicates when the device is actually streaming.
    */
/**
    * @attribute {Boolean} [record=false]
    * Set this to true to started recording the input stream, set to false to stop. When recording is stopped the recording will be retained in memory until another recording is started. The URL to access the recording is saved in the playbackurl attribute. The {@link #recording recording} attribute indicates when the device is actually recording.  
    */
/**
    * @attribute {Object} mediastream
    * @readonly
    * The input stream (LocalMediaStream) from the microphone.
    */
/**
    * @attribute {Boolean} [streaming=false]
    * @readonly
    * True when input is streaming from the device. False when it has been stopped, or if the user has denied access to the device.
    */
/**
    * @attribute {Boolean} [recording=false]
    * @readonly
    * True when the stream is being recorded.
    */
/**
    * @attribute {Boolean} [permissiondenied=false]
    * @readonly
    * True if the user has denied permission to access the device.
    */
/**
    * @attribute {Number[]} fft
    * @readonly
    * An array of numbers representing the FFT analysis of the audio as it's playing.
    */
/**
    * @attribute {String} playbackurl
    * @readonly
    * Object URL of the latest recording, which can be used with an instance of dr.audioplayer to play back the recording.
    */
/**
    * @attribute {Boolean} [supported=true]
    * @readonly
    * False if the microphone component is not supported in the users browser. 
    */
/**
    * @attribute {Number} recordingtime
    * @readonly
    * The length of the recording in seconds. 
    */
/**
    * @method processStream
    * Process raw audio data from the microphone.
    * audioprocess objects are passed that contain stereo data samples.
    * The default implementation copies the input buffer into the output buffer.
    * @param {Object} audio audioprocess object.
    */
