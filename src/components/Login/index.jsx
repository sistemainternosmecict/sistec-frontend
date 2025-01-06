import { useState, useContext } from 'react';
import { HostContext } from '../../HostContext';
import CadastroUsuario from '../areaDeUsuarios/CadastroUsuario';
import logoSistec from '../../assets/logo_sistec.png'
import logoSub from '../../assets/preto_logoSub.png'
import './style.scss';

const login = async (e, host, setUsuario, setLoggedIn, setMessage, setTipo) => {
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

export default function Login({ setUsuario,  setLoggedIn }) {
    const [msg, setMessage] = useState("")
    const { hostUrl } = useContext(HostContext)
    const [cadastrado, setCadastrado] = useState(true)

    return (
      <>
        {(cadastrado) ?
        <>
          <form id='login' onSubmit={(e) => login(e, hostUrl, setUsuario, setLoggedIn, setMessage)}>
            {/* <h2>Sistec</h2>
            <p>Sistema Interno de Suporte Tecnológico</p> */}
            <img className='logoSistec' src={logoSistec} alt="logo do sistema sistec"/>
          <p className='ver'>versão 1.3-alpha</p>
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
  