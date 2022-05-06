import { Card, Col, Image, Row, Typography } from 'antd'

const { Text } = Typography

/**
  type infoDataType = 'coin' | 'air' | 'co2' | 'house' | 'car' | 'burger' | 'work'

  type infoData = {
    id?: number
    quantity: number
    type: infoDataType
  }

  type CardProps = {
    cardType: 'wallet' | 'irl'
    title: string
    items: infoData[]
  }
*/

const imageDict = data => {
  const dict = {
    coin: '/icon/emoji-coin.svg',
    air: '/icon/dashing-away.svg',
    co2: '/icon/co2.svg',
    house: '/icon/emoji-house.svg',
    car: '/icon/emoji-car.svg',
    burger: '/icon/emoji-hamburguer.svg',
    work: '/icon/emoji-work.svg',
  }

  return dict[data]
}

const textDict = (data, cardType) => {
  const dict = {
    coin: 'transactions',
    air: 'gas paid',
    ...(cardType === 'wallet' ? { co2: 'CO2 Tons emitted' } : { co2: '' }),
    house: 'Home',
    car: 'Transport',
    burger: 'Diet',
    work: 'Other',
  }

  return dict[data]
}

const IrlItem = ({
  quantity,
  type,
  cardType,
}) => {
  const isWallet = () => {
    return cardType === 'wallet'
  }

  return (
    <Col span={24}>
      <Row align="middle">
        <Col span={isWallet() ? 2 : 4} offset={isWallet() ? 0 : 4}>
          <Row align="middle">
            <Image src={imageDict(type)} preview={false} />
          </Row>
        </Col>
        <Col span={4}>
          <Row
            style={{ marginRight: isWallet() ? '30px' : -10 }}
            justify={'end'}
            align="middle">
            <Text
              className={`card-text ${
                type === 'co2' ? 'card-text--active' : ''
              }`}>
              {cardType === 'irl' ? textDict(type, cardType) : quantity}
            </Text>
          </Row>
        </Col>
        <Col span={isWallet() ? 18 : 12}>
          <Text
            className={`card-text ${
              type === 'co2' ? 'card-text--active' : ''
            }`}>
            {cardType === 'irl'
              ? `${quantity} tons/year`
              : textDict(type, cardType)}
          </Text>
        </Col>
      </Row>
    </Col>
  )
}

export const CardCustom = ({
  cardType = 'wallet',
  title,
  items,
}) => {
  return (
    <Card
      title={title}
      className={`card-info-fixed ${cardType === 'irl' ? 'text-end' : ''}`}>
      <Row gutter={[0, 10]}>
        {items.map(item => (
          <IrlItem
            key={item.id}
            quantity={item.quantity}
            type={item.type}
            cardType={cardType}
          />
        ))}
      </Row>
    </Card>
  )
}
