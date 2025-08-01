import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './component/Layout';
import Home from './pages/Home';
import SignIn from "./pages/SignIn";



// import About from './pages/About';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signin" element={<SignIn />} />

        </Routes>
      </Layout>
    </Router>
  );
}

export default App;