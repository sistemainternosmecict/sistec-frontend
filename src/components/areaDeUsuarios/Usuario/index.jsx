import { useState } from 'react';
import PropTypes from 'prop-types'
import Editar from './editar';

function Usuario({ usuario }){
    const [editar, setEditar] = useState(false)
    const [usuarioLocal, setUsuarioLocal] = useState(usuario)
    const [processando, setProcessando] = useState(false)

    return (
        <div className={`usuario_card ${(usuarioLocal.usuario_ativo) ? "ativo" : "inativo"}`}>
            {(!editar) ?
            <>
                {(!processando) ? <>
                <p><span>Matrícula: </span> { usuarioLocal.usuario_matricula } | <span>ID: </span> { usuarioLocal.usuario_id }</p>
                <p><span>Setor: </span> { usuarioLocal.usuario_setor } </p>
                <p><span>Cargo: </span> { usuarioLocal.usuario_cargo } </p>
                <p><span>Nome: </span> { usuarioLocal.usuario_nome } </p>
                <p><span>Função: </span> { usuarioLocal.usuario_funcao } </p>
                <p><span>Sala: </span> { usuarioLocal.usuario_sala } </p>
                <p><span>CPF: </span> { usuarioLocal.usuario_cpf } </p>
                <p><span>Email: </span> { usuarioLocal.usuario_email } </p>
                <p><span>Telefone: </span> { usuarioLocal.usuario_telefone } </p>
                <p><span>Vinculo: </span> { usuarioLocal.usuario_vinculo } </p>
                <button onClick={() => setEditar(true)} className='btn_card'>Editar usuario</button>
                {(usuarioLocal.usuario_ativo) ? "" : <p className='labelDesativado'>Usuário desativado</p>}
                </> : <>Processando...</>}
            </> : <>
                <Editar usuario={usuarioLocal} setEditar={setEditar} setUsuarioLocal={setUsuarioLocal} setProcessando={setProcessando}/>
                {/* <button onClick={() => setEditar(false)} className='btn_card'>Voltar</button> */}
            </>}
        </div>
    )
}

Usuario.propTypes = {
    usuario: PropTypes.object
}

export default Usuario;