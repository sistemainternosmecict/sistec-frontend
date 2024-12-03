import { useState } from "react";
import PropTypes from 'prop-types';
import Container from './container';

function Listagem({ servicos, setServicoSelecionado }) {
  const [idAberto, setIdAberto] = useState(undefined)

  return(
    servicos.map( (servico, idx) => <Container servico={servico} idx={idx} key={idx} setServicoSelecionado={setServicoSelecionado} idControler={{idAberto, setIdAberto}}/>)
  )
}

Listagem.propTypes = {
  servicos: PropTypes.array,
  setServicoSelecionado: PropTypes.func,

}

export default Listagem;