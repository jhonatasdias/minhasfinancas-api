import React, { useState } from "react";
import Card from '../components/card'
import FormGroup from '../components/form-group'
import { useNavigate } from 'react-router-dom'
import { mensagemSucesso, mensagemErro, mensagemAlerta } from '../components/toastr'

import UsuarioService from "../app/service/usuarioService";

function CadastroUsuario() {
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [senhaRepeticao, setSenhaRepeticao] = useState('');

    const navigate = useNavigate();

    const service = new UsuarioService();

    const validar = () => {
        const msgs = []

        if(!nome){
            msgs.push('O campo Nome é obrigatório');
        }

        if(!email){
            msgs.push('O campo Email é obrigatório');
        } else if( !email.match(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/ // REGEX
        ) ){
            msgs.push('Informe um Email válido.')
        }

        if(!senha || !senhaRepeticao){
            msgs.push('Digite a senha 2x')
        } else if( senha !== senhaRepeticao ){
            msgs.push('As senhas não batem.')
        }

        return msgs;
    }

    const cadastrar = () => {
        
        const msgs = validar();

        if( msgs && msgs.length > 0){
            msgs.forEach( (msg, index) => {
                mensagemAlerta(msg)
            });
            return false;
        }

        const usuario = { 
            nome: nome, 
            email: email, 
            senha: senha 
        }

        console.log(usuario)
        
        service.salvar(usuario)
                .then( () => {
                    mensagemSucesso('Usuário cadastrado com sucesso! Faça o login para acessar o sistema.');
                    navigate('/login')
                })
                .catch(error => {
                    mensagemErro(error.response.data)
                })
    }

    const cancelarCadastro = () => {
        navigate('/login');
    }

    return (
        <div>
            <Card title="Cadastro de Usuário">
                <div className="row">
                    <div className="col-lg-12">
                        <div className="bs-component">
                            <FormGroup label="Nome: *" htmlFor="inputNome">
                                <input type="text"
                                    id="inputNome"
                                    className="form-control"
                                    name="nome"
                                    value={nome}
                                    onChange={e => setNome(e.target.value)} />
                            </FormGroup>
                            <FormGroup label="Email: *" htmlFor="inputEmail">
                                <input type="text"
                                    id="inputEmail"
                                    className="form-control"
                                    name="email"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)} />
                            </FormGroup>
                            <FormGroup label="Senha: *" htmlFor="inputSenha">
                                <input type="password"
                                    id="inputSenha"
                                    className="form-control"
                                    name="senha"
                                    value={senha}
                                    onChange={e => setSenha(e.target.value)} />
                            </FormGroup>
                            <FormGroup label="Repita a senha: *" htmlFor="inputRepitaSenha">
                                <input type="password"
                                    id="inputRepitaSenha"
                                    className="form-control"
                                    name="senhaRepeticao"
                                    value={senhaRepeticao}
                                    onChange={e => setSenhaRepeticao(e.target.value)} />
                            </FormGroup>
                            <button onClick={cadastrar} className="btn btn-success">
                                <i className="pi pi-save"></i> Salvar
                            </button>
                            <button onClick={cancelarCadastro} className="btn btn-danger">
                                <i className="pi pi-times"></i> Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
}

export default CadastroUsuario;
