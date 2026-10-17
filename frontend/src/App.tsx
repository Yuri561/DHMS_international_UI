import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Home from './components/Home/Home';
import Shop from './components/Shop/Shop';
import Cart from './components/Cart/Cart';
import Contact from './components/Contact/Contact';
import ScrollToTop from './components/ScrollToTop/ScrollToTop';
import { Toaster } from 'react-hot-toast';
import CheckOut from './components/CheckOut/CheckOut';
import SuccessPage from './components/SuccessPage/SuccessPage';
import CancelPage from './components/CancelPage/CancelPage';
import ResetPassword from './components/SignIn/ResetPassword';


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
          <Route path="contact" element={<Contact />} />
          <Route path="checkout" element={<CheckOut />} />
          <Route path="success" element={<SuccessPage/>} />
          <Route path="cancel" element={<CancelPage/>} />
          <Route path="reset-password" element={<ResetPassword/>} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
