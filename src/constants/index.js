import { CheckCircleFilled, CloseCircleFilled } from '@ant-design/icons';
import i18n from '../translation/i18n';

export const pageSizeOptions = ['10', '20', '50'];
export const PAGE_SIZE_OPTIONS = ['10', '20', '50'];
export const DEFAULT_FILTER = { page: 1, limit: 10, keyword: '' };
export const CONFIG_PAGINATION = {
  showQuickJumper: false,
  showSizeChanger: true,
  defaultCurrent: 1,
  pageSize: DEFAULT_FILTER.limit,
  total: 0,
  pageSizeOptions: PAGE_SIZE_OPTIONS,
};

export const DATE_FORMAT = 'DD/MM/YYYY';
export const DATE_TIME_FORMAT = 'hh:mm - DD MMM YYYY';
export const DATE_FORMAT_ONBOARD = 'DD MMM YYYY';
export const FULL_DATA = { month: 2, year: 2022 };

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
export const DEFAULT_STATUS = 1;

export const CV_STATUS_DEFAULT = [
  { title: 'Fail', color: '#c20000' },
  { title: 'Pending', color: '#a5b802' },
  { title: 'Pass', color: '#0ea800' },
];

export const CV_STATUS_INTERVIEW = [
  ...CV_STATUS_DEFAULT,
  { title: 'Absent', color: '#000861' },
];

export const CV_STATUS_ON_BOARD = [
  { title: 'NotToWork', color: '#c20000' },
  { title: 'Postpone', color: '#a5b802' },
  { title: 'WentWork', color: '#0ea800' },
];

export const CV_STATUS_THU_VIEC = [
  { title: 'Fail', color: '#c20000' },
  { title: 'Inprogress', color: '#a5b802' },
  { title: 'Pass', color: '#0ea800' },
  { title: 'Extend', color: '#000861' },
];

export const CV_STEP = [
  { title: 'STEP_NEW', color: '#f56c42', status: CV_STATUS_DEFAULT, id: 0 },
  {
    title: 'STEP_HR_REVIEW',
    color: '#f5a142',
    status: CV_STATUS_DEFAULT,
    id: 1,
  },
  {
    title: 'STEP_CV_REVIEW',
    color: '#f5d742',
    status: CV_STATUS_DEFAULT,
    id: 2,
  },
  {
    title: 'STEP_NHAN_TUONG_1',
    color: '#8aa127',
    status: CV_STATUS_DEFAULT,
    id: 3,
  },
  {
    title: 'STEP_TO_INTERVIEW',
    color: '#99cf25',
    status: CV_STATUS_DEFAULT,
    id: 4,
  },
  {
    title: 'STEP_INTERVIEW',
    color: '#23b01e',
    status: CV_STATUS_INTERVIEW,
    id: 5,
  },
  {
    title: 'STEP_NHAN_TUONG_2',
    color: '#1eb0a1',
    status: CV_STATUS_DEFAULT,
    id: 6,
  },
  {
    title: 'STEP_PRE_OFFER',
    color: '#1e7fb0',
    status: CV_STATUS_DEFAULT,
    id: 7,
  },
  { title: 'STEP_OFFER', color: '#1e4cb0', status: CV_STATUS_DEFAULT, id: 8 },
  {
    title: 'STEP_ON_BOARD',
    color: '#421eb0',
    status: CV_STATUS_ON_BOARD,
    id: 9,
  },
  {
    title: 'STEP_THU_VIEC',
    color: '#b01eab',
    status: CV_STATUS_THU_VIEC,
    id: 10,
  },
];
export const DEFAULT_PARAMS = { page: 1, limit: 10 };
export const LIST_ASSESSMENT = [
  {
    id: 1,
    value: 0,
    title: i18n.t('plan.easy'),
  },
  {
    id: 2,
    value: 1,
    title: i18n.t('plan.medium'),
  },
  {
    id: 3,
    value: 2,
    title: i18n.t('plan.hard'),
  },
  {
    id: 4,
    value: 3,
    title: i18n.t('plan.very_hard'),
  },
];
export const PRIORITY_LIST = [
  {
    id: 1,
    value: 0,
    title: i18n.t('plan.low'),
  },
  {
    id: 2,
    value: 1,
    title: i18n.t('plan.medium'),
  },
  {
    id: 3,
    value: 2,
    title: i18n.t('plan.medium+'),
  },
  {
    id: 4,
    value: 3,
    title: i18n.t('plan.high'),
  },
];
export const MONTH_FORMAT = 'MM/YYYY';
export const DEFAULT_BEFORE_REQUEST_DAY = 30; // số ngày để tính deadline cho phần yêu cầu ( được setting trong common page )
export const LABELSRADAR = [
  'Ứng tuyển',
  'Qua review',
  'Qua phỏng vấn',
  'Tuyển',
];
