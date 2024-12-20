import PropTypes from 'prop-types';
import { HostContext } from '../../../HostContext';
import './style.scss';
import { useEffect, useState, useContext, useRef } from 'react';
import servicos from '../CriarDemanda/tipos_servicos.json';
import empresas from '../CriarDemanda/empresas.json';
import { Icon } from '@iconify-icon/react';

async function obterUsuarios(host, set){
    const route = "/api/usuarios/listar"
    const result = await fetch(host+route);
    const retorno = await result.json();
    set(retorno.usuarios);
}

async function atualizarDemanda( demanda, host, fetchData, setDemandas, setSalvandoAtualizacoes, setMsg, setPagina ){
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
        setMsg("Dados, registrados!")
        setTimeout(()=> {
            setSalvandoAtualizacoes(false)
            setPagina(0)
        }, 2000)
    }
}

function salvar( dadosParaAtualizacao, setDadosParaAtualizacao, setSalvandoAtualizacoes ){
    const dropdowns = document.querySelectorAll(".dropDownActions")
    const novosDados = {
        dem_prioridade: Number(dropdowns[0].value),
        dem_direcionamento_id: Number(dropdowns[1].value),
        dem_status: Number(dropdowns[2].value),
        dem_observacoes: dropdowns[3].value
    }

    setDadosParaAtualizacao({...dadosParaAtualizacao, ...novosDados})
    setSalvandoAtualizacoes(true)
}

function obterEstado( estadoId ) {
    switch( estadoId ){
        case 1:
            return "Nova demanda"
        case 2:
            return "Em andamento"
        case 3:
            return "Aguardando"
        case 4:
            return "Encaminhada"
        case 5:
            return "Finalizada"
        case 6:
            return "Encerrada"
    }
}

function obterPrioridade( np ){
    switch( np ){
        case 3:
            return "3 - Alta prioridade"
        case 2:
            return "2 - Média prioridade"
        case 1:
            return "1 - Baixa prioridade"
        default:
            return "N/D - Não definida"
    }
}

function obterTipoDeServico ( tipoDeServico){
    switch( tipoDeServico ){
        case 1:
            return "CPD"
        case 2:
            return "Terceirizado"
    }
}

function extrairConteudoEntreParenteses(texto) {
    const match = texto.match(/\(([^)]+)\)/);
    return match ? match[1] : null;
}

function calcularTempoEmDias(dataInicial, dataFinal) {
    // Separar a data e hora
    const [dataInicio, horaInicio] = dataInicial.split('|');
    const [dataFim, horaFim] = dataFinal.split('|');

    // Quebrar as partes da data e da hora
    const [diaInicio, mesInicio, anoInicio] = dataInicio.split('/').map(Number);
    const [horaIni, minutoIni] = horaInicio.split(':').map(Number);

    const [diaFim, mesFim, anoFim] = dataFim.split('/').map(Number);
    const [horaFin, minutoFin] = horaFim.split(':').map(Number);

    // Criar objetos Date
    const inicio = new Date(anoInicio, mesInicio - 1, diaInicio, horaIni, minutoIni);
    const fim = new Date(anoFim, mesFim - 1, diaFim, horaFin, minutoFin);

    // Calcular a diferença em milissegundos
    const diferencaMs = fim - inicio;

    // Converter para dias (1 dia = 24h * 60m * 60s * 1000ms)
    const diferencaDias = diferencaMs / (1000 * 60 * 60 * 24);

    return diferencaDias;
}

function obterDataAtualFormatada() {
    const dataAtual = new Date();

    // Obter partes da data
    const dia = String(dataAtual.getDate()).padStart(2, '0');
    const mes = String(dataAtual.getMonth() + 1).padStart(2, '0'); // Adicionar 1 ao mês
    const ano = dataAtual.getFullYear();

    // Obter partes da hora
    const horas = String(dataAtual.getHours()).padStart(2, '0');
    const minutos = String(dataAtual.getMinutes()).padStart(2, '0');

    // Combinar no formato desejado
    return `${dia}/${mes}/${ano}|${horas}:${minutos}`;
}

