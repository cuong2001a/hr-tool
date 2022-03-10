import React, { memo } from 'react';
import {
  ExportOutlined,
  EyeOutlined,
  FullscreenOutlined,
} from '@ant-design/icons';

const ActionBar = memo(props => {
  return (
    <div className="action">
      <button type="button" className="btn-action">
        <ExportOutlined />
      </button>
      <button type="button" className="btn-action">
        <EyeOutlined />
      </button>
      <button type="button" className="btn-action">
        <FullscreenOutlined />
      </button>
    </div>
  );
});
export default ActionBar;
