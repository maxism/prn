import { inject, observer } from 'mobx-react'
import React, { Component } from 'react'
import { Stores } from '../../stores/RootStore'
import withParams, { ParamsProps } from '../../utils/withParams'
import ModalPopup from '../../ui/elements/ModalPopup/ModalPopup'
import { IGlobalParams } from '../../interfaces/IParams'
import ProfileStore from '../../stores/ProfileStore'
import Description from '../../ui/elements/Description/Description'
import Segment from '../../ui/elements/Segment/Segment'
import ViewSurveyWelcome from '../../ui/elements/ViewSurveyWelcome/ViewSurveyWelcome'
import InputGroup from '../../ui/elements/InputGroup/InputGroup'
import Radio from '../../ui/elements/Radio/Radio'
import Checkbox from '../../ui/elements/Checkbox/Checkbox'
import Textarea from '../../ui/elements/Textarea/Textarea'

interface IState {
  isCompleted: boolean
  open: boolean
  cancel: boolean
  page: number
}

interface IProps {
  params?: ParamsProps<IGlobalParams>
  profileStore?: ProfileStore
}

/**
 * Модалка-опрос после регистрации в сервисе
 */

@withParams
@inject(Stores.PROFILE_STORE)
@observer
class SurveyWelcomeModal extends Component<IProps, IState> {

  public state: IState = {
    isCompleted: false,
    open: false,
    cancel: false,
    page: 1
  }

  constructor (props: IProps) {
    super(props)
    props.profileStore.profileForm.setData(props.profileStore.profile)
  }

  closeModal = () => this.setState({ page: 1, open: false, cancel: true })

  componentDidMount (): void {
    const { profileStore } = this.props
    if (profileStore.isAuth && profileStore.profile.showSurvey) {
      this.setState({ open: true })
    }
  }

  async componentDidUpdate (prevProps: Readonly<IProps>, prevState: Readonly<IState>, snapshot?: any): Promise<void> {
    const { profileStore, params } = this.props
    if (!profileStore.isLoading && profileStore.isAuth && !params.addCommunity && profileStore.profile.showSurvey && !this.state.open && !this.state.cancel) {
      this.setState({ open: true })
    }
  }

  handleComplete = async (completeType: string) => {
    let sendSurvey = false
    if (!this.state.isCompleted) {
      sendSurvey = true
      this.setState({ isCompleted: true })
    }

    if (completeType === 'finish') {
      this.handleNextClick()
    } else {
      this.closeModal()
    }

    if (sendSurvey) {
      const { profileStore } = this.props
      profileStore.surveyForm.completeType.change(completeType)
      await profileStore.sendSurvey()
      await profileStore.load(true)
    }
  }

  handleNextClick = () => {
    const page = this.state.page
    const nextPage = Math.min(page + 1, 5)
    this.setState({ page: nextPage })
  }

  handlePrevClick = () => {
    const page = this.state.page
    const prevPage = Math.max(page - 1, 1)
    this.setState({ page: prevPage })
  }

  handleChangeSelectedTasks = (e, name: string) => {
    const value = e.target.value
    const profileStore = this.props.profileStore
    const tasksValue = profileStore.surveyForm.tasks.value
    if (tasksValue.includes(name)) {
      if (!value) tasksValue.splice(tasksValue.indexOf(name), 1)
    } else if (value) {
      tasksValue.push(name)
    }
    profileStore.surveyForm.tasks.change(tasksValue)
  }

  renderGreetings = (): JSX.Element => {
    return (
      <ViewSurveyWelcome
        image='hello.png'
        title='Начало работы'
        nextButtonText='Отлично, поехали!'
        onNextClick={this.handleNextClick}
      >
        <Segment size={2}>
          <Description size='big'>
            Привет! Пройдите небольшой опрос, чтобы нам с вами было проще найти общий язык и сделать сервис максимально отвечающий вашим потребностям.
          </Description>
        </Segment>
      </ViewSurveyWelcome>
    )
  }

  renderStep01 = (): JSX.Element => {
    const representative = this.props.profileStore.surveyForm.representative
    return (
      <ViewSurveyWelcome
        step='Шаг 1 из 3'
        title='Сколько аккаунтов вы ведёте'
        nextButtonText='Следующий вопрос'
        onNextClick={this.handleNextClick}
      >
        <Segment size={2}>
          <Description size='big'>
            Чтобы мы понимали, с какими задачами и объемом страниц вы работаете, выберите подходящий вариант:
          </Description>
        </Segment>
        <Segment size={5}>
          <InputGroup big>
            <Radio
              big
              name='work'
              value='self'
              label='Я веду свой аккаунт / аккаунт для компании в которой работаю'
              checked={representative.value === 'self'}
              onChange={e => representative.change(e.target.value)}
            />
            <Radio
              big
              name='work'
              value='agency'
              label='Я веду несколько разных аккаунтов для других людей и компаний'
              checked={representative.value === 'agency'}
              onChange={e => representative.change(e.target.value)}
            />
          </InputGroup>
        </Segment>
      </ViewSurveyWelcome>
    )
  }

