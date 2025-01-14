import { useContext, useEffect, useState } from 'react';
import { HostContext } from '../../../HostContext';
import PropTypes from 'prop-types';
import './style.scss';

async function fetchRegistrar( host, dados ){
    const route = "/api/rap/registrar"
    const options = {
        method: "POST",
        body: JSON.stringify(dados),
        headers: {"Content-Type":"application/json"}
      };
    const result = await fetch(host+route, options);
    const retorno = await result.json();
    console.log(retorno)
}

async function fetchAtualizar( host, dados, setMsg, setNivelSelecionado ){
    const route = "/api/rap/atualizar"
    const options = {
        method: "POST",
        body: JSON.stringify(dados),
        headers: {"Content-Type":"application/json"}
      };
    const result = await fetch(host+route, options);
    const retorno = await result.json();
    if(retorno.atualizado){
        const msg = "Nivel de acesso, atualizado!"
        setMsg(msg)
        setTimeout(() => {
            setMsg(null)
            setNivelSelecionado(undefined)
        }, 3000)
    }
}

async function obterPermissoesDaAPI(host) {
    const route = "/api/permissoes/listar";
    const result = await fetch(host + route);
    const retorno = await result.json();
    return retorno;
}

async function obterRapDaAPI(host) {
    const route = "/api/rap/listar";
    const result = await fetch(host + route);
    const retorno = await result.json();
    return retorno['resultados'];
}

async function obterNiveisDeAcessoDaAPI(host) {
    const route = "/api/niveis_acesso/listar";
    const result = await fetch(host + route);
    const retorno = await result.json();
    return retorno;
}

async function submeter(e, hostUrl, nivel, setMsg, setNivelSelecionado) {
    e.preventDefault();

    // Obter os RAPS existentes no banco de dados
    const raps = await obterRapDaAPI(hostUrl);
    const form = e.target;
    const campos = Array.from(form.elements);

    // Criar um mapa para identificar rapidamente as permissões existentes
    const rapMap = new Map(
        raps.map((rapDb) => [`${rapDb.rap_perm_id}_${rapDb.rap_acesso_id}`, rapDb])
    );

    // Iterar pelos campos do formulário
    campos.forEach((campo) => {
        if (campo.type === "checkbox") {
            const chave = `${campo.id}_${nivel.nva_id}`;
            const existente = rapMap.get(chave);

            if (existente) {
                // Se o RAP já existir, verificar se o estado mudou
                if (existente.rap_ativo !== campo.checked) {
                    const dados = {
                        rap_id: existente.rap_id,
                        rap_ativo: campo.checked,
                    };
                    fetchAtualizar(hostUrl, dados, setMsg, setNivelSelecionado);
                }
            } else {
                // Se o RAP não existir, registrar como novo
                const dadosNovos = {
                    rap_acesso_id: nivel.nva_id,
                    rap_perm_id: Number(campo.id),
                    rap_ativo: campo.checked,
                };
                fetchRegistrar(hostUrl, dadosNovos);
            }
        }
    });

    // Verificar se o nível de acesso está registrado
    if (!raps.some((rap) => rap.rap_acesso_id === nivel.nva_id)) {

        // Exemplo de ação adicional para registrar o nível de acesso, se necessário
        const novoNivelDeAcesso = {
            nva_id: nivel.nva_id,
            nva_nome: nivel.nva_nome,
            nva_desc: nivel.nva_desc,
        };

        fetchRegistrar(hostUrl, novoNivelDeAcesso, setMsg, setNivelSelecionado);
    }
}



function Detalhes(event, rap, setNivelSelecionado ){
    const parent = event.target.parentNode
    const obj = JSON.parse(parent.dataset.nivel)
    setNivelSelecionado(obj)
}

