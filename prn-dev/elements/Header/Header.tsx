import React, {Component, ReactNode} from 'react'
import cx from 'classnames'

import s from './Header.module.scss'
import Container from '../Container/Container'
import Segment from '../Segment/Segment'
import Icon from '../Icon/Icon'
import Link from '../Link/Link'
import ButtonText from '../ButtonText/ButtonText'
import Text from '../Text/Text'
import Popup from '../Popup/Popup'
import PopupButton from '../Popup/PopupButton'
import PopupDivider from '../Popup/PopupDivider'
import ProfileStore from '../../stores/ProfileStore'
import {inject, observer} from 'mobx-react'
import {Stores} from '../../stores/RootStore'
import ButtonAccount from '../ButtonAccount/ButtonAccount'
import CommunitiesStore from '../../stores/CommunitiesStore'
import AccountsStore from '../../stores/AccountsStore'
import AppUtil from '../../utils/AppUtil'
import RouterUtil from '../../utils/RouterUtil'
import {SingletonRouter, withRouter} from 'next/router'
import NumeralUtil from '../../utils/NumeralUtil'
import Row from '../Row/Row'

type Product = 'default' | 'influence' | 'rating'

interface IProps {
  /**
   * Урезанная шапка с возвратом на главную страницу
   */
  lite?: boolean
  /**
   * Стилизация шапки для отдельных сервисов
   */
  product: Product | string
}

interface IProps {
  router?: SingletonRouter
  profileStore?: ProfileStore
  accountsStore?: AccountsStore
  communitiesStore?: CommunitiesStore
}

interface IStates {
  showAllProjects: boolean
}

@(withRouter as any)
@inject(Stores.PROFILE_STORE, Stores.ACCOUNTS_STORE, Stores.COMMUNITIES_STORE)
@observer
class Header extends Component<IProps, IStates> {
  static defaultProps = {
    product: 'default'
  }

  state = {
    showAllProjects: false
  }

