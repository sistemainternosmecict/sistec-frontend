import { useContext, useState, useEffect } from "react";
import { HostContext } from "../../HostContext";
import escolas_json from './escolas.json';
import servicos_json from './tipos_servicos.json';
import empresas_json from './empresas.json';
import './style.scss'

async function atualizar_status(protocolo, status_str, host, func, setDemandas, demanda) {
    const agora = new Date();
    const dia = padZero(agora.getDate());
    const mes = padZero(agora.getMonth() + 1);
    const ano = agora.getFullYear();
    const horas = padZero(agora.getHours());
    const minutos = padZero(agora.getMinutes());
    const dataFormatada = `${dia}/${mes}/${ano}|${horas}:${minutos}`;

    const dt_entrada = stringParaData(demanda.dt_entrada)
    const dt_final = stringParaData(dataFormatada)
    const diff = calcularDiferenca(dt_entrada, dt_final)

    const status = Number(status_str)
    
    const dados = {
        "protocolo": protocolo,
        "dem_status": status,
        "dem_dt_final": (status == 4 || status == 5 || status == 6) ? dataFormatada : null,
        "dem_tempo_finalizacao": (status == 4 || status == 5 || status == 6) ? diff.dias : null,
        "dem_atendido_por": (status == 4 || status == 5 || status == 6) ? await buscar_colaborador_por_id(demanda.direcionamento, host) : null
    }

    const route = "/api/demandas/atualizar"
    const options = {
        method: "POST",
        body: JSON.stringify(dados),
        headers: {"Content-Type":"application/json"}
      };
    const result = await fetch(host+route, options);
    const retorno = await result.json();
    // func(host, setDemandas)
}

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
    const descricao_escrita = (fields.descricao) ? fields.descricao.value : "S/D"
    const desc = fields.disp.value + fields.disp.options[fields.disp.selectedIndex].text + " -> " + fields.incidente.value + " (" + descricao_escrita + ")."
    const local = "SMECICT"
    const sala = fields.dem_sala.value
    const demanda = {
        solicitante: fields.solicitante.value,
        direcionamento: 0,
        descricao: desc,
        local: local,
        sala: sala,
        tipo: (local == 'SMECICT') ? 1 : 2,
        nvl_prioridade: 0,
        status: 1
    }

    if((!isNaN(demanda.solicitante)) && (demanda.local !== "-") && (demanda.descricao !== "Preset:-")){
        registrar_demanda(demanda, host, setMessage)
    }
}

function obter_local(e, setUnidadeSelecionada){
    e.preventDefault()
    setUnidadeSelecionada({selecionada:true, unidade:e.target.value})
}

function obter_sala(e, set){
    e.preventDefault()
    if(e.target.value !== "-"){
        set({selecionada:true, sala:e.target.value, default: '-'})
    }
}

function obter_servico(e, setServico, setIncidentes){
    e.preventDefault()
    if(e.target.value !== "-"){
        const inc_string = e.target.selectedOptions[0].dataset.inc
        const incidentes = inc_string.split(",")
        setServico({selecionado:true, servico:e.target.value, default: '-', tipo:e.target.selectedOptions[0].dataset.tipo}) 
        setIncidentes(incidentes)
    }
}

function obter_incidente(e, setIncidente){
    e.preventDefault()
    setIncidente({'incidente':e.target.value, 'selecionado':true, 'default':'-'})
}

function abrirChamadoExterno( empresa ){
    const { telefone } = empresa
    const url = `https://wa.me/55${telefone}`
    window.open(url, "_blank")
}

function adicionar_botoes(){
    return <input type="submit" value="Registrar" />
}

