import React from 'react'
import {Navigate, Outlet} from 'react-router-dom'

function ProtectedRoutes() {
    const auth=localStorage.getItem("JWT");
    if(!auth){
      return  <Navigate to="/"/>
    }
    else{
        return <Outlet/>
    }
//   return auth ? <Outlet/> : <Navigate to="/"/>
    
}

export default ProtectedRoutes