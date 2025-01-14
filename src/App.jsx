import { useEffect, useRef, useState } from 'react'
import { useHost } from './HostContext'
import Login from "./components/Login"
import Home from "./components/Home"
import CriarDemanda from './components/areaDeDemandas/CriarDemanda'
import './App.scss';

// async function obterPermissoesDaAPI(host) {
//   const route = "/api/permissoes/listar";
//   const result = await fetch(host + route);
//   const retorno = await result.json();
//   return retorno;
// }

async function obterRapDaAPI(host) {
  const route = "/api/rap/listar";
  const result = await fetch(host + route);
  const retorno = await result.json();
  return retorno['resultados'];
}

async function obterNiveisDeAcessoDaAPI(host) {
  const route = "/api/niveis_acesso/listar";
  const result = await fetch(host + route);
  const retorno = await result.json();
  return retorno;
}

function resolve_user_type( data, fetchData ){
  let acesso = data.usuario.usuario_tipo
  let rapPermissao = []
  
  if(fetchData.niveisDeAcesso.current && fetchData.rap.current){

    for( const nivel of fetchData.niveisDeAcesso.current){
      if( nivel.nva_id === acesso){
        for( const rapTemp of fetchData.rap.current){
          if( rapTemp.rap_acesso_id === acesso && rapTemp.rap_ativo){
            rapPermissao.push(rapTemp)
          }
        }

        if(data.usuario.usuario_ativo && acesso === 10){
          return <div className='wrapper'>
            <CriarDemanda usuario={data.usuario} setLoggedIn={data.setLoggedIn} setUsuario={data.setUsuario}/>
          </div>
        }

        if(data.usuario.usuario_ativo && acesso === 1){
          return <div className='wrapper'>
              <Home usuario={data.usuario} setUsuario={data.setUsuario} setLoggedIn={data.setLoggedIn} rapPermissao={rapPermissao}/>
            </div>
        }
      }
    }
  }

  return <div className='wrapper_login'>
    <Login setUsuario={data.setUsuario} setLoggedIn={data.setLoggedIn}/>
  </div>

  }

function App() {
  const [loggedIn, setLoggedIn] = useState(false)
  const [usuario, setUsuario] = useState({})
  const niveisDeAcesso = useRef(undefined);
  const rap = useRef(undefined);
  const host = useHost();

  useEffect(() => {
    const carregarNiveis = async () => {
      try {
        niveisDeAcesso.current = await obterNiveisDeAcessoDaAPI(host.hostUrl)
        rap.current = await obterRapDaAPI(host.hostUrl)
      } catch {
        console.log("Erro ao carregar.")
      }
    }
    carregarNiveis()
  }, [host])

  return (<>
        {resolve_user_type({loggedIn, setUsuario, setLoggedIn, usuario}, {niveisDeAcesso: niveisDeAcesso, rap: rap})}
  </>
  )
}

export default App
