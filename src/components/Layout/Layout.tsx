import { Outlet } from 'react-router-dom'

import Footer from '../Footer/Footer'
import HeaderRevamp from '../Header/HeaderRevamp'
const Layout = () => {
  return (
    <div>
    <HeaderRevamp/>
    <Outlet/>
    <Footer/>
    
    </div>
  )
  
}

export default Layout