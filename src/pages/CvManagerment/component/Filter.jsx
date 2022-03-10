import React, { memo, useState } from 'react';
import { SearchOutlined } from '@ant-design/icons';
import { Button, Input, Select } from 'antd';
import { useTranslation } from 'react-i18next';
import { CV_STEP } from '../../../constants';

const Filter = memo(props => {
  const [keyword, setKeyword] = useState('');
  const [step, setStep] = useState('');
  const [pos, setPos] = useState('');
  const [level, setLevel] = useState('');
  const [assign, setAssign] = useState('');

  const { t } = useTranslation();
  const { setFilter, posApi, levelApi, assignApi } = props;
  const { Option, OptGroup } = Select;
  const changeSearchQuery = val => {
    setKeyword(val.target.value);
  };
  const changeStepSearch = val => {
    setStep(val.join('-'));
  };
  const changePosition = val => {
    setPos(val.join('-'));
  };
  const changeLevel = val => {
    setLevel(val.join('-'));
  };
  const changeAssign = val => {
    setAssign(val.join('-'));
  };
  const onSearch = () => {
    setFilter(prev => ({
      ...prev,
      keyword,
      step,
      position_id: pos,
      level_id: level,
      interviewer_id: assign,
    }));
  };
  return (
    <div className="cv__filter-box">
      <div className="filter-box__items">
        <div>{t('cv.step')}</div>
        <div className="box-search__filter box-search">
          <Select
            className="width-152"
            placeholder={t('role.all')}
            mode="multiple"
            allowClear
            showArrow
            maxTagCount={'responsive'}
            onChange={changeStepSearch}
          >
            {CV_STEP.map(e => (
              <Option value={e.id} key={e.id}>
                {t(`cv.${e.title}`)}
              </Option>
            ))}
          </Select>
        </div>
      </div>
      <div className="filter-box__items">
        <div>{t('cv.position')}</div>
        <div className="box-search__filter box-search">
          <Select
            className="width-152"
            placeholder={t('role.all')}
            mode="multiple"
            allowClear
            showArrow
            maxTagCount={'responsive'}
            onChange={changePosition}
          >
            {Object.keys(posApi).map((key, id) => {
              if (key === 'null') {
                return;
              }
              return (
                <OptGroup label={key} value={id} key={id}>
                  {posApi[key].map(value => (
                    <Option key={value.id} value={value.id}>
                      {value.title}
                    </Option>
                  ))}
                </OptGroup>
              );
            })}
          </Select>
        </div>
      </div>
      <div className="filter-box__items">
        <div>{t('cv.level')}</div>
        <div className="box-search__filter box-search">
          <Select
            className="width-152"
            placeholder={t('role.all')}
            mode="multiple"
            allowClear
            showArrow
            maxTagCount={'responsive'}
            onChange={changeLevel}
          >
            {levelApi.map(e => (
              <Option value={e.id} key={e.id}>
                {e.title}
              </Option>
            ))}
          </Select>
        </div>
      </div>
      <div className="filter-box__items">
        <div>{t('cv.assignee')}</div>
        <div className="box-search__filter box-search">
          <Select
            className="width-152"
            placeholder={t('role.all')}
            mode="multiple"
            allowClear
            showArrow
            onChange={changeAssign}
            maxTagCount={'responsive'}
          >
            {assignApi.map(e => (
              <Option value={e.username} key={e.username}>
                {e.username}
              </Option>
            ))}
          </Select>
        </div>
      </div>

      <div className="filter-box__items">
        <div>{t('typework.keyword')}</div>
        <div className="box-search__filter box-search">
          <Input
            placeholder={t('source.keywordPlaceholder')}
            onChange={changeSearchQuery}
            value={keyword}
          />
          <Button
            type="primary"
            icon={<SearchOutlined />}
            onClick={onSearch}
          ></Button>
        </div>
      </div>
    </div>
  );
});
export default Filter;
