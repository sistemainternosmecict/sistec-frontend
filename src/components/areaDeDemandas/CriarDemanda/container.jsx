import { useState } from "react";
import PropTypes from 'prop-types';
import ContainerBaixo from "./containerBaixo";

function reset_container( { setAberto }, {setIdAberto} ){
    setAberto(false)
    setIdAberto(null)
}

function toggleContainer(e, pack, idControler, idx) {
    e.preventDefault();

    if (idControler.idAberto === idx && pack.aberto) {
        // Fecha o componente se ele já estiver aberto
        reset_container(pack, idControler);
    } else {
        // Abre o componente e fecha outros
        pack.setAberto(true);
        idControler.setIdAberto(idx);
    }
}


function Container({ servico, idx, setServicoSelecionado, idControler }){
    const [aberto, setAberto] = useState(false)
    const [subIdAberto, setSubIdAberto] = useState(undefined)

    return (
        <div className="container" key={idx} data-id={idx}>
            <button className="btnToggle" onClick={(e) => toggleContainer(e, {aberto, setAberto}, idControler, idx)}>
                {servico.label} {(aberto) ? "▲" : "▼"}
            </button>

            <div className={`subContainer ${(idControler.idAberto == idx) ? "containerAberto" : ""}`}>
                {servico.options.map( (opcao, idx) => <ContainerBaixo dados={opcao} key={idx} idx={idx} setServicoSelecionado={setServicoSelecionado} abertoContainer={setAberto} subIdControler={{subIdAberto, setSubIdAberto, idControler}}/>)}
            </div>
        </div>
    )
}

Container.propTypes = {
    servico: PropTypes.object.isRequired,
    idx: PropTypes.number,
    setServicoSelecionado: PropTypes.func,
    idControler: PropTypes.object
}

export default Container;