import React from 'react';
import exportIcon from '../../../../../../assets/images/tableIcon/export.svg';
import resize from '../../../../../../assets/images/tableIcon/resize.svg';
import eye from '../../../../../../assets/images/tableIcon/Vector.svg';
import { Popover, Space, Tooltip } from 'antd';
import Checkbox from 'antd/lib/checkbox/Checkbox';
import { useTranslation } from 'react-i18next';

/**
 * @author
 * @function TableButton
 **/

const TableButton = props => {
  const { columns } = props;
  const { t } = useTranslation();

  return (
    <div className="table-container__button">
      <Tooltip title={t('language.exportTooltip')} color="blue">
        <span className="icon-table" onClick={props.handleExport}>
          <img src={exportIcon} alt="export" />
        </span>
      </Tooltip>

      <Popover
        content={<PopContent columns={columns} setColumns={props.setColumns} />}
        trigger="hover"
        placement="bottom"
      >
        <Tooltip title={t('language.showColumnTooltip')} color="blue">
          <span className="icon-table">
            <img src={eye} alt="eyes" />
          </span>
        </Tooltip>
      </Popover>
      <Tooltip title={t('language.fullScreenTooltip')} color="blue">
        <span
          className="icon-table icon-enter"
          onClick={props.handleFullscreen && props.handleFullscreen.enter}
        >
          <img src={resize} alt="resize" />
        </span>
      </Tooltip>
    </div>
  );
};

export default React.memo(TableButton);

const PopContent = props => {
  const { columns, setColumns } = props;

  return (
    <Space direction="vertical" size={'small'} style={{ padding: '10px' }}>
      {columns &&
        columns
          .filter(
            filter =>
              filter.export &&
              filter.dataIndex !== 'username' &&
              filter.dataIndex !== 'id',
          )
          .map(e => (
            <Checkbox
              key={e.key}
              checked={e.show}
              onClick={event => {
                setColumns(
                  columns.map(prev => {
                    if (prev.dataIndex === e.dataIndex) {
                      return {
                        ...prev,
                        show: !e.show,
                      };
                    }
                    return prev;
                  }),
                );
              }}
            >
              {e.title}
            </Checkbox>
          ))}
    </Space>
  );
};
