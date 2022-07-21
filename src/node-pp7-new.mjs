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

        this._config = {
            version: 'v1',
            protocol: protocol,
            ip: ip,
            port: port,
            endpoint: protocol + '://' + ip + ":" + port + '/' + config.version + '/'
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

    async announcementTimelineStatus() {
        try {
            let response = await get(config.endpoint + 'announcement/active/timeline');
            //console.log(response); //check
            return response.data;
        } catch (err) {
            console.log(err);
        }
    }

    async announcementTimelineTransport() {
        if (TIMELINE.indexOf(option) == -1) { console.log("invalid option"); return -1; }

        try {
            let response = await get(config.endpoint + 'announcement/active/timeline/' + option, false);
            return;
        } catch (err) {
            console.log(err);
        }
    }
}

export default PP7;