import PropTypes from 'prop-types';
import { useState, useContext, useEffect } from "react";
import { HostContext } from "../../HostContext";
import AreaDeUsuarios from "../areaDeUsuarios";
import AreaDeDemandas from '../areaDeDemandas';
import AreaDeDispositivos from '../areaDeDispositivos';
import AreaDeUnidades from '../areaDeUnidades';
import Documentos from '../areaDeDocumentos';
import Dashboard from './dashboard';
import Nav from "../Nav";
import './style.scss';

function get_page(page_number, data, setModalUsuariosAberto, setPaginaSecUsuario, paginaSecUsuario, modalUsuariosAberto, paginaAreaDemandas, setPaginaAreaDemandas, rapPermissao, setPage, setDashboardSelected, dashboardSelected, areaDispControl, areaUnidadesControl){
    switch(page_number){
        case 1:
            return <section id="main_cadastro">
                <AreaDeUsuarios setModalUsuariosAberto={setModalUsuariosAberto} setPaginaSecUsuario={setPaginaSecUsuario} paginaSecUsuario={paginaSecUsuario} modalUsuariosAberto={modalUsuariosAberto} rapPermissao={rapPermissao}/>
                </section>
        case 2:
            return <section id="main_cadastro">
                <AreaDeDemandas data={data} paginaAreaDemandas={paginaAreaDemandas} setPaginaAreaDemandas={setPaginaAreaDemandas} dashboardSelected={dashboardSelected}/>
                </section>
        case 3:
            return <section id="main_cadastro">
                <AreaDeDispositivos areaDispControl={areaDispControl} />
                </section>
        case 4:
            return <section id="main_cadastro">
                <AreaDeUnidades areaUnidadesControl={areaUnidadesControl}/>
                </section>
        case 5:
            return <section id="main_cadastro">
                <Documentos />
                </section>
        default:
            return <section id="dashboard">
                <Dashboard setPage={setPage} setDashboardSelected={setDashboardSelected} setPaginaAreaDemandas={setPaginaAreaDemandas}/>
            </section>
    }
}

function Home({ usuario, setLoggedIn, setUsuario, rapPermissao }) {
    const [page, setPage] = useState({pageN: 0, pageT: "Inicio"})
    const { hostUrl } = useContext(HostContext)
    const [mobile, setMobile] = useState(window.innerWidth <= 600)
    const [paginaSecUsuario, setPaginaSecUsuario] = useState(0)
    const [modalUsuariosAberto, setModalUsuariosAberto] = useState(false)
    const [paginaAreaDemandas, setPaginaAreaDemandas] = useState(0)
    const [dashboardSelected, setDashboardSelected] = useState(undefined)
    const [paginaAreaDispositivos, setPaginaAreaDispositivos] = useState(0)
    const [paginaAreaUnidades, setPaginaAreaUnidades] = useState(0)

    const areaDispControl = {paginaAreaDispositivos, setPaginaAreaDispositivos}
    const areaUnidadesControl = {paginaAreaUnidades, setPaginaAreaUnidades}

    useEffect(() => {
        function resize(){
            setMobile(window.innerWidth <= 600)
        }

        window.addEventListener('resize', resize)

        return () => window.removeEventListener('resize', resize)
    }, [])
  
    return (
      <>
        <Nav host={hostUrl} setLoggedIn={setLoggedIn} setUsuario={setUsuario} setPage={setPage} pageText={page.pageT} usuario={usuario} mobile={mobile} setPaginaSecUsuario={setPaginaSecUsuario} setModalUsuariosAberto={setModalUsuariosAberto} setPaginaAreaDemandas={setPaginaAreaDemandas} rapPermissao={rapPermissao} areaDispControl={areaDispControl} areaUnidadesControl={areaUnidadesControl}/>
        {get_page(page.pageN, {usuario, setLoggedIn, setUsuario}, setModalUsuariosAberto, setPaginaSecUsuario, paginaSecUsuario, modalUsuariosAberto, paginaAreaDemandas, setPaginaAreaDemandas, rapPermissao, setPage, setDashboardSelected, dashboardSelected, areaDispControl, areaUnidadesControl)} 
      </>
    )
  }

  Home.propTypes = {
    usuario: PropTypes.object,
    setLoggedIn: PropTypes.func,
    setUsuario: PropTypes.func,
    rapPermissao: PropTypes.array
  }
  
  export default Home