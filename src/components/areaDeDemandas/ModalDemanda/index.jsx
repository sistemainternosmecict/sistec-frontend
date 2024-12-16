import PropTypes from 'prop-types';
import { HostContext } from '../../../HostContext';
import './style.scss';
import { useEffect, useState, useContext, useRef } from 'react';

async function obterUsuarios(host, set){
    const route = "/api/usuarios/listar"
    const result = await fetch(host+route);
    const retorno = await result.json();
    set(retorno.usuarios);
}

async function atualizarDemanda( demanda, host, fetchData, setDemandas ){
    const route = "/api/demandas/atualizar"
    const options = {
        method: "POST",
        body: JSON.stringify(demanda),
        headers: {"Content-Type":"application/json"}
      };
    const result = await fetch(host+route, options);
    const retorno = await result.json();
    if(retorno.atualizado){
        fetchData( setDemandas , host)
    }
}

function mudarPrioridade( valor, protocolo, hostUrl, fetchData, setDemandas ){
    const demanda = {
        protocolo: protocolo,
        dem_prioridade: valor
    }
    atualizarDemanda(demanda, hostUrl, fetchData, setDemandas)
}

function mudarDirecionamento( valor, protocolo, hostUrl, fetchData, setDemandas ){
    const demanda = {
        protocolo: protocolo,
        dem_direcionamento_id: valor
    }
    atualizarDemanda(demanda, hostUrl, fetchData, setDemandas)
}

function mudarStatus( valor, protocolo, hostUrl, fetchData, setDemandas ){
    const demanda = {
        protocolo: protocolo,
        dem_status: valor
    }
    atualizarDemanda(demanda, hostUrl, fetchData, setDemandas)
}

function ModalDemanda({ demanda, fetchData, setDemandas }){
    const { hostUrl } = useContext(HostContext)
    const [usuarios, setUsuarios] = useState([])
    const [usuarioSelecionado, setUsuarioSelecionado] = useState({})
    const direcionamentos = useRef([])

    useEffect(()=> {
        obterUsuarios(hostUrl, setUsuarios)
    }, [demanda, hostUrl])

    useEffect(() => {
        const direcTemp = []
        usuarios.forEach( (usuario) => {
            if(usuario.usuario_id == demanda.solicitante){
                setUsuarioSelecionado(usuario)
            }

            if(usuario.usuario_tipo < 3){
                direcTemp.push(usuario)
            }
        })
        direcionamentos.current = direcTemp
    }, [usuarios, demanda])

    return (
        <div className="modal">
            <div className="wrapper">
                <p><span>Protocolo:</span> {demanda.protocolo} </p>
                <p><span>Entrada:</span> {demanda.dt_entrada} </p>
                <p><span>Solicitante:</span> {usuarioSelecionado.usuario_nome} </p>
                <p><span>Local:</span> {demanda.local} </p>
                <p><span>Sala:</span> {demanda.sala} </p>
                <p><span>Prioridade:</span> {demanda.nvl_prioridade} </p>
                <p><span>Descrição:</span> {demanda.descricao} </p>

                <div className="actions">
                    <select defaultValue="-" onChange={(e) => mudarPrioridade(e.target.value, demanda.protocolo, hostUrl, fetchData, setDemandas)}>
                        <option value="-" disabled>NP</option>
                        <option value="3">3</option>
                        <option value="2">2</option>
                        <option value="1">1</option>
                    </select>

                    <select defaultValue="-" onChange={(e) => mudarDirecionamento(e.target.value, demanda.protocolo, hostUrl, fetchData, setDemandas)}>
                        <option value="-" disabled>Direcionamento</option>
                        {direcionamentos.current.map( (usuario, idx) => {
                            return <option key={idx} value={usuario.usuario_id}>{usuario.usuario_nome}</option>

                        })}
                    </select>

                    <select defaultValue={(demanda.status) ? demanda.status : 1} onChange={(e) => mudarStatus(e.target.value, demanda.protocolo, hostUrl, fetchData, setDemandas)}>
                        <option value={1} disabled>Nova demanda</option>
                        <option value={2}>Em andamento</option>
                        <option value={3}>Aguardando</option>
                        <option value={4}>Encaminhada</option>
                        <option value={5}>Finalizada</option>
                        <option value={6}>Encerrada</option>
                    </select>
                </div>
            </div>
        </div>
    )
}

ModalDemanda.propTypes = {
    demanda: PropTypes.object,
    fetchData: PropTypes.func
}

export default ModalDemanda;