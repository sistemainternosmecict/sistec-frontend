import './style.scss';

function ButtonBase({ text, func, page_number }){
    return (
        <>
            <button onClick={() => func.setPage(page_number)}>{text}</button>
        </>
    )
}

export default ButtonBase;