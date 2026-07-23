import React, { cloneElement, Component } from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'

import Button from '../../elements/Button/Button'
import Tooltip from '../../modules/Tooltip/Tooltip'

import RemoveDialogDescription from './RemoveDialogDescription/RemoveDialogDescription'

import './RemoveDialog.scss'

/**
 * Модуль RemoveDialog
 */
class RemoveDialog extends Component {
  static propTypes = {
    /**
     * Дополнительные классы
     */
    className: PropTypes.string,
    /**
     * Обработчик удаления
     */
    onRemove: PropTypes.func,
    /**
     * Триггер, передается кнопка для управления выпадающим списком
     */
    trigger: PropTypes.node,
    /**
     * Описание диалога удаления
     */
    description: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    /**
     * Позиция
     */
    position: PropTypes.string,
    /**
     * Текст кнопки удаления
     */
    text: PropTypes.string,
    /**
     * Удаление невозможно
     */
    disabled: PropTypes.bool,
    /**
     * Состояние загрузки
     */
    loading: PropTypes.bool
  }

  static defaultProps = {
    position: 'auto'
  }

  handleTriggerClick = (e) => {
    e.stopPropagation()
    if (!this.props.onRemove) return false
  }

  handleRemove = (e) => {
    if (!this.props.onRemove) return false
    this.props.onRemove(e)
  }

  render () {
    const { loading, trigger, className, description, disabled, text, position } = this.props

    const classes = cx('remove-dialog', className)

    return (
      <div className={classes} ref={this.handleRef}>
        <Tooltip
          theme='remove'
          animateFill={false}
          events='click'
          distance={25}
          position={position}
          trigger={trigger && cloneElement(trigger, { onClick: this.handleTriggerClick })}
        >
          {description && <RemoveDialogDescription>{description}</RemoveDialogDescription>}
          {text && <Button onClick={this.handleRemove} loading={loading} disabled={disabled}>{text}</Button>}
        </Tooltip>
      </div>
    )
  }
}

export default RemoveDialog
