import React, { Component } from 'react'
import { withRouter } from 'next/router'
import { IStoreContext, Stores } from '../../../../stores/RootStore'
import { inject, observer } from 'mobx-react'
import AccessDeniedPage from '../../../../components/AccessDeniedPage'
import ProfileStore from '../../../../stores/ProfileStore'
import PortalBlogLayout from '../_PortalRatingLayout'
import ButtonTagGroup from '../../../../elements/ButtonTag/ButtonTagGroup'
import Row from '../../../../elements/Row/Row'
import Segment from '../../../../elements/Segment/Segment'
import Container from '../../../../elements/Container/Container'
import ButtonTag from '../../../../elements/ButtonTag/ButtonTag'
import RatingTagsStore from '../../../../stores/RatingTagsStore'
import Col from '../../../../elements/Col/Col'
import InputText from '../../../../elements/InputText/InputText'
import ButtonText from '../../../../elements/ButtonText/ButtonText'
import ModalPopup from '../../../../elements/ModalPopup/ModalPopup'
import Title from '../../../../elements/Title/Title'
import Form from '../../../../elements/Form/Form'
import FormRow from '../../../../elements/Form/FormRow'
import Loader from '../../../../elements/Loader/Loader'
import Textarea from '../../../../elements/Textarea/Textarea'
import Checkbox from '../../../../elements/Checkbox/Checkbox'
import Select from '../../../../elements/Select/Select'

interface IProps {
  profileStore?: ProfileStore
  ratingTagsStore?: RatingTagsStore
}

interface IStates {
  filter?: string
  showAddTag?: boolean
  showEditTag?: boolean
}

@(withRouter as any)
@inject(Stores.PROFILE_STORE, Stores.RATING_TAGS_STORE)
@observer
export default class PortalRatingTagsPage extends Component<IProps, IStates> {
  state: IStates = {
    filter: '',
    showAddTag: false,
    showEditTag: false
  }

  /**
   * getInitialProps
   */
  static async getInitialProps (ctx: IStoreContext): Promise<Partial<any>> {
    const { ratingTagsStore } = ctx.store

    await ratingTagsStore?.load(true)

    return {}
  }

  handleAddTag = () => {
    const { ratingTagsStore } = this.props

    ratingTagsStore.tagForm.setData({
      tagID: '',
      name: '',
      icon: '',
      parent: '',
      description: '',
      words: '',
      hidden: false
    })
    this.setState({ showAddTag: true })
  }

  handleEditTag = (tagID: string) => {
    const { ratingTagsStore } = this.props

    const tag = ratingTagsStore.getTag(tagID)

    ratingTagsStore.tagForm.setData({
      tagID: tagID,
      name: tag.name,
      icon: tag.icon,
      parent: tag.parent,
      hidden: tag.hidden,
      words: tag.words,
      description: tag.description || ''
    })
    this.setState({ showEditTag: true })
  }

  handleRemoveTag = (tagID) => {
    const { ratingTagsStore } = this.props

    if (!confirm('Вы действительно хотите удалить тег?')) return

    ratingTagsStore.removeTag(tagID)

    this.setState({ showEditTag: false })
  }

