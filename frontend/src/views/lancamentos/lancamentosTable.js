import React from "react"; 

export default props => {

    const rows = props.lancamentos.map( lancamento => {

        const valorFormatado = (parseFloat(lancamento.valor)).toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        });

        return (
            <tr key={lancamento.id}>
                <td>{lancamento.descricao}</td>
                <td>{valorFormatado}</td>
                <td>{lancamento.tipo}</td>
                <td>{lancamento.mes}</td>
                <td>{lancamento.status}</td>
                <td>
                    <button onClick={e => props.alterarStatus(lancamento, 'EFETIVADO')} 
                            type="button"
                            className="btn btn-success"
                            title="Efetivar"
                            disabled={lancamento.status !== 'PENDENTE'} >
                                <i className="pi pi-check"></i>
                    </button>
                            
                    <button onClick={e => props.alterarStatus(lancamento, 'CANCELADO')} 
                            type="button"
                            className="btn btn-warning"
                            title="Cancelar"
                            disabled={lancamento.status !== 'PENDENTE'} >
                                <i className="pi pi-times"></i>
                    </button>
                    
                    <button type="button" 
                            className="btn btn-primary"
                            onClick={e => props.editAction(lancamento.id)}
                            title="Editar" >
                                <i className="pi pi-pencil"></i>
                    </button>
                    
                    <button type="button" 
                            className="btn btn-danger" 
                            onClick={e => props.deleteAction(lancamento)}
                            title="Deletar" >
                                <i className="pi pi-trash"></i>
                    </button>
                </td>
            </tr>
        )
    })

    return (
        <table className="table table-hover">
            <thead>
                <tr>
                    <th scope="col">Descrição</th>
                    <th scope="col">Valor</th>
                    <th scope="col">Tipo</th>
                    <th scope="col">Mês</th>
                    <th scope="col">Situação</th>
                    <th scope="col">Ações</th>
                </tr>
            </thead>
            <tbody>
                {rows}
            </tbody>
        </table>
    )
}