import { useContext, useEffect, useState } from "react";
import { HostContext } from "../../../HostContext";
import PropTypes from "prop-types";

async function obter_categorias(host){
    const route = "/api/categorias_dispositivos/listar"
    const result = await fetch(host+route);
    const retorno = await result.json();
    return retorno
}

async function obter_dispositivos(host){
    const route = "/api/dispositivos/listar"
    const result = await fetch(host+route);
    const retorno = await result.json();
    return retorno
}

async function fetchData( hostUrl, setDispositivos, setCategorias ){
    const dispData = await obter_dispositivos(hostUrl)
    const categData = await obter_categorias(hostUrl)
    setDispositivos(dispData)
    setCategorias(categData)
}

function getCategory( disp_tipo, categorias ){
    let retorno = ""
    categorias.forEach((categoria) => {
        if(categoria.cat_disp_id === disp_tipo){
            retorno = categoria
        }
    })

    return retorno
}

function openDisp(e, areaDispControl, setSelectedDevice){
    const data = JSON.parse(e.target.parentNode.dataset.dispositivo)
    const {setPaginaAreaDispositivos} = areaDispControl
    setSelectedDevice(data)
    setPaginaAreaDispositivos(4)
}

function listar( dispositivos, categorias, areaDispControl, setSelectedDevice ){
    const rows = dispositivos.map((dispositivo, idx) => {
        const categoria = getCategory(dispositivo.disp_tipo, categorias)
        return <tr key={idx} data-dispositivo={JSON.stringify(dispositivo)} onClick={(e) => openDisp(e, areaDispControl, setSelectedDevice)}>
            <td>{dispositivo.disp_serial}</td>
            <td>{categoria.cat_disp_nome}</td>
            <td>{categoria.cat_disp_modelo}</td>
        </tr>
    })

    const listao = <>
        <thead>
            <tr>
                <td>SERIAL</td>
                <td>Dispositivo</td>
                <td>Modelo</td>
            </tr>
        </thead>

        <tbody>
            {rows}
        </tbody>
    </>

    return listao
}

function Dispositivos({ areaDispControl, setSelectedDevice }){
    const { hostUrl } = useContext(HostContext)
    const [dispositivos, setDispositivos] = useState([])
    const [categorias, setCategorias] = useState([])

    useEffect(() => {
        fetchData( hostUrl, setDispositivos, setCategorias )
    },[])

    return (
        <>
            <h2 className="titulo">Dispositivos</h2>
            <table className="dispositivos">
                {listar(dispositivos, categorias, areaDispControl, setSelectedDevice)}
            </table>
        </>
    )
}

Dispositivos.propTypes = {
    areaDispControl: PropTypes.object,
    setSelectedDevice: PropTypes.func
}

export default Dispositivos;