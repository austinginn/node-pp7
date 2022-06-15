import PP7 from './node-pp7.mjs';
import fs from 'fs';

let propresenter = new PP7('http', '127.0.0.1', '1025');

//announcements(); //validated
//capture(); //validated
//trigger(); //validated
//videoInput(); //validated
//mask(); //validated



//validated
async function mask() {
    let response = await propresenter.masks();
    console.log(response);

    response = await propresenter.mask('3FE73C02-6A03-4E0D-BF5A-C38B39631277');
    console.log(response);

    response = await propresenter.maskThumbnail('3FE73C02-6A03-4E0D-BF5A-C38B39631277');
    console.log(response);
    await saveFile(response);
}

//validated
async function videoInput() {
    let response = await propresenter.videoInputs();
    console.log(response);

    response = await propresenter.videoInputsTrigger('33F84C1D-A9C9-4959-AD95-A77005902A91');
    console.log(response);
}

//validated
async function trigger() {
    let response = await propresenter.trigger('next');
    console.log(response);

    response = await propresenter.trigger('previous');
    console.log(response);

    response = await propresenter.triggerAudio('next');
    console.log(response);

    response = await propresenter.triggerAudio('previous');
    console.log(response);

    response = await propresenter.triggerMedia('next');
    console.log(response);

    response = await propresenter.triggerMedia('previous');
    console.log(response);
}

//validated
async function capture() {
    let response = await propresenter.captureEncodings('disk');
    console.log(response);

    response = await propresenter.captureEncodings('rtmp');
    console.log(response);

    response = await propresenter.captureEncodings('resi');
    console.log(response);

    response = await propresenter.captureOperation('start');
    console.log(response);

    response = await propresenter.captureOperation('stop');
    console.log(response);

    response = await propresenter.captureSettings();
    console.log(response);

    response = await propresenter.captureStatus();
    console.log(response);
}


//validated
async function announcements() {
    let response = await propresenter.announcementActive();
    console.log(response);

    response = await propresenter.announcementActiveFocus();
    console.log(response);

    response = await propresenter.announcementActiveRetrigger();
    console.log(response);

    response = await propresenter.announcementActiveTimeline();
    console.log(response);

    response = await propresenter.announcementActiveTimelineOperation('pause');
    console.log(response);

    response = await propresenter.announcementActiveTimelineOperation('play');
    console.log(response);

    response = await propresenter.announcementActiveTimelineOperation('rewind');
    console.log(response);

    response = await propresenter.announcementSlideIndex();
    console.log(response);

    response = await propresenter.announcementActiveTrigger('next');
    console.log(response);

    response = await propresenter.announcementActiveTrigger('previous');
    console.log(response);

    response = await propresenter.announcementActiveTrigger(2);
    console.log(response);
}



async function saveFile(blob) {
    const buffer = Buffer.from( await blob.arrayBuffer() );
    fs.writeFile('test.jpeg', buffer, () => console.log('saved') );
}