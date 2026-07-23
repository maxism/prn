import React, { Children, cloneElement, Component, ReactElement, ReactNode } from 'react'
import cx from 'classnames'
import ReactMarkdown from 'react-markdown'

import './Description.scss'

//            16         26
type Size = 'superSmall' | 'small' | 'middle' | 'big'

interface IProps {
  children: ReactNode
  size?: Size
  center?: boolean
  white?: boolean
  red?: boolean
  className?: string
}

/**
 * Элемент Description
 */

// \n - новый параграф
// \r - перенос на новую строку
// [название](сылка)

class Description extends Component<IProps> {
  static defaultProps = {
    size: 'middle'
  }

  render (): JSX.Element {
    const { size, center, white, red, className } = this.props

    const classes = cx('description', className, {
      [`description--${size}`]: size,
      'description--center': center,
      'description--white': white,
      'description--red': red
    })

    const list = Children.map(this.props.children, child => {
      if (typeof child === 'string') {
        const paragraphs = child.split('\\n')
        return paragraphs.map((paragraph, p) => {
          const lines = paragraph.split('\\r')
          return (
            <p className='description__p' key={p}>
              {lines.map((line, l) => <ReactMarkdown children={String(line).trim()} unwrapDisallowed />)}
            </p>)
        })
      }
      return child
    })

    return (
      <div className={classes}>
        <div className='description__text'>
          {list}
        </div>
      </div>)
  }
}

export default Description
