
const parse = (data) => {
  const activeArray = []

  let activeObject = {
    street: '',
    houses: [],
  }

  data.map((x, i) => {
    const addr = x.text['#text']

    if (addr && addr.indexOf('Street:') !== -1) {
      if (activeObject.street) {
        activeArray.push(activeObject)
        activeObject = {
          street: '',
          houses: [],
        }
      }
      activeObject.street = addr.slice(addr.indexOf(': ') + 2)
    } else if (!isNaN(addr) && activeObject.street) {
      activeObject.houses.push(addr)
    } else if ((data.length === i + 1)) {
      activeArray.push(activeObject)
    }
  })

  return activeArray
}


const Format = (doc) => {
  const obj = JSON.parse(doc)
  return obj.document.page.map((b) => {
    let x = []
    if (b.row.constructor === Array) {
      x = b.row
    } else {
      x = [b.row]
    }

    const y = x.map(v => parse(v.column))
    return y
  })
}


export default Format
