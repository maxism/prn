import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'

import Title from '../../../../elements/Title/Title'
import {IStoreContext, Stores} from '../../../../stores/RootStore'
import ProfileStore from '../../../../stores/ProfileStore'
import Meta from '../../../../components/Meta'
import Row from '../../../../elements/Row/Row'
import Col from '../../../../elements/Col/Col'
import Text from '../../../../elements/Text/Text'
import AccountsStore from '../../../../stores/AccountsStore'
import ProjectSettingsLayout from './_ProjectSettingsLayout'
import InputText from '../../../../elements/InputText/InputText'
import Form from '../../../../elements/Form/Form'
import FormRow from '../../../../elements/Form/FormRow'
import Select from '../../../../elements/Select/Select'
import ButtonText from '../../../../elements/ButtonText/ButtonText'
import {SingletonRouter, withRouter} from 'next/router'
import AccessDeniedPage from '../../../../components/AccessDeniedPage'
import RatingTagsStore from '../../../../stores/RatingTagsStore'

interface IRouter extends SingletonRouter {
  /**
   * query
   */
  query: {
    /**
     * projectID
     */
    projectID: string
  }
}

interface IProps {
  /**
   * router
   */
  router: IRouter
  profileStore?: ProfileStore
  accountsStore?: AccountsStore
  ratingTagsStore?: RatingTagsStore
}

@(withRouter as any)
@inject(Stores.PROFILE_STORE, Stores.ACCOUNTS_STORE, Stores.RATING_TAGS_STORE)
@observer
export default class ProjectInfoPage extends Component<IProps, any> {
  constructor (props: IProps) {
    super(props)
  }

  static async getInitialProps (ctx: IStoreContext): Promise<Partial<any>> {
    const { accountsStore, ratingTagsStore } = ctx.store
    const { projectID } = ctx.query

    await ratingTagsStore.load()

    const project = accountsStore.getProject(projectID as string)
    // console.log(project)
    accountsStore.projectForm.setData({
      name: project.name,
      country: project.country,
      category: project.category,
      reportPeriod: project.reportPeriod,
    })

    return {}
  }

  render (): JSX.Element {
    const { router, profileStore, accountsStore, ratingTagsStore } = this.props
    const { projectID } = router.query

    if (!profileStore.isAuth) return <AccessDeniedPage />

    return (
      <ProjectSettingsLayout>

        <Meta
          title='Настройки проекта'
        />

        <Row padding='xxl'>
          <Col size={12}>
            <Title>Настройки проекта</Title>
          </Col>
        </Row>
        <Row padding='m'>
          <Col size={12}>
            <Text semibold>
              Базовые настройки проекта повышают удобство работы с КУБ и помогают нашим алгоритмам лучше анализировать данные.
            </Text>
          </Col>
        </Row>

        <Row padding='xl'>
          <Col size={8}>
            <Form onSubmit={() => accountsStore.update(projectID)}>
              <FormRow>
                <InputText
                  white
                  label='Название проекта'
                  name='name'
                  value={accountsStore.projectForm.name.value}
                  error={accountsStore.projectForm.name.error}
                  onChange={e => accountsStore?.projectForm.name.change(e.target.value)}
                />
              </FormRow>
              <FormRow>
                <Select
                  label='Страна'
                  value={accountsStore.projectForm.country.value}
                  list={ratingTagsStore.getCountries.map(country => ({ id: country.tagID, icon: country.icon, name: country.name }))}
                  onSelect={e => accountsStore?.projectForm.country.change(e.target.value)}
                  maxHeight={290}
                  empty
                  white
                />
              </FormRow>
              <FormRow>
                <Select
                  white
                  label='Категория'
                  value={accountsStore.projectForm.category.value}
                  list={ratingTagsStore.getAllCategories.map(industry => ({ id: industry.tagID, name: industry.name, level: industry.level }))}
                  onSelect={e => accountsStore?.projectForm.category.change(e.target.value)}
                  maxHeight={290}
                  filtered
                  empty
                />
              </FormRow>
              {/*<FormRow>*/}
              {/*  <Select*/}
              {/*    white*/}
              {/*    label='Автоматические отчёты'*/}
              {/*    value={accountsStore.projectForm.reportPeriod.value}*/}
              {/*    list={[{ id: '1', name: 'Каждый день'}, { id: '2', name: 'Каждую неделю'}, { id: '3', name: 'Каждый месяц'}, { id: '4', name: 'Не получать отчёты'}]}*/}
              {/*    onSelect={e => accountsStore?.projectForm.reportPeriod.change(e.target.value)}*/}
              {/*    empty*/}
              {/*  />*/}
              {/*</FormRow>*/}
              <FormRow buttons>
                <ButtonText type='submit' size='l' loading={accountsStore.isLoading}>Сохранить изменения</ButtonText>
              </FormRow>
            </Form>
          </Col>
        </Row>

        <Row padding='xxs' />

      </ProjectSettingsLayout>
    )
  }
}
