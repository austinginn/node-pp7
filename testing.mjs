//test bed for PP7 API


import fetch from 'node-fetch';

//Possible layer types
const layers = ['audio', 'props', 'messages', 'announcements', 'slide', 'media', 'video_input'];

//API config
const config = {
    protocol: 'https',
    ip: '127.0.0.1',
    port: 5001,
    version: 'v1',
};

//API endpoint from config
let endpoint = config.protocol + '://' + config.ip + ':' + config.port + '/' + config.version + '/';
console.log(endpoint);



const clearLayer = async (layer) => {
    if (!layers.findIndex(layer)) { console.log("layer type does not exist"); return 0; };

    try {
        response = await fetch(endpoint + 'clear/layer/' + layer);
        const status = checkStatus(await response.status);
        console.log(status);
    } catch (error) {
        console.log(error.response);
    }
}

const presentationActiveTrigger = async (cue) => {
    if (cue != 'next' ||
        cue != 'previous' ||
        !isInt(cue)) { console.log("check cue value"); return 0; }

    try {
        response = await fetch(endpoint + 'presentation/active/' + cue + '/trigger');
        const status = checkStatus(await response.status);
        console.log(status);
    } catch (error) {
        console.log(error.response);
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
function isInt(value) {
    return !isNaN(value) &&
        parseInt(Number(value)) == value &&
        !isNaN(parseInt(value, 10));
}