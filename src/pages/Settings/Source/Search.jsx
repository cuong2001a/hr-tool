import { SearchOutlined } from '@ant-design/icons';
import { Button, Input } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function Search({ filter, setFilter }) {
  const { t } = useTranslation();

  const [input, setInput] = useState(filter.keyword);

  useEffect(() => {
    if (filter.keyword) setInput(filter.keyword);
  }, [filter.keyword]);

  const handleSearch = () => {
    setFilter({ ...filter, keyword: input });
  };
  const onChangeInput = e => {
    const value = e.target.value;
    if (!value) setFilter({ ...filter, keyword: '' });
    setInput(value);
  };

  return (
    <div className="search">
      <div className="keyword">{t('source.keyword')}</div>
      <div style={{ height: 40, display: 'flex' }}>
        <Input
          className="source-search"
          placeholder={t('source.keywordPlaceholder')}
          allowClear
          style={{ width: 497 }}
          value={input}
          onChange={e => onChangeInput(e)}
          onKeyPress={e => {
            if (e.key === 'Enter') handleSearch();
          }}
        />
        <Button
          type="primary"
          icon={<SearchOutlined />}
          onClick={handleSearch}
        ></Button>
      </div>
    </div>
  );
}
