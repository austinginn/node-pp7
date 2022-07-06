import PP7 from './node-pp7.mjs';
import fs from 'fs';
import events from 'events';

let propresenter = new PP7('http', '127.0.0.1', '1025');

let ya = [
    // "announcement/active/timeline",
    "capture/status",
    "look/current",
    "media/playlists",
    "media/playlist/active",
    "media/playlist/focused",
    "messages",
    "playlist/active",
    "presentation/current",
    "presentation/slide_index",
    // "presentation/active/timeline",
    "presentation/focused/timeline",
    "stage/message",
    "status/layers",
    "status/stage_screens",
    "status/audience_screens",
    "status/screens",
    "status/slide",
    "timers",
    "timers/current",
    "timer/system_time",
    "timer/video_countdown",
]


// announcements(); //validated
// audio(); //validated
// capture(); //validated
// clears(); //validated
// globalGroups(); //validated
// library(); //validated
// looks(); //validated
// macros(); //validated
// mask(); //validated
// media(); //validated
// message(); //validated
// misc(); //validated
playlist();
// presentation();
// prop();
// stage();
// status();
// theme();
// timer();
// transport();
//trigger(); 
//videoInput(); 



// propresenter.status(ya);

propresenter.on('timer/system_time', (data) => {
    console.log(data);
});

propresenter.on('timer/video_countdown', (data) => {
    console.log(data);
});


async function globalGroups() {
    try {
        let response = await propresenter.groups();
        console.log(response);
    } catch (err) {
        console.log(err);
    }
}

async function tests() {
    announcements()
}

async function playlist() {
    try {
        // let response = await propresenter.playlists.get();
        // console.log(response);

        // let response = await propresenter.playlists.create({
        //     "name": "Sunday Service",
        //     "type": "playlist"
        //   });
        // console.log(response);

        // let response = await propresenter.playlist.get('91A83E2B-CED3-4BD2-9043-0511E3C8FA76');
        // console.log(response.items);

        // let response = await propresenter.playlist.set('91A83E2B-CED3-4BD2-9043-0511E3C8FA76', [
        //     {
        //         "id": {
        //             "uuid": "1D0AF91C-64D7-4A06-A8E8-99A1ED48F00A",
        //             "name": "THIS IS A TEST",
        //             "index": 0
        //         },
        //         "type": "presentation",
        //         "is_hidden": false,
        //         "is_pco": false
        //     },
        //     {
        //         "id": {
        //             "uuid": null,
        //             "name": "Songs",
        //             "index": 1
        //         },
        //         "type": "header",
        //         "header_color": {
        //             "red": 0,
        //             "green": 0.54,
        //             "blue": 0.87,
        //             "alpha": 1
        //         },
        //         "is_hidden": false,
        //         "is_pco": false
        //     },
        //     {
        //         "id": {
        //             "uuid": "9C95DA74-42D0-415C-9F8A-C03226B1F459",
        //             "name": "Test2",
        //             "index": 1
        //         },
        //         "type": "presentation",
        //         "is_hidden": false,
        //         "is_pco": false
        //     }
        // ]);
        // console.log(response);

        // let response = await propresenter.playlist.create('96917F11-AD91-4B78-BC0B-8DF6F5C55CE6', 
        //     {
        //         "name": "Hello",
        //         "type": "playlist"
        //       }
        // );
        // console.log(response);

        // let response = await propresenter.playlist.focus('previous');
        // console.log(response);

        // let response = await propresenter.playlist.active.focus('presentation');
        // console.log(response);

        // let response = await propresenter.playlist.active.trigger('announcement', '1');
        // console.log(response);

        let response = await propresenter.playlist.focused.trigger('index', 2);
        console.log(response);

        


    } catch (error) {
        console.log(error);
    }
}

async function library() {
    try {
        // let response = await propresenter.libraries();
        // console.log(response);

        // let response = await propresenter.library.get('58D056E9-1220-4B3E-A71B-507668AD4F46');
        // console.log(response);

        // let response = await propresenter.library.trigger('58D056E9-1220-4B3E-A71B-507668AD4F46', '46E2B76E-A9C4-4833-AF51-3DC1D374CC8E');
        // console.log(response);

        // let response = await propresenter.libraries();
        // console.log(response);

        // response = await propresenter.library('CCB75A8D-3691-4018-864E-21D6D79516AC');
        // console.log(response);

        // response = await propresenter.libraryTrigger('CCB75A8D-3691-4018-864E-21D6D79516AC', 'F01A69D4-135D-4EC0-971D-939B232B191E', 1)
    } catch (error) {
        console.log(error);
    }
}

