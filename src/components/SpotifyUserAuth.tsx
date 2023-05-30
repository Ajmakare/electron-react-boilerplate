import React, { useState, useEffect } from 'react';
import { SpotifyAuth } from 'react-spotify-auth';
import SpotifyWebApi from 'spotify-web-api-node';
import Controls from './controls';
import ProgressBar from './ProgressBar';
import {ScaleLoader} from 'react-spinners';
import { IoIosHeart } from "react-icons/io";

import '../renderer/App.css';

const client_id = '';
const redirect_uri = 'spotify-sensor-panel://callback';
const scopes = [  'user-read-playback-state',
'user-modify-playback-state',
'user-read-currently-playing',
'user-read-private',
'user-library-read',
'user-library-modify',
'user-read-email',];

const spotifyApi = new SpotifyWebApi({
  clientId: client_id,
  redirectUri: redirect_uri,
});

const SpotifyUserAuth = () => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [pause, setPause] = useState<boolean>(false);
  const [currentTrack, setCurrentTrack] = useState<any>(null);
  const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [isLiked, setIsLiked] = useState(false);
  const { ipcRenderer } = window.require('electron');

  useEffect(() => {
    const updateAccessToken = (event: Electron.IpcRendererEvent, url: string) => {
      console.log('URL:', url);

      // Everything from #access_token is considered as a hash
      const hash = url.split('#')[1];

      // Parse the hash part
      const params = new URLSearchParams(hash);
      const accessToken = params.get('access_token');
      
      // Use the accessToken
      setAccessToken(accessToken);
    };

    ipcRenderer.on('authCode', updateAccessToken);

    return () => {
      ipcRenderer.removeListener('authCode', updateAccessToken);
    };
  }, []);

  useEffect(() => {
      if (accessToken) {
        // Set the accessToken in the SpotifyWebApi instance
        spotifyApi.setAccessToken(accessToken);
        
        // Begin to load track information
        getAndSetCurrentTrack();
      }
  }, [accessToken]);

  useEffect(() => {
    if (accessToken) {
      let interval = setInterval(() => {
        updateProgress();
      }, 1000); // 1000 ms = 1 sec, adjust according to your needs
  
      return () => {
        clearInterval(interval);
      }
    }
  }, [accessToken]);

  const updateProgress = async () => {
    try {
      const data = await spotifyApi.getMyCurrentPlaybackState();
      setProgress(data.body?.progress_ms ?? 0);
    } catch (err) {
      console.log('Something went wrong!', err);
    }
  };
  const getAndSetCurrentTrack = async () => {
    try {
      const data = await spotifyApi.getMyCurrentPlayingTrack();
  
      if (data.body) {
        console.log('Now playing: ' + data.body.item!.name);
        setCurrentTrack(data);
        
        const isTrackLiked = await spotifyApi.containsMySavedTracks([data.body.item!.id]);

        if (isTrackLiked.body[0]) {
          setIsLiked(true);
        } else {
          setIsLiked(false);
        }

        const playbackState = await spotifyApi.getMyCurrentPlaybackState();
        console.log(playbackState);
        setPause(!playbackState.body?.is_playing);
        setProgress(playbackState.body?.progress_ms ?? 0);
        setDuration(playbackState.body?.item?.duration_ms ?? 0);
      }
    } catch (err) {
      console.log('Something went wrong!', err);
    }
  };
  
  const playPauseTrack = async () => {
    if (!isButtonDisabled) {
      setIsButtonDisabled(true);
      try {
        const data = await spotifyApi.getMyCurrentPlaybackState();
        if (data.body && data.body.is_playing) {
          await spotifyApi.pause();
        } else {
          await spotifyApi.play();
        }
        setPause(!pause);
        console.log("Play/pause button clicked");
        setTimeout(() => setIsButtonDisabled(false), 500);
      } catch (err) {
        console.log('Something went wrong!', err);
        setIsButtonDisabled(false);
      }
    }
  };
  
  const skipTrack = async () => {
    if (!isButtonDisabled) {
      setIsButtonDisabled(true);
      try {
        await spotifyApi.skipToNext();
        // Wait for a short amount of time to ensure the track has changed
        setTimeout(async () => {
          await getAndSetCurrentTrack();
          setIsButtonDisabled(false);
        }, 1000); // 1000 ms = 1 second, adjust as needed
      } catch (err) {
        console.log('Something went wrong!', err);
        setIsButtonDisabled(false);
      }
    }
  };
  
  const prevTrack = async () => {
    if (!isButtonDisabled) {
      setIsButtonDisabled(true);
      try {
        await spotifyApi.skipToPrevious();
        // Wait for a short amount of time to ensure the track has changed
        setTimeout(async () => {
          await getAndSetCurrentTrack();
          setIsButtonDisabled(false);
        }, 1000); // 1000 ms = 1 second, adjust as needed
      } catch (err) {
        console.log('Something went wrong!', err);
        setIsButtonDisabled(false);
      }
    }
  };

  const likeTrack = async () => {
    if (!isButtonDisabled) {
      setIsButtonDisabled(true);
      try {
        if (isLiked) {
          await spotifyApi.removeFromMySavedTracks([currentTrack.body.item!.id]);
          setIsLiked(false); // set the status of the track to "unliked"
          setIsButtonDisabled(false);
          return;
        }
        else{
          await spotifyApi.addToMySavedTracks([currentTrack.body.item!.id]);
          setIsLiked(true); // set the status of the track to "liked"
          setIsButtonDisabled(false);
        }
      } catch (err) {
        console.log('Something went wrong!', err);
        setIsButtonDisabled(false);
      }
    }
  };

  const onAccessToken = (token: string) => {
    setAccessToken(token);
  };

  return (
    <div >
      {accessToken ? (
        <div id = "controlsContainer">
          {currentTrack ? (
            <div style = {{display:'flex', flexDirection:'column'}}> 
              <div id = 'top_container'>
                  <img id = 'album_cover' src={currentTrack.body.item!.album.images[0].url} alt="Album cover" />
                  <div id = "buttons_and_progress">
                      <Controls 
                        playPauseTrack={playPauseTrack} 
                        skipTrack={skipTrack} 
                        prevTrack={prevTrack} 
                        pause={pause}
                        />
                      <ProgressBar progress={progress} duration={duration} />
                      <IoIosHeart id='like_button' className={isLiked ? 'liked' : 'not-liked'} onClick={likeTrack}/>                    </div>
              </div>
              <div id = 'bottom_container'>
                <h1 id = 'song_text'>{currentTrack.body.item!.name}</h1>
                <h1 id = 'artist_text'>By {currentTrack.body.item!.artists[0].name}</h1>
              </div>
          </div>
          ) : (
              <ScaleLoader color={'#1DB954'}/>
          )}

        </div>
      ) : (
        <div className = "continue_spotify">
          <h1 id = 'title'>Spotify Player for Sensor Panels</h1>
          <span>Note: you must have Spotify opened before clicking Continue with Spotify!</span>
          <br></br>
          <SpotifyAuth
          clientID={client_id}
          redirectUri={redirect_uri}
          scopes={scopes}
          onAccessToken={onAccessToken}
        />
        </div>
      )}
    </div>
  );
}

export { SpotifyUserAuth };
