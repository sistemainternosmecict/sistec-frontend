import { useEffect } from "react";
import { useContext, useState } from "react";
import { HostContext } from "../../../HostContext";
import PropTypes from "prop-types";
import "./style.scss";

async function enviarRegistro(host, newData, setRegistrado, areaDispControl){
    const route = "/api/dispositivos/registrar"
    const options = {
      method: "POST",
      body: JSON.stringify(newData),
      headers: {"Content-Type":"application/json"}
    };
    const result = await fetch(host+route, options);
    const retorno = await result.json();
    if(retorno.created){
        setRegistrado(true)
        setTimeout(() => areaDispControl.setPaginaAreaDispositivos(2), 3000)  
    } 
}

async function obter_categorias(host){
    const route = "/api/categorias_dispositivos/listar"
    const result = await fetch(host+route);
    const retorno = await result.json();
    return retorno
}

async function fetchData(hostUrl, setCategorias){
    const data = await obter_categorias(hostUrl)
    setCategorias(data)
}

function stageData( e, hostUrl, setRegistrado, areaDispControl ){
    e.preventDefault()

    const form = e.target
    const fields = form.elements

    const newData = {
        disp_serial: fields.serial.value,
        disp_tipo: Number(fields.categoria.value),
        disp_desc: fields.desc.value
    }
    
    enviarRegistro( hostUrl, newData, setRegistrado, areaDispControl)
}

function NovoDispositivo({ areaDispControl }){
    const { hostUrl } = useContext(HostContext)
    const [categorias, setCategorias] = useState([])
    const [registrado, setRegistrado] = useState(false)

    useEffect(() => {
        fetchData(hostUrl, setCategorias)
    }, [hostUrl])

    return (
        <>
            <h2 className="novoDispTitulo">Novo dispositivo</h2>

            {(!registrado)
            ? <form onSubmit={(e)=> stageData(e, hostUrl, setRegistrado, areaDispControl)}>
                <div className="inputBox">
                    <label htmlFor="serial">Numero de série (S/N): </label>
                    <input type="text" name="serial" id="serial" placeholder="Serial" />
                </div>

                <div className="inputBox">
                    <label htmlFor="categoria">Categoria de dispositivo</label>
                    <select name="categoria" id="categoria" defaultValue="-">
                        <option value="-" disabled>Selecione uma categoria</option>
                        {categorias.map((categoria, idx) => {
                            return <option key={idx} value={categoria.cat_disp_id}>{categoria.cat_disp_nome}</option>
                        })}
                    </select>
                </div>

                <div className="inputBox">
                    <label htmlFor="desc">Descrição/Observações</label>
                    <textarea name="desc" id="desc" placeholder="Descrição/observações"></textarea>
                </div>

                <input type="submit" value="Registrar dispositivo" />
            </form> : <>
                <p>Nova categoria registrada!</p>
            </>}
        </>
    )
}

NovoDispositivo.propTypes = {
    areaDispControl: PropTypes.object
}

export default NovoDispositivo;