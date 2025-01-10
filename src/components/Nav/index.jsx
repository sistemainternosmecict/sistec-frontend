import { useState } from 'react'
import ButtonBase from '../ButtonBase'
import PropTypes from 'prop-types'
import './style.scss';

async function logout(e, host, setLoggedIn, setUsuario){
    e.preventDefault()
    const route = "/api/usuarios/auth/logout"
    await fetch(host+route);
    setUsuario({})
    setLoggedIn(false)
}

function Nav({ host, setLoggedIn, setUsuario, setPage, pageText, usuario, mobile, setPaginaSecUsuario, setModalUsuariosAberto, setPaginaAreaDemandas }){
    const [menuOpen, setMenuOpen] = useState(false)

    return (
        <>
            <nav>
                <div>
                    <ButtonBase text="Menu" func={{setMenuOpen:setMenuOpen}} page_number={0}/>
                    <p>{pageText}</p>
                </div>
                <div className='usuario'>

                    <div className="userWrapp">
                        <p>{usuario.usuario_matricula + " - " + usuario.usuario_nome}</p>
                        <p className='acesso'>Acesso nível {usuario.usuario_tipo}</p>
                    </div>
                    <button onClick={(e) => logout(e, host, setLoggedIn, setUsuario)}>Sair</button>
                </div>
            </nav>

            <div className={`slideMenu ${(menuOpen) ? "" : "fechado"}`}>
                <h1>SISTEC</h1>
                <ul>
                    <li>
                        <button onClick={() => {setPage({pageN: 0, pageT: ""}); setMenuOpen(false)}}>Inicio</button>

                        <>
                        {(mobile)
                        ? <>
                        <div className="btnGroup">
                            <button onClick={() => {
                                setPage({pageN: 1, pageT: "Área de Usuários"})
                                setPaginaSecUsuario(0)
                                setModalUsuariosAberto(false)
                                setMenuOpen(false)
                            }}>Todos os usuários</button>
                            <button onClick={() => {
                                setPage({pageN: 1, pageT: "Área de Usuários"})
                                setPaginaSecUsuario(1)
                                setModalUsuariosAberto(false)
                                setMenuOpen(false)
                            }}>Cadastro de servidor</button>
                            <button onClick={() => {
                                setPage({pageN: 1, pageT: "Área de Usuários"})
                                setPaginaSecUsuario(4)
                                setModalUsuariosAberto(false)
                                setMenuOpen(false)
                            }}>Cadastro de não servidores</button>
                            <button onClick={() => {
                                setPage({pageN: 1, pageT: "Área de Usuários"})
                                setPaginaSecUsuario(2)
                                setMenuOpen(false)
                            }}>Níveis de acesso</button>
                            <button onClick={() => {
                                setPage({pageN: 1, pageT: "Área de Usuários"})
                                setPaginaSecUsuario(3)
                                setMenuOpen(false)
                            }}>Permissões do sistema</button>
                            <button onClick={() => {
                                setPage({pageN: 2, pageT: "Área de Demandas"})
                                setPaginaAreaDemandas(0)
                                setMenuOpen(false)
                            }}>Listagem de demandas</button>
                            <button onClick={() => {
                                setPage({pageN: 2, pageT: "Área de Demandas"})
                                setPaginaAreaDemandas(2)
                                setMenuOpen(false)
                            }}>Arquivo de demandas</button>
                            <button onClick={() => {
                                setPage({pageN: 2, pageT: "Área de Demandas"})
                                setPaginaAreaDemandas(3)
                                setMenuOpen(false)
                                }}>Criar nova demanda</button>
                        </div>
                        </>
                        : <>
                            <button onClick={() => {setPage({pageN: 1, pageT: "Área de Usuários"}), setMenuOpen(false)}}>Usuários</button>
                            <button onClick={() => {setPage({pageN: 2, pageT: "Área de Demandas"}), setMenuOpen(false)}}>Demandas</button>
                        </>
                        }

                        
                        </>
                        
                    </li>
                </ul>
                <button className='fechar' onClick={() => setMenuOpen(!menuOpen)}>X</button>
            </div>
        </>
    )
}

Nav.propTypes = {
    host: PropTypes.string.isRequired,
    setLoggedIn: PropTypes.func.isRequired,
    setUsuario: PropTypes.func.isRequired,
    setPage: PropTypes.func.isRequired,
    pageText: PropTypes.string.isRequired,
    usuario: PropTypes.object,
    mobile: PropTypes.bool,
    setPaginaSecUsuario: PropTypes.func,
    setModalUsuariosAberto: PropTypes.func,
    setPaginaAreaDemandas: PropTypes.func

}

export default Nav;