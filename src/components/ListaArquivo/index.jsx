import { useState, useContext, useEffect } from "react"
import { HostContext } from "../../HostContext";
import Demanda from '../Demanda'

async function obter_demandas(host){
    const route = "/api/demandas/listar"
    const result = await fetch(host+route);
    const retorno = await result.json();
    return retorno
}

export default function ListagemArquivo(){
    const [demandas, setDemandas] = useState([])
    const { hostUrl } = useContext(HostContext)

    useEffect(() => {
    async function fetchData() {
        const data = await obter_demandas(hostUrl)
        setDemandas(data.demandas)
    }
    fetchData()
    }, [hostUrl])

    return (
        <>
            <ul id="demandas">
                {(demandas) ? demandas.map((demanda, index) => (
                    <li key={index}>
                        {((demanda.status === 5) || (demanda.status === 6)) 
                        ? <Demanda demanda={demanda} />
                        :<></>}
                    </li>
                )) : <p>Não há demandas cadastradas!</p>}
            </ul>
        </>
    )
}