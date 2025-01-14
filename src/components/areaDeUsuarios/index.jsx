import { useState, useContext, useEffect, useRef } from 'react';
import ListagemUsuarios from './ListagemUsuario';
import CadastroUsuario from './CadastroUsuario';
import CadastroUsuarioSMatricula from './CadastroUsuarioSMatricula';
import NiveisDeAcesso from './NiveisDeAcesso';
import Permissoes from './Permissoes';
import Usuario from './Usuario';
import { HostContext } from '../../HostContext';
import PropTypes from 'prop-types';
import './style.scss'

function obterUsuarioAtual( e, setUsuarioModal, setModalUsuariosAberto ){
    const usuario_temp = JSON.parse(e.target.parentNode.dataset.usuario)
    setUsuarioModal(usuario_temp)
    setModalUsuariosAberto(true)
}

async function obterNiveisDeAcessoDaAPI(host) {
    const route = "/api/niveis_acesso/listar";
    const result = await fetch(host + route);
    const retorno = await result.json();
    return retorno;
}

async function obter_usuarios(host){
    const route = "/api/usuarios/listar"
    const result = await fetch(host+route);
    const retorno = await result.json();
    return retorno
}

function carregarSecao( pg, tipoDeArea, elements, nivelSelecionado, setNivelSelecionado ) {
    switch(pg){
        case 0:
            return <ListagemUsuarios elements={elements} />
        case 1:
            return <CadastroUsuario tipoDeArea={tipoDeArea} />
        case 2:
            return <NiveisDeAcesso nivelSelecionado={nivelSelecionado} setNivelSelecionado={setNivelSelecionado}/>
        case 3:
            return <Permissoes />
        case 4:
            return <CadastroUsuarioSMatricula tipoDeArea={tipoDeArea} />
    }
}

function obterNvlAcesso( nvl ){
    switch(nvl){
        case 10:
            return "Não tem acesso interno"
        case 8:
            return "Estagiário(a)"
        case 7:
            return "Diretor(a)"
        case 6:
            return "Agente tec"
        case 5:
            return "Relatórios"
        case 4:
            return "Unidade"
        case 3:
            return "CPD"
        case 2:
            return "Adm"
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

async function fetchData(hostUrl, setUsuarios, niveisDeAcesso) {
    const data = await obter_usuarios(hostUrl)
    const niveis = await obterNiveisDeAcessoDaAPI(hostUrl)
    if(data.usuarios){
        setUsuarios(data.usuarios)
    }

    if(niveis){
        niveisDeAcesso.current = niveis
    }
}

function AreaDeUsuarios({ setModalUsuariosAberto, setPaginaSecUsuario, paginaSecUsuario, modalUsuariosAberto }) {

    const tipoDeArea = "interna"
    const { hostUrl } = useContext(HostContext)
    const [usuarios, setUsuarios] = useState([])
    const blocs = useRef([])
    const [usuarioModal, setUsuarioModal] = useState(undefined)
    const [editando, setEditando] = useState(false)
    const niveisDeAcesso = useRef([]);
    const [nivelSelecionado, setNivelSelecionado] = useState(undefined);

    useEffect(() => {
        fetchData(hostUrl, setUsuarios, niveisDeAcesso)
    }, [hostUrl])

    useEffect(() => {
        if(usuarios.length > 0){
            const lista = usuarios.map((usuario, index) => (
                <tr className={(usuario.usuario_ativo) ? "usuarioAtivo" : "usuarioInativo"} key={index} data-usuario={JSON.stringify(usuario)} onClick={(e)=> obterUsuarioAtual(e, setUsuarioModal, setModalUsuariosAberto)}>
                    <Usuario usuario={usuario}/>
                </tr>
            ))
        
            const listao = <table id="usuarios">
                <thead>
                    <tr>
                        <td>Matricula</td>
                        <td>Nome</td>
                        {(window.innerWidth <= 600) ? <></> : <td>Local de trabalho</td>}
                        <td>Ativo</td>
                    </tr>
                </thead>
                <tbody>
                    {lista}
                </tbody>
            </table>
        
            blocs.current = listao
        }
    }, [usuarios, setModalUsuariosAberto])
    
    return (
        <>
            <section>

                <aside className='menuAreaUsuarios'>
                    <div className="btnGroup">
                        <button onClick={() => {
                            setPaginaSecUsuario(0)
                            setModalUsuariosAberto(false)
                        }}>Todos os usuários</button>
                        <button onClick={() => {
                            setPaginaSecUsuario(1)
                            setModalUsuariosAberto(false)
                        }}>Cadastro de servidor</button>
                        <button onClick={() => {
                            setPaginaSecUsuario(4)
                            setModalUsuariosAberto(false)
                        }}>Cadastro de não servidores</button>
                        <button onClick={() => {
                            setPaginaSecUsuario(2)
                            setNivelSelecionado(undefined)
                            }}>Níveis de acesso</button>
                        <button onClick={() => {
                            setPaginaSecUsuario(3)
                            }}>Permissões</button>
                    </div>
                </aside>

                <main>

                {carregarSecao(paginaSecUsuario, tipoDeArea, blocs, nivelSelecionado, setNivelSelecionado)}

                {(modalUsuariosAberto) ? <section className='modal'>
                    <div className="display">
                    {(!editando) ?
                        <div className="dados">
                            <p id='head'><span>ID:</span> {usuarioModal.usuario_id} <span>|</span> <span>Matrícula:</span> {usuarioModal.usuario_matricula} <span>|</span> <span>CPF:</span> {usuarioModal.usuario_cpf} <button className='fechar' onClick={() => {
                                setModalUsuariosAberto(false)
                                setEditando(false)
                                }}>X</button></p>
                            
                            <div className="subDiv">
                                <div className="mobileData">
                                    <p><span>ID:</span> {usuarioModal.usuario_id} </p>
                                    <p><span>Matrícula:</span> {usuarioModal.usuario_matricula} </p>
                                    <p><span>CPF:</span> {usuarioModal.usuario_cpf} </p>
                                </div>
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
                                    setModalUsuariosAberto(false)
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
                                        {niveisDeAcesso.current.map((nivel, idx)=> {
                                            return <option key={idx} value={nivel.nva_id}>{nivel.nva_nome}</option>
                                        })}
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
                                    setModalUsuariosAberto(false)
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

AreaDeUsuarios.propTypes = {
    setModalUsuariosAberto: PropTypes.func,
    setPaginaSecUsuario: PropTypes.func,
    paginaSecUsuario: PropTypes.number,
    modalUsuariosAberto: PropTypes.bool
}

export default AreaDeUsuarios;