import React from 'react';
import { useTranslation } from 'react-i18next';

export default function TestI18n() {
  const { t, i18n } = useTranslation();

  const handleChangeLanguage = lang => {
    i18n.changeLanguage(lang);
  };

  const data = {
    name: 'long',
    age: 18,
  };

  return (
    <>
      <h2>{t(`title`, { data })}</h2>
      <h2>{t('description.part1')}</h2>
      <h2>{t('description.part2')}</h2>
      <button onClick={() => handleChangeLanguage('vi')}>
        Change to Vietnamese
      </button>
      <button onClick={() => handleChangeLanguage('en')}>
        Chuyển sang tiếng Anh
      </button>
    </>
  );
}
