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
import CheckOut from './components/CheckOut/CheckOut';
import SuccessPage from './components/SuccessPage/SuccessPage';
// import { ScrollArrows } from './components/ScrollDownButton';
// import { useScroll } from './components/Context/ScrollProvider';
// import CheckOut from './components/CheckOut/CheckOut';

function App() {
  // const {sectionRefs, activeIndex} = useScroll();
  return (
    <>
      <Toaster position="top-center" />
      <ScrollToTop />
      {/* <ScrollArrows
      sectionRefs={sectionRefs}
      currentIndex={activeIndex}
      showLabels={true}
      direction='vertical'
      /> */}

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
          <Route path="checkout" element={<CheckOut/>} />
          <Route path="success" element={<SuccessPage/>} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
