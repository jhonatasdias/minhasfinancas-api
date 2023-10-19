import React, { useEffect, useState } from "react";

import UsuarioService from "../app/service/usuarioService";
import LocalStorageService from "../app/service/localstorageService";
// import { AuthContext } from "../main/provedorAutenticacao";

function Home() {

    const [saldo, setSaldo] = useState(0);

    /* useEffect replaces componentDidMount */
    // executes after the page redenring

    //Aula 165
    // const authContext = useContext(AuthContext);

    useEffect(() => {  
        const usuarioLogado = LocalStorageService.obterItem('_usuario_logado')
        // const usuarioLogado = authContext.usuarioAutenticado


        const service = new UsuarioService();

        service
            .obterSladoPorUsuario(usuarioLogado.id)
            .then(response => {
                const valorFormatado = (parseFloat(response.data)).toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                });

                setSaldo(valorFormatado);
            })
            .catch(error => {
                console.log(error.response);
            });
    }, []);

    return (
        <div className="jumbotron">
            <h1 className="display-3">Bem vindo!</h1>
            <p className="lead">Esse é seu sistema de finanças.</p>
            <p className="lead">Seu saldo para o mês atual é de R$ { saldo }</p>
            <hr className="my-4"/>
            <p>E essa é sua área administrativa, utilize um dos menus ou botões abaixo para navegar pelo sistema.</p>
            <p className="lead">
                <a className="btn btn-primary btn-lg" href="/cadastro-usuario" role="button">
                    <i className="pi pi-users"></i>  Cadastrar Usuário 
                </a>
                <a className="btn btn-danger btn-lg" href="/cadastro-lancamento" role="button">
                    <i className="pi pi-money-bill"></i>  Cadastrar Lançamento 
                </a>
            </p>
        </div>
    )
}


export default Home