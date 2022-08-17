import './App.css';
import Navbar from './Components/Navbar';
import Register from './Components/Register';
import Login from './Components/Login';
import {Routes,Route, Navigate, useNavigate} from 'react-router-dom'
import Home from './Components/Home';
import NotFound from './Components/NotFound';
import { useEffect, useState } from 'react';
import jwtDecode from 'jwt-decode';
function App() {
  let navigate = useNavigate()
  const [userData, setUserData] = useState(null);
  function saveData()
  {
    let encodedToken = localStorage.getItem('userToken');
    let decodedToken = jwtDecode(encodedToken);
    setUserData(decodedToken)
  };
  // console.log(userData);
  useEffect(()=>{
    if(localStorage.getItem('userToken'))
    {
      saveData()
    }
  }, []);
  function ProtectedRoute(props)
  {
    if(!localStorage.getItem('userToken'))
    {
      return <Navigate to='/login'/>
    }else{
      return props.children
    }
  };
  function logOut()
  {
    localStorage.removeItem('userToken');
    setUserData(null);
    navigate('/login')
  }

  
  return (
    < >
     
    <Navbar logOut={logOut} userData={userData}/>

    <Routes>
    <Route path='/' element={<Login/>}/>
      <Route path='/home' element={<ProtectedRoute><Home userData={userData}/></ProtectedRoute>}/>
      <Route path='/register' element={<Register/>}/>
      <Route path='/login' element={<Login saveData={saveData}/>}/>
      <Route path='*' element={<NotFound/>}/>
    </Routes>
    
    </>
  );
}

export default App;
