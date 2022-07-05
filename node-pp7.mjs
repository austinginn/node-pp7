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
 * @property {Object} id
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
 * @property {Object} id
 * @property {String} icon
 * @property {Object} tint
 * @property {Array.<String>} layers
 * @property {Boolean} stop_timeline_announcements
 * @property {Boolean} stop_timeline_presentation
 * @property {Boolean} clear_next_presentation
 */

/**
 * @typedef {Object} Library_Id
 * @property {String} id
 * @property {String} name
 * @property {Number} index
 */

/**
 * @typedef {Object} Library
 * @property {Library_Id} id
 */

/**
 * @typedef {Object} Library_Item
 * @property {int} index
 * @property {string} name
 * @property {string} uuid
 */

/**
 * @typedef {Object} Library_Items
 * @property {string} updateType
 * @property {Array.<Library_Item>} items
 */

/**
 * @typedef {Object} Id_Type_1
 * @property {String} uuid
 * @property {String} name
 * @property {int} index
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
 * @property {Array.<Screen>} screens
 */

/**
 * @typedef {Object} Looks
 * @property {Id_Type_1} id
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
 * @property {Id_Type_1} id
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
 * @typedef {Object} Message
 * @property {Id_Type_1} id
 * @property {string} message
 * @property {Object} tokens - see propresenter openapi for format
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


const PP7 = function () {
    //private vars

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

    let config = {
        version: 'v1'
    }



    let pp7_data = {

    }

    ///////////////
    //CONSTRUCTOR//
    ///////////////

    /**
     * Constructor for ProPresenter Object
     * @param {string} protocol - either http or https
     * @param {string} ip - ip address of ProPresenter instance
     * @param {int} port - port # configured in ProPresenter
     */
    const constructor = function pp7(protocol = 'http', ip = '127.0.0.1', port = 1025) {
        config.protocol = protocol;
        config.ip = ip;
        config.port = port;

        config.endpoint = protocol + '://' + ip + ":" + port + '/' + config.version + '/';


        console.log(config); //check
        const eventEmitter = new EventEmitter();

        ///////////////////
        //PRIVATE METHODS//
        ///////////////////
        //Fetch GET request wrapper and error handling
        const get = async (url, parse = 'JSON', headers = { 'Content-Type': 'application/json' }) => {
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
        const post = async (url, parse = 'JSON', body = {}, headers = {
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
        const put = async (url, parse = 'JSON', body = {}, headers = {
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
        const del = async (url) => {
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
        const checkStatus = status => {
            if (status >= 200 && status < 300) {
                return status;
            } else {
                let err = new Error(status.statusText);
                err.response = status;
                throw err
            }
        }

        //Parses streamed chunks and emits correct events
        const updateHandler = async (chunk) => {
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
        const isInt = (value) => {
            return !isNaN(value) &&
                parseInt(Number(value)) == value &&
                !isNaN(parseInt(value, 10));
        }

        //----------------
        //////////////////
        //PUBLIC METHODS//
        //////////////////
        //----------------

        //
        //
        /**
         * announcement methods
         */
        this.announcement = {
            /**
             * Gets the currently active annoucement presentation
             * @returns {Annoucement} 
             */
            get: async () => {
                try {
                    let response = await get(config.endpoint + 'announcement/active');
                    return response.data.announcement;
                } catch (err) {
                    console.log(err);
                }
            },

            /**
             * Gets the index of the current slide/cue within the currently active announcement
             * 
             * @returns {Announcement_Index}
             */
            index: async () => {
                try {
                    let response = await get(config.endpoint + 'announcement/slide_index');
                    return response.data.announcement_index;
                } catch (err) {
                    console.log(err);
                }
            },

            /**
             * Focuses the currently active announcement presentation
             * @returns {void}
             */
            focus: async () => {
                try {
                    let response = await get(config.endpoint + 'announcement/active/focus', false);
                    return;
                } catch (err) {
                    throw (err);
                }
            },

            /**
             * Retriggers the currently active announcement presentation (starts from the beginning).
             * @returns  {void}
             */
            retrigger: async () => {
                try {
                    let response = await get(config.endpoint + 'announcement/active/trigger', false);
                    return;
                } catch (err) {
                    console.log(err);
                }
            },

            /**
             * Triggers cue in the active announcement presentation based on option
             * @param {('next'|'previous'|'index')} option - next, previous, or index
             * @param {int} [index] 
             * @returns {void}
             */
            trigger: async (option = 'next', index) => {
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
            },

            /**
             * Announcement timeline methods
             */
            timeline: {
                /**
                 * Get the current state of the active announcement timeline
                 * @returns {Announcement_Timeline}
                 */
                status: async () => {
                    try {
                        let response = await get(config.endpoint + 'announcement/active/timeline');
                        //console.log(response); //check
                        return response.data;
                    } catch (err) {
                        console.log(err);
                    }
                },

                /**
                 * Performs the requested timeline operation for the active announcement presentation
                 * @param {('play'|'pause'|'rewind')} option - play, pause, rewind
                 * @returns {void}
                 */
                transport: async (option = 'play') => {
                    if (TIMELINE.indexOf(option) == -1) { console.log("invalid option"); return -1; }

                    try {
                        let response = await get(config.endpoint + 'announcement/active/timeline/' + option, false);
                        return;
                    } catch (err) {
                        console.log(err);
                    }
                }
            }
        }

        //Capture//
        /**
         * ProPresenter Capture Methods
         */
        this.capture = {
            /**
             * Gets a list of all available capture modes for the capture type
             * @param {('disk'|'rtmp'|'resi')} option - capture types (disk, rtmp, resi)
             * @returns {Array}
             */
            encodings: async (option = 'disk') => {
                if (CAPTURE_TYPES.indexOf(option) == -1) { console.log('check options'); return -1 }
                try {
                    let response = await get(config.endpoint + 'capture/encodings/' + type);
                    console.log(response); //check
                    return response.data;
                } catch (err) {
                    console.log(err);
                }
            },

            /**
             * Performs the requested capture operation
             * @param {('start'|'stop')} option - The capture operation to perform (start, stop)
             * @returns {void}
             */
            operation: async (option = 'start') => {
                if (capture.indexOf == -1) { console.log('check options'); return -1; }
                try {
                    let response = await get(config.endpoint + 'capture/' + option, false);
                    console.log(response); //check
                    return;
                } catch (err) {
                    console.log(err);
                }
            },

            /**
             * Gets the currrent capture settings
             * @returns {Capture_Settings} - capture settings
             */
            settings: async () => {
                try {
                    let response = await get(config.endpoint + 'capture/settings');
                    console.log(response); //check
                    return response.data;
                } catch (err) {
                    console.log(err);
                }
            },

            /**
             * Gets the current capture status and capture time
             * @returns {Capture_Status} - capture status
             */
            status: async () => {
                try {
                    let response = await get(config.endpoint + 'capture/status', false);
                    console.log(response); //check
                    return response.data;
                } catch (err) {
                    console.log(err);
                }
            }
        }

        //Trigger//
        /**
         * Triggers the next or previous cue in the currently active playlist or library
         * @param {('next'|'previous')} option - next or previous
         * @returns {void}
         */
        this.trigger = async (option = 'next') => {
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
        this.triggerAudio = async (option = 'next') => {
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
        this.triggerMedia = async (option = 'next') => {
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
         * Video input methods
         */
        //Video Input//
        this.videoInputs = {
            /**
             * Gets the contents of the video inputs playlist
             * @returns {Array.<Video_Input>}
             */
            get: async () => {
                try {
                    let response = await get(config.endpoint + 'video_inputs');
                    console.log(response); //check
                    return response.data;
                } catch (err) {
                    console.log(err);
                }
            },

            /**
             * Triggers specified video input from the video inputs playlist
             * @param {string} id - the UUID of the video input (will take url encoded name or index as well)
             * @returns {void}
             */
            trigger: async (id) => {
                if (!id) { console.log('check id'); return -1; }
                try {
                    let response = await get(config.endpoint + 'video_inputs/' + id + '/trigger', false);
                    console.log(response);
                    return;
                } catch (err) {
                    console.log(err);
                }
            }
        }

        //Masks//
        /**
         * Gets a list of all configured masks
         * @returns {Array.<Mask>} 
         */
        this.masks = async () => {
            try {
                let response = await get(config.endpoint + 'masks');
                console.log(response);
                return response.data;
            } catch (err) {
                console.log(err);
            }
        }

        /**
         * Gets the details of the specified mask
         * @param {string} id - The UUID of the mask (will take url encoded name or index as well) 
         * @returns {Mask}
         */
        this.mask = async (id) => {
            if (!id) { console.log('check id'); return -1; }
            try {
                let response = await get(config.endpoint + 'mask/' + id);
                console.log(response);
                return response.data;
            } catch (err) {
                console.log(err);
            }
        }

        /**
         * Gets a thumbnail image of the specified mask at the given quality value
         * @param {string} id - The UUID of the mask (will take url encoded name or index as well)
         * @param {int} [quality=400] - The desired quality of the thumbnail. The value is the number of pixels in the largest dimension of the image. Defaults to 400
         * @returns {Blob}
         */
        this.maskThumbnail = async (id, quality = 400) => {
            if (!id) { console.log('check id'); return -1; }
            if (!isInt(quality)) { console.log('check quality var'); return -1; }
            try {
                let response = await get(config.endpoint + 'mask/' + id + '/thumbnail?quality=' + quality, 'image', { 'Content-Type': 'image/jpeg' });
                console.log(response);
                return response.data;
            } catch (err) {
                console.log(err);
            }
        }

        //Audio//
        /**
         * Audio playlist methods
         */
        this.audioPlaylist = {
            /**
             * Gets a list of all the audio items in the specified audio playlist NEED TO CHECK RETURN DATA
             * @param {string} id - The UUID of the audo playlist id (will take url encoded name or index as well)
             * @returns {Array.<Audio_Item>}
             */
            get: async (id) => {
                if (!id) { console.log('check id'); return -1; }
                try {
                    let response = await get(config.endpoint + 'audio/playlist/' + id + '?start=0');
                    // console.log(response);
                    return response.data.items;
                } catch (err) {
                    console.log(err);
                }
            },

            /**
             * Gets the currently focused audio playlist
             * @returns {Audio_Playlist}
             */
            focused: async () => {
                try {
                    let response = await get(config.endpoint + 'audio/playlist/focused');
                    // console.log(response);
                    return response.data;
                } catch (err) {
                    console.log(err);
                }
            },

            /**
             * Gets the currently active audio playlist
             * @returns {Audio_Active}
             */
            active: async () => {
                try {
                    let response = await get(config.endpoint + 'audio/playlist/active');
                    // console.log(response);
                    return response.data;
                } catch (err) {
                    console.log(err);
                }
            },

            /**
             * Focuses either the active, next, previous or specified audio playlist
             * @param {('active'|'next'|'previous'|'id')} option - active, next, previous or id
             * @param {String} [id] - id of audio playlist
             * @returns {void}
             */
            focus: async (option = 'active', id) => {
                try {
                    let response
                    if (option == 'id') {
                        response = await get(config.endpoint + 'audio/playlist/' + id + '/focus', false);
                    } else {
                        response = await get(config.endpoint + 'audio/playlist/' + option + '/focus', false);
                    }
                    console.log(response);
                    return;
                } catch (err) {
                    throw err
                }
            },

            /**
             * Audio Playlist trigger methods
             */
            trigger: {
                /**
                 * Triggers the focused, active or specified audio playlist
                 * @param {('focused'|'active'|'id')} option - focused, active, or id
                 * @param {String} [id] - id of audio playlist
                 * @returns {void}
                 */
                playlist: async (option = 'active', id) => {
                    try {
                        let response;
                        if (option == 'id') {
                            response = await get(config.endpoint + 'audio/playlist/' + id + '/trigger', false);
                        } else {
                            response = await get(config.endpoint + 'audio/playlist/' + option + '/trigger', false);
                        }
                        console.log(response);
                        return 0;
                    } catch (err) {
                        console.log(err);
                    }
                },

                /**
                 * Triggers the next, previous or specified item in the focused audio playlist
                 * @param {{'next'|'previous'|'id'}} option - next, previous or id
                 * @param {string} [id] - id of audio playlist
                 * @returns {void}
                 */
                focused: async (option = 'next', id) => {
                    try {
                        let response;
                        if (option == 'id') {
                            response = await get(config.endpoint + 'audio/playlist/focused/' + id + '/trigger', false);
                        }
                        response = await get(config.endpoint + 'audio/playlist/focused/' + option + '/trigger', false);
                        console.log(response);
                        return;
                    } catch (err) {
                        console.log(err);
                    }
                },

                /**
                 * Triggers the next, previous or specified item in the active audio playlist
                 * @param {'next'|'previous'|'id'} option -  next, previous or id
                 * @param {string} [id]
                 * @returns {void}
                 */
                active: async (option = 'next') => {
                    try {
                        let response = await get(config.endpoint + 'audio/playlist/active/' + option + '/trigger', false);
                        console.log(response);
                        return 0;
                    } catch (err) {
                        console.log(err);
                    }
                },

                /**
                 * Triggers the next or previous of item of the specified audio playlist
                 * @param {string} id - The UUID of the specified audio playlist
                 * @param {'next'|'previous'} [option='next'] - next or previous
                 * @returns {int}
                 */
                byId: async (id, option = 'next') => {
                    if (!id) { console.log('check id'); return -1 }
                    if (TRIGGER.indexOf(option) == -1) { console.log('check option'); return -1 }
                    try {
                        let response = await get(config.endpoint + 'audio/playlist/' + id + '/' + option + '/trigger', false);
                        console.log(response);
                        return 0;
                    } catch (err) {
                        throw (err);
                    }
                }
            }
        }

        /**
         * Gets a list of all the configured audio playlists
         * @returns {Audio_Playlist} - check return value in testing
         */
        this.audioPlaylists = async () => {
            try {
                let response = await get(config.endpoint + 'audio/playlists');
                // console.log(response);
                return response.data;
            } catch (err) {
                console.log(err);
            }
        }

        //Global Groups//
        /**
         * Gets a list of all the configured global groups
         * @returns {Array.<Group>}
         */
        this.groups = async () => {
            try {
                let response = await get(config.endpoint + 'groups');
                console.log(response);
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
        this.findMouse = async () => {
            try {
                let response = await get(config.endpoint + 'find_my_mouse', false);
                console.log(response);
                return;
            } catch (err) {
                throw err;
            }
        }

        //Clear//
        /**
         * Clear methods
         */
        this.clear = {
            /**
             * Groups
             */
            groups: {
                /**
                 * Gets a list of all of the configured clear groups
                 * @returns 
                 */
                get: async () => {
                    try {
                        let response = await get(config.endpoint + 'clear/groups');
                        console.log(response);
                        return response.data;
                    } catch (err) {
                        throw err;
                    }
                },

                /**
                 * Creates a clear group with the details specified
                 * @param {object} body 
                 * @returns 
                 */
                create: async (body = {}) => {
                    try {
                        let response = await post(config.endpoint + 'clear/groups', 'JSON', body);
                        console.log(response);
                        return response.data;
                    } catch (error) {
                        throw error;
                    }
                }
            },

            /**
             * Clears the specified layer
             * @param {'audio'|'props'|'messages'|'announcements'|'slide'|'media'|'video_input'} layer - The name of the layer that is to be cleared: audio, props, messages, announcements, slide, media or video_input
             * @returns {void}
             */
            layer: async (layer) => {
                if (LAYERS.indexOf(layer) == -1) {
                    let err = new Error('invalid layer');
                    throw err;
                }

                try {
                    let response = await get(config.endpoint + 'clear/layer/' + option, false);
                    console.log(response);
                    return;
                } catch (error) {
                    throw error;
                }
            },

            /**
             * Clear Group methods
             */
            group: {
                /**
                 * Gets the details of the specified clear group
                 * @param {string} id - the UUID of the clear group (will also accept url encoded name or index)
                 * @returns {Clear_Group}
                 */
                get: async (id) => {
                    if (!id) {
                        let err = new Error('invalid id');
                        throw err;
                    }

                    try {
                        let response = await get(config.endpoint + 'clear/group/' + id);
                        console.log(response);
                        return response.data;
                    } catch (error) {
                        throw error;
                    }
                },

                /**
                 * Sets the details of the specified clear group
                 * @param {string} id - the UUID of the clear group (will also accept url encoded name or index)
                 * @param {Object} options 
                 * @returns {Clear_Group}
                 */
                set: async (id, options = {}) => {
                    if (!id) {
                        let err = new Error('invalid id');
                        throw err;
                    }

                    try {
                        let response = await put(config.endpoint + 'clear/group/' + id, options);
                        console.log(response);
                        return response.data;
                    } catch (error) {
                        throw error;
                    }
                },

                /**
                 * Deletes the specified clear group
                 * @param {string} id - the UUID of the clear group (will also accept url encoded name or index)
                 * @returns {void}
                 */
                delete: async (id) => {
                    if (!id) {
                        let err = new Error('invalid id');
                        throw err;
                    }

                    try {
                        let response = await del(config.endpoint + 'clear/group/' + id);
                        console.log(response);
                        return 0;
                    } catch (error) {
                        throw error;
                    }
                },

                /**
                 * Triggers the specified clear group
                 * @param {string} id - the UUID of the clear group (will also accept url encoded name or index)
                 * @returns {void}
                 */
                trigger: async (id) => {
                    if (!id) {
                        let err = new Error('invalid id');
                        throw err;
                    }

                    try {
                        let response = await get(config.endpoint + 'clear/group/' + id + '/trigger', false);
                        console.log(response);
                        return 0;
                    } catch (error) {
                        throw error;
                    }
                },

                /**
                 * Clear group icon methods
                 */
                icon: {
                    /**
                     * Gets the image data for the icon of the specified clear group
                     * @param {string} id - the UUID of the clear group (will also accept url encoded name or index)
                     * @returns {Blob}
                     */
                    get: async (id) => {
                        if (!id) {
                            let err = new Error('invalid id');
                            throw err;
                        }

                        try {
                            let response = await get(config.endpoint + 'clear/group/' + id + '/icon', 'image', { 'Content-Type': 'image/jpeg' });
                            console.log(response);
                            return response.data;
                        } catch (error) {
                            throw error;
                        }
                    },

                    /**
                     * Sets the custom icon of the specified clear group
                     * @param {string} id - the UUID of the clear group (will also accept url encoded name or index)
                     * @param {*} formData 
                     * @returns 
                     */
                    set: async (id, formData) => {
                        // if(!id || !formData){ 
                        //     let err = new Error('invalid id');
                        //     throw err;
                        // }

                        try {
                            let response = await put(config.endpoint + 'clear/group/' + id + '/icon', 'image', formData, { 'accept': '*/*', 'Content-Type': 'image/*' })
                            console.log(response);
                            return 0;
                        } catch (error) {
                            throw error;
                        }
                    }
                }
            }
        }

        //Library
        /**
         * Gets all libraries
         * @returns {Array.<Library>} - returns an array of libraries
         */
        this.libraries = async () => {
            try {
                let response = await get(config.endpoint + 'libraries');
                console.log(response);
                return response.data;
            } catch (error) {
                throw error;
            }
        }

        this.library = {
            /**
             * Gets library items by library id
             * @param {string} id 
             * @returns {Library_Items}
             */
            get: async (id) => {
                if (typeof id === 'undefined' || id === null) {
                    let err = new Error('invalid id');
                    throw err;
                }

                try {
                    let response = await get(config.endpoint + 'library/' + id);
                    console.log(response);
                    return response.data;
                } catch (error) {
                    throw error;
                }
            },

            /**
             * Triggers presentation cue or triggers first cue by library id and presentation id
             * @param {string} library_id 
             * @param {string} presentation_id 
             * @param {int} [index] - cue index (optional)
             * @returns {void}
             */
            trigger: async (library_id, presentation_id, index) => {
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
                        response = await get(config.endpoint + 'library/' + library_id + '/' + presentation_id + '/trigger', false);
                    } else {
                        response = await get(config.endpoint + 'library/' + library_id + '/' + presentation_id + '/' + index + '/trigger', false);
                    }
                    console.log(response);
                    return;
                } catch (error) {
                    throw error;
                }
            }
        }

        //Looks
        this.looks = {
            /**
             * Gets list of all looks except the live look
             * @returns {Array.<Looks>}
             */
            get: async () => {
                try {
                    let response = await get(config.endpoint + 'looks');
                    console.log(response);
                    return response.data;
                } catch (error) {
                    throw error;
                }
            },

            /**
             * 
             * @param {Array.<Screen>} options 
             * @returns {Looks}
             */
            create: async (options) => {
                if (typeof options === 'undefined' || options === null) {
                    let err = new Error('invalid options');
                    throw err;
                }

                try {
                    let response = await post(config.endpoint + 'looks', 'JSON', options);
                    console.log(response);
                    return response.data;
                } catch (error) {
                    throw error;
                }
            }
        }

        this.look = {
            current: {
                /**
                 * Gets the current live look
                 * @returns {Looks}
                 */
                get: async () => {
                    try {
                        let response = await get(config.endpoint + 'look/current');
                        console.log(response);
                        return response.data;
                    } catch (error) {
                        throw error;
                    }
                },

                /**
                 * Sets live look
                 * @param {Looks} options 
                 * @returns {Looks}
                 */
                set: async (options) => {
                    if (typeof options === 'undefined' || options === null) {
                        let err = new Error('invalid options');
                        throw err;
                    }

                    try {
                        let response = await put(config.endpoint + 'look/current', false, options);
                        console.log(response);
                        return response.data;
                    } catch (error) {
                        throw error;
                    }
                }
            },

            /**
             * Get look by id
             * @param {string} id 
             * @returns {Looks}
             */
            get: async (id) => {
                if (typeof id === 'undefined' || id === null) {
                    let err = new Error('invalid id');
                    throw err;
                }

                try {
                    let response = await get(config.endpoint + 'look/' + id);
                    console.log(response);
                    return response.data;
                } catch (error) {
                    throw error;
                }
            },

            /**
             * Set look by id
             * @param {string} id 
             * @param {Look} options 
             * @returns {Look}
             */
            set: async (id, options) => {
                if (typeof id === 'undefined' || id === null) {
                    let err = new Error('invalid id');
                    throw err;
                }

                if (typeof options === 'undefined' || options === null) {
                    let err = new Error('invalid id');
                    throw err;
                }

                try {
                    let response = await put(config.endpoint = 'look/' + id, 'JSON', options);
                    console.log(response);
                    return response.data;
                } catch (error) {
                    throw error;
                }

            },

            /**
             * Delete look by id
             * @param {string} id 
             * @returns {void}
             */
            delete: async (id) => {
                if (typeof id === 'undefined' || id === null) {
                    let err = new Error('invalid id');
                    throw err;
                }

                try {
                    let response = await del(config.endpoint + 'look/' + id);
                    console.log(response);
                    return;
                } catch (error) {
                    throw error;
                }
            },

            /**
             * Triggers look by id 
             * @param {string} id 
             * @returns {void}
             */
            trigger: async (id) => {
                if (typeof id === 'undefined' || id === null) {
                    let err = new Error('invalid id');
                    throw err;
                }

                try {
                    let response = await get(config.endpoint + 'look/' + id + '/tirgger', false);
                    console.log(response);
                    return 0;
                } catch (error) {
                    throw error;
                }
            }
        }

        //Macros
        /**
         * Gets list of all macros
         * 
         * @returns {Array.<Macro>}
         */
        this.macros = async () => {
            try {
                let response = await get(config.endpont + 'macros');
                console.log(response);
                return response.data;
            } catch (error) {
                throw error;
            }
        }



        this.macro = {
            /**
             * Gets macro by id
             * @param {string} id 
             * @returns {Macro}
             */
            get: async (id) => {
                if (typeof id === 'undefined' || id === null) {
                    let err = new Error('invalid id');
                    throw err;
                }

                try {
                    let response = await get(config.endpoint + 'macros/' + id);
                    console.log(response);
                    return response.data;
                } catch (error) {
                    throw error;
                }
            },

            /**
             * Sets Macro by Id
             * @param {string} id 
             * @param {Macro} options 
             * @returns {Macro}
             */
            set: async (id, options) => {
                if (typeof id === 'undefined' || id === null) {
                    let err = new Error('invalid id');
                    throw err;
                }

                if (typeof options === 'undefined' || options === null) {
                    let err = new Error('invalid id');
                    throw err;
                }

                try {
                    let response = await put(config.endpoint + 'macros/' + id, 'JSON', body);
                    console.log(response);
                    return response.data;
                } catch (error) {
                    throw error;
                }
            },

            /**
             * Deletes macro by id
             * @param {string} id 
             * @returns {void}
             */
            delete: async (id) => {
                if (typeof id === 'undefined' || id === null) {
                    let err = new Error('invalid id');
                    throw err;
                }

                try {
                    let response = await del(config.endpoint + 'macros/' + id);
                    console.log(response);
                    return;
                } catch (error) {
                    throw error;
                }
            },

            /**
             * Triggers macro by Id
             * @param {string} id 
             * @returns {void}
             */
            trigger: async (id) => {
                if (typeof id === 'undefined' || id === null) {
                    let err = new Error('invalid id');
                    throw err;
                }

                try {
                    let response = await get(config.endpoint + 'macros/' + id + '/trigger');
                    console.log(response);
                    return;
                } catch (error) {
                    throw error;
                }
            }
        }

        //media
        /**
         * Gets the media thmbnail by id
         * @param {string} id 
         * @param {int} [quality=400] 
         * @returns {Blob}
         */
        this.mediaThumbnail = async (id, quality = 400) => {
            if (typeof id === 'undefined' || id === null) {
                let err = new Error('invalid id');
                throw err;
            }

            try {
                let response = await get(config.endpoint + 'media/' + id + '/thumbnail?quality=' + quality, 'image', { 'Content-Type': 'image/jpeg' });
                console.log(response);
                return response.data;
            } catch (error) {
                throw error;
            }
        }

        /**
         * Gets 
         * @returns {*} -- check returned data
         */
        this.mediaPlaylists = async () => {
            try {
                let response = await get(config.endpoint + 'media/playlists');
                console.log(response);
                return response.data;
            } catch (error) {
                throw error;
            }
        }

        this.mediaPlaylist = {
            /**
             * Gets media playlist by id
             * @param {string} id
             * @returns {Media_Playlist}
             */
            get: async (id) => {
                if (typeof id === 'undefined' || id === null) {
                    let err = new Error('invalid id');
                    throw err;
                }

                try {
                    let response = await get(config.endpoint + 'media/playlist/' + id);
                    console.log(response);
                    return response.data;
                } catch (error) {
                    throw error;
                }
            },

            id: async (option) => {
                if (MEDIA_PLAYLIST_IDS.indexOf(option) == -1) {
                    let err = new Error('invalid option');
                    throw err;
                }

                try {
                    let response;

                    if (option == 'focused') {
                        response = await get(config.endpoint + 'media/playlist/focused');
                    }

                    if (option == 'active') {
                        response = await get(config.endpoint + 'media/playlist/active')
                    }

                    console.log(response);
                    return response.data;
                } catch (error) {
                    throw error;
                }
            },

            focus: async (option, id) => {
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
                        response = await get(config.endpoint + 'media/playlist/' + id + '/focus');
                    } else {
                        response = await get(config.endpoint + 'media/playlist/' + option + '/focus');
                    }

                    console.log(response);
                    return response.data;
                } catch (error) {
                    throw error;
                }
            },

            trigger: async (option, id) => {
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
                        response = await get(config.endpoint + 'media/playlist/' + id + '/trigger');
                    } else {
                        response = await get(config.endpoint + 'media/playlist/' + option + '/trigger');
                    }

                    console.log(response);
                    return response.data;
                } catch (error) {
                    throw error;
                }
            },

            focused: {
                trigger: async (option, id) => {
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
                            response = await get(config.endpoint + 'media/playlist/focused/' + id + '/trigger');
                        } else {
                            response = await get(config.endpoint + 'media/playlist/focused/' + option + '/trigger');
                        }

                        console.log(response);
                        return response.data;
                    } catch (error) {
                        throw error;
                    }
                }
            },

            active: {
                trigger: async (option, id) => {
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
                            response = await get(config.endpoint + 'media/playlist/active/' + id + '/trigger');
                        } else {
                            response = await get(config.endpoint + 'media/playlist/active/' + option + '/trigger');
                        }

                        console.log(response);
                        return response.data;
                    } catch (error) {
                        throw error;
                    }
                }
            },

            playlistId: {
                trigger: async (option, id, media_id) => {
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
                            response = await get(config.endpoint + 'media/playlist/' + id + '/' + media_id + '/trigger');
                        } else {
                            response = await get(config.endpoint + 'media/playlist/' + id + '/' + option + '/trigger');
                        }

                        console.log(response);
                        return response.data;
                    } catch (error) {
                        throw error;
                    }
                }
            }
        }

        //messages
        this.messages = {
            /**
             * Gets a list of all configured messages
             * @returns {Array.<Message>}
             */
            get: async () => {
                try {
                    let response = await get(config.endpoint + 'messages');
                    console.log(response);
                    return response.data;
                } catch (error) {
                    throw error;
                }
            },

            /**
             * Create a message
             * @param {Message} options 
             * @returns {Message}
             */
            create: async (options) => {
                if (typeof options === 'undefined' || options === null) {
                    let err = new Error('invalid options');
                    throw err;
                }

                try {
                    let response = await post(config.endpoint + 'messages', 'JSON', options);
                    console.log(response);
                    return response.data;
                } catch (error) {
                    throw error;
                }
            }
        }

        this.message = {
            /**
             * Get message by id
             * @param {string} id 
             * @returns {Message}
             */
            get: async (id) => {
                if (typeof id === 'undefined' || id === null) {
                    let err = new Error('invalid id');
                    throw err;
                }
                try {
                    let response = await get(config.endpoint + 'message/' + id);
                    console.log(response);
                    return response.data;
                } catch (error) {
                    throw error;
                }
            },

            /**
             * Sets message by id
             * @param {string} id 
             * @param {Message} options 
             * @returns 
             */
            set: async (id, options) => {
                if (typeof id === 'undefined' || id === null) {
                    let err = new Error('invalid id');
                    throw err;
                }

                if (typeof options === 'undefined' || options === null) {
                    let err = new Error('invalid options');
                    throw err;
                }
                try {
                    let response = await put(config.endpoint + 'message/' + id, 'JSON', options);
                    console.log(response);
                    return response.data;
                } catch (error) {
                    throw error;
                }
            },

            /**
             * Delete message by id
             * @param {string} id 
             * @returns {void} 
             */
            delete: async (id) => {
                if (typeof id === 'undefined' || id === null) {
                    let err = new Error('invalid id');
                    throw err;
                }

                try {
                    let response = await del(config.endpoint + 'message/' + id);
                    console.log(response);
                    return;
                } catch (error) {
                    throw error;
                }
            },

            /**
             * Triggers the specified message
             * @param {sring} id 
             * @param {Message} options 
             * @returns 
             */
            trigger: async (id, options) => {
                if (typeof id === 'undefined' || id === null) {
                    let err = new Error('invalid id');
                    throw err;
                }

                if (typeof options === 'undefined' || options === null) {
                    let err = new Error('invalid options');
                    throw err;
                }
                try {
                    let response = await post(config.endpoint + 'message/' + id + '/trigger', 'JSON', body);
                    console.log(response);
                    return;
                } catch (error) {
                    throw error;
                }
            },

            /**
             * Clear message by id
             * @param {string} id 
             * @returns 
             */
            clear: async (id) => {
                if (typeof id === 'undefined' || id === null) {
                    let err = new Error('invalid id');
                    throw err;
                }

                try {
                    let response = await get(config.endpoint + 'message/' + id + '/clear', false);
                    console.log(response);
                    return 0;
                } catch (error) {
                    throw error;
                }
            }
        }

        this.playlists = {
            get: async () => {
                try {
                    let response = await get(config.endpoint + 'playlists');
                    console.log(response);
                    return response.data;
                } catch (error) {
                    throw error;
                }
            },

            create: async (options) => {
                if (typeof options === 'undefined' || options === null) {
                    let err = new Error('invalid options');
                    throw err;
                }
                try {
                    let response = await post(config.endpoint + 'playlists', 'JSON', options);
                    console.log(response);
                    return response.data;
                } catch (error) {
                    throw error;
                }
            }
        }

        this.playlist = {
            get: async (id) => {
                if (typeof id === 'undefined' || id === null) {
                    let err = new Error('invalid id');
                    throw err;
                }
                try {
                    let response = await get(config.endpoint + 'playlists/' + id);
                    console.log(response);
                    return response.data;
                } catch (error) {
                    throw error;
                }
            },

            set: async (id, options) => {
                if (typeof id === 'undefined' || id === null) {
                    let err = new Error('invalid id');
                    throw err;
                }

                if (typeof options === 'undefined' || options === null) {
                    let err = new Error('invalid options');
                    throw err;
                }
                try {
                    let response = await put(config.endpoint + 'playlist/' + id, 'JSON', options);
                    console.log(response);
                    return response.data;
                } catch (error) {
                    throw error;
                }
            },

            create: async (id, options) => {
                if (typeof id === 'undefined' || id === null) {
                    let err = new Error('invalid id');
                    throw err;
                }
                if (typeof options === 'undefined' || options === null) {
                    let err = new Error('invalid options');
                    throw err;
                }
                try {
                    let response = await post(config.endpoint + 'playlist/' + id, 'JSON', options);
                    console.log(response);
                    return response.data;
                } catch (error) {
                    throw error;
                }
            },

            info: async (option) => {
                if (MEDIA_PLAYLIST_IDS.indexOf(option) == -1) {
                    let err = new Error('invalid options');
                    throw err;
                }
                try {
                    let response;
                    if (option == 'active') {
                        response = await get(config.endpoint + 'playlist/active');
                    }

                    if (option == 'focused') {
                        response = await get(config.endpoint + 'playlist/focused');
                    }
                    console.log(response);
                    return response.data;
                } catch (error) {
                    throw error;
                }
            },

            focus: async (option) => {
                if (typeof options === 'undefined' || options === null) {
                    let err = new Error('invalid options');
                    throw err;
                }
                try {
                    let response = await get(config.endpoint + 'playlist/' + option + '/focus');
                    console.log(response);
                    return 0;
                } catch (error) {
                    throw error;
                }

            },

            active: {
                focus: async (option) => {
                    if (ACTIVE_PLAYLIST.indexOf(option) == -1) {
                        let err = new Error('invalid options');
                        throw err;
                    }
                    try {
                        let response = await get(config.endpoint + 'playlist/active/' + option + '/focus');
                        console.log(response);
                        return 0;
                    } catch (error) {
                        throw error;
                    }
                },

                trigger: async (option, index) => {
                    if (ACTIVE_PLAYLIST.indexOf(option) == -1) {
                        let err = new Error('invalid options');
                        throw err;
                    }
                    try {
                        let response;
                        if (typeof index === 'undefined' || index === null) {
                            if (option == 'announcement') {
                                response = await get(`${config.endpoint}playlist/active/announcement/${option}/trigger`);
                            } else {
                                response = await get(config.endpoint + 'playlist/active/presentation/' + option + '/trigger');
                            }

                        } else {
                            response = await get(config.endpoint + 'playlist/active/' + index + '/trigger');
                        }
                        console.log(response);
                        return 0;
                    } catch (error) {
                        throw error;
                    }
                }
            },

            focused: {
                trigger: async (option, index) => {
                    try {
                        let response;
                        if (option == 'next' || option == 'previous') {
                            response = await get(config.endpoint + 'playlist/focused/' + option + '/trigger');
                        } else if (option == 'index') {
                            if (typeof index === 'undefined' || index === null) {
                                let err = new Error('invalid index');
                                throw err;
                            }
                            response = await get(config.endpoint + 'playlist/' + id + '/' + index + '/trigger');
                        } else {
                            response = await get(config.endpoint + 'playlist/focused/trigger');
                        }
                        console.log(response);
                        return 0;
                    } catch (error) {
                        throw error;
                    }
                }
            },

            id: {
                trigger: async (id, option, index) => {
                    if (typeof id === 'undefined' || id === null) {
                        let err = new Error('invalid id');
                        throw err;
                    }
                    try {
                        let response;
                        if (option == 'next' || option == 'previous') {
                            response = await get(config.endpoint + 'playlist/' + id + '/' + option + '/trigger');
                        } else if (option == 'index') {
                            if (typeof index === 'undefined' || index === null) {
                                let err = new Error('invalid index');
                                throw err;
                            }
                            response = await get(config.endpoint + 'playlist/' + id + '/' + index + '/trigger');
                        } else {
                            response = await get(config.endpoint + 'playlist/' + id + '/trigger');
                        }
                        console.log(response);
                        return 0;
                    } catch (error) {
                        throw error;
                    }
                }
            }


        }

        this.presentation = {
            active: {
                get: async () => {
                    try {
                        let response = await get(config.endpoint + 'presentation/active');
                        console.log(response);
                        return response.data;
                    } catch (error) {
                        throw error;
                    }
                },

                timeline: {
                    state: async () => {
                        try {
                            let response = await get(config.endpoint + 'presentation/active/timeline');
                            console.log(response);
                            return response.data;
                        } catch (error) {
                            throw error;
                        }
                    },

                    operation: async (op = "play") => {
                        if (TIMELINE.indexOf(op) == -1) {
                            let err = new Error('invalid operation');
                            throw err;
                        }

                        try {
                            let response = await get(config.endpoint + 'presentation/active/timeline/' + op, false);
                            console.log(response);
                            return 0;
                        } catch (error) {
                            throw error;
                        }
                    }
                },

                trigger: async (option) => {
                    try {
                        let response;
                        if (typeof id === 'undefined' || id === null) {
                            response = await get(config.endpoint + 'active/trigger');
                        } else {
                            response = await get(config.endpoint + 'active/' + option + '/trigger')
                        }
                        console.log(response);
                        return 0;
                    } catch (error) {
                        throw error;
                    }
                },

                groupTrigger: async (groupId) => {
                    if (typeof id === 'undefined' || id === null) {
                        let err = new Error('invalid id');
                        throw err;
                    }

                    if (typeof groupId === 'undefined' || groupId === null) {
                        let err = new Error('invalid id');
                        throw err;
                    }
                    try {
                        let response = await get(config.endpoint + 'active/group/' + groupId + '/trigger');
                        console.log(response);
                        return 0;
                    } catch (error) {
                        throw error;
                    }
                }
            },

            focused: {
                get: async () => {
                    try {
                        let response = await get(config.endpoint + 'presentation/focused');
                        console.log(response);
                        return response.data;
                    } catch (error) {
                        throw error;
                    }
                },

                timeline: {
                    state: async () => {
                        try {
                            let response = await get(config.endpoint + 'presentation/focused/timeline');
                            console.log(response);
                            return response.data;
                        } catch (error) {
                            throw error;
                        }
                    },

                    operation: async (op = "play") => {
                        if (TIMELINE.indexOf(op) == -1) {
                            let err = new Error('invalid operation');
                            throw err;
                        }

                        try {
                            let response = await get(config.endpoint + 'presentation/focused/timeline/' + op, false);
                            console.log(response);
                            return 0;
                        } catch (error) {
                            throw error;
                        }
                    }
                },

                trigger: async (option) => {
                    try {
                        let response;
                        if (typeof id === 'undefined' || id === null) {
                            response = await get(config.endpoint + 'focused/trigger');
                        } else {
                            response = await get(config.endpoint + 'focused/' + option + '/trigger')
                        }
                        console.log(response);
                        return 0;
                    } catch (error) {
                        throw error;
                    }
                },

                groupTrigger: async (groupId) => {
                    if (typeof id === 'undefined' || id === null) {
                        let err = new Error('invalid id');
                        throw err;
                    }

                    if (typeof groupId === 'undefined' || groupId === null) {
                        let err = new Error('invalid id');
                        throw err;
                    }
                    try {
                        let response = await get(config.endpoint + 'focused/group/' + groupId + '/trigger');
                        console.log(response);
                        return 0;
                    } catch (error) {
                        throw error;
                    }
                }
            },

            slideIndex: async () => {
                try {
                    let response = await get(config.endpoint + 'presentation/silde_index');
                    console.log(response);
                    return response.data;
                } catch (error) {
                    throw error;
                }
            },

            chordChart: async (quality = 400) => {
                try {
                    let response = await get(config.endpoint + 'presentation/chordChart?quality=' + quality, 'image', { 'Content-Type': 'image/jpeg' });
                    console.log(response);
                    return response.data;
                } catch (error) {
                    throw error;
                }
            },

            uuid: {
                get: async (id) => {
                    if (typeof id === 'undefined' || id === null) {
                        let err = new Error('invalid id');
                        throw err;
                    }
                    try {
                        let response = await get(config.endpoint + 'presentation/' + id);
                        console.log(response);
                        return response.data;
                    } catch (error) {
                        throw error;
                    }
                },

                timeline: {
                    operation: async (id, op = "play") => {
                        if (typeof id === 'undefined' || id === null) {
                            let err = new Error('invalid id');
                            throw err;
                        }
                        if (TIMELINE.indexOf(op) == -1) {
                            let err = new Error('invalid operation');
                            throw err;
                        }

                        try {
                            let response = await get(config.endpoint + 'presentation/focused/timeline/' + op, false);
                            console.log(response);
                            return 0;
                        } catch (error) {
                            throw error;
                        }
                    }
                },

                trigger: async (id, option) => {
                    if (typeof id === 'undefined' || id === null) {
                        let err = new Error('invalid id');
                        throw err;
                    }
                    try {
                        let response;
                        if (typeof id === 'undefined' || id === null) {
                            response = await get(config.endpoint + id + '/trigger');
                        } else {
                            response = await get(config.endpoint + id + '/' + option + '/trigger')
                        }
                        console.log(response);
                        return 0;
                    } catch (error) {
                        throw error;
                    }
                },

                groupTrigger: async (id, groupId) => {
                    if (typeof id === 'undefined' || id === null) {
                        let err = new Error('invalid id');
                        throw err;
                    }

                    if (typeof groupId === 'undefined' || groupId === null) {
                        let err = new Error('invalid id');
                        throw err;
                    }
                    try {
                        let response = await get(config.endpoint + id + '/group/' + groupId + '/trigger');
                        console.log(response);
                        return 0;
                    } catch (error) {
                        throw error;
                    }
                },

                thumbnail: async (id, index, quality = 400) => {
                    if (typeof id === 'undefined' || id === null) {
                        let err = new Error('invalid id');
                        throw err;
                    }

                    if (typeof index === 'undefined' || index === null) {
                        let err = new Error('invalid index');
                        throw err;
                    }

                    try {
                        let response = await get(config.endpoint + 'presentation/' + id + '/thumbnail/' + index + '?quality=' + quality, 'image', { 'Content-Type': 'image/jpeg' });
                        console.log(response);
                        return response.data;
                    } catch (error) {
                        throw error;
                    }
                }
            },

            focus: async (option) => {
                if (typeof id === 'undefined' || id === null) {
                    let err = new Error('invalid id');
                    throw err;
                }

                try {
                    let response = await get(config.endpoint + option + '/focus');
                    console.log(response);
                    return 0;
                } catch (error) {
                    throw error;
                }
            }
        }

        //Get list of all props
        /**
         * Get list of all props
         * @returns {Array.<Prop>}
         */
        this.props = async () => {
            try {
                let response = await get(config.endpoint + '/props');
                console.log(response);
                return response.data;
            } catch (error) {
                throw error;
            }
        }

        this.prop = {
            /**
             * Get prop by id
             * @param {string} id 
             * @returns {Prop}
             */
            get: async (id) => {
                if (typeof id === 'undefined' || id === null) {
                    let err = new Error('invalid id');
                    throw err;
                }

                try {
                    let response = await get(config.endpoint + 'prop/' + id);
                    console.log(response);
                    return response.data;
                } catch (error) {
                    throw error;
                }
            },

            /**
             * Delete prop by id
             * @param {string} id 
             * @returns {void}
             */
            delete: async (id) => {
                if (typeof id === 'undefined' || id === null) {
                    let err = new Error('invalid id');
                    throw err;
                }

                try {
                    let response = await del(config.endpoint + 'prop/' + id);
                    console.log(response);
                    return;
                } catch (error) {
                    throw error;
                }
            },

            /**
             * Trigger prop by id
             * @param {string} id 
             * @returns {void}
             */
            trigger: async (id) => {
                if (typeof id === 'undefined' || id === null) {
                    let err = new Error('invalid id');
                    throw err;
                }

                try {
                    let response = await get(config.endpoint + 'prop/' + id + '/trigger');
                    console.log(response);
                    return 0;
                } catch (error) {
                    throw error;
                }
            },

            /**
             * Clear prop by Id
             * @param {string} id 
             * @returns {void}
             */
            clear: async (id) => {
                if (typeof id === 'undefined' || id === null) {
                    let err = new Error('invalid id');
                    throw err;
                }

                try {
                    let response = await get(config.endpoint + 'prop/' + id + '/clear');
                    console.log(response);
                    return 0;
                } catch (error) {
                    throw error;
                }
            },

            /**
             * 
             * @param {string} id 
             * @param {int} [quality=400] 
             * @returns {Blob}
             */
            thumbnail: async (id, quality = 400) => {
                if (typeof id === 'undefined' || id === null) {
                    let err = new Error('invalid id');
                    throw err;
                }
                try {
                    let response = await get(config.endpoint + 'prop/' + id + '/thumbnail?quality=' + quality, 'image', { 'Content-Type': 'image/jpeg' });
                    console.log(response);
                    return response.data;
                } catch (error) {
                    throw error;
                }
            }
        }

        this.stage = {
            message: {
                get: async () => {
                    try {
                        let response = await get(config.endpoint + 'stage/message');
                        console.log(response);
                        return response.data;
                    } catch (error) {
                        throw error;
                    }
                },

                show: async (message) => {
                    if (typeof message === 'undefined' || message === null) {
                        let err = new Error('invalid message');
                        throw err;
                    }

                    try {
                        let response = await put(config.endpoint + 'stage/message', false, message);
                        console.log(response);
                        return 0;
                    } catch (error) {
                        throw error;
                    }
                },

                delete: async () => {
                    try {
                        let response = await del(config.endpoint + 'stage/message');
                        console.log(response);
                        return 0;
                    } catch (error) {
                        throw error;
                    }
                }
            },

            layout_map: {
                get: async () => {
                    try {
                        let response = await get(config.endpoint + 'stage/layout_map');
                        console.log(response);
                        return 0;
                    } catch (error) {
                        throw error;
                    }
                },

                set: async (body) => {
                    if (typeof body === 'undefined' || body === null) {
                        let err = new Error('invalid body');
                        throw err;
                    }

                    try {
                        let response = await put(config.endpoint + 'stage/layout_map', false, body);
                        console.log(response);
                        return 0;
                    } catch (error) {
                        throw error;
                    }
                }
            },

            screens: async () => {
                try {
                    let response = await get(config.endpoint + 'stage/screens');
                    console.log(response);
                    return response.data;
                } catch (error) {
                    throw error;
                }
            },

            screen: {
                getLayout: async (id) => {
                    if (typeof id === 'undefined' || id === null) {
                        let err = new Error('invalid id');
                        throw err;
                    }

                    try {
                        let response = await get(config.endpoint + 'stage/screen/' + id + '/layout');
                        console.log(response);
                        return response.data;
                    } catch (error) {
                        throw error;
                    }
                },

                setLayout: async (id, layout_id) => {
                    if (typeof id === 'undefined' || id === null) {
                        let err = new Error('invalid id');
                        throw err;
                    }

                    if (typeof layout_id === 'undefined' || layout_id === null) {
                        let err = new Error('invalid layout_id');
                        throw err;
                    }

                    try {
                        let response = await get(config.endpoint + 'stage/screen/' + id + '/layout/' + layout_id);
                        console.log(response);
                        return 0;
                    } catch (error) {
                        throw error;
                    }
                }
            },

            layouts: async () => {
                try {
                    let response = await get(config.endpoint + 'stage/layouts');
                    console.log(response);
                    return response.data;
                } catch (error) {
                    throw error;
                }
            },

            layout: {
                delete: async (id) => {
                    if (typeof id === 'undefined' || id === null) {
                        let err = new Error('invalid id');
                        throw err;
                    }

                    try {
                        let response = await del(config.endpoint + 'stage/layout/' + id);
                        console.log(response);
                        return 0;
                    } catch (error) {
                        throw error;
                    }
                },

                thumbnail: async (id, quality = 400) => {
                    if (typeof id === 'undefined' || id === null) {
                        let err = new Error('invalid id');
                        throw err;
                    }
                    try {
                        let response = await get(config.endpoint + 'stage/layout/' + id + '/thumbnail?quality=' + quality, 'image', { 'Content-Type': 'image/jpeg' });
                        console.log(response);
                        return response.data;
                    } catch (error) {
                        throw error;
                    }
                }
            }
        }

        this.themes = async () => {
            try {
                let response = await get(config.endpoint + 'themes');
                console.log(response);
                return response.data;
            } catch (error) {
                throw error;
            }
        }

        this.theme = {
            get: async (id) => {
                if (typeof id === 'undefined' || id === null) {
                    let err = new Error('invalid id');
                    throw err;
                }
                try {
                    let response = await get(config.endpoint + 'theme/' + id);
                    console.log(response);
                    return response.data;
                } catch (error) {
                    throw error;
                }
            },

            slides: {
                get: async (id, theme_slide) => {
                    if (typeof id === 'undefined' || id === null) {
                        let err = new Error('invalid id');
                        throw err;
                    }
                    if (typeof theme_slide === 'undefined' || theme_slide === null) {
                        let err = new Error('invalid theme_slide');
                        throw err;
                    }
                    try {
                        let response = await get(config.endpoint + 'theme/' + id + '/slides/' + theme_slide);
                        console.log(response);
                        return response.data;
                    } catch (error) {
                        throw error;
                    }
                },

                set: async (id, theme_slide, body) => {
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
                        let response = await put(config.endpoint + 'theme/' + id + '/slides/' + theme_slide, false, body);
                        console.log(response);
                        return 0;
                    } catch (error) {
                        throw error;
                    }
                },

                thumbnail: async (id, theme_slide, quality = 400) => {
                    if (typeof id === 'undefined' || id === null) {
                        let err = new Error('invalid id');
                        throw err;
                    }
                    try {
                        let response = await get(config.endpoint + 'theme/' + id + '/slides/' + theme_slide + '/thumbnail?quality=' + quality, 'image', { 'Content-Type': 'image/jpeg' });
                        console.log(response);
                        return response.data;
                    } catch (error) {
                        throw error;
                    }
                },
            }
        }

        this.timers = {
            get: async () => {
                try {
                    let response = await get(config.endpoint + 'timers');
                    console.log(response);
                    return response.data;
                } catch (error) {
                    throw error;
                }
            },

            create: async (body) => {
                try {
                    let response = await post(config.endpoint + 'timers', 'JSON', body);
                    console.log(response);
                    return response.data;
                } catch (error) {
                    throw error;
                }
            },

            current: async () => {
                try {
                    let response = await get(config.endpoint + 'timers/current');
                    console.log(response);
                    return response.data;
                } catch (error) {
                    throw error;
                }
            },

            operation: async (op = 'start') => {
                if (TIMER_OPERATIONS.indexOf(op) == -1) {
                    let err = new Error('invalid timer operation');
                    throw err;
                }
                try {
                    let response = await get(config.endpoint + 'timers/' + op, false);
                    console.log(response);
                    return 0;
                } catch (error) {
                    throw error;
                }
            }
        }

        this.timer = {
            get: async (id) => {
                if (typeof id === 'undefined' || id === null) {
                    let err = new Error('invalid id');
                    throw err;
                }
                try {
                    let response = await get(config.endpoint + 'timer' + id);
                    console.log(response);
                    return response.data;
                } catch (error) {
                    throw error;
                }
            },

            set: async (id, body) => {
                if (typeof id === 'undefined' || id === null) {
                    let err = new Error('invalid id');
                    throw err;
                }

                if (typeof body === 'undefined' || body === null) {
                    let err = new Error('invalid body');
                    throw err;
                }
                try {
                    let response = await put(config.endpoint + 'timer/' + id, 'JSON', body);
                    console.log(response);
                    return response.data;
                } catch (error) {
                    throw error;
                }
            },

            delete: async (id) => {
                if (typeof id === 'undefined' || id === null) {
                    let err = new Error('invalid id');
                    throw err;
                }
                try {
                    let response = await del(config.endpoint + 'timer/' + id);
                    console.log(response);
                    return 0;
                } catch (error) {
                    throw error;
                }
            },

            operation: async (id, op = 'start') => {
                if (typeof id === 'undefined' || id === null) {
                    let err = new Error('invalid id');
                    throw err;
                }
                if (TIMER_OPERATIONS.indexOf(op) == -1) {
                    let err = new Error('invalid timer operation');
                    throw err;
                }
                try {
                    let response = await get(config.endpoint + 'timer/' + id + '/' + op, false);
                    console.log(response);
                    return 0;
                } catch (error) {
                    throw error;
                }
            },

            systemTime: async () => {
                try {
                    let response = await get(config.endpoint + 'system_time');
                    console.log(response);
                    return response.data;
                } catch (error) {
                    throw error;
                }
            },

            videoCountdown: async () => {
                try {
                    let response = await get(config.endpoint + 'video_countdown');
                    console.log(response);
                    return response.data;
                } catch (error) {
                    throw error;
                }
            }
        }
        /**
         * Listen for event and execute callback function
         * @param {String} event - See ProPresenter7 openapi doc for the possible events
         * @param {Function} callback - Callback function when event is fired
         */
        this.on = (event, callback) => {
            eventEmitter.on(event, (data) => {
                callback(data);
            });
        }

        /**
         * Starts streaming the status of events passed as an array of strings.
         * See ProPresenter7 openapi doc for the possible events.
         * Use the .on() method to listen for events
         * @param {Array.<string>} events 
         */
        this.status = async (events) => {
            try {
                const response = await fetch(config.endpoint + "status/updates", {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(events)
                });

                const status = checkStatus(await response.status); //always will be a status

                const stream = response.body;
                const textStream = stream.pipeThrough(new TextDecoderStream());
                for await (const chunk of textStream) {

                    // console.log(chunk);
                    // console.log("next");
                    //pass chunk to for event handling
                    updateHandler(chunk);
                }
            } catch (error) {
                throw error;
            }

        }
    };//end constructor

    //public static methods

    return constructor;
}();

export default PP7;