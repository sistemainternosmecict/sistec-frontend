import { useEffect, useState, useContext } from 'react';
import { HostContext } from "../../HostContext";
import './style.scss';

async function buscar_solicitante_por_id( id, host ){
    const route = `/api/usuarios/solicitantes/buscar/${id}`
    const result = await fetch(host+route);
    const retorno = await result.json();
    return retorno
}

async function buscar_colaborador_por_id( id, host ){
    const route = `/api/usuarios/colaboradores/buscar/${id}`
    const result = await fetch(host+route);
    const retorno = await result.json();
    return retorno.colab
}

async function obter_solicitantes(host){
    const route = "/api/usuarios/colaboradores/listar"
    const result = await fetch(host+route);
    const retorno = await result.json();
    return retorno.colab
}

async function atualizar_status(protocolo, status, host, func, setDemandas, demanda) {
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
    
    const dados = {
        "protocolo": protocolo,
        "dem_status": status,
        "dem_dt_final": (status === 5 || status === 6) ? dataFormatada : null,
        "dem_tempo_finalizacao": (status === 5 || status === 6) ? diff.dias : null,
        "dem_atendido_por": (status === 5 || status === 6) ? buscar_colaborador_por_id(demanda.direcionamento, host).colab.colab_nome : null
    }
    const route = "/api/demandas/atualizar"
    const options = {
        method: "POST",
        body: JSON.stringify(dados),
        headers: {"Content-Type":"application/json"}
      };
    const result = await fetch(host+route, options);
    const retorno = await result.json();
    func(host, setDemandas)
}

async function atualizar_prioridade(protocolo, np, host, func, setDemandas) {
    const route = "/api/demandas/atualizar"
    const options = {
        method: "POST",
        body: JSON.stringify({"protocolo":protocolo, "dem_prioridade":np}),
        headers: {"Content-Type":"application/json"}
      };
    const result = await fetch(host+route, options);
    const retorno = await result.json();
    func(host, setDemandas)
}

async function atualizar_direcionamento(protocolo, direct, host, func, setDemandas) {
    const route = "/api/demandas/atualizar"
    const options = {
        method: "POST",
        body: JSON.stringify({"protocolo":protocolo, "tb_colaboradores_id":direct}),
        headers: {"Content-Type":"application/json"}
      };
    const result = await fetch(host+route, options);
    const retorno = await result.json();
    if(retorno.atualizado){
        func(host, setDemandas)
    }
}

function padZero(numero) {
    return numero < 10 ? '0' + numero : numero;
}

function stringParaData(dataString) {
    const [data, hora] = dataString.split('|');
    const [dia, mes, ano] = data.split('/');
    const [horas, minutos] = hora.split(':');

    return new Date(ano, mes - 1, dia, horas, minutos);
}

function calcularDiferenca(entrada, finalizacao) {
    const msPorMinuto = 60 * 1000;
    const msPorHora = 60 * msPorMinuto;
    const msPorDia = 24 * msPorHora;

    const diferencaMs = finalizacao - entrada;

    const dias = Math.floor(diferencaMs / msPorDia);
    const horas = Math.floor((diferencaMs % msPorDia) / msPorHora);
    const minutos = Math.floor((diferencaMs % msPorHora) / msPorMinuto);

    return { dias, horas, minutos };
}

export default function Demanda({ demanda, func, setDemandas }){
    const { hostUrl } = useContext(HostContext)
    const [solicitante, setSolicitante] = useState(undefined)
    const [colabs, setColabs] = useState(undefined)

    useEffect(() => {
        async function fetchData() {
            const solics = await buscar_solicitante_por_id(demanda.solicitante, hostUrl)
            const colabs_temp = await obter_solicitantes(hostUrl)
            setSolicitante(solics.solic.dados)
            setColabs(colabs_temp)
        }
        fetchData()
    }, [hostUrl])

    return (<>
        {(solicitante) ? <div className="demanda_card arquivo">
            <p><span>PROTOCOLO: </span>{demanda.protocolo}</p>
            <p><span>Data e hora: </span>{demanda.dt_entrada}</p>

            <p><span>Solicitante: </span>{solicitante.solic_nome + " da sala " + solicitante.solic_sala} | <span>NP: </span> {demanda.nvl_prioridade}</p>
            <p><span>Descrição: </span> {demanda.descricao}</p>

            <div className="drops">

                {(demanda.status < 5) ? <>
                    
                    <select name="prioridade" 
                    defaultValue={demanda.nvl_prioridade} onChange={(e) => 
                    atualizar_prioridade(demanda.protocolo, e.target.value, hostUrl, func, setDemandas)}>
                        <option 
                        value={0} 
                        disabled="disabled">NP</option>
                        <option 
                        value={1} 
                        disabled={(demanda.nvl_prioridade === 1) ? "disabled" : ""}>P1</option>
                        <option 
                        value={2} 
                        disabled={(demanda.nvl_prioridade === 2) ? "disabled" : ""}>P2</option>
                        <option 
                        value={3} 
                        disabled={(demanda.nvl_prioridade === 3) ? "disabled" : ""}>P3</option>
                    </select>

                    <select name="direct" onChange={(e) => 
                    atualizar_direcionamento(demanda.protocolo, e.target.value, hostUrl, func, setDemandas)} 
                    defaultValue={(demanda.direcionamento !== 0) ? demanda.direcionamento : 0}>
                        <option value={0} disabled>Direcionamento</option>
                        {colabs.map( colab => <option value={colab.colab_id} key={colab.colab_id}>{colab.colab_nome}</option>)}
                    </select>

                    <select name="status" 
                    defaultValue={demanda.status} 
                    onChange={(e) => atualizar_status(demanda.protocolo, e.target.value, hostUrl, func, setDemandas, demanda)}>
                        {(demanda.status === 1)? <option value={1} disabled={(demanda.status === 1) ? "disabled" : ""}>Nova demanda</option> : <></>}
                        <option value={2} disabled={(demanda.status === 2) ? "disabled" : ""}>Em andamento</option>
                        <option value={3} disabled={(demanda.status === 3) ? "disabled" : ""}>Aguardando</option>
                        <option value={4} disabled={(demanda.status === 4) ? "disabled" : ""}>Encaminhado</option>
                        {((demanda.status === 2) || (demanda.status === 3) || (demanda.status === 4))
                        ? <>
                            <option value={5}>Finalizado</option>
                            <option value={6}>Encerrado</option></>
                        : <></>}
                    </select>
                </> : <>{(demanda.status === 5) 
                ? <>
                    <strong>
                        FINALIZADA 
                    </strong> em: {demanda.dt_final}
                    {/* <p>Levou {demanda.tempo_finalizacao} dias.</p> */}
                </>
                : <>
                <strong>
                    ENCERRADA 
                </strong> em: {demanda.dt_final}
            </>
            }</>}
            </div>

        </div> : <></>}
    </>)
}