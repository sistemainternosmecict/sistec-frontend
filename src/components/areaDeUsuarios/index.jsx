import { useState, useContext, useEffect, useRef } from 'react';
import ListagemUsuarios from './ListagemUsuario';
import CadastroUsuario from './CadastroUsuario';
import CadastroUsuarioSMatricula from './CadastroUsuarioSMatricula';
import NiveisDeAcesso from './NiveisDeAcesso';
import Usuario from './Usuario';
import { HostContext } from '../../HostContext';
import './style.scss'

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

function AreaDeUsuarios() {
    const tipoDeArea = "interna"
    const [pagina, setPagina] = useState(0)
    const { hostUrl } = useContext(HostContext)
    const [usuarios, setUsuarios] = useState([])
    const blocs = useRef([])

    useEffect(() => {
        if(usuarios.length > 0){
            const lista = usuarios.map((usuario, index) => (
                <li key={index}>
                    <Usuario usuario={usuario}/>
                </li>
            ))
        
            const listao = <ul id="usuarios">
                {lista}
            </ul>
        
            blocs.current = listao
        }
    }, [usuarios])

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
                    <button onClick={() => setPagina(1)}>Cadastro de servidor</button>
                    {/* <button onClick={() => setPagina(2)}>Níveis de acesso</button> */}
                    <button onClick={() => setPagina(3)}>Cadastro de não servidores</button>
                </div>
            </aside>
            <main>
                {carregarSecao(pagina, tipoDeArea, blocs)}
            </main>
        </section>
    )
}

export default AreaDeUsuarios;