import CriarDemanda from "../FormExterno";
import './style.scss';

export default function Inicio({ setPgInicial }){
    return (
        <>
            <CriarDemanda />
            <div className="rodape">
                <button onClick={() => setPgInicial(false)}>Login para admin</button>
            </div>
        </>
    )
}