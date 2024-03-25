import pars from '../data/pars.json'
import refs from '../data/refs.json'
import users from '../data/users.json'
import ann from '../data/ann.json'

export const getUsers = () => {
    return users['data']
}
export const getUser = (id) => {
    return users['data'][id]
}

export const getAnn = (id) => {
    return ann['data'][id]
}
export const getAnns = (ids) =>{
    var res = {}
    ids.forEach(id => {
         res[id] = ann['data'][id]
    })
    return res
}

export const getPar = (id) => {
    return pars['data'][id]
}

export const getRefs = (id) => {
    return refs['data'][id]
}