  render (): JSX.Element {
    const { profileStore, ratingTagsStore } = this.props
    const { filter } = this.state

    if (!profileStore.isDeveloper()) return <AccessDeniedPage />

    return (
      <PortalBlogLayout>
        <Segment>
          <Container>
            <ButtonText onClick={this.handleAddTag}>Добавить тег</ButtonText>
            <Row padding='m'>
              <Col size={12}>
                <InputText icon='search' label='Поиск' value={filter} onChange={e => this.setState({ filter: e.target.value })} focus />
              </Col>
            </Row>
            <Row padding='m' />
            {ratingTagsStore.isLoading && (<Loader />)}
            {ratingTagsStore.tags.filter(tag => `${tag.fullName} ${tag.tagID}`.toLowerCase().includes(filter.toLowerCase())).map(tag => (
              <Row key={tag.tagID} padding='s'>
                <Col size={12}>
                  <ButtonTagGroup>
                    <ButtonTag onClick={() => this.handleEditTag(tag.tagID)} color={(tag.hidden && 'red') || (tag.isLeaf ? 'grey' : 'blue')} count={tag.hidden ? 'скрыт' : undefined}>{tag.fullName}</ButtonTag>
                  </ButtonTagGroup>
                </Col>
              </Row>
            ))}
          </Container>
        </Segment>

        <ModalPopup open={this.state.showAddTag} onCloseClick={() => this.setState({ showAddTag: false })}>
          <Title>Добавление тега</Title>
          <Row padding='m'/>
          <Form onSubmit={() => ratingTagsStore.createTag()}>
            <FormRow>
              <InputText
                label='ID тега'
                name='tagID'
                value={ratingTagsStore.tagForm.tagID.value}
                error={ratingTagsStore.tagForm.tagID.error}
                onChange={e => ratingTagsStore?.tagForm.tagID.change(e.target.value)}
                white
              />
              <InputText
                label='Название тега'
                name='name'
                value={ratingTagsStore.tagForm.name.value}
                error={ratingTagsStore.tagForm.name.error}
                onChange={e => ratingTagsStore?.tagForm.name.change(e.target.value)}
                white
              />
              <InputText
                label='Иконка'
                name='icon'
                value={ratingTagsStore.tagForm.icon.value}
                error={ratingTagsStore.tagForm.icon.error}
                onChange={e => ratingTagsStore?.tagForm.icon.change(e.target.value)}
                white
              />
              <Select
                label='Родитель'
                value={ratingTagsStore.tagForm.parent.value}
                list={ratingTagsStore.getAllTags.map(tag => ({ id: tag.tagID, name: tag.name, filterName: tag.tagID, level: tag.level }))}
                onSelect={e => ratingTagsStore?.tagForm.parent.change(e.target.value)}
                maxHeight={300}
                filtered
                white
                empty
                emptyName='Без родителя'
              />
            </FormRow>
            <FormRow full>
              <Textarea
                placeholder='Описание'
                name='description'
                value={ratingTagsStore.tagForm.description.value}
                onChange={e => ratingTagsStore?.tagForm.description.change(e.target.value)}
                minRows={3}
                maxRows={5}
                white
              />
            </FormRow>
            <FormRow full>
              <Textarea
                placeholder='Системные слова'
                name='words'
                value={ratingTagsStore.tagForm.words.value}
                onChange={e => ratingTagsStore?.tagForm.words.change(e.target.value)}
                minRows={3}
                maxRows={5}
                white
              />
            </FormRow>
            <FormRow full>
              <Checkbox label='Скрытый тег' white checked={ratingTagsStore.tagForm.hidden.value} onChange={e => ratingTagsStore?.tagForm.hidden.change(!!e.target.value)} />
            </FormRow>
            <FormRow buttons>
              <ButtonText type='submit' size='l'>Добавить тег</ButtonText>
            </FormRow>
          </Form>
        </ModalPopup>

        <ModalPopup open={this.state.showEditTag} onCloseClick={() => this.setState({ showEditTag: false })}>
          <Title>Редактирование тега</Title>
          <Row padding='m'/>
          <Form onSubmit={() => ratingTagsStore.updateTag()}>
            <FormRow>
              <InputText
                label='ID тега'
                name='tagID'
                value={ratingTagsStore.tagForm.tagID.value}
                error={ratingTagsStore.tagForm.tagID.error}
                onChange={e => ratingTagsStore?.tagForm.tagID.change(e.target.value)}
                readOnly
                white
              />
              <InputText
                label='Название тега'
                name='name'
                value={ratingTagsStore.tagForm.name.value}
                error={ratingTagsStore.tagForm.name.error}
                onChange={e => ratingTagsStore?.tagForm.name.change(e.target.value)}
                white
              />
              <InputText
                label='Иконка'
                name='icon'
                value={ratingTagsStore.tagForm.icon.value}
                error={ratingTagsStore.tagForm.icon.error}
                onChange={e => ratingTagsStore?.tagForm.icon.change(e.target.value)}
                white
              />
              <Select
                label='Родитель'
                value={ratingTagsStore.tagForm.parent.value}
                list={ratingTagsStore.getAllTags.map(tag => ({ id: tag.tagID, name: tag.name, filterName: tag.tagID, level: tag.level }))}
                onSelect={e => ratingTagsStore?.tagForm.parent.change(e.target.value)}
                maxHeight={300}
                filtered
                white
                empty
                emptyName='Без родителя'
              />
            </FormRow>
            <FormRow full>
              <Textarea
                placeholder='Описание'
                name='description'
                value={ratingTagsStore.tagForm.description.value}
                onChange={e => ratingTagsStore?.tagForm.description.change(e.target.value)}
                minRows={3}
                maxRows={5}
                white
              />
            </FormRow>
            <FormRow full>
              <Textarea
                placeholder='Системные слова'
                name='words'
                value={ratingTagsStore.tagForm.words.value}
                onChange={e => ratingTagsStore?.tagForm.words.change(e.target.value)}
                minRows={3}
                maxRows={5}
                white
              />
            </FormRow>
            <FormRow full>
              <Checkbox label='Скрытый тег' white checked={ratingTagsStore.tagForm.hidden.value} onChange={e => ratingTagsStore?.tagForm.hidden.change(!!e.target.value)} />
            </FormRow>
            <FormRow buttons>
              <ButtonText type='submit' size='l'>Сохранить</ButtonText>
              <ButtonText size='l' secondary onClick={() => this.handleRemoveTag(ratingTagsStore.tagForm.tagID.value)}>Удалить</ButtonText>
            </FormRow>
          </Form>
        </ModalPopup>
      </PortalBlogLayout>
    )
  }
}
