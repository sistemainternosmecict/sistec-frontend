import { useState, useContext, useEffect } from 'react';
import { HostContext } from '../../HostContext';
import logoSub from '../../assets/preto_logoSub.png';

const dataStyle = {
    padding: "16px",
    border: "solid 1px #008080"
}

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
        <div className='dashboard' style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center"}}>
            <img src={logoSub} style={{ width: "264px", opacity: 0.4, userSelect: "none"}}/>
            <p style={{ margin: "16px", fontWeight: "bold"}}>Bem vindo ao sistec</p>

            <div style={{ display: "flex", justifyContent: "center"}}>
                <div className="novosUsuarios" style={{margin: "2px"}}>
                    <p style={dataStyle} >Usuarios: {usuarios.length}</p>
                </div>

                <div className="novasDemandas" style={{margin: "2px"}}>
                    <p style={dataStyle} >Demandas: {demandas.length}</p>
                </div>
            </div>
        </div>
    )
}

export default Dashboard;