import React, { Component } from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'

import ExcludeButton from '../../elements/ExcludeButton/ExcludeButton'
import IncludeButton from '../../elements/IncludeButton/IncludeButton'
import Link from '../../elements/Link/Link'
import Icon from '../../elements/Icon/Icon'
import Checkbox from '../../elements/Checkbox/Checkbox'
import RemoveDialog from '../../modules/RemoveDialog/RemoveDialog'
import Image from '../../elements/Image/Image'
import Tooltip from '../../modules/Tooltip/Tooltip'

import './LabelItem.scss'

/**
 * Вид LabelItem
 */
class LabelItem extends Component {
  static propTypes = {
    /**
     * Цвет метки
     */
    color: PropTypes.string,
    /**
     * Картинка метки
     */
    image: PropTypes.string,
    /**
     * Размер метки
     */
    size: PropTypes.oneOf(['big-modal', 'big', 'standart']),
    /**
     * Название метки
     */
    name: PropTypes.string,
    // visibility: PropTypes.oneOf(['', 'global', 'private', 'system']),
    /**
     * Обработчик удаления
     */
    onRemove: PropTypes.func,
    /**
     * Текст кнопки удаления
     */
    removeText: PropTypes.string,
    /**
     * Состояние удаления
     */
    removeLoading: PropTypes.bool,
    /**
     * Описание диалога удаления
     */
    removeDescription: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    /**
     * Удаление невозможно
     */
    removeDisabled: PropTypes.bool,
    /**
     * Обработчик клика
     */
    onClick: PropTypes.func,
    /**
     * Раскрытие заблокировано
     */
    disabled: PropTypes.bool,
    /**
     * Количество сообществ и постов
     */
    communitiesCount: PropTypes.string,
    /**
     * Дополнительная информация
     */
    text: PropTypes.string,
    /**
     * Обработчик для checkbox
     */
    onChange: PropTypes.func,
    /**
     * Редактирование метки
     */
    onEdit: PropTypes.func,
    /**
     * Выбран ли элемент
     */
    checked: PropTypes.bool,
    onInclude: PropTypes.func,
    onExclude: PropTypes.func
  }

  static defaultProps = {
    disabled: false,
    visibility: '',
    big: false
  }

  static contextTypes = {
    i18n: PropTypes.object.isRequired
  }

  getShortName (name) {
    const words = name.split(/\s+/g).filter(word => word.length)
    if (words.length > 0) {
      return `${words
        .map(item => {
          return item[0].toUpperCase()
        })
        .slice(0, 2)
        .join('')
      }`
    }

    if (words.length === 1) {
      return name[0]
    }

    return 'M'
  }

  // getType (type) {
  //   const { lc, l } = this.context.i18n
  //   if (type === 'private') {
  //     return (
  //       <Tooltip
  //         trigger={
  //           <p className='label-item__type'><Icon icon='person' className='label-item__type-icon' />
  //             <span className='label-item__type-text'>{lc('label', 'Private')}</span>
  //           </p>
  //         }
  //       >
  //         {l('Private labels are visible only for you, global labels are visible for all team members')}
  //       </Tooltip>)
  //   }
  //   if (type === 'system') {
  //     return (
  //       <Tooltip
  //         trigger={
  //           <p className='label-item__type'><Icon icon='locker' className='label-item__type-icon' />
  //             <span className='label-item__type-text'>{lc('label', 'System')}</span>
  //           </p>
  //         }
  //       >
  //         <p className='tooltip__item'>
  //           {l('Private labels are visible only for you, global labels are visible for all team members')}
  //         </p>
  //       </Tooltip>)
  //   }
  //
  //   return (
  //     <Tooltip
  //       trigger={
  //         <p className='label-item__type'><Icon icon='global' className='label-item__type-icon' />
  //           <span className='label-item__type-text'>{lc('label', 'Global')}</span>
  //         </p>
  //       }
  //     >
  //       <p className='tooltip__item'>
  //         {l('Private labels are visible only for you, global labels are visible for all team members')}
  //       </p>
  //     </Tooltip>
  //   )
  // }

