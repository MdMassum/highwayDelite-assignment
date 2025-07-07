import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login/Login';
import Home from './pages/Home/Home';
import Signup from './pages/Signup/Signup';
import PrivateRoute from './components/PrivateRoute';
import NotFoundPage from './pages/NotFound/NotFoundPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
        {/* Private Route */}
        <Route element={<PrivateRoute/>}>
          <Route path="/home" element={<Home />} />
        </Route>

        {/* Not found page */}
        <Route path='/*' element={<NotFoundPage/>} />
        
      </Routes>
    </Router>
  );
}

export default App;
