import { Component, Children } from 'react'
import PropTypes from 'prop-types'

interface IProps {
  i18n: object,
  children: object
}

export default class Provider extends Component<IProps> {
  static childContextTypes = {
    i18n: PropTypes.object
  }

  getChildContext () {
    return {
      i18n: this.props.i18n
    }
  }

  render () {
    return Children.only(this.props.children)
  }
}
