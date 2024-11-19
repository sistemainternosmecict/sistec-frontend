import PropTypes from 'prop-types';
import { useState, useContext } from "react";
import { HostContext } from "../../HostContext";
import AreaDeUsuarios from "../areaDeUsuarios";
import Nav from "../Nav";
import './style.scss';

function get_page(page_number){
    switch(page_number){
        case 1:
            return <section id="main_cadastro">
                <AreaDeUsuarios />
                </section>
        case 2:
            return <section id="main_listagem">
                {/* <ListagemColab/> */}
                </section>
        case 3:
            return <section id="main_cadastro">
                {/* <CadastroSolic/> */}
                </section>
        case 4:
            return <section id="main_listagem">
                {/* <ListagemSolic /> */}
                </section>
        case 5:
            return <section id="main_cadastro">
                {/* <CriarDemanda/> */}
            </section>
        case 6:
            return <section id="main_listagem">
                {/* <ListagemEntrada/> */}
            </section>
        case 7:
            return <section id="main_listagem">
                {/* <ListagemAtendimento/> */}
            </section>
        case 8:
            return <section id="main_listagem">
                {/* <ListagemArquivo/> */}
            </section>
        default:
            return <div id="btn_menu">
                <p>Bem vindo ao Sistec</p>
            </div>
    }
}

function Home({ usuario, setLoggedIn, setUsuario }) {
    const [page, setPage] = useState({pageN: 0, pageT: "Inicio"})
    const { hostUrl } = useContext(HostContext)
  
    return (
      <>
        <Nav host={hostUrl} setLoggedIn={setLoggedIn} setUsuario={setUsuario} setPage={setPage} pageText={page.pageT} usuario={usuario}/>
        {get_page(page.pageN)} 
      </>
    )
  }

  Home.propTypes = {
    usuario: PropTypes.object,
    setLoggedIn: PropTypes.func,
    setUsuario: PropTypes.func,
  }
  
  export default Home