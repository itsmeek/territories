import _ from 'lodash'
import React, { Component } from 'react'
import TextField from 'material-ui/TextField'
import FlatButton from 'material-ui/FlatButton'
import Divider from 'material-ui/Divider'

import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { sayHello } from '../../actions'
import Format from './format'

class Copy extends Component {

  static propTypes = {
    home: PropTypes.object.isRequired,
  }

  _countForeign() {
    const { home: { data } } = this.props

    const spaces = Object.keys(data.foreignLanguage).filter(str => /\S/.test(str))
    return _.sum(spaces.map(street => data.foreignLanguage[street].length))
  }

  _renderForeign() {

    const { home: { data } } = this.props

    const filterAddress = (ad) => {
      const index = `${ad}`.indexOf('.')
      if (index === -1) { return ad }

      return `${ad}`.substring(index + 1)
    }
    
    const spaces = Object.keys(data.foreignLanguage).filter(str => /\S/.test(str))

    const data2 = spaces.map((street) => {
      const currentStreet = data.foreignLanguage[street]
      return currentStreet.map((ad, i) => {
        const strt = i === 0 ? street + '\t' : '\t'
        const end = i === currentStreet.length - 1 ? '\n' : ''
        console.log(i, currentStreet.length - 1, end)
        return `${strt}${filterAddress(ad.address)}\t${ad.lang}\t${end}`
      })
    })

    console.log("data2",data2)

    const exelify = array => array.join(',').replace(new RegExp(',', 'g'), '\n')
    return <TextField multiLine value={exelify(data2)} />
  }

  render() {
    const { home: { data } } = this.props

    const insert = (arr, index, newItem) => [
      ...arr.slice(0, index),
      newItem,
      ...arr.slice(index),
    ]

    const divide = (array) => {
      let finalArray = array
      array.forEach((element, i) => {
        if (i !== 0 && i % 27 === 0) {
          finalArray = insert(finalArray, i, '--------------')
        }
      })
      return finalArray
    }
    const exelify = array => array.join(',').replace(new RegExp(',', 'g'), '\n')

    const spaces = Object.keys(data.english).filter(str => /\S/.test(str))
    const foreignSpaces = Object.keys(data.foreignLanguage).filter(str => /\S/.test(str))
    spaces.shift()
    const newSpace = [data.english.territoryNumber, ...spaces]
    // const full = spaces.map(e => ({ [e]: data.english[e] }))
    const newEnglish = {}
    spaces.forEach(e => newEnglish[e] = _.sortBy(data.english[e], 'address'))
    // const spaces2 = spaces.map(e => _.sortBy(data.english[e], 'address'))

    console.log(data.english)
    console.log(newEnglish)
    
    const filterAddress = (ad) => {
      const index = `${ad}`.indexOf('.')
      if (index === -1) { return ad }

      return `${ad}`.substring(index + 1)
    }

    // cleanStreet = (street) => {

    //   street.map(d => {
    //     if ()
    //   })

    // }


    return (
      <div>
        <h3 style={{ color: 'gray' }}>{`FOREIGN LANGUAGES = ${this._countForeign()}`}</h3>
        <h1>STREETS</h1>
        <TextField multiLine value={exelify(newSpace)} />
        { spaces.map((street) => {
          const currentStreet = newEnglish[street]
          const data = currentStreet.map(ad => `${filterAddress(ad.address)}\t\t${ad.lang}\t${ad.comment}`)

          return (
            <div key={street}>
              <h3 style={{ color: 'gray' }}>{street}</h3>
              <div style={{ display: 'flex' }}>
                <TextField id={street} multiLine value={exelify(divide(data))} />
              </div>
            </div>
          )
        })}
        <h1 style={{ color: 'red' }}>FOREIGN LANGUAGE</h1>
        { this._renderForeign() }
      </div>
    )
  }
}

const mapStateToProps = ({ home }) => ({ home })

export default connect(mapStateToProps, { sayHello })(Copy)
