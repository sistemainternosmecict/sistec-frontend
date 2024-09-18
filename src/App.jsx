import { useState, useContext } from 'react'
import { HostProvider } from './HostContext'
import Login from "./components/Login"
import Home from "./components/Home"
import Inicio from './components/Inicio'
import './App.scss';

function App() {
  const [pgInicial, setPgInicial] = useState(true)
  const [loggedIn, setLoggedIn] = useState(false)
  const [usuario, setUsuario] = useState({})

  return (
    <HostProvider>
        {
        (loggedIn == true) && (usuario.colab_id) && (usuario.colab_ativo)
        ? <Home usuario={usuario} setUsuario={setUsuario} setLoggedIn={setLoggedIn}/> 
        : (pgInicial) 
        ? <Inicio setPgInicial={setPgInicial}/>
        : <Login setUsuario={setUsuario} setLoggedIn={setLoggedIn}/>
        }
    </HostProvider>
  )
}

export default App
