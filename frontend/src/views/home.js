import React, { useEffect, useState } from "react";

import axios from "axios";

function Home() {

    const [saldo, setSaldo] = useState(0);

    useEffect(() => {
        const usuarioLogado = localStorage.getItem('_usuario_logado')
        const idUsuario = JSON.parse(usuarioLogado).id;
        
        console.log(idUsuario);

        axios.get(`http://localhost:8080/api/usuarios/${idUsuario}/saldo`)
            .then(response => {
                setSaldo(response.data);
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
                <a className="btn btn-primary btn-lg" href="/cadastro-usuario" role="button"><i className="fa fa-users"></i>  Cadastrar Usuário </a>
                <a className="btn btn-danger btn-lg" href="/lancamento" role="button"><i className="fa fa-users"></i>  Cadastrar Lançamento </a>
            </p>
        </div>
    )
}


export default Home