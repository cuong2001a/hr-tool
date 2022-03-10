import {
  EyeOutlined,
  FullscreenOutlined,
  FullscreenExitOutlined,
} from '@ant-design/icons';
import ExportIcon from '../../../assets/images/tableIcon/export-icon.svg';
import { Button, Dropdown, Menu, Tooltip } from 'antd';
import Checkbox from 'antd/lib/checkbox/Checkbox';
import sourceApi from '../../../api/sourceApi';
import { Excel } from 'antd-table-saveas-excel';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

function FullScreenButton({ handleFullScreen }) {
  const isFull = handleFullScreen.active;
  const { t } = useTranslation();

  const handleClick = () => {
    if (isFull) handleFullScreen.exit();
    else handleFullScreen.enter();
  };

  return isFull ? (
    <Tooltip title={t('language.fullScreenTooltip')} color="blue">
      <FullscreenExitOutlined
        className="source__table-utility-icon"
        onClick={handleClick}
      />
    </Tooltip>
  ) : (
    <Tooltip title={t('language.fullScreenTooltip')} color="blue">
      <FullscreenOutlined
        className="source__table-utility-icon"
        onClick={handleClick}
      />
    </Tooltip>
  );
}

export default function UtilityIcons({
  handleFullScreen,
  columns,
  setColumns,
  filter,
  total,
}) {
  const { t } = useTranslation();
  const [visibleDropdown, setVisibleDropdown] = useState(false);

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
  const EyeMenu = () => {
    return (
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
  };

  const handleExportToExcel = sources => {
    const excel = new Excel();
    excel
      .addSheet('sourceList')
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
      .saveAs('sourceList.xlsx');
  };

  const fetchApiForExport = async () => {
    try {
      const response = await sourceApi.getAll({
        ...filter,
        limit: total,
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

  const handleExport = () => {
    fetchApiForExport();
  };

  return (
    <div className="source__table-utility">
      <Tooltip title={t('language.exportTooltip')} color="blue">
        <img
          src={ExportIcon}
          alt=""
          className="source__table-utility-icon export-icon"
          onClick={handleExport}
        />
      </Tooltip>

      <Dropdown
        overlay={EyeMenu}
        trigger={['click']}
        visible={visibleDropdown}
        onVisibleChange={setVisibleDropdown}
      >
        <Tooltip title={t('language.showColumnTooltip')} color="blue">
          <EyeOutlined className="source__table-utility-icon" />
        </Tooltip>
      </Dropdown>

      <FullScreenButton handleFullScreen={handleFullScreen} />
    </div>
  );
}
