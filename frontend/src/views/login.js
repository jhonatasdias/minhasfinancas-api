import React, { useState } from "react";

import Card from '../components/card'
import FormGroup from '../components/form-group'
import { useNavigate } from 'react-router-dom'

import UsuarioService from "../app/service/usuarioService";

function Login() {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [mensagemErro, setMensagemErro] = useState(null);

    const navigate = useNavigate();
    const service = new UsuarioService();

    const entrar = () => {
        service.autenticar({
            email,
            senha
        }).then(response => {
            localStorage.setItem('_usuario_logado', JSON.stringify(response.data));
            navigate('/home');
        }).catch(e => {
            setMensagemErro(e.response.data);
        });
    }

    const prepareCadastrar = () => {
        navigate('/cadastro-usuario');
    }

    return (
        <div className="row">
            <div className="col-md-6 offset-md-3">
                <div className="bs-docs-section">
                    <Card title="Login">
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="bs-component">
                                    <fieldset>
                                        <FormGroup label="Email: *" htmlFor="exampleInputEmail1">
                                            <input
                                                type="email"
                                                value={email}
                                                onChange={e => setEmail(e.target.value)}
                                                className="form-control"
                                                id="exampleInputEmail1"
                                                aria-describedby="emailHelp"
                                                placeholder="Digite o Email"
                                            />
                                        </FormGroup>
                                        <FormGroup label="Senha: *" htmlFor="exampleInputPassword1">
                                            <input
                                                type="password"
                                                value={senha}
                                                onChange={e => setSenha(e.target.value)}
                                                className="form-control"
                                                id="exampleInputPassword1"
                                                placeholder="Password"
                                            />
                                        </FormGroup>
                                        <button onClick={entrar} className="btn btn-success">
                                            <i className="pi pi-sign-in"></i>Entrar
                                        </button>
                                        <button onClick={prepareCadastrar} className="btn btn-danger">
                                            <i className="pi pi-plus"></i>  Cadastrar
                                        </button>
                                    </fieldset>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}

export default Login;