import PP7 from './node-pp7.mjs';
import fs from 'fs';

let propresenter = new PP7('http', '127.0.0.1', '1025');

//announcements(); //validated
//capture(); //validated
//trigger(); //validated
//videoInput(); //validated
//mask(); //validated
//audio(); //validated
//groups(); //validated
//misc(); //validated
//clears(); //validated
//library(); // validate

tests();

async function tests(){
    propresenter.macro.get();
    console.log(propresenter);
}

async function library() {
    try {
        let response = await propresenter.libraries();
        console.log(response);

        response = await propresenter.library('CCB75A8D-3691-4018-864E-21D6D79516AC');
        console.log(response);

        response = await propresenter.libraryTrigger('CCB75A8D-3691-4018-864E-21D6D79516AC', 'F01A69D4-135D-4EC0-971D-939B232B191E', 1)
    } catch (error){
        console.log(error);
    }
}

async function clears() {
    try {
        let response = await propresenter.clearGroups();
        console.log(response);

        response = await propresenter.clearLayer('slide');
        console.log(response);

        response = await propresenter.clearLayer('audio');
        console.log(response);

        response = await propresenter.clearLayer('props');
        console.log(response);

        response = await propresenter.clearLayer('messages');
        console.log(response);

        response = await propresenter.clearLayer('announcements');
        console.log(response);

        response = await propresenter.clearLayer('media');
        console.log(response);

        response = await propresenter.clearLayer('video_input');
        console.log(response);

        response = await propresenter.clearGroup('0');
        console.log(response);

        //this needs better documentation from Renewed Vision
        response = await propresenter.clearGroupSet('0', {
            "name": "yo",
            "icon": "All",
            "tint": {
                "red": 0,
                "green": 0.54,
                "blue": 0.87,
                "alpha": 1
            },
            "layers": [
                "music"
            ],
            "stop_timeline_announcements": true,
            "stop_timeline_presentation": true,
            "clear_next_presentation": true
        });
        console.log(response);

        // response = await propresenter.clearGroupDelete('1');
        // console.log(response);

        response = await propresenter.clearGroupIcon('0');
        await saveFile(response);

        const filePath = './Title.jpeg';
        const fileStream = await fs.createReadStream(filePath);


        response = await propresenter.clearGroupIconSet('0', fileStream);
        console.log(response);

        response = await propresenter.clearGroupTrigger('0');
        console.log(response);

        //setting name doesn't seem possible?
        response = await propresenter.clearGroupsCreate(JSON.stringify({
            "icon": "All",
            "tint": {
                "red": 0,
                "green": 0.54,
                "blue": 0.87,
                "alpha": 1
            },
            "layers": [
                "music"
            ],
            "stop_timeline_announcements": true,
            "stop_timeline_presentation": true,
            "clear_next_presentation": true
        }));
        console.log(response);


    } catch (err) {
        console.log(err);
    }
}

async function misc() {
    let response = await propresenter.findMouse();
    console.log(response);
}

async function groups() {
    let response = await propresenter.groups();
    console.log(response);
}

async function audio() {
    try {
        let response = await propresenter.audioPlaylists();
        console.log(response);

        response = await propresenter.audioPlaylist('6B92FB56-1E47-4A34-93ED-6170CF57D87C');
        console.log(response);

        response = await propresenter.audioPlaylistFocused();
        console.log(response);

        response = await propresenter.audioPlaylistActive();
        console.log(response);

        response = await propresenter.audioPlaylistFocus('next');
        console.log(response);

        response = await propresenter.audioPlaylistFocus('previous');
        console.log(response);

        response = await propresenter.audioPlaylistFocus('active');
        console.log(response);

        // response = await propresenter.audioPlaylistFocus(112333123); //this should error out
        // console.log(response); 

        response = await propresenter.audioPlaylistTrigger('focused');
        console.log(response);

        response = await propresenter.audioPlaylistTrigger('active');
        console.log(response);

        response = await propresenter.audioPlaylistFocusedTrigger('next');
        console.log(response);

        response = await propresenter.audioPlaylistFocusedTrigger('previous');
        console.log(response);

        response = await propresenter.audioPlaylistActiveTrigger('next');
        console.log(response);

        response = await propresenter.audioPlaylistActiveTrigger('previous');
        console.log(response);

        response = await propresenter.audioPlaylistIdTrigger('6B92FB56-1E47-4A34-93ED-6170CF57D87C', 'next');
        console.log(response);

        response = await propresenter.audioPlaylistIdTrigger('6B92FB56-1E47-4A34-93ED-6170CF57D87C', 'previous');
        console.log(response);
    } catch (err) {
        console.log(err.response);
    }

}



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



async function saveFile(blob, filename = 'default.jpeg') {
    const buffer = Buffer.from(await blob.arrayBuffer());
    fs.writeFile(filename, buffer, () => console.log('saved'));
}