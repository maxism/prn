import React, { Component } from 'react'
import {SingletonRouter, withRouter} from 'next/router'

import Title from '../../elements/Title/Title'
import Footer from '../../elements/Footer/Footer'
import Article from '../../elements/Article/Article'
import Meta from '../../components/Meta'
import Header from '../../elements/Header/Header'
import Segment from '../../elements/Segment/Segment'
import Container from '../../elements/Container/Container'
import Row from '../../elements/Row/Row'
import Col from '../../elements/Col/Col'
import Text from '../../elements/Text/Text'
import ArticleGroup from '../../elements/Article/ArticleGroup'
import TextColor from '../../elements/TextColor/TextColor'
import InputText from '../../elements/InputText/InputText'
import ContactUs from '../../elements/ContactUs/ContactUs'
import BlockGroup from '../../elements/Block/BlockGroup'
import Block from '../../elements/Block/Block'
import Link from '../../elements/Link/Link'
import { inject, observer } from 'mobx-react'
import { Stores } from '../../stores/RootStore'
import ProfileStore from '../../stores/ProfileStore'

interface IProps {
  router: SingletonRouter
  profileStore?: ProfileStore
}

interface IStates {
  query: string
}

@(withRouter as any)
@inject(Stores.PROFILE_STORE)
@observer
export default class SupportPage extends Component<IProps, IStates> {
  state: IStates = {
    query: ''
  }

  render (): JSX.Element {
    const { router, profileStore } = this.props

    const isElamaPartner = profileStore.profile?.email?.includes('_oidc_elama@c-cube.ru')

    return (
      <>
        <Meta
          title='Поддержка'
          description='Здесь можно самостоятельно найти ответы на вопросы, возникающие в процессе работы по сервису КУБ'
          image='/images/sharing.png'
          keywords='Поддержка, помощь, вопросы, ответы, пользоваться'
        />
        <Header>

        </Header>

        <Segment>
          <Container>
            <Row padding='xxl'>
              <Col size={10} center>
                <Title size='xl' center>Поддержка</Title>
              </Col>
            </Row>
            <Row padding='m'>
              <Col size={10} center>
                <Text size='xl' semibold center><TextColor color='dark'>
                  Здесь можно самостоятельно найти ответы на вопросы, возникающие в процессе работы
                </TextColor></Text>
              </Col>
            </Row>

            {isElamaPartner && (
              <Row padding='xxl'>
                <Col size={8} center>
                  <BlockGroup>
                    <Block size={12} to='mailto:milo@elama.ru'>
                      <Title size='xs' center>Служба Заботы eLama</Title>
                      <Row padding='m' />
                      <Text center>
                        Если у вас возникают вопросы по использованию сервиса, пожалуйста, напишите на <Link to='mailto:milo@elama.ru'>milo@elama.ru</Link>
                      </Text>
                    </Block>
                  </BlockGroup>
                </Col>
              </Row>
            )}
          </Container>
        </Segment>
        <Segment>
          <Container>
            <Row padding='xl'>
              <Col size={10} center>
                <InputText
                  big
                  icon='search'
                  label='Поиск по базе знаний'
                  value={this.state.query}
                  onChange={e => this.setState({ query: e.target.value })}
                  onSubmit={() => router.push(`/support/search?q=${this.state.query}`)}
                />
              </Col>
            </Row>
            <Row padding='xxl' />
          </Container>
        </Segment>
        <Segment>
          <Container>
            <ArticleGroup>
              <Article
                title='База знаний КУБ Analytics'
                image={require('../../public/images/sharing_analytics.png')}
                to='/support/analytics'
                preview='Здесь вы найдете ответы на самые актуальные темы, например: работа с отчётами, работа с метками, добавление и редактирование страниц и командная работа.'
              />

              <Article
                title='База знаний КУБ Statistics'
                image={require('../../public/images/sharing_statistics.png')}
                to='/support/statistics'
                preview='Если у вас возникли вопросы по поводу Statistics, то в этом разделе  вы найдете много статей о том, как работает наш сервис. Описание всех функций, метрик и работы с проектами тоже здесь.'
              />

              {/*<Article*/}
              {/*  title='КУБ Rating — вопросы и ответы'*/}
              {/*  image={require('../../public/images/sharing_rating.png')}*/}
              {/*  to='/support/rating'*/}
              {/*  preview='Мы собрали всю актуальную информацию по нашему рейтингу в этом разделе — как считается рейтинг, как в него попасть, что такое отрасли и как всем этим пользоваться.'*/}
              {/*/>*/}

              {/*<Article*/}
              {/*  title='Сервис КУБ Social Index'*/}
              {/*  image={require('../../public/images/sharing_socialindex.png')}*/}
              {/*  to='/support/socialindex'*/}
              {/*  preview='В этом разделе помогаем разобраться с тем, как работает наш Social Index, объясняем, что изображено на графиках, рассказываем, что можно делать с этими данными.'*/}
              {/*/>*/}
            </ArticleGroup>
          </Container>
        </Segment>

        <ContactUs />

        <Footer />
      </>
    )
  }
}
