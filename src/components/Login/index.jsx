import { useState, useContext, useEffect } from 'react';
import { HostContext } from '../../HostContext';
import CadastroUsuario from '../areaDeUsuarios/CadastroUsuario';
import logoSistec from '../../assets/logo_sistec.png'
import logoSub from '../../assets/preto_logoSub.png'
import PropTypes from 'prop-types';
import './style.scss';

async function obter_info(host){
  const route = "/info"
  const result = await fetch(host+route);
  const retorno = await result.json();
  return retorno
}

const login = async (e, host, setUsuario, setLoggedIn, setMessage) => {
  e.preventDefault()
  const route = "/api/usuarios/auth/login";
  const fields = e.target.elements;
  const options = {
    method: "POST",
    body: JSON.stringify({usuario_matricula:Number(fields.usuario_matricula.value), usuario_senha:fields.usuario_senha.value}),
    headers: {"Content-Type":"application/json"}
  };
  const result = await fetch(host+route, options);
  const retorno = await result.json();
  const usuario = retorno['usuario'];

  setMessage(retorno.msg);

  if(retorno.auth){
    setUsuario(usuario);
    setLoggedIn(true);
  };
}

async function fetchData( host, setInfo ){
  const info = await obter_info( host )
  setInfo(info)
}

export default function Login({ setUsuario,  setLoggedIn }) {
    const [msg, setMessage] = useState("")
    const { hostUrl } = useContext(HostContext)
    const [cadastrado, setCadastrado] = useState(true)
    const [info, setInfo] = useState({api_version: null, api_online: false})

    useEffect(() => {
      fetchData( hostUrl, setInfo )
    },[])

    return (
      <>
        {(cadastrado) ?
        <>
          <form id='login' onSubmit={(e) => login(e, hostUrl, setUsuario, setLoggedIn, setMessage)}>
            {/* <h2>Sistec</h2>
            <p>Sistema Interno de Suporte Tecnológico</p> */}
            <img className='logoSistec' src={logoSistec} alt="logo do sistema sistec"/>
          <div className='versionBlock'>
            {/* <p className='ver'>App v1.4-Alpha</p> */}
            <p className={(info.api_online) ? "ver api_online" : "ver api_offline"}> {(info.api_online)
            ? `App v${info.api_version}-alpha | Online` 
            : `App ${(info.api_version) ? (info.api_version + " | ") : ""} Offline`}</p>
          </div>
            <div className='caixa'>
              <input type="text" name="usuario_matricula" id="usuario_matricula" placeholder='Matrícula' autoComplete='username'/>
              <input type="password" name="usuario_senha" id="usuario_senha" autoComplete='current-password' placeholder='Senha'/>
              <input type="submit" value="Entrar" />
            </div>
          </form> 
          <p>Ainda não possui um cadastro?</p>
          <button className='cadastro' onClick={(e) => {
            e.preventDefault()
            setCadastrado(false)}}>Cadastre-se</button>
          <p className='msg'>
            {msg}
          </p>
          <img className='logoSub' src={logoSub} alt="logo da subsecretaria de tecnologia" />

          
        </>
        : <CadastroUsuario tipoDeArea="externa" />}
      </>
    )
  }

  Login.propTypes = {
    setUsuario: PropTypes.func,
    setLoggedIn: PropTypes.func
  }
  