import React, { Component } from 'react'
import ButtonText from '../../elements/ButtonText/ButtonText'
import Title from '../../elements/Title/Title'
import Footer from '../../elements/Footer/Footer'
import { inject, observer } from 'mobx-react'
import { IStoreContext, Stores } from '../../stores/RootStore'
import BlogStore from '../../stores/BlogStore'
import { SingletonRouter, withRouter } from 'next/router'
import Article from '../../elements/Article/Article'
import ProfileStore from '../../stores/ProfileStore'
import Meta from '../../components/Meta'
import Header from '../../elements/Header/Header'
import Segment from '../../elements/Segment/Segment'
import Container from '../../elements/Container/Container'
import Row from '../../elements/Row/Row'
import Col from '../../elements/Col/Col'
import Text from '../../elements/Text/Text'
import ButtonTagGroup from '../../elements/ButtonTag/ButtonTagGroup'
import ButtonTag from '../../elements/ButtonTag/ButtonTag'
import ArticleGroup from '../../elements/Article/ArticleGroup'
import TextColor from '../../elements/TextColor/TextColor'

interface IProps {
  router: SingletonRouter
  profileStore?: ProfileStore
  blogStore?: BlogStore
}

@(withRouter as any)
@inject(Stores.PROFILE_STORE, Stores.BLOG_STORE)
@observer
export default class BlogPage extends Component<IProps, any> {
  static async getInitialProps (ctx: IStoreContext): Promise<Partial<any>> {
    const { blogStore } = ctx.store


    await blogStore.loadTags()
    await blogStore.loadPosts('blog')

    return {}
  }

  loadNextPage = async () => {
    const { blogStore } = this.props

    if (blogStore.isLoadingPosts) return

    await blogStore.loadPosts('blog', [], blogStore.nextPage)
  }

  render (): JSX.Element {
    const { blogStore } = this.props

    return (
      <>
        <Meta
          title='Блог'
          description='Рассказываем о наших сервисах, делимся своим опытом и новостями из мира социальных сетей'
          image='/images/sharing.png'
          keywords='Блог, опыт, статьи, публикации, интересное, лайфхаки'
        />
        <Header>

        </Header>

        <Segment>
          <Container>
            <Row padding='xxl'>
              <Col size={10} center>
                <Title size='xl' center>Блог КУБ</Title>
              </Col>
            </Row>
            <Row padding='m'>
              <Col size={10} center>
                <Text size='xl' semibold center><TextColor color='dark'>
                  Рассказываем о наших сервисах, делимся своим опытом и новостями из мира социальных сетей
                </TextColor></Text>
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
                    isDraft={post?.status === 'draft'}
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

        <Row padding='xxl' />

        <Footer />
      </>
    )
  }
}
