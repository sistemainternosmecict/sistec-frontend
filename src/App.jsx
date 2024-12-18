import { useState } from 'react'
import { HostProvider } from './HostContext'
import Login from "./components/Login"
import Home from "./components/Home"
import CriarDemanda from './components/areaDeDemandas/CriarDemanda'
import './App.scss';

function resolve_user_type( data ){
  switch(data.usuario.usuario_tipo){
    case 1:
      if(data.usuario.usuario_ativo){
        return <div className='wrapper'>
            <Home usuario={data.usuario} setUsuario={data.setUsuario} setLoggedIn={data.setLoggedIn}/>
          </div>
      } else {
        return "usuario inativo"
      }
    case 10:
      if(data.usuario.usuario_ativo){
        return <div className='wrapper'>
          <CriarDemanda usuario={data.usuario} setLoggedIn={data.setLoggedIn} setUsuario={data.setUsuario}/>
        </div>
      } else {
        return "usuario inativo"
      }
    default:
        return <div className='wrapper_login'>
          <Login setUsuario={data.setUsuario} setLoggedIn={data.setLoggedIn}/>
        </div>
  }
}

function App() {
  // const [pgInicial, setPgInicial] = useState(true)
  const [loggedIn, setLoggedIn] = useState(false)
  const [usuario, setUsuario] = useState({})

  return (
    <HostProvider>
          {resolve_user_type({loggedIn, setUsuario, setLoggedIn, usuario})}
    </HostProvider>
  )
}

export default App
