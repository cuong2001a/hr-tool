import { Button } from 'antd';
import React from 'react';

function ActionButton({ title, Icon }) {
  return (
    <Button type="text" icon={<Icon />}>
      {title}
    </Button>
  );
}

export default ActionButton;
