import { Button, Checkbox, Dropdown, Menu, message, Tooltip } from 'antd';
import { Excel } from 'antd-table-saveas-excel';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import languageApi from '../../../../api/languageApi';
import {
  ExportIcon,
  FullScreenIcon,
  ShowHideIcon,
} from '../../../../constants/languagePage';

const HeaderTableButton = ({
  handleFullScreen,
  listParams,
  listColumns,
  onChangeListColumns,
}) => {
  const { t } = useTranslation();

  const [visibleDropdown, setVisibleDropdown] = useState(false);
  const totalRecords = useSelector(state => state.filterLang.totalRecords);

  const fetchListLanguage = async () => {
    try {
      const newParams = { ...listParams };
      // call api with full record ( limit = totalRecords )
      const response = await languageApi.getAll({
        ...newParams,
        limit: totalRecords,
      });

      if (response.data.data && response.data.data.length > 0) {
        console.log('is running');
        const listLanguageToExport = response.data.data.map(lang => ({
          ...lang,
          status: lang.status ? t('language.active') : t('language.locking'),
        }));
        handleExportToExcel(listLanguageToExport);
      }
    } catch (error) {
      message.error(t('language.failToFetchListLanguage'));
    }
  };

  const TableContent = () => (
    <Menu>
      {listColumns
        .filter(col => col.id !== 1 && col.hasExported)
        .map(col => {
          return (
            <Menu.Item key={col.id}>
              <Checkbox
                onChange={handleChangeCheckbox}
                value={col.id}
                checked={col.isShow}
              >
                {col.title}
              </Checkbox>
            </Menu.Item>
          );
        })}
    </Menu>
  );

  const handleChangeCheckbox = e => {
    const { checked, value } = e.target;

    onChangeListColumns(prev => {
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
    fetchListLanguage();
  };

  const handleExportToExcel = dataSource => {
    const excel = new Excel();

    excel
      .addSheet('listLanguage')
      .addColumns(
        listColumns
          .filter(col => col.hasExported && col.isShow)
          .map(col => {
            if (col?.render) {
              col.render = record => record;
            }
            return col;
          }),
      )
      .addDataSource(dataSource)
      .saveAs('listLanguage.xlsx');
  };

  return (
    <>
      <section className="language__add--actions">
        <Tooltip title={t('language.exportTooltip')} color="blue">
          <Button icon={<ExportIcon />} onClick={handleExportClick} />
        </Tooltip>
        <Dropdown
          overlay={TableContent}
          placement="bottom"
          visible={visibleDropdown}
          onVisibleChange={handleChangeVisibleDropdown}
        >
          <Tooltip title={t('language.showColumnTooltip')} color="blue">
            <Button icon={<ShowHideIcon />}></Button>
          </Tooltip>
        </Dropdown>
        <Tooltip
          title={t('language.fullScreenTooltip')}
          color="blue"
          onClick={handleFullScreen.enter}
        >
          <Button icon={<FullScreenIcon />}></Button>
        </Tooltip>
      </section>
    </>
  );
};

export default HeaderTableButton;
