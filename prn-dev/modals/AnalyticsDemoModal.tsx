import React, { Component } from 'react'

import ModalPopup from '../elements/ModalPopup/ModalPopup'
import { SingletonRouter, withRouter } from 'next/router'
import {inject, observer} from 'mobx-react'
import Title from '../elements/Title/Title'
import Row from '../elements/Row/Row'
import Text from '../elements/Text/Text'
import FormRow from '../elements/Form/FormRow'
import InputText from '../elements/InputText/InputText'
import ButtonText from '../elements/ButtonText/ButtonText'
import Form from '../elements/Form/Form'
import {Stores} from '../stores/RootStore'
import ProfileStore from '../stores/ProfileStore'
import RequestStore from '../stores/RequestStore'
import Textarea from '../elements/Textarea/Textarea'
import Link from '../elements/Link/Link'
import RouterUtil from '../utils/RouterUtil'

interface IRouter extends SingletonRouter {
  /**
   * query
   */
  query: {
    /**
     * Название модалки
     */
    modal: string
  }
}

interface IProps {
  /**
   * router
   */
  router?: IRouter
  profileStore?: ProfileStore
  requestStore?: RequestStore
}

@(withRouter as any)
@inject(Stores.PROFILE_STORE, Stores.REQUEST_STORE)
@observer
export default class AnalyticsDemoModal extends Component<IProps, any> {
  constructor (props: IProps) {
    super(props)
  }

  handleOpen = async () => {
    const { profileStore, requestStore } = this.props

    requestStore.clear()
    requestStore.requestForm.setData({
      name: profileStore.profile?.name || '',
      email: profileStore.profile?.email || '',
      phone: '',
      company: '',
      target: '',
    })
  }

  submit = async () => {
    await this.props.requestStore.sendAnalyticsRequest()
  }

  render (): JSX.Element {
    const { router, requestStore } = this.props

    return (
      <ModalPopup
        open={router?.query?.modal === 'analytics-demo'}
        onCloseClick={() => RouterUtil.replaceParams(router, { modal: undefined })}
        onOpen={this.handleOpen}
      >
        {requestStore.isSent && (
          <>
            <Title>Запрос отправлен</Title>
            <Row padding='m'/>
            <Text size='m' semibold>
              Спасибо, мы получили ваш запрос. В ближайшее время с вами свяжется наш менеджер и расскажет всё про демо-доступ. Мы с радостью расскажем об Аналитике её возможностях.
            </Text>
            <Row padding='xs'/>
            <Row padding='l'/>
            <ButtonText type='submit' size='l' loading={requestStore.isValidate}>Супер, буду ждать!</ButtonText>
          </>
        )}
        {!requestStore.isSent && (
          <>
            <Title>Запрос демо-доступа</Title>
            <Row padding='m'/>
            <Text size='m' semibold>
              Для запроса нам потребуются некоторые данные — ваши контакты и небольшое описание задач, которые планируется решать с помощью Аналитики.
            </Text>
            <Row padding='xs' />
            <Row padding='l'/>

            <Form onSubmit={this.submit}>
              <FormRow>
                <InputText
                  label='Имя'
                  value={requestStore.requestForm.name.value}
                  error={requestStore.requestForm.name.error}
                  onChange={e => requestStore.requestForm.name.change(e.target.value)}
                  white
                />
                <InputText
                  label='Телефон'
                  value={requestStore.requestForm.phone.value}
                  error={requestStore.requestForm.phone.error}
                  onChange={e => requestStore.requestForm.phone.change(e.target.value)}
                  white
                />
                <InputText
                  label='Почта'
                  value={requestStore.requestForm.email.value}
                  error={requestStore.requestForm.email.error}
                  onChange={e => requestStore.requestForm.email.change(e.target.value)}
                  white
                />
                <InputText
                  label='Компания'
                  value={requestStore.requestForm.company.value}
                  error={requestStore.requestForm.company.error}
                  onChange={e => requestStore.requestForm.company.change(e.target.value)}
                  white
                />
              </FormRow>
              <FormRow full>
                <Textarea
                  placeholder='Опишите ваши задачи'
                  value={requestStore.requestForm.target.value}
                  onChange={e => requestStore.requestForm.target.change(e.target.value)}
                  minRows={3}
                  maxRows={8}
                  white
                />
              </FormRow>
              <Row padding='s' />
              <FormRow buttons>
                <ButtonText type='submit' size='l' loading={requestStore.isValidate}>Отправить запрос</ButtonText>
              </FormRow>
            </Form>

            <Row padding='s' />
            <Text size='xs' maxWidth>
              Нажимая на кнопку, вы соглашаетесь с нашей <Link to='/agreements'>политикой обработки персональных данных</Link>.
            </Text>
          </>)}
      </ModalPopup>
    )
  }
}
