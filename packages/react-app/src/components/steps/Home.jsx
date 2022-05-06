import { useContext } from 'react'
import { Col, Image, Input, Row, Select, Typography } from 'antd'

import { StyledButton } from '../../components/common/StyledButton'
import CalculatorContext from '../../contexts/CalculatorContext'

import { StyledCol } from './components/StyledCol'
import { StyledRow } from './components/StyledRow'
import { StyledTitle } from './components/StyledTitle'

const { Text, Title } = Typography
const { Option } = Select

export const Home = ({ nextStep }) => {
  const { country, setCountry, email, setEmail, setGraphValues } = useContext(CalculatorContext)

  return (
    <>
      <StyledRow justify="center">
        <Col>
          <Title level={2}>Calculate your emissions</Title>
        </Col>
      </StyledRow>
      <StyledRow justify="center">
        <Col>
          <Text>
            Answer this brief survey about your lifestyle and get to know your footprint. It will take you from 3 to 10
            minutes.
          </Text>
        </Col>
      </StyledRow>
      <StyledRow justify="center">
        <Col>
          <Image src="icon/earth-planet.svg" preview={false} />
        </Col>
      </StyledRow>
      <StyledRow justify="center" align="middle" gutter={12}>
        <StyledCol>
          <StyledTitle level={3}>Contact information</StyledTitle>
        </StyledCol>
        <StyledCol>
          <Image src="icon/alert-info.svg" preview={false} />
        </StyledCol>
      </StyledRow>
      <StyledRow justify="center">
        <Col xs={{ span: 24 }} sm={{ span: 12 }} md={{ span: 6 }}>
          <Text>Email *</Text>
          <Input placeholder="mail@mail.com" value={email} onChange={e => setEmail(e.target.value)} />
        </Col>
      </StyledRow>
      <StyledRow justify="center">
        <Col xs={{ span: 24 }} sm={{ span: 12 }} md={{ span: 6 }}>
          <Row>
            <Col span={24}>
              <Text>Where do you live? *</Text>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <Select
                placeholder="Choose your country"
                style={{ width: '100%' }}
                value={country}
                onChange={e => setCountry(e.target.value)}
              >
                <Option value="Chile">Chile</Option>
                <Option value="Argentina">Argentina</Option>
              </Select>
            </Col>
          </Row>
        </Col>
      </StyledRow>
      <StyledRow justify="center">
        <Col xs={{ span: 24 }} sm={{ span: 6 }} md={{ span: 4 }} lg={{ span: 3 }}>
          <StyledButton
            $type="primary"
            style={{ width: '100%' }}
            onClick={() => {
              // setGraphValues(prevState => ({ ...prevState, country: '6,5', total: '4,7' })) // reemplazar por el valor del pais
              nextStep()
            }}
          >
            Next
          </StyledButton>
        </Col>
      </StyledRow>
    </>
  )
}
