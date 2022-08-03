
# Node-PP7

Node-PP7 is a node.js wrapper of the ProPresenter API.  If you are looking for the client side version go here:

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

let  propresenter = new  PP7('https', ppIP, ppPort);

//USAGE EXAMPLES//

//Event listeners

//Next cue

//Clear all
```

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License
[MIT](https://choosealicense.com/licenses/mit/)