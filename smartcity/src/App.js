import React, { useEffect, useState } from 'react';
import './App.css';
import Navbar from './Components/Navbar/Navbar';
import Header from './Components/Header/Header';
import Footer from './Components/Footer/Footer';
import Home from './Pages/Home/Home';
import Places from './Pages/Places/Places';
import Schools from './Pages/Schools/Schools';
import Hospitals from './Pages/Hospitals/Hospitals';
import Transport from './Pages/Transport/Transport';
import Attractions from './Pages/Attractions/Attractions';
import PublicLogin from './Pages/Auth/PublicLogin';
import PublicRegister from './Pages/Auth/PublicRegister';
import RaiseComplaint from './Pages/Complaints/RaiseComplaint';
import AdminDashboard from './Pages/Admin/AdminDashboard';
import AdminComplaintDetail from './Pages/Admin/ComplaintDetail';
import ViewComplaints from './Pages/Complaints/ViewComplaints';

function App() {
  const [route, setRoute] = useState(window.location.hash || '#/');

  useEffect(() => {
    const onHash = () => setRoute(window.location.hash || '#/');
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const path = (route || '#/').replace(/^#/, '');

    let Page = null;
    if (path === '/') Page = <Home />;
    else if (path === '/schools') {
      Page = <Schools />;
    } else if (path === '/hospitals') {
      Page = <Hospitals />;
    } else if (path === '/transport') {
      Page = <Transport />;
    } else if (path === '/attractions') {
      Page = <Attractions />;
    } else if (path === '/login') {
      Page = <PublicLogin />;
    } else if (path === '/register') {
      Page = <PublicRegister />;
    } else if (path === '/raise') {
      Page = <RaiseComplaint />;
    } else if (path === '/view-complaints' || path === '/complaints') {
      
      Page = <ViewComplaints />;
    }  else {
      Page = <Home />;
    }

  return (
    <div className="App">
      <Header />
      <Navbar />
      {Page}
      <Footer />
    </div>
  );
}

export default App;
