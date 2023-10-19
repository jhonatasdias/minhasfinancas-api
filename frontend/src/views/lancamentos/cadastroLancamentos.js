import React, { useEffect, useState } from "react";

import Card from "../../components/card";
import FormGroup from "../../components/form-group";
import SelecMenu from "../../components/selecMenu";
import * as messages from "../../components/toastr";
import LocalStorageService from "../../app/service/localstorageService";

import LancamentoService from "../../app/service/lancamentoService";
import { useNavigate, useParams } from 'react-router-dom'

function CadastroLancamentos () {
    
    const params = useParams();
    const [id, setId] = useState('');
    const [descricao, setDescrica] = useState('');
    const [ano, setAno] = useState('');
    const [mes, setMes] = useState('');
    const [valor, setValor] = useState('');
    const [tipo, setTipo] = useState('');
    const [status, setStatus] = useState('');
    const [atualizando, setAtuazlizando] = useState(false);

    const formulario = {
        descricao,
        ano,
        mes,
        valor,
        tipo
    }

    const service = new LancamentoService();

    const navigate = useNavigate();
    
    const tipos = service.obterListaTipos();
    const meses = service.obterListaMeses();

    // executes after the page redenring

    useEffect(() => {
        
        if(params.id){
            service.obterPorId(params.id)
                    .then( response => {
                        const data = response.data;
                        setDescrica(data.descricao);
                        setAno(data.ano);
                        setMes(data.mes);
                        setValor(data.valor);
                        setTipo(data.tipo);
                        setStatus(data.status);
                        setAtuazlizando(true);
                    })
                    .catch( error => {
                        messages.mensagemErro(error)
                    })
        }
    }, [params.id])

    const atualizar = () => {
        const usuarioLogado = LocalStorageService.obterItem('_usuario_logado')
        
        const formularioAtualizado = { descricao, valor, mes, ano, tipo, usuario:  usuarioLogado.id, status, id}

        formularioAtualizado.id = (params.id);
        
        console.log(formularioAtualizado);
        
        service.atualizar(formularioAtualizado)
                .then( _ => {
                    messages.mensagemSucesso('Lançamento atualizado com sucesso')
                    navigate('/consulta-lancamento')
                })
                .catch( error => {
                    messages.mensagemErro(error)
                })
    }

    const submit = () => {

        const usuarioLogado = LocalStorageService.obterItem('_usuario_logado')
        
        formulario.usuario = usuarioLogado.id;

        try{
            service.validar(formulario);
        } catch(erro) {
            const mensagens = erro.mensagens;
            mensagens.forEach( msg => messages.mensagemAlerta(msg))
            return false;
        }

        service.salvar(formulario)
                .then( _ => {
                    messages.mensagemSucesso('Lançamento cadastrado com sucesso')
                    navigate('/consulta-lancamento')
                })
                .catch( error => {
                    messages.mensagemErro(error.response.data)
                })
    }

    return (
        <Card title={ atualizando ? 'Atualização de Lancamento' : 'Cadastro de Lançamento'}>
            <div className="row">
                <div className="col-md-12">
                    <FormGroup id="inputDescricao" label="Descricao= *">
                        <input type="text" 
                                className="form-control"
                                name="descricao"
                                value={descricao}
                                onChange={e => setDescrica(e.target.value)}/>
                    </FormGroup>
                </div>
            </div>
            <div className="row">
                <div className="col-md-6">
                    <FormGroup id="inputAno" label="Ano= *">
                        <input type="text" 
                                className="form-control"
                                name="ano"
                                value={ano}
                                onChange={e => setAno(e.target.value)}/>
                    </FormGroup>
                </div>
                <div className="col-md-6">
                    <FormGroup id="inputMes" label="Mês= *">
                        <SelecMenu id="inputMes" 
                                    lista={meses} 
                                    className="form-control"
                                    name="mes"
                                    value={mes}
                                    onChange={e => setMes(e.target.value)}/>
                    </FormGroup>
                </div>
            </div>
            <div className="row">
                <div className="col-md-4">
                    <FormGroup id="inputValor" label="Valor= *">
                        <input id="inputValor" 
                                type="text" 
                                className="form-control"
                                name="valor"
                                value={valor}
                                onChange={e => setValor(e.target.value)}/>
                    </FormGroup>
                </div>
                <div className="col-md-4">
                    <FormGroup id="inputTipo" label="Tipo= *">
                        <SelecMenu id="inputTipo" 
                                    lista={tipos} 
                                    className="form-control"
                                    name="tipo"
                                    value={tipo}
                                    onChange={e => setTipo(e.target.value)} />
                    </FormGroup>
                </div>
                <div className="col-md-4">
                    <FormGroup id="inputStatus" label="Status= *">
                        <input type="text" 
                                className="form-control" 
                                disabled 
                                name="status"
                                value={status} />
                    </FormGroup>
                </div>

                
                <div className="row">
                    <div className="col-md-6">
                        <br/>
                        { atualizando ?
                            (
                                <button onClick={atualizar} className="btn btn-primary">
                                    <i className="pi pi-refresh"></i> Atualizar
                                </button>
                            ) : (
                                <button onClick={submit} className="btn btn-success">
                                    <i className="pi pi-save"></i> Salvar
                                </button>
                            )
                        }
                        <button onClick={e => navigate('/consulta-lancamento')} className="btn btn-danger">
                            <i className="pi pi-times"></i>  Cancelar
                        </button>
                    </div>
                </div>
            </div>
        </Card>
    )
}

export default CadastroLancamentos