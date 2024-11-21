import { useEffect, useRef } from "react";
import PropTypes from 'prop-types'
import Usuario from "../Usuario";
import icone from '../../../assets/icone_processamento.png';
import './style.scss'

function ListagemUsuarios({ usuarios }){
    const blocs = useRef([])

    useEffect(() => {
        if(usuarios.length > 0){
            const lista = usuarios.map((usuario, index) => (
                <li key={index}>
                    <Usuario usuario={usuario}/>
                </li>
            ))
        
            const listao = <ul id="usuarios">
                {lista}
            </ul>
        
            blocs.current = listao
            console.log(blocs)
        }
    }, [usuarios])

    return (
        <>  
            <>
                {/* <div className="busca">
                    <input onInput={(e) => buscar(e.target.value, usuarios, setParaRenderizar)} type="text" placeholder="Pesquisar por nome, matrícula ou cpf"/>
                </div> */}

                {blocs.current}

                {(usuarios.length == 0) 
                ? <div className="aviso">Aguarde! Carregando usuários... <img className="iconeCarregamento" src={icone} alt="icone de carregamento" /> </div>
                : <></>}
            </>
        </>
    )
}

ListagemUsuarios.propTypes = {
    usuarios: PropTypes.array
}

export default ListagemUsuarios;