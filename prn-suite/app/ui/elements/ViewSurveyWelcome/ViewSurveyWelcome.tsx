import React, { Component, MouseEventHandler, ReactNode } from 'react'

import './ViewSurveyWelcome.scss'

import Title from '../Title/Title'
import Segment from '../Segment/Segment'
import ButtonText from '../ButtonText/ButtonText'
import Image from '../Image/Image'
import Toolbar2 from '../Toolbar2/Toolbar2'
import Toolbar2Group from '../Toolbar2/Toolbar2Group'

interface IProps {
  image?: string
  step?: string
  title?: string
  nextButtonText?: string
  prevButtonText?: string
  onNextClick?: MouseEventHandler
  onPrevClick?: MouseEventHandler
  children: ReactNode
}

/**
 * Содержание модалки приветствия с опросом после регистрации в сервисе.
 * Шаг 1
 */
class ViewSurveyWelcome extends Component<IProps> {
  render (): JSX.Element {
    const { step, image, title, nextButtonText, prevButtonText, onNextClick, onPrevClick, children } = this.props

    return (
      <div className='view-survey-welcome'>
        { image &&
        <Segment>
          <Image className='view-survey-welcome__emoji' src={require(`./img/${image}`)}/>
          <Segment size={3}/>
        </Segment>
        }
        { step && <span className='view-survey-welcome__steps'>{step}</span> }
        { title && <Title size='big' text={title} /> }
        {children}
        <Segment size={5}>
          <Toolbar2 size='middle'>
            <Toolbar2Group>
              {prevButtonText && onPrevClick && <ButtonText color='grey' onClick={onPrevClick}>{prevButtonText}</ButtonText>}
              {nextButtonText && onNextClick && <ButtonText color='blue' onClick={onNextClick}>{nextButtonText}</ButtonText>}
            </Toolbar2Group>
          </Toolbar2>
        </Segment>
      </div>
    )
  }
}

export default ViewSurveyWelcome
