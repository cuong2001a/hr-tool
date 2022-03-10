import { Input } from 'antd';
import React from 'react';
import { Controller } from 'react-hook-form';

function InputField({ name, label, form, placeholder }) {
  const { control } = form;

  return (
    <Controller
      name={name}
      control={control}
      label={label}
      render={({ field: { onChange, onBlur, value, name, ref } }) => (
        <Input
          onBlur={onBlur} // notify when input is touched
          onChange={onChange} // send value to hook form
          checked={value}
          placeholder={placeholder}
        />
      )}
    />
  );
}

export default InputField;
