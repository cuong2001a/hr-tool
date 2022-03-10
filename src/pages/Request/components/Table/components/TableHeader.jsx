import { Button, Checkbox, Dropdown, Menu, message, Tooltip } from 'antd';
import { Excel } from 'antd-table-saveas-excel';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useSelector } from 'react-redux';
import requestApi from '../../../../../api/requestApi';
import {
  ExportIcon,
  FullScreenIcon,
  ShowHideIcon,
} from '../../../../../constants/languagePage';
import { LIST_REQUEST_STATUS } from '../../../../../constants/requestPage';

function HeaderRequestTable({
  handleFullScreen,
  listColumns,
  onChangeColumns,
  listParams,
}) {
  const { t } = useTranslation();

  const [visibleDropdown, setVisibleDropdown] = useState(false);
  const totalRecords = useSelector(state => state.request.totalRecords);

  const fetchListRequest = async () => {
    try {
      const newParams = { ...listParams };
      // call api with full record ( limit = totalRecords )
      const response = await requestApi.getAll({
        ...newParams,
        limit: totalRecords,
      });

      if (response.data.data && response.data.data.length > 0) {
        const listRequestToExport = response.data.data.map(request => {
          const idx = request.status;
          return {
            ...request,
            status: LIST_REQUEST_STATUS[idx].text,
          };
        });
        handleExportToExcel(listRequestToExport);
      }
    } catch (error) {
      message.error(t('request.failToFetchListRequest'));
    }
  };

  const TableContent = () => (
    <Menu>
      {listColumns
        .filter(col => col.id !== 1 && col.hasExported)
        .map(col => (
          <Menu.Item key={col.id}>
            <Checkbox
              onChange={handleChangeCheckbox}
              value={col.id}
              checked={col.isShow}
            >
              {col.title}
            </Checkbox>
          </Menu.Item>
        ))}
    </Menu>
  );

  const handleChangeCheckbox = e => {
    const { value, checked } = e.target;
    onChangeColumns(prev => {
      return prev.map(col => {
        if (col.id === value) {
          col.isShow = checked;
        }
        return col;
      });
    });
  };

  const handleChangeVisibleDropdown = flag => {
    setVisibleDropdown(flag);
  };

  const handleExportClick = () => {
    fetchListRequest();
  };

  const handleExportToExcel = dataSource => {
    const excel = new Excel();

    excel
      .addSheet('List Request')
      .addColumns(
        listColumns
          .filter(col => col.hasExported && col.isShow)
          .map(col => {
            if (col.dataIndex === 'status') {
              col.render = status => status;
            }
            return col;
          }),
      )
      .addDataSource(dataSource)
      .saveAs('listRequest.xlsx');
  };

  return (
    <>
      <section className="request__table--actions">
        <Tooltip title={t('request.exportTooltip')} color="blue">
          <Button icon={<ExportIcon />} onClick={handleExportClick} />
        </Tooltip>
        <Dropdown
          overlay={TableContent}
          placement="bottom"
          visible={visibleDropdown}
          onVisibleChange={handleChangeVisibleDropdown}
        >
          <Tooltip title={t('request.showColumnTooltip')} color="blue">
            <Button icon={<ShowHideIcon />}></Button>
          </Tooltip>
        </Dropdown>
        <Tooltip title={t('request.fullScreenTooltip')} color="blue">
          <Button
            icon={<FullScreenIcon />}
            onClick={handleFullScreen.enter}
          ></Button>
        </Tooltip>
      </section>
    </>
  );
}

export default HeaderRequestTable;
