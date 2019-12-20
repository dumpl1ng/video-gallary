
$(document).ready(
    () => {
        init();
    }
);

// individual show case id that holds the video list per videolist node
var showcaseId = 0;

// linked video list that holds all video
var videoList;

// the current auto scroll interval
var scrollingIntervalId;

// the scrolling interval, used to resume after closing video page
var previousAutoScrollStayInterval;
var previousAutoScrollAnimationSpeedInterval;

// for controlling alignment
var gallery = $('#gallery-horizontal');


// read the config and initialize the component
function init() {
    if (alignment === 'vertical') {
        $('#gallery-horizontal').remove();
        gallery = $('#gallery-vertical');
    } else {
        $('#gallery-vertical').remove();
    }
    gallery.css({
        'height': galleryHeight,
        'width': galleryWidth
    });

    populateList(numVideoPerBlock);
    eventListeners();
    populateGallery(videoList.currentNode());

    autoScroll(slideStayInterval, animationSpeedInterval);
}



function eventListeners() {
    $(document).on('click', '.close-inner',
        (elem) => {
            closeVideo();
            elem.stopPropagation();
        }

    )
    $(document).on('click', '.showcase-block',
        (elem) => {
            initVideoPage(elem);
        }
    );
    $('.btn-next').click(
        () => {
            clearShowcase();
            populateGallery(videoList.nextNode());
        }
    );
    $('.btn-prev').click(
        () => {
            clearShowcase();
            populateGallery(videoList.prevNode());
        }
    );
    gallery.click(
        () => {
            if (isPlaying) {
                closeVideo();
            }
        }
    )
    $('#close-video').click(
        () => {
            if (isPlaying) {
                closeVideo();
            }
        }
    )

}


// initialize the video page and src for the video
function initVideoPage(elem) {
    disableAutoScroll();
    var currentShowcaseBlock = $('#' + elem.currentTarget.id);
    var videoUrl = currentShowcaseBlock.attr('data-video-url');
    var videoType = currentShowcaseBlock.attr('data-video-type');

    playVideo(videoUrl, videoType, playVideoInTheBlock);
}




// fill the linked video list
function populateList(listSize) {
    videoList = new LinkedVideoList(listSize);
    try {

        for (let i in videoData) {
            videoList.add(videoData[i].videoUrl, videoData[i].videoType, videoData[i].description);
        }

    } catch (error) {
        console.log(error);
        alert("Connection error encountered when trying to get the videos, please stand by...");
    }
}

// populate the showcase
function populateGallery(currentVideoList) {

    // display: none for future slide in effect
    var temp_showcase = "<div id='" + showcaseId + "' class='temp-showcase'>";
    showcaseId += 1;

    var blockWidth = 100 / numVideoPerBlock;

    for (let i = 0; i < currentVideoList.length; i++) {

        var videoUrl = currentVideoList[i].videoUrl;
        var videoType = currentVideoList[i].videoType;
        var videoDescription = currentVideoList[i].description;
        var videoID = getVideoId(videoUrl, videoType);
        var thumbNail = getThumbnail(videoUrl, videoType);
        var position = (i * blockWidth).toString() + '%';

        // control if the showcase block align from left or top
        var align = alignment === 'horizontal' ? 'left' : 'top';

        // for alignment control
        var adjustedSize = alignment === 'horizontal' ? 'width' : 'height';
        var fullSize = alignment === 'horizontal' ? 'height' : 'width';


        var showcase_block = "<div id='" + videoID + "' class='showcase-block' data-video-url='" + videoUrl
            + "' data-video-type='" + videoType
            + "'  style='" + align + ": " + position + "; " + adjustedSize + ": " + blockWidth + "%; " + fullSize + ": 100%;'><img class='video-thumbnail' src='" +
            thumbNail + "' alt='' id='img-" + videoID + "'><iframe class='inner-iframe' id='iframe-" + videoID + "' style='display: none;'>" +
            "</iframe><span class='close-inner'>&#x2716;</span>" +
            "<div class='overlay'>" + videoDescription + "</div></div>";

        temp_showcase += showcase_block;
    }

    temp_showcase += "</div>";
    $('#showcase').append(temp_showcase);
}

// add auto scroll functionality
function autoScroll(slideStayInterval, animationSpeedInterval) {

    var hideDirection = '';
    var showDirection = '';
    switch (scrollDirection) {
        case 'horizontal':
            hideDirection = 'left';
            showDirection = 'right';
            break;
        case 'vertical':
            hideDirection = 'down';
            showDirection = 'up';
            break;
        default:
            alert('Invalid scrolling direction!');
            return;
    }


    // resume the scrolling after close video
    previousAutoScrollStayInterval = slideStayInterval;
    previousAutoScrollAnimationSpeedInterval = animationSpeedInterval;
    scrollingIntervalId = setInterval(() => {

        // if don't remove the old showcase and only hide it, when play video in the block will not work since the img.hide() will hide the img in the hidden showcase
        var oldShowcase = '#' + (showcaseId - 1).toString();
        $(oldShowcase).hide('slide', { mode: 'linear', direction: hideDirection }, animationSpeedInterval,
            () => {
                $(oldShowcase).remove();
            });
        populateGallery(videoList.nextNode());
        // if you don't hide the show() will not work properly because it is already there
        $('#' + (showcaseId - 1).toString()).hide();
        $('#' + (showcaseId - 1).toString()).show('slide', { mode: 'linear', direction: showDirection }, animationSpeedInterval);

    }, slideStayInterval);

}


function disableAutoScroll() {
    $('.temp-showccase').finish();
    clearInterval(scrollingIntervalId);
}


function clearShowcase() {
    $('#showcase').empty();
}

function closeVideo() {
    isPlaying = false;
    $('#close-video').hide();
    if (playVideoInTheBlock) {
        $('.inner-iframe').removeAttr('src');
        $('.inner-iframe').hide();
        $('.close-inner').hide();
        $('.video-thumbnail').show();
    }
    $('#outer-iframe').hide();

    autoScroll(previousAutoScrollStayInterval, previousAutoScrollAnimationSpeedInterval);
}

function showVideo() {
    $('#outer-iframe').show();
}