var createSongRow = function (songNumber, songName, songLength) {
    
    var template =
            '<tr class="album-view-song-item">'
            +'  <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>'
            +'  <td class="song-item-title">' + songName + '</td>'
            +'  <td class="song-item-duration">' + songLength + '</td>'
            +'</tr>'
            ;
    
    var $row = $(template);
    
    $('.song-item-number')
   
    var clickHandler = function() {
        var songNumber = parseInt($(this).attr('data-song-number'));
        var $volumeFill = $('volume .fill');
        var $volumeThumb = $('.volume .thumb');
        
        
        if (currentlyPlayingSongNumber !== null) {
            var currentlyPlayingCell = getSongNumberCell(currentlyPlayingSongNumber);
            currentlyPlayingCell.html(currentlyPlayingSongNumber);
        }
        
        if (currentlyPlayingSongNumber !== songNumber) {
            $(this).html(pauseButtonTemplate);
            setSong(songNumber);
            currentSoundFile.play();
            currentSongFromAlbum = currentAlbum.songs[songNumber - 1];
           
            $volumeFill.width(currentVolume + '%');
            $volumeThumb.css({left: currentVolume + '%'});
                       
            updatePlayerBarSong();
            updateSeekBarWhileSongPlays();
            
            $('main-controls .play-pause').html(playerBarPauseButton);
            
        } else if (currentlyPlayingSongNumber === songNumber) {
            if (currentSoundFile.isPaused()) {
                $(this).html(pauseButtonTemplate);
                $('main-controls .play-pause').html(playerBarPauseButton);
                currentSoundFile.play();
                updateSeekBarWhileSongPlays();
        }
            else {
                $(this).html(playButtonTemplate);
                $('.main-controls .play-pause').html(playerBarPlayButton);
                currentSoundFile.pause();
                
            }
        }
    };
    
    
    var onHover = function(event){
        var songNumberCell = $(this).find('.song-item-number');
        var songNumber = songNumberCell.attr('data-song-number');
        
        if (parseInt(songNumber) !== currentlyPlayingSongNumber) {
            songNumberCell.html(playButtonTemplate);
        }
    };
    
    var offHover = function(event) {
        var songNumberCell = $(this).find('.song-item-number');
        var songNumber = songNumberCell.attr('data-song-number');
        
        if (parseInt(songNumber) !== currentlyPlayingSongNumber) {
            songNumberCell.html(songNumber);
        }
        
    };
    
    $row.find('.song-item-number').click(clickHandler);
    $row.hover(onHover, offHover);
    return $row;
};
  
var setCurrentAlbum = function(album) { 
    currentAlbum = album;
    
    var $albumTitle = $('.album-view-title'); 
    var $albumArtist = $('.album-view-artist');
    var $albumReleaseInfo = $('.album-view-release-info');
    var $albumImage = $('.album-cover-art');
    var $albumSongList = $('.album-view-song-list');
       
    $albumTitle.text(album.title);
    $albumArtist.text(album.artist);
    $albumReleaseInfo.text(album.year + ' ' + album.label);
    $albumImage.attr('src', album.albumArtUrl);
    
    $albumSongList.empty();
    
    for (var i = 0; i< album.songs.length; i++) {
        var $newRow = createSongRow(i + 1, album.songs[i].title, album.songs[i].duration); 
        $albumSongList.append($newRow);   
    }
};

var trackIndex = function(album, song) {
    return album.songs.indexOf(song);
};

var updatePlayerBarSong = function() {
     $('.currently-playing .song-name').text(currentSongFromAlbum.title);
     $('.currently-playing .artist-name').text(currentAlbum.artist);
     $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.title+ " - " + currentAlbum.artist); 
     setTotalTimeInPlayerBar(filterTimeCode(currentSongFromAlbum.duration));
};

