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
}

async function fetchAtualizar( host, dados ){
    const route = "/api/rap/atualizar"
    const options = {
        method: "POST",
        body: JSON.stringify(dados),
        headers: {"Content-Type":"application/json"}
      };
    const result = await fetch(host+route, options);
    const retorno = await result.json();
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

async function submeter(e, hostUrl, nivel) {
    e.preventDefault();
    const raps = await obterRapDaAPI(hostUrl)
    const form = e.target
    const campos = Array.from(form.elements)
    const ids = []
    raps.forEach( rapDb => {
        ids.push([rapDb.rap_id, rapDb.rap_acesso_id])
    })

    campos.forEach( (campo) => {
        if( campo.type == "checkbox"){
            if(ids.includes([Number(campo.id), nivel.nva_id])){
                const dados = {
                    rap_id: Number(campo.id),
                    rap_ativo: campo.checked
                }

                fetchAtualizar(hostUrl, dados)
                // console.log(dados)
            } else {
                const dadosNovos = {
                    rap_acesso_id: nivel.nva_id,
                    rap_perm_id: Number(campo.id),
                    rap_ativo: campo.checked 
                }
                fetchRegistrar( hostUrl, dadosNovos)
                // console.log(dadosNovos)
            }
        }
    })
    
}

function Detalhes(event, rap, setNivelSelecionado ){
    const parent = event.target.parentNode
    const obj = JSON.parse(parent.dataset.nivel)
    setNivelSelecionado(obj)
}

function ModalNivelDeAcesso( { nivelSelecionado, rap, permissoes, hostUrl } ){
    const [rapRender, setRapRender] = useState([]);

    useEffect(() => {
        const render = rap.filter(rapTemp => rapTemp.rap_acesso_id === nivelSelecionado.nva_id);
        setRapRender(render);
    }, [nivelSelecionado, rap]);

    const handleCheckboxChange = (permId, isChecked) => {
        setRapRender((prev) => {
            const existingRap = prev.find(rend => rend.rap_perm_id === permId);
            if (isChecked) {
                if (!existingRap) {
                    return [...prev, { rap_perm_id: permId, rap_acesso_id: nivelSelecionado.nva_id, rap_ativo: true }];
                }
            } else {
                return prev.filter(rend => rend.rap_perm_id !== permId);
            }
            return prev;
        });        
    };

    return (<div className='modal'>
        <h1>Detalhes do Nível de acesso</h1>

        <div className='detalhes'>
            <p><span>Nivel:</span> {nivelSelecionado.nva_id}</p>
            <p><span>Nome:</span> {nivelSelecionado.nva_nome}</p>
            <p><span>Desc:</span> {nivelSelecionado.nva_desc}</p>
        </div>

        <div className='configuracoes'>
            <form onSubmit={(e) => submeter(e, hostUrl, nivelSelecionado)}>
                <ul>
                {permissoes.map( (perm, idx) => {
                    const isChecked = rapRender.some(rend => rend.rap_perm_id === perm.perm_id && rend.rap_ativo);
                    console.log(isChecked)
                        return <li key={idx}>
                        <label htmlFor={perm.perm_id}>{perm.perm_nome}
                            <input type="checkbox" name={perm.perm_nome} id={perm.perm_id} onChange={(e) => handleCheckboxChange(perm.perm_id, e.target.checked)}/>
                        </label>
                    </li>
                })}
                </ul>
                <button>Registrar alterações</button>
            </form>
        </div>
    </div>
    )
}

ModalNivelDeAcesso.propTypes = {
    nivelSelecionado: PropTypes.object,
    rap: PropTypes.array,
    permissoes: PropTypes.array
}

function NiveisDeAcesso() {
    const [niveisAcesso, setNiveisAcesso] = useState([]);
    const [permissoes, setPermissoes] = useState([]);
    const [rap, setRap] = useState([]); 
    const { hostUrl } = useContext(HostContext);
    const [nivelSelecionado, setNivelSelecionado] = useState(undefined);

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
        : <ModalNivelDeAcesso nivelSelecionado={nivelSelecionado} rap={rap} permissoes={permissoes} hostUrl={hostUrl}/>
    );
}

export default NiveisDeAcesso;
