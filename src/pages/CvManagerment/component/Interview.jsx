import { Menu } from 'antd';
import React, { memo, useState } from 'react';
import HRInterview from './HRInterview';
import TechInterview from './TechInterview';

const Interview = memo(({ setVisible }) => {
  const [mode, setMode] = useState('hr');
  return (
    <div className="interview">
      <Menu mode="horizontal" defaultSelectedKeys={['1']}>
        <Menu.Item key="1" onClick={() => setMode('hr')}>
          HR Interview
        </Menu.Item>
        <Menu.Item key="2" onClick={() => setMode('tech')}>
          Technical Interview
        </Menu.Item>
      </Menu>
      <div className="interview-content">
        {mode === 'hr' ? (
          <HRInterview setVisible={setVisible} />
        ) : (
          <TechInterview setVisible={setVisible} />
        )}
      </div>
    </div>
  );
});

export default Interview;
