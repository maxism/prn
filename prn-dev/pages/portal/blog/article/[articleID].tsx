import React, { Component } from 'react'
import { withRouter, SingletonRouter } from 'next/router'
import ButtonText from '../../../../elements/ButtonText/ButtonText'
import { IStoreContext, Stores } from '../../../../stores/RootStore'
import { inject, observer } from 'mobx-react'
import BlogStore from '../../../../stores/BlogStore'
import FormRow from '../../../../elements/Form/FormRow'
import InputText from '../../../../elements/InputText/InputText'
import InputImage from '../../../../elements/InputImage/InputImage'
import Popup from '../../../../elements/Popup/Popup'
import PopupButton from '../../../../elements/Popup/PopupButton'
import Select from '../../../../elements/Select/Select'
import TextareaMD from '../../../../elements/TextareaMD/TextareaMD'
import Form from '../../../../elements/Form/Form'
import AccessDeniedPage from '../../../../components/AccessDeniedPage'
import ProfileStore from '../../../../stores/ProfileStore'
import PortalBlogLayout from '../_PortalBlogLayout'
import moment from 'moment'
import Row from '../../../../elements/Row/Row'
import Segment from '../../../../elements/Segment/Segment'
import Container from '../../../../elements/Container/Container'
import ButtonTag from '../../../../elements/ButtonTag/ButtonTag'
import ButtonTagGroup from '../../../../elements/ButtonTag/ButtonTagGroup'
import TextUtil from '../../../../utils/TextUtil'

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
  static async getInitialProps (ctx: IStoreContext): Promise<Partial<IProps>> {
    const { articleID } = ctx.query
    const { blogStore } = ctx.store

    await blogStore?.loadTags()
    await blogStore?.loadPost(String(articleID))
    if (articleID === 'create') {
      blogStore.setPostFormData({
        postID: '',
        slug: '',
        postTitle: '',
        postImage: '',
        preview: '',
        text: '',
        author: '',
        timeCreate: '',
        publishDate: moment().format('DD.MM.YYYY'),
        type: '',
        status: '',
        tags: []
      })
    } else  {
      blogStore.setPostFormData({
        postID: blogStore.post?.postID,
        slug: blogStore.post?.slug,
        postTitle: blogStore.post?.postTitle,
        postImage: blogStore.post?.postImage,
        preview: blogStore.post?.preview,
        text: blogStore.post?.text,
        author: blogStore.post?.author,
        timeCreate: blogStore.post?.timeCreate,
        publishDate: blogStore.post?.publishDate,
        type: blogStore.post?.type,
        status: blogStore.post?.status,
        tags: (blogStore.post?.tags || []).map(tag => tag.tagID)
      })
    }

    return {}
  }

  submit = async () => {
    const { router, blogStore } = this.props
    if (blogStore.postForm.postID) {
      await blogStore.updatePost()

      if (Object.keys(blogStore.postFormErrors).length) alert('Ошибка сохранения '.concat(JSON.stringify(blogStore.postFormErrors)))
    } else {
      const postID = await blogStore.createPost()

      if (postID) router.push(`/portal/blog/article/${postID}`)
      else alert('Ошибка сохранения '.concat(JSON.stringify(blogStore.postFormErrors)))
    }
  }

  removePost = async () => {
    const { router, blogStore } = this.props

    if (!confirm('Действительно удалить пост?')) return

    await blogStore.removePost(blogStore.postForm.postID)
    router.push('/portal/blog')
  }

  render (): JSX.Element {
    const { profileStore, blogStore, router } = this.props
    if (!profileStore.isDeveloper()) return <AccessDeniedPage />

    const isCreate = router.query.articleID === 'create'
    return (
      <PortalBlogLayout>
        <Segment>
          <Container>
            <Row padding='m' />

            <Form onSubmit={this.submit}>
              <FormRow full>
                <InputText
                  label='Заголовок поста'
                  value={blogStore.postForm.postTitle}
                  onChange={e => {
                    const text = e.target.value
                    const formData = { postTitle: text }
                    if (isCreate) {
                      formData['slug'] = TextUtil.transliterate(text)
                        .replace(/[^a-z0-9\s]/gi, '')
                        .replace(/\s+/g, ' ')
                        .split(' ').join('-')
                        .toLowerCase()
                    }
                    blogStore.setPostFormData(formData)
                  }}
                />
              </FormRow>
              <FormRow full>
                <InputText
                  disabled={!isCreate}
                  label='Slug'
                  value={blogStore.postForm.slug}
                  onChange={e => blogStore.setPostFormData({ slug: e.target.value })}
                />
              </FormRow>
              <FormRow full>
                <InputImage
                  value={blogStore.postForm.postImage}
                  onChange={e => blogStore.setPostFormData({ postImage: e.target.value })}
                  uploadToken={profileStore.token}
                />
              </FormRow>
              <FormRow full>
                <InputText
                  label='Короткое описание поста'
                  value={blogStore.postForm.preview}
                  onChange={e => blogStore.setPostFormData({ preview: e.target.value })}
                />
              </FormRow>
              <FormRow full>
                <ButtonTagGroup>
                  <Popup trigger={<ButtonText>Добавить тег</ButtonText>} scrolling maxHeight={350} size='m' right>
                    {blogStore.tags.map(tag => (<PopupButton key={tag.tagID} onClick={() => blogStore.postFormAddTag(tag.tagID)} autoClosePopup>{tag.name}</PopupButton>))}
                  </Popup>
                  {blogStore.postForm.tags?.map(tagID => (
                    <ButtonTag key={tagID} onClick={() => blogStore.postFormRemoveTag(tagID)}>{blogStore.getTagBySlug(tagID)?.name}</ButtonTag>
                  ))}
                </ButtonTagGroup>
              </FormRow>
              <FormRow>
                <InputText
                  label='Автор'
                  value={blogStore.postForm.author}
                  onChange={e => blogStore.setPostFormData({ author: e.target.value })}
                />
                <InputText
                  label='Дата публикации'
                  value={blogStore.postForm.publishDate}
                  onChange={e => blogStore.setPostFormData({ publishDate: e.target.value })}
                />
              </FormRow>
              <FormRow>
                <Select
                  label='Тип'
                  value={blogStore.postForm.type}
                  list={[{ id: 'blog', name: 'Блог' }, { id: 'support', name: 'Поддержка' }]}
                  onSelect={e => blogStore.setPostFormData({ type: e.target.value })}
                />
                <Select
                  label='Статус'
                  value={blogStore.postForm.status}
                  list={[{ id: 'draft', name: 'Черновик' }, { id: 'publish', name: 'Опубликован' }]}
                  onSelect={e => blogStore.setPostFormData({ status: e.target.value })}
                />
              </FormRow>
              <FormRow full>
                <TextareaMD
                  value={blogStore.postForm.text}
                  onChange={e => blogStore.setPostFormData({ text: e.target.value })}
                  uploadToken={profileStore.token}
                />
              </FormRow>
              <FormRow>
                {blogStore.postForm.postID && <ButtonText secondary onClick={this.removePost} size='l'>Удалить</ButtonText>}
                <ButtonText type='submit' size='l'>Сохранить</ButtonText>
                {blogStore.postForm.postID && <ButtonText to={blogStore.postForm.type === 'blog' ? `/blog/article/${blogStore.postForm.slug}` : `/support/${blogStore.getTagBySlug(blogStore.postForm.tags[0] || 'analytics')?.slug}/${blogStore.postForm.slug}`} secondary size='l' _blank>Посмотреть пост</ButtonText>}
              </FormRow>
            </Form>
          </Container>
        </Segment>
      </PortalBlogLayout>
    )
  }
}
