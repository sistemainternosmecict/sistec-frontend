import { useState, useContext } from 'react';
import { HostContext } from '../../HostContext';
import './style.scss';

const login = async (e, host, setUsuario, setLoggedIn, setMessage) => {
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

  setMessage(retorno.msg);

  if(retorno.auth){
    setUsuario(usuario);
    setLoggedIn(true);
  };
}

export default function Login({ setUsuario,  setLoggedIn }) {
    const [msg, setMessage] = useState("")
    const { hostUrl } = useContext(HostContext)

    return (
      <>
        <form onSubmit={(e) => login(e, hostUrl, setUsuario, setLoggedIn, setMessage)}>
          <h2>LOGIN</h2>
          <input type="text" name="colab_nome_usuario" id="colab_nome_usuario" autoComplete='username' />
          <input type="password" name="colab_senha" id="colab_senha" autoComplete='current-password' />
          <input type="submit" value="Entrar" />
          <p>
            {msg}
          </p>
        </form>
      </>
    )
  }
  