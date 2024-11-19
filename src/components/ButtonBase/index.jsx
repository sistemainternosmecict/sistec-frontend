import './style.scss';

function ButtonBase({ text, func }){
    return (
        <>
            <button onClick={() => func.setMenuOpen(true)}>{text}</button>
        </>
    )
}

export default ButtonBase;