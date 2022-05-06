/* eslint-disable max-lines-per-function */
import { useContext, useEffect, useState } from 'react'
import { Col, Image, Input, Row, Select, Tooltip,Typography } from 'antd'

import { StyledButton } from '../../components/common/StyledButton'
import { EmissionsPerCapitaCountries } from '../../constants.js'
import CalculatorContext from '../../contexts/CalculatorContext'
import { NetworkContext } from '../../contexts/NetworkContext'

import { StyledCol } from './components/StyledCol'
import { StyledRow } from './components/StyledRow'
import { StyledTitle } from './components/StyledTitle'

const { Text, Title } = Typography
const { Option } = Select

export const Home = ({ nextStep }) => {
  const { country, setCountry, countryCode, setCountryCode, email, setEmail, graphValues, setGraphValues } = useContext(CalculatorContext)
  const { address, isLoadingAccount } = useContext(NetworkContext)

  const [countryList, setCountryList] = useState()

  useEffect(() => {
    const _countryList = []

    setEmail(address || 'anon')

    for(const country in EmissionsPerCapitaCountries)
      _countryList.push(country)
    setCountryList(_countryList)
  }, [address, setEmail])

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
            We know calculating exactly how much anyone is polluting is nigh impossible.
            <br />
            Still, knowing in orders of magnitude how much CO2e we put in the atmosphere help us create awareness.
            <br />
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
          <Tooltip title="We will link your address to the results in our DB. Logout to answer anonymously">
            <Image src="icon/alert-info.svg" preview={false} />
          </Tooltip>
        </StyledCol>
      </StyledRow>
      <StyledRow justify="center">
        <Col xs={{ span: 24 }} sm={{ span: 12 }} md={{ span: 6 }}>
          <Text>Address *</Text>
          <Input placeholder="0x000" value={address || 'anon'} disabled/>
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
                showSearch
                placeholder="Choose your country"
                optionFilterProp="children"
                style={{ width: '100%' }}
                value={country}
                onChange={value => {
                  setCountryCode(value)
                  setCountry(EmissionsPerCapitaCountries[value].Country)
                }}
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
                {EmissionsPerCapitaCountries && countryList && countryList.map(country => {
                  return <Option key={country} value={country}>{EmissionsPerCapitaCountries[country].Country}</Option>
                })}
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
              setGraphValues(prevState => ({ ...prevState, country: EmissionsPerCapitaCountries[countryCode].AnnualEmissions || '4.47', total: EmissionsPerCapitaCountries[countryCode].AnnualEmissions || '4.47', countryCode })) // reemplazar por el valor del pais
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
