import React from "react";

import Login from '../views/login'
import Home from '../views/home'

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CadastroUsuario from "../views/cadastroUsuario";

function AppRouter(){
    return(
        <Router>
            <Routes>
                <Route path="/home" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/cadastro-usuario" element={<CadastroUsuario />} />
            </Routes>
        </Router>
    )
}

export default AppRouter