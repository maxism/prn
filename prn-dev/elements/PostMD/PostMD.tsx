import React, { Component } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkUnwrapImages from 'remark-unwrap-images'

import s from './PostMD.module.scss'
import PromoBlock from '../PromoBlock/PromoBlock'

interface IProps {
  /**
   * children
   */
  children?: string
}

/**
 * Элемент Textarea
 */
export default class PostMD extends Component<IProps, any> {
  render (): JSX.Element {
    return (
      <ReactMarkdown
        className={s.element}
        components={{
          img: ({ node, ...props}) => {
            if (['analytics', 'statistics', 'statisticsCode'].includes(props.alt)) return <PromoBlock promoType={props.alt} promoCode={props.src} />

            return <div className='mdimg'><div className='mdimg_container'><img {...props} /></div>{props.alt && <span>{props.alt}</span>}</div>
          }
        }}
        remarkPlugins={[remarkUnwrapImages]}
      >
        {this.props.children}
      </ReactMarkdown>
    )
  }
}
