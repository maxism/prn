import { inject, observer } from 'mobx-react'
import React, { Component } from 'react'
import { Stores } from '../../stores/RootStore'
import withParams, { ParamsProps } from '../../utils/withParams'
import ModalPopup from '../../ui/elements/ModalPopup/ModalPopup'
import ModalPostDetails from '../../ui/elements/ModalPostDetails/ModalPostDetails'
import PostsStore from '../../stores/PostsStore'
import {IGlobalParams} from '../../interfaces/IParams'

interface IState {
  open: boolean
  postID: string
}

interface IProps {
  params?: ParamsProps<IGlobalParams>
  postsStore?: PostsStore
}

/**
 * Модалка детальной информации по посту
 */
@withParams
@inject(Stores.POSTS_STORE)
@observer
class DetailPostModal extends Component<IProps, IState> {
  constructor (props: IProps) {
    super(props)
  }

  public state: IState = {
    open: false,
    postID: undefined
  }

  componentDidUpdate (prevProps: Readonly<IProps>, prevState: Readonly<IState>, snapshot?: any): void {
    const { params, postsStore } = this.props
    const post = postsStore.posts.find(post => post.postID === params.postID)

    if (params.postID && !prevState.open && !this.state.open) this.setState({ open: true, postID: params.postID })
    if (!params.postID && prevState.open && this.state.open) this.setState({ open: false })

    if (params.postID && !postsStore.isLoading && !post) {
      this.handleClose()
    }
  }

  handleClose = () => {
    this.props.params.changeParams({ postID: undefined })
  }

  render (): JSX.Element {
    const { postsStore } = this.props

    const post = [...postsStore.posts, ...postsStore.competitorsPosts].find(post => post.postID === this.state.postID)

    return (
      <ModalPopup open={this.state.open} onCloseClick={this.handleClose}>
        {!postsStore.isLoading && post && <ModalPostDetails post={post} />}
      </ModalPopup>
    )
  }
}

export default DetailPostModal
