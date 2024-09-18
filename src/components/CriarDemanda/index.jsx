import { useContext, useState, useEffect } from "react";
import { HostContext } from "../../HostContext";
import escolas_json from './escolas.json';
import servicos_json from './tipos_servicos.json';
import './style.scss'

async function obter_solicitantes(host, set){
    const route = "/api/usuarios/solicitantes/listar"
    const result = await fetch(host+route);
    const retorno = await result.json();
    set(retorno.solics);
}

async function registrar_demanda( demanda, host, setMessage ){
    const route = "/api/demandas/registrar"
    const options = {
        method: "POST",
        body: JSON.stringify(demanda),
        headers: {"Content-Type":"application/json"}
      };
    const result = await fetch(host+route, options);
    const retorno = await result.json();
    if(retorno.inserido){
        const message = retorno.protocolo
        setMessage(message)
    }
}

function criarDemanda(e, host, setMessage){
    e.preventDefault()
    const fields = e.target.elements
    const descricao_escrita = (fields[4].value) ? fields[4].value : "S/D"
    const desc = fields[2].value + fields[2].options[fields[2].selectedIndex].text + " -> " + fields[3].value + " (" + descricao_escrita + ")."
    const local = fields[0].value
    const demanda = {
        solicitante: Number(fields[1].value),
        direcionamento: 0,
        descricao: desc,
        local: local,
        tipo: (!isNaN(Number(fields[0].value))) ? Number(fields[0].value) : 0,
        nvl_prioridade: 0
    }

    if((!isNaN(demanda.solicitante)) && (demanda.local !== "-") && (demanda.descricao !== "Preset:-")){
        registrar_demanda(demanda, host, setMessage)
    }
}

function obter_sala(e, set){
    e.preventDefault()
    if(e.target.value !== "-"){
        set(e.target.value)
    }
}

function obter_servico(e, setServico, setIncidentes){
    e.preventDefault()
    if(e.target.value !== "-"){
        const inc_string = e.target.selectedOptions[0].dataset.inc
        const incidentes = inc_string.split(",")
        setServico(e.target.value) 
        setIncidentes(incidentes)
    }
}

function abrir_campo_texto( e, setDescricao ){
    if(e.target.value === "Outro"){
        setDescricao(true)
    } else {
        setDescricao(false)
    }
}

export default function CriarDemanda(){
    const [salas, setSalas] = useState([])
    const [solicitantes, setSolicitantes] = useState([])
    const { hostUrl } = useContext(HostContext)
    const [salaSelecionada, setSalaSelecionada] = useState(0)
    const [msg, setMessage] = useState(undefined)
    const [escolas, setEscolas] = useState([]);
    const [servicos, setServicos] = useState([])
    const [servicoSelecionado, setServicoSelecionado] = useState(undefined)
    const [incidentes, setIncidentes] = useState(undefined)
    const [descricao, setDescricao] = useState(false)

    useEffect(()=> {
        obter_solicitantes(hostUrl, setSolicitantes)
    }, [hostUrl])

    useEffect(() => {
        let salas_temp = []
        solicitantes.forEach( solic => {
            if(!salas_temp.includes(solic.solic_sala)){
                salas_temp.push(solic.solic_sala)
            }
        })
        setSalas(salas_temp)
    }, [solicitantes])

    useEffect(() => {
        setEscolas(escolas_json)
        setServicos(servicos_json)
    }, [])

    return (
        <>
            {(msg === undefined) ?
            <form onSubmit={(e) => criarDemanda(e, hostUrl, setMessage)}>
                <h2>Abrir nova</h2>
                <h2>Demanda</h2>
                <select name="sala" defaultValue="-" onClick={(e) => obter_sala(e, setSalaSelecionada)}>
                    <option value="-" disabled>Selecione a sala</option>
                    {salas.map( sala => <option key={sala} value={sala}>Sala {sala}</option>)}
                    <option value="unidade">Unidade Escolar</option>
                </select>

                {(salaSelecionada === "unidade") ? <select name="unidade">
                    <option value="-">Selecione a unidade</option>
                    {escolas.map( (escola, idx) => <option value={escola.solic_id} key={idx}>{escola.dc + " " + escola.nome}</option>)}
                </select> : ""}

                {(salaSelecionada !== "unidade") ?
                    <select name="solic" defaultValue="-">
                    <option value="-" disabled>Selecione o seu nome</option>
                    {solicitantes.map( solic => {
                        if(solic.solic_sala === salaSelecionada){
                            return <option key={solic.solic_id} value={solic.solic_id}>{solic.solic_nome}</option>
                        }
                    })}
                </select> : <></>}

                <select name="disp" defaultValue="-" onClick={(e) => obter_servico(e, setServicoSelecionado, setIncidentes)}>
                    <option value="-">Selecione o tipo de serviço</option>
                    {
                        servicos.map( (servico, idx_ser) => {
                            return <optgroup label={servico.etiqueta} key={idx_ser}>
                                {servico.servicos.map( (opc, idx) => <option value={opc.cod} key={idx} data-inc={opc.incidentes}>{opc.opc}</option>)}
                            </optgroup>
                        })
                    }
                    <option value="[OUT]">Outro</option>
                </select>
                {(servicoSelecionado !== undefined && incidentes !== undefined) ?
                    <select name="incidente" onChange={(e) => abrir_campo_texto(e, setDescricao)}>
                        {incidentes.map( (inc, idx_inc) => {
                            return <option value={inc} key={idx_inc}>{inc}</option>
                        })}
                    </select> : <></>}
                {(descricao) ? <textarea name="descricao" placeholder="Por favor, descreva brevemente o problema ocorrido com suas palavras."></textarea> : <></>}
                <input type="submit" />
            </form> : <div id="protocolo">
                <p>
                Demanda inserida! Protocolo de demanda número <strong>{msg}</strong> gerado com sucesso!
                </p>
                <button onClick={() => {
                    setServicoSelecionado(undefined)
                    setIncidentes(undefined)
                    setMessage(undefined)
                    }}>Criar outra demanda</button>
                </div>}
        </>
    )
}