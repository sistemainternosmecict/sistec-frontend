import { useState, useContext, useEffect } from 'react';
import ListagemUsuarios from './ListagemUsuario';
import CadastroUsuario from './CadastroUsuario';
import NiveisDeAcesso from './NiveisDeAcesso';
import { HostContext } from '../../HostContext';
import './style.scss'

async function obter_usuarios(host){
    const route = "/api/usuarios/listar"
    const result = await fetch(host+route);
    const retorno = await result.json();
    return retorno
}

function carregarSecao( pg, tipoDeArea, usuarios ) {
    switch(pg){
        case 1:
            return <CadastroUsuario tipoDeArea={tipoDeArea} />
        case 2:
            return <NiveisDeAcesso />
        default:
            return <ListagemUsuarios usuarios={usuarios} />
    }
}

function AreaDeUsuarios() {
    const tipoDeArea = "interna"
    const [pagina, setPagina] = useState(0)
    const { hostUrl } = useContext(HostContext)
    const [usuarios, setUsuarios] = useState([])

    useEffect(() => {
        async function fetchData() {
            const data = await obter_usuarios(hostUrl)
            setUsuarios(data.usuarios || [])
        }
        fetchData()
    }, [hostUrl])
    
    return (
        <section>
            <aside className='menuAreaUsuarios'>
                <div className="btnGroup">
                    <button onClick={() => setPagina(0)}>Todos os usuários</button>
                    <button onClick={() => setPagina(1)}>Novo usuário</button>
                    {/* <button onClick={() => setPagina(2)}>Níveis de acesso</button> */}
                </div>
            </aside>
            <main>
                {carregarSecao(pagina, tipoDeArea, usuarios)}
            </main>
        </section>
    )
}

export default AreaDeUsuarios;