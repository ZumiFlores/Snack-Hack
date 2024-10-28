import React from 'react'
import Login from './Login'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Signup from './Signup'
import Home from './Home'

//code learned from https://youtu.be/F53MPHqOmYI?si=XuTNyzR7o-POqHBF

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path = '/' element = {<Login />}></Route>
        <Route path = '/signup' element = {<Signup />}></Route>
        <Route path = '/home' element = {<Home />}></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
