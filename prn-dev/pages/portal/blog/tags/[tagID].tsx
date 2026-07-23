import React, { Component } from 'react'
import { withRouter, SingletonRouter } from 'next/router'
import ButtonText from '../../../../elements/ButtonText/ButtonText'
import { IStoreContext, Stores } from '../../../../stores/RootStore'
import { inject, observer } from 'mobx-react'
import BlogStore from '../../../../stores/BlogStore'
import FormRow from '../../../../elements/Form/FormRow'
import InputText from '../../../../elements/InputText/InputText'
import Form from '../../../../elements/Form/Form'
import AccessDeniedPage from '../../../../components/AccessDeniedPage'
import ProfileStore from '../../../../stores/ProfileStore'
import PortalBlogLayout from '../_PortalBlogLayout'
import Container from '../../../../elements/Container/Container'
import Row from '../../../../elements/Row/Row'
import Segment from '../../../../elements/Segment/Segment'
import Textarea from '../../../../elements/Textarea/Textarea'

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
  blogStore?: BlogStore
  profileStore?: ProfileStore
}

@(withRouter as any)
@inject(Stores.PROFILE_STORE, Stores.BLOG_STORE)
@observer
export default class PortalBlogArticlePage extends Component<IProps, any> {
  /**
   * getInitialProps
   */
  static async getInitialProps (ctx: IStoreContext): Promise<any> {
    const { tagID } = ctx.query
    const { blogStore } = ctx.store

    await blogStore.loadTags()
    const tag = blogStore.getTagBySlug(String(tagID))

    if (!tag || tagID === 'create') {
      blogStore.setTagFormData({
        tagID: '',
        slug: '',
        name: '',
        icon: '',
        description: ''
      })
    } else  {
      blogStore.setTagFormData({
        tagID: tag.tagID,
        slug: tag.slug,
        name: tag.name,
        icon: tag.icon,
        description: tag.description
      })
    }

    return {}
  }

  submit = async () => {
    const { router, blogStore } = this.props

    if (blogStore.tagForm.tagID) {
      await blogStore.updateTag()
    } else {
      const tagID = await blogStore.createTag()

      router.push(`/portal/blog/tags/${tagID}`)
    }
  }

  removeTag = async () => {
    const { router, blogStore } = this.props

    if (!confirm('Действительно удалить тег?')) return

    await blogStore.removeTag(blogStore.tagForm.tagID)
    router.push('/portal/blog/tags')
  }

  render (): JSX.Element {
    const { profileStore, blogStore } = this.props

    if (!profileStore.isDeveloper()) return <AccessDeniedPage />

    return (
      <PortalBlogLayout>
        <Segment>
          <Container>
            <Row padding='m' />

            <Form onSubmit={this.submit}>
              <FormRow>
                <InputText
                  label='Название тега'
                  value={blogStore.tagForm.name}
                  onChange={e => blogStore.setTagFormData({ name: e.target.value })}
                />
              </FormRow>
              <FormRow>
                <InputText
                  label='Slug'
                  value={blogStore.tagForm.slug}
                  onChange={e => blogStore.setTagFormData({ slug: e.target.value })}
                />
              </FormRow>
              <FormRow>
                <InputText
                  label='Иконка'
                  value={blogStore.tagForm.icon}
                  onChange={e => blogStore.setTagFormData({ icon: e.target.value })}
                />
              </FormRow>
              <FormRow>
                <Textarea
                  placeholder='Описание'
                  value={blogStore.tagForm.description}
                  onChange={e => blogStore.setTagFormData({ description: e.target.value })}
                  minRows={2}
                  maxRows={4}
                />
              </FormRow>
              <FormRow buttons>
                {blogStore.tagForm.tagID && <ButtonText secondary onClick={this.removeTag} size='l'>Удалить</ButtonText>}
                <ButtonText type='submit' size='l'>Сохранить</ButtonText>
              </FormRow>
            </Form>
          </Container>
        </Segment>
      </PortalBlogLayout>
    )
  }
}
