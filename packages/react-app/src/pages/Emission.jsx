import React, { useContext, useEffect, useMemo, useState } from 'react'
import ReactGA from 'react-ga4'
import { Card, Col, Image, Row, Space, Typography } from 'antd'

import { CardCustom } from '../components/CardCustom'

const { Title } = Typography

import { useHistory } from 'react-router-dom'

import CardEmission from '../components/CardEmission'
import CarbonFYI from '../components/common/CarbonFYI'
import ConnectButton from '../components/common/ConnectButton'
import { StyledButton } from '../components/common/StyledButton'
import { IsPledgedContext } from '../contexts/IsPledgedContext'
import { NetworkContext } from '../contexts/NetworkContext'

import walletMock from './wallet-data.json'

// eslint-disable-next-line max-lines-per-function
const Wallet = () => {
  ReactGA.initialize('G-L9J2W0LSQS')
  ReactGA.send('pageview')

  const { address, isLoadingAccount } = useContext(NetworkContext)
  const location = useHistory()
  const { hasCalculator, resetCalculator } = useContext(IsPledgedContext)
  const [irlStoredData, setIrlStoredData] = useState(null)
  const [totalEmissions, setTotalEmissions] = useState(undefined)

  const handleMenu = url => {
    location.push(url)
  }

  const isStaging = useMemo(() => {
    return window.location.hostname.includes('staging')
  }, [])

  const [dataWallet, setDataWallet] = useState()
  const [dataIrl, setDataIrl] = useState(null)

  useEffect(() => {
    const walletInfo = walletMock

    if (address) {
      walletInfo.data.info[0].quantity = <CarbonFYI currentAddress={address} metric="txs" />
      walletInfo.data.info[1].quantity = <CarbonFYI currentAddress={address} metric="gas" />
      walletInfo.data.info[2].quantity = <CarbonFYI currentAddress={address} />
    }
    setDataWallet(walletInfo)
  }, [address, isLoadingAccount])

  useEffect(() => {
    if (hasCalculator && !irlStoredData) setIrlStoredData(JSON.parse(hasCalculator))

    if (irlStoredData) {
      console.log(irlStoredData)
      setDataIrl({
        data: {
          info: [
            { id: 1, quantity: parseFloat(irlStoredData.Home_Emissions || 0).toFixed(2), type: 'house' },
            { id: 2, quantity: parseFloat(irlStoredData.Transportation_Emissions || 0).toFixed(2), type: 'car' },
            { id: 3, quantity: parseFloat(irlStoredData.Diet_Emissions || 0).toFixed(2), type: 'burger' },
            { id: 4, quantity: parseFloat(irlStoredData.Goods_Emissions || 0).toFixed(2), type: 'house' },
            { id: 5, quantity: parseFloat(irlStoredData.Services_Emissions || 0).toFixed(2), type: 'work' },
          ],
        },
      })
      setTotalEmissions(
        (
          parseFloat(irlStoredData.Home_Emissions || 0) +
          parseFloat(irlStoredData.Transportation_Emissions || 0) +
          parseFloat(irlStoredData.Diet_Emissions || 0) +
          parseFloat(irlStoredData.Goods_Emissions || 0) +
          parseFloat(irlStoredData.Services_Emissions || 0)
        ).toFixed(2),
      )
    }
  }, [hasCalculator, irlStoredData])

  return (
    <Row className="my-sm">
      <Col offset={1}>
        <Space direction="vertical">
          <Title>
            {totalEmissions
              ? `You emit ${totalEmissions} CO2 tons/year, more than your country average!`
              : `Calculate your emissions`}
          </Title>
        </Space>
      </Col>
      <Row justify="center" style={{ width: '100%', minHeight: '100vh', marginBottom: '2rem' }}>
        <Col xs={24} md={22}>
          <Row justify="space-between">
            <Col xs={24} md={11}>
              {dataWallet && address && (
                <CardCustom title="Your Wallet Emissions" cardType="wallet" items={dataWallet.data.info} />
              )}
              {isLoadingAccount && !address && <ConnectButton />}
            </Col>
            {!irlStoredData && <Col md={9}></Col>}
            {!irlStoredData && (
              <Col xs={{ span: 24 }} md={{ span: 11 }} style={{ marginTop: '20px' }}>
                <Card title="IRL emissions" className="card-info">
                  <Row justify="center">
                    <Col xs={{ span: 22 }} style={{ marginBottom: '30px' }}>
                      <Row justify="space-around">
                        <Image src={'/icon/emoji-house.svg'} preview={false} />
                        <Image src={'/icon/emoji-airplane.svg'} preview={false} />
                        <Image src={'/icon/emoji-hamburguer.svg'} preview={false} />
                        <Image src={'/icon/emoji-work.svg'} preview={false} />
                        <Image src={'/icon/world.svg'} preview={false} />
                      </Row>
                    </Col>
                    <StyledButton $type="primary" onClick={() => handleMenu('/calculator')} block disabled={!isStaging}>
                      Start calculator (coming soon)
                    </StyledButton>
                  </Row>
                </Card>
              </Col>
            )}
            <Col xs={{ span: 24 }} md={{ span: 11 }}>
              {irlStoredData && dataIrl && (
                <CardCustom title="IRL emissions" cardType="irl" items={dataIrl.data.info} />
              )}
            </Col>
          </Row>
          {irlStoredData && totalEmissions && (
            <Row justify="space-between" className="my-md">
              <Col span={24}>
                <Title>Commit your actions and take the pledge</Title>
              </Col>
              <Col xl={8} md={12} xs={24}>
                <CardEmission
                  value={totalEmissions}
                  context={'I want to take charge of my emissions'}
                  background={'/icon/tree-credit-card.svg'}
                  color1={'#50B60F'}
                  color2={'#97CF55'}
                  color3={'#CEE28B'}
                  onClick={handleMenu}
                />
              </Col>
              <Col xl={8} md={12} xs={24}>
                <CardEmission
                  value={parseFloat(totalEmissions) * 2}
                  context={
                    'Not everybody is taking care of their emissions and we need to act fast. Offset for 2 individuals like you'
                  }
                  background={'/icon/tree-woman-cat.svg'}
                  color1={'#60352A'}
                  color2={'#9B6A49'}
                  color3={'#CC9B7A'}
                  onClick={handleMenu}
                />
              </Col>
              <Col xl={8} md={12} xs={24}>
                <CardEmission
                  value={'Pledge for as many tons/year as you can take care of'}
                  background={'/icon/tree-business-woman-man.svg'}
                  color1={'#2A6797'}
                  color2={'#74A6D6'}
                  color3={'#C7DDEF'}
                  onClick={handleMenu}
                  isWritable
                />
              </Col>
            </Row>
          )}
        </Col>
      </Row>
      {irlStoredData && (
        <Row style={{ width: '100%', marginBottom: '2rem', marginLeft: '2.5rem' }}>
          <StyledButton
            $type="primary"
            onClick={() => {
              resetCalculator()
              location.go(0)
            }}
          >
            Restart Calculator
          </StyledButton>
        </Row>
      )}
    </Row>
  )
}

export default Wallet
