import { useState, useContext } from "react";
import { HostContext } from "../../../HostContext";
import icone from '../../../assets/icone_processamento.png';
import './style.scss';
import PropTypes from 'prop-types'

async function buscarMatricula(dados, host, matriculaValidacao){
    const route = "/api/usuarios/validar/matricula"
    const options = {
      method: "POST",
      body: JSON.stringify(dados),
      headers: {"Content-Type":"application/json"}
    };
    const result = await fetch(host+route, options);
    const retorno = await result.json();
    if(retorno.msg){
        const obj = {'validada': false, 'matricula':dados.usuario_matricula.split('-')[0], 'msg':retorno.msg, 'dados':{}}
        matriculaValidacao(obj)
    } else {
        const obj = {'validada': true, 'matricula':dados.usuario_matricula.split('-')[0], 'msg':undefined, 'dados':retorno}
        matriculaValidacao(obj)
    }
}

async function EnviarRegistro(dados, host, setMessage, tipoDeArea){
    const route = "/api/usuarios/registrar"
    const options = {
      method: "POST",
      body: JSON.stringify(dados),
      headers: {"Content-Type":"application/json"}
    };
    const result = await fetch(host+route, options);
    const retorno = await result.json();
    if(retorno.msg){
        setMessage(retorno.msg)

    } else {
        setMessage("Cadastro realizado!")
    }

    if(tipoDeArea == 'externa'){
        setTimeout(() =>{
            window.location.reload();
        }, 2000);
    }
        
}

function validarMatricula(e, host, setMatriculaValidade){
    e.preventDefault()
    const dados = {
        usuario_matricula: e.target.elements.matriculaValidacao.value
    }
    buscarMatricula(dados, host, setMatriculaValidade)
}

function cadastrar(e, host, setMessage, setRegistrando, tipoDeArea){
    e.preventDefault()
    setRegistrando(true)
    const fields = e.target.elements
    const fields_array = Array.from(fields)
    const senhas_iguais = fields.senha1.value === fields.senha2.value
    if(fields.matricula.value !== "" 
        && fields.nome.value !== "" 
        && fields.matricula.value !== "" 
        && fields.local.value !== "-" 
        && fields.sala.value !== "" 
        && fields.email.value !== ""
        && fields.telefone.value !== ""){
        if(senhas_iguais){
            const usuarioData = {
                usuario_matricula: fields.matricula.value,
                usuario_nome: fields.nome.value,
                usuario_setor: fields.local.value,
                usuario_cargo: fields.cargo.value,
                usuario_funcao: fields.funcao.value,
                usuario_sala: fields.sala.value,
                usuario_cpf: Number(fields.cpf.value),
                usuario_email: fields.email.value,
                usuario_telefone: Number(fields.telefone.value),
                usuario_senha: fields.senha1.value,
                usuario_tipo: 10,
                usuario_ativo: false
            }
    
            EnviarRegistro(usuarioData, host, setMessage, tipoDeArea)
            fields_array.forEach( field => {
                if(field.type !== "submit"){
                    field.value = "";
                }
            })
        } else {
            setMessage("As senhas não são idênticas!")
        }
    } else {
        setMessage("Campos obrigatórios, não foram preenchidos!")
    }

    setTimeout(() => setMessage(""), 3000)
}

function CadastroUsuario({ tipoDeArea }){
    const { hostUrl } = useContext(HostContext)
    const [msg,setMessage] = useState("")
    const [matriculaValidada, setMatriculaValidade] = useState({'validada': false, 'matricula':undefined, 'msg':undefined, 'dados':{}})
    const [registrando, setRegistrando] = useState(false)

    return (
        <div className="wrapper">
            {(!registrando) ? 
            
            <>
            {(matriculaValidada.msg === undefined) ?
            <>
                {(matriculaValidada.validada === false) ?
                <>
                    <h1>Registro de Usuário</h1>
                    <p className="aviso">Insira sua matrícula para iniciar o processo de registro.</p>
                    <form className="validarMatricula" onSubmit={(e) => validarMatricula(e, hostUrl, setMatriculaValidade)}>
                        <input id="matriculaValidacao" type="text" name="matriculaValidacao" placeholder="Insira sua matricula " autoComplete="username"/>
                        <button className="btnValidarMatricula">Validar Matricula</button>
                    </form>
                </> : <></>}
            </> : <>
            <p id="msgAlerta">{matriculaValidada.msg}</p>
            <button onClick={() => window.location.reload()}>Voltar</button>
            </>}

            <form id="reg_solic" onSubmit={(e) => cadastrar(e, hostUrl, setMessage, setRegistrando, tipoDeArea)}>
                {(matriculaValidada.validada) ?
                <div className="cadastroCompleto">
                    <p className="placa">Matrícula encontrada! Complete seu cadastro.</p>
                    <input type="hidden" name="matricula" value={matriculaValidada.matricula}/>
                    <input type="text" name="local" placeholder="Local de Trabalho" value={matriculaValidada.dados.local_de_trabalho} disabled/>
                    <input type="text" name="cargo" placeholder="Cargo" value={matriculaValidada.dados.cargo} disabled/>
                    <input type="text" name="nome" placeholder="Nome completo" value={matriculaValidada.dados.nome} onChange={(e)=> setMatriculaValidade({...matriculaValidada, dados: {...matriculaValidada.dados, nome: e.target.value}})} required/>
                    <input type="text" name="funcao" placeholder="Função" required/>
                    <input type="text" name="sala" placeholder="Sala" required/>
                    <input type="text" name="cpf" placeholder="CPF" required/>
                    <input type="text" name="email" placeholder="E-mail" required/>
                    <input type="text" name="telefone" placeholder="Telefone" autoComplete="username" required/>
                    <input type="password" name="senha1" placeholder="Crie uma senha" autoComplete="new-password" required/>
                    <input type="password" name="senha2" placeholder="Repita a senha" autoComplete="new-password" required/>
                    <input type="submit" value="Registrar"/>
                    <p>Todos os campos são obrigatórios.</p>
                </div> : <></>}
                <p>
                {msg}
                </p>
            </form>
            </> : <>
            <p>Aguarde enquanto processamos seu registro...</p>
            <div className="loadIcon">
                {(msg == "") ? <img className="icone" src={icone} alt="Icone de carregamento personalizado." /> : <></>}
            </div>
            Processando... {msg}
            </>}
        </div>
    )
}

CadastroUsuario.propTypes = {
    tipoDeArea: PropTypes.string.isRequired,
}

export default CadastroUsuario;