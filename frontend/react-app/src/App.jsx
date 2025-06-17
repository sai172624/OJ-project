import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { BrowserRouter, Route,Routes} from 'react-router-dom';
import Register from './authentication/registerpage';
import Homepage from './homepage';  


import Navbar from './navbar';


function App() {
  
  return (
    
    <BrowserRouter>
      <Navbar/>
      <Routes>
        <Route path='/' element={<Homepage/>} />
      <Route path="/login" element={<Register/>} />
      <Route path="/register" element={<Register/>} />
      </Routes>

     
    </BrowserRouter>
     

    
  );
}

export default App
