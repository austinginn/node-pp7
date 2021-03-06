//PP7 API Node Module
import { fetch } from 'undici';
import { TextDecoderStream } from 'node:stream/web';
import { EventEmitter } from "events";

//TYPEDEFs
/**
 * @typedef {Object} Annoucement
 * @property {Id_Type_1} id
 * @property {Array.<Announcement_Group>} groups
 * @property {boolean} has_timeline
 * @property {string} presentation_path
 * @property {string} destination
 */

/**
 * @typedef {Object} Announcement_Group
 * @property {String} name
 * @property {Color} color
 * @property {Array.<Slide>} slides
 */

/**
 * @typedef {Object} Slide
 * @property {Boolean} true
 * @property {String} notes
 * @property {String} text
 * @property {String} label
 * @property {Size} size
 */

/**
 * @typedef {Object} Size
 * @property {Number} width
 * @property {Number} height
 */

/**
 * @typedef {Object} Announcement_Index
 * @property {Number} index
 * @property {Id_Type_1} presentation_id
 */

/**
 * @typedef {Object} Announcement_Timeline
 * @property {Boolean} is_running
 * @property {Number} current_time
 */

/**
 * @typedef {Object} Capture_Settings
 * @property {String} source
 * @property {Array} audio_routing
 * @property {Object} disk
 */

/**
 * @typedef {Object} Capture_Status
 * @property {String} status
 * @property {String} capture_time
 * @property {String} status_description
 */

/**
 * @typedef {Object} Video_Input
 * @property {Object} id
 */

/**
 * @typedef {Object} Mask
 * @property {Id_Type_1} id
 */

/**
 * @typedef {Object} Audio_Item
 * @property {Id_Type_1} id
 * @property {String} audio
 * @property {String} artist
 * @property {Number} duration
 */

/**
 * @typedef {Object} Audio_Playlist
 * @property {Id_Type_1} id
 * @property {String} type
 * @property {Array.<Audio_Playlist>} [children]
 */

/**
 * @typedef {Object} Audio_Active
 * @property {Audio_Playlist} playlist
 * @property {Audio_Item} item
 */

/**
 * @typedef {Object} Clear_Group
 * @property {Id_Type_1} id
 * @property {String} icon
 * @property {Object} tint
 * @property {Array.<String>} layers
 * @property {Boolean} stop_timeline_announcements
 * @property {Boolean} stop_timeline_presentation
 * @property {Boolean} clear_next_presentation
 */

/**
 * @typedef {Object} Clear_Group_Options
 * @property {String} icon
 * @property {Object} tint
 * @property {Array.<String>} layers
 * @property {Boolean} stop_timeline_announcements
 * @property {Boolean} stop_timeline_presentation
 * @property {Boolean} clear_next_presentation
 */

/**
 * @typedef {Object} Library
 * @property {Id_Type_1} id
 */

/**
 * @typedef {Object} Library_Items
 * @property {string} updateType
 * @property {Array.<Id_Type_1>} items - library items
 */

/**
 * @typedef {Object} Id_Type_1
 * @property {String} uuid
 * @property {String} name
 * @property {Number} index
 */

/**
 * @typedef {Object} Screen
 * @property {Boolean} video_input
 * @property {Boolean} media
 * @property {Boolean} slide
 * @property {Boolean} annoucements
 * @property {Boolean} props
 * @property {Boolean} messages
 * @property {string} presentation
 * @property {string} mask
 */

/**
 * @typedef {Object} Looks
 * @property {Id_Type_1} [id]
 * @property {Array.<Screen>} screens
 */

/**
 * @typedef {Object} Color
 * @property {int} red
 * @property {int} green
 * @property {int} blue
 * @property {int} alpha
 */

/**
 * @typedef {Object} Macro
 * @property {Id_Type_1} [id]
 * @property {Color} color
 */

/**
 * @typedef {Object} Media_Item
 * @property {Id_Type_1} id
 * @property {string} type
 * @property {string} artist
 * @property {int} duration
 */

