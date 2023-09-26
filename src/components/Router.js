import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Auth from 'routes/Auth';
import Home from 'routes/Home';
import Profile from 'routes/Profile';
import Navigation from 'components/Navigation';

const AppRouter = ({ isLoggedIn }) => {
  return (
    <Router>
      { 
        isLoggedIn && <Navigation /> 
      }
      <Routes>
        <Route path="/" element={isLoggedIn ? <Home /> : <Auth />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Router>
  )
}

export default AppRouter;