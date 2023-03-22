import React from 'react';

interface ProgressBarProps {
  progress: number;
  duration: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress, duration}) => {

  const progressBarStyles = {
    width: (progress * 100 / duration) + '%',
  };
  return (
    <div className="progress">
    <div
      className="progress__bar"
      style={progressBarStyles}
    />
</div>
  );
};

export default ProgressBar;
