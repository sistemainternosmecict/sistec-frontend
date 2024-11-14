import { useState, useContext, useEffect } from "react"
import { HostContext } from "../../HostContext";
import Colaborador from '../Colaborador'
import './style.scss'

async function obter_colaboradores(host){
    const route = "/api/usuarios/colaboradores/listar"
    const result = await fetch(host+route);
    const retorno = await result.json();
    return retorno
}

function definirFiltro(e, setFiltro){
    e.preventDefault()
    const filtro= e.target.dataset.filtro
    setFiltro(filtro)
}

export default function ListagemColab(){
    const { hostUrl } = useContext(HostContext)
    const [colaboradores, setColaboradores] = useState([])
    const [termoBusca, setTermoBusca] = useState(undefined)
    const [torender, setTorender] = useState([])
    const [filtro, setFiltro] = useState("matricula")

    useEffect(() => {
    async function fetchData() {
        const data = await obter_colaboradores(hostUrl)
        setColaboradores(data)
    }
    fetchData()
    }, [hostUrl])

    useEffect(() => {
        if(termoBusca != undefined){
            if(termoBusca != ""){
                setTorender([])
                let lista_temp = []
                colaboradores.forEach( colaborador => {
                    switch(filtro){
                        case "nome":
                            if(colaborador.usuario_nome.toLowerCase().includes(termoBusca.toLowerCase())){
                                lista_temp.push(colaborador) 
                        } break;
                        case "cpf":
                            if(colaborador.usuario_cpf.toString().includes(termoBusca)){
                                lista_temp.push(colaborador) 
                        } break;
                        case "matricula":
                            if(colaborador.usuario_matricula.toString().includes(termoBusca)){
                                lista_temp.push(colaborador) 
                        } break;
                    }
                })
                setTorender(lista_temp)
            }
        }
    }, [termoBusca])

    return (
        <>  
            <form id="busca_usuarios">
                <input type="text" name="busca_termo" id="busca_termo" onInput={(e) => setTermoBusca(e.target.value)} placeholder={`Buscar por ${filtro}`}/>
                <button data-filtro="matricula" onClick={(e)=> definirFiltro(e, setFiltro)}>Matricula</button>
                <button data-filtro="nome" onClick={(e)=> definirFiltro(e, setFiltro)}>Nome</button>
                <button data-filtro="cpf" onClick={(e)=> definirFiltro(e, setFiltro)}>CPF</button>
            </form>

            {(termoBusca != [] && termoBusca != undefined)
            ? <ul id="colabs">
                {torender.map((colaborador, index) => (
                    <li key={index}>
                        <Colaborador colaborador={colaborador} />
                    </li>
                ))}
            </ul>
            : <></>
            }
        </>
    )
}