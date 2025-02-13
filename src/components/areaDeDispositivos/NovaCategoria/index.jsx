import { useContext, useState } from "react";
import { HostContext } from "../../../HostContext";
import PropTypes from "prop-types";
import "./style.scss"

async function enviarRegistro(host, newData, setRegistrado, areaDispControl){
    const route = "/api/categorias_dispositivos/registrar"
    const options = {
      method: "POST",
      body: JSON.stringify(newData),
      headers: {"Content-Type":"application/json"}
    };
    const result = await fetch(host+route, options);
    const retorno = await result.json();
    if(retorno.created){
        setRegistrado(true)
        setTimeout(() => areaDispControl.setPaginaAreaDispositivos(0), 3000)  
    } 
}

function stageData( e, hostUrl, setRegistrado, areaDispControl ){
    e.preventDefault()

    const form = e.target
    const inputs = form.elements

    const newData = {
        cat_disp_nome: inputs.nome.value,
        cat_disp_modelo: inputs.modelo.value,
        cat_disp_tipo: inputs.tipo.value,
        cat_disp_desc: inputs.desc.value
    }

    enviarRegistro( hostUrl, newData, setRegistrado, areaDispControl)
}

function NovaCategoria({ areaDispControl }){
    const { hostUrl } = useContext(HostContext)
    const [registrado, setRegistrado] = useState(false)

    return (
        <>
            <h2 className="novaCatTitulo">Nova categoria</h2>

            {(!registrado)
            ? <form onSubmit={(e) => stageData(e, hostUrl, setRegistrado, areaDispControl)}>
                <div className="inputBox">
                    <label htmlFor="nome">Nome da nova categoria: </label>
                    <input type="text" name="nome" id="nome" placeholder="Nome..."/>
                </div>
                <div className="inputBox">
                    <label htmlFor="modelo">Nodelo da nova categoria: </label>
                    <input type="text" name="modelo" id="modelo" placeholder="Modelo..."/>
                </div>
                <div className="inputBox">
                    <label htmlFor="tipo">Tipo da nova categoria: </label>
                    <input type="text" name="tipo" id="tipo" placeholder="Tipo..."/>
                </div>
                <div className="inputBox">
                    <label htmlFor="desc">Descrição da nova categoria: </label>
                    <textarea name="desc" id="desc" placeholder="Descrição..."></textarea>
                </div>

                <input type="submit" value="Registrar categoria" />
            </form>
            : <>
            <p>Nova categoria registrada!</p>
            </>}
        </>
    )
}

NovaCategoria.propTypes = {
    areaDispControl: PropTypes.object
}

export default NovaCategoria;