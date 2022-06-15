import PP7 from './node-pp7.mjs';

let propresenter = new PP7('http', '127.0.0.1', '1025');

announcements();

async function announcements() {
    let response = await propresenter.announcementActive();
    console.log(response);
}