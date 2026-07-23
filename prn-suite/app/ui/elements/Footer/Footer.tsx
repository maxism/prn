import React, { Component, ReactNode } from 'react'

import Icon from '../Icon/Icon'
import moment from 'moment'

import './Footer.scss'

class Footer extends Component {
  render () {
    return (
      <div className='footer'>
        <div className='footer__container'>
          <span className='footer__text'>{moment().format('YYYY')} &copy; КУБ</span>
          <a className='footer__link' href='https://prn.c-cube.ru/agreements' target='_blank'>Условия использования</a>
          {/*<div className='footer__social'>*/}
          {/*  <a className='footer__link' href='https://vk.com/vkontakte' target='_blank'><Icon className='footer__icon' icon='vk' /></a>*/}
          {/*  <a className='footer__link' href='https://ok.ru/odnoklassniki' target='_blank'><Icon className='footer__icon' icon='ok' /></a>*/}
          {/*  <a className='footer__link' href='https://t.me/telegram' target='_blank'><Icon className='footer__icon' icon='tg' /></a>*/}
          {/*  <a className='footer__link' href='https://twitter.com/twitter' target='_blank'><Icon className='footer__icon' icon='tw' /></a>*/}
          {/*  <a className='footer__link' href='https://www.youtube.com/c/youtube' target='_blank'><Icon className='footer__icon' icon='yt' /></a>*/}
          {/*</div>*/}
        </div>
      </div>
    )
  }
}

export default Footer
