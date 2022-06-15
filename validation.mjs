import PP7 from './node-pp7.mjs';

let propresenter = new PP7('http', '127.0.0.1', '1025');

//announcements(); //validated
capture();

//not finished
async function capture(){
    
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