import React from 'react'

import AppRouter from './router'
import Navbar from '../components/navbar'

import 'bootswatch/dist/flatly/bootstrap.css'

import '../custom.css'

class App extends React.Component {
  
  render(){
    return (
      <>
        <Navbar/>
        <div className='container'>
          <AppRouter/>
        </div>
      </>
    )
  }
}

export default App;
