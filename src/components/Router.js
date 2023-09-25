import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Auth from '../routes/Auth';
import Home from '../routes/Home';

const AppRouter = ({ isLoggedIn }) => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={isLoggedIn ? <Home /> : <Auth />} />
      </Routes>
    </Router>
  )
}

export default AppRouter;