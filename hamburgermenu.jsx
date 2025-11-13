// File: frontend/src/components/HamburgerMenu.jsx
import { useEffect } from 'react';
import '../styles/hamburger.css';

function HamburgerMenu({ menuItems, onClose }) {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  return (
    <>
      <div className="menu-overlay" onClick={onClose}></div>
      <nav className="hamburger-menu">
        <ul className="menu-list">
          <li className="menu-item">
            <a href="#" className="menu-link" onClick={onClose}>
              {menuItems.home || 'Home'}
            </a>
          </li>
          <li className="menu-item">
            <a href="#" className="menu-link" onClick={onClose}>
              {menuItems.order || 'Order'}
            </a>
          </li>
          <li className="menu-item">
            <a href="#" className="menu-link" onClick={onClose}>
              {menuItems.customers || 'Our Customers'}
            </a>
          </li>
          <li className="menu-item">
            <a href="#" className="menu-link" onClick={onClose}>
              {menuItems.about || 'About us'}
            </a>
          </li>
          <li className="menu-item">
            <a href="#" className="menu-link" onClick={onClose}>
              {menuItems.contact || 'Contact Us'}
            </a>
          </li>
        </ul>
      </nav>
    </>
  );
}

export default HamburgerMenu;