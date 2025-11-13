import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTexts, getMenuTexts } from '../utils/api';
import HamburgerMenu from '../components/HamburgerMenu';
import '../styles/terms.css';

function Terms() {
  const [language, setLanguage] = useState('en');
  const [texts, setTexts] = useState({});
  const [menuItems, setMenuItems] = useState({});
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadTexts();
  }, [language]);

  const loadTexts = async () => {
    try {
      const pageTexts = await getTexts('terms', language);
      const menu = await getMenuTexts(language);
      setTexts(pageTexts);
      setMenuItems(menu);
    } catch (err) {
      console.error('Failed to load texts:', err);
    }
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'sv' : 'en');
  };

  const handleClose = () => {
    navigate(-1);
  };

  const flagUrl =
    language === 'en'
      ? 'https://storage.123fakturera.se/public/flags/GB.png'
      : 'https://storage.123fakturera.se/public/flags/SE.png';

  return (
    <div className="terms-container">
      {/* Header */}
      <header className="terms-header">
        {/* 💎 Diamond Logo */}
        <div className="header-left">
          <img
            src="https://storage.123fakturera.se/public/icons/diamond.png"
            alt="123 Fakturera Logo"
            className="terms-logo"
          />
        </div>

        {/* 🌐 Navigation Bar */}
        <nav className={`terms-nav ${showMenu ? 'active' : ''}`}>
          <a href="#" className="nav-link">Home</a>
          <a href="#" className="nav-link">Order</a>
          <a href="#" className="nav-link">Our Customers</a>
          <a href="#" className="nav-link">About Us</a>
          <a href="#" className="nav-link">Contact Us</a>
        </nav>

        {/* 🌍 Language Selector */}
        <div className="header-right">
          <button className="language-selector" onClick={toggleLanguage}>
            <span>{language === 'en' ? 'English' : 'Svenska'}</span>
            <img src={flagUrl} alt={language} />
          </button>

          {/* Hamburger for Mobile */}
          <button
            className="hamburger-button"
            onClick={() => setShowMenu(!showMenu)}
            aria-label="Menu"
          >
            ☰
          </button>
        </div>
      </header>

      {/* Page Title */}
      <div className="terms-title-header">
        {texts.title || 'Terms and Conditions'}
      </div>

      {/* Terms Box */}
      <div className="terms-content-wrapper">
        <div className="terms-content-box">
          <div className="terms-text">
            {texts.content || 'Loading terms...'}
          </div>
        </div>
      </div>

      {/* Close Button */}
      <button className="close-button" onClick={handleClose}>
        {texts.close_button || 'Close and Go Back'}
      </button>
    </div>
  );
}

export default Terms;
