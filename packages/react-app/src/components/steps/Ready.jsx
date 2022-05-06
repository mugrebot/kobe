import { useContext, useState } from 'react'
import { Col, Image, Row, Typography } from 'antd'

import { StyledButton } from '../../components/common/StyledButton'
import CalculatorContext from '../../contexts/CalculatorContext'

import { Stats } from './components/Stats'
import { StyledRow } from './components/StyledRow'
import { StyledTitle } from './components/StyledTitle'

const { Text, Title } = Typography

export const Ready = ({ nextStep }) => {
  const { country, email, advanced, setToken } = useContext(CalculatorContext)
  const [loading, setLoading] = useState(false)

  const handleOnClick = () => {
    const data = {
      email,
      country,
      means_of_transport: advanced ? 'Detallada' : 'Simplificada',
    }

    setLoading(true)

    fetch(`https://koywecalc.herokuapp.com/api/v1/home-detailed`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
      .then(async res => {
        const responseData = await res.json()

        if (responseData['access_token']) {
          setToken(responseData['access_token'])
          nextStep()
        } else return Promise.reject(responseData.message)
      })
      .catch(err => {
        console.log(err)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  return (
    <>
      <StyledRow justify="center">
        <Col>
          <Title level={2}>Calculate your emissions</Title>
        </Col>
      </StyledRow>
      <StyledRow justify="center">
        <Col>
          <Text></Text>
        </Col>
      </StyledRow>
      <Row justify="center" gutter={{ md: 16, lg: 16, xl: 32, xxl: 64 }}>
        <Col xs={{ span: 24 }} md={{ span: 12 }} lg={{ span: 12 }} xl={{ span: 8 }}>
          <Stats />
        </Col>
        <Col xs={{ span: 24 }} md={{ span: 12 }} lg={{ span: 12 }} xl={{ span: 16 }} xxl={{ span: 12 }}>
          <StyledRow justify="center">
            <Col>
              <Image src="icon/earth-planet.svg" preview={false} />
            </Col>
          </StyledRow>
          <StyledRow>
            <Col>
              <StyledTitle level={4}>Your footprint is calculated based on the average of your country</StyledTitle>
            </Col>
          </StyledRow>
          <StyledRow>
            <Col>
              <Text></Text>
            </Col>
          </StyledRow>
          <StyledRow>
            <Col>
              <Text>
                You can choose to answer the simplified or the advance questions. The more details you provide, the more
                precise your footprint can be determined.
              </Text>
            </Col>
          </StyledRow>
          <StyledRow justify="space-between">
            <Col>
              <StyledTitle level={4}>Are you ready to start your journey?</StyledTitle>
            </Col>
            <Col>
              <StyledButton $type="primary" onClick={() => handleOnClick()} disabled={loading}>
                Calculate
              </StyledButton>
            </Col>
          </StyledRow>
        </Col>
      </Row>
    </>
  )
}
