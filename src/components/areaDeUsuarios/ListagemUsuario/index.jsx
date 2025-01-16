import PropTypes from 'prop-types'
import icone from '../../../assets/icone_processamento.png';
import './style.scss'

function ListagemUsuarios({ elements }){
    return (
        <>  
            <>
                {(elements.length === 0) 
                ? <div className="aviso">Aguarde! Carregando usuários... <img className="iconeCarregamento" src={icone} alt="icone de carregamento" /> </div>
                : elements}
            </>
        </>
    )
}

ListagemUsuarios.propTypes = {
    elements: PropTypes.array.isRequired
}

export default ListagemUsuarios;