import PropTypes from 'prop-types';
import ModalUnidadeEditor from './edicao';
import GerenciadorDeSala from './gerenciadorSalas';
import "./style.scss";
import { useState } from 'react';

function listarSegmentos( segmentosString ){
    const segmentos = ["Creche", "Pré-escolar", "Fund. 1 - Do 1º ao 5º ano", "Fund. 2 - Do 6º ao 9º ano", "EJA 1 - Do 1º ao 5º ano", "EJA 2 - Do 6º ao 9º ano"]
    const lista = JSON.parse(segmentosString)
    if(lista.length > 0){
        const retorno = lista.map((num) => {
            return <li key={num}>
                <p>{"=> " + segmentos[num]}</p>
            </li>
        })
    
        return retorno
    }

    return <></>
}

function obterDistrito( distrito ){
    switch(distrito){
        case "D1":
            return "1º Distrito - Saquarema"
        case "D2":
            return "2º Distrito - Bacaxá"
        case "D3":
            return "3º Distrito - Sampaio Correa"
    }
}

function ModalUnidade({ unidade, setPaginaAreaUnidades }){
    const [editing, setEditing]= useState(false)
    const [gerenciandorSalas, setGerenciandorSalas] = useState(false)
    return (
        <>
            <h2>{unidade.uni_designador_categoria + " " + unidade.uni_nome}</h2>

            {( !gerenciandorSalas) ?
            ( !editing ) ?
            (<div className='unidade'>
                <h3 className='subtitle'>Detalhes da unidade</h3>
                <div className="infoBox">
                    <p>Cod. UE: <span>{unidade.uni_cod_ue}</span></p>
                    <p>Direção: <span>{unidade.uni_direcao}</span></p>
                    <p>Tel. da unidade: <span>{unidade.uni_telefone_direcao}</span></p>
                </div>

                {(unidade.uni_segmentos) ?
                <div className="infoBox">
                    <p className='tituloSegmentos'>Segmentos atendidos</p>
                    <ul>
                        {listarSegmentos(unidade.uni_segmentos ? unidade.uni_segmentos : "[]")}
                    </ul>
                </div> : <></>}

                {(unidade.uni_logradouro)
                ? <div className="infoBox">
                    <p>Distrito: <span>{unidade.uni_distrito ? obterDistrito(unidade.uni_distrito) : "N/D"}</span></p>
                    <p>Endereço: <span>{
                    unidade.uni_logradouro +
                    " Nº" +
                    unidade.uni_numero_end +
                    ", " +
                    unidade.uni_bairro +
                    " - Saquarema - RJ CEP:" + unidade.uni_cep
                    }</span></p>
                </div> : <></>}
            </div>) : 
            <>
                <h3 className='subtitle'>Editor de unidade</h3>
                <ModalUnidadeEditor unidade={unidade} setPaginaAreaUnidades={setPaginaAreaUnidades}/> 
            
            </>
            : 
            <>
                <h3 className='subtitle'>Gerenciador de salas</h3>
                <GerenciadorDeSala unidade={unidade} />
            </>}

            <div className="btnBox">
                {(!editing && !gerenciandorSalas) ?
                (<>
                <button onClick={() => setEditing(true)}>Editar unidade</button>
                <button onClick={() => setGerenciandorSalas(true)}>Gerenciador de salas</button>
                </>) :
                (<>
                <button onClick={() => {
                    setEditing(false)
                    setGerenciandorSalas(false)}
                    }>Cancelar</button></>)}
            </div>
        </>
    )
}

ModalUnidade.propTypes = {
    unidade: PropTypes.object,
    setPaginaAreaUnidades: PropTypes.func
}

export default ModalUnidade