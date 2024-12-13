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

function criarDemanda(e, host, setMessage, servicoSelecionado){
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
    }
}

function CriarDemanda({ usuario, setLoggedIn, setUsuario, tipoDeArea }){
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
    const [descricao, setDescricao] = useState(false)
    const localInputRef = useRef(null)

    useEffect(()=> {
        obter_usuarios(hostUrl, setSolicitantes)
    }, [hostUrl])

    useEffect(() => {
        setEscolas(escolas_json)
        setServicos(servicos_json)
        setEmpresas(empresas_json)
    }, [])

    useEffect(() => {
        if(localInputRef.current){
            setSalaSelecionada({'selecionada':true, 'sala':usuario.usuario_sala, 'default':'-'})
        }

        setDescricao(false)
    }, [localInputRef, usuario])

    useEffect(() => {
        const inputServico = document.getElementsByName("disp")[0]
        setServicoSelecionado({'selecionado':false, 'servico':undefined, 'default':'-'})
        if(inputServico){
            inputServico.value = "-"
        }
        setDescricao(false)
    }, [salaSelecionada])

    return (
        <div className={(tipoDeArea == "interna") ? "demandaInterna" : ""}>
            {(msg === undefined) ?
            <form id="reg_demanda" onSubmit={(e) => criarDemanda(e, hostUrl, setMessage, servicoSelecionado)}>
                <img className='logo' src={logoSistec} alt="Logo do sistec" />
                <h2 className='titulo'>Novo chamado</h2>
                <input name='dem_local' ref={localInputRef} type="hidden" defaultValue={unidadeSelecionada.unidade}/>

                <Listagem servicos={servicos} setServicoSelecionado={setServicoSelecionado} />
                
                <input type="hidden" name='solicitante' defaultValue={usuario.usuario_id} />

                {(unidadeSelecionada.selecionada && servicoSelecionado.selecionado)
                ? 
                <>
                {(servicoSelecionado.servico != undefined) ? <input type="submit" value="Registrar" /> : <></>}
                </>
                : <>
                    
                </>
                }

                {(tipoDeArea != "interna")?
                <button className='sairForm' onClick={(e) => logout(e, hostUrl, setLoggedIn, setUsuario)}>Sair</button> : <></>}
            </form> : <div id="protocolo">
                <p>
                Demanda inserida! Protocolo de demanda número <strong>{msg}</strong> gerado com sucesso!
                </p>
                <button onClick={() => {
                    setMessage(undefined)
                    }}>Criar outra demanda</button>
                <button className='sairForm' onClick={(e) => logout(e, hostUrl, setLoggedIn, setUsuario)}>Sair</button>
                </div>}

               
        </div>
    )
}

CriarDemanda.propTypes = {
    usuario: PropTypes.object,
    setLoggedIn: PropTypes.func,
    setUsuario: PropTypes.func,
    tipoDeArea: PropTypes.string
}

export default CriarDemanda;