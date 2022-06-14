//test bed for PP7 API
import { fetch } from 'undici';
import { TextDecoderStream } from 'node:stream/web';

//Possible layer types
const layers = ['audio', 'props', 'messages', 'announcements', 'slide', 'media', 'video_input'];

//API config
const config = {
    protocol: 'http',
    ip: '127.0.0.1',
    port: 1025,
    version: 'v1',
};

//API endpoint from config
let endpoint = config.protocol + '://' + config.ip + ':' + config.port + '/' + config.version + '/';

const clearLayer = async (layer) => {
    if (!layers.indexOf(layer)) { console.log("layer type does not exist"); return 0; };

    try {
        let response = await fetch(endpoint + 'clear/layer/' + layer);
        const status = checkStatus(await response.status);
        return status;
    } catch (error) {
        console.log(error.response);
    }
}

const trigger = async (cue) => {
    if (cue != 'next' && cue != 'previous') { console.log("check cue value"); return 0; }

    try {
        let response = await fetch(endpoint + 'trigger/' + cue);
        const status = checkStatus(await response.status);
        return status;
    } catch (error) {
        console.log(error);
    }
}

const statusSlide = async () => {
    try {
        let response = await fetch(endpoint + 'status/slide');

        const status = checkStatus(await response.status);
        return await response.json();
    } catch (error) {
        console.log(error);
    }
}

const statusSlideStream = async () => {
    const response = await fetch(endpoint + 'status/slide?chunked=true');
    // const reader = response.body.getReader();
    const stream = response.body;
    const textStream = stream.pipeThrough(new TextDecoderStream());
  
    for await (const chunk of textStream) {
      console.log(chunk);
    }

    console.log('Response fully received');
}


const presentationActiveTrigger = async (cue) => {
    if (!isInt(cue)) {
        if (cue != 'next' && cue != 'previous') { console.log("check cue value"); return 0; }
    }

    try {
        let response = await fetch(endpoint + 'presentation/active/' + cue + '/trigger');
        const status = checkStatus(await response.status);
        return status;
    } catch (error) {
        console.log(error);
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

const testing = async () => {
    console.log(endpoint);
    let response;

    // response = await presentationActiveTrigger('next');
    // console.log(response);
    // response = await clearLayer("slide");
    // console.log(response);
    // response = await statusSlide();
    // console.log(response);


    await statusSlideStream();


    return 0;
}



testing();