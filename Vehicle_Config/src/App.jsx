import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './component/Layout';
import Home from './pages/Home';
import SignIn from "./pages/SignIn";
import RegistrationForm from './pages/Registration';
import WelcomePage from './pages/WelcomePage';
import DefaultConfigurationPage from './pages/DefaultConfigurationPage';
// import About from './pages/About';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/register" element={<RegistrationForm />} />
          <Route path="/welcome" element={<WelcomePage />} />
          <Route path="/configuration" element={<DefaultConfigurationPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;