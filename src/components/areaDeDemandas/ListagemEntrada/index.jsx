import { useState } from 'react'
import Demanda from '../DemandaNovo'
import PropTypes from 'prop-types'
import "./style.scss"

function ListagemEntrada({ demandas }){
    const [ordenacao, setOrdenacao] = useState("protocolo")
    
    return (
        <>
            <ul id="demandas">
                {(demandas.length > 0) ? demandas.map((demanda, index) => (
                    <li key={index}>
                        <Demanda demanda={demanda} />
                    </li>
                )) : <p>Buscando demandas...</p>}
            </ul>
        </>
    )
}

ListagemEntrada.propTypes = {
    demandas: PropTypes.arrayOf(PropTypes.object)
}

export default ListagemEntrada