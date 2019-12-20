

// show the video page and play video
function playVideo(videoUrl, videoType, playVideoInTheBlock) {

    isPlaying = true;
    $('#close-video').show();
    var iframe = $('#outer-iframe');
    if ( playVideoInTheBlock) {
        $('#outer-iframe').hide();
        var videoID = getVideoId(videoUrl, videoType);
        iframe = $('#iframe-' + videoID);
        $('#img-'+ videoID).hide();
        
        iframe.show();
        $('.close-inner').css({
            'display':'inline'
        })

        
    }

    switch(videoType) {
        case 'youtube':
            playYoutubeVideo(parseYoutubeURL(videoUrl), iframe);
            break;
        case 'vimeo':
            playVimeoVideo(videoUrl, iframe);
            break;
        case 'facebook':
            playFacebookVideo(parseFacebookUrl(videoUrl), iframe);
            break;
        default:
            alert('Unsupported video type: ' + videoType);
            return;
    }
    
    if (!playVideoInTheBlock) {
        showVideo();
    }

}


function playFacebookVideo(videoID, iframe) {
    iframe.css({
        'width': '500',
        'height': '500',
        'top': 0,
        'left': 400
    });
    iframe.attr({
        'src': "https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2Ffacebook%2Fvideos%2F" + videoID
    });
}




function playVimeoVideo(videoUrl, iframe) {

    iframe.attr({
        'src': videoUrl
    });

}




// open the video page and show the video
function playYoutubeVideo(videoID, iframe) {

    var videoUrl = 'https://www.youtube.com/embed/' + videoID;

    iframe.attr({
        'src': videoUrl
    });
}

// return the corresponding thumbnail for the url
function getThumbnail(videoUrl, videoType) {
    switch(videoType) {
        case 'youtube':
            return getYoutubeThumbnail(videoUrl);
        case 'vimeo':
            return getVimeoThumbnail(videoUrl);
        case 'facebook':
            return getFacebookThumbnail(parseFacebookUrl(videoUrl));
        default:
            alert('Unsupported video type: ' + videoType);
            return;
    }
}

// get youtube thumbnail
function getYoutubeThumbnail(videoUrl) {
    return 'https://img.youtube.com/vi/' + parseYoutubeURL(videoUrl) + '/0.jpg';
}

// get vimeo thumbnail
function getVimeoThumbnail(videoUrl) {
    var videoID = parseVimeoUrl(videoUrl);
    var videoThumbnail = '';
    $.ajax({
        type: "get",
        url: "https://vimeo.com/api/v2/video/"+ videoID +".json",
        dataType: "json",
        success: function (response) {
            videoThumbnail = response[0].thumbnail_medium;
        },
        error: function (error) {
            //alert("Error encountered when trying to get thumbnail from vimeo");
            console.log(error);
        },
        async: false
    });
    return videoThumbnail;
}

// get video id
function getVideoId(videoUrl, videoType) {
    switch(videoType){
        case 'youtube':
            return parseYoutubeURL(videoUrl);
        case 'vimeo':
            return parseVimeoUrl(videoUrl);
        case 'facebook':
            return parseFacebookUrl(videoUrl);
        default:
            alert("Unsurported video type when parsing id");
            return;
    }
}

// get facebook thumbnail
function getFacebookThumbnail(videoID) {
    return 'facebook-thumbnails/' + videoID + '.jpg';
}


// get the video id of the url
function parseYoutubeURL(url) {
    var pattern = /v=(.{11})/;
    var match = pattern.exec(url);

    if (!match) {
        throw new Error("youtube url not valid");
    }

    return match[1];
}

function parseFacebookUrl(url) {
    var pattern = /videos\/(\d{16})/;
    var match = pattern.exec(url);

    if (!match) {
        throw new Error("facebook url not valid");
    }

    return match[1];
}

function parseVimeoUrl(url) {
    var pattern = /video\/(\d{9})/;
    var match = pattern.exec(url);

    if (!match) {
        throw new Error("vimeo url not valid");
    }

    return match[1];
}

