import React, { Component } from "react";
import Card from "../../components/card";
import FormGroup from "../../components/form-group";
import SelecMenu from "../../components/selecMenu";
import * as messages from "../../components/toastr";
import LocalStorageService from "../../app/service/localstorageService";
import LancamentoService from "../../app/service/lancamentoService";
import { useNavigate, useParams } from "react-router-dom";
import NavegacaoButton from "../../components/navegacaoButton";

class CadastroLancamentos extends Component {
  state = {
    id: null,
    descricao: "",
    valor: "",
    mes: "",
    ano: "",
    tipo: "",
    status: "",
    usuario: null,
    atualizando: false,
  };

  constructor() {
    super();
    this.service = new LancamentoService();
  }

  params = () => {
    useParams();
  }

  componentDidMount() {

    if (this.params.id) {
      this.service
        .obterPorId(this.params.id)
        .then((response) => {
          this.setState({ ...response.data, atualizando: true });
        })
        .catch((erros) => {
          messages.mensagemErro(erros.response.data);
        });
    }
  }

  atualizar = () => {
    const { descricao, valor, mes, ano, tipo, status, usuario, id } = this.state;
    const lancamento = { descricao, valor, mes, ano, tipo, usuario, status, id };

    console.log(lancamento);

    this.service
            .atualizar(lancamento)
            .then(response => {
                useNavigate('/consulta-lancamento/17')
                messages.mensagemSucesso('Lançamento atualizado com sucesso!')
            }).catch(error => {
                messages.mensagemErro(error.response.data)
            })
  }

  submit = () => {
    const usuarioLogado = LocalStorageService.obterItem("_usuario_logado");

    const { descricao, valor, mes, ano, tipo } = this.state;
    const lancamento = { descricao, valor, mes, ano, tipo, usuario: usuarioLogado.id };

    try {
      this.service.validar(lancamento);
    } catch (erro) {
      const mensagens = erro.mensagens;
      mensagens.forEach((msg) => messages.mensagemErro(msg));
      return false;
    }

    this.service
      .salvar(lancamento)
      .then((response) => {
        useNavigate("/consulta-lancamento");
        messages.mensagemSucesso("Lançamento cadastrado com sucesso!");
      })
      .catch((error) => {
        messages.mensagemErro(error.response.data);
      });
  }

  handleChange = (event) => {
    const value = event.target.value;
    const name = event.target.name;

    this.setState({ [name]: value });
  }

  render() {
    const tipos = this.service.obterListaTipos();
    const meses = this.service.obterListaMeses();

    return (
      <Card
        title={
          this.state.atualizando
            ? "Atualização de Lançamento"
            : "Cadastro de Lançamento"
        }
      >
        <div className="row">
          <div className="col-md-12">
            <FormGroup id="inputDescricao" label="Descrição: *">
              <input
                id="inputDescricao"
                type="text"
                className="form-control"
                name="descricao"
                value={this.state.descricao}
                onChange={this.handleChange}
              />
            </FormGroup>
          </div>
        </div>
        <div className="row">
          <div className="col-md-6">
            <FormGroup id="inputAno" label="Ano: *">
              <input
                id="inputAno"
                type="text"
                name="ano"
                value={this.state.ano}
                onChange={this.handleChange}
                className="form-control"
              />
            </FormGroup>
          </div>
          <div className="col-md-6">
            <FormGroup id="inputMes" label="Mês: *">
              <SelecMenu
                id="inputMes"
                value={this.state.mes}
                onChange={this.handleChange}
                lista={meses}
                name="mes"
                className="form-control"
              />
            </FormGroup>
          </div>
        </div>
        <div className="row">
          <div className="col-md-4">
            <FormGroup id="inputValor" label="Valor: *">
              <input
                id="inputValor"
                type="text"
                name="valor"
                value={this.state.valor}
                onChange={this.handleChange}
                className="form-control"
              />
            </FormGroup>
          </div>

          <div className="col-md-4">
            <FormGroup id="inputTipo" label="Tipo: *">
              <SelecMenu
                id="inputTipo"
                lista={tipos}
                name="tipo"
                value={this.state.tipo}
                onChange={this.handleChange}
                className="form-control"
              />
            </FormGroup>
          </div>

          <div className="col-md-4">
            <FormGroup id="inputStatus" label="Status: ">
              <input
                type="text"
                className="form-control"
                name="status"
                value={this.state.status}
                disabled
              />
            </FormGroup>
          </div>
        </div>
        <div className="row">
          <div className="col-md-6">
            {this.state.atualizando ? (
              <button onClick={this.atualizar} className="btn btn-success">
                <i className="pi pi-refresh"></i> Atualizar
              </button>
            ) : (
              <button onClick={this.submit} className="btn btn-success">
                <i className="pi pi-save"></i> Salvar
              </button>
            )}
            <NavegacaoButton rotaDestino="/consulta-lancamento" texto="Cancelar" classNameButton="btn btn-danger" classNameIcon="pi pi-times"/>
          </div>
        </div>
      </Card>
    );
  }
}

export default CadastroLancamentos;