import React, { useState } from "react";
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

function ConsultaLancamento() {
    
    const [ano, setAno] = useState('');
    const [mes, setMes] = useState('');
    const [tipo, setTipo] = useState('');
    const [lancamentos, setLancamentos] = useState([]);
    const [descricao, setDescricao] = useState('');
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [lancamentoDeletar, setLancamentoDeletar] = useState({});

    const service = new LancamentoService();

    const navigate = useNavigate();

    const buscar = () => {

        if(!ano){
            messages.mensagemAlerta('O preenchimento do campo Ano é obrigatório.')
            return false;
        }

        const usuarioLogado = LocalStorageService.obterItem('_usuario_logado')

        const lancamentoFiltro = {
            ano: ano,
            mes: mes,
            tipo: tipo,
            usuario: usuarioLogado.id,
            descricao: descricao
        }

        service.consultar(lancamentoFiltro)
                .then( resposta => {
                    const lista = resposta.data;
                    if(lista.length < 1){
                        messages.mensagemAlerta("Nenhum resultado encontrado.");
                    }
                    setLancamentos(resposta.data);
                })
                .catch( error => {
                    console.log(error)
                })
    }

    const meses = service.obterListaMeses();

    const tipos = service.obterListaTipos();

    const editar = (id) => {
        navigate(`/cadastro-lancamento/${id}`);
    }

    const abrirConfirmacao = (lancamento) => {
        setShowConfirmDialog(true);
        setLancamentoDeletar(lancamento);
    }

    const cancelarDelecao = () => {
        setShowConfirmDialog(false);
        setLancamentoDeletar({});
    }

    const deletar = () => {
        service.deletar(lancamentoDeletar.id)
                .then( _ => {
                    const updateLancamentos = lancamentos.filter(item => item.id !== lancamentoDeletar.id);
                    setLancamentos(updateLancamentos);
                    setShowConfirmDialog(false);
                    
                    messages.mensagemSucesso('Lançamento deletado com sucesso');
                })
                .catch( _ => {
                    messages.mensagemErro('Ocorreu um erro ao tentar deletar um lançamento.')
                })
    }

    const confirmDialogFooter = (
        <div>
            <Button label="Cancelar" icon="pi pi-times" onClick={cancelarDelecao} className="p-button-text" />
            <Button label="Confirmar" icon="pi pi-check" onClick={deletar} autoFocus />
        </div>
    );

    const alterarStatus = (lancamento, status) => {
        service.alterarStatus(lancamento.id, status)
                .then( _ => {
                    
                    const updatedLancamentos = lancamentos.map(item => {
                        if (item.id === lancamento.id) {
                            return { ...item, status: status };
                        } else {
                            return item;
                        }
                    });
                    setLancamentos(updatedLancamentos);
                
                    messages.mensagemSucesso("Status Alterado com sucesso.")
                })
                .catch( _ => {
                    messages.mensagemErro("Error ao tentar atualizar o status.  ")
                })
    }

    return (
        <Card title="Consulta Lançamentos">
            <div className="row">
                <div className="col-md-6" >
                    <div className="bs-component">
                        <FormGroup htmlFor="inputAno" label="Ano= *">
                            <input type="text" 
                                    className="form-control" 
                                    id="inputAno" 
                                    value={ano}
                                    onChange={e => setAno(e.target.value)}
                                    placeholder="Digite o Ano"/>
                        </FormGroup>

                        <FormGroup htmlFor="inputMes" label="Mes= *">
                            <SelecMenu id="inputMes"
                                        value={mes}
                                        onChange={e => setMes(e.target.value)} 
                                        className="form-control" 
                                        lista={meses} />
                        </FormGroup>

                        <FormGroup htmlFor="inputDescricao" label="Descrição= *">
                            <input type="text" 
                                    className="form-control" 
                                    id="inputDescricao" 
                                    value={descricao}
                                    onChange={e => setDescricao(e.target.value)}
                                    placeholder="Digite a Descrição "/>
                        </FormGroup>

                        <FormGroup htmlFor="inputTipo" label="Tipo de Lancamento= *">
                            <SelecMenu id="inputTipo" 
                                        value={tipo}
                                        onChange={e => setTipo(e.target.value)}
                                        className="form-control" 
                                        lista={tipos} />
                        </FormGroup>

                        <br/>
                        <button onClick={buscar} 
                                type="button" 
                                className="btn btn-success">
                                    <i className="pi pi-search"></i> Buscar
                        </button>
                        <button onClick={e => navigate('/cadastro-lancamento')} 
                                type="button" 
                                className="btn btn-danger">
                                  <i className="pi pi-plus"></i>  Cadastrar
                        </button>
                        <br/>
                        <br/>
                    </div>
                </div>
                <div className="col-md-12">
                    <div className="bs-component">
                        <LancamentosTable lancamentos={lancamentos} 
                                            editAction={editar}
                                            deleteAction={abrirConfirmacao}
                                            alterarStatus={alterarStatus} />
                            
                    </div>
                </div>
            </div>
            <div>
                <Dialog header={`Exclusão do lancamento ${lancamentoDeletar.descricao}`} 
                        visible={showConfirmDialog} 
                        style={{ width: '50vw' }} 
                        modal={true}
                        onHide={() => setShowConfirmDialog(false)} 
                        footer={confirmDialogFooter}>
                    <p className="m-0">
                        Confirma a exclusão desse lancamento?
                    </p>
                </Dialog>
            </div>
        </Card>
    )

}

export default ConsultaLancamento