import React, { Component } from 'react'
import ButtonText from '../../../elements/ButtonText/ButtonText'
import Title from '../../../elements/Title/Title'
import Footer from '../../../elements/Footer/Footer'
import { SingletonRouter, withRouter } from 'next/router'
import { IStoreContext, Stores } from '../../../stores/RootStore'
import Article from '../../../elements/Article/Article'
import BlogStore from '../../../stores/BlogStore'
import { inject, observer } from 'mobx-react'
import ProfileStore from '../../../stores/ProfileStore'
import Meta from '../../../components/Meta'
import Header from '../../../elements/Header/Header'
import Segment from '../../../elements/Segment/Segment'
import Container from '../../../elements/Container/Container'
import Row from '../../../elements/Row/Row'
import Col from '../../../elements/Col/Col'
import ButtonTagGroup from '../../../elements/ButtonTag/ButtonTagGroup'
import ButtonTag from '../../../elements/ButtonTag/ButtonTag'
import ArticleGroup from '../../../elements/Article/ArticleGroup'
import ContactUs from '../../../elements/ContactUs/ContactUs'

interface IRouter extends SingletonRouter {
  /**
   * query
   */
  query: {
    /**
     * tagID
     */
    tagID: string
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

@(withRouter as any)
@inject(Stores.PROFILE_STORE, Stores.BLOG_STORE)
@observer
export default class BlogTagPage extends Component<IProps, any> {
  static async getInitialProps (ctx: IStoreContext): Promise<Partial<any>> {
    const { blogStore } = ctx.store
    const { tagID } = ctx.query

    await blogStore.loadTags()
    await blogStore.loadPosts('blog', [blogStore.getTagBySlug(String(tagID))?.tagID])

    return {}
  }

  loadNextPage = async () => {
    const { router, blogStore } = this.props
    const { tagID } = router.query
    const category = blogStore.getTagBySlug(tagID)

    if (blogStore.isLoadingPosts) return

    await blogStore.loadPosts('blog', [category.tagID], blogStore.nextPage)
  }

  render (): JSX.Element {
    const { router, blogStore } = this.props
    const { tagID } = router.query

    const category = blogStore.getTagBySlug(tagID)

    return (
      <>
        <Meta
          title={`${category.name} — Блог`}
          description={`Блог КУБ — ${category.name} — Рассказываем о наших сервисах, делимся своим опытом и новостями из мира социальных сетей`}
          keywords={`${category.name}, блог КУБ, новости сервисов, исследования, аналитика, статистика, соцсети`}
        />
        <Header />

        <Segment>
          <Container>
            <Row padding='xxl'>
              <Col size={10} center>
                <Title size='xl' center>{category.name}</Title>
              </Col>
            </Row>
          </Container>
        </Segment>
        <Segment>
          <Container>
            <Row padding='xl'>
              <Col size={10} center>
                <ButtonTagGroup full center>
                  {blogStore.getPostsCategories().slice(0, 6).map(tag => <ButtonTag key={tag.tagID} icon={tag.icon} to={`/blog/tag/${tag.slug}`}>{tag.name}</ButtonTag>)}
                  <ButtonTag to='/blog' badge>Все рубрики</ButtonTag>
                </ButtonTagGroup>
              </Col>
            </Row>
          </Container>
        </Segment>
        <Segment>
          <Container>
            <Row padding='xxl' />
            <ArticleGroup>
              {blogStore.posts.map(post => (
                <Article
                  key={post.postID}
                  title={post.postTitle}
                  image={post.postImage}
                  to={`/blog/article/${post.slug}`}
                  tags={post.tags}
                >
                  {post.preview}
                </Article>
              ))}
            </ArticleGroup>
          </Container>
        </Segment>

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

        <ContactUs />

        <Footer />
      </>
      )
  }
}
