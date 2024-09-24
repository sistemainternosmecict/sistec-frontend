import { useState, useContext, useEffect } from "react";
import { HostContext } from "../../HostContext";
import Demanda from '../Demanda';

async function obter_demandas(host){
    const route = "/api/demandas/listar";
    const result = await fetch(host+route);
    const retorno = await result.json();
    return retorno;
}

async function fetchData(hostUrl, setDemandas) {
    const data = await obter_demandas(hostUrl);
    setDemandas(data.demandas);
}

export default function ListagemAtendimento(){
    const [demandas, setDemandas] = useState([]);
    const { hostUrl } = useContext(HostContext);

    useEffect(() => {
        fetchData(hostUrl, setDemandas);
    }, [hostUrl])

    return (
        <>
            <ul id="demandas">
                {(demandas) ? demandas.map((demanda, index) => (
                    <li key={index}>
                        {((demanda.status === 2) || (demanda.status === 3)) ? 
                        <Demanda demanda={demanda} func={fetchData} setDemandas={setDemandas}/>
                        :<></>}
                    </li>
                )) : <p>Não há demandas cadastradas!</p>}
            </ul>
        </>
    )
}