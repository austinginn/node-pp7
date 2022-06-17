//PP7 API Node Module
import { fetch } from 'undici';
import { TextDecoderStream } from 'node:stream/web';


const PP7 = function () {
    //private vars

    //Possible layer types
    const LAYERS = ['audio', 'props', 'messages', 'announcements', 'slide', 'media', 'video_input'];

    //Possible timeline operations
    const timeline = ['play', 'pause', 'rewind'];

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

    let config = {
        version: 'v1'
    }



    let pp7_data = {

    }

    ///////////////
    //CONSTRUCTOR//
    ///////////////
    const constructor = function pp7(protocol = 'http', ip = '127.0.0.1', port = 1025) {

        config.protocol = protocol;
        config.ip = ip;
        config.port = port;

        config.endpoint = protocol + '://' + ip + ":" + port + '/' + config.version + '/';


        console.log(config); //check

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

        //Check if integer
        const isInt = (value) => {
            return !isNaN(value) &&
                parseInt(Number(value)) == value &&
                !isNaN(parseInt(value, 10));
        }

        ////////////
        //Triggers//
        ////////////
        //general trigger for presentations/playlists
        const triggerRequest = async (option) => {
            try {
                let response = await get(config.endpoint + 'trigger/' + option, false);
                console.log(response); //check
                return response;
            } catch (err) {
                console.log(err);
            }
        }

        //media trigger
        const triggerMediaRequest = async (option) => {
            try {
                let response = await get(config.endpoint + 'trigger/media/' + option, false);
                console.log(response); //check
                return response;
            } catch (err) {
                console.log(err);
            }
        }

        //audio trigger
        const triggerAudioRequest = async (option) => {
            try {
                let response = await get(config.endpoint + 'trigger/audio/' + option, false);
                console.log(response); //check
                return response;
            } catch (err) {
                console.log(err);
            }
        }

        ////////////////
        //Video Inputs//
        ////////////////
        //get list of video inputs
        const videoInputsRequest = async () => {
            try {
                let response = await get(config.endpoint + 'video_inputs');
                console.log(response); //check
                return response;
            } catch (err) {
                console.log(err);
            }
        }

        //video input trigger
        const videoInputsTriggerRequest = async (id) => {
            try {
                let response = await get(config.endpoint + 'video_inputs/' + id + '/trigger', false);
                console.log(response); //check
                return response;
            } catch (err) {
                console.log(err);
            }
        }

        /////////
        //Masks//
        /////////
        //get list of masks
        const masksRequest = async () => {
            try {
                let response = await get(config.endpoint + 'masks');
                console.log(response); //check
                return response;
            } catch (err) {
                console.log(err);
            }
        }

        //get details of specific mask
        const maskRequest = async (id) => {
            try {
                let response = await get(config.endpoint + 'mask/' + id);
                console.log(response); //check
                return response;
            } catch (err) {
                console.log(err);
            }
        }

        //get mask thumbnail
        const maskThumbnailRequest = async (id, quality) => {
            try {
                let response = await get(config.endpoint + 'mask/' + id + '/thumbnail?quality=' + quality, 'image', { 'Content-Type': 'image/jpeg' });
                console.log(response); //check
                return response;
            } catch (err) {
                console.log(err);
            }
        }

        /////////////////
        //Announcements//
        /////////////////
        //get the active announcement
        const announcementActiveRequest = async () => {
            try {
                let response = await get(config.endpoint + 'announcement/active');
                console.log(response); //check
                return response;
            } catch (err) {
                console.log(err);
            }
        }

        //get the index of the current slide/cue
        const announcementSlideIndexRequest = async () => {
            try {
                let response = await get(config.endpoint + 'announcement/slide_index');
                console.log(response); //check
                return response;
            } catch (err) {
                console.log(err);
            }
        }

        //focus the current active announcement presentation
        const announcementActiveFocusRequest = async () => {
            try {
                let response = await get(config.endpoint + 'announcement/active/focus', false);
                console.log(response); //check
                return response;
            } catch (err) {
                console.log(err);
            }
        }

        //retrigger the current active announcement presentation
        const announcementActiveRetriggerRequest = async () => {
            try {
                let response = await get(config.endpoint + 'announcement/active/trigger', false);
                console.log(response); //check
                return response;
            } catch (err) {
                console.log(err);
            }
        }

        //trigger the next cue in the active announcement presentation
        const announcementActiveTriggerRequest = async (option) => {
            try {
                let response = await get(config.endpoint + 'announcement/active/' + option + '/trigger', false);
                console.log(response); //check
                return response;
            } catch (err) {
                console.log(err);
            }
        }

        //timeline opperation for the active announcment presentation
        const announcementActiveTimelineOperationRequest = async (option) => {
            try {
                let response = await get(config.endpoint + 'announcement/active/timeline/' + option, false);
                console.log(response); //check
                return response;
            } catch (err) {
                console.log(err);
            }
        }

        //get active announcement timeline state
        const announcementActiveTimelineRequest = async () => {
            try {
                let response = await get(config.endpoint + 'announcement/active/timeline');
                console.log(response); //check
                return response;
            } catch (err) {
                console.log(err);
            }
        }

        /////////
        //Audio//
        /////////
        //get list of all configured audio playlists
        const audioPlaylistsRequest = async () => {
            try {
                let response = await get(config.endpoint + 'audio/playlists');
                console.log(response); //check
                return response;
            } catch (err) {
                console.log(err);
            }
        }

        //get list of all the audio items in a specified playlist
        const audioPlaylistRequest = async (id) => {
            try {
                let response = await get(config.endpoint + 'audio/playlist/' + id + '?start=0');
                console.log(response); //check
                return response;
            } catch (err) {
                console.log(err);
            }
        }

        //get currently focused audio playlist
        const audioPlaylistFocusedRequest = async () => {
            try {
                let response = await get(config.endpoint + 'audio/playlist/focused');
                console.log(response); //check
                return response;
            } catch (err) {
                console.log(err);
            }
        }

        //get currently active audio playlist
        const audioPlaylistActiveRequest = async () => {
            try {
                let response = await get(config.endpoint + 'audio/playlist/active');
                console.log(response); //check
                return response;
            } catch (err) {
                console.log(err);
            }
        }

        //Focus next, previous, active or specific audio playlist
        const audioPlaylistFocusRequest = async (option) => {
            try {
                let response = await get(config.endpoint + 'audio/playlist/' + option + '/focus', false);
                console.log(response); //check
                return response;
            } catch (err) {
                throw err;
            }
        }

        //Trigger focused, active or specific audio playlist
        const audioPlaylistTriggerRequest = async (option) => {
            try {
                let response = await get(config.endpoint + 'audio/playlist/' + option + '/trigger', false);
                console.log(response); //check
                return response;
            } catch (err) {
                console.log(err);
            }
        }

        //Trigger focused playlist audio
        const audioPlaylistFocusedTriggerRequest = async (option) => {
            try {
                let response = await get(config.endpoint + 'audio/playlist/focused/' + option + '/trigger', false);
                console.log(response); //check
                return response;
            } catch (err) {
                console.log(err);
            }
        }

        //trigger active playlist audio
        const audioPlaylistActiveTriggerRequest = async (option) => {
            try {
                let response = await get(config.endpoint + 'audio/playlist/active/' + option + '/trigger', false);
                console.log(response); //check
                return response;
            } catch (err) {
                console.log(err);
            }
        }

        //trigger specific playlist audio
        const audioPlaylistIdTriggerRequest = async (id, option) => {
            try {
                let response = await get(config.endpoint + 'audio/playlist/' + id + '/' + option + '/trigger', false);
                console.log(response); //check
                return response;
            } catch (err) {
                console.log(err);
            }
        }
        ///////////
        //Capture//
        ///////////
        //get current capture status and time
        const captureStatusRequest = async () => {
            try {
                let response = await get(config.endpoint + 'capture/status', false);
                console.log(response); //check
                return response;
            } catch (err) {
                console.log(err);
            }
        }

        //get current capture status and time
        const captureOperationRequest = async (option) => {
            try {
                let response = await get(config.endpoint + 'capture/' + option, false);
                console.log(response); //check
                return response;
            } catch (err) {
                console.log(err);
            }
        }

        //get current capture settings
        const captureSettingsRequest = async () => {
            try {
                let response = await get(config.endpoint + 'capture/settings');
                console.log(response); //check
                return response;
            } catch (err) {
                console.log(err);
            }
        }

        //get list of capture modes for the capture type
        const captureEncodingsRequest = async (type) => {
            try {
                let response = await get(config.endpoint + 'capture/encodings/' + type);
                console.log(response); //check
                return response;
            } catch (err) {
                console.log(err);
            }
        }

        /////////
        //Clear//
        /////////
        //get list of all clear groups
        const clearGroupsRequest = async () => {
            try {
                let response = await get(config.endpoint + 'clear/groups');
                console.log(response); //check
                return response;
            } catch (err) {
                console.log(err);
            }
        }

        //clear the specified layer
        const clearLayerRequest = async (option) => {
            try {
                let response = await get(config.endpoint + 'clear/layer/' + option, false);
                console.log(response); //check
                return response;
            } catch (err) {
                console.log(err);
            }
        }


        //get the specified clear group
        const clearGroupRequest = async (id) => {
            try {
                let response = await get(config.endpoint + 'clear/group/' + id);
                console.log(response); //check
                return response;
            } catch (err) {
                throw err;
            }
        }

        //set the details of the specified clear group
        const clearGroupSetRequest = async (id, options) => {
            try {
                let response = await put(config.endpoint + 'clear/group/' + id, options);
                console.log(response); //check
                return response;
            } catch (err) {
                throw err;
            }
        }

        //delete the specified clear group
        const clearGroupDeleteRequest = async (id) => {
            try {
                let response = await del(config.endpoint + 'clear/group/' + id);
                console.log(response); //check
                return response;
            } catch (err) {
                throw err;
            }
        }

        const clearGroupIconRequest = async (id) => {
            try {
                let response = await get(config.endpoint + 'clear/group/' + id + '/icon', 'image', { 'Content-Type': 'image/jpeg' });
                console.log(response);
                return response;
            } catch (err) {
                throw err;
            }
        }

        const clearGroupIconSetRequest = async (id, formData) => {
            try {
                let response = await put(config.endpoint + 'clear/group/' + id + '/icon', 'image', formData, { 'accept': '*/*', 'Content-Type': 'image/*' })
                console.log(response);
                return response;
            } catch (err) {
                throw err;
            }
        }

        const clearGroupTriggerRequest = async (id) => {
            try {
                let response = await get(config.endpoint + 'clear/group/' + id + '/trigger', false);
                console.log(response);
                return response;
            } catch (err) {
                throw err;
            }
        }

        const clearGroupsCreateRequest = async (body) => {
            try {
                let response = await post(config.endpoint + 'clear/groups', 'JSON', body);
                console.log(response);
                return response;
            } catch (err) {
                throw err;
            }
        }

        /////////////////
        //Global Groups//
        /////////////////
        //get list of all global groups
        const groupsRequest = async () => {
            try {
                let response = await get(config.endpoint + 'groups');
                console.log(response);
                return response;
            } catch (err) {
                throw err;
            }
        }

        ////////
        //Misc//
        ////////
        const findMouseRequest = async () => {
            try {
                let response = await get(config.endpoint + 'find_my_mouse', false);
                console.log(response);
                return response;
            } catch (err) {
                throw err;
            }
        }

        ///////////
        //Library//
        ///////////
        //get all configured libraries
        const librariesRequest = async () => {
            try {
                let response = await get(config.endpoint + 'libraries');
                console.log(response);
                return response;
            } catch (err) {
                throw err;
            }
        }

        //get all items in specified library
        const libraryRequest = async (id) => {
            try {
                let response = await get(config.endpoint + 'library/' + id);
                console.log(response);
                return response;
            } catch (err) {
                throw err;
            }
        }

        //get all items in specified library
        const libraryTriggerRequest = async (library_id, presentation_id, index) => {
            try {
                let response;
                if (typeof index === 'undefined' || index === null) {
                    response = await get(config.endpoint + 'library/' + library_id + '/' + presentation_id + '/trigger', false);
                } else {
                    response = await get(config.endpoint + 'library/' + library_id + '/' + presentation_id + '/' + index + '/trigger', false);
                }
                console.log(response);
                return response;

            } catch (err) {
                throw err;
            }
        }

        /////////
        //Looks//
        /////////
        //get all audience looks except the live look
        const looksRequest = async () => {
            try {
                let response = await get(config.endpoint + 'looks');
                console.log(response);
                return response;
            } catch (err) {
                throw err;
            }
        }

        //create new audience look with specified options
        const looksCreateRequest = async (body) => {
            try {
                let response = await post(config.endpoint + 'looks', 'JSON', body);
                console.log(response);
                return response;
            } catch (err) {
                throw err;
            }
        }

        //get current look
        const lookCurrentRequest = async () => {
            try {
                let response = await get(config.endpoint + 'look/current');
                console.log(response);
                return response;
            } catch (err) {
                throw err;
            }
        }

        //set the details of the current live look
        const lookCurrentSetRequest = async (body) => {
            try {
                let response = await put(config.endpoint + 'look/current', false, body);
                console.log(response);
                return response;
            } catch (err) {
                throw err;
            }
        }

        //get look by id
        const lookRequest = async (id) => {
            try {
                let response = await get(config.endpoint + 'look/' + id);
                console.log(response);
                return response;
            } catch (err) {
                throw err
            }
        }

        //set details of look by id
        const lookSetRequest = async (id, body) => {
            try {
                let response = await put(config.endpoint = 'look/' + id, 'JSON', body);
                console.log(response);
                return response;
            } catch (err) {
                throw err;
            }
        }

        //Delete look by id
        const lookDeleteRequest = async (id, body) => {
            try {
                let response = await del(config.endpoint + 'look/' + id);
                console.log(response);
                return response;
            } catch (err) {
                throw err;
            }
        }

        //trigger look by id
        const lookTriggerRequest = async (id) => {
            try {
                let response = await get(config.endpoint + 'look/' + id + '/tirgger', false);
                console.log(response);
                return response;
            } catch (err) {
                throw err;
            }
        }

        //////////
        //Macros//
        //////////
        //get list of macros
        const macrosRequest = async () => {
            try {
                let response = await get(config.endpont + 'macros');
                console.log(response);
                return response;
            } catch (err) {
                throw err;
            }
        }

        //get macro by id
        const macroRequest = async (id) => {
            try {
                let response = await get(config.endpoint + 'macros/' + id);
                console.log(response);
                return response;
            } catch (err) {
                throw err;
            }
        }

        //set macro by id
        const macroSetRequest = async (id, body) => {
            try {
                let response = await put(config.endpoint + 'macros/' + id, 'JSON', body);
                console.log(response);
                return response;
            } catch (err) {
                throw err;
            }
        }

        //delete macro by id
        const macroDeleteRequest = async (id) => {
            try {
                let response = await del(config.endpoint + 'macros/' + id);
                console.log(response);
                return response;
            } catch (err) {
                throw err;
            }
        }

        //trigger macro by id
        //get macro by id
        const macroTriggerRequest = async (id) => {
            try {
                let response = await get(config.endpoint + 'macros/' + id + '/trigger');
                console.log(response);
                return response;
            } catch (err) {
                throw err;
            }
        }








        //----------------
        //////////////////
        //PUBLIC METHODS//
        //////////////////
        //----------------

        //Announcements//
        this.announcementActive = async () => {
            try {
                let response = await announcementActiveRequest();
                return response.data;
            } catch (err) {
                console.log(err);
            }
        }

        this.announcementSlideIndex = async () => {
            try {
                let response = await announcementSlideIndexRequest();
                return response.data;
            } catch (err) {
                console.log(err);
            }
        }

        this.announcementActiveFocus = async () => {
            try {
                let response = await announcementActiveFocusRequest();
                return 0;
            } catch (err) {
                console.log(err);
            }
        }

        this.announcementActiveRetrigger = async () => {
            try {
                let response = await announcementActiveRetriggerRequest();
                return 0;
            } catch (err) {
                console.log(err);
            }
        }

        this.announcementActiveTrigger = async (option = 'next') => {
            if (!isInt(option)) {
                if (option != 'next' && option != 'previous') { console.log("check option value"); return -1; }
            }

            try {

                let response = await announcementActiveTriggerRequest(option);
                return 0;
            } catch (err) {
                console.log(err);
            }
        }

        this.announcementActiveTimelineOperation = async (option = 'play') => {
            if (timeline.indexOf(option) == -1) { console.log("invalid option"); return -1; }

            try {
                let response = await announcementActiveTimelineOperationRequest(option);
                return 0;
            } catch (err) {
                console.log(err);
            }
        }

        this.announcementActiveTimeline = async () => {
            try {
                let response = await announcementActiveTimelineRequest();
                console.log(response); //check
                return response.data;
            } catch (err) {
                console.log(err);
            }
        }

        //Capture//
        this.captureEncodings = async (option = 'disk') => {
            if (CAPTURE_TYPES.indexOf(option) == -1) { console.log('check options'); return -1 }
            try {
                let response = await captureEncodingsRequest(option);
                console.log(response); //check
                return response.data;
            } catch (err) {
                console.log(err);
            }
        }

        this.captureOperation = async (option = 'start') => {
            if (capture.indexOf == -1) { console.log('check options'); return -1; }
            try {
                let response = await captureOperationRequest(option);
                console.log(response); //check
                return 0;
            } catch (err) {
                console.log(err);
            }
        }

        this.captureSettings = async () => {
            try {
                let response = await captureSettingsRequest();
                console.log(response); //check
                return response.data;
            } catch (err) {
                console.log(err);
            }
        }

        this.captureStatus = async () => {
            try {
                let response = await captureStatusRequest();
                console.log(response); //check
                return response.data;
            } catch (err) {
                console.log(err);
            }
        }

        //Trigger//
        this.trigger = async (option = 'next') => {
            if (TRIGGER.indexOf(option) == -1) { console.log('check option'); return -1 }
            try {
                let response = await triggerRequest(option);
                console.log(response); //check
                return 0;
            } catch (err) {
                console.log(err);
            }
        }

        this.triggerAudio = async (option = 'next') => {
            if (TRIGGER.indexOf(option) == -1) { console.log('check option'); return -1 }
            try {
                let response = await triggerAudioRequest(option);
                console.log(response); //check
                return 0;
            } catch (err) {
                console.log(err);
            }
        }

        this.triggerMedia = async (option = 'next') => {
            if (TRIGGER.indexOf(option) == -1) { console.log('check option'); return -1 }
            try {
                let response = await triggerMediaRequest(option);
                console.log(response); //check
                return 0;
            } catch (err) {
                console.log(err);
            }
        }

        //Video Input//
        this.videoInputs = async () => {
            try {
                let response = await videoInputsRequest();
                console.log(response); //check
                return response.data;
            } catch (err) {
                console.log(err);
            }
        }

        this.videoInputsTrigger = async (id) => {
            if (!id) { console.log('check id'); return -1; }
            try {
                let response = await videoInputsTriggerRequest(id);
                console.log(response);
                return 0;
            } catch (err) {
                console.log(err);
            }
        }

        //Masks//
        this.masks = async () => {
            try {
                let response = await masksRequest();
                console.log(response);
                return response.data;
            } catch (err) {
                console.log(err);
            }
        }

        this.mask = async (id) => {
            if (!id) { console.log('check id'); return -1; }
            try {
                let response = await maskRequest(id);
                console.log(response);
                return response.data;
            } catch (err) {
                console.log(err);
            }
        }

        this.maskThumbnail = async (id, quality = 400) => {
            if (!id) { console.log('check id'); return -1; }
            if (!isInt(quality)) { console.log('check quality var'); return -1; }
            try {
                let response = await maskThumbnailRequest(id, quality);
                console.log(response);
                return response.data;
            } catch (err) {
                console.log(err);
            }
        }

        //Audio//
        this.audioPlaylists = async () => {
            try {
                let response = await audioPlaylistsRequest();
                console.log(response);
                return response.data;
            } catch (err) {
                console.log(err);
            }
        }

        this.audioPlaylist = async (id) => {
            if (!id) { console.log('check id'); return -1; }
            try {
                let response = await audioPlaylistRequest(id);
                console.log(response);
                return response.data;
            } catch (err) {
                console.log(err);
            }
        }

        this.audioPlaylistFocused = async () => {
            try {
                let response = await audioPlaylistFocusedRequest();
                console.log(response);
                return response.data;
            } catch (err) {
                console.log(err);
            }
        }

        this.audioPlaylistActive = async () => {
            try {
                let response = await audioPlaylistActiveRequest();
                console.log(response);
                return response.data;
            } catch (err) {
                console.log(err);
            }
        }

        this.audioPlaylistFocus = async (option = 'active') => {
            try {
                let response = await audioPlaylistFocusRequest(option);
                console.log(response);
                return 0;
            } catch (err) {
                throw err
            }
        }

        this.audioPlaylistTrigger = async (option = 'active') => {
            try {
                let response = await audioPlaylistTriggerRequest(option);
                console.log(response);
                return 0;
            } catch (err) {
                console.log(err);
            }
        }

        this.audioPlaylistFocusedTrigger = async (option = 'next') => {
            try {
                let response = await audioPlaylistFocusedTriggerRequest(option);
                console.log(response);
                return 0;
            } catch (err) {
                console.log(err);
            }
        }

        this.audioPlaylistActiveTrigger = async (option = 'next') => {
            try {
                let response = await audioPlaylistActiveTriggerRequest(option);
                console.log(response);
                return 0;
            } catch (err) {
                console.log(err);
            }
        }

        this.audioPlaylistIdTrigger = async (id, option = 'next') => {
            if (!id) { console.log('check id'); return -1 }
            if (TRIGGER.indexOf(option) == -1) { console.log('check option'); return -1 }
            try {
                let response = await audioPlaylistIdTriggerRequest(id, option);
                console.log(response);
                return 0;
            } catch (err) {
                console.log(err.response);
            }
        }

        //Global Groups//
        this.groups = async () => {
            try {
                let response = await groupsRequest();
                console.log(response);
                return response.data;
            } catch (err) {
                throw err;
            }
        }

        //Misc//
        this.findMouse = async () => {
            try {
                let response = await findMouseRequest();
                console.log(response);
                return 0;
            } catch (err) {
                throw err;
            }
        }

        //Clear//
        this.clearGroups = async () => {
            try {
                let response = await clearGroupsRequest();
                console.log(response);
                return response.data;
            } catch (err) {
                throw err;
            }
        }

        this.clearLayer = async (layer) => {
            if (LAYERS.indexOf(layer) == -1) {
                let err = new Error('invalid layer');
                throw err;
            }

            try {
                let response = await clearLayerRequest(layer);
                console.log(response);
                return 0;
            } catch (error) {
                throw error;
            }
        }

        this.clearGroup = async (id) => {
            if (!id) {
                let err = new Error('invalid id');
                throw err;
            }

            try {
                let response = await clearGroupRequest(id);
                console.log(response);
                return response.data;
            } catch (error) {
                throw error;
            }
        }

        this.clearGroupSet = async (id, options = {}) => {
            if (!id) {
                let err = new Error('invalid id');
                throw err;
            }

            try {
                let response = await clearGroupSetRequest(id, options);
                console.log(response);
                return response.data;
            } catch (error) {
                throw error;
            }
        }

        this.clearGroupDelete = async (id) => {
            if (!id) {
                let err = new Error('invalid id');
                throw err;
            }

            try {
                let response = await clearGroupDeleteRequest(id);
                console.log(response);
                return 0;
            } catch (error) {
                throw error;
            }
        }

        this.clearGroupIcon = async (id) => {
            if (!id) {
                let err = new Error('invalid id');
                throw err;
            }

            try {
                let response = await clearGroupIconRequest(id);
                console.log(response);
                return response.data;
            } catch (error) {
                throw error;
            }
        }

        this.clearGroupIconSet = async (id, formData) => {
            // if(!id || !formData){ 
            //     let err = new Error('invalid id');
            //     throw err;
            // }

            try {
                let response = await clearGroupIconSetRequest(id, formData);
                console.log(response);
                return 0;
            } catch (error) {
                throw error;
            }
        }

        this.clearGroupTrigger = async (id) => {
            if (!id) {
                let err = new Error('invalid id');
                throw err;
            }

            try {
                let response = await clearGroupTriggerRequest(id);
                console.log(response);
                return 0;
            } catch (error) {
                throw error;
            }
        }

        this.clearGroupsCreate = async (body = {}) => {
            try {
                let response = await clearGroupsCreateRequest(body);
                console.log(response);
                return response.data;
            } catch (error) {
                throw error;
            }
        }

        //Library
        this.libraries = async () => {
            try {
                let response = await librariesRequest();
                console.log(response);
                return response.data;
            } catch (error) {
                throw error;
            }
        }

        this.library = async (id) => {
            if (typeof id === 'undefined' || id === null) {
                let err = new Error('invalid id');
                throw err;
            }

            try {
                let response = await libraryRequest(id);
                console.log(response);
                return response.data;
            } catch (error) {
                throw error;
            }
        }

        this.libraryTrigger = async (library_id, presentation_id, index) => {
            if (typeof library_id === 'undefined' || library_id === null) {
                let err = new Error('invalid library_id');
                throw err;
            }

            if (typeof presentation_id === 'undefined' || presentation_id === null) {
                let err = new Error('invalid library_id');
                throw err;
            }

            try {
                let response = await libraryTriggerRequest(library_id, presentation_id, index);
                console.log(response);
                return 0;
            } catch (error) {
                throw error;
            }
        }

        //Looks
        this.looks = async () => {
            try {
                let response = await looksRequest();
                console.log(response);
                return response.data;
            } catch (error) {
                throw error;
            }
        }

        this.looksCreate = async (options) => {
            if (typeof options === 'undefined' || options === null) {
                let err = new Error('invalid options');
                throw err;
            }

            try {
                let response = await looksCreateRequest(options);
                console.log(response);
                return response.data;
            } catch (error) {
                throw error;
            }
        }

        this.lookCurrent = async () => {
            try {
                let response = await lookCurrentRequest();
                console.log(response);
                return response.data;
            } catch (error) {
                throw error;
            }
        }

        this.lookCurrentSet = async (options) => {
            if (typeof options === 'undefined' || options === null) {
                let err = new Error('invalid options');
                throw err;
            }

            try {
                let response = await lookCurrentSetRequest(options);
                console.log(response);
                return response.data;
            } catch (error) {
                throw error;
            }
        }

        this.lookSet = async (id, options) => {
            if (typeof id === 'undefined' || id === null) {
                let err = new Error('invalid id');
                throw err;
            }

            if (typeof options === 'undefined' || options === null) {
                let err = new Error('invalid id');
                throw err;
            }

            try {
                let response = await lookSetRequest(id, options);
                console.log(response);
                return response.data;
            } catch (error) {
                throw error;
            }

        }

        this.look = async (id) => {
            if (typeof id === 'undefined' || id === null) {
                let err = new Error('invalid id');
                throw err;
            }

            try {
                let response = await look(id);
                console.log(response);
                return response.data;
            } catch (error) {
                throw error;
            }
        }

        this.lookDelete = async (id) => {
            if (typeof id === 'undefined' || id === null) {
                let err = new Error('invalid id');
                throw err;
            }

            try {
                let repsonse = await lookDeleteRequest(id);
                console.log(response);
                return 0;
            } catch (error) {
                throw error;
            }
        }

        this.lookTrigger = async (id) => {
            if (typeof id === 'undefined' || id === null) {
                let err = new Error('invalid id');
                throw err;
            }

            try {
                let repsonse = await lookTriggerRequest(id);
                console.log(response);
                return 0;
            } catch (error) {
                throw error;
            }
        }

        //Macros

        this.macros = async () => {
            try {
                let response = await macrosRequest();
                console.log(response);
                return response.data;
            } catch (error) {
                throw error;
            }
        }

        this.macro = {
            get: async (id) => {
                if (typeof id === 'undefined' || id === null) {
                    let err = new Error('invalid id');
                    throw err;
                }

                try {
                    let response = await macroRequest(id);
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
                    let err = new Error('invalid id');
                    throw err;
                }

                try {
                    let response = await macroSetRequest(id, options);
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
                    let response = await macroDeleteRequest(id);
                    console.log(response);
                    return 0;
                } catch (error) {
                    throw error;
                }
            },

            trigger: async (id) => {
                if (typeof id === 'undefined' || id === null) {
                    let err = new Error('invalid id');
                    throw err;
                }

                try {
                    let response = await macroTriggerRequest(id);
                    console.log(response);
                    return 0;
                } catch (error) {
                    throw error;
                }
            }
        }




    };
    //end constructor

    //public static methods

    return constructor;
}();

export default PP7;