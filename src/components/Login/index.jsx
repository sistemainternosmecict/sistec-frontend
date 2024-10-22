import { useState, useContext } from 'react';
import { HostContext } from '../../HostContext';
import './style.scss';

const login = async (e, host, setUsuario, setLoggedIn, setMessage, setTipo) => {
  e.preventDefault()
  const route = "/api/usuarios/auth/login";
  const fields = e.target.elements;
  const options = {
    method: "POST",
    body: JSON.stringify({colab_nome_usuario:fields.colab_nome_usuario.value, colab_senha:fields.colab_senha.value}),
    headers: {"Content-Type":"application/json"}
  };
  const result = await fetch(host+route, options);
  const retorno = await result.json();
  const usuario = retorno['usuario_dict'];
  const tipo = retorno['tipo']

  setMessage(retorno.msg);

  if(retorno.auth){
    setUsuario(usuario);
    setLoggedIn(true);
    setTipo(tipo);
  };
}

export default function Login({ setUsuario,  setLoggedIn, setTipo }) {
    const [msg, setMessage] = useState("")
    const { hostUrl } = useContext(HostContext)

    return (
      <>
        <form id='login' onSubmit={(e) => login(e, hostUrl, setUsuario, setLoggedIn, setMessage, setTipo)}>
          <h2>SISTEC</h2>
          <p>Sistema Interno de Suporte Tecnológico versão 1.2</p>
          <div>
            <input type="text" name="colab_nome_usuario" id="colab_nome_usuario" autoComplete='username' placeholder='Nome de usuário' />
            <input type="password" name="colab_senha" id="colab_senha" autoComplete='current-password' placeholder='Senha'/>
            <input type="submit" value="Entrar" />
          </div>
          <p>
            {msg}
          </p>
        </form>
      </>
    )
  }
  