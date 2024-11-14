import { useState, useContext } from 'react';
import { HostContext } from '../../HostContext';
import CadastroUsuario from '../CadastroUsuario';
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
        <form id='login' onSubmit={(e) => login(e, hostUrl, setUsuario, setLoggedIn, setMessage)}>
          <h2>SISTEC</h2>
          <p>Sistema Interno de Suporte Tecnológico versão 1.2</p>
          <div>
            <input type="text" name="usuario_matricula" id="usuario_matricula" placeholder='Matrícula (sem dígito)' autoComplete='username'/>
            <input type="password" name="usuario_senha" id="usuario_senha" autoComplete='current-password' placeholder='Senha'/>
            <input type="submit" value="Entrar" />
          </div>
          <p>Ainda não possui um cadastro?</p>
          <button onClick={(e) => {
            e.preventDefault()
            setCadastrado(false)}}>Cadastre-se</button>
          <p>
            {msg}
          </p>
        </form> : <CadastroUsuario />}
      </>
    )
  }
  