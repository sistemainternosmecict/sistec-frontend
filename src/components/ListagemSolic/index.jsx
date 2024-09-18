import { useContext, useState, useEffect } from "react";
import { HostContext } from "../../HostContext";
import Solicitante from "../Solicitante";
import './style.scss'

async function obter_solicitantes(host){
    const route = "/api/usuarios/solicitantes/listar"
    const result = await fetch(host+route);
    const retorno = await result.json();
    return retorno
}

export default function ListagemSolic(){
    const [solicitantes, setSolicitantes] = useState([])
    const { hostUrl } = useContext(HostContext)

    useEffect(() => {
        async function fetchData() {
            const data = await obter_solicitantes(hostUrl)
            setSolicitantes(data)
        }
        fetchData()
        }, [hostUrl])

    return (
        <>
            <ul id="solics">
            {(solicitantes.solics) ? solicitantes.solics.map((solicitante, index) => (
                    <li key={index}>
                        <Solicitante solicitante={solicitante}/>
                    </li>
                )) : <>
                    <p>Não há solicitantes cadastrados!</p>
                </>}
            </ul>
        </>
    )
}