  renderStep02 = (): JSX.Element => {
    const MAX_CHECK_COUNT = 7
    const tasks = this.props.profileStore.surveyForm.tasks
    const checkedCount = tasks.value.length
    const data = [
      { name: 'reports', label: 'Создание отчётов', disabled: false },
      { name: 'competitors_posts', label: 'Анализ постов конкурентов', disabled: false },
      { name: 'statistics', label: 'Отслеживание статистики', disabled: false },
      { name: 'posts_inspiration', label: 'Поиск идей для постов', disabled: false },
      { name: 'my_posts', label: 'Анализ своих постов', disabled: false },
      { name: 'messenger', label: 'Ответы на комментарии и ЛС', disabled: false },
      { name: 'content_plan', label: 'Создание контент-плана', disabled: false },
      { name: 'posting', label: 'Постинг в социальные сети', disabled: false },
      { name: 'compare', label: 'Сравнение себя с конкурентами', disabled: false },
      { name: 'summary', label: 'Выводы о работе с соцсетями', disabled: false },
      { name: 'posts_create', label: 'Написание постов', disabled: false }
    ]
    return (
      <ViewSurveyWelcome
        step='Шаг 2 из 3'
        title='Какие задачи вы решаете?'
        nextButtonText='Продолжить'
        onNextClick={this.handleNextClick}
        prevButtonText='Вернуться назад'
        onPrevClick={this.handlePrevClick}
      >
        <Segment size={2}>
          <Description size='big'>
            {`С помощью нашего сервиса можно решить многие задачи — выберите те, которые вы чаще всего решаете. Можно выбрать **не более ${MAX_CHECK_COUNT} пунктов**:`}
          </Description>
        </Segment>
        <Segment size={5}>
          <InputGroup big column={2}>
            {data.map((item, index) => {
              const isChecked = tasks.value.includes(item.name)
              return (
                <Checkbox
                  key={index}
                  big
                  name={item.name}
                  label={item.label}
                  disabled={item.disabled || (!isChecked && checkedCount >= MAX_CHECK_COUNT)}
                  checked={isChecked}
                  onChange={e => this.handleChangeSelectedTasks(e, item.name)}
                />)
            })}
          </InputGroup>
        </Segment>
      </ViewSurveyWelcome>
    )
  }

  renderStep03 = (): JSX.Element => {
    const comment = this.props.profileStore.surveyForm.comment
    return (
      <ViewSurveyWelcome
        step='Шаг 3 из 3'
        title='У вас есть какие-то особые задачи?'
        nextButtonText='Завершить опрос'
        onNextClick={() => this.handleComplete('finish')}
        prevButtonText='Вернуться назад'
        onPrevClick={this.handlePrevClick}
      >
        <Segment size={2}>
          <Description size='big'>
            Если хотите, можете рассказать нам о своих уникальных задачах или болях, которые доставляют много сложностей в работе. Мы постараемся найти решения с помощью наших сервисов.
          </Description>
        </Segment>
        <Segment size={5}>
          <Textarea
            value={comment.value}
            placeholder='Опишите ваши особые задачи или самые часто используемые кейсы'
            onChange={e => comment.change(e.target.value)}
            focus
            minRows={5}
          />
        </Segment>
      </ViewSurveyWelcome>
    )
  }

  renderComplete = (): JSX.Element => {
    return (
      <ViewSurveyWelcome
        image={'good.png'}
        title='Спасибо!'
        nextButtonText='Приступить к работе'
        onNextClick={this.closeModal}
      >
        <Segment size={2}>
          <Description size='big'>
            Отлично, ваши ответы помогут сделать сервис лучше! Теперь создавайте проекты, добавляйте свои страницы и страницы конкурентов. Анализируйте показатели и работайте с контентом.
          </Description>
        </Segment>
      </ViewSurveyWelcome>
    )
  }

  render (): JSX.Element {
    const { page } = this.state
    return (
      <ModalPopup open={this.state.open} onCloseClick={() => this.handleComplete('close')} wide>
        { page === 1 && this.renderGreetings() }
        { page === 2 && this.renderStep01() }
        { page === 3 && this.renderStep02() }
        { page === 4 && this.renderStep03() }
        { page === 5 && this.renderComplete() }
      </ModalPopup>
    )
  }
}

export default SurveyWelcomeModal
