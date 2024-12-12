import { useState } from 'react';
import PropTypes from 'prop-types'
import Editar from './editar';

function Usuario({ usuario }){
    const [editar, setEditar] = useState(false)
    const [usuarioLocal, setUsuarioLocal] = useState(usuario)
    const [processando, setProcessando] = useState(false)

    return (
        <>
        <td>{usuarioLocal.usuario_matricula}</td>
        <td>{usuarioLocal.usuario_nome}</td>
        <td>{usuarioLocal.usuario_local}</td>
        <td>{(usuarioLocal.usuario_ativo) ? "Sim" : "Não"}</td>
        </>
    )
}

Usuario.propTypes = {
    usuario: PropTypes.object
}

export default Usuario;