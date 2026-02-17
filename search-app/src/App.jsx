
import { useState, useEffect } from 'react';
import { Search, User, X, FileText, Building, Key, Activity, Monitor } from 'lucide-react';

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [allCustomers, setAllCustomers] = useState([]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/data.json')
      .then(res => {
        if (!res.ok) throw new Error('Failed to load data');
        return res.json();
      })
      .then(data => {
        setAllCustomers(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error loading data:", err);
        setError("No se pudo cargar la base de datos de clientes.");
        setLoading(false);
      });
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      setResult(null);
      return;
    }
    
    // Find customer by Customer number (exact or partial match?)
    // User said "put the Customer number", likely exact or starts with.
    // Let's try flexible search: check if 'Customer number' includes the term.
    // Or check multiple fields. But user specified "Customer number".
    
    const term = searchTerm.toLowerCase().trim();
    
    // Prioritize exact match on Customer number
    let found = allCustomers.find(c => 
      String(c['Customer number']).toLowerCase() === term
    );
    
    if (!found) {
        // Fallback: Check if it starts with the term
        found = allCustomers.find(c => 
          String(c['Customer number']).toLowerCase().startsWith(term)
        );
    }

    // If still not found, searching by name might be useful too?
    // User said "put the Customer number". I'll stick to that primarily.
    // If not found by number, try name just in case.
    if (!found) {
        found = allCustomers.find(c => 
            String(c['Native Customer Name']).toLowerCase().includes(term) ||
            String(c['Invoicing SC Name']).toLowerCase().includes(term)
        );
    }
    
    setResult(found || null);
  };

  const clearSearch = () => {
    setSearchTerm('');
    setResult(null);
  };

  return (
    <div className="container">
      <div className="search-section">
        <div className="icon-wrapper-hero">
            <Search size={40} color="#3b82f6" />
        </div>
        <h1>Buscador de Clientes</h1>
        <p className="subtitle">Introduce el número del cliente para consultar la información.</p>
        
        <form onSubmit={handleSearch} className="search-form">
          <div className="search-box">
            <Search className="search-icon" size={20} />
            <input
              type="text"
              placeholder="Ej: 12345 o Juan Marquez..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            {searchTerm && (
              <button type="button" onClick={clearSearch} className="clear-btn">
                <X size={18} />
              </button>
            )}
          </div>
          {/* Auto-search on type or enter? Form submit handles enter. */}
        </form>
        
        {loading && <p className="status-text">Cargando base de datos...</p>}
        {error && <p className="error-text">{error}</p>}
        {!loading && !error && searchTerm && !result && (
            <p className="status-text">Presiona Enter para buscar</p>
        )}
      </div>

      {result && (
        <div className="result-card fade-in">
          <div className="card-header">
            <div className="avatar-placeholder">
              <User size={32} color="#3b82f6" />
            </div>
            <div>
              <h2>{result['Native Customer Name'] || result['Invoicing SC Name'] || 'Sin Nombre'}</h2>
              <span className="badge">Cliente Registrado</span>
            </div>
          </div>
          
          <div className="card-grid">
            <InfoItem 
                icon={<Key size={16} />} 
                label="ID CLIENTE (Customer #)" 
                value={result['Customer number']} 
                highlight
            />
            <InfoItem 
                icon={<Building size={16} />} 
                label="COMPAÑÍA (Company Code)" 
                value={result['Company Code']} 
            />
            <InfoItem 
                icon={<Activity size={16} />} 
                label="CÓDIGO ORACLE" 
                value={result['Oracle Code']} 
            />
            <InfoItem 
                icon={<FileText size={16} />} 
                label="INVOICING SC NAME" 
                value={result['Invoicing SC Name']} 
            />
            <InfoItem 
                icon={<User size={16} />} 
                label="NATIVE CUSTOMER" 
                value={result['Native Customer (Source System)']} 
            />
            <InfoItem 
                icon={<Monitor size={16} />} 
                label="PLANNING UNIT" 
                value={result['Planning Unit']} 
            />
          </div>
        </div>
      )}
    </div>
  );
}

function InfoItem({ icon, label, value, highlight = false }) {
  return (
    <div className={`info-item ${highlight ? 'highlight' : ''}`}>
      <div className="info-label">
        {icon}
        <span>{label}</span>
      </div>
      <div className="info-value">{value || '-'}</div>
    </div>
  );
}

export default App;
