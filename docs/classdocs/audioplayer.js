/**
     * @class dr.audioplayer {UI Components}
     * @extends dr.node
     * audioplayer wraps the web audio APIs to provide a declarative interface to play audio.
     *
     * This example shows how to load and play an mp3 audio file from the server:
     *
     *     @example
     *     <audioplayer id="player" url="${DREEM_ROOT + 'examples/music/YACHT_-_09_-_Im_In_Love_With_A_Ripper_Party_Mix_Instrumental.mp3'}" playing="true"></audioplayer>
     *     <labelbutton text="Stop Player">
     *       <handler event="onclick">
     *         player.setAttribute('playing', !player.playing)
     *         this.setAttribute('text', (player.playing ? 'Stop' : 'Start') + ' Player')
     *       </handler>
     *     </labelbutton>
     */
/**
        * @attribute {String} url
        * The URL to an audio file to play
        */
/**
        * @attribute {Number} loadprogress
        * @readonly
        * A Number between 0 and 1 representing load progress
        */
/**
        * @attribute {Boolean} loaded
        * @readonly
        * If true, the audio is done loading
        */
/**
        * @attribute {Number} volume
        * The audio volume (0-1)
        */
/**
        * @attribute {Boolean} playing
        * If true, the audio is playing.
        */
/**
        * @attribute {Boolean} paused
        * If true, the audio is paused.
        */
/**
        * @attribute {Boolean} loop
        * If true, the audio will play continuously.
        */
/**
        * @attribute {Number} time
        * @readonly
        * The number of seconds the file has played, with 0 being the start.
        */
/**
        * @attribute {Number} duration
        * @readonly
        * The duration in seconds.
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
        * @attribute {Number[]} fft
        * @readonly
        * An array of numbers representing the FFT analysis of the audio as it's playing.
        */
