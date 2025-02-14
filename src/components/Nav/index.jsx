import { useEffect, useRef, useState } from 'react'
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

function Nav({ host, 
    setLoggedIn, 
    setUsuario, 
    setPage, 
    pageText, 
    usuario, 
    mobile, 
    setPaginaSecUsuario, 
    setModalUsuariosAberto, 
    setPaginaAreaDemandas, 
    rapPermissao,
    areaDispControl }){
    const [menuOpen, setMenuOpen] = useState(false)
    const openAreas = useRef([])

    useEffect(() => {
        if(rapPermissao){
            openAreas.current = rapPermissao.map( rap => {
                return rap.rap_perm_id
            })
        }
    }, [rapPermissao])

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
                        <button onClick={() => {
                            setPage({pageN: 0, pageT: ""}); setMenuOpen(false),
                            setPaginaAreaDemandas(0)
                            }}>Inicio</button>

                        <>
                        {(mobile)
                        ? <>
                        <div className="btnGroup">
                            
                            {(openAreas.current.find( perm => perm === 1))
                            ? <div className='btnBlock'>
                                <p>Usuarios</p>
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
                            </div> : <></>}

                            {(openAreas.current.find( perm => perm === 6))
                            ? <div className='btnBlock'>
                                <p>Demandas</p>
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
                            </div> : <></>}

                            {(openAreas.current.find( perm => perm === 6))
                            ? <div className='btnBlock'>
                                <p>Dispositivos</p>
                                <button onClick={() => {
                                    setPage({pageN: 3, pageT: "Área de Dispositivos"})
                                    areaDispControl.setPaginaAreaDispositivos(0)
                                    setMenuOpen(false)
                                }}>Categorias de disp.</button>
                                <button onClick={() => {
                                    setPage({pageN: 3, pageT: "Área de Dispositivos"})
                                    areaDispControl.setPaginaAreaDispositivos(1)
                                    setMenuOpen(false)
                                }}>Nova categoria de disp.</button>
                                <button onClick={() => {
                                    setPage({pageN: 3, pageT: "Área de Dispositivos"})
                                    areaDispControl.setPaginaAreaDispositivos(2)
                                    setMenuOpen(false)
                                }}>Dispositivos</button>
                                <button onClick={() => {
                                    setPage({pageN: 3, pageT: "Área de Dispositivos"})
                                    areaDispControl.setPaginaAreaDispositivos(3)
                                    setMenuOpen(false)
                                }}>Novo dispositivo</button>
                            </div> : <></>}

                            <button onClick={() => {setPage({pageN: 5, pageT: "Área de Documentos"}), setMenuOpen(false)}}>Documentos</button>
                            
                        </div>
                        </>
                        : <>
                            {(openAreas.current.find( perm => perm === 1)) ? <button onClick={() => {setPage({pageN: 1, pageT: "Área de Usuários"}), setMenuOpen(false)}}>Usuários</button> : <></>}
                            {(openAreas.current.find( perm => perm === 6)) ? <button onClick={() => {setPage({pageN: 2, pageT: "Área de Demandas"}), setMenuOpen(false)}}>Demandas</button> : <></>}
                            {(openAreas.current.find( perm => perm === 6)) ? <button onClick={() => {setPage({pageN: 3, pageT: "Área de Dispositivos"}), setMenuOpen(false)}}>Dispositivos</button> : <></>}
                            {<button onClick={() => {setPage({pageN: 5, pageT: "Área de Documentos"}), setMenuOpen(false)}}>Documentos</button>}
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
    setPaginaAreaDemandas: PropTypes.func,
    rapPermissao: PropTypes.array,
    areaDispControl: PropTypes.object
}

export default Nav;