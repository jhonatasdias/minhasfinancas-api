/* import React, { useState } from "react";
import Card from '../components/card'
import FormGroup from '../components/form-group'
import { useNavigate } from 'react-router-dom'

import UsuarioService from "../app/service/usuarioService";

class Login extends React.Component {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [mensagemErro, setMensagemErro] = useState(null);

    constructor(){
        super();
        this.service = new UsuarioService();
    }

    const navigate = useNavigate();

    const entrar = () => {
        axios.post(
            'http://localhost:8080/api/usuarios/autenticar', {
                email: email,
                senha: senha
            }).then( response => {
                localStorage.setItem('_usuario_logado', JSON.stringify(response.data))

                navigate('/home');
            }).catch( e => {
                setMensagemErro(e.response.data);
            })
    }

    const prepareCadastrar = () => {
        navigate('/cadastro-usuario');
    }

    return (
        <div className="row">
            <div className="col-md-6" style={{ position: 'relative', left: '300px' }}>
                <div className="bs-docs-section">
                    <Card title='Login'>
                        <div className="row">
                            <span>{mensagemErro}</span>
                        </div>
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="bs-component">
                                    <fieldset>
                                        <FormGroup label="Email: *" htmlFor="exampleInputEmail1">
                                            <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Digite o Email" />
                                        </FormGroup>
                                        <FormGroup label="Senha: *" htmlFor="exampleInputPassword1">
                                            <input type="password" value={senha} onChange={e => setSenha(e.target.value)} className="form-control" id="exampleInputPassword1" aria-describedby="emailHelp" placeholder="Password" />
                                        </FormGroup>
                                        <button onClick={entrar} className="btn btn-success">Entrar</button>
                                        <button onClick={prepareCadastrar} className="btn btn-warning">Cadastrar</button>
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

export default Login; */





/* import React from "react";

import Card from '../components/card'
import FormGroup from '../components/form-group'
import { useNavigate } from 'react-router-dom'

import UsuarioService from "../app/service/usuarioService";

class Login extends React.Component {
    
    state = {
        email: '',
        senha: '',
        mensagemErro: null
    }

    constructor(){
        super();
        this.service = new UsuarioService();
    }

    navigate = useNavigate();

    entrar = () => {
        this.service.autenticar({
            email: this.state.email,
            senha: this.state.senha
        }).then( response => {
            localStorage.setItem('_usuario_logado', JSON.stringify(response.data))

            this.navigate('/home');
        }).catch( e => {
            this.setState({ mensagemErro: e.response.data })
        })
    }

    prepareCadastrar = () => {
        this.navigate('/cadastro-usuario');
    }

    render(){
        return(

            <div className="row">
                <div className="col-md-6 offset-md-3">
                    <div className="bs-docs-section">
                        <Card title="Login">
                            <div className="row">
                                <div className="col-lg-12">
                                    <div className="bs-component">
                                        <fieldset>
                                            <FormGroup label="Email: *" htmlFor="exampleInputEmail1">
                                                <input type="email" 
                                                    value={this.state.email}
                                                    onChange={e => this.setState({email: e.target.value})}
                                                    className="form-control" 
                                                    id="exampleInputEmail1" 
                                                    aria-describedby="emailHelp" 
                                                    placeholder="Digite o Email" />
                                            </FormGroup>
                                            <FormGroup label="Senha: *" htmlFor="exampleInputPassword1">
                                                <input type="password" 
                                                        value={this.state.senha}
                                                        onChange={e => this.setState({senha: e.target.value})}
                                                        className="form-control" 
                                                        id="exampleInputPassword1" 
                                                        placeholder="Password" />
                                            </FormGroup>
                                            <button onClick={this.entrar} className="btn btn-success">
                                                <i className="pi pi-sign-in"></i>Entrar</button>
                                            <button onClick={this.prepareCadastrar} 
                                                    className="btn btn-danger">
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

        )
    }
}

export default Login; */