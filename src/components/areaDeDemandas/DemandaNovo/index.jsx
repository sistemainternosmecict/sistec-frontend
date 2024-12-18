import PropTypes from 'prop-types'
import './style.scss'

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

function Demanda({ demanda, ticketControl }){
    return (
        <div className="demanda" onClick={() => {
            ticketControl.setSelectedTicket(demanda)
            ticketControl.setPagina(4)
            }}>
            <p><span>NP:</span> {demanda.nvl_prioridade}</p>
            <p><span>Protocolo:</span> {demanda.protocolo}</p>
            <p><span>Data:</span> {demanda.dt_entrada}</p>
            <p><span>Status:</span> {getStatus(demanda.status)}</p>
        </div>
    )
}

Demanda.propTypes = {
    demanda: PropTypes.object,
    ticketControl: PropTypes.object
}

export default Demanda;