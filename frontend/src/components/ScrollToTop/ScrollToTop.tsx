
// this component is to allow us to automatically scroll to the top
// of the page with each navigation

import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
    const {pathname} = useLocation()

    useEffect(() => {
        window.scrollTo({top:0,  behavior: 'smooth'});
    }, [pathname])

    return null; 
}


export default ScrollToTop