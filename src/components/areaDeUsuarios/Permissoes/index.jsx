import { useContext, useEffect, useState } from 'react';
import { HostContext } from '../../../HostContext';
import './style.scss';

async function obterPermissoesDaAPI(host) {
    const route = "/api/permissoes/listar";
    const result = await fetch(host + route);
    const retorno = await result.json();
    return retorno;
}

function Permissoes() {
    const [permissoes, setPermissoes] = useState([]); // Estado para armazenar as permissões
    const { hostUrl } = useContext(HostContext);

    useEffect(() => {
        obterPermissoesDaAPI(hostUrl).then(permissoes => {
            setPermissoes(permissoes); // Atualiza o estado com os dados da API
        }).catch(error => {
            console.error("Erro ao obter permissões:", error);
        });
    }, [hostUrl]);

    return (
        <table className="permissoes-table">
            <thead className="permissoes-table__header">
                <tr className="permissoes-table__header-row">
                    <th className="permissoes-table__header-cell">ID</th>
                    <th className="permissoes-table__header-cell">Permissão</th>
                    <th className="permissoes-table__header-cell">Descrição</th>
                </tr>
            </thead>
            <tbody className="permissoes-table__body">
                {permissoes.map((permissao, index) => (
                    <tr key={index} className="permissoes-table__body-row">
                        <td className="permissoes-table__body-cell">{permissao.perm_id}</td>
                        <td className="permissoes-table__body-cell">{permissao.perm_nome}</td>
                        <td className="permissoes-table__body-cell">{permissao.perm_desc}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

export default Permissoes;
