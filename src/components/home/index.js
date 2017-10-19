import React, { Component } from 'react'
import TextField from 'material-ui/TextField'
import FlatButton from 'material-ui/FlatButton'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { sayHello, setData } from '../../actions'
import Copy from './copy'

class Home extends Component {

  static propTypes = {
    sayHello: PropTypes.func.isRequired,
    setData: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      value: '',
    }
  }

  componentWillMount() {
    const { sayHello } = this.props
  }

  handleChange = (event) => {
    this.setState({
      value: event.target.value,
    })
  };

  formatValue = () => {
    this.props.setData(this.state.value)
  };


  render() {
    return (
      <div>
        <TextField
          hintText="Message Field"
          floatingLabelText="Enter Territory Number"
          fullWidth
          value={this.state.value}
          onChange={this.handleChange}
        />
        <FlatButton
          label="Get"
          backgroundColor="#a4c639"
          hoverColor="#8AA62F"
          onClick={this.formatValue}
        />
        { this.props.home.data && <Copy />}
      </div>
    )
  }
}

const mapStateToProps = ({ home }) => ({ home })

export default connect(mapStateToProps, { sayHello, setData })(Home)
