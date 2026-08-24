import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const LANGUAGE_KEY = 'bb-language';

const LanguageSwitcher = ({ isMobile }) => {
  const { i18n } = useTranslation();

  // The initial direction is set in i18n.js, this effect handles changes
  useEffect(() => {
    const dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.dir = dir;
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'ar' : 'en';
    i18n.changeLanguage(newLang);
    localStorage.setItem(LANGUAGE_KEY, newLang);
  };

  const displayText = i18n.language === 'ar' ? 'EN' : 'AR';

  return (
    <button
      onClick={toggleLanguage}
      className={isMobile ? "bb-mobile-nav__link bb-lang-switcher" : "bb-nav__link bb-lang-switcher"}
      aria-label="Toggle language"
    >
      <span className="bb-lang-switcher__text">
        {displayText}
      </span>
    </button>
  );
};

export default LanguageSwitcher;
