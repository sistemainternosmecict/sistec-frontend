import { useState, useContext } from 'react'
import { HostProvider } from './HostContext'
import Login from "./components/Login"
import Home from "./components/Home"
import CriarDemanda from './components/FormExterno'
import './App.scss';

function App() {
  const [pgInicial, setPgInicial] = useState(true)
  const [loggedIn, setLoggedIn] = useState(false)
  const [usuario, setUsuario] = useState({})
  const [tipo, setTipo] = useState(undefined)

  return (
    <HostProvider>
          {
          (loggedIn == true)
          ? (tipo == 'colab') ? <Home usuario={usuario} setUsuario={setUsuario} setLoggedIn={setLoggedIn}/> : <div className='wrapper'><CriarDemanda usuario={usuario}/></div>
          : (pgInicial) 
          ? <div className='wrapper'><Login setUsuario={setUsuario} setLoggedIn={setLoggedIn} setTipo={setTipo}/></div>
          : <></>
          }
    </HostProvider>
  )
}

export default App
