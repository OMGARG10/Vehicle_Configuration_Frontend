const Header = () => (
  <header style={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1rem',
    backgroundColor: '#222',
    color: '#fff',
    position: 'relative'
  }}>
    {/* Company Logo */}
    <img
      src="/images/logo.webp" // Update the path to your logo file
      alt="Company Logo"
      style={{
        position: 'absolute',
        left: '1rem',
        height: '40px',
      }}
    />

    {/* Company Name */}
    <h1 style={{
      margin: 0,
      fontSize: '2rem',
      fontWeight: 'bold',
    }}>
      Vehicle Configurator
    </h1>
  </header>
);

export default Header;