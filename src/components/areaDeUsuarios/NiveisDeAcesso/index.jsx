import { useContext, useEffect, useState } from 'react';
import { HostContext } from '../../../HostContext';
import './style.scss';

async function obterNiveisDeAcessoDaAPI(host) {
    const route = "/api/niveis_acesso/listar";
    const result = await fetch(host + route);
    const retorno = await result.json();
    return retorno;
}

function NiveisDeAcesso() {
    const [niveisAcesso, setNiveisAcesso] = useState([]); // Estado para armazenar os níveis de acesso
    const { hostUrl } = useContext(HostContext);

    useEffect(() => {
        obterNiveisDeAcessoDaAPI(hostUrl).then(niveis => {
            setNiveisAcesso(niveis); // Atualiza o estado com os dados da API
        }).catch(error => {
            console.error("Erro ao obter níveis de acesso:", error);
        });
    }, [hostUrl]);

    return (
        <table className="niveis-acesso-table">
            <thead className="niveis-acesso-table__header">
                <tr className="niveis-acesso-table__header-row">
                    <th className="niveis-acesso-table__header-cell">ID</th>
                    <th className="niveis-acesso-table__header-cell">Nome</th>
                    <th className="niveis-acesso-table__header-cell">Descrição</th>
                </tr>
            </thead>
            <tbody className="niveis-acesso-table__body">
                {niveisAcesso.map((nivel, index) => (
                    <tr key={index} className="niveis-acesso-table__body-row">
                        <td className="niveis-acesso-table__body-cell">{nivel.nva_id}</td>
                        <td className="niveis-acesso-table__body-cell">{nivel.nva_nome}</td>
                        <td className="niveis-acesso-table__body-cell">{nivel.nva_desc}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

export default NiveisDeAcesso;
