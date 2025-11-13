// File: frontend/src/components/Header.jsx
import { useState } from 'react';
import HamburgerMenu from './HamburgerMenu';
import LanguageSwitcher from './LanguageSwitcher';

function Header({ language, setLanguage, menuItems }) {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <>
      <div className="login-header">
        <button 
          className="hamburger-button"
          onClick={() => setShowMenu(!showMenu)}
          aria-label="Menu"
        >
          ☰
        </button>
        <LanguageSwitcher language={language} setLanguage={setLanguage} />
      </div>

      {showMenu && (
        <HamburgerMenu 
          menuItems={menuItems}
          onClose={() => setShowMenu(false)}
        />
      )}
    </>
  );
}

export default Header;