function finalizarDemanda( demanda, host, fetchData, setDemandas, setSalvandoAtualizacoes, setMsg, setPagina, usuario ){
    const diff = calcularTempoEmDias(demanda.dt_entrada, obterDataAtualFormatada())
    const dadosParaAtualizacaoTemp = {
        protocolo: demanda.protocolo,
        dem_status: 5,
        dem_atendido_por_id: usuario.usuario_id,
        dem_dt_final: obterDataAtualFormatada(),
        dem_tempo_finalizacao: diff
    }

    atualizarDemanda(dadosParaAtualizacaoTemp, host, fetchData, setDemandas, setSalvandoAtualizacoes, setMsg, setPagina)
}

function abrirZapEncaminharDemanda( demanda, host, fetchData, setDemandas, setSalvandoAtualizacoes, setMsg, setPagina, usuario ){
    const diff = calcularTempoEmDias(demanda.dadosDemanda.dt_entrada, obterDataAtualFormatada())
    const incidente = "|" + demanda.incidente.split(' ').join("%20")
    const local = "| Local:%20" + demanda.dadosDemanda.local + "| Sala:%20" + demanda.dadosDemanda.sala
    const solicitante = `| Solicitante:%20${demanda.usuario.usuario_nome}`
    const corpoDaMensagem = `Protocolo:%20${demanda.dadosDemanda.protocolo}%20${incidente}%20${local}%20${solicitante}`

    const url = `https://wa.me/+55${demanda.dadosEmpresa.telefone}?text=${corpoDaMensagem}`
    window.open(url, '_blank', 'noopener, noreferrer')
    
    const dadosParaAtualizacaoTemp = {
        protocolo: demanda.dadosDemanda.protocolo,
        dem_status: 4,
        dem_atendido_por_id: usuario.usuario_id,
        dem_dt_final: obterDataAtualFormatada(),
        dem_tempo_finalizacao: diff
    }

    atualizarDemanda(dadosParaAtualizacaoTemp, host, fetchData, setDemandas, setSalvandoAtualizacoes, setMsg, setPagina)
}

function reabrirDemanda( demanda, host, fetchData, setDemandas, setSalvandoAtualizacoes, setMsg, setPagina ){
    const dadosParaAtualizacaoTemp = {
        protocolo: demanda.protocolo,
        dem_status: 2,
        dem_atendido_por_id: null,
        dem_dt_final: null,
        dem_tempo_finalizacao: null
    }

    atualizarDemanda(dadosParaAtualizacaoTemp, host, fetchData, setDemandas, setSalvandoAtualizacoes, setMsg, setPagina)
}

