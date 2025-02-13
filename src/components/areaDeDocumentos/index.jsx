import { useState, useContext } from "react";
import { HostContext } from "../../HostContext";
import "./style.scss";
// import ListagemTermos from "./listagemTermos";


// Função para gerar um termo
async function gerarTermo(dados, hostUrl, setPg) {
    const BASE_URL = `${hostUrl}/api/termos`
    // const BASE_URL = `http://172.20.1.108:8082/api/termos`
    try {
        const response = await fetch(`${BASE_URL}/gerar`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(dados),
        });

        setPg(0)

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Erro da API (${response.status}): ${errorText}`);
        }

        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
            const errorText = await response.text(); // Obtém o texto da resposta
            throw new Error(`Resposta não é JSON: ${errorText}`);
        }

        const export_folder = (window.location.hostname !== "192.168.100.131") ? "files" : "export"

        const result = await response.json();
        const url = `http://${window.location.hostname}/${export_folder}/${result.number}.pdf`;
        window.open(url, "_blank"); // Abre o PDF em uma nova aba
        return result; // Retorna { compiled_data, generated, number }
    } catch (error) {
        console.error("Erro ao gerar o termo:", error);
        return null;
    }
}

function validarCampos(data) {
    for (let key in data) {
        if (!data[key].trim()) {
            alert(`O campo "${key}" não pode estar vazio.`);
            return false;
        }
    }
    return true;
}

function stageData(e, hostUrl, setPg) {
    e.preventDefault();
    const form = e.target;
    const fields = form.elements;
    const data = {};

    for (let field of fields) {
        if (field.name) {
            data[field.name] = field.value;
        }
    }

    if (validarCampos(data)) {
        console.log(typeof data, data)
        gerarTermo(data, hostUrl, setPg)
    }
}

function openForm(hostUrl, setPg){
    return (
        <form onSubmit={(e) => stageData(e, hostUrl, setPg)}>
            <div className="boxInput">
                <label htmlFor="serial"> SERIAL: 
                </label>
                <input type="text" name="serial" id="serial" placeholder="Serial do dispositivo..." />
            </div>
            <div className="boxInput">
                <label htmlFor="nome"> Nome completo: 
                </label>
                <input type="text" name="nome" id="nome" placeholder="Nome completo..." />
            </div>
            <div className="boxInput">
                <label htmlFor="matricula"> Matrícula: 
                </label>
                <input type="text" name="matricula" id="matricula" placeholder="Matrícula..." />
            </div>
            <div className="boxInput">
                <label htmlFor="cpf"> CPF: 
                </label>
                <input type="text" name="cpf" id="cpf" placeholder="CPF..." />
            </div>
            <div className="boxInput">
                <label htmlFor="celular"> Celular: 
                </label>
                <input type="text" name="celular" id="celular" placeholder="Celular..." />
            </div>

            <input type="submit" value="Gerar termo" />
        </form>
    )
}

function setDocument(pg, hostUrl, setPg){
    switch(pg){
        case 1:
            return openForm(hostUrl, setPg)
    }
}

function Documentos(){
    const { hostUrl } = useContext(HostContext)
    const [pg, setPg] = useState(0)

    return (
        <section className="documentos">
            {(pg == 0)
            ? (<><p>Documentos</p>

            <div className="btn-organizer">
                <button onClick={() => {
                    setPg(1)
                }}>Gerar novo Termo de responsabilidade</button>
            </div>

            {/* <ListagemTermos /> */}
            
            </>) : setDocument(pg, hostUrl, setPg)}
        </section>
    )
}

export default Documentos;