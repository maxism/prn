import React, { Component, MouseEventHandler, ReactNode } from 'react'
import cx from 'classnames'

import s from './InfoLabel.module.scss'
import Link from "../Link/Link";
import Icon from '../Icon/Icon'
import NumeralUtil, {NumeralFormat} from '../../utils/NumeralUtil'
import Tooltip from '../Tooltip/Tooltip'
import QualityScore from '../QualityScore/QualityScore'
import Loader from '../Loader/Loader'

interface IProps {
  /**
   * Содержимое элемента
   */
  children?: ReactNode
  /**
   * Заголовок
   */
  title?: string
  /**
   * Описание
   */
  description?: string
  /**
   * Текст кнопки
   */
  button?: ReactNode
  /**
   * Текст ссылки
   */
  linkText?: string
  /**
   * Ссылка
   */
  to?: string
  /**
   * Обработчик клика
   */
  onClick?: MouseEventHandler
  /**
   * Класс
   */
  className?: string
  /**
   * Значение метрики
   */
  value?: number | string
  /**
   * Формат для чисел
   */
  format?: NumeralFormat | string
  /**
   * Режим отображения изменения
   */
  delta?: boolean
  /**
   * Изменение метрики
   */
  deltaValue?: number | string
  /**
   * Формат для чисел
   */
  deltaValueFormat?: NumeralFormat | string
  /**
   * Состояние загрузки
   */
  loading?: boolean
  /**
   * Заголовок тултипа
   */
  tooltipTitle?: string
  /**
   * Текст тултипа
   */
  tooltipText?: ReactNode | string
  /**
   * Описание тултипа
   */
  tooltipDescription?: ReactNode | string
  /**
   * Кнопка в тултипе
   */
  tooltipButton?: string
  /**
   * Обработчик клика по кнопке
   */
  tooltipButtonOnClick?: MouseEventHandler
  /**
   * Скрыть тултип
   */
  hideTooltip?: boolean
  /**
   * Значение скора
   */
  qualityScore?: number
  /**
   * Знак рубля
   */
  rouble?: boolean
  /**
   * Заблокированный показатель
   */
  blocked?: boolean
  /**
   * В случае ошибки применяем этот стиль
   */
  error?: boolean
  /**
   * Тарифы для разблокировки данных
   */
  higherPlansList?: string
  /**
   * Обработчик смены тарифа
   */
  onChangePlan?: MouseEventHandler
}

/**
 * Информационная подпись
 */
export default class InfoLabel extends Component<IProps> {
  render (): JSX.Element {
    let { children, title, value, description, button, linkText, to, onClick, className, delta, format, deltaValue, deltaValueFormat,
      loading, tooltipTitle, tooltipText, tooltipDescription, tooltipButton, tooltipButtonOnClick, hideTooltip, qualityScore, rouble, blocked,
      higherPlansList, onChangePlan, error } = this.props

    value = value || String(children || '')

    if (blocked) {
      value = ''
      deltaValue = ''
    }

    const classes = cx(s.element, {
      [s.loading]: loading,
      [s.blocked]: !loading && blocked,
      [s.error]: error
    }, className)

    let deltaDirection = ''
    if (Number(value) > 0) deltaDirection = 'stats_up'
    if (Number(value) < 0) {
      deltaDirection = 'stats_down'
      value = -value
    }

    let deltaValueDirection = ''
    if (Number(deltaValue) > 0) deltaValueDirection = 'stats_up'
    if (Number(deltaValue) < 0) {
      deltaValueDirection = 'stats_down'
      deltaValue = -deltaValue
    }

    if (deltaValue !== undefined) deltaValue = NumeralUtil.format(deltaValue, deltaValueFormat)

    if (['0', '0%', '0.00%'].includes(String(deltaValue))) {
      deltaValue = 0
      deltaValueDirection = ''
    }

    return (
      <div className={classes} onClick={blocked ? onChangePlan : null}>
        {title &&
          <div className={s.containerName}>
            <span className={s.title}>{title}</span>
            {!hideTooltip && tooltipText && (
              <Tooltip
                trigger={<Icon className={s.helpIcon} icon='help' onClick={e => { e.stopPropagation(); e.preventDefault() }}/>}
                title={tooltipTitle}
                text={tooltipText}
                description={tooltipDescription}
                button={tooltipButton}
                buttonOnClick={tooltipButtonOnClick}
              />
            )}
          </div>
        }

        <div className={s.containerMetric}>
          {!blocked && (
            <div className={s.containerValue}>
              {loading && <span className={s.loader}>.</span>}
              {!loading && qualityScore && <QualityScore className={s.qualityScore} score={qualityScore} big />}
              {!loading && delta && <Icon className={cx(s.deltaIcon, { [s.up]: deltaDirection === 'stats_up', [s.down]: deltaDirection === 'stats_down' })} icon={deltaDirection} />}
              {!loading && format && NumeralUtil.format(value, format)}
              {!loading && !format && value}
              {loading && <Loader />}
              {!loading && rouble && <Icon className={s.rouble} icon='rouble' />}
              {loading && <span className={s.loader}>.</span>}
            </div>
          )}

          {deltaValue !== undefined && !blocked &&
            <div className={s.containerDeltaValue}>
              <Icon className={cx(s.deltaIcon, {
                [s.up]: deltaValueDirection === 'stats_up',
                [s.down]: deltaValueDirection === 'stats_down'
              })} icon={deltaValueDirection} />
              <span className={cx({
                [s.up]: deltaValueDirection === 'stats_up',
                [s.down]: deltaValueDirection === 'stats_down'
              })}>{deltaValue || 'без изменений'}</span>
            </div>
          }

          {!loading && blocked && <div className={s.locked}>
            <Tooltip
              trigger={<Icon className={s.lock} icon='locked' />}
              title='Доступ ограничен'
              text={`Чтобы увидеть эти данные, перейдите на тариф ${higherPlansList || 'BASIC и выше'}.`}
              button='Выбрать тариф'
              buttonOnClick={onChangePlan}
            />
          </div>}
        </div>

          {description && <span className={s.description}>{description}</span>}

          {button && <div className={s.button}>{button}</div>}

          {linkText && <Link className={s.link} to={to} onClick={onClick}>{linkText}</Link>}
      </div>
    )
  }
}