var nextSong = function() {
    var getLastSongNumber = function(index){
        return index == 0 ? currentAlbum.songs.length : index;
    };
    
    var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
    currentSongIndex++;
    
    if (currentSongIndex === currentAlbum.songs.length){
        currentSongIndex = 0;
    }
    
    currentSongFromAlbum = currentAlbum.songs[currentSongIndex];
    setSong(currentSongIndex +1);
      
     $('.currently-playing .song-name').text(currentSongFromAlbum.title);
     $('.currently-playing .artist-name').text(currentAlbum.artist);
     $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.title + " - " + currentAlbum.artist); 
     $('.main-controls .play-pause').html(playerBarPauseButton);
      
    var lastSongNumber = getLastSongNumber(currentSongIndex);
    var $nextSongNumberCell = $('.song-item-number[data-song-number="' + currentlyPlayingSongNumber + '"]');
    var $lastSongNumberCell = $('.song-item-number[data-song-number="' + lastSongNumber + '"]');
    
    $nextSongNumberCell.html(pauseButtonTemplate);
    $lastSongNumberCell.html(lastSongNumber);
    
    currentSoundFile.play();
    updateSeekBarWhileSongPlays();
};

var previousSong = function() {
    
    var getLastSongNumber = function(index) {
        return index == (currentAlbum.songs.length - 1) ? 1 : index + 2;
};

var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
    currentSongIndex--;
    
    if (currentSongIndex < 0) {
        currentSongIndex = currentAlbum.songs.length -1;
    }
    
    setSong(currentSongIndex + 1);   
    currentSongFromAlbum = currentAlbum.songs[currentSongIndex];
      
    $('.currently-playing .song-name').text(currentSongFromAlbum.name);
    $('.currently-playing .artist-name').text(currentAlbum.artist);
    $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.name + " - " + currentAlbum.name);
    $('.main-controls .play-pause').html(playerBarPauseButton);
    
    var lastSongNumber = getLastSongNumber(currentSongIndex);
    var $previousSongNumberCell = $('.song-item-number[data-song-number="' + currentlyPlayingSongNumber + '"]');
    var $lastSongNumberCell = $('.song-item-number[data-song-number="' + lastSongNumber + '"]');
    
    $previousSongNumberCell.html(pauseButtonTemplate);
    $lastSongNumberCell.html(lastSongNumber);
    currentSoundFile.play();
    updateSeekBarWhileSongPlays();
};

var setSong = function(songNumber) {
    
    if (currentSoundFile) {
        currentSoundFile.stop();
    }
    
    currentlyPlayingSongNumber = parseInt(songNumber);
    currentSongFromAlbum = currentAlbum.songs[songNumber - 1];  
    
    currentSoundFile = new buzz.sound(currentSongFromAlbum.audioUrl, {
        formats: [ 'mp3' ],
        preload: true
    });
    
    setVolume(currentVolume);
};

//seek() uses Buzz setTime() method tochange position in a song to specified time
var seek = function(time) {
    if (currentSoundFile) {
        currentSoundFile.setTime(time);
    }
}

var setVolume = function(volume) {
    if (currentSoundFile) {
        currentSoundFile.setVolume(volume);
    }
};

var getSongNumberCell = function(number){
    
    return $('.song-item-number[data-song-number="' + number + '"]');
};

var updateSeekBarWhileSongPlays = function() {
    if (currentSoundFile) {
        
        //10. Bind timeupdate (custom Buzz event that fires repeatedly while time elapses) to currentSoundFile
        currentSoundFile.bind('timeupdate', function(event) {
            
            //11. getTime() & getDuration (Buzz method) gets current time of song
            var seekBarFillRatio = this.getTime() / this.getDuration();
            var $seekBar = $('.seek-control .seek-bar');
            
            updateSeekPercentage($seekBar, seekBarFillRatio);
            
            setCurrentTimeInPlayer(filterTimeCode(this.getTime()));
        });
    }
};

var updateSeekPercentage = function($seekBar, seekBarFillRatio) {
    var offsetXPercent = seekBarFillRatio * 100;
    
    //1. Use JS Math.max so % >= 0 & Math.min so % <= 100
    offsetXPercent = Math.max(0, offsetXPercent);
    offsetXPercent = Math.min(100, offsetXPercent);
    
    //2. Convert % to string add % char. so CSS interprets values width for .fill and left for .thumb class
    var percentageString = offsetXPercent + '%';
    $seekBar.find('.fill').width(percentageString);
    $seekBar.find('.thumb').css({left: percentageString});
};

