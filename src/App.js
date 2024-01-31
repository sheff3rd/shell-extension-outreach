import React from 'react'
import Navigation from './components/Navigation'

import logo from './logo.svg'
import './App.css'

const App = () => {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />

        <Navigation />
      </header>
    </div>
  )
}

export default App
