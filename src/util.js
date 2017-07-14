import { TWILIO, PLIVO, MESSAGE_BIRD, BAND_WIDTH, NEXMO } from './colors'

const companies = ['twilio', 'plivo', 'messagebird', 'bandwidth', 'nexmo']

export const renderCompanyColor = (company) => {
  switch (company.toLowerCase()) {
    case companies[0]:
      return TWILIO
    case companies[1]:
      return PLIVO
    case companies[2]:
      return MESSAGE_BIRD
    case companies[3]:
      return BAND_WIDTH
    case companies[4]:
      return NEXMO
    default:
      return 'purple'
  }
}
