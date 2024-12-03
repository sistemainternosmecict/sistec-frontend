import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

function setServico(e, dados, inc, setServicoSelecionado){
    e.preventDefault()
    const servico = {'selecionado':true, 'servico':dados.cod, 'default':'-', 'tipo':dados.tipo, 'incidente':inc}
    setServicoSelecionado(servico)
}

function toggleContainer( e, pack, subIdControler ){
    e.preventDefault()
    
    const components = e.target.parentNode.parentNode.parentNode
    const containers = components.querySelectorAll(".containerBaixo")
    containers.forEach( (component, idx) => {
        if(component == e.target.parentNode.parentNode){
            subIdControler.setSubIdAberto(idx)
            // pack.setAberto(true)
        }
        // console.log(subIdControler.subIdAberto, containers)
    })
}

function selecionar(e, dados){
    const allBtns = document.querySelectorAll(".btnSelect")
    setServico(e, dados.dados, dados.inc, dados.setServicoSelecionado)

    allBtns.forEach( btn => {
        btn.style.backgroundColor = "transparent"
        btn.style.color = "black"
    })
    
    e.target.style.backgroundColor = "#095b5b"
    e.target.style.color = "white"
}

function ContainerBaixo({ dados, idx, setServicoSelecionado, abertoContainer, subIdControler }){
    const [aberto, setAberto] = useState(false)

    useEffect(() => {
        if(subIdControler.subIdAberto !== undefined){
            if(subIdControler.subIdAberto === idx){
                setAberto(true)
            } else {
                setAberto(false)
            }
            console.log(subIdControler.subIdAberto)
        }

    }, [subIdControler, idx])

    return (
        <div className="containerBaixo" key={idx} data-id={idx}>
            <div className="subContainerOrg">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                    <path d="M5 20V8h11.175l-3.6-3.575L14 3l6 6l-6.025 6.025l-1.4-1.425l3.6-3.6H7v10z" />
                </svg>
                <button className="btnToggleBaixo" onClick={(e) => toggleContainer(e, {aberto, setAberto}, subIdControler)}>{dados.label} {(aberto) ? "▲" : "▼"}</button>
            </div>
            
            {<div className={`sublist ${(aberto) ? "containerAberto" : ""}`}>
                    {dados.incidentes.map((inc, idx_temp) => {
                        return <div key={idx_temp} className="sublist_inc">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                <path d="M5 20V8h11.175l-3.6-3.575L14 3l6 6l-6.025 6.025l-1.4-1.425l3.6-3.6H7v10z" />
                            </svg>
                            <button className='btnSelect' onClick={(e) => {
                                selecionar(e, {dados, inc, setServicoSelecionado})
                                abertoContainer(false)
                            }}>{inc}</button>
                        </div>
                    })}
            </div>}
        </div>
    )
}

ContainerBaixo.propTypes = {
    dados: PropTypes.object,
    idx: PropTypes.number,
    setServicoSelecionado: PropTypes.func,
    abertoContainer: PropTypes.func,
    subIdControler: PropTypes.object
}

export default ContainerBaixo;