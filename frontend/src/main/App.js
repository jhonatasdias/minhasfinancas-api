import React from 'react'

import AppRouter from './router'
import Navbar from '../components/navbar'
import { BrowserRouter as Router } from "react-router-dom";

import 'toastr/build/toastr.css'

import 'bootswatch/dist/flatly/bootstrap.css'
import '../custom.css'
import 'toastr/build/toastr.min.css'

//theme
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import 'primeicons/primeicons.css';
import ProvedorAutenticacao from './provedorAutenticacao';
        

class App extends React.Component {
  
  render(){
    return (
      <ProvedorAutenticacao>
        <Router>
          <Navbar/>
          <div className='container'>
            <AppRouter/>
          </div>
        </Router>
      </ProvedorAutenticacao>
    )
  }
}

export default App;
