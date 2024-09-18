export default function Solicitante({ solicitante }){
    return (
        <div className="solic_card">
            <p><span>ID: </span> { solicitante.solic_id } </p>
            <p><span>Nome: </span> { solicitante.solic_nome } </p>
            <p><span>Sala: </span> { solicitante.solic_sala } </p>
            <p><span>Email: </span> { solicitante.solic_email } </p>
            <p><span>Telefone: </span> { solicitante.solic_telefone } </p>
        </div>
    )
}