async function looks() {
    try {
        //    let response = await propresenter.looks.get();
        //    console.log(response[0]);

        // let response = await propresenter.looks.create({
        //     "screens": [
        //         {
        //           "video_input": true,
        //           "media": true,
        //           "slide": true,
        //           "announcements": true,
        //           "props": true,
        //           "messages": true,
        //           "presentation": "",
        //           "mask": ""
        //         },
        //       ]
        //     }
        // );
        // console.log(response);

        // let response = await propresenter.look.current.get();
        // console.log(response);

        // let response = await propresenter.look.current.set({
        //     id: {
        //         uuid: 'AB352D2A-B7E2-4D04-B253-EB7BC7DCEFC6',
        //         name: 'Default 1',
        //         index: 3
        //     },
        //     screens: [
        //         {
        //             video_input: true,
        //             media: true,
        //             slide: true,
        //             announcements: true,
        //             props: true,
        //             messages: true,
        //             presentation: '',
        //             mask: ''
        //         }
        //     ]
        // });
        // console.log(response);

        // let response = await propresenter.look.delete('04214EB2-7598-4DA6-8E27-6CE8B6C62F5A');
        // console.log(response);

        // let response = await propresenter.look.get('56D2B278-658C-4485-8780-9EF492339626');
        // console.log(response);

        // let response = await propresenter.look.set('56D2B278-658C-4485-8780-9EF492339626', {
        //     screens: [
        //         {
        //             video_input: true,
        //             media: true,
        //             slide: true,
        //             announcements: true,
        //             props: true,
        //             messages: true,
        //             presentation: '',
        //             mask: ''
        //         }
        //     ]

        // });
        // console.log(response);

        let response = await propresenter.look.trigger('56D2B278-658C-4485-8780-9EF492339626');
        console.log(response);
    } catch (error) {
        console.log(error);
    }
}

async function macros() {
    try {
        // let response = await propresenter.macros();
        // console.log(response);

        // let response = await propresenter.macro.get('B5BE1C45-D747-4DB3-AD25-2B89B4C0718F');
        // console.log(response);

        // let response = await propresenter.macro.set('B5BE1C45-D747-4DB3-AD25-2B89B4C0718F', {
        //     color: {
        //         red: 1,
        //         green: 1,
        //         blue: 1,
        //         alpha: 1
        //       }
        // });
        // console.log(response);

        // let response = await propresenter.macro.trigger('B5BE1C45-D747-4DB3-AD25-2B89B4C0718F');
        // console.log(response);

        let response = await propresenter.macro.delete('B5BE1C45-D747-4DB3-AD25-2B89B4C0718F');
        console.log(response);

    } catch (error) {
        console.log(error);
    }
}

async function media() {
    try {
        // let response = await propresenter.mediaPlaylists();
        // console.log(response);

        // let response = await propresenter.mediaPlaylist.get('239B0FD7-F20F-42ED-BD6A-345909073DEC');
        // console.log(response);

        // let response = await propresenter.mediaPlaylist.id('active');
        // console.log(response);

        // let response = await propresenter.mediaPlaylist.id('focused');
        // console.log(response);

        // let response = await propresenter.mediaPlaylist.focus('id','1' );
        // console.log(response);

        // let response = await propresenter.mediaPlaylist.trigger('id', '239B0FD7-F20F-42ED-BD6A-345909073DEC');
        // console.log(response);

        // let response = await propresenter.mediaPlaylist.focused.trigger('previous');
        // console.log(response);

        // let response = await propresenter.mediaPlaylist.active.trigger('id', '0');
        // console.log(response);

        let response = await propresenter.mediaPlaylist.playlistId.trigger('id', '239B0FD7-F20F-42ED-BD6A-345909073DEC', 2);
        console.log(response);
    } catch (error) {
        console.log(error);
    }
}

async function message() {
    try {
        // let response = await propresenter.messages.get();
        // console.log(response[0].tokens);

        // let response = await propresenter.messages.create(
        //     {
        //         "id": {
        //             "name": "Test Message",
        //             "uuid": "942C3FC3-C4B2-44F7-A55D-4CC913BB8A5D",
        //             "index": 0
        //         },
        //         "message": "Text {text}, Clock {System Clock}, Countdown {Timer 1}, Countdown to time {Timer 2}, Elapsed {Timer 3}",
        //         "tokens": [
        //             {
        //                 "name": "text",
        //                 "text": {
        //                     "text": "142"
        //                 }
        //             }
        //         ],
        //         "theme": {
        //             "name": "Default",
        //             "uuid": "f5468354-01fb-44d8-b7b3-5ede94c6115c",
        //             "index": 0
        //         }
        //     });
        // console.log(response);

        // let response = await propresenter.message.get('022DBE98-0A78-4AA9-A8C9-56BD049A165F');
        // console.log(response);

        // let response = await propresenter.message.set('022DBE98-0A78-4AA9-A8C9-56BD049A165F', {
        //             "id": {
        //                 "name": "Test Message",
        //                 "uuid": "942C3FC3-C4B2-44F7-A55D-4CC913BB8A5D",
        //                 "index": 0
        //             },
        //             "message": "Text {text}, Clock {System Clock}, Countdown {Timer 1}, Countdown to time {Timer 2}, Elapsed {Timer 3}",
        //             "tokens": [
        //                 {
        //                     "name": "text",
        //                     "text": {
        //                         "text": "142"
        //                     }
        //                 }
        //             ],
        //             "theme": {
        //                 "name": "Default",
        //                 "uuid": "f5468354-01fb-44d8-b7b3-5ede94c6115c",
        //                 "index": 0
        //             }
        //         });
        // console.log(response);

        // let response = await propresenter.message.delete('022DBE98-0A78-4AA9-A8C9-56BD049A165F');
        // console.log(response);

        //     let response = await propresenter.message.trigger('0',
        //    [
        //         {
        //           "name": "text",
        //           "text": {
        //             "text": "Hello, world!"
        //           }
        //         }
        //       ]
        //     );
        //     console.log(response);

        // let response = await propresenter.message.clear('0');
        // console.log(response);
    } catch (error) {
        console.log(error)
    }
}

