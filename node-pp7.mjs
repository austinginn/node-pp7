//PP7 API Node Module
import { fetch } from 'undici';
import { TextDecoderStream } from 'node:stream/web';


const PP7 = function () {
    //private vars

    //Possible layer types
    const layers = ['audio', 'props', 'messages', 'announcements', 'slide', 'media', 'video_input'];

    //Possible timeline operations
    const timeline = ['play', 'pause', 'rewind'];

    //Possible capture operations
    const capture = ['start', 'stop'];
    
    //possible capture types
    const CAPTURE_TYPES = ['disk', 'rtmp', 'resi'];

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
        const get = async (url, parse = true, headers = { 'Content-Type': 'application/json' }) => {
            try {
                const response = await fetch(url, {
                    headers: headers
                });

                const status = checkStatus(await response.status); //always will be a status

                let data = {};
                if (parse) { data = await response.json(); } //not always

                return { status: status, data: data };
            } catch (error) {
                console.log(error);
            }
        }

        // //Fetch POST request wrapper and error handling
        // const post = async url => {
        //     try {
        //         //this will be different for post
        //         const response = await fetch(url);
        //         const status = checkStatus(await response.status());
        //         const data = await response.json();
        //         //debug
        //         console.log(status);
        //         console.log(data);
        //         //
        //         return data;
        //     } catch (error) {
        //         console.log(error);
        //     }
        // }

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
        const triggerRequest = async (option = 'next') => {
            try {
                let response = await get(config.endpoint + 'trigger/' + option, false);
                console.log(response); //check
            } catch (err) {
                console.log(err);
            }
        }

        //media trigger
        const triggerMediaRequest = async (option = 'next') => {
            try {
                let response = await get(config.endpoint + 'trigger/media/' + option, false);
                console.log(response); //check
            } catch (err) {
                console.log(err);
            }
        }

        //audio trigger
        const triggerAudioRequest = async (option = 'next') => {
            try {
                let response = await get(config.endpoint + 'trigger/audio/' + option, false);
                console.log(response); //check
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
                let response = await get(config.endpoint + 'mask/' + id + '/thumbnail?quality=' + quality, { 'Content-Type': 'image/jpeg' });
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
        //clear the specified layer
        const clearLayerRequest = async (option) => {
            try {
                let response = await get(config.endpoint + 'clear/layer/' + option);
                console.log(response); //check
                return response;
            } catch (err) {
                console.log(err);
            }
        }


        //clear the specified clear group
        const clearGroupRequest = async (id) => {
            try {
                let response = await get(config.endpoint + 'clear/group/' + id);
                console.log(response); //check
                return response;
            } catch (err) {
                console.log(err);
            }
        }

        //set the details of the specified clear group
        const clearGroupSetRequest = async (id, options) => {
            try {
                let response = await put(config.endpoint + 'clear/group/' + id, options);
                console.log(response); //check
                return response;
            } catch (err) {
                console.log(err);
            }
        }

        //delete the specified clear group
        const clearGroupDeleteRequest = async (id) => {
            try {
                let response = await del(config.endpoint + 'clear/group/' + id);
                console.log(response); //check
                return response;
            } catch (err) {
                console.log(err);
            }
        }

        //////////////////
        //PUBLIC METHODS//
        //////////////////

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

        this.captureEncodings = async (option = 'disk') => {
            if(CAPTURE_TYPES.indexOf(option) == -1){ console.log('check options'); return -1}
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


    };
    //end constructor

    //public static methods

    return constructor;
}();

export default PP7;