function ModalDemanda({ demanda, fetchData, setDemandas, setPagina, usuario }){
    const { hostUrl } = useContext(HostContext)
    const [usuarios, setUsuarios] = useState([])
    const [usuarioSelecionado, setUsuarioSelecionado] = useState({})
    const [descricaoLegivel, setDescricaoLegivel] = useState("")
    const [tipoDeServico, setTipoDeServico] = useState(0)
    const [dadosParaAtualizacao, setDadosParaAtualizacao] = useState({protocolo: demanda.protocolo, dem_prioridade: undefined, dem_direcionamento_id: undefined})
    const [salvandoAtualizacoes, setSalvandoAtualizacoes] = useState(false)
    const [msg, setMsg] = useState("")
    const [finalizando, setFinalizando] = useState(false)
    const [usuarioAtendimento, setUsuarioAtendimento] = useState(undefined)
    const descSolicitanteRef = useRef("N/D")
    const direcionamentos = useRef([])
    const direcionamento = useRef({usuario_nome: "-"})
    const empresaRef = useRef(undefined)

    useEffect(()=> {
        obterUsuarios(hostUrl, setUsuarios)
        const descSolicitanteSemParenteses = extrairConteudoEntreParenteses(demanda.descricao)
        const texto = demanda.descricao.replace(/\s*\([^)]*\)\s*/, ' ').trim();
        const incidenteArray = texto.split(" ")
        incidenteArray.shift()
        incidenteArray.shift()
        incidenteArray.pop()
        const incidente = incidenteArray.join(" ")
        const cod_temp = demanda.descricao.split(' ')[0]
        servicos.forEach( servico => {
            servico.options.forEach( option => {
                if(option.cod == cod_temp){
                    setDescricaoLegivel( "Grupo: " + servico.label + " | Subgrupo: " + option.label + " | Incidente: " + incidente )
                    if(option.tipo > 0){
                        setTipoDeServico(option.tipo)
                    }
                }

            })
        })

        empresas.forEach( empresa => {
            empresa.cobertura.forEach( cobertura => {
                if(cobertura == cod_temp){
                    empresaRef.current = empresa
                }
            })
        })

        descSolicitanteRef.current = descSolicitanteSemParenteses
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

            if(usuario.usuario_id == demanda.atendido_por){
                setUsuarioAtendimento(usuario)
            }
        })
        direcionamentos.current = direcTemp
    }, [usuarios, demanda])

    useEffect(() => {
        direcionamentos.current.forEach( usuario => {
            if(demanda.direcionamento == 0){
                direcionamento.current = {usuario_nome: "N/D - Não definido", usuario_id: 0}
            } 
            if(demanda.direcionamento == usuario.usuario_id){
                direcionamento.current = usuario
            }
        })
    })

    return (
        <div className="modal">
            <div className="wrapper">
                <p><span>Protocolo:</span> {demanda.protocolo} </p>
                <p><span>Entrada:</span> {demanda.dt_entrada} </p>
                <p><span>Solicitante:</span> {usuarioSelecionado.usuario_nome} </p>
                <p><span>Local:</span> {demanda.local} </p>
                <p><span>Sala:</span> {demanda.sala} </p>
                <p><span>Descrição:</span> {descricaoLegivel} </p>
                <p><span>Observação do solicitante:</span> {descSolicitanteRef.current} </p>
                <p><span>Prioridade:</span> {obterPrioridade(demanda.nvl_prioridade)} </p>
                <p><span>Status:</span> {obterEstado(demanda.status)} </p>
                <p><span>Direcionamento:</span> {direcionamento.current.usuario_id + " - " + direcionamento.current.usuario_nome} </p>
                
                {(demanda.status >= 4) ? <div className='dadosFinais'>
                    <h2>Dados de finalização</h2>
                    <p><span>Demanda atendida por:</span> {(usuarioAtendimento) ? usuarioAtendimento.usuario_nome : "-"} </p>
                    <p><span>Data de finalização:</span> {(demanda.dt_final != null) ? demanda.dt_final : "-"} </p>
                    <p><span>Tempo de atendimento:</span> {(demanda.tempo_finalizacao != null) ? demanda.tempo_finalizacao : "-"} dias</p>
                    <p><span>Observações de atendimento:</span> {(demanda.observacoes) ? demanda.observacoes : "-"} </p>

                    <p><span>Tipo de servico:</span> {obterTipoDeServico(tipoDeServico)} </p>
                    {(empresaRef.current != undefined)
                    ? <>
                        <p><span>Empresa: {empresaRef.current.empresa}</span></p>
                        <p><span>Responsável: {empresaRef.current.responsavel}</span></p>
                        <p><span>Contato: {empresaRef.current.telefone}</span></p>
                    </> : <></>}
                    <button onClick={() => reabrirDemanda(demanda, hostUrl, fetchData, setDemandas, setSalvandoAtualizacoes, setMsg, setPagina)}>Reabrir demanda</button>
                </div> : <></>}

                {(demanda.status < 4)
                ? <div className="atendimento">
                    {(!salvandoAtualizacoes) ?
                    <div>
                        <h2>Atendimento</h2>
                        <p><span>Tipo de servico:</span> {obterTipoDeServico(tipoDeServico)} </p>
                        {(empresaRef.current != undefined)
                        ? <>
                            <p><span>Empresa: {empresaRef.current.empresa}</span></p>
                            <p><span>Responsável: {empresaRef.current.responsavel}</span></p>
                            <p><span>Contato: {empresaRef.current.telefone}</span></p>
                        </> : <></>}
    
                        <div>
                            <select className='dropDownActions' defaultValue={(demanda.nvl_prioridade) ? demanda.nvl_prioridade : 0}>
                                <option value={0} disabled>NP</option>
                                <option value={3}>3</option>
                                <option value={2}>2</option>
                                <option value={1}>1</option>
                            </select>
    
                            <select className='dropDownActions' defaultValue={(demanda.direcionamento) ? demanda.direcionamento : 0}>
                                <option value={0} disabled>Direcionamento</option>
                                {direcionamentos.current.map( (usuario, idx) => {
                                    return <option key={idx} value={usuario.usuario_id}>{usuario.usuario_nome}</option>
    
                                })}
                            </select>
    
                            <select className='dropDownActions' defaultValue={(demanda.status) ? demanda.status : 1}>
                                <option value={1} disabled>Nova demanda</option>
                                <option value={2}>Em andamento</option>
                                <option value={3}>Aguardando</option>
                                <option value={4}>Encaminhada</option>
                            </select>
                        </div>
    
                        <textarea className='dropDownActions' placeholder='Observações de atendimento...' defaultValue={(demanda.observacoes != "") ? demanda.observacoes : ""}></textarea>
    
                        {(tipoDeServico == 1)
                        ?    <div className='btnHolder'>
                        <button onClick={() => {
                            salvar(dadosParaAtualizacao, setDadosParaAtualizacao, setSalvandoAtualizacoes)
                        }}>Registrar alterações</button>
                        <button onClick={() => {
                            setFinalizando(true)
                            setSalvandoAtualizacoes(true)
                        }}>Finalizar demanda</button>
                        </div>
                        : <div className='btnHolder'>
                            <button onClick={() => {
                                salvar(dadosParaAtualizacao, setDadosParaAtualizacao, setSalvandoAtualizacoes)
                            }}>Registrar alterações</button>
                            <button style={{display: "flex", alignItems: "center", justifyContent: "center"}} onClick={() => abrirZapEncaminharDemanda({dadosDemanda: demanda, dadosEmpresa: empresaRef.current, incidente: descricaoLegivel, usuario: usuarioSelecionado}, hostUrl, fetchData, setDemandas, setSalvandoAtualizacoes, setMsg, setPagina, usuario)}>
                                <Icon icon="logos:whatsapp-icon" width="30" height="30" className='iconeZap'/> Zap da {(empresaRef.current != undefined) ? empresaRef.current.empresa : "empresa"}
                            </button>
                        </div>   
                        }
                    </div> : <div>
                        {(msg == "") ?
                        <>
                            <h2>Confirmação de {(finalizando) ? "finalização" : "alteração"}</h2>
                            <p>{(finalizando) ? "Gostaria de finalizar esta demanda?" : "Gostaria realmente de registrar as alterações feitas?"}</p>
                            <button onClick={() => {
                                (!finalizando)
                                ? atualizarDemanda(dadosParaAtualizacao, hostUrl, fetchData, setDemandas, setSalvandoAtualizacoes, setMsg, setPagina)
                                : finalizarDemanda( demanda, hostUrl, fetchData, setDemandas, setSalvandoAtualizacoes, setMsg, setPagina, usuario )
                            }}>Salvar</button>
                            <button onClick={() => {
                                setFinalizando(false)
                                setSalvandoAtualizacoes(false)
                                }}>Cancelar</button>
                        </> : <>
                        <h2>{msg}</h2>
                        </>}
                    </div>}
                </div> : <>
                </>}
            </div>
        </div>
    )
}

ModalDemanda.propTypes = {
    demanda: PropTypes.object,
    fetchData: PropTypes.func,
    setDemandas: PropTypes.func,
    setPagina: PropTypes.func,
    usuario: PropTypes.object
}

export default ModalDemanda;