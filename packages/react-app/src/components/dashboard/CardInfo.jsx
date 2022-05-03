import { Card, Col, Image, Row, Typography } from 'antd'

const { Text } = Typography

const CardInfoItem = ({ srcIcon, quantity, text, isBold, mode = 'normal' }) => {
  const hasNormalMode = () => {
    return mode === 'normal'
  }

  return (
    <Row align="middle">
      <Col
        xs={{ span: 4 }}
        sm={{ span: 4 }}
        md={{ span: 6 }}
        lg={{ span: 4, offset: hasNormalMode() ? 0 : 3 }}
        xl={{ span: 4, offset: hasNormalMode() ? 0 : 4 }}
      >
        <Image src={srcIcon} preview={false} />
      </Col>

      <Col xs={{ span: 5 }} sm={{ span: 5 }} md={{ span: 7 }} lg={{ span: 5 }} xl={{ span: 5 }}>
        <Text
          className={`card-text ${isBold ? 'card-text--active' : ''}`}
          style={{ marginRight: hasNormalMode() ? '10px' : '0' }}
        >
          {quantity}
        </Text>
      </Col>
      <Col
        xs={{ span: 15 }}
        sm={{ span: 15 }}
        md={{ span: 11 }}
        lg={{ span: hasNormalMode() ? 15 : 12 }}
        xl={{ span: hasNormalMode() ? 15 : 11 }}
      >
        {' '}
        <Text className={`card-text ${isBold ? 'card-text--active' : ''}`}>{text}</Text>
      </Col>
    </Row>
  )
}

export const CardInfo = ({ mode = 'normal', title, items }) => {
  return (
    <Card title={title} className={`card-info ${mode === 'reverse' ? 'text-end' : ''}`}>
      {items.map(item => (
        <CardInfoItem
          key={item.text}
          srcIcon={item.srcIcon}
          quantity={item.quantity}
          text={item.text}
          isBold={item.isBold}
          mode={mode}
        />
      ))}
    </Card>
  )
}
