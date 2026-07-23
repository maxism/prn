import React, { Component } from 'react'
import { SingletonRouter, withRouter } from 'next/router'
import { inject, observer } from 'mobx-react'

import Title from '../../../elements/Title/Title'
import Footer from '../../../elements/Footer/Footer'
import Meta from '../../../components/Meta'
import Header from '../../../elements/Header/Header'
import Segment from '../../../elements/Segment/Segment'
import Container from '../../../elements/Container/Container'
import Row from '../../../elements/Row/Row'
import Col from '../../../elements/Col/Col'
import Text from '../../../elements/Text/Text'
import TextColor from '../../../elements/TextColor/TextColor'
import InputText from '../../../elements/InputText/InputText'
import ContactUs from '../../../elements/ContactUs/ContactUs'
import SupportBlockItem from '../../../elements/SupportBlock/SupportBlockItem'
import SupportBlock from '../../../elements/SupportBlock/SupportBlock'
import {IStoreContext, Stores} from '../../../stores/RootStore'
import ProfileStore from '../../../stores/ProfileStore'
import BlogStore from '../../../stores/BlogStore'

interface IRouter extends SingletonRouter {
  /**
   * query
   */
  query: {
    /**
     * serviceID
     */
    serviceID: string
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
export default class SupportServicePage extends Component<IProps, IStates> {
  state: IStates = {
    query: ''
  }

  static async getInitialProps (ctx: IStoreContext): Promise<Partial<any>> {
    const { blogStore } = ctx.store
    const { serviceID } = ctx.query
    const service = blogStore.getTagBySlug(String(serviceID))

    await blogStore.loadTags()
    await blogStore.loadPosts('support', [service?.tagID], 1, 1000)

    return {}
  }

  render (): JSX.Element {
    const { router, blogStore } = this.props
    const { serviceID } = router.query

    const service = blogStore.getTagBySlug(serviceID)

    const postsCategories = blogStore.getPostsCategories([serviceID])

    return (
      <>
        <Meta
          title={`${service.name} — Поддержка`}
          description={service.description}
        />
        <Header>
        </Header>

        <Segment>
          <Container>
            <Row padding='xxl'>
              <Col size={10} center>
                <Title size='xl' center>{service.name}</Title>
              </Col>
            </Row>
            <Row padding='m'>
              <Col size={10} center>
                <Text size='xl' semibold center><TextColor color='dark'>
                  {service.description}
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

        {postsCategories.map(postCategory => (
          <>
            <Segment>
              <Container>
                <Row padding='xl'>
                  <Col size={10} center>
                    <Title size='m' id={postCategory.slug}>{postCategory.name}</Title>
                  </Col>
                </Row>
                <Row padding='m'>
                  <Col size={10} center>
                    <Text size='m' semibold>
                      {postCategory.description}
                    </Text>
                  </Col>
                </Row>
                <Row padding='l'>
                  <Col size={10} center>
                    <SupportBlock>
                      {blogStore.posts.filter(post => post.tags.filter(tag => tag.tagID === postCategory.tagID).length).map(post => (
                        <SupportBlockItem key={post.postID} title={post.postTitle} to={`/support/${service.slug}/${post.slug}`} />
                      ))}
                    </SupportBlock>
                  </Col>
                </Row>
              </Container>
            </Segment>
          </>
        ))}

        <ContactUs />

        <Footer />
      </>
    )
  }
}