/**
 * @typedef {Object} Media_Playlist
 * @property {Id_Type_1} id
 * @property {Array.<Media_Item>} items
 */

/**
 * @typedef {Object} Media_Playlists
 * @property {Id_Type_1} id
 * @property {String} type
 * @property {Array.<Media_Playlists>} children - if playlist folder is used
 */

/**
 * @typedef {Object} Message
 * @property {Id_Type_1} id
 * @property {string} message
 * @property {Array.<Token>} tokens - see propresenter openapi for format
 * @property {Id_Type_1} theme
 */

/**
 * @typedef {Object} Token
 * @property {String} name
 * @property {Text} text
 */

/**
 * @typedef {Object} Text
 * @property {String} text
 */

/**
 * @typedef {Object} Prop
 * @property {Id_Type_1} id
 * @property {boolean} is_active
 */

/**
 * @typedef {Object} Group
 * @property {Id_Type_1} id
 * @property {Color} color
 */

/**
 * @typedef {Object} Playlists
 * @property {Id_Type_1} id
 * @property {String} flied_type
 * @property {Array.<Playlist>} children
 */

/**
 * @typedef {Object} Playlist_Create
 * @property {String} name
 * @property {('playlist'|'group')} type
 */

/**
 * @typedef {Object} Playlist
 * @property {Id_Type_1} id - playlist id
 * @property {Array.<Playlist_Item>} items
 */

/**
 * ProPresenter playlist items
 * @typedef {Object} Playlist_Item
 * @property {Id_Type_1} id - playlist item id
 * @property {String} type
 * @property {Boolean} is_hidden
 * @property {Boolean} is_pco 
 */

class PP7 {
    /**
     * Constructor for ProPresenter Object
     * @param {string} protocol - either http or https
     * @param {string} ip - ip address of ProPresenter instance
     * @param {int} port - port # configured in ProPresenter
     */
    constructor(protocol = 'http', ip = '127.0.0.1', port = 1025) {

        //Possible layer types
        const LAYERS = ['audio', 'props', 'messages', 'announcements', 'slide', 'media', 'video_input'];

        //Possible timeline operations
        const TIMELINE = ['play', 'pause', 'rewind'];

        //Possible capture operations
        const capture = ['start', 'stop'];

        //possible capture types
        const CAPTURE_TYPES = ['disk', 'rtmp', 'resi'];

        //Possible trigger operations
        const TRIGGER = ['next', 'previous'];

        //Possible audio playlist focus options
        const AUDIO_PLAYLIST_FOCUS = ['next', 'previous', 'active', 'id'];

        //Possible audio playlist trigger options
        const AUDIO_PLAYLIST_TRIGGER = ['focused', 'active'];

        //Possible media playlist identifier request
        const MEDIA_PLAYLIST_IDS = ['focused', 'active'];

        //Possible media playlist focus options
        const MEDIA_PLAYLIST_FOCUS = ['next', 'previous', 'active', 'id'];

        //Possible media playlist focus options
        const MEDIA_PLAYLIST_TRIGGER = ['focused', 'active', 'id'];

        //Possible media playlist focus options
        const MEDIA_PLAYLIST_FOCUSED = ['next', 'previous', 'id'];

        //possilbe playlist active focus/trigger destinations
        const ACTIVE_PLAYLIST = ['presentation', 'announcement'];

        //Timer Operations
        const TIMER_OPERATIONS = ['start', 'stop', 'reset'];

        const VERSION = 'v1'

        this._config = {
            version: VERSION,
            protocol: protocol,
            ip: ip,
            port: port,
            endpoint: protocol + '://' + ip + ":" + port + '/' + VERSION + '/'
        }


        console.log(this._config); //check
        const eventEmitter = new EventEmitter();
    }
    //psuedo private methods

