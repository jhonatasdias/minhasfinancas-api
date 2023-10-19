import React from 'react';
import { useNavigate } from 'react-router-dom';

function NavegacaoDinamica({ id }) {
    const navigate = useNavigate();
  
    const handleEdit = () => {
      navigate(`/cadastro-lancamento/${id}`);
    }
  
    return (
      <button onClick={handleEdit} className="btn btn-primary">Editar</button>
    );
  }
  
export default NavegacaoDinamica;