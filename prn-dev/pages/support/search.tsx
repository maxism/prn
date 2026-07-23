import React, { Component } from 'react'

import Title from '../../elements/Title/Title'
import Footer from '../../elements/Footer/Footer'
import Meta from '../../components/Meta'
import Header from '../../elements/Header/Header'
import Segment from '../../elements/Segment/Segment'
import Container from '../../elements/Container/Container'
import Row from '../../elements/Row/Row'
import Col from '../../elements/Col/Col'
import Text from '../../elements/Text/Text'
import TextColor from '../../elements/TextColor/TextColor'
import InputText from '../../elements/InputText/InputText'
import SupportBlock from '../../elements/SupportBlock/SupportBlock'
import SupportBlockItem from '../../elements/SupportBlock/SupportBlockItem'
import { SingletonRouter, withRouter } from 'next/router'
import ProfileStore from '../../stores/ProfileStore'
import BlogStore from '../../stores/BlogStore'
import { inject, observer } from 'mobx-react'
import {IStoreContext, Stores} from '../../stores/RootStore'
import ButtonText from '../../elements/ButtonText/ButtonText'
import NumeralUtil from '../../utils/NumeralUtil'
import ButtonTextGroup from '../../elements/ButtonText/ButtonTextGroup'

interface IRouter extends SingletonRouter {
  /**
   * query
   */
  query: {
    /**
     * Поисковый запрос
     */
    q: string
  }
}

interface IProps {
  /**
   * router
   */
  router: IRouter
  profileStore?: ProfileStore
  blogStore?: BlogStore
}

interface IStates {
  query: string
}

@(withRouter as any)
@inject(Stores.PROFILE_STORE, Stores.BLOG_STORE)
@observer
export default class SupportSearchPage extends Component<IProps, IStates> {
  state: IStates = {
    query: this.props.router.query.q
  }

  static async getInitialProps (ctx: IStoreContext): Promise<Partial<any>> {
    const { blogStore } = ctx.store
    const { q } = ctx.query

    await blogStore.loadTags()
    await blogStore.loadPosts('support', [], 1, 20, String(q || ''))

    return {}
  }

  loadNextPage = async () => {
    const { router, blogStore } = this.props

    if (blogStore.isLoadingPosts) return

    // await blogStore.loadPosts('', [], blogStore.nextPage)
    await blogStore.loadPosts('support', [], blogStore.nextPage, 20, String(router.query.q || ''))
  }

  render (): JSX.Element {
    const { router, blogStore } = this.props

    return (
      <>
        <Meta
          title='Результаты поиска — Поддержка'
        />
        <Header>

        </Header>

        <Segment>
          <Container>
            <Row padding='xxl'>
              <Col size={10} center>
                <Title size='xl' center>Поиск</Title>
              </Col>
            </Row>
            <Row padding='m'>
              <Col size={10} center>
                <Text size='xl' semibold center><TextColor color='dark'>
                  Воспользуйтесь поиском по нашей базе знаний, чтобы найти нужную информацию
                </TextColor></Text>
              </Col>
            </Row>
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

        {!blogStore.posts.length && (
          <Segment>
            <Container>
              <Row padding='xxs'>
                <Col size={10} center>
                  <Title center><TextColor color='grey'>Ничего не найдено</TextColor></Title>
                </Col>
              </Row>
              <Row padding='l'>
                <Col size={10} center>
                  <Text center><TextColor color='grey'>К сожалению, мы ничего не нашли по вашему запросу. Возможно у нас ещё не появилась такая статья — напишите в поддержку, чтобы оперативно решить свой вопрос. А мы обязательно пополним нашу базу знаний!</TextColor></Text>
                </Col>
              </Row>
              <Row padding='l'>
                <Col size={10} center>
                  <ButtonTextGroup full>
                    <ButtonText size='l' onClick={() => window['carrotWrap']().open()}>Написать в поддержку</ButtonText>
                  </ButtonTextGroup>
                </Col>
              </Row>
            </Container>
          </Segment>
        )}
        {!!blogStore.posts.length && (
          <>
            <Segment>
              <Container>
                <Row padding='xl'>
                  <Col size={10} center>
                    <Title size='m'>Вот что мы нашли</Title>
                  </Col>
                </Row>
                <Row padding='m'>
                  <Col size={10} center>
                    <Text size='m' semibold>Итак, по вашему запросу в нашей базе знаний найдено {NumeralUtil.format(blogStore.posts.length, '0,0', ['статья', 'статьи', 'статей'])}. Если вы не найдете ответы — обратитесь в поддержу.</Text>
                  </Col>
                </Row>

                <Row padding='l'>
                  <Col size={10} center>
                    <SupportBlock>
                      {blogStore.posts.map(post => (
                        <SupportBlockItem key={post.postID} service={blogStore.getTagBySlug(post.tags[0]?.slug).name} title={post.postTitle} to={`/support/${post.tags[0]?.slug || 'article'}/${post.slug}`} />
                      ))}

                      {blogStore.nextPage && (
                        <Segment onEnterViewport={this.loadNextPage}>
                          <Container>
                            <Row padding='xxl'>
                              <Col center>
                                <ButtonText onClick={this.loadNextPage}>Слудующая страница {blogStore.nextPage} из {blogStore.totalPages}</ButtonText>
                              </Col>
                            </Row>
                          </Container>
                        </Segment>
                      )}
                    </SupportBlock>
                  </Col>
                </Row>
              </Container>
            </Segment>
          </>
        )}

        <Row padding='xxl' />
        <Row padding='xxl' />

        <Footer />
      </>
    )
  }
}
