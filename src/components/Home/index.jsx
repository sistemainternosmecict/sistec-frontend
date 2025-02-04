import PropTypes from 'prop-types';
import { useState, useContext, useEffect } from "react";
import { HostContext } from "../../HostContext";
import AreaDeUsuarios from "../areaDeUsuarios";
import AreaDeDemandas from '../areaDeDemandas';
import Documentos from '../areaDeDocumentos';
import Dashboard from './dashboard';
import Nav from "../Nav";
import './style.scss';

function get_page(page_number, data, setModalUsuariosAberto, setPaginaSecUsuario, paginaSecUsuario, modalUsuariosAberto, paginaAreaDemandas, setPaginaAreaDemandas, rapPermissao){
    switch(page_number){
        case 1:
            return <section id="main_cadastro">
                <AreaDeUsuarios setModalUsuariosAberto={setModalUsuariosAberto} setPaginaSecUsuario={setPaginaSecUsuario} paginaSecUsuario={paginaSecUsuario} modalUsuariosAberto={modalUsuariosAberto} rapPermissao={rapPermissao}/>
                </section>
        case 2:
            return <section id="main_cadastro">
                <AreaDeDemandas data={data} paginaAreaDemandas={paginaAreaDemandas} setPaginaAreaDemandas={setPaginaAreaDemandas}/>
                </section>
        case 3:
            return <section id="main_cadastro">
                <Documentos />
                </section>
        case 4:
            return <section id="main_cadastro">
                {/* Inventário */}
                </section>
        default:
            return <div id="btn_menu">
                <Dashboard />
            </div>
    }
}

function Home({ usuario, setLoggedIn, setUsuario, rapPermissao }) {
    const [page, setPage] = useState({pageN: 0, pageT: "Inicio"})
    const { hostUrl } = useContext(HostContext)
    const [mobile, setMobile] = useState(window.innerWidth <= 600)
    const [paginaSecUsuario, setPaginaSecUsuario] = useState(0)
    const [modalUsuariosAberto, setModalUsuariosAberto] = useState(false)
    const [paginaAreaDemandas, setPaginaAreaDemandas] = useState(0)

    useEffect(() => {

        function resize(){
            setMobile(window.innerWidth <= 600)
        }

        window.addEventListener('resize', resize)

        return () => window.removeEventListener('resize', resize)
    }, [])
  
    return (
      <>
        <Nav host={hostUrl} setLoggedIn={setLoggedIn} setUsuario={setUsuario} setPage={setPage} pageText={page.pageT} usuario={usuario} mobile={mobile} setPaginaSecUsuario={setPaginaSecUsuario} setModalUsuariosAberto={setModalUsuariosAberto} setPaginaAreaDemandas={setPaginaAreaDemandas} rapPermissao={rapPermissao}/>
        {get_page(page.pageN, {usuario, setLoggedIn, setUsuario}, setModalUsuariosAberto, setPaginaSecUsuario, paginaSecUsuario, modalUsuariosAberto, paginaAreaDemandas, setPaginaAreaDemandas, rapPermissao)} 
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