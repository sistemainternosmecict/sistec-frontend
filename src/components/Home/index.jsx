import { useState, useContext } from "react";
import ButtonBase from "../ButtonBase";
import Nav from "../Nav";
import CadastroColab from "../CadastroColab";
import ListagemColab from "../ListagemColab";
import CadastroSolic from "../CadastroSolic";
import ListagemSolic from "../ListagemSolic";
import CriarDemanda from "../CriarDemanda";
import ListagemEntrada from "../ListagemEntrada";
import ListagemAtendimento from "../ListaAtendimento";
import ListagemArquivo from "../ListaArquivo";
import { HostContext } from "../../HostContext";
import './style.scss';

function get_page(page_number, usuario, setPage){
    switch(page_number){
        case 1:
            return <section id="main_cadastro">
                <CadastroColab/>
                </section>
        case 2:
            return <section id="main_listagem">
                <ListagemColab/>
                </section>
        case 3:
            return <section id="main_cadastro">
                <CadastroSolic/>
                </section>
        case 4:
            return <section id="main_listagem">
                <ListagemSolic />
                </section>
        case 5:
            return <section id="main_cadastro">
                <CriarDemanda/>
            </section>
        case 6:
            return <section id="main_listagem">
                <ListagemEntrada/>
            </section>
        case 7:
            return <section id="main_listagem">
                <ListagemAtendimento/>
            </section>
        case 8:
            return <section id="main_listagem">
                <ListagemArquivo/>
            </section>
        default:
            return <div id="btn_menu">
                <ButtonBase text="Registrar colaborador" func={{setPage}} page_number={1}/>
                <ButtonBase text="Listar colaboradores" func={{setPage}} page_number={2}/>
                <ButtonBase text="Registrar Solicitante" func={{setPage}} page_number={3}/>
                <ButtonBase text="Listar solicitantes" func={{setPage}} page_number={4}/>
                <ButtonBase text="Registrar demanda" func={{setPage}} page_number={5}/>
                <ButtonBase text="Lista de entrada" func={{setPage}} page_number={6}/>
                <ButtonBase text="Lista de atendimento" func={{setPage}} page_number={7}/>
                <ButtonBase text="Arquivo de demandas" func={{setPage}} page_number={8}/>
            </div>
    }
}

function Home({ usuario, setLoggedIn, setUsuario }) {
    const [page, setPage] = useState(0)
    const { hostUrl } = useContext(HostContext)
  
    return (
      <>
        <Nav host={hostUrl} setLoggedIn={setLoggedIn} setUsuario={setUsuario} setPage={setPage}/>
        {get_page(page, usuario, setPage)} 
        
      </>
    )
  }
  
  export default Home