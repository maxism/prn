import React, { Component, ReactNode } from 'react'

import s from './ModalAddCommunityHint.module.scss'
import Icon from '../Icon/Icon'

class ModalAddCommunityHint extends Component {
  render (): ReactNode {
    return (
      <div className={s.element}>
        <span className={s.text}>
          Из-за ограничений социальных сетей, мы можем анализировать только открытые страницы. Везде они называются по-разному, мы же называем их просто «Страницы». Вот что можно анализировать в КУБ:
        </span>

        <div className={s.container}>
          <div className={s.section}>
            <div className={s.social}>
              <Icon className={s.icon} icon='vk_colored' />
              <span className={s.description}>все страницы</span>
            </div>
            <div className={s.social}>
              <Icon className={s.icon} icon='fb_colored' />
              <span className={s.description}>публичные страницы</span>
            </div>
            <div className={s.social}>
              <Icon className={s.icon} icon='ig_colored' />
              <span className={s.description}>бизнес-аккаунты</span>
            </div>
            <div className={s.social}>
              <Icon className={s.icon} icon='tg_colored' />
              <span className={s.description}>группы и каналы</span>
            </div>
            <div className={s.social}>
              <Icon className={s.icon} icon='tw_colored' />
              <span className={s.description}>все аккаунты</span>
            </div>
            <div className={s.social}>
              <Icon className={s.icon} icon='ch_colored' />
              <span className={s.description}>все страницы</span>
            </div>
            <div className={s.social}>
              <Icon className={s.icon} icon='vb_colored' />
              <span className={s.description}>только группы</span>
            </div>
          </div>

          <div className={s.section}>
            <div className={s.social}>
              <Icon className={s.icon} icon='ok_colored' />
              <span className={s.description}>только группы</span>
            </div>
            <div className={s.social}>
              <Icon className={s.icon} icon='tt_colored' />
              <span className={s.description}>все аккаунты</span>
            </div>
            <div className={s.social}>
              <Icon className={s.icon} icon='yz_colored' />
              <span className={s.description}>любые стрницы</span>
            </div>
            <div className={s.social}>
              <Icon className={s.icon} icon='yt_colored' />
              <span className={s.description}>все каналы</span>
            </div>
            <div className={s.social}>
              <Icon className={s.icon} icon='rt_colored' />
              <span className={s.description}>все каналы</span>
            </div>
            <div className={s.social}>
              <Icon className={s.icon} icon='tc_colored' />
              <span className={s.description}>личные страницы</span>
            </div>
            <div className={s.social}>
              <Icon className={s.icon} icon='vc_colored' />
              <span className={s.description}>все страницы</span>
            </div>
            {/* todo: Добавить новые соцсети */}
          </div>
        </div>
      </div>
    )
  }
}

export default ModalAddCommunityHint
