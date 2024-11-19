import { useState } from 'react';
import ListagemUsuarios from './ListagemUsuario';
import CadastroUsuario from './CadastroUsuario';
import NiveisDeAcesso from './NiveisDeAcesso';
import './style.scss'

function carregarSecao( pg, tipoDeArea ) {
    switch(pg){
        case 1:
            return <CadastroUsuario tipoDeArea={tipoDeArea} />
        case 2:
            return <NiveisDeAcesso />
        default:
            return <ListagemUsuarios />
    }
}

function AreaDeUsuarios() {
    const tipoDeArea = "interna"
    const [pagina, setPagina] = useState(0)
    
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
                {carregarSecao(pagina, tipoDeArea)}
            </main>
        </section>
    )
}

export default AreaDeUsuarios;