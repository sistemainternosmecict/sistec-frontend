import { useContext, useEffect, useState } from "react";
import { HostContext } from "../../../HostContext";
import "./style.scss";

async function obter_categorias(host){
    const route = "/api/categorias_dispositivos/listar"
    const result = await fetch(host+route);
    const retorno = await result.json();
    return retorno
}

async function fetchAll(hostUrl, setCategorias){
    const lista = await obter_categorias(hostUrl)
    setCategorias(lista)
}

function listar( categorias ){
    const rows = categorias.map((categoria, idx) => {
        return <tr key={idx}>
            <td>{categoria.cat_disp_id}</td>
            <td>{categoria.cat_disp_nome}</td>
            <td>{categoria.cat_disp_tipo}</td>
        </tr>
    })

    const listao = <>
        <thead>
            <tr>
                <td>ID</td>
                <td>Nome</td>
                <td>Tipo</td>
            </tr>
        </thead>

        <tbody>
            {rows}
        </tbody>
    </>

    return listao
}

function CategoriasDispositivos(){
    const { hostUrl } = useContext(HostContext)
    const [categorias, setCategorias] = useState([])

    useEffect( ()=> {
        fetchAll(hostUrl, setCategorias)
    },[hostUrl])

    return (
        <>
            <h2 className="catDispTitulo">Categorias de dispositivos</h2>
            <table>
                {listar(categorias)}
            </table>
        </>
    )
}

export default CategoriasDispositivos;