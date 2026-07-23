import React, { Component, ReactNode } from 'react'
import moment from 'moment'
import cx from 'classnames'

import Icon from '../Icon/Icon'

import s from './Footer.module.scss'
import Segment from '../Segment/Segment'
import Container from '../Container/Container'
import Link from '../Link/Link'
import IconGroup from '../Icon/IconGroup'
import Text from '../Text/Text'

interface IProps {
  /**
   * Простой вид
   */
  lite?: boolean
  disableSupport?: boolean
}

class Footer extends Component<IProps> {
  render (): ReactNode {
    const { lite, disableSupport } = this.props

    const classes = cx(s.element, {
      [s.lite]: lite
    })

    return (
      <Segment as='footer' className={classes}>
        <Container className={s.container}>
          {!lite && <>
            <div className={s.top}>
              <div className={s.container}>
                <div className={s.logo}>
                  <Icon icon='logo_sign' className={s.logoIcon} />
                  <Icon icon='logo_text' className={s.logoName} />
                </div>
                <span className={s.description}>Сервисы для эффективной работы с социальными сетями</span>
              </div>
            </div>
            <div className={s.center}>
              <div className={s.centerContainer}>
                <div className={s.menuContainer}>
                  <div className={s.menu}>
                    <span className={s.menuTitle}>Сервисы</span>
                    <div className={s.menuItems}>
                      <Link className={s.menuItem} to='/'>Статистика</Link>
                      <Link className={s.menuItem} to='/influence'>Поиск блогеров</Link>
                      <Link className={s.menuItem} to='/rating'>Рейтинг страниц</Link>
                      <Link className={s.menuItem} to='/socialindex'>Индекс активности</Link>
                      {/*<span className={`${s.menuItem} ${s.menuItemDisabled}`}>Дашборд</span>*/}
                      {/*<span className={`${s.menuItem} ${s.menuItemDisabled}`}>Данные</span>*/}
                      <Link className={s.menuItem} to='/analytics' newTab>Аналитика</Link>
                    </div>
                  </div>
                  <div className={s.menu}>
                    <span className={s.menuTitle}>Компания</span>
                    <div className={s.menuItems}>
                      <Link className={s.menuItem} to='/plans'>Тарифы</Link>
                      <Link className={s.menuItem} to='/blog'>Блог</Link>
                      <Link className={s.menuItem} to='/support'>Поддержка</Link>
                      <Link className={s.menuItem} to='/contacts'>Контакты</Link>
                      {/*<span className={`${s.menuItem} ${s.menuItemDisabled}`}>Клиенты</span>*/}
                    </div>
                  </div>
                </div>
                <div className={s.contacts}>
                  <Link className={s.phone} to='tel:+99999999999'>+9 999 999-99-99</Link>
                  <Link className={s.email} to='mailto:info@c-cube.ru'>info@c-cube.ru</Link>
                  <span className={s.address}></span>
                  <span className={s.ogrn}>ОГРН: 1234567890123</span>
                </div>
              </div>
            </div>
          </>}

          <div className={s.infoContainer}>
            <Text className={s.infoText} maxWidth>* Компании Facebook и Instagram признаны экстремистскими и запрещены на территории России</Text>
          </div>

          <div className={s.bottom}>
            <div className={s.bottomContainer}>
              <div className={s.copyright}>
                <span>{moment().format('YYYY')} &copy; КУБ</span>
                <Link className={s.bottomLink} to='/agreements'>Условия использования</Link>
                <Link className={s.bottomLink} to='/agreements'>Политика конфиденциальности</Link>
                <Link className={s.bottomLink} to='/contacts'>Контакты</Link>
              </div>

              <IconGroup className={s.socials} size={lite ? 'xs' : 'm'}>
                <Link to='https://t.me/telegram' newTab><Icon icon='tg_colored' size={lite ? 'xs' : 'm'} /></Link>
                {/*<Link to='https://www.facebook.com/facebook' newTab><Icon icon='fb_colored' size={lite ? 'xs' : 'm'} /></Link>*/}
                <Link to='https://vk.com/vkontakte' newTab><Icon icon='vk_colored' size={lite ? 'xs' : 'm'} /></Link>
                <Link to='https://ok.ru/odnoklassniki' newTab><Icon icon='ok_colored' size={lite ? 'xs' : 'm'} /></Link>
                {/*<Link to='https://www.instagram.com/instagram' newTab><Icon icon='ig_colored' size={lite ? 'xs' : 'm'} /></Link>*/}
              </IconGroup>

            </div>
          </div>
        </Container>

        {!disableSupport && (
          <div dangerouslySetInnerHTML={{ __html: `
            <!-- Carrot quest BEGIN -->
            <script type="text/javascript" defer>
              let __carrotConnected = false
              function carrotWrap () {
                if (__carrotConnected) return window['carrotquest']
                
                !function(){function t(t,e){return function(){window.carrotquestasync.push(t,arguments)}}if("undefined"==typeof carrotquest){var e=document.createElement("script");e.type="text/javascript",e.async=!0,e.src="//cdn.carrotquest.app/api.min.js",document.getElementsByTagName("head")[0].appendChild(e),window.carrotquest={},window.carrotquestasync=[],carrotquest.settings={};for(var n=["connect","track","identify","auth","onReady","addCallback","removeCallback","trackMessageInteraction"],a=0;a<n.length;a++)carrotquest[n[a]]=t(n[a])}}(),carrotquest.connect("1234-bb82f46d30ad8765c31147c624");
                
                __carrotConnected = true
                return window['carrotquest']
              }
            </script>
            <!-- Carrot quest END -->
          `}} />
        )}
      </Segment>
    )
  }
}

export default Footer
