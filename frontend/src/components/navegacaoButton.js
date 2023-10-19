import React from 'react';
import { useNavigate } from 'react-router-dom';

function NavegacaoButton(props) {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate(props.rotaDestino);
  }

  return (
    <button onClick={handleNavigate} className={props.classNameButton}>
      <i className={props.classNameIcon}></i>{props.texto}
    </button>
  );
}

export default NavegacaoButton;