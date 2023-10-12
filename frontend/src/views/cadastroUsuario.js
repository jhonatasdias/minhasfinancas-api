import React, { useState } from "react";
import Card from '../components/card'
import FormGroup from '../components/form-group'
import { useNavigate } from 'react-router-dom'

function CadastroUsuario() {
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [senhaRepeticao, setSenhaRepeticao] = useState('');

    const navigate = useNavigate();

    const cadastrar = () => {
        console.log({ nome, email, senha, senhaRepeticao });
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
                            <button onClick={cadastrar} className="btn btn-success">Salvar</button>
                            <button onClick={cancelarCadastro} className="btn btn-danger">Cancelar</button>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
}

export default CadastroUsuario;
