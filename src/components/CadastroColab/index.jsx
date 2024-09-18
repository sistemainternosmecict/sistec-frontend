import { useState, useContext } from "react";
import { HostContext } from "../../HostContext";
import './style.scss';

async function EnviarRegistro(dados, host, setMessage){
    const route = "/api/usuarios/colaboradores/registrar"
    const options = {
      method: "POST",
      body: JSON.stringify(dados),
      headers: {"Content-Type":"application/json"}
    };
    const result = await fetch(host+route, options);
    const retorno = await result.json();
    setMessage(retorno.msg)
}

function cadastrar(e, host, setMessage){
    e.preventDefault()
    const fields = e.target.elements

    if(fields[5].value !== fields[6].value){
        setMessage("Os valores dos campos de senha, devem ser iguais!")
    } else {
        if(fields[0].value !== "" && fields[4] !== ""){
            const formData = {
                usuario_nome: fields[0].value,
                usuario_sala: fields[1].value,
                usuario_email: fields[2].value,
                usuario_telefone: fields[3].value,
                colab_nome_usuario: fields[4].value,
                colab_senha: fields[5].value
            };
        
            EnviarRegistro(formData, host, setMessage)
            // fields.forEach( field => field.value = "")
        } else {
            setMessage("Campos obrigatórios, não foram preenchidos!")
        }
    }

    setTimeout(() => setMessage(""), 3000)
}

export default function CadastroColab(){
    const { hostUrl } = useContext(HostContext)
    const [msg,setMessage] = useState("")
    return (
        <>  
            <form onSubmit={(e) => cadastrar(e, hostUrl, setMessage)}>
                <h1>Registro de</h1>
                <h1>Colaborador</h1>
                <input type="text" placeholder="Nome do Colaborador (*)"/>
                <input type="text" placeholder="Numero da Sala"/>
                <input type="text" placeholder="Email do Colaborador"/>
                <input type="text" placeholder="Telefone do Colaborador"/>
                <input type="text" placeholder="Nome de usuário (*)"/>

                <p>--Senha--</p>
                <input type="password" placeholder="Senha do Colaborador"/>
                <input type="password" placeholder="Repita a Senha por favor"/>
                <input type="submit" value="Registrar"/>
                <p>(*) = Obrigatório</p>
                <p>
                {msg}
                </p>
            </form>
        </>
    )
}