var setupSeekBars = function() {
    
    //6. Use JQ to find all elements in DOM w/ class "seek-bar" contained in element class "player-bar" Returns JQ wrapped array containing song seek control & volume control
    var $seekBars = $('.player-bar .seek-bar');
    
    $seekBars.click(function(event) {
        var offsetX = event.pageX - $(this).offset().left;
        var barWidth = $(this).width();        
        var seekBarFillRatio = offsetX / barWidth;
        
        if ($(this).parent().attr('class') =='seek-control') {
            seek(seekBarFillRatio * currentSoundFile.getDuration());
        } else {
            setVolume(seekBarFillRatio * 100);
        }
        
        updateSeekPercentage($(this), seekBarFillRatio);
       
    });
    
    //7. find elemts in class .thumb inside $seekBar and add event listener 
    $seekBars.find('.thumb').mousedown(function(event) {
        
        //8. Wrapped context in JQ so its know which song seek and volume controls nodes dispatchs the event 
        var $seekBar = $(this).parent();
        
        //9. Track events with bind().  Namespaces event listeners 
        $(document).bind('mousemove.thumb', function(event){
            
            //3. New event object called pageX (JQ specific) holds X coordinate where event occurrs
            var offsetX = event.pageX - $seekBar.offset().left;
            var barWidth = $seekBar.width();
            
            //4. Divide offSetX by width of entire bar to calc seekBarFillRatio
            var seekBarFillRatio = offsetX / barWidth;
            
            if ($(this).parent().attr('class') == 'seek-control') {
                seek(seekBarFillRatio * currentSoundFile.getDuration());
            } else {
                
                setVolume(seekBarFillRatio);
            }
            
            //5. Pass $(this) as $seekBar argument & seekBarFillRatio for named argument updateSeekBarPercentage()
            updateSeekPercentage($seekBar, seekBarFillRatio);
        });
        
        //10. Bind mouseup event w/ .thumb namespace.  Uses unbind() method to remove previous event listerners, so bar won't continue to move once mouse is released
        $(document).bind('mouseup.thumb', function() {
            $(document).unbind('mousemove.thumb');
            $(document).unbind('mouseup.thumb');
        });
    });

};

var setCurrentTimeInPlayer = function(currentTime) {
    $('curren-time').text(currentTime);
}

var setTotalTimeInPlayerBar = function(totalTime) {
    $('.total-time').text(totalTime);
}

var filterTimeCode = function(timeInSeconds) {
    var seconds = parseFloat(timeInSeconds);
    var wholeSeconds = Math.floor(seconds);
    var wholeMinutes = Math.floor(seconds / 60);
    var remainingSeconds = (wholeSeconds % 60 );
    
    var time = wholeMinutes + ":" + remainingSeconds;
    
    if (remainingSeconds < 10) {
        time = wholeMinutes + ":" + 0 + remainingSeconds; 
    }
    
    return time;
}

var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';
var playerBarPlayButton = '<span class="ion-play"></span>';
var playerBarPauseButton = '<span class="ion-pause"></span>';

var currentAlbum = null;
var currentlyPlayingSongNumber = null;
var currentSongFromAlbum = null;
var currentSoundFile = null;
var currentVolume = 80;

var $previousButton = $('main-controls .previous');
var $nextButton = $('main-controls .next');
var $playPauseButton = $('main-controls .play-pause');

$(document).ready(function(){
    setCurrentAlbum(albumPicasso);
    setupSeekBars();
    $previousButton.click(previousSong);
    $nextButton.click(nextSong);
    $playPauseButton.click(togglePlayFromPlayerBar);
}); 

var togglePlayFromPlayerBar = function(){
    var $currentlyPlayingCell = getSongNumberCell(currentlyPlayingSongNumber);
    if (currentSoundFile.isPaused()) {
        $currentlyPlayingCell.html(pauseButtonTemplate);
        $(this).html(playerBarPauseButton);
        currentSoundFile.play();
    } else if (currentSoundFile) {
        $currentlyPlayingCell.html(playButtonTemplate);
        $(this).html(playerBarPlayButton);
        currentSoundFile.pause();
    }
    
};
  