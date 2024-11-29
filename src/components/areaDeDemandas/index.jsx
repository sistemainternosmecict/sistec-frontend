import { useState, useContext, useEffect } from 'react';
import { HostContext } from '../../HostContext';
import ListagemEntrada from './ListagemEntrada';
import './style.scss'

async function obter_demandas(host){
    const route = "/api/demandas/listar"
    const result = await fetch(host+route);
    const retorno = await result.json();
    return retorno
}

function carregarSecao( pg, demandas ) {
    switch(pg){
        // case 1:
        //     return <CadastroUsuario tipoDeArea={tipoDeArea} />
        // case 2:
        //     return <NiveisDeAcesso />
        default:
            return <ListagemEntrada demandas={demandas} />
            // return <ListagemDemandas demandas={demandas} />
    }
}

function AreaDeDemandas() {
    const tipoDeArea = "interna"
    const [pagina, setPagina] = useState(0)
    const { hostUrl } = useContext(HostContext)
    const [demandas, setDemandas] = useState([])

    useEffect(() => {
        async function fetchData() {
            const data = await obter_demandas(hostUrl)
            setDemandas(data.demandas || [])
        }
        fetchData()
    }, [hostUrl])
    
    return (
        <section>
            <aside className='menuAreaDemandas'>
                <div className="btnGroup">
                    <button onClick={() => setPagina(0)}>Entrada</button>
                    <button onClick={() => setPagina(1)}>Atendimento</button>
                    <button onClick={() => setPagina(2)}>Arquivo</button>
                    <button onClick={() => setPagina(3)}>Criar demanda</button>
                    {/* <button onClick={() => setPagina(2)}>Níveis de acesso</button> */}
                </div>
            </aside>
            <main>
                {carregarSecao(pagina, demandas)}
            </main>
        </section>
    )
}

export default AreaDeDemandas;