import React, { Component, createRef } from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'
import { debounce } from 'lodash'

import Link from '../../elements/Link/Link'
import Icon from '../../elements/Icon/Icon'
import Checkbox from '../../elements/Checkbox/Checkbox'

import ActionbarGroup from './ActionbarGroup/ActionbarGroup'

import './Actionbar.scss'

/**
 * Вид Actionbar
 */
class Actionbar extends Component {
  constructor (props) {
    super(props)
    this.barRef = createRef()
  }

  static propTypes = {
    /**
     * Внутренние компоненты
     */
    children: PropTypes.node,
    /**
     * Отображение панели
     */
    visible: PropTypes.bool,
    onChange: PropTypes.func,
    checked: PropTypes.bool,
    onClose: PropTypes.func
  }

  static defaultProps = {
    visible: true
  }

  state = {
    style: {}
  }

  static Group = ActionbarGroup

  componentDidMount () {
    this.getPosition()
    window.addEventListener('resize', debounce(this.getPosition, 50))
  }

  componentWillUnmount () {
    window.removeEventListener('resize', debounce(this.getPosition, 50))
  }

  getPosition = () => {
    const bar = this.barRef.current
    const container = bar && document.querySelector('.container, .container-flex')
    const containerSizes = container?.getBoundingClientRect()
    const padding = container && parseInt(getComputedStyle(container)?.paddingRight, 10)

    this.setState({
      style: {
        left: `${containerSizes?.left + padding}px`,
        width: `${containerSizes?.width - (padding * 2)}px`
      }
    })
  }

  render () {
    const { children, visible, onChange, checked, onClose } = this.props
    const { style } = this.state
    const classes = cx('actionbar', {
      'actionbar--visible': visible
    })

    return (
      <div ref={this.barRef} style={{ ...style }} className={classes}>
        {onChange &&
          <div className='actionbar__control'>
            <Checkbox checked={checked} third onChange={onChange} />
          </div>}
        <div className='actionbar__content'>
          {children}
        </div>
        {onClose &&
          <Link className='actionbar__close' onClick={onClose}>
            <Icon className='actionbar__close-icon' icon='close_circle' />
          </Link>}
      </div>
    )
  }
}

export default Actionbar
