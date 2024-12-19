import { useState, useContext, useEffect } from 'react';
import { HostContext } from '../../HostContext';
import ListagemEntrada from './ListagemEntrada';
import CriarDemanda from './CriarDemanda';
import ModalDemanda from './ModalDemanda';
import PropTypes from 'prop-types'
import './style.scss'

async function obter_demandas(host){
    const route = "/api/demandas/listar"
    const result = await fetch(host+route);
    const retorno = await result.json();
    return retorno
}

async function fetchData( setDemandas, hostUrl ) {
    const data_temp = await obter_demandas(hostUrl)
    setDemandas(data_temp.demandas || [])
}

function carregarSecao( pg, demandas, data, tipoDeArea, ticketControl, setPagina ) {
    data.tipoDeArea = tipoDeArea
    switch(pg){
        case 3:
            return <CriarDemanda usuario={data.usuario} setLoggedIn={data.setLoggedIn} setUsuario={data.setUsuario} tipoDeArea={data.tipoDeArea}/>
        case 4:
            return <ModalDemanda demanda={ticketControl.selectedTicket} fetchData={ticketControl.fetchData} setDemandas={ticketControl.setDemandas} setPagina={setPagina} />
        default:
            return <ListagemEntrada demandas={demandas} ticketControl={ticketControl}/>
    }
}

function AreaDeDemandas({ data }) {
    const tipoDeArea = "interna"
    const [pagina, setPagina] = useState(0)
    const { hostUrl } = useContext(HostContext)
    const [demandas, setDemandas] = useState([])
    const [selectedTicket, setSelectedTicket] = useState({ticket: undefined})

    const ticketControl = {selectedTicket, setSelectedTicket, setPagina, fetchData, setDemandas}

    useEffect(() => {
        fetchData( setDemandas, hostUrl )
    }, [hostUrl])
    
    return (
        <section>
            <aside className='menuAreaDemandas'>
                <div className="btnGroup">
                    <button onClick={() => setPagina(0)}>Listagem</button>
                    {/* <button onClick={() => setPagina(2)}>Arquivo</button> */}
                    <button onClick={() => setPagina(3)}>Criar demanda</button>
                </div>
            </aside>
            <main>
                {carregarSecao(pagina, demandas, data, tipoDeArea, ticketControl, setPagina)}
            </main>
        </section>
    )
}

AreaDeDemandas.propTypes = {
    data: PropTypes.object
}

export default AreaDeDemandas;