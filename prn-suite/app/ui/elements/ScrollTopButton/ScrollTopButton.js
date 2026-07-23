import React, { Component } from 'react'
import cx from 'classnames'
import { debounce } from 'lodash'

import Icon from '../Icon/Icon'

import './ScrollTopButton.scss'

class ScrollTopButton extends Component {
  state = {
    visible: false
  }

  handleScrollTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  componentDidMount () {
    window.addEventListener('scroll', debounce(this.handleUpdate, 100))
    window.addEventListener('resize', debounce(this.handleUpdate, 100))
    this.handleUpdate()
  }

  handleUpdate = () => {
    const screensScrolled = document.documentElement.scrollTop / window.innerHeight

    this.setState({
      visible: screensScrolled > 2
    })
  }

  componentWillUnmount () {
    window.removeEventListener('scroll', debounce(this.handleUpdate, 100))
    window.removeEventListener('resize', debounce(this.handleUpdate, 100))
  }

  render () {
    const { visible } = this.state
    const classes = cx('scroll-top-button', {
      'scroll-top-button--visible': visible
    })

    return (
      <button className={classes} onClick={this.handleScrollTop}>
        <Icon icon='change_positive' />
      </button>
    )
  }
}

export default ScrollTopButton
