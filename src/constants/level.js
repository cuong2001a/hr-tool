import { CheckCircleFilled, CloseCircleFilled } from '@ant-design/icons';

export const API_LEVEL = 'v1/level';
export const TIME_OUT = 590000;

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
