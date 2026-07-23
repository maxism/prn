import React, { Component } from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'

import Tooltip from '../Tooltip/Tooltip'
import Button from '../../elements/Button/Button'

import './ConfirmDialog.scss'

class ConfirmDialog extends Component {
  static propTypes = {
    trigger: PropTypes.node,
    title: PropTypes.string,
    description: PropTypes.string,
    hint: PropTypes.oneOfType([PropTypes.string, PropTypes.node, PropTypes.object]),
    buttonOnClick: PropTypes.func,
    button: PropTypes.string,
    distance: PropTypes.number,
    className: PropTypes.string
  }

  render () {
    const { trigger, title, description, hint, buttonOnClick, button, distance, className } = this.props
    const classes = cx('confirm-dialog', className)
    return (
      <Tooltip
        theme='confirm'
        className={classes}
        trigger={trigger}
        animateFill={false}
        distance={distance}
        options={{
          modifiers: {
            preventOverflow: {
              boundariesElement: 'window'
            }
          }
        }}
        position='bottom'
      >
        {title && <p className='confirm-dialog__title'>{title}</p>}
        {description && <p className='confirm-dialog__description'>{description}</p>}
        {hint && <p className='confirm-dialog__hint'>{hint}</p>}
        {button &&
          <Button
            size='small-tooltip'
            color='white'
            textColor='default'
            textSize='tooltip'
            halign='left'
            className='confirm-dialog__button'
            onClick={buttonOnClick}
          >
            {button}
          </Button>}
      </Tooltip>
    )
  }
}

export default ConfirmDialog
