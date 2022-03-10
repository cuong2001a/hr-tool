import { PlusCircleFilled } from '@ant-design/icons';
import { Button } from 'antd';
import { useDispatch } from 'react-redux';
import { setFormContent, setVisibles } from './reducer/Level';
import { useTranslation } from 'react-i18next';
function LevelHeader() {
  const { t } = useTranslation();

  const dispatch = useDispatch();
  const showDrawer = () => {
    dispatch(
      setFormContent({
        btn: t('level.create'),
        title: t('level.create-level'),
      }),
    );
    dispatch(setVisibles(true));
  };

  return (
    <div className="level--header">
      <h3>{t('level.title')}</h3>
      <Button type="primary" icon={<PlusCircleFilled />} onClick={showDrawer}>
        {t('level.create-level')}
      </Button>
    </div>
  );
}
export default LevelHeader;
