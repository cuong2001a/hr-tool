import i18n from '../translation/i18n';

export const CREATE_TITLE_FORM = i18n.t('request.titleCreateRequest');
export const EDIT_TITLE_FORM = i18n.t('request.titleEditForm');
export const DETAIL_TITLE_FORM = i18n.t('request.titleDetailForm');
export const DEFAULT_PAGESIZE = 10;
export const DEFAULT_PAGENUMBER = 1;
export const DATE_FORMAT_DAY_CREATED = 'DD MMM YYYY';
export const DATE_FORMAT_DEADLINE = 'MMM YYYY';
export const DEADLINE_FORMATED = 'YYYY-MM';
export const DEFAULT_AUTHOR_LEVEL = 'namng';
export const DEFAULT_TYPEWORK = [20]; // 20 === id of 'Fulltime' from db
export const DEFAULT_MAX_LENGTH_DESCRIPTION = 5000;
export const LIST_ASSESSMENT = [
  {
    id: 1,
    value: 0,
    title: i18n.t('request.easyAssessment'),
  },
  {
    id: 2,
    value: 1,
    title: i18n.t('request.mediumAssessment'),
  },
  {
    id: 3,
    value: 2,
    title: i18n.t('request.hardAssessment'),
  },
  {
    id: 4,
    value: 3,
    title: i18n.t('request.veryHardAssessment'),
  },
];
export const DEFAULT_PRIORITY = [
  {
    value: 0,
    title: i18n.t('request.lowMinusPriority'),
  },
  {
    value: 1,
    title: i18n.t('request.lowPriority'),
  },
  {
    value: 2,
    title: i18n.t('request.lowPlusPriority'),
  },
  {
    value: 3,
    title: i18n.t('request.mediumMinusPriority'),
  },
  {
    value: 4,
    title: i18n.t('request.mediumPriority'),
  },
  {
    value: 5,
    title: i18n.t('request.mediumPlusPriority'),
  },
  {
    value: 6,
    title: i18n.t('request.highMinusPriority'),
  },
  {
    value: 7,
    title: i18n.t('request.highPriority'),
  },
  {
    value: 8,
    title: i18n.t('request.highPlusPriority'),
  },
];
export const LIST_REQUEST_STATUS = [
  {
    id: 1,
    value: 0,
    color: '#1890ff',
    text: i18n.t('request.newStatus'),
  },
  {
    id: 2,
    value: 1,
    color: '#FF4D4F',
    text: i18n.t('request.rejectStatus'),
  },
  {
    id: 3,
    value: 2,
    color: '#15a512d9',
    text: i18n.t('request.approveStatus'),
  },
];
export const PARAMS_GET_ALL = {
  status: 1,
  limit: 0,
};
export const MAX_QUANTITY_TARGET = 127;
export const QUANTITY_RULES = [
  {
    required: true,
    message: i18n.t('request.quantityIsRequire'),
  },
  () => ({
    validator(_, value) {
      if (value < 1) {
        return Promise.reject(i18n.t('request.quantityMustGreaterZero'));
      }
      if (value > MAX_QUANTITY_TARGET) {
        return Promise.reject(
          i18n.t('request.quantityMax', { maxQuantity: MAX_QUANTITY_TARGET }),
        );
      }
      return Promise.resolve();
    },
  }),
];
export const DEADLINE_RULES = [
  {
    required: true,
    message: i18n.t('request.deadlineIsRequire'),
  },
];
