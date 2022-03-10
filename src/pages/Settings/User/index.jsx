import React from 'react';
import UserBody from './userBody';
import UserHeader from './userHeader';

function User(props) {
  return (
    <div className="user-setting-wrapper">
      <UserHeader />
      <UserBody />
    </div>
  );
}

export default User;
