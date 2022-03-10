import React from 'react';
import LevelContent from './LevelContent';
import LevelHeader from './LevelHeader';

function Level(props) {
  return (
    <div className="level">
      <LevelHeader />
      <LevelContent />
    </div>
  );
}

export default Level;
