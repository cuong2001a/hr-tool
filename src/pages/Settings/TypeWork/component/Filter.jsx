import { SearchOutlined } from '@ant-design/icons';
import { Button, Input } from 'antd';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

const Filter = ({ filter, setFilter }) => {
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
    <div>
      <div>{t('typework.keyword')}</div>
      <div className="box-search">
        <Input
          placeholder={t('source.keywordPlaceholder')}
          allowClear
          value={input}
          style={{ width: 497 }}
          onChange={e => onChangeInput(e)}
          onKeyPress={e => {
            if (e.key === 'Enter') handleSearch();
          }}
        />
        <Button
          type="primary"
          onClick={handleSearch}
          icon={<SearchOutlined />}
        ></Button>
      </div>
    </div>
  );
};
export default Filter;
