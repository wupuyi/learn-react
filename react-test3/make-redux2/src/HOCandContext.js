import React, {Component} from 'react';
import PropTypes from 'prop-types'

const makeProvider = (myData) => {
  return (WrappedComponent) => {
    class NewComponent extends Component {
      static childContextTypes = {
        data: PropTypes.any
      }

      getChildContext () {
        return {
          data: myData
        }
      }

      render () {
        return <WrappedComponent />
      }
    }

    return NewComponent
  }
}

export default makeProvider