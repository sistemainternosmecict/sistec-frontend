import PropTypes from 'prop-types'

function Usuario({ usuario }){
    return (
        <>
        <td>{usuario.usuario_matricula}</td>
        <td>{usuario.usuario_nome}</td>
        {(window.innerWidth <= 600) ? <></> : <td>{usuario.usuario_local}</td>}
        <td>{(usuario.usuario_ativo) ? "Sim" : "Não"}</td>
        </>
    )
}

Usuario.propTypes = {
    usuario: PropTypes.object
}

export default Usuario;