import { CheckCircleFilled, CloseCircleFilled } from '@ant-design/icons';
import exportIcon from '../assets/images/tableIcon/export-icon.svg';
import fullScreenIcon from '../assets/images/tableIcon/resize.svg';
import showHideIcon from '../assets/images/tableIcon/Vector.svg';
import Threedot from '../assets/images/language/threedot.svg';
import i18n from '../translation/i18n';

export const LIST_STATUS = [
  {
    id: 1,
    value: 0,
    title: 'locking',
    icon: <CloseCircleFilled style={{ fontSize: '16px', color: '#F94144' }} />,
  },
  {
    id: 2,
    value: 1,
    title: 'active',
    icon: <CheckCircleFilled style={{ fontSize: '16px', color: '#78BE20' }} />,
  },
];
export const DEFAULT_SELECTED_MENU_SIDEBAR = '/statistic';
export const DEFAULT_STATUS = 1;
export const MAX_LENGTH_DESCRIPTION_INPUT = 5000;
export const DEFAULT_PAGESIZE = 10;
export const DEFAULT_PAGENUMBER = 1;
export const MIN_LENGTH_LANG_TITLE = 3;
export const MAX_LENGTH_LANG_TITLE = 200;
export const ExportIcon = () => <img src={exportIcon} alt="exportIcon" />;
export const ShowHideIcon = () => <img src={showHideIcon} alt="showHideIcon" />;
export const FullScreenIcon = () => (
  <img src={fullScreenIcon} alt="fullscreen" />
);
export const ThreeDotIcon = () => <img src={Threedot} alt="threedot" />;
export const LIST_COLUMN_EXPORT = [
  {
    title: 'ID',
    dataIndex: 'id',
  },
  {
    title: i18n.t('language.language'),
    dataIndex: 'title',
  },
  {
    title: i18n.t('language.description'),
    dataIndex: 'description',
  },
];
export const RULE_TITLE_LANGUAGE_FORM = [
  {
    required: true,
    message: i18n.t('language.rulesForInputLang'),
  },
  {
    whitespace: true,
    message: i18n.t('language.validateWhiteSpaceTitle'),
  },
  {
    min: MIN_LENGTH_LANG_TITLE,
    message: i18n.t('language.validateMinCharTitle', {
      minLength: MIN_LENGTH_LANG_TITLE,
    }),
  },
  {
    max: MAX_LENGTH_LANG_TITLE,
    message: i18n.t('language.validateMaxCharTitle', {
      maxLength: MAX_LENGTH_LANG_TITLE,
    }),
  },
];
export const checkOrderbyValue = (listParams, field) => {
  // orderby : 'ascend', 'descend', ''
  let OrderBy = '';

  if (listParams?.orderby) {
    const arrFromOrder = listParams.orderby.split('-');
    if (arrFromOrder[0] === field) {
      OrderBy = arrFromOrder[1] === 'ASC' ? 'ascend' : 'descend';
    }
  }

  return OrderBy;
};
export const checkStatusFilteredValue = listParams => {
  let listStatus = [];

  if (String(listParams.status).length > 1) {
    listStatus = listParams.status.split('-');
  } else if (String(listParams.status).length === 1) {
    listStatus.push(String(listParams.status));
  }

  return listStatus;
};
