import { useState, useContext, useEffect, useRef } from 'react';
import ListagemUsuarios from './ListagemUsuario';
import CadastroUsuario from './CadastroUsuario';
import CadastroUsuarioSMatricula from './CadastroUsuarioSMatricula';
import NiveisDeAcesso from './NiveisDeAcesso';
import Usuario from './Usuario';
import { HostContext } from '../../HostContext';
import './style.scss'

function obterUsuarioAtual( e, setUsuarioModal, setModalAberto ){
    const usuario_temp = JSON.parse(e.target.parentNode.dataset.usuario)
    setUsuarioModal(usuario_temp)
    setModalAberto(true)
}

async function obter_usuarios(host){
    const route = "/api/usuarios/listar"
    const result = await fetch(host+route);
    const retorno = await result.json();
    return retorno
}

function carregarSecao( pg, tipoDeArea, elements ) {
    switch(pg){
        case 0:
            return <ListagemUsuarios elements={elements} />
        case 1:
            return <CadastroUsuario tipoDeArea={tipoDeArea} />
        case 2:
            return <NiveisDeAcesso />
        case 3:
            return <CadastroUsuarioSMatricula tipoDeArea={tipoDeArea} />
    }
}

function obterNvlAcesso( nvl ){
    switch(nvl){
        case 10:
            return "Não tem acesso interno"
        case 1:
            return "Root"
    }
}

async function fetchAtualizar( host, dados, setUsuarios ){
    const route = "/api/usuarios/atualizar"
    const options = {
        method: "POST",
        body: JSON.stringify(dados),
        headers: {"Content-Type":"application/json"}
      };
    const result = await fetch(host+route, options);
    const retorno = await result.json();
    if(retorno.atualizado){
        fetchData(host, setUsuarios)
    }
}

function registrarMudancas( hostUrl, setUsuarios ){
    const campos = document.querySelectorAll(".campo")
    const dados = {
        usuario_matricula: campos[0].value,
        usuario_cpf: Number(campos[1].value),
        usuario_vinculo: campos[2].value,
        usuario_nome: campos[3].value,
        usuario_cargo: campos[4].value,
        usuario_funcao: campos[5].value,
        usuario_local: campos[6].value,
        usuario_setor: campos[7].value,
        usuario_sala: campos[8].value,
        usuario_email: campos[9].value,
        usuario_telefone: Number(campos[10].value),
        usuario_situacao_rh: campos[11].value,
        usuario_tipo: Number(campos[12].value),
        usuario_id: Number(campos[13].value),
        usuario_ativo: Boolean(Number(campos[14].value)),
    }

    fetchAtualizar( hostUrl, dados, setUsuarios )
}

async function fetchData(hostUrl, setUsuarios) {
    const data = await obter_usuarios(hostUrl)
    if(data.usuarios){
        setUsuarios(data.usuarios)
    }
}

