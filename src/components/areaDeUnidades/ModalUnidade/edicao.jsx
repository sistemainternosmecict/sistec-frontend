import PropTypes from 'prop-types';
import { useContext, useEffect, useState } from "react";
import { HostContext } from "../../../HostContext";

async function atualizarUnidade( host, data, setPaginaAreaUnidades ){
    const route = "/api/unidades/atualizar"
    const options = {
        method: "POST",
        body: JSON.stringify(data),
        headers: {"Content-Type":"application/json"}
      };
    const result = await fetch(host+route, options);
    const retorno = await result.json();

    if(retorno.atualizado){
        setPaginaAreaUnidades(0)
    }
}

function stageData(e, hostUrl, setPaginaAreaUnidades){
    e.preventDefault()

    const form = e.target
    const elements = form.elements
    const fieldset = elements[4]
    const fieldElements = fieldset.elements
    const segmentos = []

    if(fieldElements[0].checked){
        segmentos.push(Number(fieldElements[0].value))
    }
    if(fieldElements[1].checked){
        segmentos.push(Number(fieldElements[1].value))
    }
    if(fieldElements[2].checked){
        segmentos.push(Number(fieldElements[2].value))
    }
    if(fieldElements[3].checked){
        segmentos.push(Number(fieldElements[3].value))
    }
    if(fieldElements[4].checked){
        segmentos.push(Number(fieldElements[4].value))
    }
    if(fieldElements[5].checked){
        segmentos.push(Number(fieldElements[5].value))
    }

    const data = {
        uni_id: Number(elements.uni_id.value),
        uni_nome: elements.uni_nome.value,
        uni_segmentos: JSON.stringify(segmentos),
        uni_direcao: elements.uni_direcao.value,
        uni_telefone_direcao: elements.uni_telefone_direcao.value,
        uni_listada: elements.uni_listada.value == 0 ? false : true
    }

    atualizarUnidade( hostUrl, data, setPaginaAreaUnidades )
}

function ModalUnidadeEditor({ unidade, setPaginaAreaUnidades }){
    const { hostUrl } = useContext(HostContext)
    const [segmentos, setSegmentos] = useState([])

    useEffect(()=> {
        if( unidade ){
            setSegmentos(JSON.parse(unidade.uni_segmentos))
        }

    }, [unidade])

    const handleCheckboxChange = (value) => {
        setSegmentos((prev) =>
          prev.includes(value)
            ? prev.filter((item) => item !== value)
            : [...prev, value]
        );
    };

    return (
        <>
            <form onSubmit={(e)=> stageData(e, hostUrl, setPaginaAreaUnidades)} className='editForm'>
                <input type="hidden" name="uni_id" value={unidade.uni_id} />
                <div className="inputBox">
                    <label htmlFor="uni_nome">Nome</label>
                    <input type="text" name="uni_nome" id="uni_nome" defaultValue={unidade.uni_nome} />
                </div>

                <div className="inputBox">
                    <label htmlFor="uni_direcao">Diretor(a)</label>
                    <input type="text" name="uni_direcao" id="uni_direcao" defaultValue={unidade.uni_direcao} placeholder='Nome do(a) diretor(a)' maxLength={50}/>
                </div>

                <div className="inputBox">
                    <label htmlFor="uni_telefone_direcao">Telefone da unidade (Ou direção)</label>
                    <input type="text" name="uni_telefone_direcao" id="uni_telefone_direcao" defaultValue={unidade.uni_telefone_direcao} placeholder='Telefone para contato com a escola (ou Direção)' maxLength={12}/>
                </div>

                <fieldset>
                    <p>Segmentos</p>

                    {[{tipo: "Creche", num: 0},
                        {tipo: "Pré-escolar", num: 1},
                        {tipo: "Fund. 1 - Do 1º ao 5º ano", num: 2},
                        {tipo: "Fund. 2 - Do 6º ao 9º ano", num: 3},
                        {tipo: "EJA 1 - Do 1º ao 5º ano", num: 4},
                        {tipo: "EJA 2 - Do 6º ao 9º ano", num: 5}].map((num) => (
                        <div className="checkBox" key={num.num}>
                            <input type="checkbox" id={`ens_infantil${num.num}`} value={num.num} checked={segmentos.includes(num.num)} onChange={() => handleCheckboxChange(num.num)}/>
                            <label htmlFor={`ens_infantil${num.num}`}>{num.tipo}</label>
                        </div>
                    ))}
                </fieldset>

                <div className="inputBox">
                    <label htmlFor="uni_listada">A unidade será listada?</label>
                    <select name="uni_listada" defaultValue={Number(unidade.uni_listada)}>
                        <option value={0}>Não Listada</option>
                        <option value={1}>Listada</option>
                    </select>
                </div>

                <input type="submit" value="Registrar alterações" />
            </form>
        </>
    )
}

ModalUnidadeEditor.propTypes = {
    unidade: PropTypes.object,
    setPaginaAreaUnidades: PropTypes.func
}

export default ModalUnidadeEditor;