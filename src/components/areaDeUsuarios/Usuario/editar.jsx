import PropTypes from 'prop-types'
import { useEffect, useState, useContext } from 'react'
import { HostContext } from '../../../HostContext';

async function enviarAtualização(dados, host, setProcessando, usuario, setUsuarioLocal){
    const route = "/api/usuarios/atualizar"
    const options = {
      method: "POST",
      body: JSON.stringify(dados),
      headers: {"Content-Type":"application/json"}
    };
    const result = await fetch(host+route, options);
    const retorno = await result.json();
    console.log(retorno)
    if(retorno){
        setProcessando(false)
        setUsuarioLocal({...usuario, usuario_ativo: !usuario.usuario_ativo, ...dados})
    } 
     
}

function prepararAtualizacao(e, setConfirmado, setDadosParaEnvio, ativadoEstado) {
    e.preventDefault()
    const campos = e.target.elements
    const usuarioTemp = {
        usuario_id: Number(campos.usuario_id.value),
        usuario_matricula: campos.usuario_matricula.value,
        usuario_nome: campos.usuario_nome.value,
        usuario_funcao: campos.usuario_funcao.value,
        usuario_sala: campos.usuario_sala.value,
        usuario_email: campos.usuario_email.value,
        usuario_telefone: Number(campos.usuario_telefone.value),
        usuario_ativo: ativadoEstado
    }

    setConfirmado(false)
    setDadosParaEnvio(usuarioTemp)

}

function Editar({ usuario, setEditar, setUsuarioLocal, setProcessando }){
    const [confirmado, setConfirmado] = useState(undefined)
    const [dadosParaEnvio, setDadosParaEnvio] = useState(undefined)
    const [ativadoEstado, setAtivadoEstado] = useState(usuario.usuario_ativo)
    const { hostUrl } = useContext(HostContext)
    

    useEffect(() => {
        if(confirmado === true){
            enviarAtualização(dadosParaEnvio, hostUrl, setProcessando, usuario, setUsuarioLocal)
            setConfirmado(undefined)
            setEditar(false)
            setProcessando(true)
        }
    }, [confirmado, dadosParaEnvio, setEditar, hostUrl, setUsuarioLocal, usuario, setProcessando])

    return (
        <>
        {(confirmado !== undefined) ? 
            <>
                <div className='usuario_card_edicao_alert'>
                    <h3>Deseja realmente atualizar os dados de {usuario.usuario_nome}?</h3>
                    <button onClick={() => setConfirmado(true)}>Confirmar</button>
                    <button onClick={() => setConfirmado(undefined)}>Cancelar</button>
                </div>
            </> : 
            <>
            <div className="usuario_card_edicao">
                <form onSubmit={(e) => prepararAtualizacao(e, setConfirmado, setDadosParaEnvio, ativadoEstado)} method="post">
                    <p>Matricula: {usuario.usuario_matricula} | ID: {usuario.usuario_id} | Cargo: {usuario.usuario_cargo}</p>
                    <p>Setor: {usuario.usuario_setor}</p>
                    <div className="blocs">
                        <input type="hidden" name='usuario_id' defaultValue={usuario.usuario_id} />
                        <input type="hidden" name='usuario_matricula' defaultValue={usuario.usuario_matricula} />
                        <div className="blocBox">
                            <label htmlFor="usuario_nome">Nome:</label>
                            <input type="text" name='usuario_nome' defaultValue={usuario.usuario_nome} />
                        </div>
                        <div className="blocBox">
                            <label htmlFor="usuario_funcao">Função:</label>
                            <input type="text" name='usuario_funcao' defaultValue={usuario.usuario_funcao} />
                        </div>
                        <div className="blocBox">
                            <label htmlFor="usuario_sala">Sala:</label>
                            <input type="text" name='usuario_sala' defaultValue={usuario.usuario_sala} />
                        </div>
                        <div className="blocBox">
                            <label htmlFor="usuario_email">Email:</label>
                            <input type="text" name='usuario_email' defaultValue={usuario.usuario_email} />
                        </div>
                        <div className="blocBox">
                            <label htmlFor="usuario_telefone">Telefone:</label>
                            <input type="text" name='usuario_telefone' defaultValue={usuario.usuario_telefone} />
                        </div>
                        <div className="blocBox">
                            <label htmlFor="usuario_telefone">Usuário está ativo?</label>
                            <button onClick={(e) => {
                                e.preventDefault()
                                setAtivadoEstado(!ativadoEstado)
                            }} className='btn_card' name='ativo'>{(ativadoEstado) ? "Sim" : "Não"}</button>
                        </div>
                    </div>
                    <div className="btnBox">
                        <button onClick={() => setEditar(false)}>Voltar</button>
                        <input type="submit" value="Registrar alterações" />
                    </div>
                </form>
            </div>
            </>
        }</>
    )
}

Editar.propTypes = {
    usuario: PropTypes.object,
    setEditar: PropTypes.func,
    setUsuarioLocal: PropTypes.func,
    setProcessando: PropTypes.func
}

export default Editar;