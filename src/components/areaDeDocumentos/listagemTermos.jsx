import { useContext, useEffect, useState } from "react";
import { HostContext } from "../../HostContext";

async function obterTermosDaAPI(host, setTermos) {
    const route = "/api/termos/dir";
    const result = await fetch(host + route);
    const retorno = await result.json();
    if(retorno){
        setTermos(retorno)
    }
    return retorno;
  }

function construct_elements( termos ){
    if(termos !== undefined){
        const list = termos.map((termo, idx) => {
            return <li key={idx} className="termoDownload">
                <a href={`http://localhost/export/${termo.name}`} target="_blank">{termo.name}</a>
            </li>
        })
    
        return list;
    }
}

function ListagemTermos(){
    const { hostUrl } = useContext(HostContext)
    const [termos, setTermos] = useState(undefined)

    useEffect(() => {
        if(termos === undefined){
            obterTermosDaAPI(hostUrl, setTermos)
        }
    }, [termos, hostUrl])

    return (
        <>
            <ul>
                {construct_elements(termos)}
            </ul>
        </>
    )
}

export default ListagemTermos;