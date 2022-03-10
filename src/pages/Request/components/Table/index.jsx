import React, { useState } from 'react';
import { FullScreen, useFullScreenHandle } from 'react-full-screen';
import ContentRequestTable from './components/TableContent';
import HeaderRequestTable from './components/TableHeader';

function RequestTable({
  listParams,
  onChangeListParams,
  onChangeTitleForm,
  onChangeTitleButtonForm,
}) {
  const [listColumns, setListColumns] = useState([]);
  const handleFullScreen = useFullScreenHandle();

  return (
    <div className="request__table">
      <HeaderRequestTable
        handleFullScreen={handleFullScreen}
        listColumns={listColumns}
        onChangeColumns={setListColumns}
        listParams={listParams}
      />
      <FullScreen handle={handleFullScreen}>
        <ContentRequestTable
          listColumns={listColumns}
          onChangeColumns={setListColumns}
          listParams={listParams}
          onChangeListParams={onChangeListParams}
          onChangeTitleForm={onChangeTitleForm}
          onChangeTitleButtonForm={onChangeTitleButtonForm}
        />
      </FullScreen>
    </div>
  );
}

export default RequestTable;
