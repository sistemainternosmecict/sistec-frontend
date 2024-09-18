import { useState, useContext, useEffect } from "react"
import { HostContext } from "../../HostContext";
import './style.scss'
import Colaborador from '../Colaborador'

async function obter_colaboradores(host){
    const route = "/api/usuarios/colaboradores/listar"
    const result = await fetch(host+route);
    const retorno = await result.json();
    return retorno
}

export default function ListagemColab(){
    const { hostUrl } = useContext(HostContext)
    const [colaboradores, setColaboradores] = useState([])

    useEffect(() => {
    async function fetchData() {
        const data = await obter_colaboradores(hostUrl)
        setColaboradores(data)
    }
    fetchData()
    }, [hostUrl])

    return (
        <>
            <ul id="colabs">
                {(colaboradores.colab) ? colaboradores.colab.map((colaborador, index) => (
                    <li key={index}>
                        <Colaborador colaborador={colaborador} />
                    </li>
                )) : <>
                    <p>Não há colaboradores cadastrados!</p>
                </>}
            </ul>
        </>
    )
}