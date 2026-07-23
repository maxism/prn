import React, { Component } from 'react'
import ButtonText from '../../ui/elements/ButtonText/ButtonText'
import Description from '../../ui/elements/Description/Description'
import Segment from '../../ui/elements/Segment/Segment'
import LiteLayout from '../layouts/LiteLayout'
import Title from '../../ui/elements/Title/Title'
import Toolbar2 from '../../ui/elements/Toolbar2/Toolbar2'
import { Helmet } from 'react-helmet'
import QRCode from 'react-qr-code'
import InputText from '../../ui/elements/InputText/InputText'

interface IProps {}

interface IState {
  qr: string
  inputText: string
}

class CodeGeneratorPage extends Component<IProps, IState> {
  public state: IState = {
    qr: '',
    inputText: ''
  }

  handleDownload = (): void => {
    const svg = document.getElementById('QRCode')
    const svgData = new XMLSerializer().serializeToString(svg)
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()
    img.onload = () => {
      canvas.width = img.width
      canvas.height = img.height
      ctx.drawImage(img, 0, 0)

      const downloadLink = document.createElement('a')
      downloadLink.download = 'qr_code'
      downloadLink.href = canvas.toDataURL('image/png')
      downloadLink.click()
    }
    img.src = `data:image/svg+xml;base64,${btoa(svgData)}`
  }

  render (): JSX.Element {
    const { inputText } = this.state
    return (
      <LiteLayout>
        {/* @ts-ignore */}
        <Helmet>
          <title>Генератор QR кодов — КУБ Suite</title>
        </Helmet>
        <Title>Генератор QR кодов</Title>
        <Segment size={2}/>
        <Description size='big'>
          Быстрая генерация QR кодов
        </Description>
        <Segment size={3}/>
        <Toolbar2>
          <InputText
            label='Введите текст или ссылку'
            value={inputText}
            onChange={e => this.setState({ inputText: e.target.value })}
            big
          />
          <Segment size={3}/>
          {/*<ButtonText size={'awesome'} color='blue' onClick={() => this.setState({ qr: this.state.inputText })}>Создать QR код</ButtonText>*/}
        </Toolbar2>
        {inputText &&
          <Segment size={3}>
              <QRCode id='QRCode' value={inputText}/>
              <Segment size={2}/>
              <ButtonText size={'big'} color='blue' onClick={() => this.handleDownload()}>Скачать</ButtonText>
          </Segment>
        }
        <Segment size={3} />
      </LiteLayout>
    )
  }
}

export default CodeGeneratorPage
