import React, { Component } from 'react'
import { withRouter } from 'next/router'
import { IStoreContext, Stores } from '../../../../stores/RootStore'
import { inject, observer } from 'mobx-react'
import BlogStore from '../../../../stores/BlogStore'
import AccessDeniedPage from '../../../../components/AccessDeniedPage'
import ProfileStore from '../../../../stores/ProfileStore'
import PortalBlogLayout from '../_PortalBlogLayout'
import ButtonTagGroup from '../../../../elements/ButtonTag/ButtonTagGroup'
import Row from '../../../../elements/Row/Row'
import Segment from '../../../../elements/Segment/Segment'
import Container from '../../../../elements/Container/Container'
import ButtonTag from '../../../../elements/ButtonTag/ButtonTag'

interface IProps {
  blogStore?: BlogStore
  profileStore?: ProfileStore
}

@(withRouter as any)
@inject(Stores.PROFILE_STORE, Stores.BLOG_STORE)
@observer
export default class PortalBlogTagsPage extends Component<IProps, any> {
  /**
   * getInitialProps
   */
  static async getInitialProps (ctx: IStoreContext): Promise<Partial<any>> {
    const { blogStore } = ctx.store

    await blogStore?.loadTags()

    return {}
  }

  render (): JSX.Element {
    const { profileStore, blogStore } = this.props

    if (!profileStore.isDeveloper()) return <AccessDeniedPage />
    if (blogStore.isLoadingTags) return null

    return (
      <PortalBlogLayout>

        <Segment>
          <Container>
            <Row padding='m' />
              <ButtonTagGroup>
                {blogStore.tags.map(tag => (
                  <ButtonTag to={`/portal/blog/tags/${tag.tagID}`} key={tag.tagID} icon={tag.icon} count={tag.count}>{tag.name}</ButtonTag>
                ))}
              </ButtonTagGroup>
          </Container>
        </Segment>
      </PortalBlogLayout>
    )
  }
}
