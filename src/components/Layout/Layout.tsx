import { Outlet } from 'react-router-dom'

import Footer from '../Footer/Footer'
import HeaderRevamp from '../Header/HeaderRevamp'
import HeaderV2 from '../Header/HeaderV2';
const Layout = () => {
  return (
    <div>
    <HeaderV2/>
    <Outlet/>
    <Footer/>
    
    </div>
  )
  
}

export default Layout