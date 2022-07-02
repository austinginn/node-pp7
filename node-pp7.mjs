//PP7 API Node Module
import { fetch } from 'undici';
import { TextDecoderStream } from 'node:stream/web';
import { EventEmitter } from "events";


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
        let eventEmitter = new EventEmitter();

        const updateHandler = async (chunk) => {
            // console.log(JSON.stringify(chunk));
            console.log("New Chunk");
            let arr = chunk.split('\r\n\r\n');
            arr.pop();
            for(let i = 0; i < arr.length; i++){
                // console.log(arr[i]);
                arr[i] = JSON.parse(arr[i]);
                // console.log(arr[i].url);
                // console.log("*");
                eventEmitter.emit(arr[i].url, arr[i].data);
            }
        }

        // //status testing
        // const statusTesting = async () => {
        //     let body = [
        //         // "announcement/active/timeline",
        //         "capture/status",
        //         "look/current",
        //         "media/playlists",
        //         "media/playlist/active",
        //         "media/playlist/focused",
        //         "messages",
        //         "playlist/active",
        //         "presentation/current",
        //         "presentation/slide_index",
        //         // "presentation/active/timeline",
        //         "presentation/focused/timeline",
        //         "stage/message",
        //         "status/layers",
        //         "status/stage_screens",
        //         "status/audience_screens",
        //         "status/screens",
        //         "status/slide",
        //         "timers",
        //         "timers/current",
        //         "timer/system_time",
        //         "timer/video_countdown",
        //     ]
        //     const response = await fetch(config.endpoint + "status/updates", {
        //         method: 'POST',
        //         headers: { 'Content-Type': 'application/json' },
        //         body: JSON.stringify(body)
        //     });

        //     const stream = response.body;
        //     const textStream = stream.pipeThrough(new TextDecoderStream());
        //     for await (const chunk of textStream) {

        //         // console.log(chunk);
        //         // console.log("next");
        //         //pass chunk to for event handling
        //         updateHandler(chunk);
        //     }
        // }

        // statusTesting();



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

        /////////
        //Media//
        /////////
        //get all configured media playlists
        const mediaPlaylistsRequest = async () => {
            try {
                let response = await get(config.endpoint + 'media/playlists');
                console.log(response);
                return response;
            } catch (err) {
                throw err;
            }
        }

        const mediaPlaylistIdRequest = async (id) => {
            try {
                let response = await get(config.endpoint + 'media/playlist/' + id);
                console.log(response);
                return response;
            } catch (err) {
                throw err;
            }
        }

        const mediaThumbnailRequest = async (id, quality) => {
            try {
                let response = await get(config.endpoint + 'media/' + id + '/thumbnail?quality=' + quality, 'image', { 'Content-Type': 'image/jpeg' });
                console.log(response);
                return response;
            } catch (err) {
                throw err;
            }
        }

        const mediaPlaylistFocusedRequest = async () => {
            try {
                let response = await get(config.endpoint + 'media/playlist/focused');
                console.log(response);
                return response;
            } catch (err) {
                throw err;
            }
        }

        const mediaPlaylistActiveRequest = async () => {
            try {
                let response = await get(config.endpoint + 'media/playlist/active');
                console.log(response);
                return response;
            } catch (err) {
                throw err;
            }
        }

        //sets the media playlist focus
        const mediaPlaylistFocusRequest = async (option) => {
            try {
                let response = await get(config.endpoint + 'media/playlist/' + option + '/focus');
                console.log(response);
                return response;
            } catch (err) {
                throw err;
            }
        }

        //trigger first item in playlist
        const mediaPlaylistTriggerRequest = async (option) => {
            try {
                let response = await get(config.endpoint + 'media/playlist/' + option + '/trigger');
                console.log(response);
                return response;
            } catch (err) {
                throw err;
            }
        }

        //trigger items in focused playlist
        const mediaPlaylistFocusedTriggerRequest = async (option) => {
            try {
                let response = await get(config.endpoint + 'media/playlist/focused/' + option + '/trigger');
                console.log(response);
                return response;
            } catch (err) {
                throw err;
            }
        }

        //trigger items in active playlist
        const mediaPlaylistActiveTriggerRequest = async (option) => {
            try {
                let response = await get(config.endpoint + 'media/playlist/active/' + option + '/trigger');
                console.log(response);
                return response;
            } catch (err) {
                throw err;
            }
        }

        //trigger items in specified playlist
        const mediaPlaylistIdTriggerRequest = async (id, option) => {
            try {
                let response = await get(config.endpoint + 'media/playlist/' + id + '/' + option + '/trigger');
                console.log(response);
                return response;
            } catch (err) {
                throw err;
            }
        }
        ///////////
        //Message//
        ///////////
        //get all configured messages
        const messagesRequest = async () => {
            try {
                let response = await get(config.endpoint + 'messages');
                console.log(response);
                return response;
            } catch (err) {
                throw err;
            }
        }

        //create a new message
        const messagesCreateRequest = async (body) => {
            try {
                let response = await post(config.endpoint + 'messages', 'JSON', body);
                console.log(response);
                return response;
            } catch (err) {
                throw err;
            }
        }

        const messageRequest = async (id) => {
            try {
                let response = await get(config.endpoint + 'message/' + id);
                console.log(response);
                return response;
            } catch (err) {
                throw err;
            }
        }

        const messageSetRequest = async (id, body) => {
            async (id, body) => {
                try {
                    let response = await put(config.endpoint + 'message/' + id, 'JSON', body);
                    console.log(response);
                    return response;
                } catch (err) {
                    throw err;
                }
            }
        }

        const messageDeleteRequest = async (id) => {
            try {
                let response = await del(config.endpoint + 'message/' + id);
                console.log(response);
                return response;
            } catch (err) {
                throw err;
            }
        }

        const messageTriggerRequest = async (id, body) => {
            try {
                let response = await post(config.endpoint + 'message/' + id + '/trigger', 'JSON', body);
                console.log(response);
                return response;
            } catch (err) {
                throw err;
            }
        }


        const messageClearRequest = async (id) => {
            try {
                let response = await get(config.endpoint + 'message/' + id + '/clear', false);
                console.log(response);
                return response;
            } catch (err) {
                throw err;
            }
        }

        const playlistsRequest = async () => {
            try {
                let response = await get(config.endpoint + 'playlists');
                console.log(response);
                return response;
            } catch (err) {
                throw err;
            }
        }

        const playlistsCreateRequest = async (body) => {
            try {
                let response = await post(config.endpoint + 'playlists', 'JSON', body);
                console.log(response);
                return response;
            } catch (err) {
                throw err;
            }
        }

        const playlistRequest = async (id) => {
            try {
                let response = await get(config.endpoint + 'playlists/' + id);
                console.log(response);
                return response;
            } catch (err) {
                throw err;
            }
        }

        const playlistSetRequest = async (id, body) => {
            try {
                let response = await put(config.endpoint + 'playlist/' + id, 'JSON', body);
                console.log(response);
                return response;
            } catch (err) {
                throw err;
            }
        }

        const playlistCreateRequest = async (id, body) => {
            try {
                let response = await post(config.endpoint + 'playlist/' + id, 'JSON', body);
                console.log(response);
                return response;
            } catch (err) {
                throw err;
            }
        }

        const playlistActiveRequest = async () => {
            try {
                let response = await get(config.endpoint + 'playlist/active');
                console.log(response);
                return response;
            } catch (err) {
                throw err;
            }
        }

        const playlistFocusedRequest = async () => {
            try {
                let response = await get(config.endpoint + 'playlist/focused');
                console.log(response);
                return response;
            } catch (err) {
                throw err;
            }
        }

        const playlistFocusRequest = async (option) => {
            try {
                let response = await get(config.endpoint + 'playlist/' + option + '/focus');
                console.log(response);
                return response;
            } catch (err) {
                throw err;
            }
        }

        const playlistActiveFocusRequest = async (option) => {
            try {
                let response = await get(config.endpoint + 'playlist/active/' + option + '/focus');
                console.log(response);
                return response;
            } catch (err) {
                throw err;
            }
        }

        const playlistFocusedTriggerFirstRequest = async (option) => {
            try {
                let response = await get(config.endpoint + 'playlist/focused/trigger');
                console.log(response);
                return response;
            } catch (err) {
                throw err;
            }
        }

        const playlistActiveTriggerRequest = async (option) => {
            try {
                let response = await get(config.endpoint + 'playlist/active/' + option + '/trigger');
                console.log(response);
                return response;
            } catch (err) {
                throw err;
            }
        }

        const playlistFocusedTriggerRequest = async (option) => {
            try {
                let response = await get(config.endpoint + 'playlist/focused/' + option + '/trigger');
                console.log(response);
                return response;
            } catch (err) {
                throw err;
            }
        }

        const playlistIdFocusRequest = async (id) => {
            try {
                let response = await get(config.endpoint + 'playlist/' + id + '/focus');
                console.log(response);
                return response;
            } catch (err) {
                throw err;
            }
        }

        const playlistIdTriggerRequest = async (id) => {
            try {
                let response = await get(config.endpoint + 'playlist/' + id + '/trigger');
                console.log(response);
                return response;
            } catch (err) {
                throw err;
            }
        }

        const playlistIdTriggerItemRequest = async (id, option) => {
            try {
                let response = await get(config.endpoint + 'playlist/' + id + '/' + option + '/trigger');
                console.log(response);
                return response;
            } catch (err) {
                throw err;
            }
        }

        const playlistFocusedIdTriggerRequest = async (id) => {
            try {
                let response = await get(config.endpoint + 'playlist/' + id + '/' + option + '/trigger');
                console.log(response);
                return response;
            } catch (err) {
                throw err;
            }
        }

        const playlistActivePresentationIdTriggerRequest = async (id) => {
            try {
                let response = await get(config.endpoint + 'playlist/active/presentation/' + id + '/trigger');
                console.log(response);
                return response;
            } catch (err) {
                throw err;
            }
        }

        const playlistActiveAnnouncementIdTriggerRequest = async (id) => {
            try {
                let response = await get(`${config.endpoint}playlist/active/announcement/${id}/trigger`);
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
        this.annoucement = {
            /**
             * Gets the currently active annoucement presentation
             * @returns {object}
             */
            get: async () => {
                try {
                    let response = await announcementActiveRequest();
                    return response.data;
                } catch (err) {
                    console.log(err);
                }
            },

            /**
             * Gets the index of the current slide/cue within the currently active announcement
             * @returns {object}
             */
            index: async () => {
                try {
                    let response = await announcementSlideIndexRequest();
                    return response.data;
                } catch (err) {
                    console.log(err);
                }
            },

            /**
             * Focuses the currently active announcement presentation
             * @returns 
             */
            focus: async () => {
                try {
                    let response = await announcementActiveFocusRequest();
                    return 0;
                } catch (err) {
                    console.log(err);
                }
            },

            /**
             * Retriggers the currently active announcement presentation (starts from the beginning).
             * @returns 
             */
            retrigger: async () => {
                try {
                    let response = await announcementActiveRetriggerRequest();
                    return 0;
                } catch (err) {
                    console.log(err);
                }
            },

            /**
             * Triggers cue in the active announcement presentation based on option
             * @param {string} option - next, previous, or index
             * @returns {int} 
             */
            trigger: async (option = 'next') => {
                if (!isInt(option)) {
                    if (option != 'next' && option != 'previous') { console.log("check option value"); return -1; }
                }

                try {

                    let response = await announcementActiveTriggerRequest(option);
                    return 0;
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
                 * @returns {object}
                 */
                status: async () => {
                    try {
                        let response = await announcementActiveTimelineRequest();
                        console.log(response); //check
                        return response.data;
                    } catch (err) {
                        console.log(err);
                    }
                },

                /**
                 * Performs the requested timeline operation for the active announcement presentation
                 * @param {string} option - play, pause, rewind
                 * @returns {int}
                 */
                transport: async (option = 'play') => {
                    if (timeline.indexOf(option) == -1) { console.log("invalid option"); return -1; }

                    try {
                        let response = await announcementActiveTimelineOperationRequest(option);
                        return 0;
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
             * @param {string} option - capture types (disk, rtmp, resi)
             * @returns {object}
             */
            encodings: async (option = 'disk') => {
                if (CAPTURE_TYPES.indexOf(option) == -1) { console.log('check options'); return -1 }
                try {
                    let response = await captureEncodingsRequest(option);
                    console.log(response); //check
                    return response.data;
                } catch (err) {
                    console.log(err);
                }
            },

            /**
             * Performs the requested capture operation
             * @param {string} option - The capture operation to perform (start, stop)
             * @returns 
             */
            operation: async (option = 'start') => {
                if (capture.indexOf == -1) { console.log('check options'); return -1; }
                try {
                    let response = await captureOperationRequest(option);
                    console.log(response); //check
                    return 0;
                } catch (err) {
                    console.log(err);
                }
            },

            /**
             * Gets the currrent capture settings
             * @returns 
             */
            settings: async () => {
                try {
                    let response = await captureSettingsRequest();
                    console.log(response); //check
                    return response.data;
                } catch (err) {
                    console.log(err);
                }
            },

            /**
             * Gets the current capture status and capture time
             * @returns 
             */
            status: async () => {
                try {
                    let response = await captureStatusRequest();
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
         * @param {string} option - next or previous
         * @returns 
         */
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

        /**
         * Triggers the next or previous item in the currently active audio playlist
         * @param {string} option - next or previous
         * @returns 
         */
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

        /**
         * Triggers the next or previous item in the currently active media playlist
         * @param {string} option - next or previous
         * @returns 
         */
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

        /**
         * Video input methods
         */
        //Video Input//
        this.videoInputs = {
            /**
             * Gets the contents of the video inputs playlist
             * @returns 
             */
            get: async () => {
                try {
                    let response = await videoInputsRequest();
                    console.log(response); //check
                    return response.data;
                } catch (err) {
                    console.log(err);
                }
            },

            /**
             * Triggers specified video input from the video inputs playlist
             * @param {string} id - the UUID of the video input (will take url encoded name or index as well)
             * @returns 
             */
            trigger: async (id) => {
                if (!id) { console.log('check id'); return -1; }
                try {
                    let response = await videoInputsTriggerRequest(id);
                    console.log(response);
                    return 0;
                } catch (err) {
                    console.log(err);
                }
            }
        }

        //Masks//
        /**
         * Gets a list of all configured masks
         * @returns 
         */
        this.masks = async () => {
            try {
                let response = await masksRequest();
                console.log(response);
                return response.data;
            } catch (err) {
                console.log(err);
            }
        }

        /**
         * Gets the details of the specified mask
         * @param {string} id - The UUID of the mask (will take url encoded name or index as well) 
         * @returns 
         */
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

        /**
         * Gets a thumbnail image of the specified mask at the given quality value
         * @param {string} id - The UUID of the mask (will take url encoded name or index as well)
         * @param {int} quality - The desired quality of the thumbnail. The value is the number of pixels in the largest dimension of the image.
         * @returns 
         */
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
        /**
         * Audio playlist methods
         */
        this.audioPlaylist = {
            /**
             * Gets a list of all the audio items in the specified audio playlist
             * @param {string} id - The UUID of the audo playlist id (will take url encoded name or index as well)
             * @returns 
             */
            get: async (id) => {
                if (!id) { console.log('check id'); return -1; }
                try {
                    let response = await audioPlaylistRequest(id);
                    console.log(response);
                    return response.data;
                } catch (err) {
                    console.log(err);
                }
            },

            /**
             * Gets the currently focused audio playlist
             * @returns 
             */
            focused: async () => {
                try {
                    let response = await audioPlaylistFocusedRequest();
                    console.log(response);
                    return response.data;
                } catch (err) {
                    console.log(err);
                }
            },

            /**
             * Gets the currently active audio playlist
             * @returns 
             */
            active: async () => {
                try {
                    let response = await audioPlaylistActiveRequest();
                    console.log(response);
                    return response.data;
                } catch (err) {
                    console.log(err);
                }
            },

            /**
             * Focuses either the active, next, previous or specified audio playlist
             * @param {string} option - active, next, previous or id
             * @returns 
             */
            focus: async (option = 'active') => {
                try {
                    let response = await audioPlaylistFocusRequest(option);
                    console.log(response);
                    return 0;
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
                 * @param {string} option - focused, active, or playlist_id
                 * @returns 
                 */
                playlist: async (option = 'active') => {
                    try {
                        let response = await audioPlaylistTriggerRequest(option);
                        console.log(response);
                        return 0;
                    } catch (err) {
                        console.log(err);
                    }
                },

                /**
                 * Triggers the next, previous or specified item in the focused audio playlist
                 * @param {string} option - next, previous or id
                 * @returns 
                 */
                focused: async (option = 'next') => {
                    try {
                        let response = await audioPlaylistFocusedTriggerRequest(option);
                        console.log(response);
                        return 0;
                    } catch (err) {
                        console.log(err);
                    }
                },

                /**
                 * Triggers the next, previous or specified item in the active audio playlist
                 * @param {string} option -  next, previous or id
                 * @returns 
                 */
                active: async (option = 'next') => {
                    try {
                        let response = await audioPlaylistActiveTriggerRequest(option);
                        console.log(response);
                        return 0;
                    } catch (err) {
                        console.log(err);
                    }
                },

                /**
                 * Triggers the next or previous of item of the specified audio playlist
                 * @param {string} id - The UUID of the specified audio playlist
                 * @param {string} option - next or previous
                 * @returns 
                 */
                byId: async (id, option = 'next') => {
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
            }
        }

        /**
         * Gets a list of all the configured audio playlists
         * @returns 
         */
        this.audioPlaylists = async () => {
            try {
                let response = await audioPlaylistsRequest();
                console.log(response);
                return response.data;
            } catch (err) {
                console.log(err);
            }
        }

        //Global Groups//
        /**
         * Gets a list of all the configured global groups
         * @returns 
         */
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
        /**
         * Executes the "Find My Mouse" operation on the connected ProPresenter instance
         * @returns 
         */
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
                        let response = await clearGroupsRequest();
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
                        let response = await clearGroupsCreateRequest(body);
                        console.log(response);
                        return response.data;
                    } catch (error) {
                        throw error;
                    }
                }
            },

            /**
             * Clears the specified layer
             * @param {string} layer - The name of the layer that is to be cleared: audio, props, messages, announcements, slide, media or video_input
             * @returns 
             */
            layer: async (layer) => {
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
            },

            /**
             * Clear Group methods
             */
            group: {
                /**
                 * Gets the details of the specified clear group
                 * @param {string} id - the UUID of the clear group (will also accept url encoded name or index)
                 * @returns 
                 */
                get: async (id) => {
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
                },

                /**
                 * Sets the details of the specified clear group
                 * @param {string} id - the UUID of the clear group (will also accept url encoded name or index)
                 * @param {*} options 
                 * @returns 
                 */
                set: async (id, options = {}) => {
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
                },

                /**
                 * Deletes the specified clear group
                 * @param {string} id - the UUID of the clear group (will also accept url encoded name or index)
                 * @returns 
                 */
                delete: async (id) => {
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
                },

                /**
                 * Triggers the specified clear group
                 * @param {string} id - the UUID of the clear group (will also accept url encoded name or index)
                 * @returns 
                 */
                trigger: async (id) => {
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
                },

                /**
                 * Clear group icon methods
                 */
                icon: {
                    /**
                     * Gets the image data for the icon of the specified clear group
                     * @param {string} id - the UUID of the clear group (will also accept url encoded name or index)
                     * @returns 
                     */
                    get: async (id) => {
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
                            let response = await clearGroupIconSetRequest(id, formData);
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
        this.libraries = async () => {
            try {
                let response = await librariesRequest();
                console.log(response);
                return response.data;
            } catch (error) {
                throw error;
            }
        }

        this.library = {
            get: async (id) => {
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
            },

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
                    let response = await libraryTriggerRequest(library_id, presentation_id, index);
                    console.log(response);
                    return 0;
                } catch (error) {
                    throw error;
                }
            }
        }

        //Looks
        this.looks = {
            get: async () => {
                try {
                    let response = await looksRequest();
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
                    let response = await looksCreateRequest(options);
                    console.log(response);
                    return response.data;
                } catch (error) {
                    throw error;
                }
            }
        }

        this.look = {
            current: {
                get: async () => {
                    try {
                        let response = await lookCurrentRequest();
                        console.log(response);
                        return response.data;
                    } catch (error) {
                        throw error;
                    }
                },
                set: async (options) => {
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
            },

            get: async (id) => {
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
                    let response = await lookSetRequest(id, options);
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
                    let repsonse = await lookDeleteRequest(id);
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
                    let repsonse = await lookTriggerRequest(id);
                    console.log(response);
                    return 0;
                } catch (error) {
                    throw error;
                }
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

        //media
        this.mediaThumbnail = async (id, quality = 400) => {
            if (typeof id === 'undefined' || id === null) {
                let err = new Error('invalid id');
                throw err;
            }

            try {
                let response = await mediaThumbnailRequest(id, quality);
                console.log(response);
                return response.data;
            } catch (error) {
                throw error;
            }
        }

        this.mediaPlaylists = async () => {
            try {
                let response = await mediaPlaylistRequest();
                console.log(response);
                return response.data;
            } catch (error) {
                throw error;
            }
        }

        this.mediaPlaylist = {
            get: async (id) => {
                if (typeof id === 'undefined' || id === null) {
                    let err = new Error('invalid id');
                    throw err;
                }

                try {
                    let response = await mediaPlaylistIdRequest(id);
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
                        response = await mediaPlaylistFocusedRequest(id);
                    }

                    if (option == 'active') {
                        response = await mediaPlaylistActiveRequest(id);
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

                        response = await mediaPlaylistFocusRequest(id);
                    } else {
                        response = await mediaPlaylistFocusRequest(option);
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
                        response = await mediaPlaylistTriggerRequest(id);
                    } else {
                        response = await mediaPlaylistTriggerRequest(option);
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
                            response = await mediaPlaylistFocusedTriggerRequest(id);
                        } else {
                            response = await mediaPlaylistFocusedTriggerRequest(option);
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
                            response = await mediaPlaylistActiveTriggerRequest(id);
                        } else {
                            response = await mediaPlaylistActiveTriggerRequest(option);
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
                            response = await mediaPlaylistIdTriggerRequest(id, media_id);
                        } else {
                            response = await mediaPlaylistIdTriggerRequest(id, option);
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
            get: async () => {
                try {
                    let response = await messagesRequest();
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
                    let response = await messagesCreateRequest(options);
                    console.log(response);
                    return response.data;
                } catch (error) {
                    throw error;
                }
            }
        }

        this.message = {
            get: async (id) => {
                if (typeof id === 'undefined' || id === null) {
                    let err = new Error('invalid id');
                    throw err;
                }
                try {
                    let response = await messageRequest(id);
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
                    let response = await messageSetRequest(id, options);
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
                    let response = await messageDeleteRequest(id);
                    console.log(response);
                    return 0;
                } catch (error) {
                    throw error;
                }
            },

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
                    let response = await messageTriggerRequest(id, options);
                    console.log(response);
                    return response.data;
                } catch (error) {
                    throw error;
                }
            },

            clear: async (id) => {
                if (typeof id === 'undefined' || id === null) {
                    let err = new Error('invalid id');
                    throw err;
                }

                try {
                    let response = await messageClearRequest(id);
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
                    let response = await playlistsRequest();
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
                    let response = await playlistsCreateRequest(options);
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
                    let response = await playlistRequest(id);
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
                    let response = await playlistSetRequest(id, options);
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
                    let response = await playlistCreateRequest(id, options);
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
                        response = await playlistActiveRequest();
                    }

                    if (option == 'focused') {
                        response = await playlistFocusedReques();
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
                    let response = await playlistFocusRequest(option);
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
                        let response = await playlistActiveFocusRequest();
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
                                response = await playlistActiveAnnouncementIdTriggerRequest(index);
                            } else {
                                response = await playlistActivePresentationIdTriggerRequest(index);
                            }

                        } else {
                            response = await playlistActiveTriggerRequest(option);
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
                            response = await playlistFocusedTriggerRequest(option);
                        } else if (option == 'index') {
                            if (typeof index === 'undefined' || index === null) {
                                let err = new Error('invalid index');
                                throw err;
                            }
                            response = await playlistFocusedIdTriggerRequest(index);
                        } else {
                            response = await playlistFocusedTriggerFirstRequest();
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
                            response = await playlistIdTriggerItemRequest(id, option);
                        } else if (option == 'index') {
                            if (typeof index === 'undefined' || index === null) {
                                let err = new Error('invalid index');
                                throw err;
                            }
                            response = await playlistIdTriggerItemRequest(id, index);
                        } else {
                            response = await playlistIdTriggerRequest();
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

            delete: async (id) => {
                if (typeof id === 'undefined' || id === null) {
                    let err = new Error('invalid id');
                    throw err;
                }

                try {
                    let response = await del(config.endpoint + 'prop/' + id);
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
                    let response = await get(config.endpoint + 'prop/' + id + '/trigger');
                    console.log(response);
                    return 0;
                } catch (error) {
                    throw error;
                }
            },

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
        },
        this.on = (event, callback) => {
            eventEmitter.on(event, (data) => {
                callback(data);
            });
        },

        this.status = async (events) => {
            const response = await fetch(config.endpoint + "status/updates", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(events)
            });

            const stream = response.body;
            const textStream = stream.pipeThrough(new TextDecoderStream());
            for await (const chunk of textStream) {

                // console.log(chunk);
                // console.log("next");
                //pass chunk to for event handling
                updateHandler(chunk);
            }
        }
    };//end constructor

    //public static methods

    return constructor;
}();

export default PP7;