import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { IStoreContext, Stores } from '../../../stores/RootStore'
import { withRouter } from 'next/router'
import ProfileStore from '../../../stores/ProfileStore'
import AccessDeniedPage from '../../../components/AccessDeniedPage'
import PortalBlogLayout from './_PortalBlogLayout'
import BlogStore from '../../../stores/BlogStore'
import ButtonText from '../../../elements/ButtonText/ButtonText'
import Segment from '../../../elements/Segment/Segment'
import Container from '../../../elements/Container/Container'
import Row from '../../../elements/Row/Row'
import Col from '../../../elements/Col/Col'
import BlockGroup from '../../../elements/Block/BlockGroup'
import Block from '../../../elements/Block/Block'
import CommunityInfo from '../../../elements/CommunityInfo/CommunityInfo'
import ButtonTag from '../../../elements/ButtonTag/ButtonTag'
import ButtonTagGroup from '../../../elements/ButtonTag/ButtonTagGroup'

interface IProps {
  profileStore?: ProfileStore
}

interface IProps {
  profileStore?: ProfileStore
  blogStore?: BlogStore
}

@(withRouter as any)
@inject(Stores.PROFILE_STORE, Stores.BLOG_STORE)
@observer
export default class PortalBlogPage extends Component<IProps, any> {
  static async getInitialProps (ctx: IStoreContext): Promise<Partial<any>> {
    const { blogStore } = ctx.store

    await blogStore.loadTags()
    await blogStore.loadPosts()

    return {}
  }

  loadNextPage = async () => {
    const { blogStore } = this.props

    if (blogStore.isLoadingPosts) return

    await blogStore.loadPosts('', [], blogStore.nextPage)
  }

  render (): JSX.Element {
    const { profileStore, blogStore } = this.props

    if (!profileStore.isDeveloper()) return <AccessDeniedPage />

    return (
      <PortalBlogLayout>
        <Segment>
          <Container>
            <Row padding='m' />
            <BlockGroup size='s'>
              {blogStore.posts.map(post => (
                <Block size={6} to={`/portal/blog/article/${post.postID}`} key={post.postID}>
                  <CommunityInfo image={post.postImage} name={post.postTitle || 'Без названия'} url='' />
                  <Row padding='s' />
                  <ButtonTagGroup size='s'>
                    {post.type === 'blog' && <ButtonTag color='green' size='s'>Блог</ButtonTag>}
                    {post.type === 'support' && <ButtonTag color='blue' size='s'>Поддержка</ButtonTag>}
                    {post.status === 'draft' && <ButtonTag color='red' size='s'>Черновик</ButtonTag>}
                    {post.tags?.map(tag => (
                      <ButtonTag color='dark' size='s' key={tag.tagID} icon={tag.icon}>{tag.name}</ButtonTag>
                    ))}
                  </ButtonTagGroup>
                </Block>
              ))}
            </BlockGroup>
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
      </PortalBlogLayout>
    )
  }
}
