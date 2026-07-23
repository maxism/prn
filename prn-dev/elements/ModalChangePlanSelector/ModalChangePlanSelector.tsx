import React, { Component, ReactNode } from 'react'

import Icon from '../Icon/Icon'
import NumeralUtil from '../../utils/NumeralUtil'
import PlanUtil from '../../utils/PlanUtil'

import s from './ModalChangePlanSelector.module.scss'
import cx from "classnames"

interface IProps {
  name: string
  price: number
  projects: number
  communities: number
  competitors: number
  influencers: number
  retrospectives: number
  reports: Array<string>
  indexLevel: number
  topRating: number
  period: number
  promoDiscount: number
}

class ModalChangePlanSelector extends Component<IProps> {
  render (): ReactNode {
    const { name, price, period, promoDiscount } = this.props

    const periodDiscount = PlanUtil.getPeriodDiscount(period)
    const discount = periodDiscount + promoDiscount
    const fullPrice = price * period
    const cost = PlanUtil.getCostWithDiscount(fullPrice, discount)
    const isFree = cost === 0
    // const isReports = reports.includes('xlsx')

    return (
      <div className={s.element}>

        <div className={s.content}>

          <div className={s.row}>
            <span className={s.title}>{`Тариф «${name.toUpperCase()}»`}</span>
            <div className={s.value}>
              <span className={s.valueText}>{!isFree ? NumeralUtil.format(fullPrice, '0,0') : 'Бесплатно'}</span>
              { !isFree && <Icon className={s.valueIcon} icon='rouble' /> }
            </div>
          </div>

          {/*<div className={s.row}>*/}
          {/*  <div className={s.description}>*/}
          {/*    <span className={s.descriptionItem}>*/}
          {/*      {`*/}
          {/*        Возможность создать ${NumeralUtil.format(projects, '0,0', ['проект', 'проекта', 'проектов'])}. */}
          {/*        Добавление до ${NumeralUtil.format(communities, '0,0', ['своей страницы', 'своих страниц', 'ствоих страниц'])} */}
          {/*        и до ${NumeralUtil.format(competitors, '0,0', ['конкурента', 'конкурентов', 'конкурентов'])} в каждый из проектов.*/}
          {/*        Работа с ${NumeralUtil.format(influencers, '0,0', ['блогером', 'блогерами', 'блогерами'])} в каждом проекте.*/}
          {/*        История активности на всех страницах, включая конкурентов и блогеров — ${NumeralUtil.format(retrospectives, '0,0', ['месяц', 'месяца', 'месяцев'])}.*/}
          {/*      `}*/}
          {/*    </span>*/}

          {/*    <span className={s.descriptionItem}>*/}
          {/*      В рамках каждого проекта вам будут доступны:*/}
          {/*      {[*/}
          {/*        competitors ? 'анализ конкурентов' : '',*/}
          {/*        isReports ? 'отчёты в формате XLSX' : '',*/}
          {/*        'оценка эффективности постов (Post Grade)',*/}
          {/*        'оценка качества страниц (Community Score)',*/}
          {/*        influencers ? 'оценка качества блогеров (КУБ Score)' : ''*/}
          {/*      ].filter(b => b).join(', ')}.*/}
          {/*    </span>*/}

          {/*    <span className={s.descriptionItem}>*/}
          {/*      {`*/}
          {/*        В рейтинге КУБ вам будет доступно ${topRating} лучших страниц по любому запросу. Также выбор категорий ${indexLevel + 1} уровня в Social Index.*/}
          {/*      `}*/}
          {/*    </span>*/}
          {/*  </div>*/}
          {/*</div>*/}
          {!isFree &&
              <>
                {!!promoDiscount &&
                    <div className={s.row}>
                      <span className={s.title}>{`Скидка по промокоду ${promoDiscount}%`}</span>
                      <div className={s.value}>
                        <span className={cx(s.valueText, s.textGrey)}>- {NumeralUtil.format(PlanUtil.getDiscountValue(price * period, promoDiscount), '0,0')}</span>
                        <Icon className={cx(s.valueIcon, s.iconGrey)} icon='rouble'/>
                      </div>
                    </div>
                }
                {!!periodDiscount &&
                    <div className={s.row}>
                      <span className={s.title}>{`Скидка при оплате на год ${periodDiscount}%`}</span>
                      <div className={s.value}>
                        <span className={cx(s.valueText, s.textGrey)}>- {NumeralUtil.format(PlanUtil.getDiscountValue(price * period, periodDiscount), '0,0')}</span>
                        <Icon className={cx(s.valueIcon, s.iconGrey)} icon='rouble'/>
                      </div>
                    </div>
                }
                {!!discount &&
                  <div className={s.row}>
                    <span className={s.title}>Итоговая стоимость</span>
                    <div className={s.value}>
                      <span className={s.valueText}>{NumeralUtil.format(cost, '0,0')}</span>
                      <Icon className={s.valueIcon} icon='rouble'/>
                    </div>
                  </div>
                }
              </>
          }
        </div>
      </div>
    )
  }
}

export default ModalChangePlanSelector
