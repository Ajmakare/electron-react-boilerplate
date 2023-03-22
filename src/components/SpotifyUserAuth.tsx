import React, { useState, useEffect } from 'react';
import { SpotifyAuth } from 'react-spotify-auth';
import SpotifyWebApi from 'spotify-web-api-node';
import Controls from './controls';
import ProgressBar from './ProgressBar';
import {ScaleLoader} from 'react-spinners';

import '../renderer/App.css';

const client_id = '';
const redirect_uri = 'http://localhost:1212';
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

  useEffect(() => {
    if (accessToken) {
      spotifyApi.setAccessToken(accessToken);
      spotifyApi.getMe().then((data: { body: any }) => {
        console.log(data.body);
      }).catch((error: any) => {
        console.error(error);
      });
      const intervalId = setInterval(() => getAndSetCurrentTrack(), 3000);
      return () => clearInterval(intervalId);
    }
  }, [accessToken]);
  
  const getAndSetCurrentTrack = async () => {
    try {
      const data = await spotifyApi.getMyCurrentPlayingTrack();
  
      if (data.body) {
        console.log('Now playing: ' + data.body.item!.name);
        setCurrentTrack(data);
        
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
        setTimeout(() =>  {
          getAndSetCurrentTrack();
        }, 500);
        setIsButtonDisabled(false);
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
        setTimeout(() =>  {
          getAndSetCurrentTrack();
        }, 500);
        setIsButtonDisabled(false);
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
                    </div>
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
