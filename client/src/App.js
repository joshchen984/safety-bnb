import logo from './logo.svg';
import './App.css';

import Home from './pages/Home';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import Signup from './pages/Signup';
import { Login } from './pages/Login';
import Bookmarks from './pages/Bookmarks';
import Statistics from './pages/Stats'
import Nav from './components/Nav'
import { useEffect } from 'react';
import firebaseClient from './auth/firebaseClient';

function App() {
  return (
    <>
    <div className="App">
      <BrowserRouter>
    <Nav/>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/signup' element={<Signup/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/bookmarks/:userId' element={<Bookmarks/>}/>
        <Route path='/stats' element={<Statistics/>}/>
      </Routes>
      </BrowserRouter>
    </div>
    </>
  );
}

export default App;