async function clears() {
    try {

        // let response = await propresenter.clear.groups.get();
        // console.log(response);

        // let response = await propresenter.clear.groups.create({
        //     "icon": "All",
        //     "tint": {
        //         "red": 0,
        //         "green": 0.54,
        //         "blue": 0.87,
        //         "alpha": 1
        //     },
        //     "layers": [
        //         "music"
        //     ],
        //     "stop_timeline_announcements": true,
        //     "stop_timeline_presentation": true,
        //     "clear_next_presentation": true
        // });
        // console.log(response);

        // let response = await propresenter.clear.layer("audio");
        // console.log(response);

        // let response = await propresenter.clear.group.get("75213DD1-09F6-4278-A031-BC369D2DC91E");
        // console.log(response);

        //    let response = await propresenter.clear.group.set("75213DD1-09F6-4278-A031-BC369D2DC91E", {
        //         "icon": "All",
        //         "tint": {
        //             "red": 0,
        //             "green": 0.54,
        //             "blue": 0.87,
        //             "alpha": 1
        //         },
        //         "layers": [
        //             "music"
        //         ],
        //         "stop_timeline_announcements": true,
        //         "stop_timeline_presentation": true,
        //         "clear_next_presentation": true
        //     });
        //     console.log(response);

        // let response = await propresenter.clear.group.delete('75213DD1-09F6-4278-A031-BC369D2DC91E');
        // console.log(response);

        // let response = await propresenter.clear.group.trigger('753D6A51-AE0A-48AC-A513-5CE8DF38F1AF');
        // console.log(response);

        // let response = await propresenter.clear.group.icon.get('753D6A51-AE0A-48AC-A513-5CE8DF38F1AF');
        // await saveFile(response);

        // const filePath = './Title.jpg';
        // const fileStream = fs.createReadStream(filePath);


        // response = await propresenter.clear.group.icon.set('0', fileStream);
        // console.log(response);
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
        // let response = await propresenter.audioPlaylists();
        // console.log(response);

        // let response = await propresenter.audioPlaylist.get('C58D0B42-A204-45BB-BADA-0A2E141DD022');
        // console.log(response);

        // let response = await propresenter.audioPlaylist.focused();
        // console.log(response);


        // let response = await propresenter.audioPlaylist.active();
        // console.log(response);

        // let response = await propresenter.audioPlaylist.focus("active");
        // console.log(response);

        // let response = await propresenter.audioPlaylist.trigger.active("previous");
        // console.log(response);
    } catch (err) {
        console.log(err.response);
    }

}



//validated
async function mask() {
    try {
        // let response = await propresenter.masks();
        // console.log(response);

        // let response = await propresenter.mask('9A90EF10-E6AE-43D2-9341-CF95398023D7');
        // console.log(response);

        // let response = await propresenter.maskThumbnail('9A90EF10-E6AE-43D2-9341-CF95398023D7');
        // console.log(response);
        // await saveFile(response);


    } catch (error) {
        console.log(error);
    }

    // response = await propresenter.maskThumbnail('3FE73C02-6A03-4E0D-BF5A-C38B39631277');
    // console.log(response);
    // await saveFile(response);
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
    console.log(response.data);

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
    // let response = await propresenter.capture.encodings('disk');
    // console.log(response);

    // let response = await propresenter.capture.operation('start');
    // console.log(response);

    // let response = await propresenter.capture.settings();
    // console.log(response);

    // let response = await propresenter.capture.status();
    // console.log(response);
}


//validated
async function announcements() {
    // let response = await propresenter.announcement.get();
    // console.log(response);

    // let response = await propresenter.announcement.index();
    // console.log(response);

    // let response = await propresenter.announcement.focus();
    // console.log(response);

    // let response = await propresenter.announcement.retrigger();
    // console.log(response);

    // let response = await propresenter.announcement.trigger('index', 0);
    // console.log(response);

    // let response = await propresenter.announcement.timeline.status();
    // console.log(response);

    // let response = await propresenter.announcement.timeline.transport('play');
    // console.log(response);


}



async function saveFile(blob, filename = 'default.jpeg') {
    const buffer = Buffer.from(await blob.arrayBuffer());
    fs.writeFile(filename, buffer, () => console.log('saved'));
}