function ModalNivelDeAcesso({ nivelSelecionado, rap, permissoes, hostUrl, setNivelSelecionado }) {
    const [rapRender, setRapRender] = useState([]);
    const [msg, setMsg] = useState(null);

    useEffect(() => {
        const render = rap.filter(
            (rapTemp) => rapTemp.rap_acesso_id === nivelSelecionado.nva_id
        );
        setRapRender(render);
    }, [nivelSelecionado, rap]);

    const handleCheckboxChange = (permId, isChecked) => {
        setRapRender((prev) =>
            prev.map((item) =>
                item.rap_perm_id === permId
                    ? { ...item, rap_ativo: isChecked }
                    : item
            )
        );
    };

    const isPermissionChecked = (permId) => {
        const rapItem = rapRender.find((item) => item.rap_perm_id === permId);
        return rapItem ? rapItem.rap_ativo : false;
    };

    return (
        <div className="modal">
            <h1>Detalhes do Nível de Acesso</h1>

            <div className="detalhes">
                <p>
                    <span>Nível:</span> {nivelSelecionado.nva_id}
                </p>
                <p>
                    <span>Nome:</span> {nivelSelecionado.nva_nome}
                </p>
                <p>
                    <span>Descrição:</span> {nivelSelecionado.nva_desc}
                </p>
            </div>

            {(!msg)
            ? <div className="configuracoes">
                <form onSubmit={(e) => submeter(e, hostUrl, nivelSelecionado, setMsg, setNivelSelecionado)}>
                    <ul>
                        {permissoes.map((perm, idx) => (
                            <li key={idx}>
                                <label>
                                    {perm.perm_nome}
                                    <input
                                        type="checkbox"
                                        id={perm.perm_id}
                                        name={perm.perm_nome}
                                        checked={isPermissionChecked(perm.perm_id)}
                                        onChange={(e) => handleCheckboxChange(perm.perm_id, e.target.checked)}
                                    />
                                </label>
                            </li>
                        ))}
                    </ul>
                    <button type="submit">Registrar alterações</button>
                </form>
            </div> : <p>{msg}</p>}
        </div>
    );
}

ModalNivelDeAcesso.propTypes = {
    nivelSelecionado: PropTypes.object,
    rap: PropTypes.array,
    permissoes: PropTypes.array,
    hostUrl: PropTypes.string,
    setNivelSelecionado: PropTypes.func
}

function NiveisDeAcesso({ nivelSelecionado, setNivelSelecionado }) {
    const [niveisAcesso, setNiveisAcesso] = useState([]);
    const [permissoes, setPermissoes] = useState([]);
    const [rap, setRap] = useState([]); 
    const { hostUrl } = useContext(HostContext);
    

    useEffect(()=> {
        setNivelSelecionado(undefined)
    }, [])

    useEffect(() => {
        obterNiveisDeAcessoDaAPI(hostUrl).then(niveis => {
            setNiveisAcesso(niveis); // Atualiza o estado com os dados da API
        }).catch(error => {
            console.error("Erro ao obter níveis de acesso:", error);
        });

        obterRapDaAPI(hostUrl).then(rap => {
            setRap(rap); // Atualiza o estado com os dados da API
        }).catch(error => {
            console.error("Erro ao obter níveis de acesso:", error);
        });

        obterPermissoesDaAPI(hostUrl).then(permissoes => {
            setPermissoes(permissoes); // Atualiza o estado com os dados da API
        }).catch(error => {
            console.error("Erro ao obter permissoes:", error);
        });
    }, [hostUrl]);

    return (
        ( !nivelSelecionado )
        ? <table className="niveis-acesso-table">
            <thead className="niveis-acesso-table__header">
                <tr className="niveis-acesso-table__header-row">
                    <th className="niveis-acesso-table__header-cell">ID</th>
                    <th className="niveis-acesso-table__header-cell">Nome</th>
                    <th className="niveis-acesso-table__header-cell">Descrição</th>
                </tr>
            </thead>
            <tbody className="niveis-acesso-table__body">
                {niveisAcesso.map((nivel, index) => (
                    <tr key={index} className="niveis-acesso-table__body-row" data-nivel={JSON.stringify(nivel)} onClick={(e) => Detalhes(e, rap, setNivelSelecionado)}>
                        <td className="niveis-acesso-table__body-cell">{nivel.nva_id}</td>
                        <td className="niveis-acesso-table__body-cell">{nivel.nva_nome}</td>
                        <td className="niveis-acesso-table__body-cell">{nivel.nva_desc}</td>
                    </tr>
                ))}
            </tbody>
        </table>
        : <ModalNivelDeAcesso nivelSelecionado={nivelSelecionado} rap={rap} permissoes={permissoes} hostUrl={hostUrl} setNivelSelecionado={setNivelSelecionado}/>
    );
}

NiveisDeAcesso.propTypes = {
    nivelSelecionado: PropTypes.object,
    setNivelSelecionado: PropTypes.func
}

export default NiveisDeAcesso;
