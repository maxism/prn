import React, { Component } from 'react'

import s from './PromoBlock.module.scss'
import Title from '../Title/Title'
import Text from '../Text/Text'
import ButtonText from '../ButtonText/ButtonText'
import BlockGroup from '../Block/BlockGroup'
import Block from '../Block/Block'
import TextColor from '../TextColor/TextColor'
import Row from '../Row/Row'
import Col from '../Col/Col'
import Icon from '../Icon/Icon'

type IPromo = 'analytics' | 'statistics' | 'statisticsCode'

interface IProps {
  promoType: IPromo | string
  promoCode?: string
}

/**
 * Элемент вывода информации по сообществу
 */
export default class PromoBlock extends Component<IProps> {

  render (): JSX.Element {
    const { promoType, promoCode } = this.props

    return (
      <>
        {promoType === 'statisticsCode' && <>
          <Row padding='xl' />
          <BlockGroup size='m'>
            <Block size={12} color='#a0adff' gradientColor='#5e69cf'>
              <Title size='l'><TextColor color='#ffffff'>
                {String(promoCode).toUpperCase()}
              </TextColor></Title>

              <Row padding='m' />
              <Title size='xs'><TextColor color='#ffffff'>
                Промокод на бесплатный доступ на 14 дней
              </TextColor></Title>

              <Row padding='xs' />
              <Text size='s' maxWidth='620px'><TextColor color='#f2f2f2'>
                При регистрации с этим промокодом вы получите бесплатный доступ ко всем функциям КУБ Statistics на 14 дней.
              </TextColor></Text>

              <Row padding='l' />
              <ButtonText to={`https://prn.c-cube.ru?modal=registration&promoCode=${promoCode}`} _blank size='l' colorBackground>Зарегистрироваться</ButtonText>
            </Block>
          </BlockGroup>
        </>}

        {promoType === 'statistics' && <>
          <Row padding='xl' />
          <BlockGroup size='m'>
            <Block size={12} color='#a0adff' gradientColor='#5e69cf'>
              <Title size='m'><TextColor color='#ffffff'>
                Регистрируйтесь в КУБ Statistics
              </TextColor></Title>

              <Row padding='m' />
              <Text size='s' maxWidth='620px'><TextColor color='#E6E6E6'>
                Удобная и наглядная статистика по 12 соцсетям. Возможность анализа конкурентов и сравнения с вашими страницами. Сервис оценит качество вашего контента и поможет разобраться с эффективностью контент-плана.
              </TextColor></Text>

              <Row padding='xs' />
              <Row padding='l'>
                <Col size={4}>
                  <div className={s.container}>
                    <Icon icon='calendar' size='l' color='#ffffff' />
                    <Text size='s'><TextColor color='#ffffff'>
                      Пробный доступ на 3 дня
                    </TextColor></Text>
                  </div>
                </Col>

                <Col size={4}>
                  <div className={s.container}>
                    <Icon icon='view_grid' size='l' color='#ffffff' />
                    <Text size='s'><TextColor color='#ffffff'>
                      Добавляйте до 9 страниц в проект
                    </TextColor></Text>
                  </div>
                </Col>

                <Col size={4}>
                  <div className={s.container}>
                    <Icon icon='advertising' size='l' color='#ffffff' />
                    <Text size='s'><TextColor color='#ffffff'>
                      Демо-доступ без привязки карты
                    </TextColor></Text>
                  </div>
                </Col>
              </Row>

              <Row padding='xs' />
              <Row padding='l' />
              <ButtonText to='https://prn.c-cube.ru?modal=registration' _blank size='l' colorBackground>Зарегистрироваться</ButtonText>
            </Block>
          </BlockGroup>
        </>}

        {promoType === 'analytics' && <>
          <Row padding='xl' />
          <BlockGroup size='m'>
            <Block size={12} color='#a0adff' gradientColor='#5e69cf'>
              <Title size='m'><TextColor color='#ffffff'>
                Попробуйте профессиональный инструмент — КУБ Analytics
              </TextColor></Title>

              <Row padding='m' />
              <Text size='s' maxWidth='620px'><TextColor color='#E6E6E6'>
                Безграничные возможности для аналитики социальных сетей. Возможность настроить сервис под любые задачи бизнеса.
              </TextColor></Text>

              <Row padding='xs' />
              <Row padding='l'>
                <Col size={4}>
                  <div className={s.container}>
                    <Icon icon='user' size='l' color='#ffffff' />
                    <Text size='s'><TextColor color='#ffffff'>
                      Индивидуальный подход к клиентам
                    </TextColor></Text>
                  </div>
                </Col>

                <Col size={4}>
                  <div className={s.container}>
                    <Icon icon='item_duplicate' size='l' color='#ffffff' />
                    <Text size='s'><TextColor color='#ffffff'>
                      Мощные инструменты для отчётности
                    </TextColor></Text>
                  </div>
                </Col>

                <Col size={4}>
                  <div className={s.container}>
                    <Icon icon='admin' size='l' color='#ffffff' />
                    <Text size='s'><TextColor color='#ffffff'>
                      Уникальные возможности сервиса
                    </TextColor></Text>
                  </div>
                </Col>
              </Row>

              <Row padding='xs' />
              <Row padding='l' />
              <ButtonText to='https://prn.c-cube.ru/analytics?modal=analytics-demo' _blank size='l' colorBackground>Запрос демо-доступа</ButtonText>
            </Block>
          </BlockGroup>
        </>}
      </>
    )
  }
}