export default function CriarDemanda({ usuario }){
    const { hostUrl } = useContext(HostContext)
    const [salas, setSalas] = useState([])
    const [solicitantes, setSolicitantes] = useState([])
    const [msg, setMessage] = useState(undefined)
    const [escolas, setEscolas] = useState([])
    const [servicos, setServicos] = useState([])
    const [empresas, setEmpresas] = useState([])
    const [incidentes, setIncidentes] = useState(undefined)
    const [unidadeSelecionada, setUnidadeSelecionada] = useState({'selecionada':true, 'unidade':"SMECICT"})
    const [salaSelecionada, setSalaSelecionada] = useState({'selecionada':false, 'sala':undefined, 'default':usuario.sala})
    const [servicoSelecionado, setServicoSelecionado] = useState({'selecionado':false, 'servico':undefined, 'default':'-', 'tipo':undefined})
    const [incidenteSelecionado, setIncidenteSelecionado] = useState({'incidente':undefined, 'selecionado':false, 'default':'-'})
    const [descricao, setDescricao] = useState(false)

    useEffect(()=> {
        obter_solicitantes(hostUrl, setSolicitantes)
    }, [hostUrl])

    // useEffect(() => {
    //     let salas_temp = []
    //     solicitantes.forEach( solic => {
    //         if(!salas_temp.includes(solic.usuario_sala)){
    //             salas_temp.push(solic.usuario_sala)
    //         }
    //     })
    //     setSalas(salas_temp)
    // }, [solicitantes])

    useEffect(() => {
        setEscolas(escolas_json)
        setServicos(servicos_json)
        setEmpresas(empresas_json)
    }, [])

    // useEffect(() => {
    //     const inputSala = document.getElementsByName("dem_sala")[0]
    //     setSalaSelecionada({'selecionada':false, 'sala':undefined, 'default':usuario.solic_sala})
    //     if(inputSala){
    //         inputSala.value = "-"
    //     }
    //     setDescricao(false)
    // }, [unidadeSelecionada])

    useEffect(() => {
        const inputServico = document.getElementsByName("disp")[0]
        setServicoSelecionado({'selecionado':false, 'servico':undefined, 'default':'-'})
        if(inputServico){
            inputServico.value = "-"
        }
        setDescricao(false)
    }, [salaSelecionada])
    
    useEffect(()=> {
        const inputIncidente = document.getElementsByName("incidente")[0]
        setIncidenteSelecionado({'incidente':undefined, 'selecionado':false, 'default':'-'})
        if(inputIncidente){
            inputIncidente.value = "-"
        }
    }, [servicoSelecionado])

    useEffect(() => {
        setSalaSelecionada({'selecionada':true, 'sala':usuario.usuario_sala, 'default':usuario.usuario_sala})
    }, [usuario])

    return (
        <>
            {(msg === undefined) ?
            <form id="reg_demanda" onSubmit={(e) => criarDemanda(e, hostUrl, setMessage)}>
                <h2>Abrir nova</h2>
                <h2>Demanda</h2>

                <input type="text" name="dem_sala" hidden defaultValue={usuario.solic_sala}/>
                <input type="text" name="solicitante" hidden defaultValue={usuario.solic_id}/>
                
                <select name="disp" defaultValue={servicoSelecionado.default} onClick={(e) => obter_servico(e, setServicoSelecionado, setIncidentes)}>
                    <option value="-">Selecione o tipo de serviço</option>
                    {
                        servicos.map( (servico, idx_ser) => {
                            return <optgroup label={servico.etiqueta} key={idx_ser}>
                                {servico.servicos.map( (opc, idx) => <option value={opc.cod} key={idx} data-inc={opc.incidentes} data-tipo={opc.tipo}>{opc.opc}</option>)}
                            </optgroup>
                        })
                    }
                    {/* <option value="[OUT]">Outro</option> */}
                </select>

                {(servicoSelecionado.selecionado == true) ?
                    <select name="incidente" defaultValue={incidenteSelecionado.default} onChange={(e) => obter_incidente(e, setIncidenteSelecionado)}>
                        <option value="-">Selecione o tipo de incidente</option>
                        {incidentes.map( (inc, idx_inc) => {
                            return <option value={inc} key={idx_inc}>{inc}</option>
                        })}
                    </select> : <></>}

                
                {(incidenteSelecionado.incidente == "Outro") ? <textarea name="descricao" placeholder="Por favor, descreva brevemente o problema ocorrido com suas palavras."></textarea> : <></>}

                
                {(unidadeSelecionada.selecionada === true && servicoSelecionado.selecionado && incidenteSelecionado.selecionado)
                ? 
                <>
                {adicionar_botoes()}
                </>
                : <>
                    
                </>
                }

                

            </form> : <div id="protocolo">
                <p>
                Demanda inserida! Protocolo de demanda número <strong>{msg}</strong> gerado com sucesso!
                </p>
                <button onClick={() => {
                    setMessage(undefined)
                    }}>Criar outra demanda</button>
                </div>}

               
        </>
    )
}