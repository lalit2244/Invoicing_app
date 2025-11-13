import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser, getTexts, getMenuTexts } from '../utils/api';
import { saveToken } from '../utils/auth';
import HamburgerMenu from '../components/HamburgerMenu';
import '../styles/login.css';

function Login({ setIsAuth }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState('sv'); // Default Swedish
  const [texts, setTexts] = useState({});
  const [menuItems, setMenuItems] = useState({});
  const [showMenu, setShowMenu] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    loadTexts();
  }, [language]);

  const loadTexts = async () => {
    try {
      const pageTexts = await getTexts('login', language);
      const menu = await getMenuTexts(language);
      setTexts(pageTexts);
      setMenuItems(menu);
    } catch (err) {
      console.error('Failed to load texts:', err);
      // Fallback texts if API fails
      if (language === 'sv') {
        setTexts({
          title: 'Logga in',
          email_label: 'Skriv in din epost adress',
          email_placeholder: 'Epost adress',
          password_label: 'Skriv in ditt lösenord',
          password_placeholder: 'Lösenord',
          login_button: 'Logga in',
          register_link: 'Registrera dig',
          forgot_password_link: 'Glömt lösenord?',
          company_name: '123 Fakturera',
          footer_text: '© Lättfaktura, CRO no. 638537, 2025. All rights reserved.'
        });
        setMenuItems({
          home: 'Hem',
          order: 'Beställ',
          customers: 'Våra Kunder',
          about: 'Om oss',
          contact: 'Kontakta oss'
        });
      } else {
        setTexts({
          title: 'Log in',
          email_label: 'Enter your email address',
          email_placeholder: 'Email address',
          password_label: 'Enter your password',
          password_placeholder: 'Password',
          login_button: 'Log in',
          register_link: 'Register',
          forgot_password_link: 'Forgotten password?',
          company_name: '123 Fakturera',
          footer_text: '© Lättfaktura, CRO no. 638537, 2025. All rights reserved.'
        });
        setMenuItems({
          home: 'Home',
          order: 'Order',
          customers: 'Our Customers',
          about: 'About us',
          contact: 'Contact Us'
        });
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await loginUser(email, password);
      saveToken(response.token);
      setIsAuth(true);
      navigate('/pricelist');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'sv' : 'en');
  };

  const flagUrl =
    language === 'en'
      ? 'https://storage.123fakturere.no/public/flags/GB.png'
      : 'https://storage.123fakturere.no/public/flags/SE.png';

  const languageText = language === 'en' ? 'English' : 'Svenska';

  return (
    <div className="login-container">
      {/* Header Section */}
      <div className="login-header">
        <button
          className="hamburger-button"
          onClick={() => setShowMenu(!showMenu)}
          aria-label="Menu"
        >
          ☰
        </button>

        {/* Top Navigation */}
        <nav className="top-nav">
          <a href="#" className="nav-link">{menuItems.home || 'Hem'}</a>
          <a href="#" className="nav-link">{menuItems.order || 'Beställ'}</a>
          <a href="#" className="nav-link">{menuItems.customers || 'Våra Kunder'}</a>
          <a href="#" className="nav-link">{menuItems.about || 'Om oss'}</a>
          <a href="#" className="nav-link">{menuItems.contact || 'Kontakta oss'}</a>
        </nav>

        <button className="language-selector" onClick={toggleLanguage}>
          <span>{languageText}</span>
          <img src={flagUrl} alt={language} />
        </button>
      </div>

      {/* Diamond Logo */}
      <div className="diamond-logo">
        <img
          src="https://storage.123fakturera.se/public/icons/diamond.png"
          alt="Diamond Logo"
        />
      </div>

      {/* Hamburger Menu */}
      {showMenu && (
        <HamburgerMenu menuItems={menuItems} onClose={() => setShowMenu(false)} />
      )}

      {/* Login Form Content */}
      <div className="login-content">
        <div className="login-box">
          <h1 className="login-title">{texts.title || 'Logga in'}</h1>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">
                {texts.email_label || 'Skriv in din epost adress'}
              </label>
              <input
                type="email"
                className="form-input"
                placeholder={texts.email_placeholder || 'Epost adress'}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                {texts.password_label || 'Skriv in ditt lösenord'}
              </label>
              <div className="password-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="form-input"
                  placeholder={texts.password_placeholder || 'Lösenord'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={{ paddingRight: '45px' }} // Extra padding for icon
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setShowPassword(!showPassword);
                  }}
                  aria-label="Toggle password visibility"
                  tabIndex={-1}
                >
                  {showPassword ? '👁‍🗨' : '👁️'}
                </button>
              </div>
            </div>

            <button type="submit" className="login-button" disabled={loading}>
              {loading
                ? language === 'sv'
                  ? 'Laddar...'
                  : 'Loading...'
                : texts.login_button || 'Logga in'}
            </button>
          </form>

          <div className="login-links">
            <a href="#" className="login-link">{texts.register_link || 'Registrera dig'}</a>
            <a href="#" className="login-link">{texts.forgot_password_link || 'Glömt lösenord?'}</a>
          </div>
        </div>
      </div>

      {/* WHITE LINE BEFORE FOOTER - ADD THIS */}
      <div className="footer-divider"></div>

      {/* Footer Section */}
      <div className="login-footer">
        <div className="company-logo">
          <img
            src="https://storage.123fakturera.se/public/icons/diamond.png"
            alt="Logo"
            className="logo-icon"
          />
          <span className="company-name">{texts.company_name || '123 Fakturera'}</span>
        </div>
        <nav className="footer-nav">
          <a href="#" className="footer-link">{menuItems.home || 'Hem'}</a>
          <a href="#" className="footer-link">{menuItems.order || 'Beställ'}</a>
          <a href="#" className="footer-link">{menuItems.contact || 'Kontakta oss'}</a>
        </nav>
      </div>

      <div className="footer-text">
        {texts.footer_text || '© Lättfaktura, CRO no. 638537, 2025. All rights reserved.'}
      </div>
    </div>
  );
}

export default Login;