  render (): ReactNode {
    const { router, lite, product, profileStore, accountsStore } = this.props

    if (profileStore.isAuth) {
      if (AppUtil.isClientSide) {

        const isElamaPartner = profileStore.profile?.email?.includes('_oidc_elama@c-cube.ru')

        try {
          window['carrotWrap']().auth(profileStore.profile.userID, profileStore.profile.carrotquestToken);
          window['carrotWrap']().identify({
            '$name': profileStore.profile.name || profileStore.profile.email,
            '$email': profileStore.profile.email
          })
        } catch (e) { /**/ }

        for (let i = 0; i <= 10; i++) {
          setTimeout(() => {
            try {
              // @ts-ignore
              if (isElamaPartner) document.getElementsByClassName('carrotquest-messenger-right_bottom')[0].style.display = 'none'
            } catch (e) { }
          }, 1000 + i * 500)
        }
      }
    }

    const classes = cx(s.element, {})

    return (
      <div className={s.headerPadding}>
        <Segment as='header' className={classes}>
          <Container className={s.container}>

            <div className={s.logo}>
              <Link to='/'><Icon icon='logo_sign' className={s.logoSign} /></Link>
              {product === 'default' && <Link to='/'><Icon icon='logo_text' className={s.logoText} /></Link>}
              {product === 'influence' && <Link to='/influence'><Icon icon='logo_text' className={s.logoText} /></Link>}
              {product === 'rating' && <Link to='/rating'><Icon icon='logo_text' className={s.logoText} /></Link>}
            </div>

            {!lite && <>

              {product === 'default' && <>
                <div className={s.mobileMenu}>
                  <Popup trigger={<Text className={s.burger}>Меню</Text>} maxHeight={390} size='m' right scrolling mobileFull header>
                    <PopupButton to='/'>Статистика</PopupButton>
                    <PopupButton to='/influence'>Поиск блогеров</PopupButton>
                    <PopupButton to='/rating'>Рейтинг страниц</PopupButton>
                    <PopupButton to='/socialindex'>Индекс активности</PopupButton>
                    <PopupButton to='/analytics'>Аналитика</PopupButton>
                    <PopupDivider />
                    <PopupButton to='/plans'>Тарифы</PopupButton>
                    <PopupButton to='/blog'>Блог</PopupButton>
                    <PopupButton to='/contacts'>Контакты</PopupButton>
                    <PopupButton to='/agreements'>Документы</PopupButton>
                    <PopupButton to='/support'>Поддержка</PopupButton>
                  </Popup>
                </div>

                <div className={s.menu}>
                  <Popup trigger={<Link className={s.menuItem}>Сервисы</Link>} size='s' right scrolling mobileFull header>
                    <PopupButton to='/' icon='logo_sign'>Статистика</PopupButton>
                    <PopupButton to='/influence' icon='logo_sign'>Поиск блогеров</PopupButton>
                    <PopupButton to='/rating' icon='logo_sign'>Рейтинг страниц</PopupButton>
                    <PopupButton to='/socialindex' icon='logo_sign'>Индекс активности</PopupButton>
                    <PopupDivider />
                    <PopupButton to='/analytics' icon='logo_sign'>Аналитика</PopupButton>
                  </Popup>
                  <Link to='/plans' activeClassName={s.menuActive}>Тарифы</Link>
                  <Link to='/blog' activeClassName={s.menuActive}>Блог</Link>
                  <Link to='/contacts' activeClassName={s.menuActive}>Контакты</Link>
                  <Link to='/support' activeClassName={s.menuActive}>Поддержка</Link>
                </div>
              </>}

              {product === 'influence' && <>
                <div className={s.mobileMenu}>
                  <Popup trigger={<Text className={s.burger}>Меню</Text>} maxHeight={390} size='m' right scrolling mobileFull header>
                    <PopupButton to={`https://prns.c-cube.ru/search?token=${profileStore.token}`}>Поиск блогеров</PopupButton>
                    <PopupDivider />
                    <PopupButton to='/'>Статистика</PopupButton>
                    <PopupButton to='/influence'>Поиск блогеров</PopupButton>
                    <PopupButton to='/rating'>Рейтинг страниц</PopupButton>
                    <PopupButton to='/socialindex'>Индекс активности</PopupButton>
                    <PopupButton to='/analytics'>Аналитика</PopupButton>
                    <PopupDivider />
                    <PopupButton to='/plans'>Тарифы</PopupButton>
                    <PopupButton to='/blog'>Блог</PopupButton>
                    <PopupButton to='/contacts'>Контакты</PopupButton>
                    <PopupButton to='/agreements'>Документы</PopupButton>
                    <PopupButton to='/support'>Поддержка</PopupButton>
                  </Popup>
                </div>

                <div className={s.menu}>
                  <Link to={`https://prns.c-cube.ru/search?token=${profileStore.token}`} exact activeClassName={s.menuActive}>Поиск блогеров</Link>
                </div>
              </>}

              <div className={s.account}>
                <ButtonText className={s.products} icon='search' size='m' secondary to='/search' />
                {/*profileStore.isAuth && (
                  <Popup trigger={<ButtonText className={s.products} icon='view_grid' size='m' secondary disableDropdown />} size='s' center mobileFull>
                    <PopupButton to={`https://prns.c-cube.ru/?token=${profileStore.token}`} icon='logo_sign'>Статистика</PopupButton>
                    <PopupButton to='/app/influence' icon='logo_sign'>Поиск блогеров</PopupButton>
                    <PopupButton to='/app/rating/instagram/russia/brands' icon='logo_sign'>Рейтинг страниц</PopupButton>
                    <PopupButton to='/app/socialindex' icon='logo_sign'>Индекс активности</PopupButton>
                    <PopupDivider />
                    <PopupButton to={`https://prna.c-cube.ru/ru`} icon='logo_sign'>Аналитика</PopupButton>
                  </Popup>
                )*/}

                {profileStore.isAuth && (
                  <Popup
                    trigger={product === 'default' ? (
                      <ButtonAccount
                        image={profileStore.profile?.picture || 'empty'}
                        loading={profileStore.isLoading || accountsStore.isLoading}
                      >{profileStore.profile?.name || profileStore.profile?.email}</ButtonAccount>
                      ) : (
                      <ButtonAccount
                        image={accountsStore.currentProject?.image || 'empty'}
                        loading={profileStore.isLoading || accountsStore.isLoading}
                      >{accountsStore.currentProject?.name}</ButtonAccount>
                    )}
                    maxHeight={1000}
                    loading={profileStore.isLoading || accountsStore.isLoading}
                    scrolling
                    size='m'
                    mobileFull
                    header
                  >
                    <Row padding='xxs' />
                    <Text size='xs' paddingLeft={48}>Сервисы</Text>
                    <Row padding='xxs' />
                    <PopupButton to={`https://prns.c-cube.ru/?token=${profileStore.token}`} icon='logo_sign'>Статистика</PopupButton>
                    <PopupButton to={`https://prns.c-cube.ru/search?token=${profileStore.token}`} icon='logo_sign'>Поиск блогеров</PopupButton>
                    <PopupButton to='/app/rating/instagram/russia/brands' icon='logo_sign'>Рейтинг страниц</PopupButton>
                    <PopupButton to='/app/socialindex' icon='logo_sign'>Индекс активности</PopupButton>
                    <PopupButton to={`https://prna.c-cube.ru/ru`} icon='logo_sign'>Аналитика</PopupButton>
                    <PopupDivider />
                    <Row padding='xxs' />
                    <Text size='xs' paddingLeft={48}>Список проектов</Text>
                    <Row padding='xxs' />
                    <PopupButton onClick={() => RouterUtil.replaceParams(router, { modal: 'create-project' })} icon='plus_circle' autoClosePopup>Добавить новый проект</PopupButton>
                    {/*<ScrollView minHeight={52} maxHeight={260}>*/}
                    {accountsStore.accounts?.slice(0, accountsStore.accounts?.length <= 6 ? 6 : (!this.state.showAllProjects ? 5 : undefined))?.map(item => (
                      <PopupButton
                        key={item.accountID}
                        onClick={() => { product === 'default' ? router.replace(`/settings/projects/${item.accountID}/communities`) : accountsStore.setAccount(item.accountID) }}
                        project
                        control={!item.isPaid ? 'admin' : ''}
                        image={item.image || 'empty'}
                        active={product !== 'default' && item.accountID === accountsStore.currentProject?.accountID}
                        autoClosePopup
                        error={!item.isPaid}
                      >
                        {item.name}
                      </PopupButton>
                    ))}
                    {!this.state.showAllProjects && accountsStore.accounts?.length > 6 && <PopupButton icon='arrow_down' onClick={() => this.setState({ showAllProjects: true })}>Показать еще {NumeralUtil.format(accountsStore.accounts?.length - 5, '0,0', ['проект', 'проекта', 'проектов'])}</PopupButton>}
                    {/*</ScrollView>*/}
                    <PopupDivider />
                    {profileStore.isDeveloper() && <PopupButton to='/portal' icon='logo_sign'>Портал</PopupButton>}
                    <PopupButton to='/settings/subscription' icon='advertising' error={!profileStore.profile.plan.isPlanValid}>Подписка и оплата</PopupButton>
                    <PopupButton to='/settings/projects' icon='group'>Управление проектами</PopupButton>
                    <PopupButton to='/settings/profile' icon='user'>Мой профиль</PopupButton>
                    <PopupButton onClick={() => profileStore.logout()} icon='logout'>Выйти</PopupButton>
                  </Popup>
                )}
                {!profileStore.isAuth && (
                  <ButtonText onClick={() => RouterUtil.replaceParams(router, { modal: 'login' })}>Войти</ButtonText>
                  // <Popup trigger={<ButtonText>Войти</ButtonText>} maxHeight={390} size='m'>
                  //   <PopupButton onClick={() => RouterUtil.replaceParams(router, { modal: 'login' })}>Войти в Statistics (Suite)</PopupButton>
                  //   <PopupButton to='https://prna.c-cube.ru/ru?modal=login'>Войти в Analytics</PopupButton>
                  // </Popup>
                )}
              </div>
            </>}

            {lite && <>
              <Text size='s' right><Link to='/'>На главную</Link></Text>
            </>}

          </Container>
        </Segment>
      </div>
    )
  }
}

export default Header