    _get = async (url, parse = 'JSON', headers = { 'Content-Type': 'application/json' }) => {
        try {
            const response = await fetch(url, {
                headers: headers
            });

            const status = checkStatus(await response.status); //always will be a status

            let data = {};

            if (parse == 'JSON') {
                data = await response.json();
                return { status: status, data: data };
            } //not always
            if (parse == 'image') {
                const imageBlob = await response.blob()
                return { status: status, data: imageBlob }
            }

            return { status: status, data: data };
        } catch (error) {
            throw error;
        }
    }

    //Fetch POST request wrapper and error handling
    _post = async (url, parse = 'JSON', body = {}, headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }) => {
        try {
            // console.log(body);
            const response = await fetch(url, {
                method: 'POST',
                headers: headers,
                body: body
            });

            const status = checkStatus(await response.status);
            let data = {}

            if (parse == 'JSON') {
                data = await response.json();
                return { status: status, data: data };
            }
            return { status: status, data: data };
        } catch (err) {
            throw err;
        }
    }

    //Fetch PUT request wrapper and error handling
    _put = async (url, parse = 'JSON', body = {}, headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }) => {
        try {
            // console.log(body);
            const response = await fetch(url, {
                method: 'PUT',
                headers: headers,
                body: body
            });

            const status = checkStatus(await response.status);

            let data = {};
            if (parse == 'JSON') {
                data = await response.json();
                return { status: status, data: data };
            } //not always

            return { status: status, data: data };
        } catch (err) {
            throw err;
        }
    }

    //Fetch DELETE request wrapper and error handling
    _del = async (url) => {
        try {
            const response = await fetch(url, {
                method: 'DELETE'
            });

            const status = checkStatus(await response.status);

            let data = {};
            return { status: status, data: data };
        } catch (err) {
            throw err;
        }
    }

    //Fetch response status error handling
    _checkStatus = status => {
        if (status >= 200 && status < 300) {
            return status;
        } else {
            let err = new Error(status.statusText);
            err.response = status;
            throw err
        }
    }

    //Parses streamed chunks and emits correct events
    _updateHandler = async (chunk) => {
        // console.log(JSON.stringify(chunk));
        // console.log("New Chunk");
        let arr = chunk.split('\r\n\r\n');
        arr.pop();
        for (let i = 0; i < arr.length; i++) {
            // console.log(arr[i]);
            arr[i] = JSON.parse(arr[i]);
            // console.log(arr[i].url);
            // console.log("*");
            eventEmitter.emit(arr[i].url, arr[i].data);
        }
    }

    //Check if integer
    _isInt = (value) => {
        return !isNaN(value) &&
            parseInt(Number(value)) == value &&
            !isNaN(parseInt(value, 10));
    }


    //Public Methods
    /**
     * Gets the currently active annoucement presentation
     * @returns {Annoucement} 
     */
    async announcementActive() {
        try {
            let response = await get(config.endpoint + 'announcement/active');
            return response.data.announcement;
        } catch (err) {
            console.log(err);
        }
    }

    /**
     * Gets the index of the current slide/cue within the currently active announcement
     * 
     * @returns {Announcement_Index}
     */
    async announcementSlideIndex() {
        try {
            let response = await get(config.endpoint + 'announcement/slide_index');
            return response.data.announcement_index;
        } catch (err) {
            console.log(err);
        }
    }

    /**
     * Focuses the currently active announcement presentation
     * @returns {void}
     */
    async announcementFocus() {
        try {
            let response = await get(config.endpoint + 'announcement/active/focus', false);
            return;
        } catch (err) {
            throw (err);
        }
    }

    /**
    * Retriggers the currently active announcement presentation (starts from the beginning).
    * @returns  {void}
    */
    async announcementRetrigger() {
        try {
            let response = await get(config.endpoint + 'announcement/active/trigger', false);
            return;
        } catch (err) {
            console.log(err);
        }
    }

    /**
     * Triggers cue in the active announcement presentation based on option
     * @param {('next'|'previous'|'index')} option - next, previous, or index
     * @param {int} [index] 
     * @returns {void}
     */
    async announcementTrigger(option = 'next', index) {
        try {
            let response;
            if (option == 'index') {
                response = await get(config.endpoint + 'announcement/active/' + index + '/trigger', false);
            } else {
                response = await get(config.endpoint + 'announcement/active/' + option + '/trigger', false);
            }
            return;
        } catch (err) {
            console.log(err);
        }
    }

    /**
     * Get the current state of the active announcement timeline
     * @returns {Announcement_Timeline}
     */
    async announcementTimelineStatus() {
        try {
            let response = await get(config.endpoint + 'announcement/active/timeline');
            //console.log(response); //check
            return response.data;
        } catch (err) {
            console.log(err);
        }
    }

    /**
     * Performs the requested timeline operation for the active announcement presentation
     * @param {('play'|'pause'|'rewind')} option - play, pause, rewind
     * @returns {void}
     */
    async announcementTimelineTransport() {
        if (TIMELINE.indexOf(option) == -1) { console.log("invalid option"); return -1; }

        try {
            let response = await get(config.endpoint + 'announcement/active/timeline/' + option, false);
            return;
        } catch (err) {
            console.log(err);
        }
    }

    /**
     * Gets a list of all available capture modes for the capture type
     * @param {('disk'|'rtmp'|'resi')} option - capture types (disk, rtmp, resi)
     * @returns {Array.<String>}
     */
    async captureEncodings(option = 'disk') {
        if (CAPTURE_TYPES.indexOf(option) == -1) { console.log('check options'); return -1 }
        try {
            let response = await get(config.endpoint + 'capture/encodings/' + option);
            console.log(response); //check
            return response.data;
        } catch (err) {
            console.log(err);
        }
    }

    /**
     * Performs the requested capture operation
     * @param {('start'|'stop')} option - The capture operation to perform (start, stop)
     * @returns {void}
     */
    async captureTransport(option = 'start') {
        if (capture.indexOf == -1) { console.log('check options'); return -1; }
        try {
            let response = await get(config.endpoint + 'capture/' + option, false);
            // console.log(response); //check
            return;
        } catch (err) {
            console.log(err);
        }
    }

    /**
     * Gets the currrent capture settings
     * @returns {Capture_Settings} - capture settings
     */
    async captureSettings() {
        try {
            let response = await get(config.endpoint + 'capture/settings');
            // console.log(response); //check
            return response.data;
        } catch (err) {
            console.log(err);
        }
    }

    /**
     * Gets the current capture status and capture time
     * @returns {Capture_Status} - capture status
     */
    async captureStatus() {
        try {
            let response = await get(config.endpoint + 'capture/status', false);
            // console.log(response); //check
            return response.data;
        } catch (err) {
            console.log(err);
        }
    }

    /**
     * Triggers the next or previous cue in the currently active playlist or library
     * @param {('next'|'previous')} option - next or previous
     * @returns {void}
     */
    async trigger(option = 'next') {
        if (TRIGGER.indexOf(option) == -1) { console.log('check option'); return -1 }
        try {
            let response = await get(config.endpoint + 'trigger/' + option, false);
            console.log(response); //check
            return;
        } catch (err) {
            console.log(err);
        }
    }

    /**
     * Triggers the next or previous item in the currently active audio playlist
     * @param {('next'|'previous')} option - next or previous
     * @returns {void}
     */
    async triggerAudio(option = 'next') {
        if (TRIGGER.indexOf(option) == -1) { console.log('check option'); return -1 }
        try {
            let response = await get(config.endpoint + 'trigger/audio/' + option, false);
            console.log(response); //check
            return;
        } catch (err) {
            console.log(err);
        }
    }

    /**
     * Triggers the next or previous item in the currently active media playlist
     * @param {('next'|'previous')} option - next or previous
     * @returns {void}
     */
    async triggerMedia(option = 'next') {
        if (TRIGGER.indexOf(option) == -1) { console.log('check option'); return -1 }
        try {
            let response = await get(config.endpoint + 'trigger/media/' + option, false);
            console.log(response); //check
            return;
        } catch (err) {
            console.log(err);
        }
    }

    /**
     * Gets the contents of the video inputs playlist
     * @returns {Array.<Video_Input>}
     */
    async videoInputs() {
        try {
            let response = await get(config.endpoint + 'video_inputs');
            console.log(response); //check
            return response.data;
        } catch (err) {
            console.log(err);
        }
    }

    /**
     * Triggers specified video input from the video inputs playlist
     * @param {string} id - the UUID of the video input (will take url encoded name or index as well)
     * @returns {void}
     */
    async videoInputsTrigger(id) {
        if (!id) { console.log('check id'); return -1; }
        try {
            let response = await get(config.endpoint + 'video_inputs/' + id + '/trigger', false);
            console.log(response);
            return;
        } catch (err) {
            throw err;
        }
    }

    /**
     * Gets a list of all configured masks
     * @returns {Array.<Mask>} 
     */
    async masks() {
        try {
            let response = await get(config.endpoint + 'masks');
            // console.log(response);
            return response.data;
        } catch (err) {
            throw err;
        }
    }

    /**
     * Gets the details of the specified mask
     * @param {string} id - The UUID of the mask (will take url encoded name or index as well) 
     * @returns {Mask}
     */
    async mask(id) {
        try {
            let response = await get(config.endpoint + 'mask/' + id);
            // console.log(response);
            return response.data;
        } catch (err) {
            throw err;
        }
    }

    /**
     * Gets a thumbnail image of the specified mask at the given quality value
     * @param {string} id - The UUID of the mask (will take url encoded name or index as well)
     * @param {int} [quality=400] - The desired quality of the thumbnail. The value is the number of pixels in the largest dimension of the image. Defaults to 400
     * @returns {Blob}
     */
    async maskThumbnail(id, quality = 400) {
        if (!id) { console.log('check id'); return -1; }
        if (!isInt(quality)) { console.log('check quality var'); return -1; }
        try {
            let response = await get(config.endpoint + 'mask/' + id + '/thumbnail?quality=' + quality, 'image', { 'Content-Type': 'image/jpeg' });
            console.log(response);
            return response.data;
        } catch (err) {
            throw err;
        }
    }

    /**
     * Gets a list of all the audio items in the specified audio playlist NEED TO CHECK RETURN DATA
     * @param {string} id - The UUID of the audo playlist id (will take url encoded name or index as well)
     * @returns {Array.<Audio_Item>}
     */
    async audioPlaylist(id) {
        if (!id) { console.log('check id'); return -1; }
        try {
            let response = await get(config.endpoint + 'audio/playlist/' + id + '?start=0');
            // console.log(response);
            return response.data.items;
        } catch (err) {
            throw err;
        }
    }

    /**
     * Gets the currently focused audio playlist
     * @returns {Audio_Playlist}
     */
    async audioPlaylistFocused() {
        try {
            let response = await get(config.endpoint + 'audio/playlist/focused');
            // console.log(response);
            return response.data;
        } catch (err) {
            throw err;
        }
    }

    /**
     * Gets the currently active audio playlist
     * @returns {Audio_Active}
     */
    async audioPlaylistActive() {
        try {
            let response = await get(config.endpoint + 'audio/playlist/active');
            // console.log(response);
            return response.data;
        } catch (err) {
            throw err;
        }
    }

    /**
     * Focuses either the active, next, previous or specified audio playlist
     * @param {('active'|'next'|'previous'|'id')} option - active, next, previous or id
     * @param {String} [id] - id of audio playlist
     * @returns {void}
     */
    async audioPlaylistFocus(option = 'active', id) {
        try {
            let response
            if (option == 'id') {
                response = await get(config.endpoint + 'audio/playlist/' + id + '/focus', false);
            } else {
                response = await get(config.endpoint + 'audio/playlist/' + option + '/focus', false);
            }
            // console.log(response);
            return;
        } catch (err) {
            throw err
        }
    }


}

export default PP7;