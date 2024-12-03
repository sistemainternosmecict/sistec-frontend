import { useState } from "react";
import PropTypes from 'prop-types';
import ContainerBaixo from "./containerBaixo";

function toggleContainer( e, pack, idControler ){
    e.preventDefault()
    const components = e.target.parentNode.parentNode
    const containers = components.querySelectorAll(".container")
    containers.forEach( (component, idx) => {
        pack.setAberto(false)

        if(component == e.target.parentNode){
            idControler.setIdAberto(idx)
            pack.setAberto(!pack.aberto)
        }
    })
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