import { inject, observer } from 'mobx-react'
import React, { Component } from 'react'
import { Stores } from '../../stores/RootStore'
import withParams, { ParamsProps } from '../../utils/withParams'
import ModalPopup from '../../ui/elements/ModalPopup/ModalPopup'
import { IGlobalParams } from '../../interfaces/IParams'
import ProfileStore from '../../stores/ProfileStore'
import Title from '../../ui/elements/Title/Title'
import Segment from '../../ui/elements/Segment/Segment'
import Description from '../../ui/elements/Description/Description'
import Button from '../../ui/elements/Button/Button'
import SettingsButton from '../../ui/elements/SettingsButton/SettingsButton'
import CommunityType from '../../types/CommunityType'
import List from '../../ui/elements/List/List'

interface IState {
  open: boolean
}

interface IProps {
  params?: ParamsProps<IGlobalParams>
  profileStore?: ProfileStore
}

/**
 * Модалка смены пароля
 */

@withParams
@inject(Stores.PROFILE_STORE)
@observer
class PremiumModal extends Component<IProps, IState> {

  public state: IState = {
    open: false
  }

  componentDidUpdate (prevProps: Readonly<IProps>, prevState: Readonly<IState>, snapshot?: any): void {
    const { params } = this.props

    if (params.premium && !prevState.open && !this.state.open) this.setState({ open: true })
    if (!params.premium && prevState.open && this.state.open) this.setState({ open: false })
  }

  handleClose = () => {
    this.props.params.changeParams({ premium: undefined })
  }

  render (): JSX.Element {
    const { profileStore, params } = this.props

    const toChangePlan = `https://prn.c-cube.ru/settings/subscription?modal=change-plan&planName=&planPeriod=1&token=${profileStore.token}`

    return (
      <ModalPopup open={this.state.open} onCloseClick={this.handleClose}>

        <Title size='big' text='КУБ Premium' />

        <Segment size={1}>
          <Description size='big'>
            Больше эксклюзивных функций и возможность поддержать сервис.
          </Description>
        </Segment>

        <Segment size={0}>
          <Button
            size='extra-large'
            to={toChangePlan}
            wide
            color='green'
          >
            Выбрать подходящий тариф
          </Button>
        </Segment>

        <Segment size={0}>
          <List>
            <SettingsButton
              icon='star_fill'
              iconColor='#ff9f00'
              title='Больше страниц'
              description='Одновременный сбор данных по большему количеству страниц'
              to={toChangePlan}
            />
            <SettingsButton
              icon='d_calendar'
              iconColor='#00AD00'
              title='Статистика за большой период'
              description='Исторические данные и статистика до 2х лет назад'
              to={toChangePlan}
            />
            <SettingsButton
              icon='xlsx'
              iconColor='#1877f2'
              title='Выгрузка отчетов'
              description='По своим страницам, конкурентам, блогерам или целиком по проекту'
              to={toChangePlan}
            />
            <SettingsButton
              icon='duplicate'
              iconColor='#FFA5CC'
              title='Больше проектов'
              description='Одновременное управление несколькими проектами'
              to={toChangePlan}
            />
            <SettingsButton
              icon='stats_up'
              iconColor='#7FC0FD'
              title='Скорость анализа'
              description='Приоритетная загрузка и обновление статистики'
              to={toChangePlan}
            />
          </List>
        </Segment>

      </ModalPopup>
    )
  }
}

export default PremiumModal
