import axios from 'axios'
import { SAY_HELLO } from './types'

export const sayHello = message => (dispatch) => {
  dispatch({
    type: SAY_HELLO,
    payload: message,
  })
}

export const setData = territoryID => (dispatch) => {
  axios.get(`http://localhost:3000/ai/${territoryID}`,  { crossdomain: true }).then(({ data }) => {
    dispatch({
      type: 'SET_DATA',
      payload: data,
    })
  })
}
