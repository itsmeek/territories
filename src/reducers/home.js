import {
  SAY_HELLO,
} from '../actions/types'


const INITIAL_STATE = {
  hello: null,
  data: null,
}

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SAY_HELLO:
      return { ...state, hello: action.payload }
    case 'SET_DATA':
      return { ...state, data: action.payload }
    default:
      return state
  }
}
