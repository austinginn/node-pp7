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

        // //Possible layer types
        // const LAYERS = ['audio', 'props', 'messages', 'announcements', 'slide', 'media', 'video_input'];

        // //Possible timeline operations
        // const TIMELINE = ['play', 'pause', 'rewind'];

        // //Possible capture operations
        // const capture = ['start', 'stop'];

        // //possible capture types
        // const CAPTURE_TYPES = ['disk', 'rtmp', 'resi'];

        // //Possible trigger operations
        // const TRIGGER = ['next', 'previous'];

        // //Possible audio playlist focus options
        // const AUDIO_PLAYLIST_FOCUS = ['next', 'previous', 'active', 'id'];

        // //Possible audio playlist trigger options
        // const AUDIO_PLAYLIST_TRIGGER = ['focused', 'active'];

        // //Possible media playlist identifier request
        // const MEDIA_PLAYLIST_IDS = ['focused', 'active'];

        // //Possible media playlist focus options
        // const MEDIA_PLAYLIST_FOCUS = ['next', 'previous', 'active', 'id'];

        // //Possible media playlist focus options
        // const MEDIA_PLAYLIST_TRIGGER = ['focused', 'active', 'id'];

        // //Possible media playlist focus options
        // const MEDIA_PLAYLIST_FOCUSED = ['next', 'previous', 'id'];

        // //possilbe playlist active focus/trigger destinations
        // const ACTIVE_PLAYLIST = ['presentation', 'announcement'];

        // //Timer Operations
        // const TIMER_OPERATIONS = ['start', 'stop', 'reset'];

        const VERSION = 'v1'

        this._config = {
            version: VERSION,
            protocol: protocol,
            ip: ip,
            port: port,
            endpoint: protocol + '://' + ip + ":" + port + '/' + VERSION + '/'
        }


        //console.log(this._config); //check
        this._eventEmitter = new EventEmitter();
        
    }
    //psuedo private methods

    _get = async (url, parse = 'JSON', headers = { 'Content-Type': 'application/json' }) => {
        try {
            const response = await fetch(url, {
                headers: headers
            });

            const status = this._checkStatus(await response.status); //always will be a status

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
            this._eventEmitter.emit(arr[i].url, arr[i].data);
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
            let response = await this._get(this._config.endpoint + 'announcement/active');
            return response.data.announcement;
        } catch (err) {
            throw err;
        }
    }

    /**
     * Gets the index of the current slide/cue within the currently active announcement
     * 
     * @returns {Announcement_Index}
     */
    async announcementSlideIndex() {
        try {
            let response = await this._get(this._config.endpoint + 'announcement/slide_index');
            return response.data.announcement_index;
        } catch (err) {
            throw err;
        }
    }

    /**
     * Focuses the currently active announcement presentation
     * @returns {void}
     */
    async announcementFocus() {
        try {
            let response = await this._get(this._config.endpoint + 'announcement/active/focus', false);
            return;
        } catch (err) {
            throw err;
        }
    }

    /**
    * Retriggers the currently active announcement presentation (starts from the beginning).
    * @returns  {void}
    */
    async announcementRetrigger() {
        try {
            let response = await this._get(this._config.endpoint + 'announcement/active/trigger', false);
            return;
        } catch (err) {
            throw err;
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
                response = await this._get(this._config.endpoint + 'announcement/active/' + index + '/trigger', false);
            } else {
                response = await this._get(this._config.endpoint + 'announcement/active/' + option + '/trigger', false);
            }
            return;
        } catch (err) {
            throw err
        }
    }

    /**
     * Get the current state of the active announcement timeline
     * @returns {Announcement_Timeline}
     */
    async announcementTimelineStatus() {
        try {
            let response = await this._get(this._config.endpoint + 'announcement/active/timeline');
            //console.log(response); //check
            return response.data;
        } catch (err) {
            throw err
        }
    }

    /**
     * Performs the requested timeline operation for the active announcement presentation
     * @param {('play'|'pause'|'rewind')} option - play, pause, rewind
     * @returns {void}
     */
    async announcementTimelineTransport(option) {
        //if (TIMELINE.indexOf(option) == -1) { console.log("invalid option"); return -1; }

        try {
            let response = await this._get(this._config.endpoint + 'announcement/active/timeline/' + option, false);
            return;
        } catch (err) {
           throw err;
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
            let response = await this._get(this._config.endpoint + 'capture/encodings/' + option);
            console.log(response); //check
            return response.data;
        } catch (err) {
            throw err;
        }
    }

    /**
     * Performs the requested capture operation
     * @param {('start'|'stop')} option - The capture operation to perform (start, stop)
     * @returns {void}
     */
    async captureTransport(option = 'start') {
        //if (capture.indexOf == -1) { console.log('check options'); return -1; }
        try {
            let response = await this._get(this._config.endpoint + 'capture/' + option, false);
            // console.log(response); //check
            return;
        } catch (err) {
            throw err;
        }
    }

    /**
     * Gets the currrent capture settings
     * @returns {Capture_Settings} - capture settings
     */
    async captureSettings() {
        try {
            let response = await this._get(this._config.endpoint + 'capture/settings');
            // console.log(response); //check
            return response.data;
        } catch (err) {
            throw err;
        }
    }

    /**
     * Gets the current capture status and capture time
     * @returns {Capture_Status} - capture status
     */
    async captureStatus() {
        try {
            let response = await this._get(this._config.endpoint + 'capture/status', false);
            // console.log(response); //check
            return response.data;
        } catch (err) {
            throw err;
        }
    }

    /**
     * Triggers the next or previous cue in the currently active playlist or library
     * @param {('next'|'previous')} option - next or previous
     * @returns {void}
     */
    async trigger(option = 'next') {
        //if (TRIGGER.indexOf(option) == -1) { console.log('check option'); return -1 }
        try {
            let response = await this._get(this._config.endpoint + 'trigger/' + option, false);
            // console.log(response); //check
            return;
        } catch (err) {
            throw err;
        }
    }

    /**
     * Triggers the next or previous item in the currently active audio playlist
     * @param {('next'|'previous')} option - next or previous
     * @returns {void}
     */
    async triggerAudio(option = 'next') {
        //if (TRIGGER.indexOf(option) == -1) { console.log('check option'); return -1 }
        try {
            let response = await this._get(this._config.endpoint + 'trigger/audio/' + option, false);
            // console.log(response); //check
            return;
        } catch (err) {
            throw err;
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
            let response = await this._get(this._config.endpoint + 'trigger/media/' + option, false);
            // console.log(response); //check
            return;
        } catch (err) {
            throw err;
        }
    }

    /**
     * Gets the contents of the video inputs playlist
     * @returns {Array.<Video_Input>}
     */
    async videoInputs() {
        try {
            let response = await this._get(this._config.endpoint + 'video_inputs');
            // console.log(response); //check
            return response.data;
        } catch (err) {
            throw err;
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
            let response = await this._get(this._config.endpoint + 'video_inputs/' + id + '/trigger', false);
            // console.log(response);
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
            let response = await this._get(this._config.endpoint + 'masks');
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
            let response = await this._get(this._config.endpoint + 'mask/' + id);
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
            let response = await this._get(this._config.endpoint + 'mask/' + id + '/thumbnail?quality=' + quality, 'image', { 'Content-Type': 'image/jpeg' });
            // console.log(response);
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
            let response = await this._get(this._config.endpoint + 'audio/playlist/' + id + '?start=0');
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
            let response = await this._get(this._config.endpoint + 'audio/playlist/focused');
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
            let response = await this._get(this._config.endpoint + 'audio/playlist/active');
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
                response = await this._get(this._config.endpoint + 'audio/playlist/' + id + '/focus', false);
            } else {
                response = await this._get(this._config.endpoint + 'audio/playlist/' + option + '/focus', false);
            }
            // console.log(response);
            return;
        } catch (err) {
            throw err
        }
    }

    /**
     * Triggers the focused, active or specified audio playlist
     * @param {('focused'|'active'|'id')} option - focused, active, or id
     * @param {String} [id] - id of audio playlist
     * @returns {void}
     */
    async audioPlaylistTriggerPlaylist(option = 'active', id) {
        try {
            let response;
            if (option == 'id') {
                response = await this._get(this._config.endpoint + 'audio/playlist/' + id + '/trigger', false);
            } else {
                response = await this._get(this._config.endpoint + 'audio/playlist/' + option + '/trigger', false);
            }
            // console.log(response);
            return;
        } catch (err) {
            throw err;
        }
    }

    /**
     * Triggers the next, previous or specified item in the focused audio playlist
     * @param {('next'|'previous'|'id')} option - next, previous or id
     * @param {string} [id] - id of audio playlist
     * @returns {void}
     */
    async audioPlaylistTriggerFocused(option = 'next', id) {
        try {
            let response;
            if (option == 'id') {
                response = await this._get(this._config.endpoint + 'audio/playlist/focused/' + id + '/trigger', false);
            }
            response = await this._get(this._config.endpoint + 'audio/playlist/focused/' + option + '/trigger', false);
            // console.log(response);
            return;
        } catch (err) {
            throw err;
        }
    }

    /**
     * Triggers the next, previous or specified item in the active audio playlist
     * @param {'next'|'previous'|'id'} option -  next, previous or id
     * @param {string} [id]
     * @returns {void}
     */
    async audioPlaylistTriggerActive(option = 'next') {
        try {
            let response = await this._get(this._config.endpoint + 'audio/playlist/active/' + option + '/trigger', false);
            // console.log(response);
            return;
        } catch (err) {
            throw err;
        }
    }

    /**
     * Triggers the next or previous of item of the specified audio playlist
     * @param {string} id - The UUID of the specified audio playlist
     * @param {'next'|'previous'} [option='next'] - next or previous
     * @returns {void}
     */
    async audioPlaylistTriggerById(id, option = 'next') {
        // console.log('here');
        // if (!id) { console.log('check id'); return -1 }
        // if (TRIGGER.indexOf(option) == -1) { console.log('check option'); return -1 }
        try {
            // console.log('here');
            let response = await this._get(this._config.endpoint + 'audio/playlist/' + id + '/' + option + '/trigger', false);
            // console.log(response);
            return;
        } catch (err) {
            throw (err);
        }
    }

    /**
     * Gets a list of all the configured audio playlists
     * @returns {Audio_Playlist} - check return value in testing
     */
    async audioPlaylists() {
        try {
            let response = await this._get(this._config.endpoint + 'audio/playlists');
            // console.log(response);
            return response.data;
        } catch (err) {
            throw err;
        }
    }

    //Global Groups//

    /**
     * Gets a list of all the configured global groups
     * @returns {Array.<Group>}
     */
    async groups() {
        try {
            let response = await this._get(this._config.endpoint + 'groups');
            // console.log(response);
            return response.data;
        } catch (err) {
            throw err;
        }
    }


    //Misc//

    /**
     * Executes the "Find My Mouse" operation on the connected ProPresenter instance
     * @returns void
     */
    async findMouse() {
        try {
            let response = await this._get(this._config.endpoint + 'find_my_mouse', false);
            // console.log(response);
            return;
        } catch (err) {
            throw err;
        }
    }

    //Clear Groups//

    /**
     * Gets a list of all of the configured clear groups
     * @returns {Array.<Clear_Group>}
     */
    async clearGroups() {
        try {
            let response = await this._get(this._config.endpoint + 'clear/groups');
            // console.log(response);
            return response.data;
        } catch (err) {
            throw err;
        }
    }

    /**
     * Creates a clear group with the details specified
     * @param {Clear_Group_Options} options 
     * @returns {Clear_Group}
     */
    async clearGroupsCreate(options) {
        try {
            let response = await _post(this._config.endpoint + 'clear/groups', 'JSON', JSON.stringify(options));
            // console.log(response);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Clears the specified layer
     * @param {'audio'|'props'|'messages'|'announcements'|'slide'|'media'|'video_input'} layer - The name of the layer that is to be cleared: audio, props, messages, announcements, slide, media or video_input
     * @returns {void}
     */
    async clearLayer(layer) {
        // if (LAYERS.indexOf(layer) == -1) {
        //     let err = new Error('invalid layer');
        //     throw err;
        // }

        try {
            let response = await this._get(this._config.endpoint + 'clear/layer/' + layer, false);
            // console.log(response);
            return;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Gets the details of the specified clear group
     * @param {string} id - the UUID of the clear group (will also accept url encoded name or index)
     * @returns {Clear_Group}
     */
    async clearGroup(id) {
        if (!id) {
            let err = new Error('invalid id');
            throw err;
        }

        try {
            let response = await this._get(this._config.endpoint + 'clear/group/' + id);
            // console.log(response);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Sets the details of the specified clear group
     * @param {string} id - the UUID of the clear group (will also accept url encoded name or index)
     * @param {Clear_Group_Options} options 
     * @returns {Clear_Group}
     */
    async clearGroupEdit(id, options) {
        if (!id) {
            let err = new Error('invalid id');
            throw err;
        }

        try {
            let response = await _put(this._config.endpoint + 'clear/group/' + id, 'JSON', JSON.stringify(options));
            // console.log(response);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Deletes the specified clear group
     * @param {string} id - the UUID of the clear group (will also accept url encoded name or index)
     * @returns {void}
     */
    async clearGroupDelete(id) {
        if (!id) {
            let err = new Error('invalid id');
            throw err;
        }

        try {
            let response = await _del(this._config.endpoint + 'clear/group/' + id);
            // console.log(response);
            return 0;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Triggers the specified clear group
     * @param {string} id - the UUID of the clear group (will also accept url encoded name or index)
     * @returns {void}
     */
    async clearGroupTrigger(id) {
        if (!id) {
            let err = new Error('invalid id');
            throw err;
        }

        try {
            let response = await this._get(this._config.endpoint + 'clear/group/' + id + '/trigger', false);
            // console.log(response);
            return 0;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Gets the image data for the icon of the specified clear group
     * @param {string} id - the UUID of the clear group (will also accept url encoded name or index)
     * @returns {Blob}
     */
    async clearGroupIcon(id) {
        if (!id) {
            let err = new Error('invalid id');
            throw err;
        }

        try {
            let response = await this._get(this._config.endpoint + 'clear/group/' + id + '/icon', 'image', { 'Content-Type': 'image/jpeg' });
            // console.log(response);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Sets the custom icon of the specified clear group
     * @param {string} id - the UUID of the clear group (will also accept url encoded name or index)
     * @param {fs.fileStream} fileStream 
     * @returns {void}
     */
    async clearGroupIconEdit(id, fileStream) {
        // if(!id || !formData){ 
        //     let err = new Error('invalid id');
        //     throw err;
        // }

        try {
            let response = await _put(this._config.endpoint + 'clear/group/' + id + '/icon', 'image', fileStream, { 'accept': '*/*', 'Content-Type': 'image/*' })
            // console.log(response);
            return;
        } catch (error) {
            throw error;
        }
    }

    //Library//
    /**
     * Gets all libraries
     * @returns {Array.<Id_Type_1>} - returns an array of library id's
     */
    async libraries() {
        try {
            let response = await this._get(this._config.endpoint + 'libraries');
            // console.log(response);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Gets library items by library id
     * @param {string} id 
     * @returns {Library_Items}
     */
    async library(id) {
        if (typeof id === 'undefined' || id === null) {
            let err = new Error('invalid id');
            throw err;
        }

        try {
            let response = await this._get(this._config.endpoint + 'library/' + id);
            // console.log(response);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Triggers presentation cue or triggers first cue by library id and presentation id
     * @param {string} library_id 
     * @param {string} presentation_id 
     * @param {Number} [index] - cue index (optional)
     * @returns {void}
     */
    async libraryTrigger(library_id, presentation_id, index) {
        if (typeof library_id === 'undefined' || library_id === null) {
            let err = new Error('invalid library_id');
            throw err;
        }

        if (typeof presentation_id === 'undefined' || presentation_id === null) {
            let err = new Error('invalid library_id');
            throw err;
        }

        try {
            let response;
            if (typeof index === 'undefined' || index === null) {
                response = await this._get(this._config.endpoint + 'library/' + library_id + '/' + presentation_id + '/trigger', false);
            } else {
                response = await this._get(this._config.endpoint + 'library/' + library_id + '/' + presentation_id + '/' + index + '/trigger', false);
            }
            // console.log(response);
            return;
        } catch (error) {
            throw error;
        }
    }

    //Looks//

    /**
     * Gets list of all looks except the live look
     * @returns {Array.<Looks>}
     */
    async looks() {
        try {
            let response = await this._get(this._config.endpoint + 'looks');
            // console.log(response);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    /**
     * @param {Looks} options - will fail if you pass id
     * @returns {Looks}
     */
    async looksCreate(options) {
        if (typeof options === 'undefined' || options === null) {
            let err = new Error('invalid options');
            throw err;
        }

        try {
            let response = await _post(this._config.endpoint + 'looks', 'JSON', JSON.stringify(options));
            // console.log(response);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Gets the current live look
     * @returns {Looks}
     */
    async lookCurrent() {
        try {
            let response = await this._get(this._config.endpoint + 'look/current');
            // console.log(response);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Sets live look
     * @param {Looks} options 
     * @returns {void}
     */
    async lookCurrentSet(options) {
        if (typeof options === 'undefined' || options === null) {
            let err = new Error('invalid options');
            throw err;
        }

        try {
            let response = await _put(this._config.endpoint + 'look/current', false, JSON.stringify(options));
            // console.log(response);
            return;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Get look by id
     * @param {string} id 
     * @returns {Looks}
     */
    async look(id) {
        if (typeof id === 'undefined' || id === null) {
            let err = new Error('invalid id');
            throw err;
        }

        try {
            let response = await this._get(this._config.endpoint + 'look/' + id);
            // console.log(response);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Set look by id
     * @param {string} id 
     * @param {Looks} options - will fail if you pass id
     * @returns {Looks}
     */
    async lookSet(id, options) {
        if (typeof id === 'undefined' || id === null) {
            let err = new Error('invalid id');
            throw err;
        }

        if (typeof options === 'undefined' || options === null) {
            let err = new Error('invalid id');
            throw err;
        }

        try {
            let response = await _put(this._config.endpoint + 'look/' + id, 'JSON', JSON.stringify(options));
            // console.log(response);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Delete look by id
     * @param {string} id 
     * @returns {void}
     */
    async lookDelete(id) {
        if (typeof id === 'undefined' || id === null) {
            let err = new Error('invalid id');
            throw err;
        }

        try {
            let response = await _del(this._config.endpoint + 'look/' + id);
            // console.log(response);
            return;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Triggers look by id 
     * @param {string} id 
     * @returns {void}
     */
    async lookTrigger(id) {
        if (typeof id === 'undefined' || id === null) {
            let err = new Error('invalid id');
            throw err;
        }

        try {
            let response = await this._get(this._config.endpoint + 'look/' + id + '/trigger', false);
            // console.log(response);
            return;
        } catch (error) {
            throw error;
        }
    }

    //Macros//
    /**
     * Gets list of all macros
     * 
     * @returns {Array.<Macro>}
     */
    async macros() {
        try {
            let response = await this._get(this._config.endpoint + 'macros');
            // console.log(response);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Gets macro by id
     * @param {string} id 
     * @returns {Macro}
     */
    async macro(id) {
        if (typeof id === 'undefined' || id === null) {
            let err = new Error('invalid id');
            throw err;
        }

        try {
            let response = await this._get(this._config.endpoint + 'macro/' + id);
            // console.log(response);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Sets Macro by Id
     * @param {string} id 
     * @param {Macro} options - passing id will fail
     * @returns {Macro}
     */
    async macroSet(id) {
        if (typeof id === 'undefined' || id === null) {
            let err = new Error('invalid id');
            throw err;
        }

        if (typeof options === 'undefined' || options === null) {
            let err = new Error('invalid id');
            throw err;
        }

        try {
            let response = await _put(this._config.endpoint + 'macro/' + id, 'JSON', JSON.stringify(options));
            // console.log(response);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Deletes macro by id
     * @param {string} id 
     * @returns {void}
     */
    async macroDelete(id) {
        if (typeof id === 'undefined' || id === null) {
            let err = new Error('invalid id');
            throw err;
        }

        try {
            let response = await _del(this._config.endpoint + 'macro/' + id);
            // console.log(response);
            return;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Triggers macro by Id
     * @param {string} id 
     * @returns {void}
     */
    async macroTrigger(id) {
        if (typeof id === 'undefined' || id === null) {
            let err = new Error('invalid id');
            throw err;
        }

        try {
            let response = await this._get(this._config.endpoint + 'macro/' + id + '/trigger', false);
            // console.log(response);
            return;
        } catch (error) {
            throw error;
        }
    }

    //Media//

    /**
     * Gets the media thmbnail by id
     * @param {string} id 
     * @param {int} [quality=400] 
     * @returns {Blob}
     */
    async mediaThumbnail(id, quality = 400) {
        if (typeof id === 'undefined' || id === null) {
            let err = new Error('invalid id');
            throw err;
        }

        try {
            let response = await this._get(this._config.endpoint + 'media/' + id + '/thumbnail?quality=' + quality, 'image', { 'Content-Type': 'image/jpeg' });
            // console.log(response);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Gets list of media playlists
     * @returns {Array.<Media_Playlists>}
     */
    async mediaPlaylists() {
        try {
            let response = await this._get(this._config.endpoint + 'media/playlists');
            // console.log(response);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Gets media playlist by id
     * @param {string} id
     * @returns {Media_Playlist}
     */
    async mediaPlaylist(id) {
        if (typeof id === 'undefined' || id === null) {
            let err = new Error('invalid id');
            throw err;
        }

        try {
            let response = await this._get(this._config.endpoint + 'media/playlist/' + id);
            // console.log(response);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Gets the id of the active or focused playlist
     * @param {('active'|'focused')} option 
     * @returns {Id_Type_1}
     */
    async mediaPlaylistId(option) {
        if (MEDIA_PLAYLIST_IDS.indexOf(option) == -1) {
            let err = new Error('invalid option');
            throw err;
        }

        try {
            let response;

            if (option == 'focused') {
                response = await this._get(this._config.endpoint + 'media/playlist/focused');
            }

            if (option == 'active') {
                response = await this._get(this._config.endpoint + 'media/playlist/active')
            }

            // console.log(response);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    /**
     * 
     * @param {('next'|'previous'|'active'|'id')} option - could not get previous or id option to work in testing (including openapi endpoint...)
     * @param {String} [id] 
     * @returns {void}
     */
    async mediaPlaylistFocus(option, id) {
        if (MEDIA_PLAYLIST_FOCUS.indexOf(option) == -1) {
            let err = new Error('invalid option');
            throw err;
        }

        try {
            let response;

            if (option == 'id') {
                if (typeof id === 'undefined' || id === null) {
                    let err = new Error('invalid id');
                    throw err;
                }
                response = await this._get(this._config.endpoint + 'media/playlist/' + id + '/focus', false);
            } else {
                response = await this._get(this._config.endpoint + 'media/playlist/' + option + '/focus', false);
            }

            //console.log(response);
            return;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Trigger first item in media playlist by focused, active or media playlist id
     * @param {('focused'|'active'|'id')} option 
     * @param {String} [id] 
     * @returns {void}
     */
    async mediaPlaylistTrigger(option, id) {
        if (MEDIA_PLAYLIST_TRIGGER.indexOf(option) == -1) {
            let err = new Error('invalid option');
            throw err;
        }

        try {
            let response;

            if (option == 'id') {
                if (typeof id === 'undefined' || id === null) {
                    let err = new Error('invalid id');
                    throw err;
                }
                response = await this._get(this._config.endpoint + 'media/playlist/' + id + '/trigger', false);
            } else {
                response = await this._get(this._config.endpoint + 'media/playlist/' + option + '/trigger', false);
            }

            // console.log(response);
            return;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Trigger next, previous or specific media item by id in focused media playlist
     * @param {('next'|'previous'|'id')} option 
     * @param {String} [id] 
     * @returns {void}
     */
    async mediaPlaylistFocusedTrigger(option, id) {
        if (MEDIA_PLAYLIST_FOCUSED.indexOf(option) == -1) {
            let err = new Error('invalid option');
            throw err;
        }

        try {
            let response;

            if (option == 'id') {
                if (typeof id === 'undefined' || id === null) {
                    let err = new Error('invalid id');
                    throw err;
                }
                response = await this._get(this._config.endpoint + 'media/playlist/focused/' + id + '/trigger', false);
            } else {
                response = await this._get(this._config.endpoint + 'media/playlist/focused/' + option + '/trigger', false);
            }

            // console.log(response);
            return;
        } catch (error) {
            throw error;
        }
    }

    /**
    * Trigger next, previous or specific media item by id in active media playlist
    * @param {('next'|'previous'|'id')} option 
    * @param {String} [id] 
    * @returns {void}
    */
    async mediaPlaylistActiveTrigger(option, id) {
        if (MEDIA_PLAYLIST_FOCUSED.indexOf(option) == -1) {
            let err = new Error('invalid option');
            throw err;
        }

        try {
            let response;

            if (option == 'id') {
                if (typeof id === 'undefined' || id === null) {
                    let err = new Error('invalid id');
                    throw err;
                }
                response = await this._get(this._config.endpoint + 'media/playlist/active/' + id + '/trigger', false);
            } else {
                response = await this._get(this._config.endpoint + 'media/playlist/active/' + option + '/trigger', false);
            }

            // console.log(response);
            return;
        } catch (error) {
            throw error;
        }
    }

    /**
    * Trigger next, previous or specific media item by id in specific media playlist
    * @param {('next'|'previous'|'id')} option 
    * @param {String} id
    * @param {String} [media_id] 
    * @returns {void}
    */
    async mediaPlaylistIdTrigger(option, id, media_id) {
        if (typeof id === 'undefined' || id === null) {
            let err = new Error('invalid id');
            throw err;
        }
        if (MEDIA_PLAYLIST_FOCUSED.indexOf(option) == -1) {
            let err = new Error('invalid option');
            throw err;
        }

        try {
            let response;

            if (option == 'id') {
                if (typeof media_id === 'undefined' || media_id === null) {
                    let err = new Error('invalid id');
                    throw err;
                }
                response = await this._get(this._config.endpoint + 'media/playlist/' + id + '/' + media_id + '/trigger', false);
            } else {
                response = await this._get(this._config.endpoint + 'media/playlist/' + id + '/' + option + '/trigger', false);
            }

            // console.log(response);
            return;
        } catch (error) {
            throw error;
        }
    }

    //Messages

    /**
     * Gets a list of all configured messages
     * @returns {Array.<Message>}
     */
    async messages() {
        try {
            let response = await this._get(this._config.endpoint + 'messages');
            // console.log(response);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Create a message
     * @param {Message} options 
     * @returns {Message}
     */
    async messagesCreate(options) {
        if (typeof options === 'undefined' || options === null) {
            let err = new Error('invalid options');
            throw err;
        }

        try {
            let response = await _post(this._config.endpoint + 'messages', 'JSON', JSON.stringify(options));
            // console.log(response);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Get message by id
     * @param {string} id 
     * @returns {Message}
     */
    async message(id) {
        if (typeof id === 'undefined' || id === null) {
            let err = new Error('invalid id');
            throw err;
        }
        try {
            let response = await this._get(this._config.endpoint + 'message/' + id);
            //console.log(response);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Sets message by id
     * @param {string} id 
     * @param {Message} options 
     * @returns {void}
     */
    async messageSet(id, options) {
        if (typeof id === 'undefined' || id === null) {
            let err = new Error('invalid id');
            throw err;
        }

        if (typeof options === 'undefined' || options === null) {
            let err = new Error('invalid options');
            throw err;
        }
        try {
            let response = await _put(this._config.endpoint + 'message/' + id, 'JSON', JSON.stringify(options));
            // console.log(response);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Delete message by id
     * @param {string} id 
     * @returns {void} 
     */
    async messageDelete(id) {
        if (typeof id === 'undefined' || id === null) {
            let err = new Error('invalid id');
            throw err;
        }

        try {
            let response = await _del(this._config.endpoint + 'message/' + id);
            // console.log(response);
            return;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Triggers the specified message
     * @param {sring} id 
     * @param {Message} options 
     * @returns {void}
     */
    async messageTrigger(id, options) {
        if (typeof id === 'undefined' || id === null) {
            let err = new Error('invalid id');
            throw err;
        }

        if (typeof options === 'undefined' || options === null) {
            let err = new Error('invalid options');
            throw err;
        }
        try {
            let response = await _post(this._config.endpoint + 'message/' + id + '/trigger', false, JSON.stringify(options));
            // console.log(response);
            return;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Clear message by id
     * @param {string} id 
     * @returns {void}
     */
    async messageClear(id) {
        if (typeof id === 'undefined' || id === null) {
            let err = new Error('invalid id');
            throw err;
        }

        try {
            let response = await this._get(this._config.endpoint + 'message/' + id + '/clear', false);
            // console.log(response);
            return;
        } catch (error) {
            throw error;
        }
    }

    //Playlists

    /**
     * Gets a playlist by id
     * @param {String} id 
     * @returns {Playlist}
     */
    async playlist(id) {
        if (typeof id === 'undefined' || id === null) {
            let err = new Error('invalid id');
            throw err;
        }
        try {
            let response = await this._get(this._config.endpoint + 'playlist/' + id);
            // console.log(response);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    /**
     * 
     * @param {String} id 
     * @param {Array.<Playlist_Item>} options 
     * @returns {void}
     */
    async playlistSet(id, options) {
        if (typeof id === 'undefined' || id === null) {
            let err = new Error('invalid id');
            throw err;
        }

        if (typeof options === 'undefined' || options === null) {
            let err = new Error('invalid options');
            throw err;
        }
        try {
            let response = await _put(this._config.endpoint + 'playlist/' + id, false, JSON.stringify(options));
            // console.log(response);
            return;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Creates a playlist with the specified details underneath the specified playlist or playlist folder.
     * Openapi description of this endpoint does not function as described. 
     * ONLY accepts an Id to a playlist folder not a regular playlist.
     * This is noted in Openapi docs but contradicts the endpoint description.
     * @param {String} id 
     * @param {Playlist_Create} options 
     * @returns {Object}
     */
    async playlistCreate(id, options) {
        if (typeof id === 'undefined' || id === null) {
            let err = new Error('invalid id');
            throw err;
        }
        if (typeof options === 'undefined' || options === null) {
            let err = new Error('invalid options');
            throw err;
        }
        try {
            let response = await _post(this._config.endpoint + 'playlist/' + id, 'JSON', JSON.stringify(options));
            // console.log(response);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    /**
    * Gets active or focused playlist info
    * @param {('active'|'focused')} option 
    * @returns {Object}
    */
    async playlistInfo(option) {
        if (MEDIA_PLAYLIST_IDS.indexOf(option) == -1) {
            let err = new Error('invalid options');
            throw err;
        }
        try {
            let response;
            if (option == 'active') {
                response = await this._get(this._config.endpoint + 'playlist/active');
            }

            if (option == 'focused') {
                response = await this._get(this._config.endpoint + 'playlist/focused');
            }
            // console.log(response);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Focuses the next, previous or specified playlist
     * @param {'next'|'previous'|'id'} option
     * @param {String} [id] - playlist id
     * @returns {void}
     */
    async playlistFocus(option, id) {
        if (typeof option === 'undefined' || option === null) {
            let err = new Error('invalid options');
            throw err;
        }
        try {
            let response;
            if (option == 'id') {
                response = await this._get(this._config.endpoint + 'playlist/' + id + '/focus', false);
            } else {
                response = await this._get(this._config.endpoint + 'playlist/' + option + '/focus', false);
            }
            // console.log(response);
            return;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Focuses the active presentation or announcement item
     * @param {('presentation'|'announcement')} option 
     * @returns {void}
     */
    async playlistActiveFocus(option) {
        if (ACTIVE_PLAYLIST.indexOf(option) == -1) {
            let err = new Error('invalid options');
            throw err;
        }
        try {
            let response = await this._get(this._config.endpoint + 'playlist/active/' + option + '/focus', false);
            console.log(response);
            return;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Trigger the next or specified cue in the active presentation or active.
     * Unable to validate this is working...
     * Returns good satus but does not appear to do what is described in the open api description.
     * @param {('presentation'|'announcement')} option 
     * @param {'String'} [index] 
     * @returns {void}
     */
    async playlistActiveTrigger(option, index) {
        if (ACTIVE_PLAYLIST.indexOf(option) == -1) {
            let err = new Error('invalid options');
            throw err;
        }
        try {
            let response;
            if (typeof index === 'undefined' || index === null) {
                response = await this._get(`${config.endpoint}playlist/active/${option}/trigger`, false);
            } else {
                response = await this._get(this._config.endpoint + 'playlist/active/' + option + '/' + index + '/trigger', false);
            }
            // console.log(response);
            return 0;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Triggers the next, previous item in the focused playlist
     * @param {('next'|'previous'|'id')} option 
     * @returns {void}
     */
    async playlistFocusedTrigger(option) {
        try {
            let response;
            if (option == 'next' || option == 'previous') {
                response = await this._get(this._config.endpoint + 'playlist/focused/' + option + '/trigger', false);
            } else {
                response = await this._get(this._config.endpoint + 'playlist/focused/trigger', false);
            }
            // console.log(response);
            return;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Triggers the next, previous item by playlist id
     * @param {('next'|'previous'|'id')} option 
     * @returns {void}
     */
    async playlistIdTrigger(id, option, index) {
        if (typeof id === 'undefined' || id === null) {
            let err = new Error('invalid id');
            throw err;
        }
        try {
            let response;
            if (option == 'next' || option == 'previous') {
                response = await get(this._config.endpoint + 'playlist/' + id + '/' + option + '/trigger');
            } else if (option == 'index') {
                if (typeof index === 'undefined' || index === null) {
                    let err = new Error('invalid index');
                    throw err;
                }
                response = await this._get(this._config.endpoint + 'playlist/' + id + '/' + index + '/trigger');
            } else {
                response = await this._get(this._config.endpoint + 'playlist/' + id + '/trigger');
            }
            // console.log(response);
            return 0;
        } catch (error) {
            throw error;
        }
    }

    //Presentation//

    async presentationActive() {
        try {
            let response = await this._get(this._config.endpoint + 'presentation/active');
            //console.log(response);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    async presentationActiveTimelineState() {
        try {
            let response = await this._get(this._config.endpoint + 'presentation/active/timeline');
            // console.log(response);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    async presentationActiveTimelineOperation(op = "play") {
        if (TIMELINE.indexOf(op) == -1) {
            let err = new Error('invalid operation');
            throw err;
        }

        try {
            let response = await this._get(this._config.endpoint + 'presentation/active/timeline/' + op, false);
            // console.log(response);
            return 0;
        } catch (error) {
            throw error;
        }
    }

    async presentationActiveTriger(option) {
        try {
            let response;
            if (typeof id === 'undefined' || id === null) {
                response = await this._get(this._config.endpoint + 'active/trigger');
            } else {
                response = await this._get(this._config.endpoint + 'active/' + option + '/trigger')
            }
            // console.log(response);
            return 0;
        } catch (error) {
            throw error;
        }
    }

    async presentationActiveGroupTrigger(groupId) {
        if (typeof id === 'undefined' || id === null) {
            let err = new Error('invalid id');
            throw err;
        }

        if (typeof groupId === 'undefined' || groupId === null) {
            let err = new Error('invalid id');
            throw err;
        }
        try {
            let response = await this._get(this._config.endpoint + 'active/group/' + groupId + '/trigger');
            // console.log(response);
            return 0;
        } catch (error) {
            throw error;
        }
    }

    async presentationFocused() {
        try {
            let response = await this._get(this._config.endpoint + 'presentation/focused');
            // console.log(response);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    async presentationFocusedTimelineState() {
        try {
            let response = await this._get(this._config.endpoint + 'presentation/focused/timeline');
            // console.log(response);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    async presentationFocusedTimelineOperation(op = "play") {
        // if (TIMELINE.indexOf(op) == -1) {
        //     let err = new Error('invalid operation');
        //     throw err;
        // }

        try {
            let response = await this._get(this._config.endpoint + 'presentation/focused/timeline/' + op, false);
            // console.log(response);
            return 0;
        } catch (error) {
            throw error;
        }
    }


    async presentationFocusedTrigger(option) {
        try {
            let response;
            if (typeof id === 'undefined' || id === null) {
                response = await this._get(this._config.endpoint + 'focused/trigger');
            } else {
                response = await this._get(this._config.endpoint + 'focused/' + option + '/trigger')
            }
            //console.log(response);
            return 0;
        } catch (error) {
            throw error;
        }
    }

    async presentationFocusedGroupTrigger(groupId) {
        if (typeof id === 'undefined' || id === null) {
            let err = new Error('invalid id');
            throw err;
        }

        if (typeof groupId === 'undefined' || groupId === null) {
            let err = new Error('invalid id');
            throw err;
        }
        try {
            let response = await this._get(this._config.endpoint + 'focused/group/' + groupId + '/trigger');
            //console.log(response);
            return 0;
        } catch (error) {
            throw error;
        }
    }

    async presentationSlideIndex() {
        try {
            let response = await this._get(this._config.endpoint + 'presentation/silde_index');
            // console.log(response);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    async presentationChordChard(quality = 400) {
        try {
            let response = await this._get(this._config.endpoint + 'presentation/chordChart?quality=' + quality, 'image', { 'Content-Type': 'image/jpeg' });
            // console.log(response);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    async presentationUUID(id) {
        if (typeof id === 'undefined' || id === null) {
            let err = new Error('invalid id');
            throw err;
        }
        try {
            let response = await this._get(this._config.endpoint + 'presentation/' + id);
            // console.log(response);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    async presentationUUIDTimelineOperation(id, op = "play") {
        if (typeof id === 'undefined' || id === null) {
            let err = new Error('invalid id');
            throw err;
        }
        if (TIMELINE.indexOf(op) == -1) {
            let err = new Error('invalid operation');
            throw err;
        }

        try {
            let response = await this._get(this._config.endpoint + 'presentation/focused/timeline/' + op, false);
            // console.log(response);
            return 0;
        } catch (error) {
            throw error;
        }
    }

    async presentationUUIDTrigger(id, option) {
        if (typeof id === 'undefined' || id === null) {
            let err = new Error('invalid id');
            throw err;
        }
        try {
            let response;
            if (typeof id === 'undefined' || id === null) {
                response = await this._get(this._config.endpoint + id + '/trigger');
            } else {
                response = await this._get(this._config.endpoint + id + '/' + option + '/trigger')
            }
            // console.log(response);
            return 0;
        } catch (error) {
            throw error;
        }
    }

    async presentationUUIDGroupTrigger(id, groupId) {
        if (typeof id === 'undefined' || id === null) {
            let err = new Error('invalid id');
            throw err;
        }

        if (typeof groupId === 'undefined' || groupId === null) {
            let err = new Error('invalid id');
            throw err;
        }
        try {
            let response = await this._get(this._config.endpoint + id + '/group/' + groupId + '/trigger');
            // console.log(response);
            return 0;
        } catch (error) {
            throw error;
        }
    }

    async presentationUUIDThumbnail(id, index, quality = 400) {
        if (typeof id === 'undefined' || id === null) {
            let err = new Error('invalid id');
            throw err;
        }

        if (typeof index === 'undefined' || index === null) {
            let err = new Error('invalid index');
            throw err;
        }

        try {
            let response = await this._get(this._config.endpoint + 'presentation/' + id + '/thumbnail/' + index + '?quality=' + quality, 'image', { 'Content-Type': 'image/jpeg' });
            // console.log(response);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    async presentationFocus(option) {
        if (typeof id === 'undefined' || id === null) {
            let err = new Error('invalid id');
            throw err;
        }

        try {
            let response = await this._get(this._config.endpoint + option + '/focus');
            // console.log(response);
            return 0;
        } catch (error) {
            throw error;
        }
    }

    //Props//

    /**
     * Get list of all props
     * @returns {Array.<Prop>}
     */
    async props() {
        try {
            let response = await this._get(this._config.endpoint + '/props');
            // console.log(response);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Get prop by id
     * @param {string} id 
     * @returns {Prop}
     */
    async prop(id) {
        if (typeof id === 'undefined' || id === null) {
            let err = new Error('invalid id');
            throw err;
        }

        try {
            let response = await this._get(this._config.endpoint + 'prop/' + id);
            // console.log(response);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Delete prop by id
     * @param {string} id 
     * @returns {void}
     */
    async propDelete(id) {
        if (typeof id === 'undefined' || id === null) {
            let err = new Error('invalid id');
            throw err;
        }

        try {
            let response = await _del(this._config.endpoint + 'prop/' + id);
            // console.log(response);
            return;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Trigger prop by id
     * @param {string} id 
     * @returns {void}
     */
    async propTrigger(id) {
        if (typeof id === 'undefined' || id === null) {
            let err = new Error('invalid id');
            throw err;
        }

        try {
            let response = await this._get(this._config.endpoint + 'prop/' + id + '/trigger');
            // console.log(response);
            return 0;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Clear prop by Id
     * @param {string} id 
     * @returns {void}
     */
    async propClear(id) {
        if (typeof id === 'undefined' || id === null) {
            let err = new Error('invalid id');
            throw err;
        }

        try {
            let response = await this._get(this._config.endpoint + 'prop/' + id + '/clear');
            // console.log(response);
            return 0;
        } catch (error) {
            throw error;
        }
    }

    /**
     * 
     * @param {string} id 
     * @param {int} [quality=400] 
     * @returns {Blob}
     */
    async propThumbnail(id, quality = 400) {
        if (typeof id === 'undefined' || id === null) {
            let err = new Error('invalid id');
            throw err;
        }
        try {
            let response = await this._get(this._config.endpoint + 'prop/' + id + '/thumbnail?quality=' + quality, 'image', { 'Content-Type': 'image/jpeg' });
            // console.log(response);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    //Stage

    async stageMessage() {
        try {
            let response = await this._get(this._config.endpoint + 'stage/message');
            // console.log(response);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    async stageMessageShow(message) {
        if (typeof message === 'undefined' || message === null) {
            let err = new Error('invalid message');
            throw err;
        }

        try {
            let response = await _put(this._config.endpoint + 'stage/message', false, message);
            // console.log(response);
            return 0;
        } catch (error) {
            throw error;
        }
    }

    async stageMessageDelete() {
        try {
            let response = await _del(this._config.endpoint + 'stage/message');
            // console.log(response);
            return 0;
        } catch (error) {
            throw error;
        }
    }

    async stageLayoutMap() {
        try {
            let response = await this._get(this._config.endpoint + 'stage/layout_map');
            // console.log(response);
            return 0;
        } catch (error) {
            throw error;
        }
    }

    async stageLayoutMapSet(body) {
        if (typeof body === 'undefined' || body === null) {
            let err = new Error('invalid body');
            throw err;
        }

        try {
            let response = await _put(this._config.endpoint + 'stage/layout_map', false, body);
            // console.log(response);
            return 0;
        } catch (error) {
            throw error;
        }
    }

    async stageScreens() {
        try {
            let response = await this._get(this._config.endpoint + 'stage/screens');
            // console.log(response);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    async stageScreenLayout(id) {
        if (typeof id === 'undefined' || id === null) {
            let err = new Error('invalid id');
            throw err;
        }

        try {
            let response = await this._get(this._config.endpoint + 'stage/screen/' + id + '/layout');
            // console.log(response);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    async stageScreenLayoutSet(id, layout_id) {
        if (typeof id === 'undefined' || id === null) {
            let err = new Error('invalid id');
            throw err;
        }

        if (typeof layout_id === 'undefined' || layout_id === null) {
            let err = new Error('invalid layout_id');
            throw err;
        }

        try {
            let response = await this._get(this._config.endpoint + 'stage/screen/' + id + '/layout/' + layout_id);
            // console.log(response);
            return 0;
        } catch (error) {
            throw error;
        }
    }

    async stageLayouts() {
        try {
            let response = await this._get(this._config.endpoint + 'stage/layouts');
            // console.log(response);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    async stageLayoutDelete(id) {
        if (typeof id === 'undefined' || id === null) {
            let err = new Error('invalid id');
            throw err;
        }

        try {
            let response = await _del(this._config.endpoint + 'stage/layout/' + id);
            // console.log(response);
            return 0;
        } catch (error) {
            throw error;
        }
    }

    async stageLayoutThumbnail(id, quality = 400) {
        if (typeof id === 'undefined' || id === null) {
            let err = new Error('invalid id');
            throw err;
        }
        try {
            let response = await this._get(this._config.endpoint + 'stage/layout/' + id + '/thumbnail?quality=' + quality, 'image', { 'Content-Type': 'image/jpeg' });
            // console.log(response);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    //Themes//
    async themes() {
        try {
            let response = await this._get(this._config.endpoint + 'themes');
            // console.log(response);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    async theme(id) {
        if (typeof id === 'undefined' || id === null) {
            let err = new Error('invalid id');
            throw err;
        }
        try {
            let response = await this._get(this._config.endpoint + 'theme/' + id);
            // console.log(response);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    async themeSlides(id, theme_slide) {
        if (typeof id === 'undefined' || id === null) {
            let err = new Error('invalid id');
            throw err;
        }
        if (typeof theme_slide === 'undefined' || theme_slide === null) {
            let err = new Error('invalid theme_slide');
            throw err;
        }
        try {
            let response = await this._get(this._config.endpoint + 'theme/' + id + '/slides/' + theme_slide);
            // console.log(response);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    async themeSlidesSet(id, theme_slide, body) {
        if (typeof id === 'undefined' || id === null) {
            let err = new Error('invalid id');
            throw err;
        }
        if (typeof theme_slide === 'undefined' || theme_slide === null) {
            let err = new Error('invalid theme_slide');
            throw err;
        }
        if (typeof body === 'undefined' || body === null) {
            let err = new Error('body');
            throw err;
        }
        try {
            let response = await _put(this._config.endpoint + 'theme/' + id + '/slides/' + theme_slide, false, body);
            // console.log(response);
            return 0;
        } catch (error) {
            throw error;
        }
    }

    async themeSlidesThumbnail(id, theme_slide, quality = 400) {
        if (typeof id === 'undefined' || id === null) {
            let err = new Error('invalid id');
            throw err;
        }
        try {
            let response = await this._get(this._config.endpoint + 'theme/' + id + '/slides/' + theme_slide + '/thumbnail?quality=' + quality, 'image', { 'Content-Type': 'image/jpeg' });
            // console.log(response);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    //Timers//
    async timers() {
        try {
            let response = await this._get(this._config.endpoint + 'timers');
            // console.log(response);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    async timersCreate() {
        try {
            let response = await _post(this._config.endpoint + 'timers', 'JSON', body);
            // console.log(response);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    async timersCurrent() {
        try {
            let response = await this._get(this._config.endpoint + 'timers/current');
            // console.log(response);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    async timersOperation(op = "start") {
        if (TIMER_OPERATIONS.indexOf(op) == -1) {
            let err = new Error('invalid timer operation');
            throw err;
        }
        try {
            let response = await this._get(this._config.endpoint + 'timers/' + op, false);
            // console.log(response);
            return 0;
        } catch (error) {
            throw error;
        }
    }

    async timer(id) {
        if (typeof id === 'undefined' || id === null) {
            let err = new Error('invalid id');
            throw err;
        }
        try {
            let response = await this._get(this._config.endpoint + 'timer' + id);
            // console.log(response);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    async timerSet(id, body) {
        if (typeof id === 'undefined' || id === null) {
            let err = new Error('invalid id');
            throw err;
        }

        if (typeof body === 'undefined' || body === null) {
            let err = new Error('invalid body');
            throw err;
        }
        try {
            let response = await _put(this._config.endpoint + 'timer/' + id, 'JSON', body);
            // console.log(response);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    async timerDelete(id) {
        if (typeof id === 'undefined' || id === null) {
            let err = new Error('invalid id');
            throw err;
        }
        try {
            let response = await _del(this._config.endpoint + 'timer/' + id);
            // console.log(response);
            return 0;
        } catch (error) {
            throw error;
        }
    }

    async timerOperation(id, op = "start") {
        if (typeof id === 'undefined' || id === null) {
            let err = new Error('invalid id');
            throw err;
        }
        if (TIMER_OPERATIONS.indexOf(op) == -1) {
            let err = new Error('invalid timer operation');
            throw err;
        }
        try {
            let response = await this._get(this._config.endpoint + 'timer/' + id + '/' + op, false);
            // console.log(response);
            return 0;
        } catch (error) {
            throw error;
        }
    }

    async timerSystemTime() {
        try {
            let response = await this._get(this._config.endpoint + 'system_time');
            // console.log(response);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    async timerVideoCountdown() {
        try {
            let response = await this._get(this._config.endpoint + 'video_countdown');
            // console.log(response);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    //Event Listener//
    /**
     * Listen for event and execute callback function
     * @param {String} event - See ProPresenter7 openapi doc for the possible events
     * @param {Function} callback - Callback function when event is fired
     */
    on(event, callback) {
        this._eventEmitter.on(event, (data) => {
            callback(data);
        });
    }

    /**
     * Starts streaming the status of events passed as an array of strings.
     * See ProPresenter7 openapi doc for the possible events.
     * Use the .on() method to listen for events
     * @param {Array.<string>} events 
     */
    async status(events) {
        try {
            const response = await fetch(this._config.endpoint + "status/updates", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(events)
            });

            const status = this._checkStatus(await response.status); //always will be a status

            const stream = response.body;
            const textStream = stream.pipeThrough(new TextDecoderStream());
            for await (const chunk of textStream) {

                // console.log(chunk);
                // console.log("next");
                //pass chunk to for event handling
                this._updateHandler(chunk);
            }
        } catch (error) {
            throw error;
        }
    }
}

export default PP7;