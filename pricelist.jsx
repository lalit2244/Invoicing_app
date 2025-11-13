// File: frontend/src/pages/Pricelist.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllProducts, updateProduct, getTexts } from '../utils/api';
import { logout } from '../utils/auth';
import HamburgerMenu from '../components/HamburgerMenu';
import '../styles/pricelist.css';

function Pricelist() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState('en');
  const [headers, setHeaders] = useState({});
  const [showMenu, setShowMenu] = useState(false);
  const [searchArticle, setSearchArticle] = useState('');
  const [searchProduct, setSearchProduct] = useState('');
  const [updateTimeout, setUpdateTimeout] = useState(null);
  const [userName, setUserName] = useState('John Andre');
  const [userLocation, setUserLocation] = useState('Storfjord AS');
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, [language]);

  const loadData = async () => {
    try {
      const [productsData, headersData] = await Promise.all([
        getAllProducts(),
        getTexts('pricelist', language)
      ]);
      
      setProducts(productsData.products);
      setHeaders(headersData);
      setLoading(false);
    } catch (err) {
      console.error('Failed to load data:', err);
      if (err.message.includes('token')) {
        logout();
      }
      setLoading(false);
    }
  };

  const handleFieldChange = (id, field, value) => {
    // Update local state immediately
    setProducts(products.map(p => 
      p.id === id ? { ...p, [field]: value } : p
    ));

    // Debounce API call
    if (updateTimeout) {
      clearTimeout(updateTimeout);
    }

    const timeout = setTimeout(async () => {
      try {
        await updateProduct(id, { [field]: value });
        console.log(`Updated ${field} for product ${id}`);
      } catch (err) {
        console.error('Failed to update product:', err);
      }
    }, 500);

    setUpdateTimeout(timeout);
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'sv' : 'en');
  };

  const handleLogout = () => {
    logout();
  };

  const flagUrl = language === 'en' 
    ? 'https://storage.123fakturere.no/public/flags/GB.png'
    : 'https://storage.123fakturere.no/public/flags/SE.png';

  const menuItems = {
    invoices: language === 'en' ? 'Invoices' : 'Faktura',
    customers: language === 'en' ? 'Customers' : 'Kunder',
    business: language === 'en' ? 'My Business' : 'Min Verksamhet',
    journal: language === 'en' ? 'Invoice Journal' : 'Fakturajournal',
    priceList: language === 'en' ? 'Price List' : 'Prislista',
    multiple: language === 'en' ? 'Multiple Invoicing' : 'Flera Fakturor',
    unpaid: language === 'en' ? 'Unpaid Invoices' : 'Obetalda Fakturor',
    offer: language === 'en' ? 'Offer' : 'Offert',
    inventory: language === 'en' ? 'Inventory Control' : 'Lagerkontroll',
    member: language === 'en' ? 'Member Invoicing' : 'Medlemsfakturering',
    importExport: language === 'en' ? 'Import/Export' : 'Import/Export',
    logout: language === 'en' ? 'Log out' : 'Logga ut'
  };

  // Filter products based on search
  const filteredProducts = products.filter(product => {
    const matchesArticle = searchArticle === '' || 
      product.id.toString().includes(searchArticle);
    const matchesProduct = searchProduct === '' || 
      product.product_service.toLowerCase().includes(searchProduct.toLowerCase());
    return matchesArticle && matchesProduct;
  });

  if (loading) {
    return (
      <div className="pricelist-container">
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  return (
    <div className="pricelist-container">
      {/* Header */}
      <header className="pricelist-header">
        <div className="header-left">
          <button 
            className="hamburger-button"
            onClick={() => setShowMenu(!showMenu)}
            aria-label="Menu"
          >
            ☰
          </button>
          <div className="user-info">
            <div className="user-avatar">
              <span>JA</span>
            </div>
            <div className="user-details">
              <div className="user-name">{userName}</div>
              <div className="user-location">{userLocation}</div>
            </div>
          </div>
        </div>

        <div className="header-right">
          <button className="language-selector" onClick={toggleLanguage}>
            <span>{language === 'en' ? 'English' : 'Norsk Bokmål'}</span>
            <img src={flagUrl} alt={language} />
          </button>
        </div>
      </header>

      {/* Hamburger Menu */}
      {showMenu && (
        <div className="sidebar-menu">
          <div className="menu-overlay" onClick={() => setShowMenu(false)}></div>
          <nav className="menu-content">
            <h3 className="menu-title">Menu</h3>
            <ul className="menu-list">
              <li className="menu-item">
                <span className="menu-icon">📄</span>
                {menuItems.invoices}
              </li>
              <li className="menu-item">
                <span className="menu-icon">👥</span>
                {menuItems.customers}
              </li>
              <li className="menu-item">
                <span className="menu-icon">⚙️</span>
                {menuItems.business}
              </li>
              <li className="menu-item">
                <span className="menu-icon">📋</span>
                {menuItems.journal}
              </li>
              <li className="menu-item active">
                <span className="menu-icon">💰</span>
                {menuItems.priceList}
              </li>
              <li className="menu-item">
                <span className="menu-icon">📊</span>
                {menuItems.multiple}
              </li>
              <li className="menu-item">
                <span className="menu-icon">⚠️</span>
                {menuItems.unpaid}
              </li>
              <li className="menu-item">
                <span className="menu-icon">🎁</span>
                {menuItems.offer}
              </li>
              <li className="menu-item">
                <span className="menu-icon">📦</span>
                {menuItems.inventory}
              </li>
              <li className="menu-item">
                <span className="menu-icon">👤</span>
                {menuItems.member}
              </li>
              <li className="menu-item">
                <span className="menu-icon">🔄</span>
                {menuItems.importExport}
              </li>
              <li className="menu-item" onClick={handleLogout}>
                <span className="menu-icon">🚪</span>
                {menuItems.logout}
              </li>
            </ul>
          </nav>
        </div>
      )}

      {/* Main Content */}
      <main className="pricelist-content">
        {/* Search Section */}
        <div className="search-section">
          <div className="search-box">
            <input
              type="text"
              className="search-input"
              placeholder={language === 'en' ? 'Search Article No ...' : 'Sök Artikelnummer ...'}
              value={searchArticle}
              onChange={(e) => setSearchArticle(e.target.value)}
            />
            <button className="search-icon">🔍</button>
          </div>
          <div className="search-box">
            <input
              type="text"
              className="search-input"
              placeholder={language === 'en' ? 'Search Product ...' : 'Sök Produkt ...'}
              value={searchProduct}
              onChange={(e) => setSearchProduct(e.target.value)}
            />
            <button className="search-icon">🔍</button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="action-buttons">
          <button className="action-btn add-btn">
            <span className="btn-icon">+</span>
            <span className="btn-text">{language === 'en' ? 'New Product' : 'Ny Produkt'}</span>
          </button>
          <button className="action-btn print-btn">
            <span className="btn-icon">🖨️</span>
            <span className="btn-text">{language === 'en' ? 'Print List' : 'Skriv ut lista'}</span>
          </button>
          <button className="action-btn advanced-btn">
            <span className="btn-icon">⚙️</span>
            <span className="btn-text">{language === 'en' ? 'Advanced mode' : 'Avancerat läge'}</span>
          </button>
        </div>

        {/* Product Table */}
        <div className="product-table-wrapper">
          <table className="product-table">
            <thead>
              <tr>
                <th className="col-arrow"></th>
                <th className="col-article">{language === 'en' ? 'Article No.' : 'Artikelnr.'} ↓</th>
                <th className="col-product">{language === 'en' ? 'Product/Service' : 'Produkt/Tjänst'} ↓</th>
                <th className="col-in-price hide-mobile">{language === 'en' ? 'In Price' : 'Inpris'}</th>
                <th className="col-price">{language === 'en' ? 'Price' : 'Pris'}</th>
                <th className="col-unit hide-tablet">{language === 'en' ? 'Unit' : 'Enhet'}</th>
                <th className="col-stock hide-mobile">{language === 'en' ? 'In Stock' : 'I Lager'}</th>
                <th className="col-description hide-mobile">{language === 'en' ? 'Description' : 'Beskrivning'}</th>
                <th className="col-menu"></th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product, index) => (
                <tr key={product.id} className={index === 0 ? 'row-active' : ''}>
                  <td className="col-arrow">
                    {index === 0 && <span className="arrow-icon">→</span>}
                  </td>
                  <td className="col-article">
                    <input
                      type="text"
                      className="table-input"
                      value={product.id}
                      readOnly
                    />
                  </td>
                  <td className="col-product">
                    <input
                      type="text"
                      className="table-input"
                      value={product.product_service}
                      onChange={(e) => handleFieldChange(product.id, 'product_service', e.target.value)}
                    />
                  </td>
                  <td className="col-in-price hide-mobile">
                    <input
                      type="number"
                      step="0.01"
                      className="table-input"
                      value={product.in_price}
                      onChange={(e) => handleFieldChange(product.id, 'in_price', e.target.value)}
                    />
                  </td>
                  <td className="col-price">
                    <input
                      type="number"
                      step="0.01"
                      className="table-input"
                      value={product.price}
                      onChange={(e) => handleFieldChange(product.id, 'price', e.target.value)}
                    />
                  </td>
                  <td className="col-unit hide-tablet">
                    <input
                      type="text"
                      className="table-input"
                      value={product.unit}
                      onChange={(e) => handleFieldChange(product.id, 'unit', e.target.value)}
                    />
                  </td>
                  <td className="col-stock hide-mobile">
                    <input
                      type="number"
                      className="table-input"
                      value={product.discount || 0}
                      onChange={(e) => handleFieldChange(product.id, 'discount', e.target.value)}
                    />
                  </td>
                  <td className="col-description hide-mobile">
                    <input
                      type="text"
                      className="table-input"
                      value={`Description ${product.id}`}
                      placeholder="Description"
                    />
                  </td>
                  <td className="col-menu">
                    <button className="menu-dots">⋮</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

export default Pricelist;