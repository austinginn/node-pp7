
# Node-PP7

Node-PP7 is a full implentation of the ProPresenter API as a node.js module.  If you are looking for the client side version go [here](https://github.com/austinginn).
The full documentation can be found [here](https://austinginn.github.io/node-pp7/).
<br>
<br>
Node-PP7 depends on the expermintal feature stream/web in node.js to handle status updates from the ProPresenter API. The Undici dependency will be removed once it moves from experimental to stable in future node releases.

## Installation

Using npm

```bash
npm install node-pp7
```

## Usage

```js
import  PP7  from  'node-pp7';

let ppIP = '127.0.0.1' //The IP address of the propresenter computer
let ppPort = 12345 //The port # in Preferences -> Network

let  propresenter = new  PP7('http', ppIP, ppPort);

//USAGE EXAMPLES//

//Next cue
await propresenter.trigger('next');

//Clear slide
await propresenter.clearLayer('slide');

//Listening for ProPresenter Status Updates
//These are all of the possible status updates defined by the ProPresenter API. Only pass what you need to the status function to reduce overhead.
let PP_EVENTS = [
    // "announcement/active/timeline", //fails if there is not an active timeline running when you request status updates
    "capture/status",
    "look/current",
    "media/playlists",
    "media/playlist/active",
    "media/playlist/focused",
    "messages",
    "playlist/active",
    "presentation/current",
    "presentation/slide_index",
    // "presentation/active/timeline", //fails if there is not an active timeline running when you request status updates
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

propresenter.status(PP_EVENTS);

propresenter.on('timer/video_countdown', (data) => {
    console.log(data);
});

propresenter.on('timer/system_time', (data) => {
    console.log(data);
});
```

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License
[MIT](https://choosealicense.com/licenses/mit/)