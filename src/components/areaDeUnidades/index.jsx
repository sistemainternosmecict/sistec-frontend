import './style.scss'
import PropTypes from 'prop-types';
import ListaUnidades from './listaUnidades';
import RegistroUnidade from './registroUnidade';
import ModalUnidade from './ModalUnidade';
import { useEffect, useState } from 'react';

function carregar_bloco( areaUnidadesControl, unidadeSelecionadaCtl ){
    switch(areaUnidadesControl.paginaAreaUnidades){
        case 0:
            return <ListaUnidades areaUnidadesControl={areaUnidadesControl} setUnidadeSelecionada={unidadeSelecionadaCtl.setUnidadeSelecionada}/>
        case 1:
            return <RegistroUnidade/>
        case 3:
            return <ModalUnidade unidade={unidadeSelecionadaCtl.unidadeSelecionada} setPaginaAreaUnidades={areaUnidadesControl.setPaginaAreaUnidades}/>
    }
}

function AreaDeUnidades({areaUnidadesControl}){
    const [unidadeSelecionada, setUnidadeSelecionada] = useState(undefined)
    const unidadeSelecionadaCtl = {unidadeSelecionada, setUnidadeSelecionada}

    useEffect(() => {
        return () => {
            areaUnidadesControl.setPaginaAreaUnidades(0)
            setUnidadeSelecionada(undefined)
        }
    },[])

    return (
        <>
            <section id="area_de_unidades">
                <aside className="menuAreaUnidades">
                    <div className="btnGroup">
                        <button onClick={() => {
                            areaUnidadesControl.setPaginaAreaUnidades(0)
                        }}>Todas as Unidades</button>
                        <button onClick={() => {
                            areaUnidadesControl.setPaginaAreaUnidades(1)
                        }}>Registrar nova Unidade</button>
                    </div>
                </aside>

                <main className='mainContent'>
                    {carregar_bloco(areaUnidadesControl, unidadeSelecionadaCtl)}
                </main>
            </section>
        </>
    )
}

AreaDeUnidades.propTypes = {
    areaUnidadesControl: PropTypes.object
}

export default AreaDeUnidades;