import React from "react";
import { Routes, Route, Navigate } from 'react-router-dom';

import Login from '../views/login';
import Home from '../views/home';
import CadastroUsuario from "../views/cadastroUsuario";
import ConsultaLancamento from "../views/lancamentos/consultaLancamento";
import CadastroLancamentos from "../views/lancamentos/cadastroLancamentos";
import AuthService from "../app/service/authService";

function AppRouter() {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/cadastro-usuario" element={<CadastroUsuario />} />
            
            <Route path="/home" element={AuthService.isUsuarioAutenticado() ? <Home /> : <Navigate to="/login" />} />
            <Route path="/consulta-lancamento" element={AuthService.isUsuarioAutenticado() ? <ConsultaLancamento /> : <Navigate to="/login" />} />
            <Route path="/cadastro-lancamento" element={AuthService.isUsuarioAutenticado() ? <CadastroLancamentos /> : <Navigate to="/login" />} />
            <Route path="/cadastro-lancamento/:id" element={AuthService.isUsuarioAutenticado() ? <CadastroLancamentos /> : <Navigate to="/login" />} />
        </Routes>
    );
}

export default AppRouter;