import { CheckCircleFilled, CloseCircleFilled } from '@ant-design/icons';

export const PAGE_SIZE_OPTIONS = ['10', '20', '50'];
export const DEFAULT_FILTER = {
  page: 1,
  limit: 10,
  keyword: '',
};
export const CONFIG_PAGINATION = {
  showQuickJumper: true,
  showSizeChanger: true,
  pageSize: DEFAULT_FILTER.limit,
  total: 1,
  pageSizeOptions: PAGE_SIZE_OPTIONS,
};

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
