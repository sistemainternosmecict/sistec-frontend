import ButtonBase from '../ButtonBase'
import './style.scss';

async function logout(e, host, setLoggedIn, setUsuario){
    e.preventDefault()
    const route = "/api/usuarios/auth/logout"
    await fetch(host+route);
    setUsuario({})
    setLoggedIn(false)
}

function Nav({ host, setLoggedIn, setUsuario, setPage }){
    return (
        <>
            <nav>
                <ul>
                    <li>
                        <ButtonBase text="Menu" func={{setPage:setPage}} page_number={0}/>
                        <button onClick={(e) => logout(e, host, setLoggedIn, setUsuario)}>Sair</button>
                    </li>
                </ul>
            </nav>
        </>
    )
}

export default Nav;