import PropTypes from 'prop-types';
import CategoriasDispositivos from './CategoriasDispositivos';
import NovaCategoria from './NovaCategoria'
import NovoDispositivo from './NovoDispositivo';
import Dispositivos from './Dispositivos';
import ModalDisp from './ModalDisp';
import { useEffect, useState } from 'react';
import "./style.scss"

function carregar_bloco( areaDispControl, selectedDevice, setSelectedDevice ){
    switch(areaDispControl.paginaAreaDispositivos){
        case 0:
            return <CategoriasDispositivos/>
        case 1:
            return <NovaCategoria areaDispControl={areaDispControl} />
        case 2:
            return <Dispositivos areaDispControl={areaDispControl} selectedDevice={selectedDevice} setSelectedDevice={setSelectedDevice}/>
        case 3:
            return <NovoDispositivo areaDispControl={areaDispControl} />
        case 4:
            return <ModalDisp dispositivo={selectedDevice} />
    }
}

function AreaDeDispositivos({ areaDispControl }){
    const [selectedDevice, setSelectedDevice] = useState(undefined)

    useEffect(() => {
        return () => {
            areaDispControl.setPaginaAreaDispositivos(2)
            setSelectedDevice(undefined)
        }
    },[])

    return (
        <>
            <section id="area_de_dispositivos">
                <aside className='menuAreaDispositivos'>
                    <div className='btnGroup'>
                        <button onClick={() => {
                            areaDispControl.setPaginaAreaDispositivos(0)
                        }}>Categorias de dispositivos</button>
                        <button onClick={() => {
                            areaDispControl.setPaginaAreaDispositivos(1)
                        }}>Nova categoria de dispositivo</button>
                        <button onClick={() => {
                            areaDispControl.setPaginaAreaDispositivos(2)
                        }}>Dispositivos</button>
                        <button onClick={() => {
                            areaDispControl.setPaginaAreaDispositivos(3)
                        }}>Novo Dispositivo</button>
                    </div>
                </aside>

                <main>
                    {carregar_bloco(areaDispControl, selectedDevice, setSelectedDevice)}
                </main>
            </section>
        </>
    )
}

AreaDeDispositivos.propTypes = {
    areaDispControl: PropTypes.object
}

export default AreaDeDispositivos