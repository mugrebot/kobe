import { Col, Image, Progress, Row, Typography } from 'antd'
import styled from 'styled-components'

import { device } from '../../../styles/theme'

const { Text, Title } = Typography

const StyledBody = styled.div`
  box-sizing: border-box !important;
  background-color: #e6fffa;
  border: 1px solid #2c7a7b;
  border-radius: 5px;
  padding: 2px 10px;
  min-height: 450px;
  @media ${device.sm} {
    min-height: 470px;
  }

  @media ${device.md} {
    padding: 6px 20px;
  }

  @media ${device.lg} {
    padding: 12px 20px;
  }
`

const StatItem = props => {
  const { id, icon, text, percent, color } = props

  return (
    <Row key={id} align="middle" gutter={16}>
      <Col xs={{ span: 4 }} sm={{ span: 4 }} md={{ span: 4 }}>
        <Image src={icon} preview={false} />
      </Col>
      <Col xs={{ span: 10 }} sm={{ span: 7 }} md={{ span: 9 }}>
        <Text>{text}</Text>
      </Col>
      <Col xs={{ span: 10 }} sm={{ span: 13 }} md={{ span: 11 }}>
        <Progress trailColor="#C4C4C4" strokeColor={color ? color : '#25855A'} percent={percent} showInfo={false} />
      </Col>
    </Row>
  )
}

export const Stats = ({ graphValues }) => {
  const data = [
    {
      id: '1',
      icon: 'icon/emoji-car.svg',
      text: 'Transport',
      percent: graphValues?.transport || 50,
      color: '#319795',
    },
    {
      id: '2',
      icon: 'icon/energy.svg',
      text: 'Energy',
      percent: graphValues?.energy || 50,
      color: '#D69E2E',
    },
    {
      id: '3',
      icon: 'icon/burger.svg',
      text: 'Diet',
      percent: graphValues?.diet || 50,
      color: '#DD6B20',
    },
    {
      id: '4',
      icon: 'icon/emoji-house.svg',
      text: 'Goods',
      percent: graphValues?.property || 50,
      color: '#00B5D8',
    },
    {
      id: '5',
      icon: 'icon/emoji-work.svg',
      text: 'Services',
      percent: graphValues?.expense || 50,
      color: '#D53F8C',
    },
  ]

  return (
    <StyledBody>
      <Row justify="space-between" align="middle">
        <Col>
          <Image src="icon/chile.svg" preview={false} />
        </Col>
        <Col xs={{ span: 12 }} sm={{ span: 8 }} md={{ span: 12 }}>
          <Row align="middle" justify="center">
            <Col>
              <Title level={2}>{graphValues?.country || '6,5'}</Title>
            </Col>
          </Row>
          <Row align="middle" justify="center">
            <Col style={{ textAlign: 'center' }}>
              <Text style={{ marginRight: 4 }}>times the planetary boundaries</Text>
              <Image src="icon/alert-info.svg" height={14} preview={false} />
            </Col>
          </Row>
        </Col>
      </Row>
      <Row justify="space-between" align="middle" style={{ margin: '12px 0' }}>
        <Col>
          <Image src="icon/industry.svg" preview={false} />
        </Col>
        <Col xs={{ span: 12 }} sm={{ span: 8 }} md={{ span: 12 }}>
          <Row align="middle" justify="center">
            <Col>
              <Title level={3}>{graphValues?.total || '4,7'}</Title>
            </Col>
          </Row>
          <Row align="middle" justify="center">
            <Col>
              <Text>Ton Co2e/year</Text>
            </Col>
          </Row>
        </Col>
      </Row>
      <Row style={{ margin: '12px 0' }}>
        <Progress trailColor="#C4C4C4" strokeColor="#25855A" percent={50} showInfo={false} />
      </Row>
      {data.map(item => (
        <StatItem
          id={item.id}
          key={item.id}
          icon={item.icon}
          text={item.text}
          percent={item.percent}
          color={item.color}
        />
      ))}
    </StyledBody>
  )
}
