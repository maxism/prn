import { inject, observer } from 'mobx-react'
import React, { Component } from 'react'
import { IStatisticsParams } from '../../../interfaces/IParams'
import CommunitiesStore from '../../../stores/CommunitiesStore'
import PostsStore from '../../../stores/PostsStore'
import { Stores } from '../../../stores/RootStore'
import StatisticsStore from '../../../stores/StatisticsStore'
import StatisticsSummaryStore from '../../../stores/StatisticsSummaryStore'
import Description from '../../../ui/elements/Description/Description'
import Segment from '../../../ui/elements/Segment/Segment'
import Title from '../../../ui/elements/Title/Title'
import withParams, { ParamsProps } from '../../../utils/withParams'
import Textarea from '../../../ui/elements/Textarea/Textarea'
import Checkbox from '../../../ui/elements/Checkbox/Checkbox'

interface IProps {
  params?: ParamsProps<IStatisticsParams>
  communitiesStore?: CommunitiesStore
  postsStore?: PostsStore
  statisticsStore?: StatisticsStore
  statisticsSummaryStore?: StatisticsSummaryStore
}

@withParams
@inject(Stores.COMMUNITIES_STORE, Stores.STATISTICS_STORE, Stores.STATISTICS_SUMMARY_STORE, Stores.POSTS_STORE)
@observer
class StatisticsCommunityRecommendationsPage extends Component<IProps> {
  render (): JSX.Element {
    return (
      <Segment size={5}>

        <Title text='Рекомендации' />
        <Segment size={3} />
        <Description size='big'>
          В этом разеделе собраны основные данные по странице и их изменения относительно предыдущего периода.
        </Description>

        <Segment size={5}>
          <Title>Расскажите о проекте</Title>
          <Title size='small'>Название компании / бренда</Title>
          <Textarea></Textarea>
          <Title size='small'>Информация о компании, специализация</Title>
          <Textarea></Textarea>
          <Title size='small'>Продукты, которые хотите продвигать</Title>
          <Textarea></Textarea>
          <Title size='small'>Основная информация о продуктах (таваре / услуге)</Title>
          <Textarea></Textarea>
          <Title size='small'>Основные задачи, которые решает товар / услуга</Title>
          <Textarea></Textarea>
          <Title size='small'>Уникальное торговое предложение (УТП)</Title>
          <Textarea></Textarea>
          <Title size='small'>Дополнительные преимущества</Title>
          <Textarea></Textarea>
          <Title size='small'>Ценовой сегмент, розничная цена</Title>
          <Textarea></Textarea>
          <Title size='small'>Регионы и каналы дистрибуции</Title>
          <Textarea></Textarea>
          <Title size='small'>Каналы продвижения бренда</Title>
          <Textarea></Textarea>

          <Title>Клиенты</Title>
          <Title size='small'>Основные сегменты целевой аудитории</Title>
          <Textarea></Textarea>
          <Title size='small'>Ядро целевой аудитории</Title>
          <Textarea></Textarea>
          <Title size='small'>Лица, принимающие решение о покупке</Title>
          <Textarea></Textarea>

          <Title>Конкуренты</Title>
          <Title size='small'>Основные конкуренты</Title>
          <Textarea></Textarea>
          <Title size='small'>Смежные конкуренты</Title>
          <Textarea></Textarea>
          <Title size='small'>Стоимость товара / услуги конкурентов</Title>
          <Textarea></Textarea>
          <Title size='small'>Преимущества конкурентов</Title>
          <Textarea></Textarea>
          <Title size='small'>Недостатки конкурентов</Title>
          <Textarea></Textarea>

          <Title>Задачи в соцсетях</Title>
          <Title size='small'>Какие задачи хотите решить с помощью социальных сетей? Что хотите изменить?</Title>
          <Checkbox label='Повышение узнаваимости бренда' />
          <Checkbox label='Рост вовлеченности' />
          <Checkbox label='Привлечь трафик на сайт' />
          <Checkbox label='Увеличить число упоминаний (распространение контента)' />
          <Checkbox label='Генерация продаж / лидов' />
          <Checkbox label='Обеспечить эффективный сервис' />
          <Checkbox label='Увеличить доход' />
          <Checkbox label='Увеличить сообщество бренда' />
          <Checkbox label='Быть в курсе обсуждений бренда' />
          <Checkbox label='Изучение потребностей клиентов' />

          <Title size='small'>Какие результаты вы ожидаете?</Title>
          <Textarea></Textarea>
          <Title size='small'>В вашей компании есть отделы SMM и маркетинга?</Title>
          <Textarea></Textarea>
          <Title size='small'>Ссылки на дополнительные материалы о компании / бренде / продукте / услуге</Title>
          <Textarea></Textarea>
          <Title size='small'>Другая важная информация, комментарии, ограничения и пожелания</Title>
          <Textarea></Textarea>
          <Title size='small'>Контактная информация для связи</Title>
          <Textarea></Textarea>
        </Segment>

        <Segment size={10} />

      </Segment>
    )
  }
}

export default StatisticsCommunityRecommendationsPage
