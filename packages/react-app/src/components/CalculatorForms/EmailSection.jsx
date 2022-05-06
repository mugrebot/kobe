import { useContext, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { Col, Image, Input, Row, Typography } from 'antd'
import styled from 'styled-components'

import { StyledButton } from '../../components/common/StyledButton'
import CalculatorContext from '../../contexts/CalculatorContext'
import { IsPledgedContext } from '../../contexts/IsPledgedContext'

const { Title, Text } = Typography

/**
  type EmailSectionProps = {
    email: string
  }
*/

const StyledCol = styled(Col)`
  background: none;
  margin-top: -50px;
  margin-bottom: 2rem;

  @media only screen and (min-width: 1200px) {
    background: url('/icon/arrow-down-icons.svg');
    background-position: right top;
    background-repeat: no-repeat;
    background-size: contain;
    margin-right: -3.125rem;
    min-height: 90vh;
    margin-bottom: 0;
  }
`

const EmailSection = ({ email }) => {
  const router = useHistory()
  const { handleHasCalculator } = useContext(IsPledgedContext)
  const { accessToken } = useContext(CalculatorContext)
  const [loading, setLoading] = useState(false)

  const handleGoToEmission = url => {
    setLoading(true)

    fetch('https://koywecalc.herokuapp.com/api/v1/emissions-report', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 'bearerToken': accessToken }),
    }).then(async res => {
      let responseData = await res.json()

      if (Array.isArray(responseData))
        responseData = responseData[0]

      handleHasCalculator(JSON.stringify(responseData))
      router.push(url)
    }).catch(err => {
      console.log(err)
    }).finally(() => {
      setLoading(false)
    })
  }

  return (
    <Row justify="end">
      <StyledCol span={24}>
        <Row
          gutter={[0, 10]}
          justify="start"
          style={{
            marginTop: '48px',
            flexDirection: 'column',
          }}>
          <Col xl={10} md={24}>
            <Title style={{ color: '#25855A' }}>¡Felicitaciones!</Title>
          </Col>
          <Col xl={10} md={24} style={{ marginBottom: '4rem' }}>
            <Text style={{ fontSize: '24px', lineHeight: '32px' }}>
              ¡Al medir tus emisiones estás dando el primer paso!
            </Text>
          </Col>
          <Col xl={10} md={24} style={{ marginBottom: '1rem' }}>
            <Text>Tus emisiones están siendo calculadas</Text>
          </Col>
          <Col xl={10} md={24} style={{ marginBottom: '3rem' }}>
            <Row justify="space-around">
              <Col>
                <Image src={'/icon/emoji-car.svg'} preview={false} />
              </Col>
              <Image src={'/icon/emoji-house.svg'} preview={false} />
              <Col>
                <Image src={'/icon/emoji-hamburguer.svg'} preview={false} />
              </Col>
              <Col>
                <Image src={'/icon/emoji-work.svg'} preview={false} />
              </Col>
              <Col>
                <Image src={'/icon/co2.svg'} preview={false} />
              </Col>
            </Row>
          </Col>
          <Col xl={10} md={24}>
            <Text>Tus emisiones están siendo calculadas</Text>
          </Col>
          <Col xl={10} md={24}>
            <Input value={email} placeholder="mail@yourmail.com" />
          </Col>
          <Col xl={10} md={24}>
            <StyledButton
              $type="primary"
              disabled={loading}
              style={{ paddingInline: '2.2rem', float: 'right' }}
              onClick={() => handleGoToEmission('emission')}>
              Ver mis emisiones
            </StyledButton>
          </Col>
        </Row>
      </StyledCol>
    </Row>
  )
}

export default EmailSection