  getAvatar = (name, image) => {
    const shortName = name && this.getShortName(name)
    const images = [
      require('../../../../assets/img/icons/auto.svg'),
      require('../../../../assets/img/icons/beauty.svg'),
      require('../../../../assets/img/icons/electronics.svg'),
      require('../../../../assets/img/icons/fashion.svg'),
      require('../../../../assets/img/icons/finance.svg'),
      require('../../../../assets/img/icons/food_retail.svg'),
      require('../../../../assets/img/icons/media.svg'),
      require('../../../../assets/img/icons/retail.svg')
    ]

    const defaultImage = images.find(img => img === image)
    const classesImage = cx('label-item__image', {
      'label-item__image--circle': !defaultImage
    })

    if (image?.length) {
      return (
        <Image
          className={classesImage}
          src={defaultImage || image}
          alt='image-label'
        />)
    }
    return (
      <span className='label-item__short-name'>
        {shortName}
      </span>
    )
  }

  handleInclude = e => {
    e.preventDefault()
    this.props.onInclude()
  }

  handleExclude = e => {
    e.preventDefault()
    this.props.onExclude()
  }

  render () {
    const {
      color, size, name, onRemove, removeText, removeDescription, removeDisabled, removeLoading,
      onClick, onEdit, disabled, communitiesCount, onChange, checked, text, onInclude, onExclude, image
    } = this.props
    const classes = cx('label-item', {
      [`label-item--${size}`]: size
    })
    // const labelVisibility = this.getType(visibility)
    const { l } = this.context.i18n

    return (
      <div className={classes} onClick={!disabled && onClick}>
        {onExclude &&
          <div className='label-item__control'>
            <Tooltip trigger={<ExcludeButton onExclude={this.handleExclude} />}>
              <p className='tooltip-item'>{l('Remove label')}</p>
            </Tooltip>
          </div>}
        {onInclude &&
          <div className='label-item__control'>
            <Tooltip
              trigger={<IncludeButton onInclude={this.handleInclude} />}
            >
              <p className='tooltip-item'>{l('Add label')}</p>
            </Tooltip>
          </div>}
        {onChange && <div className='label-item__control label-item__control--checkbox'><Checkbox checked={checked} onChange={onChange} /></div>}
        <Link className='label-item__inner'>
          <figure className='label-item__circle' style={{ borderColor: color }}>
            {this.getAvatar(name, image)}
          </figure>
          <div className='label-item__label-content'>
            {name && <p className='label-item__name'>{name}</p>}
            {communitiesCount &&
              <div className='label-item__info'>
                {/* {labelVisibility} */}
                {communitiesCount &&
                  <Tooltip
                    trigger={<span className='label-item__communities-count'><Icon icon='select_dashboard' /> {communitiesCount}</span>}
                  >
                    <p className='tooltip__item'>{l('The number of communities and posts with this label')}</p>
                  </Tooltip>}
              </div>}
            {text && <span className='label-item__text'>{text}</span>}
          </div>
        </Link>
        {(onRemove || onEdit) &&
          <div className='label-item__controls'>
            {onEdit &&
              <Tooltip
                trigger={<Link onClick={onEdit} className='label-item__control-btn'><Icon className='label-item__edit-icon' icon='gear' /></Link>}
              >
                <p className='tooltip__item'>{l('Show label settings')}</p>
              </Tooltip>}
            {onRemove &&
              <RemoveDialog
                className='label-item__remove'
                trigger={<Link className='label-item__control-btn'><Icon className='label-item__remove-icon' icon='trash' /></Link>}
                disabled={removeDisabled}
                description={removeDescription}
                loading={removeLoading}
                onRemove={onRemove}
                onClick={onRemove}
                text={removeText}
                position='bottom-right'
              />}
          </div>}
      </div>
    )
  }
}

export default LabelItem
