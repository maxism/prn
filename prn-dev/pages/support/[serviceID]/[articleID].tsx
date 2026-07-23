import React, { Component } from 'react'
import { withRouter, SingletonRouter } from 'next/router'
import Title from '../../../elements/Title/Title'
import TextColor from '../../../elements/TextColor/TextColor'
import Footer from '../../../elements/Footer/Footer'
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
import SupportBlockItem from '../../../elements/SupportBlock/SupportBlockItem'
import SupportBlock from '../../../elements/SupportBlock/SupportBlock'
import ButtonTextGroup from '../../../elements/ButtonText/ButtonTextGroup'
import ButtonText from '../../../elements/ButtonText/ButtonText'
import NumeralUtil from '../../../utils/NumeralUtil'
import Link from '../../../elements/Link/Link'

interface IRouter extends SingletonRouter {
  /**
   * query
   */
  query: {
    /**
     * serviceID
     */
    serviceID: string
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
export default class SupportArticlePage extends Component<IProps, any> {
  /**
   * getInitialProps
   */
  static async getInitialProps (ctx: IStoreContext): Promise<Partial<any>> {
    const { blogStore } = ctx.store
    const { serviceID, articleID } = ctx.query
    const service = blogStore.getTagBySlug(String(serviceID))

    await blogStore.loadTags()
    await blogStore.loadPost(String(articleID))
    await blogStore.loadPosts('support', [service?.tagID], 1, 5)

    return {}
  }

  render (): JSX.Element {
    const { router, profileStore, blogStore } = this.props
    const { serviceID } = router.query
    const service = blogStore.getTagBySlug(serviceID)

    if (blogStore.isLoadingPost) return null

    return (
      <>
        <Meta
          title={`${blogStore.post?.postTitle} — Поддержка`}
          description={blogStore.post?.preview}
          keywords={blogStore.post?.tags?.map(tag => tag.name).join(', ')}
          canonicalUrl={`/support/article/${service.slug}/${blogStore.post?.slug}`}
        />
        <Header />

        <Segment>
          <Container>
            <Row padding='xxl'>
              <Col size={8} center>
                <ButtonTagGroup>
                  {blogStore.post?.status === 'draft' && <ButtonTag color='red'>Черновик</ButtonTag>}
                  <ButtonTag color='grey' icon={service.icon} to={`/support/${service.slug}`}>{service.name}</ButtonTag>
                  {blogStore.post?.tags?.filter(tag => tag.tagID !== service.tagID).map(tag => (
                    <ButtonTag color='grey' key={tag.tagID} icon={tag.icon} to={`/support/${service.slug}#${tag.slug}`}>{tag.name}</ButtonTag>
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
            <Row padding='xl'>
              <Col size={8} center>
                <PostMD>
                  {blogStore.post?.text}
                </PostMD>
              </Col>
            </Row>

            {/*<Row padding='xxl'>*/}
            {/*  <Col size={8} center>*/}
            {/*    <SupportSurvey question='Эта статья была полезной?' />*/}
            {/*  </Col>*/}
            {/*</Row>*/}

            <Row padding='xxl' />
            <Row padding='xxl' />
          </Container>
        </Segment>

        <Segment color='#f9f9f9'>
          <Container>
            <Row padding='xxl'>
              <Col size={10} center>
                <Text size='l' semibold center>
                  <TextColor color='dark'>
                    Мы нашли несколько похожих записей:
                  </TextColor>
                </Text>
              </Col>
            </Row>
            <Row padding='l' />
            <Row padding='l'>
              <Col size={8} center>
                <SupportBlock>
                  {blogStore.recommendations.map(post => (
                    <SupportBlockItem key={post.postID} title={post.postTitle} to={`/support/${service.slug}/${post.slug}`} />
                  ))}
                </SupportBlock>
              </Col>
            </Row>
            <Row padding='xl'>
              <Col size={10} center>
                <ButtonTextGroup full size='s'>
                  <ButtonText size='l' to={`/support/${service.slug}`}>Посмотреть все записи</ButtonText>
                  <ButtonText size='l' onClick={() => window['carrotWrap']().open()} secondary>Написать в поддержку</ButtonText>
                </ButtonTextGroup>
              </Col>
            </Row>
            <Row padding='xxl' />
          </Container>
        </Segment>

        <ContactUs />

        <Footer />
      </>
    )
  }
}
