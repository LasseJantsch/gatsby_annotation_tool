import React, { useEffect, useState } from "react";
import Header from "../components/header";
import '../css/style.css'
import TableEntry from "../components/table_entry";
import { getAnns, getUser } from "../api/api";
import { useStaticQuery, graphql } from "gatsby"

const Dashboard = () => {

    const [user, setUser] = useState()
    const [anns, setAnns] = useState()
    const [total, setTotal] = useState(1)
    const [annotaded, setAnnotaded] =useState(0)
    const [skipped, setSkipped] = useState(0)

    const data = useStaticQuery(graphql`
        query UserQuery {
            allMysqlUsers(filter: {mysqlId: {eq: 1}}) {
            edges {
                node {
                name
                annotations {
                    mysqlId
                    ref_id
                    status
                }
                }
            }
            }
        }
    `)
    console.log(data)

    useEffect(()=>{
        setUser(getUser('ID90000'))
    },[])

    useEffect(()=>{
        user && setAnns(getAnns(user['annotations']))
    }, [user])

    useEffect(()=>{
        anns && calc_progress(anns)
    },[anns])

    const calc_progress = (anns) => {
        const keys = Object.keys(anns)
        setTotal(keys.length)
        let ann_count = 0
        let ski_count = 0
        keys.forEach(key =>{
            anns[key]['status'] === 'annotaded'? ann_count++ : (anns[key]['status'] === 'skipped' && ski_count++)
        })
        setAnnotaded(ann_count)
        setSkipped(ski_count)
    }


    return(
        <div id="overview_site_container">
            <Header title={'OVERVIEW'} />
            <div id="overview_contatiner">
                <div id="progress_container">
                    <div id="progress_title">Progress</div>
                    {total &&
                    <div id="progress_bar_container">
                        <div id="progress_bar_annotaded" className="progress_bar" style={{width: `${740 * annotaded/total}px`}}></div>
                        <div id="progress_bar_skipped" className="progress_bar" style={{width:`${740 * skipped/total}px`}}></div>
                        <div id="pogress_bar_outstanding" className="progress_bar" style={{width:`${740 * (total-annotaded-skipped)/total}px`}}></div>
                    </div>}
                </div>
                <div id="table_container">
                    <div id="table_header_container">
                        <button id="id_header" className="table_header_label">ID</button>
                        <button id="status_header" className="table_header_label">Status</button>
                        <button id="annotation_count_header" className="table_header_label">Count</button>
                        <button id="action_header" className="table_header_label"> </button>
                    </div> 
                    <div id="table_content_container">
                        {anns &&
                        Object.keys(anns).map((key) => {
                              return(
                                <TableEntry 
                                    id={key}
                                    status={anns[key]['status']}
                                    count={'0'}
                                />
                              );
                        })}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Dashboard