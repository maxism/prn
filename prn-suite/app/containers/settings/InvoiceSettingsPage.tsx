import React, { Component } from 'react'
import Segment from '../../ui/elements/Segment/Segment'
import LiteLayout from '../layouts/LiteLayout'
import Toolbar2Group from '../../ui/elements/Toolbar2/Toolbar2Group'
import Toolbar2 from '../../ui/elements/Toolbar2/Toolbar2'
import ButtonText from '../../ui/elements/ButtonText/ButtonText'
import Title from '../../ui/elements/Title/Title'
import Description from '../../ui/elements/Description/Description'
import { inject, observer } from 'mobx-react'
import { Stores } from '../../stores/RootStore'
import PlanStore from '../../stores/PlanStore'
import PaymentInfo from '../../ui/elements/PaymentInfo/PaymentInfo'
import {Helmet} from 'react-helmet'

interface IProps {
  planStore?: PlanStore
}

@inject(Stores.PLAN_STORE)
@observer
class InvoiceSettingsPage extends Component<IProps> {
  constructor (props: IProps) {
    super(props)
    this.load()
  }

  load = () => {
    this.props.planStore.load()
  }

  render (): JSX.Element {
    const { planStore } = this.props

    return (
      <LiteLayout>
        {/* @ts-ignore */}
        <Helmet>
          <title>Подписка и оплата, История оплаты — КУБ Suite</title>
        </Helmet>

        <Toolbar2>
          <Toolbar2Group>
            <ButtonText to='/settings/plan' icon='left'>Назад</ButtonText>
          </Toolbar2Group>
        </Toolbar2>
        <Segment size={3} />
        <Title size='big'>История оплаты</Title>
        <Segment size={3} />
        <Description size='big'>Здесь вы можете посмотреть все совершенные транзакции в сервисе. Раскройте блоки, чтобы посмотреть детальную информацию — дату  транзакции, её номер и что именно было оплачено.</Description>
        <Segment size={3} />
        {
          planStore.getGroupInvoices().map((item, index) => {
            return (
              <>
                <PaymentInfo key={index} data={item} showDetails={index === 0} />
                <Segment size={1} />
              </>
            )
          })
        }
        <Segment size={3} />
      </LiteLayout>
    )
  }
}

export default InvoiceSettingsPage
