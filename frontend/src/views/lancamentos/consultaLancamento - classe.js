import React, { Component } from "react";
import Card from "../../components/card";
import FormGroup from "../../components/form-group";
import SelecMenu from "../../components/selecMenu";
import LancamentosTable from "./lancamentosTable";

import LancamentoService from "../../app/service/lancamentoService";
import LocalStorageService from "../../app/service/localstorageService";

import * as messages from '../../components/toastr'

import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { useNavigate } from "react-router-dom";
import NavegacaoButton from "../../components/navegacaoButton";

class ConsultaLancamento extends Component {
    
    state = {
        ano: '',
        mes: '',
        tipo: '',
        descricao: '',
        showConfirmDialog: false,
        lancamentoDeletar: {},
        lancamentos : []
    }

    constructor(){
        super();
        this.service = new LancamentoService();
    }

    buscar = () => {
        if(!this.state.ano){
            messages.mensagemErro('O preenchimento do campo Ano é obrigatório.')
            return false;
        }

        const usuarioLogado = LocalStorageService.obterItem('_usuario_logado');

        const lancamentoFiltro = {
            ano: this.state.ano,
            mes: this.state.mes,
            tipo: this.state.tipo,
            descricao: this.state.descricao,
            usuario: usuarioLogado.id
        }

        this.service
            .consultar(lancamentoFiltro)
            .then( resposta => {
                const lista = resposta.data;
                
                if(lista.length < 1){
                    messages.mensagemAlerta("Nenhum resultado encontrado.");
                }
                this.setState({ lancamentos: lista })
            }).catch( error => {
                console.log(error)
            })
    }

    navigate = (url) => {
        this.navigate = useNavigate();
        this.navigate(url)
    }

    editar = (lancamento) => {
        this.navigate(`/cadastro-lancamento/${lancamento.id}`)
    }

    abrirConfirmacao = (lancamento) => {
        this.setState({ showConfirmDialog : true, lancamentoDeletar: lancamento  })
    }

    cancelarDelecao = () => {
        this.setState({ showConfirmDialog : false, lancamentoDeletar: {}  })
    }

    deletar = () => {
        this.service
            .deletar(this.state.lancamentoDeletar.id)
            .then(response => {
                const lancamentos = this.state.lancamentos;
                const index = lancamentos.indexOf(this.state.lancamentoDeletar)
                lancamentos.splice(index, 1);
                this.setState( { lancamentos: lancamentos, showConfirmDialog: false } )
                messages.mensagemSucesso('Lançamento deletado com sucesso!')
            }).catch(error => {
                messages.mensagemErro('Ocorreu um erro ao tentar deletar o Lançamento')
            })
    }

    alterarStatus = (lancamento, status) => {
        this.service
            .alterarStatus(lancamento.id, status)
            .then( response => {
                const lancamentos = this.state.lancamentos;
                const index = lancamentos.indexOf(lancamento);
                if(index !== -1){
                    lancamento['status'] = status;
                    lancamentos[index] = lancamento
                    this.setState({lancamento});
                }
                messages.mensagemSucesso("Status atualizado com sucesso!")
            })
    }

    render(){
        const meses = this.service.obterListaMeses();
        const tipos = this.service.obterListaTipos();

        const confirmDialogFooter = (
            <div>
                <Button label="Confirmar" icon="pi pi-check" onClick={this.deletar} />
                <Button label="Cancelar" icon="pi pi-times" onClick={this.cancelarDelecao} 
                        className="p-button-secondary" />
            </div>
        );

        return (
            <Card title="Consulta Lançamentos">
                <div className="row">
                    <div className="col-md-6">
                        <div className="bs-component">
                            <FormGroup htmlFor="inputAno" label="Ano: *">
                                <input type="text" 
                                       className="form-control" 
                                       id="inputAno" 
                                       value={this.state.ano}
                                       onChange={e => this.setState({ano: e.target.value})}
                                       placeholder="Digite o Ano" />
                            </FormGroup>

                            <FormGroup htmlFor="inputMes" label="Mês: ">
                                <SelecMenu id="inputMes" 
                                            value={this.state.mes}
                                            onChange={e => this.setState({ mes: e.target.value })}
                                            className="form-control" 
                                            lista={meses} />
                            </FormGroup>

                            <FormGroup htmlFor="inputDesc" label="Descrição: ">
                                <input type="text" 
                                       className="form-control" 
                                       id="inputDesc" 
                                       value={this.state.descricao}
                                       onChange={e => this.setState({descricao: e.target.value})}
                                       placeholder="Digite a descrição" />
                            </FormGroup>

                            <FormGroup htmlFor="inputTipo" label="Tipo Lançamento: ">
                                <SelecMenu id="inputTipo" 
                                            value={this.state.tipo}
                                            onChange={e => this.setState({ tipo: e.target.value })}
                                            className="form-control" 
                                            lista={tipos} />
                            </FormGroup>

                            <button onClick={this.buscar} 
                                    type="button" 
                                    className="btn btn-success">
                                    <i className="pi pi-search"></i> Buscar
                            </button>
                            <NavegacaoButton rotaDestino="/cadastro-lancamento" texto="Cadastrar" classNameButton="btn btn-danger" classNameIcon="pi pi-plus"/>

                        </div>
                        
                    </div>
                </div>   
                <br/ >
                <div className="row">
                    <div className="col-md-12">
                        <div className="bs-component">
                            <LancamentosTable lancamentos={this.state.lancamentos} 
                                              deleteAction={this.abrirConfirmacao}
                                              editAction={id => this.editar(id)}
                                              alterarStatus={this.alterarStatus} />
                        </div>
                    </div>  
                </div> 
                <div>
                    <Dialog header="Confirmação" 
                            visible={this.state.showConfirmDialog} 
                            style={{width: '50vw'}}
                            footer={confirmDialogFooter} 
                            modal={true} 
                            onHide={() => this.setState({showConfirmDialog: false})}>
                        Confirma a exclusão deste Lançamento?
                    </Dialog>
                </div>           
            </Card>

        )
    }
    
}

export default ConsultaLancamento