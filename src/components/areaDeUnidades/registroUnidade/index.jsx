import { useState } from "react"
import { useContext } from "react";
import { HostContext } from "../../../HostContext";

async function enviarRegistro(host, newData, setRegistrado, setMsg){
    const route = "/api/unidades/registrar"
    const options = {
      method: "POST",
      body: JSON.stringify(newData),
      headers: {"Content-Type":"application/json"}
    };
    const result = await fetch(host+route, options);
    const retorno = await result.json();
    if(retorno.registro){
        setMsg(retorno.msg)
        setRegistrado(true)
    }
}

function stageData(e, hostUrl, setRegistrado, setMsg){
    e.preventDefault()
    const form = e.target
    const inputs = form.elements
    const data = {};

    for (let field of inputs) {
        if (field.name) {
            let value = field.value;
            if (!isNaN(value) && value.trim() !== "") {
                value = Number(value);
            }
            data[field.name] = value;
        }
    }

    data.uni_registro = "01/01/2025"

    // console.log(data)
    enviarRegistro(hostUrl, data, setRegistrado, setMsg)

}

async function getAddress(e, setEndereco){
    e.preventDefault()
    const valor = e.target.value
    if(valor.length === 8){
        const url = `https://viacep.com.br/ws/${valor}/json/`
        const res = await fetch(url)
        const response = await res.json()
        setEndereco(response)
    } else {
        setEndereco(undefined)
    }
}

function RegistroUnidade(){
    const [endereco, setEndereco] = useState(undefined)
    const [registrado, setRegistrado] = useState(false)
    const [msg, setMsg] = useState("")
    const { hostUrl } = useContext(HostContext)

    return (
        <>
            <h2>Registro</h2>

            {(!registrado)
            ? <form onSubmit={(e) => stageData(e, hostUrl, setRegistrado, setMsg)}>
                <div className="inputBox">
                    <label htmlFor="uni_cod_ue">Código da Unidade</label>
                    <input type="text" name="uni_cod_ue" id="uni_cod_ue" placeholder="Codigo único da unidade"/>
                </div>
                <div className="inputBox">
                    <label htmlFor="uni_designador_categoria">Designador de categoria</label>
                    <select name="uni_designador_categoria" id="uni_designador_categoria" defaultValue="-">
                        <option value="-" disabled>Selecione o DC da unidade</option>
                        <option value="C.C.">Casa Creche - CC</option>
                        <option value="C.M.E.">Centro Municipal de Edução - CME</option>
                        <option value="C.M.">Creche Municipal - CM</option>
                        <option value="C.M.">Colégio Municipal - CM</option>
                        <option value="C.E.">Complexo Educacional - CE</option>
                        <option value="E.M.">Escola Municipal - EM</option>
                        <option value="E.Mz.">Escola Municipalizada - EMz</option>
                    </select>
                </div>
                <div className="inputBox">
                    <label htmlFor="uni_nome">Nome completo da Unidade</label>
                    <input type="text" name="uni_nome" id="uni_nome" placeholder="Nome sem o designador de categoria."/>
                </div>
                
                <div className="inputBox">
                    <label htmlFor="uni_cep">CEP</label>
                    <input type="text" name="uni_cep" id="uni_cep" placeholder="Insira um cep para encontrar o endereço." onInput={(e) => getAddress(e, setEndereco)}/>
                </div>

                {(endereco !== undefined)
                ? <div className="endereco">
                    <input type="hidden" id="uni_logradouro" name="uni_logradouro" value={endereco.logradouro} />
                    <input type="hidden" id="uni_bairro" name="uni_bairro" value={endereco.bairro} />
                    {/* <input type="hidden" id="uni_cidade" name="uni_cidade" value={endereco.cidade} /> */}
                    {/* <input type="hidden" id="uni_uf" name="uni_uf" value={endereco.uf} /> */}
                    
                    <div className="inputBox">
                        <label htmlFor="uni_numero_end">Número/Lote</label>
                        <input type="text" name="uni_numero_end" id="uni_numero_end" placeholder="Numero do endereço" />
                    </div>

                    <div className="inputBox">
                        <label htmlFor="uni_nome">Distrito</label>
                        <select name="uni_distrito" id="uni_distrito" defaultValue="-">
                            <option value="-">Selecione o distrito</option>
                            <option value="D1">1º Distrito - Saquarema / Vila</option>
                            <option value="D2">2º Distrito - Bacaxá</option>
                            <option value="D3">3º Distrito - Sampaio Correa</option>
                        </select>
                    </div>

                    <div className="infoBox">
                        <p name="">{endereco.logradouro}</p>
                        <p name="">{endereco.bairro}</p>
                    </div>

                    <div className="infoBox">
                        <p name="">{endereco.localidade} - {endereco.uf} ({endereco.estado})</p>
                    </div>

                    <input type="submit" value="Registrar nova Unidade" />
                </div>
                : <></>}

            </form>
            : <p>{msg}</p>}
        </>
    )
}

export default RegistroUnidade