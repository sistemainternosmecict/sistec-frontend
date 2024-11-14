import { useState, useContext, useEffect } from "react";
import { HostContext } from "../../HostContext";

async function enviar_mudanca( dados, host ){
    const route = "/api/usuarios/solicitantes/atualizar"
    const options = {
      method: "POST",
      body: JSON.stringify(dados),
      headers: {"Content-Type":"application/json"}
    };
    const result = await fetch(host+route, options);
    const retorno = await result.json();
}

function ativar(e, id, setEstado, url){
    const novo_estado = true
    const dados = {'usuario_id': id, 'usuario_ativo':novo_estado}
    // enviar_mudanca(dados, url)
    setEstado(novo_estado)
    console.log(" colaborador de id ", id, " ativado!")
}

function desativar(e, id, setEstado, url){
    const novo_estado = false
    const dados = {'usuario_id': id, 'usuario_ativo':novo_estado}
    // enviar_mudanca(dados, url)
    setEstado(novo_estado)
    console.log("Colaborador de id ", id, " desativado!")
}

function popup_estado(e, id, setEstado, hostUrl){
    const valor = e.target.dataset.val
    console.log(valor)
    switch(valor){
        case "desativar":
            desativar(e, id, setEstado, hostUrl)
            break;
        case "ativar":
            ativar(e, id, setEstado, hostUrl)
            break;
    }
}

export default function Colaborador({ colaborador }){
    const { hostUrl } = useContext(HostContext)
    const current_state = colaborador.usuario_ativo
    const [estado, setEstado] = useState(current_state)
    return (
        <div className={(estado) ? "colab_card" : "colab_card inativo"}>
            {(!estado) ?
            <div className="plaquinha">
                <p>Usuario inativo</p>
            </div> : <></>}
            <p><span>ID:</span> {colaborador.usuario_id} | <span>Matrícula:</span> {colaborador.usuario_matricula} | <span>CPF</span> {colaborador.usuario_cpf}</p>
            <p><span>Nome:</span> {colaborador.usuario_nome}</p>
            <p> <span>Setor:</span> {colaborador.usuario_setor} | <span>Sala:</span> {colaborador.usuario_sala}</p>
            <p><span>Email:</span> {colaborador.usuario_email}</p>
            <p><span>Telefone:</span> {colaborador.usuario_telefone}</p>
            <p><span>Nível de acesso:</span> {colaborador.usuario_tipo}</p>
            <div>{(estado !== false) 
            ? 
            <>
                {/* <span className="ativo_sim">SIM</span> */}
                <button className="btn_desativar" data-val="desativar" onClick={(e) => popup_estado(e, colaborador.usuario_id, setEstado, hostUrl)}>Desativar</button>
            </>
            : 
            <>
                {/* <span className="ativo_nao">NÃO</span> */}
                <button className="btn_ativar" data-val="ativar" onClick={(e) => popup_estado(e, colaborador.usuario_id, setEstado, hostUrl)}>Ativar</button>
            </>
            }
            </div>
        </div>
    )
}