import { Button, Dropdown, Menu, Tooltip, Modal } from 'antd';
import { Excel } from 'antd-table-saveas-excel';
import Checkbox from 'antd/lib/checkbox/Checkbox';
import React from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import exportIcon from '../../../../assets/images/position/export.svg';
import eye from '../../../../assets/images/position/eye.svg';
import resize from '../../../../assets/images/position/zoom.svg';
import { positionApi } from '../../../../api/positionApi';
import { DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';

function TableButton(props) {
  const {
    columns,
    setColumns,
    handleFullScreen,
    selectedRowKeys,
    loading,
    setLoading,
    setSelectedRowkeys,
  } = props;
  const { totalPosition } = useSelector(item => item.position);
  const hasSelected = selectedRowKeys?.length > 0;
  const { t } = useTranslation();
  const handleChecked = (e, key) => {
    console.log(e);
    if (e.target.checked) {
      const newData = columns.map(item =>
        item.key === key ? { ...item, hide: true } : item,
      );
      setColumns(newData);
    } else {
      const newData = columns.map(item =>
        item.key === key ? { ...item, hide: false } : item,
      );
      setColumns(newData);
    }
  };
  const exportPosition = async () => {
    try {
      const item = {
        limit: totalPosition,
        page: '',
        key: '',
        orderby: 'id-ASC',
        column: '',
      };
      const { data } = await positionApi.getAllPosition(item);
      console.log(data.data);
      console.log(
        columns
          ?.filter(item => item.hide === true)
          ?.map(e => {
            if (e.dataIndex === 'status') {
              e.render = value =>
                value ? t('position.unlock') : t('position.lock');
            }
            if (e.dataIndex === 'requestor') {
              e.render = value => JSON.parse(value)?.join(',');
            }
            return e;
          }),
      );
      const excel = new Excel();
      console.log(excel);
      excel
        .addSheet('List position')
        .addColumns(
          columns
            ?.filter(item => item.export === true)
            ?.map(e => {
              if (e.dataIndex === 'status') {
                e.render = value =>
                  value ? t('position.unlock') : t('position.lock');
              }
              if (e.dataIndex === 'requestor') {
                e.render = value => JSON.parse(value)?.join(',');
              }
              if (e.dataIndex === 'title') {
                e.render = value => value;
              }
              if (e.dataIndex === 'description') {
                e.render = value => value;
              }
              return e;
            }),
        )
        .addDataSource(data.data)
        .saveAs('Position.xlsx');
    } catch (error) {
      console.log(error);
    }
  };
  const handleConfirmOk = () => {
    setTimeout(async () => {
      try {
        console.log(selectedRowKeys);
        const res = await positionApi.deletePosition(selectedRowKeys);
        console.log(res);
        setSelectedRowkeys([]);
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    }, 1000);
  };
  const removePosition = async () => {
    try {
      Modal.confirm({
        title: `${t('position.questionRemoveAll')} `,
        icon: <ExclamationCircleOutlined />,
        centered: false,
        content: `${selectedRowKeys.map(item => item)}`,
        onOk() {
          handleConfirmOk();
        },
        okType: 'danger',
        okText: t('position.yes'),
        cancelText: t('position.no'),
        width: 450,
      });
    } catch (error) {
      console.log(error);
    }
  };
  const menu = (
    <Menu>
      {columns
        .filter(item => item.key != 'id' && item.key != 'action')
        .map(item => (
          <Menu.Item key={item.key}>
            <Checkbox
              checked={item.hide}
              name={item.key}
              onChange={e => handleChecked(e, item.key)}
              style={{ marginRight: '4px' }}
            />
            {item.title}
          </Menu.Item>
        ))}
    </Menu>
  );
  return (
    <div className="table-container__button">
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Button
          icon={<DeleteOutlined />}
          disabled={!hasSelected}
          loading={loading}
          className="btn-remove"
          onClick={removePosition}
        >
          {t('removeAll.removeAll')}
        </Button>
        <span style={{ fontSize: '14px', marginLeft: 8 }}>
          {hasSelected ? `selected ${selectedRowKeys.length} item` : ''}
        </span>
      </div>

      <div>
        <Tooltip
          placement="top"
          title={t('position.exportTooltip')}
          color="blue"
        >
          <Button onClick={exportPosition} className="btn-function">
            <img src={exportIcon} alt="export" />
          </Button>
        </Tooltip>

        <Tooltip
          placement="top"
          title={t('position.showColumnTooltip')}
          color="blue"
        >
          <Dropdown
            overlay={menu}
            trigger={['click']}
            placement="bottomRight"
            arrow
          >
            <Button className="btn-function">
              <img src={eye} alt="eyes" />
            </Button>
          </Dropdown>
        </Tooltip>

        <Tooltip placement="top" title={t('position.zoomTooltip')} color="blue">
          <Button className="btn-function" onClick={handleFullScreen.enter}>
            <img src={resize} alt="resize" />
          </Button>
        </Tooltip>
      </div>
    </div>
  );
}

export default TableButton;
