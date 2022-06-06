import React from 'react'
import Login from "./Login"
import Dashboard from "./Dashboard"

import "bootstrap/dist/css/bootstrap.min.css"

const code = new URLSearchParams(window.location.search).get("code") // get the code to send it to server 
const App = () => {
  // mean if i login sent the code  if not open login page 
  return code ? <Dashboard code={code} /> : <Login />

}

export default App
