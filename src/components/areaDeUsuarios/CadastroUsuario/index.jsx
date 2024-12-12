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

async function EnviarRegistro(dados, host, setMessage, tipoDeArea, setRegistrando){
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
    } else {
        setTimeout(()=> {
            setRegistrando(false)
        }, 2000)
    }
        
}

function setOptions( localTipo ) {
    switch(localTipo){
        case "Secretaria de Educação":
            return <>
                <option value="Administrativo">Administrativo</option>
                <option value="Arquivo">Arquivo</option>
                <option value="Coordenação Pedagógica">Coordenação Pedagógica</option>
                <option value="Estatística">Estatística</option>
                <option value="Financeiro">Financeiro</option>
                <option value="Gabinete do(a) Secretário(a)">Gabinete do(a) Secretário(a)</option>
                <option value="Inspeção Escolar">Inspeção Escolar</option>
                <option value="Literatura">Literatura</option>
                <option value="Nutrição">Nutrição</option>
                <option value="Patrimônio">Patrimônio</option>
                <option value="Projetos e Eventos">Projetos e Eventos</option>
                <option value="Programas">Programas</option>
                <option value="Politicas Publicas">Politicas Publicas</option>
                <option value="Psicologia Educacional">Psicologia Educacional</option>
                <option value="Transporte">Transporte</option>
                <option value="Técnica Especializada">Técnica Especializada</option>
                <option value="Senso Escolar">Senso Escolar</option>
            </>
        case "Subsecretaria de Tecnologia":
            return <>
                <option value="CPD">CPD</option>
                <option value="Inovação">Inovação</option>
                <option value="TI Educacional">TI Educacional</option>
            </>
        case "Subsecretaria de Inclusão":
            return <>
                <option value="Diretoria de Inclusão">Diretoria de Inclusão</option>
                <option value="CAIE">CAIE</option>
            </>
        case "Subsecretaria de Educação":
            return <>
                <option value="Pedagógico">Pedagógico</option>
            </>
        case "Subsecretaria de Infraestrutura da Educação":
            return <>
                <option value="Manutenção">Manutenção</option>
                <option value="Projeto arquitetônicos">Projeto arquitetônicos</option>
            </>
        case "Subsecretaria de Cultura":
            return <>
                <option value="Casa de Cultura">Casa de Cultura</option>
                <option value="Museu Arqueológico Sambaqui da Beirada">Museu Arqueológico Sambaqui da Beirada</option>
                <option value="Teatro Mário Lago">Teatro Mário Lago</option>
                <option value="Templo do Rock">Templo do Rock</option>
            </>
        case "ue":
            return <>
                <option value="Administrativo">Administrativo</option>
                <option value="Pedagógico">Pedagógico</option>
            </>
        default:
            return ""
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
        && fields.local_tipo.value !== "-" 
        && fields.sala.value !== "" 
        && fields.email.value !== ""
        && fields.telefone.value !== ""){
        if(senhas_iguais){
            const usuarioData = {
                usuario_matricula: fields.matricula.value,
                usuario_nome: fields.nome.value,
                usuario_local: (fields.local_tipo.value != "ue") ? fields.local_tipo.value : fields.local.value,
                usuario_setor: fields.setor.value,
                usuario_cargo: fields.cargo.value,
                usuario_funcao: fields.funcao.value,
                usuario_sala: fields.sala.value,
                usuario_cpf: Number(fields.cpf.value),
                usuario_email: fields.email.value,
                usuario_telefone: Number(fields.telefone.value),
                usuario_senha: fields.senha1.value,
                usuario_tipo: 10,
                usuario_ativo: false,
                usuario_vinculo: "Prefeitura Municipal de Saquarema",
                usuario_situacao_rh: fields.situacaoRh.value
            }
    
            // console.log(usuarioData)
            EnviarRegistro(usuarioData, host, setMessage, tipoDeArea, setRegistrando)
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
    const [localTipo, setLocalTipo] = useState(undefined)

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
                    <input type="hidden" name="situacaoRh" value={matriculaValidada.dados.local_de_trabalho}/>
                    <input type="hidden" name="matricula" value={matriculaValidada.matricula}/>
                    
                    <p className="placa">Matrícula encontrada! Complete seu cadastro.</p>
                    <input type="text" value={matriculaValidada.matricula} disabled/>
                    <input type="text" name="cargo" placeholder="Cargo" value={matriculaValidada.dados.cargo} disabled/>
                    {(tipoDeArea == "interna" && matriculaValidada.validada)?
                    <input type="text" name="situacaoRhVisivel" value={`Situação RH: ${matriculaValidada.dados.local_de_trabalho}`} disabled/>:<></>}
                    <input type="text" name="nome" placeholder="Nome completo" value={matriculaValidada.dados.nome} onChange={(e)=> setMatriculaValidade({...matriculaValidada, dados: {...matriculaValidada.dados, nome: e.target.value}})} required/>
                    
                    <select name="local_tipo" id="local_tipo" defaultValue="-" onChange={(e)=> setLocalTipo(e.target.value)}>
                        <option value="-" disabled>Tipo de Unidade Administrativa</option>
                        <option value="Secretaria de Educação">Secretaria de Educação</option>
                        <option value="Subsecretaria de Cultura">Subsecretaria de Cultura</option>
                        <option value="Subsecretaria de Educação">Subsecretaria de Educação</option>
                        <option value="Subsecretaria de Inclusão">Subsecretaria de Inclusão</option>
                        <option value="Subsecretaria de Infraestrutura da Educação">Subsecretaria de Infraestrutura da Educação</option>
                        <option value="Subsecretaria de Tecnologia">Subsecretaria de Tecnologia</option>
                        <option value="ue">Unidade Escolar</option>
                    </select>
                    
                    {(localTipo == "ue")
                    ? 
                    <select name="local" id="local" defaultValue="-">
                        <option value="-" disabled>Unidade</option>
                        <option value="E.M. Osiris Palmier da Veiga">E.M. Osiris Palmier da Veiga</option>
                        <option value="E.M. Ismênia de Barros Barroso">E.M. Ismênia de Barros Barroso</option>
                        <option value="E.M. Padre Manuel">E.M. Padre Manuel</option>
                    </select>
                    : <>
                    </>
                    }

                    {(localTipo) ?
                    <select name="setor" id="setor" defaultValue="-">
                        <option value="-" disabled>Setor</option>
                        {setOptions(localTipo)}
                    </select>
                    : ""}

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