import { useEffect, useRef, useState } from 'react'
import Demanda from '../DemandaNovo'
import PropTypes from 'prop-types'
import "./style.scss"

function retornarLista( demandas, ticketControl ){
    return demandas.map((demanda, index) => (
        <li key={index}>
            <Demanda demanda={demanda} ticketControl={ticketControl} />
        </li>
    ))
}

function getStatus( status ){
    switch(status){
        case 1:
            return "Nova demanda"
        case 2:
            return "Em andamento"
        case 3:
            return "Aguardando"
        case 4:
            return "Encaminhado"
        case 5:
            return "Finalizado"
        case 6:
            return "Encerrado"
        default:
            return "Status inválido"
    }
}

function setarListagem( lista, setListaOrdenada){
    setListaOrdenada(lista)
}

function ListagemEntrada({ demandas, ticketControl }){
    const [listaOrdenada, setListaOrdenada] = useState([])
    const [filtro, setFiltro] = useState(undefined) //String
    const [termo, setTermo] = useState(undefined) //String ou Number
    const [ordem, setOrdem] = useState("prioridade")
    
    useEffect(() => {
        let listaTemp = demandas
        if(filtro !== undefined && termo !== undefined && termo !== ""){
            if(filtro == "prioridade"){
                listaTemp = demandas.filter( demanda => demanda.nvl_prioridade == termo )
            }
    
            if(filtro == "status"){
                listaTemp = demandas.filter( demanda => getStatus(demanda.status).toLowerCase().includes(termo.toLowerCase()) )
            }

            if(filtro == "protocolo"){
                listaTemp = demandas.filter( demanda => demanda.protocolo.toString().includes(termo.toString()) )
            }
        }
        setarListagem(listaTemp, setListaOrdenada)
    }, [demandas, filtro, termo])

    useEffect(() => {
        let listaTemp = demandas
        if(ordem !== undefined){
            if( ordem == "prioridade"){
                listaTemp.sort((demTemp1,demTemp2) => demTemp1.nvl_prioridade - demTemp2.nvl_prioridade).reverse()
            }
            if( ordem == "status"){
                listaTemp.sort((demTemp1,demTemp2) => demTemp1.status - demTemp2.status)
            }
            if( ordem == "data"){
                listaTemp.sort((demTemp1,demTemp2) => demTemp1.dt_entrada.localeCompare(demTemp2.dt_entrada))
            }
        }
        setarListagem(listaTemp, setListaOrdenada)

    }, [ordem, demandas])

    return (
        <>
            <div className='topBar'>
                <div className='ordem'>
                    <input type="text" name="busca" placeholder='Digite para buscar...' onInput={(e) => setTermo(e.target.value)}/>
                    
                    <select name="filtro" defaultValue="-" onChange={(e) => setFiltro(e.target.value)}>
                        <option value="-">Filtro de busca</option>
                        <option value="prioridade">Prioridade</option>
                        <option value="status">Status</option>
                        <option value="protocolo">Protocolo</option>
                    </select>
                    {/* <select name="ordem" defaultValue="-" onChange={(e) => setOrdem(e.target.value)}>
                        <option value="-">Ordem</option>
                        <option value="prioridade">Prioridade</option>
                        <option value="status">Status</option>
                        <option value="data">Data</option>
                    </select> */}
                </div>
            </div>
            <ul id="demandas">
                {(demandas.length > 0) 
                ? retornarLista( listaOrdenada, ticketControl )
                : <p>Buscando demandas...</p>}
            </ul>
        </>
    )
}

ListagemEntrada.propTypes = {
    demandas: PropTypes.arrayOf(PropTypes.object),
    ticketControl: PropTypes.object
}

export default ListagemEntrada