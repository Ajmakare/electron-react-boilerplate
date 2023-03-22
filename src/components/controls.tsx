import React from 'react';
import '../renderer/App.css';
import { SlArrowLeft, SlArrowRight, SlControlPlay, SlControlPause } from "react-icons/sl";

// https://react-icons.github.io/react-icons/icons?name=gr

interface Props {
    playPauseTrack: () => void;
    prevTrack: () => void;
    skipTrack: () => void;
    pause: boolean;
  }
  
  
  const Controls: React.FC<Props> = ({ playPauseTrack, prevTrack, skipTrack, pause }) => {
    return (
      <div id = "button_container">
      <button className = 'buttons' onClick={() => prevTrack()}><SlArrowLeft className = "button_images"  /></button>
      {pause ? (
        <button className = 'buttons' onClick={() => playPauseTrack()}><SlControlPlay className = "button_images"/></button>
        ) : (
          <button className = 'buttons' onClick={() => playPauseTrack()}><SlControlPause className = "button_images"/></button>
          )
        }
      <button className = 'buttons' onClick={() => skipTrack()}><SlArrowRight className = "button_images"/></button>
    </div>
    );
}

export default Controls;