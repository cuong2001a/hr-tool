import { Button, Table } from 'antd';
import { t } from 'i18next';
import { useState, useEffect } from 'react';
import { getHistoryCv } from '../../../api/historyCv';
import { steps } from '../../..//constants/cvDetail';
import { getLevelById } from '../../../api/level/levelApi';
import { positionApi } from '../../../api/positionApi';
import { settingUserApi2 } from '../../../api/settingUserApi';
import moment from 'moment';
import {
  CONFIG_PAGINATION,
  DATE_FORMAT_ONBOARD,
  DEFAULT_FILTER,
} from '../../../constants';
import { useParams } from 'react-router-dom';

const DetailHrView = props => {
  const { valuesCv, setVisible } = props;
  const { id } = useParams();

  const [filter, setFilter] = useState(DEFAULT_FILTER);
  const [totalRecord, setTotalRecord] = useState(0);
  const [position, setPosition] = useState('');
  const [department, setDeparment] = useState('');
  const [level, setLevel] = useState('');
  const [people, setPeople] = useState({});
  const [listImages, setListImage] = useState([]);
  const [image, setImage] = useState('');
  const [history, setHistory] = useState([]);
  const [viewMoreMode, setViewMoreMode] = useState(false);

  useEffect(() => {
    if (valuesCv.images) {
      const listImage = JSON.parse(valuesCv.images);
      setListImage(listImage);
      setImage(listImage[0]);
    }
  }, [valuesCv]);

  useEffect(() => {
    getHistory();
  }, [filter]);

  useEffect(() => {
    getPosition();
    getPeople();
  }, [valuesCv]);

  const onChange = e => {
    setFilter({
      page: e.current,
      limit: e.pageSize,
    });
  };

  const getPosition = async () => {
    try {
      const resPosition = await positionApi.getPositionById(
        valuesCv.position_id,
      );
      const resLevel = await getLevelById(valuesCv.level_id);
      if (resPosition.status === 200) {
        setPosition(resPosition.data.data.title);
        const resDepartment = await positionApi.getPositionById(
          resPosition.data.data.parent_id,
        );
        if (resDepartment.status === 200) {
          setDeparment(resDepartment.data.data.title);
        }
      }
      if (resLevel.status === 200) {
        setLevel(resLevel.data.data.title);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const getPeople = async () => {
    let people2 = {};

    const getPerson = async (valuesKey, personKey) => {
      const personRes = await settingUserApi2.getById(valuesCv[valuesKey]);
      console.log(personRes);
      if (personRes.status === 200) {
        const fullname = personRes.data.data.fullname;
        people2 = {
          ...people2,
          [personKey]: fullname
            ? `${fullname} (${valuesCv[valuesKey]})`
            : `${valuesCv[valuesKey]}`,
        };
      }
    };
    try {
      await getPerson('reviewer_id', 'reviewer');
      await getPerson('interviewer_id', 'interviewer');
      setPeople(people2);
    } catch (e) {
      console.log(e);
    }
  };

  const getHistory = async () => {
    await getHistoryCv({ ...filter, cv_id: id })
      .then(res => {
        setHistory(res.data.data);
        setTotalRecord(res.data.total);
      })
      .catch(e => {
        console.log(e);
      });
  };
  const handleChangeImage = e => {
    setImage(e);
  };
  const columns = [
    {
      title: '#',
      dataIndex: 'id',
      key: 'id',
      width: '5%',
      align: 'center',
    },
    {
      title: t('cv.date'),
      width: '15%',
      dataIndex: 'datecreate',
      key: 'datecreate',
      align: 'center',
      render: e => moment.unix(e).format(DATE_FORMAT_ONBOARD),
    },
    {
      title: t('cv.description'),
      dataIndex: 'description',
      key: 'description',
    },
  ];

  const limitDescription = str => {
    const DESCRIPTION_MAX_LENGTH = 400;
    const condition = str?.length > DESCRIPTION_MAX_LENGTH;

    if (!viewMoreMode) {
      if (condition) str = str.slice(0, DESCRIPTION_MAX_LENGTH) + '...';
      return (
        <h4 className="description-limit">
          {str}
          {condition && (
            <a style={{ marginLeft: 0 }} onClick={() => setViewMoreMode(true)}>
              {' '}
              {t('cvDetail.more')}
            </a>
          )}
        </h4>
      );
    } else {
      return (
        <h4 className="description-limit">
          {str}
          {condition && (
            <a style={{ marginLeft: 0 }} onClick={() => setViewMoreMode(false)}>
              {' '}
              {t('cvDetail.hide')}
            </a>
          )}
        </h4>
      );
    }
  };

  const step = steps.find(step => step.id === valuesCv.step) || steps[0];

  return (
    <div>
      <div className="cv">
        <div className="cv-image">
          <div className="image-show">
            <img src={image} />
          </div>
          <div className="image-change">
            {listImages.length !== 0 &&
              listImages.map((item, index) => (
                <img
                  src={item}
                  key={index}
                  style={{ opacity: item === image ? 1 : 0.5 }}
                  onClick={e => handleChangeImage(e.target.src)}
                />
              ))}
          </div>
          <div className="image-psyco">
            <Button type="primary" onClick={() => setVisible(step.id)}>
              <b>{step.name}</b>
            </Button>
          </div>
        </div>
        <div className="cv-detail">
          <div className="cv-detail__infor">
            <p>{t('cv.detail.CV')}</p>
            <a
              href={valuesCv.linkcv}
              target="_blank"
              style={{ textDecoration: 'underline' }}
            >
              {t('cv.detail.views')}
            </a>
          </div>
          <div className="cv-detail__infor">
            <p>{t('cv.detail.fullname')}</p>
            <h4>{valuesCv.fullname}</h4>
          </div>
          <div className="cv-detail__infor">
            <p>{t('cv.detail.position')}</p>
            <h4>
              <span style={{ fontWeight: 400 }}>{department + ' -> '}</span>
              {position}
            </h4>
          </div>
          <div className="cv-detail__infor">
            <p>{t('cv.detail.level')}</p>

            <h4>{level}</h4>
          </div>
          <div className="cv-detail__infor">
            <p>{t('cv.detail.note')}</p>
            {limitDescription(valuesCv.description)}
          </div>
          <div className="cv-detail__infor">
            <p>{t('cv.detail.reviewer')}</p>

            <h4>{people.reviewer}</h4>
          </div>
          <div className="cv-detail__infor">
            <p>{t('cv.detail.interviewer')}</p>

            <h4>{people.interviewer}</h4>
          </div>
          {/* <div className="cv-detail__infor">
            <p>{t('cv.detail.assignee')}</p>

            <h4>{valuesCv.reviewer_id}</h4>
          </div> */}
          <Button type="primary" className="btn-edit">
            {t('cv.detail.edit')}
          </Button>
        </div>
      </div>
      <div className="cv-history">
        {history.length !== 0 && (
          <Table
            dataSource={history}
            columns={columns}
            rowKey="id"
            onChange={onChange}
            pagination={{
              ...CONFIG_PAGINATION,
              pageSize: filter.limit,
              total: totalRecord,
            }}
          />
        )}
      </div>
    </div>
  );
};

export default DetailHrView;
