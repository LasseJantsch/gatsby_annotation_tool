export const getSelectedIds = () => {
    //extract selection
    const selection = window.getSelection()

    // check wheter selection was made
    if (selection.isCollapsed) {
        return null
    }

    //extract start and end of selection
     const start_id = Number(selection.anchorNode.parentNode.id.split('_')[1])
    const start_filler = selection.anchorNode.parentNode.id.includes('filler')
    const end_id = Number(selection.extentNode.parentNode.id.split('_')[1])
    const end_filler = selection.anchorNode.parentNode.id.includes('filler')

    console.log(start_filler, end_filler)

    // init ids array
    var ids = []
    start_id < end_id ? ids.push(...range(start_id, end_id, start_filler)): ids.push(...range(end_id, start_id, end_filler))
    return ids
}

export const range = (start, end, filler=false) => {
    const start_ = filler? start + 1: start
    console.log(start_)
    return Array.from({length: end +1 - start_}, (v, k) => k +  start_)
}