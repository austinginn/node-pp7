//PP7 API Node Module
import { fetch } from 'undici';
import { TextDecoderStream } from 'node:stream/web';


const PP7 = function() {
    //private vars
    let config = {
        version: 'v1'
    }

    let pp7_data = {

    }

    ///////////////
    //CONSTRUCTOR//
    ///////////////
    var constructor = function pp7(protocol = 'http', ip = '127.0.0.1', port = 1025) {

        config.protocol = protocol;
        config.ip = ip;
        config.port = port;

        config.endpoint = protocol + '://' + ip + ":" + port + '/' + config.version + '/';


        console.log(config); //check

        ///////////////////
        //PRIVATE METHODS//
        ///////////////////
        //Fetch GET request wrapper and error handling
        const get = async (url, headers = { 'Content-Type': 'application/json' }) => {
            try {
                const response = await fetch(url, {
                    headers: headers
                });
                const status = checkStatus(await response.status);
                const data = await response.json();
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

        ////////////
        //Triggers//
        ////////////
        //general trigger for presentations/playlists
        const triggerRequest = async (option = 'next') => {
            try {
                let response = await get(endpoint + 'trigger/' + option);
                console.log(response); //check
            } catch (err) {
                console.log(err);
            }
        }

        //media trigger
        const triggerMediaRequest = async (option = 'next') => {
            try {
                let response = await get(endpoint + 'trigger/media/' + option);
                console.log(response); //check
            } catch (err) {
                console.log(err);
            }
        }

        //audio trigger
        const triggerAudioRequest = async (option = 'next') => {
            try {
                let response = await get(endpoint + 'trigger/audio/' + option);
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
                let response = await get(endpoint + 'video_inputs');
                console.log(response); //check
                return response;
            } catch (err) {
                console.log(err);
            }
        }

        //video input trigger
        const videoInputsTriggerRequest = async (id) => {
            try {
                let response = await get(endpoint + 'video_inputs/' + id + '/trigger');
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
                let response = await get(endpoint + 'masks');
                console.log(response); //check
                return response;
            } catch (err) {
                console.log(err);
            }
        }

        //get details of specific mask
        const maskRequest = async (id) => {
            try {
                let response = await get(endpoint + 'mask/' + id);
                console.log(response); //check
                return response;
            } catch (err) {
                console.log(err);
            }
        }

        //get mask thumbnail
        const maskThumbnailRequest = async (id, quality) => {
            try {
                let response = await get(endpoint + 'mask/' + id + '/thumbnail?quality=' + quality, { 'Content-Type': 'image/jpeg' });
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
                let response = await get(endpoint + 'announcement/active');
                console.log(response); //check
                return response;
            } catch (err) {
                console.log(err);
            }
        }

        //get the index of the current slide/cue
        const announcementSlideIndexRequest = async () => {
            try {
                let response = await get(endpoint + 'announcement/slide_index');
                console.log(response); //check
                return response;
            } catch (err) {
                console.log(err);
            }
        }

        //focus the current active announcement presentation
        const announcementActiveFocusRequest = async () => {
            try {
                let response = await get(endpoint + 'announcement/active/focus');
                console.log(response); //check
                return response;
            } catch (err) {
                console.log(err);
            }
        }

        //retrigger the current active announcement presentation
        const announcementActiveRetriggerRequest = async () => {
            try {
                let response = await get(endpoint + 'announcement/active/trigger');
                console.log(response); //check
                return response;
            } catch (err) {
                console.log(err);
            }
        }

        //trigger the next cue in the active announcement presentation
        const announcementActiveTriggerRequest = async (option) => {
            try {
                let response = await get(endpoint + 'announcement/active/' + option + '/trigger');
                console.log(response); //check
                return response;
            } catch (err) {
                console.log(err);
            }
        }

        //timeline opperation for the active announcment presentation
        const announcementActiveTimelineOperationRequest = async (option) => {
            try {
                let response = await get(endpoint + 'announcement/active/timeline/' + option);
                console.log(response); //check
                return response;
            } catch (err) {
                console.log(err);
            }
        }

        //get active announcement timeline state
        const announcementActiveTimelinenRequest = async () => {
            try {
                let response = await get(endpoint + 'announcement/active/timeline/' + option);
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
                let response = await get(endpoint + 'capture/status');
                console.log(response); //check
                return response;
            } catch (err) {
                console.log(err);
            }
        }

        //get current capture status and time
        const captureOperationRequest = async (option) => {
            try {
                let response = await get(endpoint + 'capture/' + option);
                console.log(response); //check
                return response;
            } catch (err) {
                console.log(err);
            }
        }

        //get current capture settings
        const captureSettingsRequest = async () => {
            try {
                let response = await get(endpoint + 'capture/settings');
                console.log(response); //check
                return response;
            } catch (err) {
                console.log(err);
            }
        }

        //get list of capture modes for the capture type
        const captureEncodingsRequest = async (type) => {
            try {
                let response = await get(endpoint + 'capture/encodings/' + type);
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
                let response = await get(endpoint + 'clear/layer/' + option);
                console.log(response); //check
                return response;
            } catch (err) {
                console.log(err);
            }
        }


        //clear the specified clear group
        const clearGroupRequest = async (id) => {
            try {
                let response = await get(endpoint + 'clear/group/' + id);
                console.log(response); //check
                return response;
            } catch (err) {
                console.log(err);
            }
        }

        //set the details of the specified clear group
        const clearGroupSetRequest = async (id, options) => {
            try {
                let response = await put(endpoint + 'clear/group/' + id, options);
                console.log(response); //check
                return response;
            } catch (err) {
                console.log(err);
            }
        }

        //delete the specified clear group
        const clearGroupDeleteRequest = async (id) => {
            try {
                let response = await del(endpoint + 'clear/group/' + id);
                console.log(response); //check
                return response;
            } catch (err) {
                console.log(err);
            }
        }

        //////////////////
        //PUBLIC METHODS//
        //////////////////

        this.getEventList = async function (query) {
            //maybe consider passing optional vars as an object?
            try {
                return await getEvents(query);
            } catch (err) {
                console.log(err);
            }


        }

        // this.getEventOccureneces = async () => {

        //     //authenticate
        //     await getAuth();
        //     return await getEventOccureneces();
        // }

        // this.getEventSpaces = async (eventId, scheduleId) => {
        //     //eventId and scheduleId required
        //     //validate required args
        //     if (typeof eventId === 'undefined' || typeof scheduleId === 'undefined') {
        //         let err = new Error('eventId or scheduleId undefined');
        //         throw err
        //     }

        //     //authenticate
        //     await getAuth();
        //     return await getEventSpaces(eventId, scheduleId);
        // }

        // this.getEventResources = async (eventId, scheduleId) => {
        //     //eventId and scheduleId required
        //     //validate required args
        //     if (typeof eventId === 'undefined' || typeof scheduleId === 'undefined') {
        //         let err = new Error('eventId or scheduleId undefined');
        //         throw err
        //     }

        //     //authenticate
        //     await getAuth();
        //     return await getEventResources(eventId, scheduleId);
        // }

        // this.getEventServices = async (eventId, scheduleId) => {
        //     //eventId and scheduleId required
        //     //validate required args
        //     if (typeof eventId === 'undefined' || typeof scheduleId === 'undefined') {
        //         let err = new Error('eventId or scheduleId undefined');
        //         throw err
        //     }

        //     //authenticate
        //     await getAuth();
        //     return await getEventServices(eventId, scheduleId);
        // }

        // this.getItemList = async params => {

        //     //authenticate
        //     await getAuth();
        //     return await getItemList(params);
        // }

        // this.getMinistryCategories = async () => {
        //     //authenticate
        //     await getAuth();
        //     return await getMinistryCategories();
        // }

        // this.getMinistryLocations = async () => {
        //     //authenticate
        //     await getAuth();
        //     return await getMinistryLocations();
        // }

        // this.getMinistryEditors = async () => {

        //     //authenticate
        //     await getAuth();
        //     return await getMinistryEditors();
        // }

        // this.getMinistryUsers = async () => {

        //     //authenticate
        //     await getAuth();
        //     return await getMinistryUsers();
        // }

        // this.getWebhookList = async webhookId => {
        //     //authenticate
        //     await getAuth();
        //     return await getWebhookList(webhookId);
        // }

        // this.getWebhookEvents = async () => {
        //     //authenticate
        //     await getAuth();
        //     return await getWebhookEvents();
        // }
    };
    //end constructor

    //public static methods

    return constructor;
}();

export default PP7;