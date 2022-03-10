import { Table, Pagination, message } from 'antd';
import React from 'react';
import TableButton from './tableButton';
import { pageSizeOptions } from '../../../../../constants';
import { useDispatch, useSelector } from 'react-redux';
import { changeSorter } from '../../../commonSlice/userSlice';
import lodash from 'lodash';
import { FullScreen, useFullScreenHandle } from 'react-full-screen';
import { useTranslation } from 'react-i18next';
import { Excel } from 'antd-table-saveas-excel';
import { settingUserApi } from '../../../../../api/settingUserApi';
import { USER_URL } from '../../../../../constants/api';
/**
 * @author
 * @function TableUser
 **/

const TableUser = props => {
  const { t } = useTranslation();
  const { sorter } = useSelector(state => state.user);
  const dispatch = useDispatch();
  const changeFilterSort = sorter => {
    if (sorter.order === 'ascend') {
      dispatch(changeSorter(sorter.field + '-ASC'));
    } else if (sorter.order === 'descend') {
      dispatch(changeSorter(sorter.field + '-DESC'));
    } else {
      dispatch(changeSorter(''));
    }
  };
  const delayFilter = lodash.debounce(changeFilterSort, 100);
  const onTableChange = (col, filter, sorter) => {
    setTimeout(() => {
      delayFilter(sorter);
    }, 100);
  };
  const onPageChange = (page, pageSize) => {
    props.setCurrent(page);
    props.setPageSize(pageSize);
  };
  const handleFullscreen = useFullScreenHandle();
  const handleExport = async () => {
    try {
      const excel = new Excel();
      const res = await settingUserApi.getAll(USER_URL, {
        limit: props.total,
        page: 1,
        orderby: sorter,
      });
      if (res.data.status === 'success') {
        const fillCol = props.columns.filter(e => e.export && e.show);
        excel
          .addSheet('User')
          .addColumns(
            fillCol.map(e => {
              if (e.dataIndex === 'status') {
                e.render = value => (value ? t('user.access') : t('user.lock'));
              }
              return e;
            }),
          )
          .addDataSource(res.data.data)
          .saveAs('Users.xlsx');
      }
    } catch (e) {
      message.error(e.message);
    }
  };
  return (
    <FullScreen handle={handleFullscreen} className="fullscreen-table">
      <div className="table-container">
        <TableButton
          handleFullscreen={handleFullscreen}
          setColumns={props.setColumns}
          columns={props.columns}
          handleExport={handleExport}
        />

        <Table
          columns={props.columns.filter(e => e.show)}
          dataSource={props.data}
          rowKey="username"
          size="small"
          scroll={{ x: 900 }}
          loading={props.loading}
          onChange={onTableChange}
          pagination={false}
        />
        <Pagination
          className="pagination"
          total={props.total}
          onChange={onPageChange}
          pageSize={props.pageSize}
          showQuickJumper={true}
          size="default"
          current={props.current}
          pageSizeOptions={pageSizeOptions}
          showSizeChanger={true}
        />
      </div>
    </FullScreen>
  );
};
export default React.memo(TableUser);
