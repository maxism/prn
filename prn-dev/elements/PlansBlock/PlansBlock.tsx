import React, { ChangeEventHandler, Component } from 'react'
import cx from 'classnames'
import s from './PlansBlock.module.scss'

import Block from '../Block/Block'
import BlockGroup from '../Block/BlockGroup'
import Icon from '../Icon/Icon'
import ButtonTextGroup from '../ButtonText/ButtonTextGroup'
import ButtonText from '../ButtonText/ButtonText'
// import Tooltip from '../Tooltip/Tooltip'
import NumeralUtil from '../../utils/NumeralUtil'
import PlanUtil from '../../utils/PlanUtil'

interface IPlan {
  planID: string
  name: string
  projects: number
  communities: number
  competitors: number
  influencers: number
  retrospectives: number
  priority: number
  reports: Array<string>
  postGrade: boolean
  communityScore: boolean
  qualityScore: boolean
  topRating: number
  indexLevel: number
  price: number
}

interface IProps {
  period: number
  short?: boolean
  free?: boolean
  plans: Array<IPlan>
  onChangePlan: ChangeEventHandler<HTMLInputElement>
}

/**
 * Блок c тарифами
 */
export default class PlansBlock extends Component<IProps> {
  handleChangePlan = (e, value: string) => {
    e.target.value = value

    this.props.onChangePlan(e)
  }

