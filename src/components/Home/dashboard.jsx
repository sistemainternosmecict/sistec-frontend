import { useState, useContext, useEffect } from 'react';
import { HostContext } from '../../HostContext';

async function obter_usuarios(host){
    const route = "/api/usuarios/listar"
    const result = await fetch(host+route);
    const retorno = await result.json();
    return retorno
}

async function obter_demandas(host){
    const route = "/api/demandas/listar"
    const result = await fetch(host+route);
    const retorno = await result.json();
    return retorno
}

async function fetchData( setDemandas, setUsuarios, hostUrl ) {
    const data_temp_demandas = await obter_demandas(hostUrl)
    const data_temp_usuarios = await obter_usuarios(hostUrl)
    setDemandas(data_temp_demandas.demandas || [])
    setUsuarios(data_temp_usuarios.usuarios || [])
}

function Dashboard(){
    const { hostUrl } = useContext(HostContext)
    const [demandas, setDemandas] = useState([])
    const [usuarios, setUsuarios] = useState([])

    useEffect(() => {
        fetchData( setDemandas, setUsuarios, hostUrl )
    }, [hostUrl])

    return (
        <div className='dashboard'>
            <h1>Página inicial</h1>
            <p>Bem vindo ao sistec</p>

            <div className="novosUsuarios">
                <p>Usuarios: {usuarios.length}</p>
            </div>

            <div className="novasDemandas">
                <p>Demandas: {demandas.length}</p>
            </div>
        </div>
    )
}

export default Dashboard;