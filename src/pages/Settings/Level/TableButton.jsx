import { DeleteOutlined } from '@ant-design/icons';
import { Button, Dropdown, Menu, Tooltip } from 'antd';
import { Excel } from 'antd-table-saveas-excel';
import Checkbox from 'antd/lib/checkbox/Checkbox';
import { t } from 'i18next';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getLevel } from '../../../api/level/levelApi';
import {
  ExportIcon,
  FullScreenIcon,
  ShowHideIcon,
} from '../../../constants/languagePage';

const TableButton = props => {
  const {
    columns,
    filter,
    handleFullScreen,
    setColumns,
    selectedRowKeys,
    setSelectedRowkeys,
    loading,
    setLoading,
  } = props;
  const { t } = useTranslation();
  const [visibleDropdown, setVisibleDropdown] = useState(false);

  const handleExport = () => {
    fetchApiForExport();
  };

  const fetchApiForExport = async () => {
    try {
      const response = await getLevel({
        ...filter,
        limit: 0,
      });
      if (response.data.data && response.data.data.length > 0) {
        const sourcesToExport = response.data.data.map(source => ({
          ...source,
          status: source.status ? t('source.active') : t('source.locking'),
        }));
        handleExportToExcel(sourcesToExport);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleExportToExcel = sources => {
    const excel = new Excel();
    excel
      .addSheet('levelList')
      .addColumns(
        columns
          .filter(col => col.export && col.show)
          .map(col => {
            if (col.dataIndex === 'status') {
              col.render = status => status;
            }
            return col;
          }),
      )
      .addDataSource(sources)
      .saveAs('levelList.xlsx');
  };
  const hasSelected = selectedRowKeys?.length > 0;
  const removeLevel = async () => {};
  const handleChangeVisibleCheckbox = (e, id) => {
    setColumns(prev => {
      return prev.map(col => {
        if (col.id === id) {
          col.show = e.target.checked;
        }
        return col;
      });
    });
  };

  const menu = (
    <Menu>
      {columns
        .filter(col => col.id !== 1 && col.export)
        .map(col => {
          return (
            <Menu.Item key={col.id}>
              <Checkbox
                onChange={e => handleChangeVisibleCheckbox(e, col.id)}
                value={col.id}
                checked={col.show}
              >
                {col.title}
              </Checkbox>
            </Menu.Item>
          );
        })}
    </Menu>
  );
  return (
    <>
      <div className="level--actions">
        <Button
          icon={<DeleteOutlined />}
          disabled={!hasSelected}
          loading={loading}
          className="btn-remove"
          onClick={removeLevel}
        >
          {t('removeAll.removeAll')}
        </Button>
        <div>
          <Tooltip title={t('language.exportTooltip')} color="blue">
            <Button onClick={handleExport} icon={<ExportIcon />}></Button>
          </Tooltip>
          <Dropdown
            overlay={menu}
            type="press"
            placement="bottom"
            trigger={['click']}
            visible={visibleDropdown}
            onVisibleChange={setVisibleDropdown}
          >
            <Tooltip title={t('language.showColumnTooltip')} color="blue">
              <Button icon={<ShowHideIcon />}></Button>
            </Tooltip>
          </Dropdown>
          <Tooltip title={t('language.fullScreenTooltip')} color="blue">
            <Button
              onClick={handleFullScreen}
              icon={<FullScreenIcon />}
            ></Button>
          </Tooltip>
        </div>
      </div>
    </>
  );
};

export default TableButton;
