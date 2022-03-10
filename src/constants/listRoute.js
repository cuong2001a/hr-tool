import DashBoardIcon from '../components/Sidebar/components/DashBoardIcon.jsx';
import ManagementIcon from '../components/Sidebar/components/ManagementIcon.jsx';
import PlanIcon from '../components/Sidebar/components/PlanIcon.jsx';
import RequireIcon from '../components/Sidebar/components/RequireIcon.jsx';
import SettingIcon from '../components/Sidebar/components/SettingIcon.jsx';

export const LIST_ROUTES = [
  {
    path: '/statistic',
    title: 'statistic',
    icon: <DashBoardIcon />,
    child: [],
  },
  {
    path: '/request',
    title: 'request',
    icon: <RequireIcon />,
    child: [],
  },
  {
    path: '/plan',
    subPath: '/plan/detail',
    title: 'plan',
    icon: <PlanIcon />,
    child: [],
  },
  {
    path: '/cv',
    title: 'cv-managerment',
    icon: <ManagementIcon />,
    child: [],
  },
  {
    path: '/setting',
    title: 'setting',
    icon: <SettingIcon />,
    child: [
      {
        path: '/setting/common',
        title: 'common',
        icon: '',
        child: [],
      },
      {
        path: '/setting/position',
        title: 'position',
        icon: '',
        child: [],
      },
      {
        path: '/setting/level',
        title: 'level',
        icon: '',
        child: [],
      },
      {
        path: '/setting/language',
        title: 'language',
        icon: '',
        child: [],
      },
      {
        path: '/setting/source',
        title: 'source',
        icon: '',
        child: [],
      },
      {
        path: '/setting/user',
        title: 'user',
        icon: '',
        child: [],
      },
      {
        path: '/setting/role',
        title: 'role',
        icon: '',
        child: [],
      },
      {
        path: '/setting/type-work',
        title: 'type-work',
        icon: '',
        child: [],
      },
    ],
  },
];
