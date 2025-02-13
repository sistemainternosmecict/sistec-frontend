import PropTypes from 'prop-types';
import { useContext, useEffect, useState } from "react";
import { HostContext } from "../../../HostContext";
import "./style.scss"

async function obter_categorias(host){
    const route = "/api/categorias_dispositivos/listar"
    const result = await fetch(host+route);
    const retorno = await result.json();
    return retorno
}

async function fetchAll(hostUrl, setCategorias){
    const categorias = await obter_categorias(hostUrl)
    setCategorias(categorias)
}

function obterCategoria(disp_tipo, categorias){
    let retorno = ""
    categorias.forEach((categoria) => {
        if(categoria.cat_disp_id === disp_tipo){
            retorno = categoria
        }
    })

    return retorno
}

function stageData(e){
    e.preventDefault()
    const form = e.target
    const inputs = form.elements
    let obj = {}
    for (let campo of inputs) {
        if (campo.name) {
            obj[campo.name] = campo.value;
        }
    }

    console.log(obj)
}

async function searchCep(e, setEnderecoViaCep){
    e.preventDefault()
    const cep = e.target.value
    const url = `https://viacep.com.br/ws/${cep}/json/`
    if(cep.length === 8){
        const result = await fetch(url);
        const retorno = await result.json();
        setEnderecoViaCep(retorno)
    } else {
        setEnderecoViaCep(undefined)
    }
}

function ModalDisp({ dispositivo }){
    const { hostUrl } = useContext(HostContext)
    const [categorias, setCategorias] = useState([])
    const categoria = obterCategoria(dispositivo.disp_tipo, categorias)
    const [enderecoViaCep, setEnderecoViaCep] = useState(undefined)
    const [abrirJanelaDeRegistro] = useState(false)

    useEffect(() => {
        fetchAll(hostUrl, setCategorias)
    },[])

    return (
        <>
            <h2 className='dispositivoModal_titulo'>Dispositivo</h2>

            <div className='dispositivoModal'>
                <p>Serial: <span>{dispositivo.disp_serial}</span></p>
                <p>Categoria: {categoria.cat_disp_nome}</p>
                <p>Modelo: {categoria.cat_disp_modelo}</p>
                <p>Descrição: {categoria.cat_disp_desc}</p>
            </div>

            {(abrirJanelaDeRegistro)
            ? <form className="inserirRegistroHistorico" onSubmit={(e) => stageData(e)}>
                <p>Registrar novo vinculo com unidade</p>
                <div className="inputBox">
                    <label htmlFor="unidade">Unidade</label>
                    <input type="text" name="unidade" id="unidade" placeholder='Insira o nome da unidade' />
                </div>
                <div className="inputBox">
                    <label htmlFor="cep">CEP</label>
                    <input type="text" name="cep" id="cep" placeholder='CEP...' onChange={(e) => searchCep(e, setEnderecoViaCep)}/>
                    <label htmlFor="numero">Numero</label>
                    <input type="text" name="numero" id="numero" placeholder='Numero/Lote' />
                </div>
                <div className="inputBox">
                    <label htmlFor="complemento">Complemento</label>
                    <input type="text" name="complemento" id="complemento" placeholder='Complemento residencial' defaultValue={(enderecoViaCep !== undefined && enderecoViaCep.complemento !== "") ? enderecoViaCep.complemento : ""}/>
                </div>
                <div className="inputBox">
                    <label htmlFor="logradouro">Logradouro</label>
                    <input type="text" name="logradouro" id="logradouro" placeholder='Dado automatico, insira o cep!' disabled value={(enderecoViaCep !== undefined) ? enderecoViaCep.logradouro : ""}/>
                </div>
                <div className="inputBox">
                    <label htmlFor="bairro">Bairro</label>
                    <input type="text" name="bairro" id="bairro" placeholder='Dado automatico, insira o cep!' disabled value={(enderecoViaCep !== undefined) ? enderecoViaCep.bairro : ""}/>
                </div>

                <input type="submit" value="Registrar vinculo" />
            </form> : <>
                {/* <button className='registrarVinculo' onClick={() => setAbrirJanelaDeRegistro(true)}>Registrar novo vinculo com unidade</button> */}
            </>}


        </>
    )
}

ModalDisp.propTypes = {
    dispositivo: PropTypes.object
}

export default ModalDisp;