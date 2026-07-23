import React, { Component } from 'react'
import { withRouter, SingletonRouter } from 'next/router'
import Title from '../../../elements/Title/Title'
import TextColor from '../../../elements/TextColor/TextColor'
import Footer from '../../../elements/Footer/Footer'
import Image from '../../../elements/Image/Image'
import { IStoreContext, Stores } from '../../../stores/RootStore'
import { inject, observer } from 'mobx-react'
import BlogStore from '../../../stores/BlogStore'
import ProfileStore from '../../../stores/ProfileStore'
import PostMD from '../../../elements/PostMD/PostMD'
import Meta from '../../../components/Meta'
import Header from '../../../elements/Header/Header'
import Container from '../../../elements/Container/Container'
import Row from '../../../elements/Row/Row'
import Col from '../../../elements/Col/Col'
import Text from '../../../elements/Text/Text'
import Segment from '../../../elements/Segment/Segment'
import ButtonTag from '../../../elements/ButtonTag/ButtonTag'
import ButtonTagGroup from '../../../elements/ButtonTag/ButtonTagGroup'
import InlineTextList from '../../../elements/InlineTextList/InlineTextList'
import DateUtil from '../../../utils/DateUtil'
import ContactUs from '../../../elements/ContactUs/ContactUs'
import ArticleGroup from '../../../elements/Article/ArticleGroup'
import Article from '../../../elements/Article/Article'
import Link from '../../../elements/Link/Link'
import NumeralUtil from '../../../utils/NumeralUtil'

interface IRouter extends SingletonRouter {
  /**
   * query
   */
  query: {
    /**
     * postID
     */
    articleID: string
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
export default class BlogArticlePage extends Component<IProps, any> {
  /**
   * getInitialProps
   */
  static async getInitialProps (ctx: IStoreContext): Promise<Partial<any>> {
    const { articleID } = ctx.query
    const { blogStore } = ctx.store

    await blogStore.loadTags()
    await blogStore.loadPost(String(articleID))

    return {}
  }

  render (): JSX.Element {
    const { router, profileStore, blogStore } = this.props

    if (blogStore.isLoadingPost) return null

    return (
      <>
        <Meta
          title={`${blogStore.post?.postTitle} — Блог`}
          description={blogStore.post?.preview}
          keywords={blogStore.post?.tags?.map(tag => tag.name).join(', ')}
          image={blogStore.post?.postImage}
          noindex={blogStore.post?.postID === router.query?.articleID || blogStore.post?.type === 'support'}
          canonicalUrl={`/blog/article/${blogStore.post?.slug}`}
        />
        <Header />

        <Segment>
          <Container>
            <Row padding='xxl'>
              <Col size={8} center>
                <ButtonTagGroup>
                  {blogStore.post?.status === 'draft' && <ButtonTag color='red'>Черновик</ButtonTag>}
                  {blogStore.post?.tags?.map(tag => (
                    <ButtonTag color='grey' key={tag.tagID} icon={tag.icon} to={`/blog/tag/${tag.slug}`}>{tag.name}</ButtonTag>
                  ))}
                </ButtonTagGroup>
              </Col>
            </Row>
            <Row padding='m'>
              <Col size={8} center>
                <InlineTextList>
                  <Text size='s'><TextColor color='grey'>{blogStore.post?.author}</TextColor></Text>
                  <Text size='s'><TextColor color='grey'>{DateUtil.format(blogStore.post?.publishDate)}</TextColor></Text>
                </InlineTextList>
              </Col>
            </Row>
            {profileStore.isDeveloper() && (
              <Row padding='s'>
                <Col size={8} center>
                  <InlineTextList>
                    <Text size='s'><Link to={`/portal/blog/article/${blogStore.post?.postID}`} newTab>Редактировать</Link></Text>
                    <Text size='s'><TextColor color='grey'>{NumeralUtil.format(blogStore.post?.views, '0,0', ['просмотр', 'просмотра', 'просмотров'])}</TextColor></Text>
                  </InlineTextList>
                </Col>
              </Row>
            )}
            <Row padding='l'>
              <Col size={8} center>
                <Title size='l' as='h1'>{blogStore.post?.postTitle}</Title>
              </Col>
            </Row>
            {blogStore.post?.preview && (
              <Row padding='l'>
                <Col size={8} center>
                  <Text semibold>
                    <TextColor color='dark'>
                      {blogStore.post?.preview}
                    </TextColor>
                  </Text>
                </Col>
              </Row>
            )}
          </Container>
        </Segment>

        <Segment>
          <Container>
            {blogStore.post?.postImage && (
              <Row padding='xxl'>
                <Col size={10} center>
                  <Image src={blogStore.post?.postImage} border full article alt={blogStore.post?.postTitle} />
                </Col>
              </Row>
            )}
            <Row padding='xl'>
              <Col size={8} center>
                <PostMD>
                  {blogStore.post?.text}
                </PostMD>
              </Col>
            </Row>
          </Container>
        </Segment>

        {!!blogStore.recommendations?.length && (
          <>
            <Row padding='xxl' />
            <Row padding='xxl' />
            <Segment color='#f9f9f9'>
            <Container>
              <Row padding='xxl'>
                <Col size={10} center>
                  <Text size='l' semibold center>
                    <TextColor color='dark'>
                      Мы нашли пару похожих записей в нашем блоге.<br />
                      Посмотрите, возможно вам будет интересно:
                    </TextColor>
                  </Text>
                </Col>
              </Row>
              <Row padding='xxl'>
                <ArticleGroup>
                  {blogStore.recommendations.slice(0, 4).map(post => (
                    <Article
                      key={post.postID}
                      title={post.postTitle}
                      image={post.postImage}
                      to={`/blog/article/${post.slug}`}
                      tags={post.tags}
                      white
                    >
                      {post.preview}
                    </Article>
                  ))}
                </ArticleGroup>
              </Row>
              <Row padding='xxl' />
            </Container>
          </Segment>
        </>)}

        <ContactUs />

        <Footer />
      </>
    )
  }
}
