import React, {useEffect, useState} from "react";
import Header from "../components/header";
import '../css/style.css'
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import BackspaceIcon from '@mui/icons-material/Backspace';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import QuestionMarkTwoToneIcon from '@mui/icons-material/QuestionMarkTwoTone';
import KeyboardDoubleArrowLeftTwoToneIcon from '@mui/icons-material/KeyboardDoubleArrowLeftTwoTone';
import KeyboardDoubleArrowRightTwoToneIcon from '@mui/icons-material/KeyboardDoubleArrowRightTwoTone';
import CheckTwoToneIcon from '@mui/icons-material/CheckTwoTone';
import InfoCard from "../components/info_card";
import { getAnn, getPar } from "../api/api";
import { getSelectedIds } from "../helpers/annotation_helpers";
import AnnotationTextElement from "../components/annotation_text_element"
import { Link, navigate } from "gatsby";


const AnnotationPage = ({params}) => {
    const title = 'Sentence-BERT: Sentence Embeddings using Siamese BERT-Networks'
    const authors = ['Nils Reimers', 'Iryna Gurevych']
    const pub_year = '2019'
    const abstract = `BERT (Devlin et al., 2018) and RoBERTa (Liu et al., 2019) has set a new state-of-the-art performance on sentence-pair regression tasks like semantic textual similarity (STS). However, it requires that both sentences are fed into the network, which causes a massive computational overhead: Finding the most similar pair in a collection of 10,000 sentences requires about 50 million inference computations (~65 hours) with BERT. The construction of BERT makes it unsuitable for semantic similarity search as well as for unsupervised tasks like clustering.
    In this publication, we present Sentence-BERT (SBERT), a modification of the pretrained BERT network that use siamese and triplet network structures to derive semantically meaningful sentence embeddings that can be compared using cosine-similarity. This reduces the effort for finding the most similar pair from 65 hours with BERT / RoBERTa to about 5 seconds with SBERT, while maintaining the accuracy from BERT.
    We evaluate SBERT and SRoBERTa on common STS tasks and transfer learning tasks, where it outperforms other state-of-the-art sentence embeddings methods.`

    const [id, setId] = useState()
    const [ann, setAnn] = useState()
    const [next, setNext] = useState()
    const [prev, setPrev] = useState()
    const [par, setPar] = useState()
    const [unsafedChanges, setUnsafedChanges] = useState(false)
    const [toolStatus, setToolStatus] = useState('mark_tool')
    const [showInfoCard, setShowInfoCard] = useState(true)
    const [annotation, setAnnotation] = useState([])


    // get query form Url on mount
    useEffect(()=>{
        console.log(params)
        setId(decodeURIComponent(params.id))
    },[params])

    //set unmount event listener
    useEffect(() => {
        const handleBeforeUnload = (event) => {
            // Perform actions before the component unloads
            event.preventDefault();
            event.returnValue = '';
          };
          window.addEventListener('beforeunload', handleBeforeUnload);
          return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
          };    
        }, []);

    // add keyboard compatibility 
    useEffect(()=>{
        const handleKeyPress = (event) => {
            document.activeElement.blur()
            switch (event.code){
                case 'Digit1':
                    setToolStatus('mark_tool')
                    break
                case 'Digit2':
                    setToolStatus('erase_tool')
                    break
                case 'Digit5':
                    handleResetAnnotation()
                    document.getElementById('reset_button').classList.add('active')
                    setTimeout(() => {
                        document.getElementById('reset_button').classList.remove('active')
                    }, "200");
                    break
                case 'Space':
                    setShowInfoCard(prev => !prev)
                    break
            }
        }
        document.addEventListener('keypress', handleKeyPress)
        return () => {
            document.removeEventListener('keypress', handleKeyPress);
            document.removeEventListener('keyup', (e)=>e.preventDefault()) 
            document.removeEventListener('keydown', (e)=>e.preventDefault())

          }; 
    },[])

    // get Ann when id is updated
    useEffect(()=>{
        if (id) {
            setAnn(getAnn(id))
            setNext(getAnn(`ID${Number(id.slice(2))+1}`))
            setPrev(getAnn(`ID${Number(id.slice(2))-1}`))
        }
        console.log(id)
    },[id])

    //get par for id
    useEffect(()=>{
        if(ann){
            let fetched_par = getPar(ann['par_id'])
            fetched_par['data'][ann['ref_loc']] = '[TREF]'
            setPar(fetched_par)
        }
        console.log(ann)
    },[ann])

    //manipulate ref tag
    useEffect(()=>{
        console.log(par)
    },[par])

    useEffect(()=>{
        if (document.getElementById('erase_tool')) {
            switch (toolStatus) {
                case 'mark_tool':
                    document.getElementById('mark_tool').className = 'active'
                    document.getElementById('erase_tool').classList.remove('active')  
                    break
                case 'erase_tool':
                    document.getElementById('mark_tool').classList.remove('active')
                    document.getElementById('erase_tool').className = 'active'  
                    break
            }
        }
    }, [toolStatus])

    useEffect(()=>{
        par && Array(par.data.length).keys().forEach(i => {
            if(annotation.includes(i)){
                !document.getElementById(`${id}_${i}`).classList.contains('marked') && document.getElementById(`${id}_${i}`).classList.add('marked')
            } else {
                document.getElementById(`${id}_${i}`).classList.contains('marked') && document.getElementById(`${id}_${i}`).classList.remove('marked') 
            }
        })
    },[annotation])


    const handleToolChange = (e) => {
        setToolStatus(e.target.id)
    }

    const handleResetAnnotation = () => {
        setToolStatus('mark_tool')
        setAnnotation([])
    }

    const handleMark = () =>{
        const selected_ids = getSelectedIds()
        if (!selected_ids) {return}
        switch (toolStatus) {
            case 'mark_tool':
                setAnnotation(prev => {
                    var add_ids =  []
                    selected_ids.forEach(id => {
                        !prev.includes(id) && add_ids.push(id)
                    })
                    return [...prev, ...add_ids]
                })
                break
            case 'erase_tool':
                setAnnotation(prev => prev.filter(id => !selected_ids.includes(id)))
        }
        window.getSelection().removeAllRanges()
    }
    const handlePrev = () => {
        prev? navigate('/annotation/' + encodeURIComponent(`ID${Number(id.slice(2))-1}`)):
        navigate('/')
    }
    const handleSkipp = () => {
        next ? navigate('/annotation/' + encodeURIComponent(`ID${Number(id.slice(2))+1}`)):
        navigate('/')
    }
    const handleSub = () => {
        next ? navigate('/annotation/' + encodeURIComponent(`ID${Number(id.slice(2))+1}`)):
        navigate('/')
    }
    return (
        <div className="annotation_site_container" onMouseUp={handleMark}>
            <Header title='ANNOTATION' show_menu={false}/>
            <div className="annotation_container">
                {ann && par &&
                <div className="work_area_container">
                    <div className="tools_container">
                        <div className="mark_erase_container">
                            <button id='mark_tool' className="active" onClick={handleToolChange}>
                                <DriveFileRenameOutlineIcon className="mark_button_icon"/>
                            </button>
                            <button id="erase_tool" className="" onClick={handleToolChange}>
                                <BackspaceIcon className="erase_button_icon" />
                            </button>
                        </div>
                        <div className="reset_button_container">
                            <button id="reset_button" className="reset_button" onClick={handleResetAnnotation}>
                                <RestartAltIcon className="reset_button_icon"/>
                            </button>
                        </div>
                    </div>
                    <div className="annotation_text_container" >
                        <div className="annotation_text">
                            {par['data'].map((s,i) => <AnnotationTextElement id={id} i={i} s={s} setShowInfoCard={setShowInfoCard}/>)}
                        </div>
                    </div>
                    <div className="info_container">
                            {showInfoCard && 
                            <InfoCard 
                                title ={title}
                                authors={authors}
                                pub_year={pub_year}
                                abstract={abstract}
                                setShowInfoCard={setShowInfoCard}
                            />}
                    </div>
                </div>
                }
                <div className="navigation_container">
                    <div className="help_button_container">
                        <button className="help_button" >
                            <QuestionMarkTwoToneIcon className="help_button_icon"/>
                        </button>
                    </div>
                    <div className="prev_skip_button_container">
                        <button className="prev_button" onClick={handlePrev}>
                            <KeyboardDoubleArrowLeftTwoToneIcon className="prev_button_icon"/>
                            <span className="prev_button_label">Prev</span>
                        </button>
                        <button className="skip_button" onClick={handleSkipp}>
                            <span className="skip_button_laber">Skip</span>
                            <KeyboardDoubleArrowRightTwoToneIcon className="skip_button_icon" />
                        </button>
                    </div>
                    <div className="submit_button_container">
                        <button className="submit_button" onClick={handleSub}>
                            <CheckTwoToneIcon className="submit_button_icon"/>
                        </button>
                    </div>
                </div>

            </div>
        </div>
    )
}
export default AnnotationPage