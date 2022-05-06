import { ChangeEvent, useEffect, useState } from 'react'
import { Card, Col, Row } from 'antd'
import styled from 'styled-components'

import ContentEmissionCard from './ContentEmissionCard'
import TitleEmissionCard from './TitleEmissionCard'

const StyledCard = styled(Card)`
  background: ${({ color1, color2, color3, background }) =>
    `radial-gradient(100% 52612.89% at 0% 50%, ${color1} 16.98%, ${color2} 51.35%, ${color3} 94.06%), url('/icon/grass.svg'), url(${background})`};
  background-position: center top, center bottom, center center;
  background-size: 100% 16px, contain, contain;
  background-repeat: no-repeat;
  background-color: #ffffff;
  border-radius: 10px;
  max-width: 22.938rem;
  min-height: 26.875rem;
  margin: auto;
  filter: drop-shadow(2px 8px 4px rgba(0, 0, 0, 0.25));
`

const CardEmission = ({ value, context, onClick, color1, color2, color3, background, isWritable = false }) => {
  const [co2, setCo2] = useState(15)

  useEffect(() => {
    if (!isWritable) setCo2(Number(value))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleInputCO2 = event => {
    if (typeof Number(event.currentTarget.value) === 'number' && isFinite(Number(event.currentTarget.value)))
      setCo2(Number(event.currentTarget.value))
  }

  return (
    <div style={{ margin: '1.5rem 1.5rem 0 0' }}>
      <StyledCard color1={color1} color2={color2} color3={color3} background={background}>
        <Row justify="space-between" style={{ flexDirection: 'column', minHeight: '30rem' }}>
          <Col>
            <TitleEmissionCard title={value} co2={co2} isWritable={isWritable} />
          </Col>
          <Col>
            <ContentEmissionCard
              co2={co2}
              context={context}
              isWritable={isWritable}
              handleInputCO2={handleInputCO2}
              onClick={onClick}
            />
          </Col>
        </Row>
      </StyledCard>
    </div>
  )
}

export default CardEmission
