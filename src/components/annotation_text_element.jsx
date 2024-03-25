import React from "react";

const AnnotationTextElement = ({id, i, s, setShowInfoCard}) => {
    var classList = 'text'
    if (s.includes('TREF]')){
        classList += ' target'
    }
    if (s.includes('REF]')) {
        classList += ' reference'
    }

    return(
        <>
            <span id={id + '_' + i} key={id + '_' + i} className={classList} onClick={()=>s.includes('REF]')&&setShowInfoCard(true)}>{s}</span>
            <span id={id + '_' + i + '_filler'} className="filler"> </span>
        </>
    )
}

export default AnnotationTextElement