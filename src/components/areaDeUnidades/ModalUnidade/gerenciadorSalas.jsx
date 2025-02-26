import PropTypes from 'prop-types';

function extractFormData(elements) {
    const formData = {};
    
    for (let element of elements) {
        if ((element.tagName === 'INPUT' || element.tagName === 'SELECT') && element.name) {
            formData[element.name] = element.value;
        }
    }
    
    return formData;
}

function stageData(e, unidade){
    e.preventDefault()
    const form = e.target
    const elements = form.elements
    const uni_id = unidade.uni_id
    console.log(uni_id, extractFormData(elements))
}

function GerenciadorDeSala({ unidade }){
    return (
        <>

            <div className="container">
                <form className='salasForm' onSubmit={(e)=> stageData(e, unidade)}>
                    <div className="inputBox">
                        <select name="tipo_sala" id="tipo_sala" defaultValue="-">
                            <option value="-" disabled>Selecione o tipo de sala *</option>
                            <optgroup label='Administrativas'>
                                <option value="">Secretaria</option>
                                <option value="">Direção</option>
                                <option value="">Sala dos professores</option>
                                <option value="">Coordenação</option>
                                <option value="">OP / OE</option>
                            </optgroup>
                            <optgroup label='Pedagógicas'>
                                <option value="">Biblioteca</option>
                                <option value="">Sala de informática</option>
                                <option value="">Sala de vídeo</option>
                                <option value="">Sala de recurso</option>
                                <option value="">Sala PAE</option>
                                <option value="">Auditório</option>
                            </optgroup>
                        </select>
                    </div>

                    <input type="text" name="numero_sala" id="" placeholder='Numero da sala (se tiver)'/>
                    <input type="text" name="sala_andar" id="" placeholder='Andar em que se encontra'/>
                    <input type="text" name="largura_sala" id="" placeholder='Largura da sala (metros) *'/>
                    <input type="text" name="comprimento_sala" id="" placeholder='Comprimento da sala (metros) *'/>
                    <input type="text" name="qnt_entradas" id="" placeholder='Numero de entradas'/>
                    <input type="text" name="largura_porta" id="" placeholder='Largura da porta'/>
                    <input type="text" name="qnt_janelas" id="" placeholder='Quantidade de janelas'/>
                    <input type="text" name="qnt_tomadas" id="" placeholder='Quantidade de tomadas de energia'/>

                    <select name="internet" id="" defaultValue="-">
                        <option value="-" disabled>A sala possui internet?</option>
                        <option value="Sim">Sim</option>
                        <option value="Não">Não</option>
                    </select>

                    <input type="submit" value="Registrar nova sala" />
                </form>
            </div>
        </>
    )
}

GerenciadorDeSala.propTypes = {
    unidade: PropTypes.object
}

export default GerenciadorDeSala