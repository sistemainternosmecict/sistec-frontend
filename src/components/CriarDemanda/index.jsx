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

function criarDemanda(e, host, setMessage, servicoSelecionado){
    e.preventDefault()
    const fields = e.target.elements
    const descricao_escrita = (fields.descricao) ? fields.descricao.value : "S/D"
    let desc = descricao_escrita
    if(servicoSelecionado.servico != "[OUT]"){
        desc = fields.disp.value + fields.disp.options[fields.disp.selectedIndex].text + " -> " + fields.incidente.value + " (" + descricao_escrita + ")."
    }

    const local = fields.dem_local.value
    const sala = fields.dem_sala.value
    const demanda = {
        solicitante: Number(fields.solicitante.value),
        direcionamento: 0,
        descricao: desc,
        local: local,
        sala: sala,
        tipo: (!isNaN(Number(fields[0].value))) ? Number(fields[0].value) : 0,
        nvl_prioridade: 0,
        status: (Number(servicoSelecionado.tipo) === 2) ? 4 : 1
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
        let incidentes = undefined
        const inc_string = e.target.selectedOptions[0].dataset.inc
        if(e.target.value !== "[OUT]"){
            incidentes = inc_string.split(",")
            setServico({selecionado:true, servico:e.target.value, default: '-', tipo:e.target.selectedOptions[0].dataset.tipo}) 
            setIncidentes(incidentes)
        } else { 
            setServico({selecionado:true, servico:e.target.value, default: '-', tipo:"1"})
            setIncidentes(["Outro"])
        }
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

function adicionar_botoes( empresas, servicoSelecionado){
    const tipo = Number(servicoSelecionado.tipo)
    if(tipo === 2){
        let empresa_temp = undefined
        empresas.forEach( empresa => {
            const cobertura = empresa.cobertura
            cobertura.forEach( servicoTemplate => {
                if(servicoTemplate === servicoSelecionado.servico){
                    empresa_temp = empresa
                }
            })
        })
        return <button id="btnTerceirizada" onClick={() => {
                    abrirChamadoExterno(empresa_temp)}}>
                    <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24">
                        <g fill="none" fillRule="evenodd">
                            <path d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z"></path>
                            <path fill="#008080  " d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2.546 20.2A1.01 1.01 0 0 0 3.8 21.454l3.032-.892A9.96 9.96 0 0 0 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2M9.738 14.263c2.023 2.022 3.954 2.289 4.636 2.314c1.037.038 2.047-.754 2.44-1.673a.7.7 0 0 0-.088-.703c-.548-.7-1.289-1.203-2.013-1.703a.71.71 0 0 0-.973.158l-.6.915a.23.23 0 0 1-.305.076c-.407-.233-1-.629-1.426-1.055s-.798-.992-1.007-1.373a.23.23 0 0 1 .067-.291l.924-.686a.71.71 0 0 0 .12-.94c-.448-.656-.97-1.49-1.727-2.043a.7.7 0 0 0-.684-.075c-.92.394-1.716 1.404-1.678 2.443c.025.682.292 2.613 2.314 4.636"></path>
                        </g>
                    </svg>
                Contato da {empresa_temp.empresa}
            </button>
    }
        // {empresas.map( empresa => {
        //     empresa.cobertura.forEach( (servicoCoberto, sIdx) => {
        //         console.log(servicoCoberto, servicoSelecionado.servico, servicoCoberto === servicoSelecionado.servico)
        //         if(servicoCoberto === servicoSelecionado.servico){
                //     return ()
        //     }
        // })
        
        // if(empresa.cobertura.includes(servicoSelecionado.servico)){
            // }
        // })}
        // return <p>test</p>
    // }
    if(tipo === 1){
        return <input type="submit" value="Registrar" />
    }
}

export default function CriarDemanda(){
    const { hostUrl } = useContext(HostContext)
    const [salas, setSalas] = useState([])
    const [solicitantes, setSolicitantes] = useState([])
    const [msg, setMessage] = useState(undefined)
    const [escolas, setEscolas] = useState([])
    const [servicos, setServicos] = useState([])
    const [empresas, setEmpresas] = useState([])
    const [incidentes, setIncidentes] = useState(undefined)
    const [unidadeSelecionada, setUnidadeSelecionada] = useState({'selecionada':false, 'unidade':undefined})
    const [salaSelecionada, setSalaSelecionada] = useState({'selecionada':false, 'sala':undefined, 'default':'-'})
    const [servicoSelecionado, setServicoSelecionado] = useState({'selecionado':false, 'servico':undefined, 'default':'-', 'tipo':undefined})
    const [incidenteSelecionado, setIncidenteSelecionado] = useState({'incidente':undefined, 'selecionado':false, 'default':'-'})
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
        setEmpresas(empresas_json)
    }, [])

    useEffect(() => {
        const inputSala = document.getElementsByName("dem_sala")[0]
        setSalaSelecionada({'selecionada':false, 'sala':undefined, 'default':'-'})
        if(inputSala){
            inputSala.value = "-"
        }
        setDescricao(false)
    }, [unidadeSelecionada])

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

    return (
        <>
            {(msg === undefined) ?
            <form id="reg_demanda" onSubmit={(e) => criarDemanda(e, hostUrl, setMessage, servicoSelecionado)}>
                <h2>Abrir nova</h2>
                <h2>Demanda</h2>

                <select name="dem_local" defaultValue="-" onChange={(e) => obter_local(e, setUnidadeSelecionada)}>
                    <option value="-" disabled>Selecione a unidade</option>
                    <option value="SMECICT">SMECICT</option>
                    {escolas.map( (escola, idx) => <option value={escola.dc + " " + escola.nome} key={idx}>{escola.dc + " " + escola.nome}</option>)}
                </select>

                {(unidadeSelecionada.selecionada == true) ?
                <select name="dem_sala" defaultValue={salaSelecionada.default} onClick={(e) => obter_sala(e, setSalaSelecionada)}>
                    <option value="-" disabled>Selecione a sala</option>
                    {(unidadeSelecionada.unidade == "SMECICT")
                        ? salas.map( sala => <option key={sala} value={sala}>Sala {sala}</option>)
                        : <>
                        <option value="Laboratório de informática">Laboratório de informática</option>
                        <option value="Secretaria da unidade">Secretaria da unidade</option>
                        <option value="Direção">Direção</option>
                        <option value="Sala de recursos">Sala de recursos</option>
                        <option value="Sala do PAE">Sala do PAE</option>
                        <option value="Sala dos professores">Sala dos professores</option>
                        <option value="Auditório">Auditório</option>
                        </>}
                </select>
                : <>
                </>}

                {(salaSelecionada.selecionada == true) 
                ? <select name="solicitante" defaultValue="-">
                    <option value="-" disabled>Quem está solicitando?</option>
                    {solicitantes.map( (solic, idx) => {
                        if(unidadeSelecionada.unidade == "SMECICT"){
                            if(solic.solic_sala == salaSelecionada.sala){
                                return <option key={idx} value={solic.solic_id}>{solic.solic_nome}</option>
                            }
                        } else {
                            if(solic.solic_sala == "24"){
                                return <option key={idx} value={solic.solic_id}>{solic.solic_nome}</option>
                            }
                        }
                        })}
                </select> 
                : <></>}

                {(salaSelecionada.selecionada == true)
                ? <select name="disp" defaultValue={servicoSelecionado.default} onClick={(e) => obter_servico(e, setServicoSelecionado, setIncidentes)}>
                    <option value="-">Selecione o tipo de serviço</option>
                    {
                        servicos.map( (servico, idx_ser) => {
                            return <optgroup label={servico.etiqueta} key={idx_ser}>
                                {servico.servicos.map( (opc, idx) => <option value={opc.cod} key={idx} data-inc={opc.incidentes} data-tipo={opc.tipo}>{opc.opc}</option>)}
                            </optgroup>
                        })
                    }
                    <option value="[OUT]">Outro</option>
                </select>
                : <></>}

                {(servicoSelecionado.selecionado == true && servicoSelecionado.servico != "[OUT]") ?
                    <select name="incidente" defaultValue={incidenteSelecionado.default} onChange={(e) => obter_incidente(e, setIncidenteSelecionado)}>
                        <option value="-">Selecione o tipo de incidente</option>
                        {incidentes.map( (inc, idx_inc) => {
                            return <option value={inc} key={idx_inc}>{inc}</option>
                        })}
                    </select> : <></>}

                {(incidenteSelecionado.incidente == "Outro" && servicoSelecionado.servico != "[OUT]") ? <textarea name="descricao" placeholder="Por favor, descreva brevemente o problema ocorrido com suas palavras."></textarea> : (servicoSelecionado.servico == "[OUT]") ? <textarea name="descricao" placeholder="Por favor, descreva brevemente o problema ocorrido com suas palavras."></textarea> : <></>}
                
                {(unidadeSelecionada.selecionada && servicoSelecionado.selecionado)
                ? 
                <>
                {(servicoSelecionado.servico != undefined) ? adicionar_botoes(empresas, servicoSelecionado) : <></>}
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