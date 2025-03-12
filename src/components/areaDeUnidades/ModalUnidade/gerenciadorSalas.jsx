import PropTypes from 'prop-types';
import { useContext, useState, useEffect } from "react";
import { HostContext } from "../../../HostContext";

async function registrarSala( host, data, setExibirForm ){
    const route = "/api/salas/registrar"
    const options = {
        method: "POST",
        body: JSON.stringify(data),
        headers: {"Content-Type":"application/json"}
      };
    const result = await fetch(host+route, options);
    const retorno = await result.json();

    if(retorno.registro){
        setExibirForm(false)
    }
}

async function obter_salas(host){
    const route = "/api/salas/listar"
    const result = await fetch(host+route);
    const retorno = await result.json();
    return retorno
}

function extractFormData(uni_id, elements) {
    const formData = {};
    
    for (let element of elements) {
        if ((element.tagName === 'INPUT' || element.tagName === 'SELECT') && element.name) {
            let value = element.value

            if(!isNaN(Number(value))){
                value = Number(value)
            } else if(typeof Boolean(value) == 'boolean' 
            && element.name !== "tipo_sala" 
            && element.name !== "provedor"
            && element.name !== "serie_ano_manha"
            && element.name !== "serie_ano_tarde"
            && element.name !== "serie_ano_noite"
            ){
                value = Boolean(value)
            }

            formData[element.name] = value;
        }
    }

    formData.uni_id = uni_id
    
    return formData;
}

async function fetchData( hostUrl, setSalas ){
    const dispData = await obter_salas(hostUrl)
    setSalas(dispData)
}

function salaDetalhes(e, setDetailsOpened, setSelectedRoomData){
    e.preventDefault()
    const row = e.target.parentNode
    const roomDataset = row.dataset
    const roomData = JSON.parse(roomDataset.sala)
    setSelectedRoomData(roomData)
    setDetailsOpened(true)
}

function getBylaws( ano ){
    switch( ano ){
        case "Creche I":
            return 10
        case "Creche II":
            return 15
        case "Creche III":
            return 20
        case "Creche IV":
            return 20
        case "Pré I":
            return 25
        case "Pré II":
            return 25
        case "1º ano":
            return 25
        case "2º ano":
            return 25
        case "3º ano":
            return 25
        case "4º ano":
            return 35
        case "5º ano":
            return 35
        case "6º ano":
            return 40
        case "7º ano":
            return 40
        case "8º ano":
            return 40
        case "9º ano":
            return 40
    }
}

function stageData(e, unidade, hostUrl, setExibirForm){
    e.preventDefault()
    const form = e.target
    const elements = form.elements
    const uni_id = unidade.uni_id
    const cleanData = extractFormData(uni_id, elements)
    cleanData.capacidade_reg_manha = getBylaws(cleanData.serie_ano_manha)
    cleanData.capacidade_reg_tarde = getBylaws(cleanData.serie_ano_tarde)
    // cleanData.capacidade_reg_noite = getBylaws(cleanData.serie_ano_noite)
    cleanData.serie_ano_noite = null
    // console.log(cleanData)
    registrarSala(hostUrl, cleanData, setExibirForm)
}

function obter_linhas(salas, setDetailsOpened, setSelectedRoomData){
    const lista = salas.map( (sala, idx) => {
        return <tr key={idx} data-sala={JSON.stringify(sala)} onClick={(e)=> salaDetalhes(e, setDetailsOpened, setSelectedRoomData)}>
            <td>{sala.id_unico_sala}</td>
            <td>{sala.numero_sala}</td>
            <td>{sala.tipo_sala}</td>
            <td>{sala.sala_andar}</td>
        </tr>
    })

    const body = <tbody>
        {lista}
    </tbody>

    return body
}

function defineTipo(e, setTipoSala){
    e.preventDefault()
    const tag = e.nativeEvent.target[e.nativeEvent.target.selectedIndex]
    setTipoSala(tag.dataset.tipo)
}

