import {
  EyeOutlined,
  FullscreenExitOutlined,
  FullscreenOutlined,
} from '@ant-design/icons';
import ExportIcon from '../../../../assets/images/tableIcon/export-icon.svg';
import { Dropdown, Menu, Tooltip } from 'antd';
import { Excel } from 'antd-table-saveas-excel';
import Checkbox from 'antd/lib/checkbox/Checkbox';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import typeworkApi from '../../../../api/typeworkApi';

function FullScreenButton({ handleFullScreen }) {
  const isFull = handleFullScreen.active;

  const handleClick = () => {
    if (isFull) handleFullScreen.exit();
    else handleFullScreen.enter();
  };

  return isFull ? (
    <FullscreenExitOutlined
      className="source__table-utility-icon"
      onClick={handleClick}
    />
  ) : (
    <FullscreenOutlined
      className="source__table-utility-icon"
      onClick={handleClick}
    />
  );
}

const ActionBar = ({ handleFullScreen, columns, setColumns, filter }) => {
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
      .addSheet('typeworkList')
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
      .saveAs('typeworkList.xlsx');
  };

  const fetchApiForExport = async () => {
    try {
      const response = await typeworkApi.getAll({
        ...filter,
      });
      if (response.data.data && response.data.data.length > 0) {
        const sourcesToExport = response.data.data.map(source => ({
          ...source,
          status: source.status ? t('typework.active') : t('typework.locking'),
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
    <div className="action">
      <Tooltip title={t('language.exportTooltip')} color="blue">
        <button type="button" className="btn-action" onClick={handleExport}>
          <img
            src={ExportIcon}
            alt=""
            className="source__table-utility-icon export-icon"
            onClick={handleExport}
          />
        </button>
      </Tooltip>

      <Dropdown
        overlay={EyeMenu}
        trigger={['click']}
        visible={visibleDropdown}
        onVisibleChange={setVisibleDropdown}
      >
        <Tooltip title={t('language.showColumnTooltip')} color="blue">
          <button type="button" className="btn-action">
            <EyeOutlined className="source__table-utility-icon" />
          </button>
        </Tooltip>
      </Dropdown>
      <Tooltip title={t('language.fullScreenTooltip')} color="blue">
        <button type="button" className="btn-action">
          <FullScreenButton handleFullScreen={handleFullScreen} />
        </button>
      </Tooltip>
    </div>
  );
};
export default ActionBar;