  render (): JSX.Element {

    const { period, short, free, plans } = this.props

    const periodDiscount = PlanUtil.getPeriodDiscount(period)

    return (
      <BlockGroup size='l'>
        <Block size={12}>
          <div className={s.element}>

            {/*{!free && <div className={cx(s.itemElement, s.invisibleItem)}>*/}
            {/*  <div className={cx(s.header, s.invisibleHeader)}>*/}
            {/*    <div className={s.plan}>*/}
            {/*      <span className={s.name}>.</span>*/}
            {/*    </div>*/}

            {/*    <div className={s.cost}>*/}
            {/*      <div className={s.price}>*/}
            {/*        <span className={s.costValue}>.</span>*/}
            {/*      </div>*/}
            {/*      <span className={s.costText}>.</span>*/}
            {/*    </div>*/}

            {/*    <span className={s.costDescription}>.</span>*/}

            {/*    <div className={s.button} />*/}
            {/*  </div>*/}

            {/*  <div className={s.section}>*/}
            {/*    <span className={s.title}>Ограничения</span>*/}

            {/*    <div className={s.rows}>*/}
            {/*      <div className={cx(s.row, s.help)}>*/}
            {/*        <span className={s.rowText}>Проекты</span>*/}
            {/*        <Tooltip*/}
            {/*          trigger={<Icon icon='help' />}*/}
            {/*          title='Проекты'*/}
            {/*          text='Проект — это место, где вы можете собрать вместе все страницы своей компании из разных соцсетей, добавить страницы конкурентов и отобрать блогеров для рекламных интеграций. Между проектами легко переключаться из шапки сайта. Это удобно, если у вас несколько компаний или клиентов.'*/}
            {/*        />*/}
            {/*      </div>*/}

            {/*      <div className={cx(s.row, s.help)}>*/}
            {/*        <span className={s.rowText}>Cтраницы</span>*/}
            {/*        <Tooltip*/}
            {/*          trigger={<Icon icon='help' />}*/}
            {/*          title='Страницы'*/}
            {/*          text='Страницы — это любые доступные для анализа аккаунты, группы и сообщества в социальных сетях. Они делятся на «Свои страницы», «Страницы конкурентов» и «Страницы блогеров». Добавляйте их в проекты, чтобы было удобно просматривать статистику.'*/}
            {/*        />*/}
            {/*      </div>*/}

            {/*      <div className={s.rowDescription}>*/}
            {/*        <span className={s.rowDescriptionText}>Свои страницы в одном проекте</span>*/}
            {/*      </div>*/}

            {/*      <div className={s.rowDescription}>*/}
            {/*        <span className={s.rowDescriptionText}>Конкуренты в одном проекте</span>*/}
            {/*      </div>*/}

            {/*      <div className={s.rowDescription}>*/}
            {/*        <span className={s.rowDescriptionText}>Блогеры в одном проекте</span>*/}
            {/*      </div>*/}

            {/*      <div className={s.space} />*/}

            {/*      /!*<div className={cx(s.row, s.help)}>*!/*/}
            {/*      /!*  <span className={s.rowText}>Конкуренты</span>*!/*/}
            {/*      /!*  <Tooltip*!/*/}
            {/*      /!*    trigger={<Icon icon='help' />}*!/*/}
            {/*      /!*    title='Конкуренты'*!/*/}
            {/*      /!*    text='Страницы конкурентов — это любые доступные для анализа страницы ваших конкурентов (аккаунты, группы и сообщества) в социальных сетях. Можно добавить несколько конкурентов в каждую из соцсетей и сравнивать со своими страницами.'*!/*/}
            {/*      /!*  />*!/*/}
            {/*      /!*</div>*!/*/}

            {/*      /!*<div className={cx(s.row, s.help)}>*!/*/}
            {/*      /!*  <span className={s.rowText}>Блогеры</span>*!/*/}
            {/*      /!*  <Tooltip*!/*/}
            {/*      /!*    trigger={<Icon icon='help' />}*!/*/}
            {/*      /!*    title='Блогеры'*!/*/}
            {/*      /!*    text='Для каждого проекта можно искать и отбирать блогеров, с которыми хотелось бы поработать. Вы всегда будете иметь под рукой их список и актуальную статистику. Благодаря закладкам, заметкам и статусам вести работу с блогерами будет очень комфортно.'*!/*/}
            {/*      /!*  />*!/*/}
            {/*      /!*</div>*!/*/}

            {/*      <div className={cx(s.row, s.help)}>*/}
            {/*        <span className={s.rowText}>История</span>*/}
            {/*        <Tooltip*/}
            {/*          trigger={<Icon icon='help' />}*/}
            {/*          title='История'*/}
            {/*          text='Мы собираем и храним всю информацию по добавленным страницам, конкурентам и блогерам в сервисе. Это значит, что у вас под рукой всегда будет история изменений и возможность наблюдать за динамикой всех доступных метрик.'*/}
            {/*        />*/}
            {/*      </div>*/}

            {/*      <div className={cx(s.row, s.help)}>*/}
            {/*        <span className={s.rowText}>Приоритет</span>*/}
            {/*        <Tooltip*/}
            {/*          trigger={<Icon icon='help' />}*/}
            {/*          title='Приоритет'*/}
            {/*          text='Сбор и обновление данных по страницам и блогерам требует некоторого времени — все они находятся в виртуальной очереди. Страницы с высоким приоритетом стоят ближе к началу очереди. Другими словами, чем выше приоритет, тем быстрее наша система обработает данные.'*/}
            {/*        />*/}
            {/*      </div>*/}
            {/*    </div>*/}
            {/*  </div>*/}

            {/*  {!short && <div className={s.section}>*/}
            {/*    <span className={s.title}>Функционал</span>*/}

            {/*    <div className={s.rows}>*/}
            {/*      <div className={cx(s.row, s.help)}>*/}
            {/*        <span className={s.rowText}>Анализ конкурентов</span>*/}
            {/*        <Tooltip*/}
            {/*          trigger={<Icon icon='help' />}*/}
            {/*          title='Анализ конкурентов'*/}
            {/*          text='Вы получаете возможность детально сравнивать свои страницы со страницами конкурентов. Есть общий вид всех страниц в проекте с самыми значимыми метриками и оценкой страниц + возможность сравнивать страницы друг с другом по всем доступным метрикам.'*/}
            {/*        />*/}
            {/*      </div>*/}

            {/*      <div className={cx(s.row, s.help)}>*/}
            {/*        <span className={s.rowText}>Отчеты</span>*/}
            {/*        <Tooltip*/}
            {/*          trigger={<Icon icon='help' />}*/}
            {/*          title='Отчёты'*/}
            {/*          text='По каждой своей странице, странице конкурента или сравнительный отчет можно скачать за выбранный период времени.'*/}
            {/*        />*/}
            {/*      </div>*/}

            {/*      <div className={cx(s.row, s.help)}>*/}
            {/*        <span className={s.rowText}>Оценка постов</span>*/}
            {/*        <Tooltip*/}
            {/*          trigger={<Icon icon='help' />}*/}
            {/*          title='Оценка постов'*/}
            {/*          text='Post Grade — наша уникальная оценка эффективности постов, которая выставляется на основе множества метрик. Она показывает насколько отдельный пост лучше или хуже среднестатистического поста в выбранной социальной сети в рамках проекта.'*/}
            {/*        />*/}
            {/*      </div>*/}

            {/*      <div className={cx(s.row, s.help)}>*/}
            {/*        <span className={s.rowText}>Оценка страниц</span>*/}
            {/*        <Tooltip*/}
            {/*          trigger={<Icon icon='help' />}*/}
            {/*          title='Оценка страниц'*/}
            {/*          text='Community Score — уникальная оценка эффективности страниц. Так же, как и Grade, она выставляется на основе множества метрик и сложных алгоритмов. Community Score показывает процентную оценку среди всех добавленных страниц (и наших, и конкурентов) в выбранной соцсети в рамках проекта.'*/}
            {/*        />*/}
            {/*      </div>*/}

            {/*      <div className={cx(s.row, s.help)}>*/}
            {/*        <span className={s.rowText}>Качество блогеров</span>*/}
            {/*        <Tooltip*/}
            {/*          trigger={<Icon icon='help' />}*/}
            {/*          title='Качество блогеров'*/}
            {/*          text='КУБ Score — единая уникальная оценка эффективности блогеров. Мы учитываем все показатели блогеров и на основе умных алгоритмов выставляем Quality Score. Он показывает насколько размещение у одного блогера будет эффективнее, чем у другого.'*/}
            {/*        />*/}
            {/*      </div>*/}

            {/*      <div className={cx(s.row, s.help)}>*/}
            {/*        <span className={s.rowText}>Выгрузка блогеров</span>*/}
            {/*        <Tooltip*/}
            {/*          trigger={<Icon icon='help' />}*/}
            {/*          title='Выгрузка блогеров'*/}
            {/*          text='Возможность выгрузить список всех выбранных блогеров и их статистику в одном .xlsx файле.'*/}
            {/*        />*/}
            {/*      </div>*/}

            {/*      <div className={cx(s.row, s.help)}>*/}
            {/*        <span className={s.rowText}>Результатов поиска</span>*/}
            {/*        <Tooltip*/}
            {/*          trigger={<Icon icon='help' />}*/}
            {/*          title='Результатов поиска'*/}
            {/*          text='Ограничение по количеству результатов в поисковой выдаче, рейтинге и блогерах. Чем выше тариф, тем больше страниц по выбранным параметрам вы увидите.'*/}
            {/*        />*/}
            {/*      </div>*/}

            {/*      <div className={cx(s.row, s.help)}>*/}
            {/*        <span className={s.rowText}>Индекс</span>*/}
            {/*        <Tooltip*/}
            {/*          trigger={<Icon icon='help' />}*/}
            {/*          title='Social Index'*/}
            {/*          text='Ограничение по количеству категорий, доступных для мониторинга в КУБ Social Index. Чем больше уровень, тем более мелкие отрасли можно просматривать.'*/}
            {/*        />*/}
            {/*      </div>*/}
            {/*    </div>*/}
            {/*  </div>}*/}

            {/*  {!short && <div className={s.section}>*/}
            {/*    <span className={s.title}>Поддержка</span>*/}

            {/*    <div className={s.rows}>*/}
            {/*      <div className={cx(s.row, s.help)}>*/}
            {/*        <span className={s.rowText}>База знаний</span>*/}
            {/*      </div>*/}

            {/*      <div className={cx(s.row, s.help)}>*/}
            {/*        <span className={s.rowText}>Ответ специалиста</span>*/}
            {/*      </div>*/}
            {/*    </div>*/}
            {/*  </div>}*/}
            {/*</div>}*/}

            {plans && (short ? ['start', 'basic', 'advanced', 'pro'] : ['basic', 'advanced', 'pro']).filter(plan => free && plan === 'free' || plan !== 'free').map(plan => {
                const planData = plans.find(item => item.name === plan)
                const planName = plan[0].toUpperCase() + plan.slice(1)
                if (planData) return (
                  <>
                    <div className={cx(s.itemElement, { [s.white]: plan === 'advanced' })} key={plan}>
                      <div className={s.header}>
                        <div className={s.plan}>
                          <span className={s.name}>
                            {{
                              'Start': 'Старт',
                              'Basic': 'Базовый',
                              'Advanced': 'Расширенный',
                              'Pro': 'Профессиональный',
                              'Special': 'Индивидуальный',
                              'Analytics': 'Аналитика',
                            }[planName] || planName}
                          </span>
                          {plan !== 'free' && !!periodDiscount && <div className={s.badge}>
                            <span className={s.discount}>-{periodDiscount}%</span>
                          </div>}
                        </div>

                        <div className={s.cost}>
                          <div className={s.price}>
                            <span className={s.costValue}>{plan === 'free' ? 'Бесплатно' : NumeralUtil.format(PlanUtil.getCostWithDiscount(planData.price, periodDiscount), '0,0')}</span>
                            {plan !== 'free' && <Icon className={s.costIcon} icon='rouble' />}
                          </div>
                          {plan !== 'free' && <span className={s.costText}>в месяц</span>}
                        </div>

                        {plan === 'free' && <span className={s.costDescription}>Навсегда</span>}
                        {plan !== 'free' && period === 1 && <span className={s.costDescription}>Оплата раз в месяц</span>}
                        {plan !== 'free' && period === 12 && <span className={s.costDescription}>Оплата раз в год</span>}

                        <ButtonTextGroup>
                          <ButtonText onClick={e => this.handleChangePlan(e, plan)}>Выбрать</ButtonText>
                        </ButtonTextGroup>
                      </div>

                      <div className={cx(s.section, s.invisibleTitle)}>
                        <span className={s.title}>.</span>

                        <div className={s.rows}>
                          <div className={s.row}>
                            <div>Статистика проекта</div> <Icon icon='check' />
                          </div>

                          <div className={s.rowDescription}>
                            <span className={s.rowText}>{NumeralUtil.format(planData.projects, '0,0', ['проект', 'проекта, в каждом:', 'проектов, в каждом:'])}</span>
                          </div>

                          <div className={s.rowDescription}>
                            <span className={s.rowText}>— {NumeralUtil.format(planData.communities, '0,0', ['своя страница', 'свои страницы из разных соцсетей', 'своих страниц из разных соцсетей'])}</span>
                          </div>

                          <div className={s.rowDescription}>
                            <span className={s.rowText}>— {NumeralUtil.format(planData.competitors, '0,0', ['конкурент', 'конкурента', 'конкурентов'])}</span>
                          </div>

                          <div className={s.rowDescription}>
                            <span className={s.rowText}>— {NumeralUtil.format(planData.influencers, '0,0', ['блогер', 'блогера', 'блогеров'])}</span>
                          </div>

                          <div className={s.rowDescription}>
                            <span className={s.rowText}>Всего {NumeralUtil.format(planData.projects * (planData.communities + planData.competitors + planData.influencers), '0,0', ['страница', 'страницы', 'страниц'])}</span>
                          </div>

                          <div className={s.rowDescription}>
                            <span className={s.rowText}>История {NumeralUtil.format(planData.retrospectives, '0,0', ['месяц', 'месяца', 'месяцев'])}</span>
                          </div>

                          <div className={cx(s.rowDescription, s.rowDescriptionColumn)}>
                            <div className={s.priorityText}>Скорость сбора статистики</div>
                            <div className={s.priorityBlock}>
                              {Array(planData.priority + 1).fill(null).map(p => <Icon key={p} icon='bookmarks_unselected' />)}
                            </div>
                          </div>

                          <div className={s.space} />

                          {/*<div className={s.row}>*/}
                          {/*  <span className={s.rowText}>{NumeralUtil.format(planData.competitors, '0,0', ['конкурент', 'конкурента', 'конкурентов'])}</span>*/}
                          {/*</div>*/}

                          {/*<div className={s.row}>*/}
                          {/*  <span className={s.rowText}>{NumeralUtil.format(planData.influencers, '0,0', ['блогер', 'блогера', 'блогеров'])}</span>*/}
                          {/*</div>*/}

                          <div className={cx(s.row, {[s.none]: !planData.reports.includes('influencers_xlsx')})}>
                            <div>Отчеты Excel</div>
                            <Icon icon={planData.reports.includes('influencers_xlsx') ? 'check' : 'cross'}/>
                          </div>

                          <div className={cx(s.row, {[s.none]: ['free', 'start'].includes(plan)})}>
                            <div>Статистика в поиске</div>
                            <Icon icon={!['free', 'start'].includes(plan) ? 'check' : 'cross'}/>
                          </div>

                          <div className={cx(s.row, { [s.none]: ['free', 'start'].includes(plan) })}>
                            <div>Рейтинг</div>
                            <Icon icon={!['free', 'start'].includes(plan) ? 'check' : 'cross'} />
                            {planData.topRating > 20 && <span>Топ {planData.topRating}</span>}
                          </div>

                          <div className={cx(s.row, {[s.none]: ['free', 'start'].includes(plan)})}>
                            <div>Поиск блогеров</div>
                            <Icon icon={!['free', 'start'].includes(plan) ? 'check' : 'cross'}/>

                            {planData.topRating > 20 && <span>Топ {planData.topRating}</span>}
                          </div>
                        </div>
                      </div>

                      {!short && <div className={cx(s.section, s.invisibleSection)}>
                      <span className={s.title}>.</span>

                        <div className={s.rows}>
                          <div className={cx(s.row, { [s.none]: planData.competitors === 0 })}>
                            <Icon icon={planData.competitors > 0 ? 'check' : 'cross'} />
                          </div>

                          <div className={s.row}>
                            <Icon icon='filetype_xls' />
                          </div>

                          <div className={cx(s.row, { [s.none]: !planData.postGrade })}>
                            <Icon icon={planData.postGrade ? 'check' : 'cross'} />
                          </div>

                          <div className={cx(s.row, { [s.none]: !planData.communityScore })}>
                            <Icon icon={planData.communityScore ? 'check' : 'cross'} />
                          </div>

                          <div className={cx(s.row, { [s.none]: !planData.qualityScore })}>
                            <Icon icon={planData.qualityScore ? 'check' : 'cross'} />
                          </div>

                          <div className={cx(s.row, { [s.none]: !planData.reports.includes('influencers_xlsx') })}>
                            <Icon icon={planData.reports.includes('influencers_xlsx') ? 'check' : 'cross'} />
                          </div>

                          <div className={s.row}>
                            <span className={s.rowText}>Топ {NumeralUtil.format(planData.topRating, '0,0')}</span>
                          </div>

                          <div className={s.row}>
                            <span className={s.rowText}>{NumeralUtil.format(planData.indexLevel + 1, '0,0', ['уровень', 'уровня', 'уровня'])}</span>
                          </div>
                        </div>
                      </div>}

                      {!short && <div className={cx(s.section, s.invisibleSection)}>
                        <span className={s.title}>.</span>

                        <div className={s.rows}>
                          <div className={s.row}>
                            <Icon icon='check' />
                          </div>

                          <div className={s.row}>
                            <Icon icon='check' />
                          </div>
                        </div>
                      </div>}
                    </div>
                  </>)
              }
            )}
          </div>
        </Block>
      </BlockGroup>
    )
  }
}
