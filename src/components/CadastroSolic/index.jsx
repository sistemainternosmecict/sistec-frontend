import { useState, useContext } from "react";
import { HostContext } from "../../HostContext";

async function EnviarRegistro(dados, host, setMessage){
    const route = "/api/usuarios/solicitantes/registrar"
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
    const fields_array = Array.from(fields)
    if(fields[0].value !== "" && fields[1] !== ""){
        const solicData = {
            usuario_nome: fields[0].value,
            usuario_sala: fields[1].value,
            usuario_email: fields[2].value,
            usuario_telefone: fields[3].value
        }

        EnviarRegistro(solicData, host, setMessage)
    } else {
        setMessage("Campos obrigatórios, não foram preenchidos!")
    }

    fields_array.forEach( field => {
        if(field.type !== "submit"){
            field.value = "";
        }
    })

    setTimeout(() => setMessage(""), 3000)
}

export default function CadastroSolic(){
    const { hostUrl } = useContext(HostContext)
    const [msg,setMessage] = useState("")
    return (
        <>
            {/* <p>Cadastro de solicitantes</p> */}
            <form onSubmit={(e) => cadastrar(e, hostUrl, setMessage)}>
                <h1>Registro de</h1>
                <h1>Solicitante</h1>
                <input type="text" placeholder="Nome do solicitante (*)"/>
                <input type="text" placeholder="Sala do solicitante (*)"/>
                <input type="text" placeholder="Email do solicitante"/>
                <input type="text" placeholder="Telefone do solicitante"/>
                <input type="submit" value="Registrar" />
                <p>(*) = Obrigatório</p>
                <p>
                {msg}
                </p>
            </form>
        </>
    )
}