function GerenciadorDeSala({ unidade, setEditing, setGerenciandorSalas }){
    const capacidade_carrinho = 36
    const { hostUrl } = useContext(HostContext)
    const [salas, setSalas] = useState([])
    const [exibirForm, setExibirForm] = useState(false)
    const [detailsOpened, setDetailsOpened] = useState(false)
    const [selectedRoomData, setSelectedRoomData] = useState(undefined)
    const [temInternet, setTemInternet] = useState(false)
    const [tipoSala, setTipoSala] = useState(undefined)
    const [dadosCapacidade, setDadosCapacidade] = useState(undefined)
    const [showDetails, setShowDetails] = useState(false)

    useEffect(() => {
        setShowDetails(false)
    }, [detailsOpened])

    useEffect(() => {
        fetchData( hostUrl, setSalas )
    },[hostUrl])
    
    useEffect(() => {
        fetchData( hostUrl, setSalas )
    }, [exibirForm])

    useEffect(() => {
        if(selectedRoomData != undefined){
            const capacidadeSala = Math.floor(Math.floor((selectedRoomData.comprimento_sala * selectedRoomData.largura_sala).toFixed(2)) - (Math.floor((selectedRoomData.comprimento_sala * selectedRoomData.largura_sala).toFixed(2)) * 0.2))
            const capacidadeRegManha = selectedRoomData.capacidade_reg_manha
            const capacidadeRegTarde = selectedRoomData.capacidade_reg_tarde
            let quantidadeChromes = capacidade_carrinho

            let regimento = capacidadeRegManha > capacidadeRegTarde ? capacidadeRegManha : capacidadeRegTarde
            regimento = regimento > capacidadeSala ? capacidadeSala : regimento
            regimento = regimento > quantidadeChromes ? quantidadeChromes : regimento
            setDadosCapacidade(regimento)
        }
    },[selectedRoomData])

    return (
        <>
            {(exibirForm)
            ? <div className="container">
                <form className='salasForm' onSubmit={(e)=> stageData(e, unidade, hostUrl, setExibirForm)}>
                        <select name="tipo_sala" id="tipo_sala" defaultValue="-" onChange={(e) => defineTipo(e, setTipoSala)}>
                            <option value="-" disabled>Selecione o tipo de sala *</option>
                            <optgroup label='Administrativas'>
                                <option value="Secretaria" data-tipo="adm">Secretaria</option>
                                <option value="Direção" data-tipo="adm">Direção</option>
                                <option value="Sala dos professores" data-tipo="adm">Sala dos professores</option>
                                <option value="Coordenação" data-tipo="adm">Coordenação</option>
                                <option value="OP / OE" data-tipo="adm">OP / OE</option>
                            </optgroup>
                            <optgroup label='Pedagógicas'>
                                <option value="Sala de Aula" data-tipo="saladeaula">Sala de Aula</option>
                                <option value="Biblioteca" data-tipo="ped">Biblioteca</option>
                                <option value="Sala de informática" data-tipo="ped">Sala de informática</option>
                                <option value="Sala de vídeo" data-tipo="ped">Sala de vídeo</option>
                                <option value="Sala de recurso" data-tipo="ped">Sala de recurso</option>
                                <option value="Sala PAE" data-tipo="ped">Sala PAE</option>
                                <option value="Auditório" data-tipo="ped">Auditório</option>
                            </optgroup>
                        </select>

                    <input type="text" name="numero_sala" id="" placeholder='Numero da sala (se tiver)'/>
                    <input type="text" name="sala_andar" id="" placeholder='Andar em que se encontra'/>

                    {(tipoSala == "saladeaula") ?
                    <>
                        <input type="text" name="largura_sala" id="" placeholder='Largura da sala (metros) *'/>
                        <input type="text" name="comprimento_sala" id="" placeholder='Comprimento da sala (metros) *'/>
                    </> : <>
                    </>}

                    <input type="text" name="qnt_entradas" id="" placeholder='Numero de entradas'/>
                    <input type="text" name="largura_porta" id="" placeholder='Largura da porta'/>
                    <input type="text" name="qnt_janelas" id="" placeholder='Quantidade de janelas'/>
                    <input type="text" name="qnt_tomadas" id="" placeholder='Quantidade de tomadas de energia'/>

                    <select name="serie_ano_manha" defaultValue="-">
                        <option value="-">Ano atendido no Turno da manhã</option>
                        <optgroup label='Ensino infantil'>
                            <option value="Creche I">Creche I</option>
                            <option value="Creche II">Creche II</option>
                            <option value="Creche III">Creche III</option>
                            <option value="Creche IV">Creche IV</option>
                            <option value="Pré I">Pré I</option>
                            <option value="Pré II">Pré II</option>
                        </optgroup>
                        <optgroup label='Fundamental I'>
                            <option value="1º ano">1º ano</option>
                            <option value="2º ano">2º ano</option>
                            <option value="3º ano">3º ano</option>
                            <option value="4º ano">4º ano</option>
                            <option value="5º ano">5º ano</option>
                        </optgroup>
                        <optgroup label='Fundamental II'>
                            <option value="5º ano">5º ano</option>
                            <option value="6º ano">6º ano</option>
                            <option value="7º ano">7º ano</option>
                            <option value="8º ano">8º ano</option>
                            <option value="9º ano">9º ano</option>
                        </optgroup>
                        <optgroup label='EJA'>
                            <option value="FASE 1 à 2">FASE I à III</option>
                            <option value="FASE 4 e 5">FASE IV e V</option>
                            <option value="FASE 6">FASE VI</option>
                            <option value="FASE 7">FASE VII</option>
                            <option value="FASE 8">FASE VIII</option>
                            <option value="FASE 9">FASE IX</option>
                        </optgroup>
                    </select>

                    <select name="serie_ano_tarde" id="">
                    <option value="-">Ano atendido no Turno da tarde</option>
                        <optgroup label='Ensino infantil'>
                            <option value="Creche I">Creche I</option>
                            <option value="Creche II">Creche II</option>
                            <option value="Creche III">Creche III</option>
                            <option value="Creche IV">Creche IV</option>
                            <option value="Pré I">Pré I</option>
                            <option value="Pré II">Pré II</option>
                        </optgroup>
                        <optgroup label='Fundamental I'>
                            <option value="1º ano">1º ano</option>
                            <option value="2º ano">2º ano</option>
                            <option value="3º ano">3º ano</option>
                            <option value="4º ano">4º ano</option>
                            <option value="5º ano">5º ano</option>
                        </optgroup>
                        <optgroup label='Fundamental II'>
                            <option value="5º ano">5º ano</option>
                            <option value="6º ano">6º ano</option>
                            <option value="7º ano">7º ano</option>
                            <option value="8º ano">8º ano</option>
                            <option value="9º ano">9º ano</option>
                        </optgroup>
                        <optgroup label='EJA'>
                            <option value="FASE 1 à 2">FASE I à III</option>
                            <option value="FASE 4 e 5">FASE IV e V</option>
                            <option value="FASE 6">FASE VI</option>
                            <option value="FASE 7">FASE VII</option>
                            <option value="FASE 8">FASE VIII</option>
                            <option value="FASE 9">FASE IX</option>
                        </optgroup>
                    </select>

                    {/* <select name="serie_ano_noite" id="">
                    <option value="-">Ano atendido no Turno da noite</option>
                        <optgroup label='Ensino infantil'>
                            <option value="Creche I">Creche I</option>
                            <option value="Creche II">Creche II</option>
                            <option value="Creche III">Creche III</option>
                            <option value="Creche IV">Creche IV</option>
                            <option value="Pré I">Pré I</option>
                            <option value="Pré II">Pré II</option>
                        </optgroup>
                        <optgroup label='Fundamental I'>
                            <option value="1º ano">1º ano</option>
                            <option value="2º ano">2º ano</option>
                            <option value="3º ano">3º ano</option>
                            <option value="4º ano">4º ano</option>
                            <option value="5º ano">5º ano</option>
                        </optgroup>
                        <optgroup label='Fundamental II'>
                            <option value="5º ano">5º ano</option>
                            <option value="6º ano">6º ano</option>
                            <option value="7º ano">7º ano</option>
                            <option value="8º ano">8º ano</option>
                            <option value="9º ano">9º ano</option>
                        </optgroup>
                        <optgroup label='EJA'>
                            <option value="FASE 1 à 2">FASE I à III</option>
                            <option value="FASE 4 e 5">FASE IV e V</option>
                            <option value="FASE 6">FASE VI</option>
                            <option value="FASE 7">FASE VII</option>
                            <option value="FASE 8">FASE VIII</option>
                            <option value="FASE 9">FASE IX</option>
                        </optgroup>
                    </select> */}

                    <select name="internet" id="" defaultValue="-" onChange={(e) => setTemInternet(e.target.value)}>
                        <option value="-" disabled>A sala possui internet?</option>
                        <option value={true}>Sim</option>
                        <option value={false}>Não</option>
                    </select>
                    
                    {(temInternet === "true")
                    ? <div className='radiogroup'>
                        <label>
                            <input type="radio" name="provedor" value="Selten/Altarede"/> Selten/Altarede
                        </label>
                        
                        <label>
                            <input type="radio" name="provedor" value="OK Virtual"/> OK Virtual
                        </label>
                        
                        <label>
                            <input type="radio" name="provedor" value="Axon"/> Axon
                        </label>
                        <label>
                            <input type="radio" name="provedor" value="TIM"/> TIM
                        </label>
                        <label>
                            <input type="radio" name="provedor" value="G-SAT"/> G-SAT
                        </label>
                    </div> : <></>}

                    <input type="submit" value="Registrar nova sala" />
                </form>

                <button onClick={() => {
                    setEditing(false)
                    setGerenciandorSalas(false)}
                    }>Cancelar</button>
            </div>
            : <>

                {(!detailsOpened)
                ? (
                <>
                    <button onClick={() => setExibirForm(true)}>Registrar nova sala</button>
                    <table>
                        <thead>
                            <tr>
                                <td>ID</td>
                                <td>Nº</td>
                                <td>Tipo</td>
                                <td>Andar</td>
                            </tr>
                        </thead>
                        {obter_linhas(salas, setDetailsOpened, setSelectedRoomData)}
                    </table>
                </>
                ) :
                <>

                {(selectedRoomData)
                ? <>

                <div className="selectedRoom">
                    <p className='innerTitle'>Detalhes</p>
                    <p><span>Tipo de sala:</span> {selectedRoomData.tipo_sala}</p>
                    <p><span>ID único da sala:</span> {selectedRoomData.id_unico_sala} (No sistema)</p>
                    <p><span>Número da sala:</span> Sala {selectedRoomData.numero_sala} (Na unidade)</p>
                    <p><span>Andar em que se encontra:</span> {selectedRoomData.sala_andar}º andar</p>
                    <p><span>Entradas:</span> {selectedRoomData.qnt_entradas}</p>
                    <p><span>Janelas:</span> {selectedRoomData.qnt_janelas}</p>
                    <p><span>Tomadas:</span> {selectedRoomData.qnt_tomadas}</p>
                    <p><span>Internet:</span> {(selectedRoomData.internet) ? "Sim" : "Não"}</p>
                    <p><span>Provedor de internet:</span> {selectedRoomData.provedor}</p>
                    {(selectedRoomData.tipo_sala !== "Administrativo")
                    ? <>
                        <p><span>Série/Ano - Manhã:</span> {selectedRoomData.serie_ano_manha}</p>
                        <p><span>Série/Ano - Tarde:</span> {selectedRoomData.serie_ano_tarde}</p>
                        <p><span>Série/Ano - Noite:</span> {selectedRoomData.serie_ano_noite}</p>
                    </> : <></>}
                    
                    {(showDetails)
                    ? 
                    <>
                    <p><span>Capacidade de Chromebooks: </span> {dadosCapacidade} dispositivos</p>
                    
                        <div className='subInfo'>
                            {(selectedRoomData.comprimento_sala !== null)
                            ? <div className="dimensoes">
                                <p><span>Comprimento da sala:</span> {selectedRoomData.comprimento_sala}m</p>
                                <p><span>Largura da sala:</span> {selectedRoomData.largura_sala}m</p>
                                <p><span>Área da sala: </span>{(selectedRoomData.comprimento_sala * selectedRoomData.largura_sala).toFixed(2)}m²</p>
                            </div> : <></>}
                            <p><span>Capacidade da sala:</span> {Math.floor(Math.floor((selectedRoomData.comprimento_sala * selectedRoomData.largura_sala).toFixed(2)) - (Math.floor((selectedRoomData.comprimento_sala * selectedRoomData.largura_sala).toFixed(2)) * 0.2))} alunos </p>
                            <p><span>Regimento - Manhã:</span> {selectedRoomData.capacidade_reg_manha} alunos</p>
                            <p><span>Regimento - Tarde:</span> {selectedRoomData.capacidade_reg_tarde} alunos</p>
                            <p><span>Capacidade EduCharge: </span>{capacidade_carrinho} chromebooks (c/ carregador)</p>
                        </div>
                    </>
                    : <>
                    </>}

                    {/* <p><span>Capacidade: </span> </p> */}

                    <div className="btnHolder">
                        {(selectedRoomData.comprimento_sala === null) ? <></> : (<button onClick={() => setShowDetails(true)}>Detalhes da capacidade</button>)}
                        <button onClick={() => {
                            setSelectedRoomData(undefined)
                            setDetailsOpened(false)
                            }}>Voltar</button>
                    </div>
                </div>
                </> : <></>}
                </>}
            </>}
        </>
    )
}

GerenciadorDeSala.propTypes = {
    unidade: PropTypes.object,
    setEditing: PropTypes.func,
    setGerenciandorSalas: PropTypes.func
}

export default GerenciadorDeSala