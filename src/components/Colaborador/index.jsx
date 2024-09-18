import { useState } from "react";

function ativar(e, id, setEstado){
    const novo_estado = true
    setEstado(novo_estado)
    // console.log(" colaborador de id ", id, " ativado!")
}

function desativar(e, id, setEstado){
    const novo_estado = false
    setEstado(novo_estado)
    // console.log("Colaborador de id ", id, " desativado!")
}

export default function Colaborador({ colaborador}){
    const current_state = colaborador.colab_ativo
    const [estado, setEstado] = useState(current_state)
    return (
        <div className="colab_card">
            <p><span>ID:</span> {colaborador.colab_id}</p>
            <p><span>Nome:</span> {colaborador.colab_nome}</p>
            <p><span>Sala:</span> {colaborador.colab_sala}</p>
            <p><span>Email:</span> {colaborador.colab_email}</p>
            <p><span>Telefone:</span> {colaborador.colab_telefone}</p>
            <div><span>Colaborador Ativo:</span> {(estado !== false) 
            ? 
            <>
                <span className="ativo_sim">SIM</span>
                <button className="btn_desativar" onClick={(e) => desativar(e, colaborador.colab_id, setEstado)}>Desativar</button>
            </>
            : 
            <>
                <span className="ativo_nao">NÃO</span>
                <button className="btn_ativar" onClick={(e) => ativar(e, colaborador.colab_id, setEstado)}>Ativar</button>
            </>
            }
            </div>
        </div>
    )
}