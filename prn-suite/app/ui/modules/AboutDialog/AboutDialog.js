import React, { cloneElement, Component } from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'

import Icon from '../../elements/Icon/Icon'
import Tooltip from '../../modules/Tooltip/Tooltip'

import AboutDialogDescription from './AboutDialogDescription/AboutDialogDescription'

import './AboutDialog.scss'

/**
 * Модуль AboutDialog
 */
class AboutDialog extends Component {
  static propTypes = {
    /**
     * Дополнительные классы
     */
    className: PropTypes.string,
    /**
     * Триггер, передается кнопка для управления выпадающим списком
     */
    trigger: PropTypes.node,

    /**
     * Описание диалога удаления
     */
    description: PropTypes.object,
    /**
     * Состояние загрузки
     */
    loading: PropTypes.bool,
    /**
     * Отключено
     */
    disabled: PropTypes.bool,
    /**
     * Обработчик при исчезновении
     */
    onShow: PropTypes.func,
    /**
     * Обработчик при появлении
     */
    onHide: PropTypes.func
  }

  static defaultProps = {
    disabled: false
  }

  state = {
    open: undefined
  }

  render () {
    const { loading, trigger, className, description, disabled, onShow, onHide } = this.props

    const classes = cx('about-dialog', className)

    if (loading) {
      return (
        <div className='about-dialog' ref={this.handleRef}>
          <Icon icon='loader' />
        </div>
      )
    }

    return (
      <div className={classes} ref={this.handleRef}>
        <Tooltip
          onShow={onShow}
          onHide={onHide}
          theme='about'
          animateFill={false}
          options={{
            modifiers: {
              preventOverflow: {
                boundariesElement: 'window'
              }
            }
          }}
          disabled={disabled}
          position='top-end'
          trigger={trigger && cloneElement(trigger, { onClick: this.handleTriggerClick })}
          open={this.state.open}
        >
          {description &&
            <AboutDialogDescription
              name={description.name}
              link={description.link}
              socialType={description.socialType}
              retro={description.retro}
              usersCount={description.usersCount}
              communitiesCount={description.communitiesCount}
              isInsights={description.isInsights}
              onChange={!disabled ? description.handleOnChange : undefined}
            />}
        </Tooltip>
      </div>
    )
  }
}

export default AboutDialog
