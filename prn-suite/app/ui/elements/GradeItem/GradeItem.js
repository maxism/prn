import React, { Component } from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'

import Icon from '../Icon/Icon'

import './GradeItem.scss'

class GradeItem extends Component {
  static propTypes = {
    grade: PropTypes.string
  }

  render () {
    const { grade } = this.props
    const classes = cx('grade-item', {
      [`grade-item--${grade}`]: grade
    })

    return (
      <div className={classes}>
        <Icon icon={`grade_${grade}`} />
      </div>
    )
  }
}

export default GradeItem
