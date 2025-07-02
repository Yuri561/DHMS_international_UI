import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Home from './components/Home/Home';
import Shop from './components/Shop/Shop';
import Cart from './components/Cart/Cart';
import SignIn from './components/SignIn/SignIn';
import SignUp from './components/SignUp/SignUp';
import Dashboard from './components/Dashboard/Dashboard';
import Contact from './components/Contact/Contact';
import ScrollToTop from './components/ScrollToTop/ScrollToTop';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <>
      <Toaster position="top-center" />
      <ScrollToTop />

      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="home" element={<Home />} />
          <Route path="shop" element={<Shop />} />
          <Route path="cart" element={<Cart />} />
          <Route path="login" element={<SignIn />} />
          <Route path="register" element={<SignUp />} />
          <Route path="contact" element={<Contact />} />
          <Route path="dashboard" element={<Dashboard />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
