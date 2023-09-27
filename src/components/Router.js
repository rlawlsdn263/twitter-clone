import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Auth from 'routes/Auth';
import Home from 'routes/Home';
import Profile from 'routes/Profile';
import Navigation from 'components/Navigation';

const AppRouter = ({ isLoggedIn, userObj }) => {
  return (
    <Router>
      { 
        isLoggedIn && <Navigation /> 
      }
      <Routes>
        {/* userObj를 Home한테 Prop으로 전달함 */}
        <Route path="/" element={isLoggedIn ? <Home userObj={userObj} /> : <Auth />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Router>
  )
}

export default AppRouter;