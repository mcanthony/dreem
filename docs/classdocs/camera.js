/**
 * @class dr.camera {UI Components}
 * @extends dr.node
 * Enables video and audio capture from the camera and microphone devices.
 *
 */
/**
    * @attribute {Boolean} [stream=false]
    * When set to true the user will be asked permission to access the device, and if permission is granted the stream will be started. When set to false the stream will be stopped. The {@link #streaming streaming} attribute indicates when the device is actually streaming.
    */
/**
    * @attribute {Boolean} [audio=true]
    * Set this to false if you don't want audio captured in the stream. 
    */
/**
    * @attribute {LocalMediaStream} mediastream
    * @readonly
    * The input stream from the camera.
    */
/**
    * @attribute {Boolean} [streaming=false]
    * @readonly
    * True when input is streaming from the device. False when it has been stopped, or if the user has denied access to the device.
    */
/**
    * @attribute {Boolean} [permissiondenied=false]
    * @readonly
    * True if the user has denied permission to access the device.
    */
/**
    * @attribute {Boolean} [supported=true]
    * @readonly
    * False if the camera component is not supported in the users browser. 
    */
