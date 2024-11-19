import { useContext, useState, useEffect, useRef } from "react";
import { HostContext } from "../../../HostContext";
import Usuario from "../Usuario";
import icone from '../../../assets/icone_processamento.png';
import './style.scss'

async function obter_usuarios(host){
    const route = "/api/usuarios/listar"
    const result = await fetch(host+route);
    const retorno = await result.json();
    return retorno
}

function buscar( valor, lista, setParaRenderizar ){
    const termoNormalizado = valor.trim()
    const tipo = /^\d+$/.test(termoNormalizado) ?
        termoNormalizado.length === 11 ? "cpf" : "matricula" : "nome";

    // console.log(tipo)

    const itensEncontrados = lista.filter(item => {
        if( termoNormalizado !== ""){
            if(tipo == 'cpf'){
                const cpf_inserido = termoNormalizado.toString()
                const cpf_comparado = item.usuario_cpf.toString()
                return cpf_comparado == cpf_inserido
            }
    
            if(tipo == 'matricula'){
                return item.usuario_matricula == Number(termoNormalizado)
            }
    
            if(tipo == 'nome'){
                if(item.usuario_nome.toLowerCase().includes(termoNormalizado.toLowerCase())){
                    return item
                }
                // return item.usuario_nome.toLowerCase().includes(termoNormalizado.toLowerCase())
            }
        }

        return false;
    })

    console.log(itensEncontrados)

    setParaRenderizar(itensEncontrados)
}

export default function ListagemUsuarios(){
    const [usuarios, setUsuarios] = useState([])
    const { hostUrl } = useContext(HostContext)
    const [paraRenderizar, setParaRenderizar] = useState([])
    const blocs = useRef(paraRenderizar)

    useEffect(() => {
        async function fetchData() {
            const data = await obter_usuarios(hostUrl)
            setUsuarios(data.usuarios || [])
            setParaRenderizar(data.usuarios)
        }
        fetchData()
        }, [hostUrl])

    useEffect(() => {
        const lista = paraRenderizar.map((usuario, index) => (
            <li key={index}>
                <Usuario usuario={usuario}/>
            </li>
        ))

        const listao = <ul id="usuarios">
            {lista}
        </ul>

        blocs.current = listao

    }, [paraRenderizar])

    return (
        <>  
            <>
                {/* <div className="busca">
                    <input onInput={(e) => buscar(e.target.value, usuarios, setParaRenderizar)} type="text" placeholder="Pesquisar por nome, matrícula ou cpf"/>
                </div> */}

                {blocs.current}

                {(usuarios.length == 0) 
                ? <div className="aviso">Aguarde! Carregando usuários... <img className="iconeCarregamento" src={icone} alt="icone de carregamento" /> </div>
                : <></>}
            </>
        </>
    )
}