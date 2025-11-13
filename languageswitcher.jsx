// File: frontend/src/components/LanguageSwitcher.jsx

function LanguageSwitcher({ language, setLanguage }) {
  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'sv' : 'en');
  };

  const flagUrl = language === 'en' 
    ? 'https://storage.123fakturere.no/public/flags/GB.png'
    : 'https://storage.123fakturere.no/public/flags/SE.png';

  return (
    <button className="language-selector" onClick={toggleLanguage}>
      <span>{language === 'en' ? 'English' : 'Svenska'}</span>
      <img src={flagUrl} alt={language} />
    </button>
  );
}

export default LanguageSwitcher;