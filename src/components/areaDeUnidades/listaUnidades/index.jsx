import PropTypes from 'prop-types';
import { useEffect } from "react";
import { useContext, useState } from "react";
import { HostContext } from "../../../HostContext";

async function obter_unidades(host){
    const route = "/api/unidades/listar"
    const result = await fetch(host+route);
    const retorno = await result.json();
    return retorno
}

async function fetchData( hostUrl, setUnidades ){
    const dispData = await obter_unidades(hostUrl)
    setUnidades(dispData['unidades'])
}

function openUni(e, areaUnidadesControl, setUnidadeSelecionada){
    const data = JSON.parse(e.target.parentNode.dataset.unidade)
    setUnidadeSelecionada(data)
    areaUnidadesControl.setPaginaAreaUnidades(3)
}

function listar( unidades, areaUnidadesControl, setUnidadeSelecionada ){
    unidades.sort((a,b)=> a.uni_cod_ue - b.uni_cod_ue)

    const rows = unidades.map((unidade, idx) => {
        return <tr key={idx} data-unidade={JSON.stringify(unidade)} onClick={(e) => openUni(e, areaUnidadesControl, setUnidadeSelecionada)}>
            <td>{unidade.uni_cod_ue}</td>
            <td>{unidade.uni_designador_categoria + " " + unidade.uni_nome}</td>
        </tr>
    })

    const listao = <>
        <thead>
            <tr>
                <td>COD</td>
                <td>Unidade</td>
            </tr>
        </thead>

        <tbody>
            {rows}
        </tbody>
    </>


    return listao
}

function ListaUnidades({ areaUnidadesControl, setUnidadeSelecionada }){
    const { hostUrl } = useContext(HostContext)
    const [unidades, setUnidades] = useState([])

    useEffect(() => {
        fetchData( hostUrl, setUnidades )
    },[])

    return (
        <>
            <h2>Lista de unidades</h2>

            <table className="unidades">
                {listar(unidades, areaUnidadesControl, setUnidadeSelecionada)}
            </table>
        </>
    )
}

ListaUnidades.propTypes = {
    areaUnidadesControl: PropTypes.object,
    setUnidadeSelecionada: PropTypes.func
}

export default ListaUnidades