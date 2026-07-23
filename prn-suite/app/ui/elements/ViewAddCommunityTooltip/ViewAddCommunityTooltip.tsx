import React, { Component } from 'react'

import './ViewAddCommunityTooltip.scss'
import Icon from '../Icon/Icon'

/**
 * Подсказка при неудачном поиске странц
 */

class ViewAddCommunityTooltip extends Component {
  render (): JSX.Element {

    return (
      <div className='view-add-community-tooltip'>
        <span className='view-add-community-tooltip__text'>
          Из-за ограничений социальных сетей, мы можем анализировать только открытые страницы. Везде они называются по-разному, мы же называем их просто «Страницы». Вот что можно анализировать в КУБ:
        </span>

        <div className='view-add-community-tooltip__rules'>
          <div className='view-add-community-tooltip__block'>
            <div className='view-add-community-tooltip__block-row'>
              <Icon className='view-add-community-tooltip__block-icon' icon='vk_colored'/>
              <span className='view-add-community-tooltip__block-value'>сообщества и группы</span>
            </div>
            <div className='view-add-community-tooltip__block-row'>
              <Icon className='view-add-community-tooltip__block-icon' icon='fb_colored'/>
              <span className='view-add-community-tooltip__block-value'>публичные страницы</span>
            </div>
            <div className='view-add-community-tooltip__block-row'>
              <Icon className='view-add-community-tooltip__block-icon' icon='ig_colored'/>
              <span className='view-add-community-tooltip__block-value'>бизнес-аккаунты</span>
            </div>
          </div>

          <div className='view-add-community-tooltip__block'>
            <div className='view-add-community-tooltip__block-row'>
              <Icon className='view-add-community-tooltip__block-icon' icon='ok_colored'/>
              <span className='view-add-community-tooltip__block-value'>группы</span>
            </div>
            <div className='view-add-community-tooltip__block-row'>
              <Icon className='view-add-community-tooltip__block-icon' icon='tw_colored'/>
              <span className='view-add-community-tooltip__block-value'>все аккаунты</span>
            </div>
            <div className='view-add-community-tooltip__block-row'>
              <Icon className='view-add-community-tooltip__block-icon' icon='tg_colored'/>
              <span className='view-add-community-tooltip__block-value'>только каналы</span>
            </div>
          </div>

          <div className='view-add-community-tooltip__block'>
            <div className='view-add-community-tooltip__block-row'>
              <Icon className='view-add-community-tooltip__block-icon' icon='yt_colored'/>
              <span className='view-add-community-tooltip__block-value'>все каналы</span>
            </div>
            <div className='view-add-community-tooltip__block-row'>
              <Icon className='view-add-community-tooltip__block-icon' icon='yz_colored'/>
              <span className='view-add-community-tooltip__block-value'>любые страницы</span>
            </div>
            <div className='view-add-community-tooltip__block-row'>
              <Icon className='view-add-community-tooltip__block-icon' icon='tt_colored'/>
              <span className='view-add-community-tooltip__block-value'>все аккаунты</span>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default ViewAddCommunityTooltip
