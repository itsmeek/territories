/**
 * Created by Meek on 3/29/17.
 */
const _ = require('lodash')
const express = require('express')
const request = require('request')
const cheerio = require('cheerio')

const router = express.Router()

router
    .route('/ai/:territoryId')
    .get((req, res) => {
      const terID = req.params.territoryId

      const options = {
        method: 'GET',
        url: 'http://kpt.smartlydriven.com/addressListing.php',
        qs: { terID, accept: 'Submit' },
        headers: {
          'postman-token': '1b7f7cfc-da2d-9991-b088-d3c04290cf9b',
          'cache-control': 'no-cache',
          cookie: 'PHPSESSID=c2v1do2g0pduj25mu8emsje1t2',
        },
      }


      const territorySchema = {}
      const foreignLanguageSchema = {}

      request(options, (error, response, body) => {
        if (error) throw new Error(error)
        const $ = cheerio.load(body)
        const territoryNumber = $('tr td #topheader thead tr th', '#display').last().text().slice(5)
        territorySchema.territoryNumber = territoryNumber

        $('tr', '#display').each(function () {
          const main = $(this).html()

          const name = $('#topheader thead tr th', main).first().text()
          const streetName = name.slice(8)
          // console.log(streetName);
          if (!territorySchema[streetName]) {
            territorySchema[streetName] = []
          }

          if (!foreignLanguageSchema[streetName]) {
            foreignLanguageSchema[streetName] = []
          }

          const pushSchema = (schema) => {
            if (territorySchema[streetName]) {
              territorySchema[streetName].push(schema)
            } else {
              territorySchema[streetName] = []
              territorySchema[streetName].push(schema)
            }
          }

          const pushForeignSchema = (schema) => {
            if (foreignLanguageSchema[streetName]) {
              foreignLanguageSchema[streetName].push(schema)
            } else {
              foreignLanguageSchema[streetName] = []
              foreignLanguageSchema[streetName].push(schema)
            }
          }

          const indexFound = (addr) => {
            const value = territorySchema[streetName].map(o => o.address).indexOf(addr)
            if (value === -1) {
              return false
            }
            return true
          }

          const foreignIndexFound = (addr) => {
            const value = foreignLanguageSchema[streetName].map(o => o.address).indexOf(addr)
            if (value === -1) {
              return false
            }
            return true
          }
          // territorySchema[streetName]['doors'] = [];

          const isForeignLanguage = (lang) => {
            if (lang !== 'English' && lang !== 'Unknown' && lang !== '') {
              return true
            }
            return false
          }

          const determineFormat = (address, apt) => {
            const form = `${address}.${apt}`
            const isOver = apt.length > 2
            if (apt && _.isNumber(parseFloat(form))) {
              const floatNum = parseFloat(form)
              return form
            }
            return apt
          }

          $('tbody tr', this).each(function () {
            const doorSchema = {}
            const data = $(this).html()
            const address = parseInt($('td', data).first().text(), 10)
            const bldg = $('td', data).eq(1).text()
            const crptApt = $('td', data).eq(2).text()
            const apt = determineFormat(address, crptApt)
            // const apt = crptApt ? `${address}-${crptApt}` : ''
            const lang = $('td', data).eq(3).text()
            const comment = $('td', data).eq(4).text()
            const myTerritory = territorySchema[streetName]
            const myForeignTerritory = foreignLanguageSchema[streetName]

            if (streetName === 'Delmas Ave' && address === 892) {
              console.log(address)
            }


            // if (isForeignLanguage(lang)) {
            //   console.log(lang);
            // }

            if (!apt && lang !== 'English' && (lang === 'Unknown' || lang === '')) {
              doorSchema.address = address
              doorSchema.lang = '?'
              doorSchema.comment = comment
              pushSchema(doorSchema)
            } else if (apt && !bldg && lang === 'English') {
              if (!myTerritory || !indexFound(address)) {
                doorSchema.address = address
                doorSchema.lang = ''
                doorSchema.comment = comment
                pushSchema(doorSchema)
                const newDoorSchema = Object.assign({}, doorSchema, { address: apt, lang: 'E', comment })
                pushSchema(newDoorSchema)
              } else if (myTerritory && !indexFound(address)) {
                doorSchema.address = address
                doorSchema.lang = ''
                doorSchema.comment = comment
                pushSchema(doorSchema)
                const newDoorSchema = Object.assign({}, doorSchema, { address: apt, lang: 'E', comment })
                pushSchema(newDoorSchema)
              } else if (myTerritory && indexFound(address)) {
                const index = _.findIndex(myTerritory, { address })
                myTerritory.splice(index, 1, { address, lang: '', comment })
                
                doorSchema.address = apt
                doorSchema.lang = 'E'
                doorSchema.comment = comment
                pushSchema(doorSchema)
              }
            } else if (apt && bldg && lang === 'English') {
              if (!myTerritory || !indexFound(address)) {
                doorSchema.address = address
                doorSchema.lang = ''
                doorSchema.comment = comment
                pushSchema(doorSchema)
                const newDoorSchema = Object.assign({}, doorSchema, { address: `${bldg}#${apt}`, lang: 'E', comment })
                pushSchema(newDoorSchema)
              } else if (myTerritory && !indexFound(address)) {
                doorSchema.address = address
                doorSchema.lang = ''
                doorSchema.comment = comment
                pushSchema(doorSchema)
                const newDoorSchema = Object.assign({}, doorSchema, { address: `${bldg}#${apt}`, lang: 'E', comment })
                pushSchema(newDoorSchema)
              } else if (myTerritory && indexFound(address)) {
                doorSchema.address = `${bldg}#${apt}`
                doorSchema.lang = 'E'
                doorSchema.comment = comment
                pushSchema(doorSchema)
              }
            } else if (apt && !bldg && lang !== 'English' && (lang === 'Unknown' || lang === '')) {
              if (!myTerritory || !indexFound(address)) {
                doorSchema.address = address
                doorSchema.lang = ''
                doorSchema.comment = comment
                pushSchema(doorSchema)
                const newDoorSchema = Object.assign({}, doorSchema, { address: apt, lang: '?', comment })
                pushSchema(newDoorSchema)
              } else if (myTerritory && !indexFound(address)) {
                doorSchema.address = address
                doorSchema.lang = ''
                doorSchema.comment = comment
                pushSchema(doorSchema)
                const newDoorSchema = Object.assign({}, doorSchema, { address: apt, lang: '?', comment })
                pushSchema(newDoorSchema)
              } else if (myTerritory && indexFound(address)) {
                const index = _.findIndex(myTerritory, { address })
                myTerritory.splice(index, 1, { address, lang: '', comment })

                doorSchema.address = apt
                doorSchema.lang = '?'
                doorSchema.comment = comment
                pushSchema(doorSchema)
              }
            } else if (apt && bldg && lang !== 'English' && (lang === 'Unknown' || lang === '')) {
              if (!myTerritory || !indexFound(address)) {
                doorSchema.address = address
                doorSchema.lang = ''
                doorSchema.comment = comment
                pushSchema(doorSchema)
                const newDoorSchema = Object.assign({}, doorSchema, { address: `${bldg}#${apt}`, lang: '?', comment })
                pushSchema(newDoorSchema)
              } else if (myTerritory && !indexFound(address)) {
                doorSchema.address = address
                doorSchema.lang = ''
                doorSchema.comment = comment
                pushSchema(doorSchema)
                const newDoorSchema = Object.assign({}, doorSchema, { address: `${bldg}#${apt}`, lang: '?', comment })
                pushSchema(newDoorSchema)
              } else if (myTerritory && indexFound(address)) {
                const index = _.findIndex(myTerritory, { address })
                myTerritory.splice(index, 1, { address, lang: '', comment })

                doorSchema.address = `${bldg}#${apt}`
                doorSchema.lang = '?'
                doorSchema.comment = comment
                pushSchema(doorSchema)
              }
            } else if (!apt && !bldg && lang === 'English') {
              if (!myTerritory || !indexFound(address)) {
                doorSchema.address = address
                doorSchema.lang = 'E'
                doorSchema.comment = comment
                pushSchema(doorSchema)
              } else if (myTerritory && !indexFound(address)) {
                doorSchema.address = address
                doorSchema.lang = ''
                doorSchema.comment = comment
                pushSchema()
              }
            } else if (!apt && isForeignLanguage(lang)) {
              // TODO: FOREGIN LANGUAGE
              doorSchema.address = address
              doorSchema.lang = lang
              doorSchema.comment = comment
              pushForeignSchema(doorSchema)
            } else if (apt && !bldg && isForeignLanguage(lang)) {
              if (!foreignLanguageSchema || !foreignIndexFound(address)) {
                doorSchema.address = address
                doorSchema.lang = lang
                doorSchema.comment = comment
                pushForeignSchema(doorSchema)
                const newDoorSchema = Object.assign({}, doorSchema, { address: apt, lang, comment })
                pushForeignSchema(newDoorSchema)
              } else if (myForeignTerritory && !foreignIndexFound(address)) {
                doorSchema.address = address
                doorSchema.lang = lang
                doorSchema.comment = comment
                pushForeignSchema(doorSchema)
                const newDoorSchema = Object.assign({}, doorSchema, { address: apt, lang, comment })
                pushForeignSchema(newDoorSchema)
              } else if (myForeignTerritory && foreignIndexFound(address)) {
                const index = _.findIndex(myForeignTerritory, { address })
                myForeignTerritory.splice(index, 1, { address, lang: '', comment })

                doorSchema.address = apt
                doorSchema.lang = lang
                doorSchema.comment = comment
                pushForeignSchema(doorSchema)
              }
            } else if (apt && bldg && isForeignLanguage(lang)) {
              if (!myForeignTerritory || !foreignIndexFound(address)) {
                doorSchema.address = address
                doorSchema.lang = lang
                doorSchema.comment = comment
                pushForeignSchema(doorSchema)
                const newDoorSchema = Object.assign({}, doorSchema, { address: `${bldg}#${apt}`, lang, comment })
                pushForeignSchema(newDoorSchema)
              } else if (myForeignTerritory && !foreignIndexFound(address)) {
                doorSchema.address = address
                doorSchema.lang = lang
                doorSchema.comment = comment
                pushForeignSchema(doorSchema)
                const newDoorSchema = Object.assign({}, doorSchema, { address: `${bldg}#${apt}`, lang, comment })
                pushForeignSchema(newDoorSchema)
              } else if (myForeignTerritory && foreignIndexFound(address)) {
                const index = _.findIndex(myForeignTerritory, { address })
                myForeignTerritory.splice(index, 1, { address, lang: '', comment })

                doorSchema.address = `${bldg}#${apt}`
                doorSchema.lang = lang
                doorSchema.comment = comment
                pushForeignSchema(doorSchema)
              }
            } else if (apt && !bldg && isForeignLanguage(lang)) {
              if (!myForeignTerritory || !foreignIndexFound(address)) {
                doorSchema.address = address
                doorSchema.lang = lang
                doorSchema.comment = comment
                pushForeignSchema(doorSchema)
                const newDoorSchema = Object.assign({}, doorSchema, { address: apt, lang, comment })
                pushForeignSchema(newDoorSchema)
              } else if (myForeignTerritory && !foreignIndexFound(address)) {
                doorSchema.address = address
                doorSchema.lang = lang
                doorSchema.comment = comment
                pushForeignSchema(doorSchema)
                const newDoorSchema = Object.assign({}, doorSchema, { address: apt, lang, comment })
                pushForeignSchema(newDoorSchema)
              } else if (myForeignTerritory && indexFound(address)) {
                const index = _.findIndex(myForeignTerritory, { address })
                myForeignTerritory.splice(index, 1, { address, lang: '', comment })

                doorSchema.address = apt
                doorSchema.lang = lang
                doorSchema.comment = comment
                pushForeignSchema(doorSchema)
              }
            }
          })


          // street.each(function(params) {
          //   const streetName = $('#topheader thead th', 'td').text()
          //   console.log(streetName);
          // })
        })

        res.status(200).json({ english: territorySchema, foreignLanguage: foreignLanguageSchema })
      })
    })


module.exports = router
