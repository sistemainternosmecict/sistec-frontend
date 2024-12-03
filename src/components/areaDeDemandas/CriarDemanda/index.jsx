import PropTypes from 'prop-types';
import { useContext, useState, useEffect, useRef } from "react";
import { HostContext } from "../../../HostContext";
import escolas_json from './escolas.json';
import servicos_json from './tipos_servicos.json';
import empresas_json from './empresas.json';
import logoSistec from '../../../assets/logo_sistec.png'
import Listagem from './listagem.jsx'
import './style.scss'

async function logout(e, host, setLoggedIn, setUsuario){
    e.preventDefault()
    const route = "/api/usuarios/auth/logout"
    await fetch(host+route);
    setUsuario({})
    setLoggedIn(false)
}

async function obter_usuarios(host, set){
    const route = "/api/usuarios/listar"
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

function criarDemanda(e, host, setMessage, servicoSelecionado, incidenteSelecionado){
    e.preventDefault()
    const fields = e.target.elements
    const descricao_escrita = (fields.descricao) ? fields.descricao.value : "S/D"
    let desc = descricao_escrita
    if(servicoSelecionado.servico != "[OUT]"){
        desc = servicoSelecionado.servico + " -> " + servicoSelecionado.incidente + " (" + descricao_escrita + ")."
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
        // console.log(demanda)
    }
}

function obter_sala(e, set){
    e.preventDefault()
    if(e.target.value !== "-"){
        set({selecionada:true, sala:e.target.value, default: '-'})
    }
}

function CriarDemanda({ usuario, setLoggedIn, setUsuario }){
    const { hostUrl } = useContext(HostContext)
    const [salas, setSalas] = useState([])
    const [solicitantes, setSolicitantes] = useState([])
    const [msg, setMessage] = useState(undefined)
    const [escolas, setEscolas] = useState([])
    const [servicos, setServicos] = useState([])
    const [empresas, setEmpresas] = useState([])
    const [incidentes, setIncidentes] = useState(undefined)
    const [unidadeSelecionada] = useState({'selecionada':true, 'unidade':usuario.usuario_setor})
    const [salaSelecionada, setSalaSelecionada] = useState({'selecionada':false, 'sala':undefined, 'default':'-'})
    const [servicoSelecionado, setServicoSelecionado] = useState({'selecionado':false, 'servico':undefined, 'default':'-', 'tipo':undefined, 'incidente':undefined})
    // const [incidenteSelecionado, setIncidenteSelecionado] = useState({'incidente':undefined, 'selecionado':false, 'default':'-'})
    const [descricao, setDescricao] = useState(false)
    const localInputRef = useRef(null)

    useEffect(()=> {
        obter_usuarios(hostUrl, setSolicitantes)
    }, [hostUrl])

    // useEffect(() => {
    //     let salas_temp = []
    //     solicitantes.forEach( solic => {
    //         if(!salas_temp.includes(solic.solic_sala)){
    //             salas_temp.push(solic.solic_sala)
    //         }
    //     })
    //     setSalas(salas_temp)
    // }, [solicitantes])

    useEffect(() => {
        setEscolas(escolas_json)
        setServicos(servicos_json)
        setEmpresas(empresas_json)
    }, [])

    useEffect(() => {
        // const inputSala = document.getElementsByName("dem_sala")[0]
        // setSalaSelecionada({'selecionada':false, 'sala':undefined, 'default':'-'})
        // if(inputSala){
        //     inputSala.value = "-"
        // }

        if(localInputRef.current){
            // console.log(localInputRef)
            // setUnidadeSelecionada({'selecionada':true, 'unidade':localInputRef.current.defaultValue})
            setSalaSelecionada({'selecionada':true, 'sala':usuario.usuario_sala, 'default':'-'})
        }

        // if(unidadeSelecionada.unidade == "SMECICT"){
        // }
        setDescricao(false)
    }, [localInputRef.current, usuario])

    useEffect(() => {
        const inputServico = document.getElementsByName("disp")[0]
        setServicoSelecionado({'selecionado':false, 'servico':undefined, 'default':'-'})
        if(inputServico){
            inputServico.value = "-"
        }
        setDescricao(false)
    }, [salaSelecionada])

    return (
        <>
            {(msg === undefined) ?
            <form id="reg_demanda" onSubmit={(e) => criarDemanda(e, hostUrl, setMessage, servicoSelecionado)}>
                <img className='logo' src={logoSistec} alt="Logo do sistec" />
                <h2 className='titulo'>Novo chamado</h2>
                <input name='dem_local' ref={localInputRef} type="hidden" defaultValue={unidadeSelecionada.unidade}/>

                <Listagem servicos={servicos} setServicoSelecionado={setServicoSelecionado} />

                {(unidadeSelecionada.selecionada == true && !unidadeSelecionada.unidade.includes("SMECICT")) ?
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
                    <input type="hidden" name='dem_sala' defaultValue={usuario.usuario_sala} />
                </>}
                
                <input type="hidden" name='solicitante' defaultValue={usuario.usuario_id} />

                {/* {(incidenteSelecionado.incidente == "Outro" && servicoSelecionado.servico != "[OUT]") ? <textarea name="descricao" placeholder="Por favor, descreva brevemente o problema ocorrido com suas palavras."></textarea> : (servicoSelecionado.servico == "[OUT]") ? <textarea name="descricao" placeholder="Por favor, descreva brevemente o problema ocorrido com suas palavras."></textarea> : <></>} */}
                
                {(unidadeSelecionada.selecionada && servicoSelecionado.selecionado)
                ? 
                <>
                {(servicoSelecionado.servico != undefined) ? <input type="submit" value="Registrar" /> : <></>}
                </>
                : <>
                    
                </>
                }

                
                <button className='sairForm' onClick={(e) => logout(e, hostUrl, setLoggedIn, setUsuario)}>Sair</button>
            </form> : <div id="protocolo">
                <p>
                Demanda inserida! Protocolo de demanda número <strong>{msg}</strong> gerado com sucesso!
                </p>
                <button onClick={() => {
                    setMessage(undefined)
                    }}>Criar outra demanda</button>
                <button className='sairForm' onClick={(e) => logout(e, hostUrl, setLoggedIn, setUsuario)}>Sair</button>
                </div>}

               
        </>
    )
}

CriarDemanda.propTypes = {
    usuario: PropTypes.object,
    setLoggedIn: PropTypes.func,
    setUsuario: PropTypes.func
}

export default CriarDemanda;