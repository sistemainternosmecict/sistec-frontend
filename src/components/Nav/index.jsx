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

function Nav({ host, setLoggedIn, setUsuario, setPage, pageText, usuario }){
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
                        <button onClick={() => setPage({pageN: 0, pageT: "Inicio"})}>Inicio</button>
                        <button onClick={() => setPage({pageN: 1, pageT: "Área de Usuários"})}>Usuários</button>
                        <button onClick={() => setPage({pageN: 2, pageT: "Área de Demandas"})}>Demandas</button>
                        
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
}

export default Nav;