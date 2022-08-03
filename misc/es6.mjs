import PP7 from '../src/node-pp7.mjs';

let propresenter = new PP7('http', '127.0.0.1', 12345);

//await propresenter.trigger('next');

// await propresenter.clearLayer('media');

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

propresenter.status(ya);

propresenter.on('timer/video_countdown', (data) => {
    console.log(data);
});

propresenter.on('timer/system_time', (data) => {
    console.log(data);
});