function AreaDeUsuarios() {
    const tipoDeArea = "interna"
    const [pagina, setPagina] = useState(0)
    const { hostUrl } = useContext(HostContext)
    const [usuarios, setUsuarios] = useState([])
    const blocs = useRef([])
    const [usuarioModal, setUsuarioModal] = useState(undefined)
    const [modalAberto, setModalAberto] = useState(false)
    const [editando, setEditando] = useState(false)

    useEffect(() => {
        fetchData(hostUrl, setUsuarios)
    }, [hostUrl])

    useEffect(() => {
        if(usuarios.length > 0){
            const lista = usuarios.map((usuario, index) => (
                <tr className={(usuario.usuario_ativo) ? "usuarioAtivo" : "usuarioInativo"} key={index} data-usuario={JSON.stringify(usuario)} onClick={(e)=> obterUsuarioAtual(e, setUsuarioModal, setModalAberto)}>
                    <Usuario usuario={usuario}/>
                </tr>
            ))
        
            const listao = <table id="usuarios">
                <thead>
                    <tr>
                        <td>Matricula</td>
                        <td>Nome</td>
                        <td>Local de trabalho</td>
                        <td>Ativo</td>
                    </tr>
                </thead>
                <tbody>
                    {lista}
                </tbody>
            </table>
        
            blocs.current = listao
        }
    }, [usuarios])
    
    return (
        <>
            <section>
                <aside className='menuAreaUsuarios'>
                    <div className="btnGroup">
                        <button onClick={() => {
                            setPagina(0)
                            setModalAberto(false)
                        }}>Todos os usuários</button>
                        <button onClick={() => {
                            setPagina(1)
                            setModalAberto(false)
                        }}>Cadastro de servidor</button>
                        {/* <button onClick={() => setPagina(2)}>Níveis de acesso</button> */}
                        <button onClick={() => {
                            setPagina(3)
                            setModalAberto(false)
                            }}>Cadastro de não servidores</button>
                    </div>
                </aside>
                <main>
                {carregarSecao(pagina, tipoDeArea, blocs)}
                {(modalAberto) ? <section className='modal'>
                    <div className="display">
                    {(!editando) ?
                        <div className="dados">
                            <p id='head'><span>ID:</span> {usuarioModal.usuario_id} <span>|</span> <span>Matrícula:</span> {usuarioModal.usuario_matricula} <span>|</span> <span>CPF:</span> {usuarioModal.usuario_cpf} <button className='fechar' onClick={() => {
                                setModalAberto(false)
                                setEditando(false)
                                }}>X</button></p>
                            
                            <div className="subDiv">
                                <p><span>Vínculo:</span> {usuarioModal.usuario_vinculo}</p>
                                <p><span>Nome:</span> {usuarioModal.usuario_nome}</p>
                                <p><span>Cargo:</span> {usuarioModal.usuario_cargo}</p>
                                <p><span>Função:</span> {usuarioModal.usuario_funcao}</p>
                                <p><span>Local de trabalho:</span> {usuarioModal.usuario_local}</p>
                                <p><span>Setor:</span> {usuarioModal.usuario_setor}</p>
                                <p><span>Sala:</span> {usuarioModal.usuario_sala}</p>
                                <p><span>Email:</span> {usuarioModal.usuario_email}</p>
                                <p><span>Telefone:</span> {usuarioModal.usuario_telefone}</p>
                                <p><span>Situação RH:</span> {usuarioModal.usuario_situacao_rh}</p>
                                <p><span>Nível de acesso:</span> {obterNvlAcesso(usuarioModal.usuario_tipo)}</p>
                                <p><span>Usuário ativo:</span> {(usuarioModal.usuario_ativo) ? "Sim" : "Não"}</p>
                            </div>

                            <button className='btnEditar' onClick={() => setEditando(true)}>Editar usuário</button>
                        </div> : <>
                            <div className="dados">
                                <p id='head'><span>ID:{usuarioModal.usuario_id}</span> <button className='fechar' onClick={() => {
                                    setModalAberto(false)
                                    setEditando(false)
                                    }}>X</button></p>
                                
                                <div className="subDiv">
                                    <p><span>Matrícula:</span> <input className='campo' type="text" defaultValue={usuarioModal.usuario_matricula} /></p>
                                    <p><span>CPF:</span> <input className='campo' type="text" defaultValue={usuarioModal.usuario_cpf} /></p>
                                    <p><span>Vínculo:</span> <input className='campo' type="text" defaultValue={usuarioModal.usuario_vinculo} /></p>
                                    <p><span>Nome:</span> <input className='campo' type="text" defaultValue={usuarioModal.usuario_nome} /></p>
                                    <p><span>Cargo:</span> <input className='campo' type="text" defaultValue={usuarioModal.usuario_cargo} /></p>
                                    <p><span>Função:</span> <input className='campo' type="text" defaultValue={usuarioModal.usuario_funcao} /></p>
                                    <p><span>Local de trabalho:</span> <input className='campo' type="text" defaultValue={usuarioModal.usuario_local} /></p>
                                    <p><span>Setor:</span> <input className='campo' type="text" defaultValue={usuarioModal.usuario_setor} /></p>
                                    <p><span>Sala:</span> <input className='campo' type="text" defaultValue={usuarioModal.usuario_sala} /></p>
                                    <p><span>Email:</span> <input className='campo' type="text" defaultValue={usuarioModal.usuario_email} /></p>
                                    <p><span>Telefone:</span> <input className='campo' type="text" defaultValue={usuarioModal.usuario_telefone} /></p>
                                    <p><span>Situação RH:</span> <input className='campo' type="text" defaultValue={usuarioModal.usuario_situacao_rh} disabled/></p>
                                    <p><span>Nível de acesso:</span> 
                                    <select className="campo" defaultValue={usuarioModal.usuario_tipo}>
                                        <option value="10">Sem acesso</option>
                                        <option value="9">Estagiário</option>
                                        <option value="7">Diretor</option>
                                        <option value="6">Agente tec</option>
                                        <option value="5">Relatórios</option>
                                        <option value="4">Unidade</option>
                                        <option value="3">CPD</option>
                                        <option value="2">Admin</option>
                                        <option value="1">Root</option>
                                    </select>
                                    <input className='campo' type="hidden" defaultValue={usuarioModal.usuario_id} />
                                    </p>
                                    <p><span>Usuário ativo:</span> 
                                    <select className='campo' defaultValue={Number(usuarioModal.usuario_ativo)}>
                                        <option value="1">Ativo</option>
                                        <option value="0">Inativo</option>
                                    </select>
                                    </p>
                                </div>
                                <button className='btnEditar' onClick={() => {
                                    registrarMudancas(hostUrl, setUsuarios)
                                    setEditando(false)
                                    setModalAberto(false)
                                    }}>Registrar mudanças</button>
                            </div>
                        </>}
                        
                    </div>
                </section> : <></>}
                </main>
            </section>
        </>
    )
}

export default AreaDeUsuarios;