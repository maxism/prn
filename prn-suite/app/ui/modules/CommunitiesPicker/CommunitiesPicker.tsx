import React, { Component, MouseEventHandler } from 'react'
import cx from 'classnames'

import Icon from '../../elements/Icon/Icon'
import Popup from '../../elements/Popup/Popup'
import List from '../../elements/List/List'
import Community from '../../elements/Community/Community'
import Image from '../../elements/Image/Image'
import CommunityUrl from '../../views/CommunityUrl/CommunityUrl'

import './CommunitiesPicker.scss'

export interface ICommunityPicker {
  communityID: string
  image: string
  name: string
  url: string
  checked: boolean
}

interface IProps {
  /**
   * Сообщества
   */
  communities: Array<ICommunityPicker>
  /**
   * Обработчик изменения выбранных сообществ
   */
  onChangeCommunitiesIDs: (communitiesIDs: Array<string>) => void
  /**
   * Множественный выбор
   */
  multiple?: boolean
  /**
   * Обработчик кнопки добавления сообщества
   */
  onAdd?: MouseEventHandler
  /**
   * Обработчик кнопки настроку сообщества
   */
  onCommunityOptions?: (communityID: string) => void
}

/**
 * Модуль CommunitiesPicker
 */
class CommunitiesPicker extends Component<IProps> {
  state = {
    open: false
  }

  handleOpen = () => {
    this.setState({
      open: true
    })
  }

  handleAllToggle = () => {
    let { communities, multiple } = this.props

    const checked = !communities.every(community => community.checked)

    communities = communities.map(community => ({
      ...community,
      checked: checked
    }))

    if (multiple) this.props.onChangeCommunitiesIDs(communities.filter(community => community.checked).map(community => community.communityID))
    else this.props.onChangeCommunitiesIDs(communities.map(community => community.communityID))
  }

  handleToggle = (e: any, communityID: string) => {
    let { communities, multiple } = this.props

    communities = communities.map(community => ({
      ...community,
      checked: community.communityID === communityID ? !community.checked : community.checked
    }))

    if (multiple) this.props.onChangeCommunitiesIDs(communities.filter(community => community.checked).map(community => community.communityID))
    else this.props.onChangeCommunitiesIDs([communityID])

    if (e) e.stopPropagation()
  }

  handleOptions = (e: any, communityID: string) => {
    this.props.onCommunityOptions(communityID)
    e.stopPropagation()
  }

  render (): JSX.Element {
    const { communities, onAdd } = this.props

    const checkedCommunities = communities.filter(community => community.checked)

    const classes = cx('communities-picker', {
      'communities-picker--opened': this.state.open
    })

    // Если есть сообщества в списке и сообщество не выбрано - выбираем первое
    if (communities.length && !checkedCommunities.length) this.handleToggle(null, communities[0].communityID)

    return (
      <div className={classes}>
        <Popup
          size='auto'
          trigger={(
            <div className='communities-picker__body'>
              <div className='communities-picker__images'>
                {communities.filter(community => community.checked).slice(0, 3).map(community => (
                  <Image className='communities-picker__image' round border src={community.image} />
                ))}
              </div>
              <div className='communities-picker__main'>
                <span className='communities-picker__title'>
                  {checkedCommunities.map(community => community.name).join(', ')}
                  {!checkedCommunities.length && `Выберите сообщества`}
                </span>
                <span className='communities-picker__description'>
                  {checkedCommunities.map(community => <CommunityUrl to={community.url} />)}
                </span>
              </div>
              <Icon icon='down' className='communities-picker__down' />
            </div>
          )}
          open={this.state.open}
          onOpen={this.handleOpen}
          onClose={() => this.setState({ open: false })}
          scrolling
          maxHeight={800}
        >
          <List size='small'>
            {onAdd &&
            <div className='communities-picker__all' onClick={onAdd}>
              <div className='communities-picker__icon-circle'>
                <Icon className='communities-picker__icon' icon='add' />
              </div>
              <div className='communities-picker__content'>
                <span className='communities-picker__c-title'>Добавить страницу конкурента</span>
              </div>
            </div>}
            {/*<div className='communities-picker__all' onClick={this.handleAllToggle}>
              <Icon className='communities-picker__icon' icon='select_dashboard' />
              <div className='communities-picker__content'>
                <span className='communities-picker__c-title'>Все сообщества</span>
                <span className='communities-picker__c-description'>Выбрать все доступнные сообщества</span>
              </div>
            </div>*/}
            {communities.map(community => (
              <Community
                small
                key={community.communityID}
                image={community.image}
                name={community.name}
                url={community.url}
                onClick={e => this.handleToggle(e, community.communityID)}
                active={!!checkedCommunities.find(item => item.communityID === community.communityID)}
                onSettings={e => this.handleOptions(e, community.communityID)}
                settingsBtn
                autoClosePopup
              />))}
          </List>
        </Popup>
      </div>
    )
  }
}

export default CommunitiesPicker
