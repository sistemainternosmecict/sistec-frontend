import PropTypes from 'prop-types';
import { useState, useContext, useEffect } from 'react';
import { HostContext } from '../../HostContext';
import { io } from "socket.io-client";
import './dash.scss';

const socket = io("http://localhost:8082")

async function obter_demanda(host, protocolo){
    const route = `/api/demandas/buscar/${protocolo}`
    const result = await fetch(host+route);
    const retorno = await result.json();
    return retorno
}

async function obter_notificacoes(host){
    const route = "/api/demandas/notificacoes/listar"
    const result = await fetch(host+route);
    const retorno = await result.json();
    return retorno
}

async function fetchData( setNotificacoes, hostUrl ) {
    const data_temp_notificacoes = await obter_notificacoes(hostUrl)
    setNotificacoes(data_temp_notificacoes.notificacoes || [])
}

function Dashboard({ setPage, setDashboardSelected, setPaginaAreaDemandas }){
    const { hostUrl } = useContext(HostContext)
    const [notificacoes, setNotificacoes] = useState([])
    const dataAtual = new Date();

    useEffect(()=> {
        socket.on("nova_demanda", (data) => {
            setNotificacoes((prev) => [...prev, {not_message: data.not_message, 
                not_data: dataAtual.toLocaleDateString(), 
                not_hora: `${dataAtual.getHours()}:${dataAtual.getMinutes()}`, 
                dados: data.inserted_data,
                protocolo: data.protocolo
            }])
        })

        return () => socket.off("nova_demanda")
    }, [])

    useEffect(() => {
        fetchData( setNotificacoes, hostUrl )
    }, [hostUrl])

    return (
        <div className='dashboard'>
            <div className='notificacoes'>
                <h2>Demandas</h2>
                <p>Notificações</p>
                <ul className='listagem'>
                    {(notificacoes.length > 0) ? (notificacoes.map((notif, idx) => {
                        return <li className='notificacao' key={idx} onClick={async () => {
                            const demanda = await obter_demanda(hostUrl, notif.not_protocolo)
                            setDashboardSelected(demanda)
                            setPage({pageN: 2, pageT: "Área de Demandas"})
                            }}>
                            <span>★</span> {notif.not_message} | {notif.not_data + " - " + notif.not_hora}
                            </li>
                    }).reverse()):""}
                </ul>
            </div>
        </div>
    )
}

Dashboard.propTypes = {
    setPage: PropTypes.func,
    setDashboardSelected: PropTypes.func,
    setPaginaAreaDemandas: PropTypes.func
}

export default Dashboard;