import { useState } from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(true);

  const menuItems = [
    { label: '🏠 Home', path: '/' },
    { label: 'ℹ️ About Us', path: '/about' },
    { label: '📞 Contact Us', path: '/contact' },
    { label: '🔐 Sign In/Out', path: '/auth' },
    { label: '❓ Help', path: '/help' },
    { label: '📝 Feedback', path: '/feedback' },
  ];

  return (
    <>
      {/* Hover Trigger Strip */}
      <div
        onMouseEnter={() => setCollapsed(false)}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '10px',
          height: '100vh',
          zIndex: 998,
        }}
      />

      {/* Sidebar Panel */}
      <div
        onMouseLeave={() => setCollapsed(true)}
        style={{
          position: 'fixed',
          top: 0,
          left: collapsed ? '-200px' : '0',
          height: '100vh',
          width: '200px',
          backgroundColor: '#222',
          color: '#fff',
          transition: 'left 0.3s ease',
          paddingTop: '60px',
          boxShadow: collapsed ? 'none' : '2px 0 10px rgba(0,0,0,0.5)',
          zIndex: 999,
        }}
      >
        <ul style={{ listStyle: 'none', padding: '20px', margin: 0 }}>
          {menuItems.map(({ label, path }) => (
            <li key={path} style={{ marginBottom: '1rem' }}>
              <Link
                to={path}
                style={{
                  color: '#fff',
                  textDecoration: 'none',
                  fontWeight: 'bold',
                  padding: '6px 10px',
                  borderRadius: '4px',
                  display: 'inline-block',
                  transition: 'background 0.3s',
                }}
                onMouseEnter={e => (e.target.style.background = 'rgba(255,255,255,0.2)')}
                onMouseLeave={e => (e.target.style.background = 'transparent')}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default Sidebar;