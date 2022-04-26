/* eslint-disable max-lines-per-function */
import React, { useContext, useEffect, useState } from 'react'
import ReactGA from 'react-ga4'
import { useHistory } from 'react-router-dom'
import { Col, Image, Row, Typography } from 'antd'

import ConnectButton from '../components/common/ConnectButton'
import { StyledButton } from '../components/common/StyledButton'
import { CardInfo } from '../components/dashboard/CardInfo'
import MyRegenArt from '../components/dashboard/MyRegenArt'
import MyRegenPositions from '../components/dashboard/MyRegenPositions'
import { ProgressInfo } from '../components/dashboard/ProgressInfo'
import { NetworkContext } from '../contexts/NetworkContext'
import { WalletContext } from '../contexts/WalletContext'
import { getFightData, getPlightData } from '../helpers/dashboardData'
import { useTreejerGraph } from '../hooks/useTreejerGraph'

const { utils } = require('ethers')
const { Text } = Typography

const Dashboard = () => {
  ReactGA.initialize('G-L9J2W0LSQS')
  ReactGA.send('pageview')

  const router = useHistory()
  const { address, isLoadingAccount } = useContext(NetworkContext)
  const { USDPrices, walletBalance, tonsPledged, isPledged, yourKTBalance, yourTreejerBalance, yourETBalance, CO2TokenBalance } = useContext(WalletContext)
  const { polygonMCO2Balance, polygonBCTBalance, polygonNCTBalance, polygonKlimaBalance, polygonSKlimaBalance } =
    walletBalance
  const [fightData, setFightData] = useState([])
  const [plightData, setPlightData] = useState([])
  const [yourPlight, setYourPlight] = useState()
  const [yourFight, setYourFight] = useState()
  const [pledged, setPledged] = useState(isPledged) // created to be sync with the useEffect

  const { collection: artGallery, isLoading } = useTreejerGraph(address)
  const trees = yourKTBalance + yourTreejerBalance + yourETBalance

  useEffect(() => {
    const fightData = getFightData(
      polygonBCTBalance,
      polygonMCO2Balance,
      polygonNCTBalance,
      polygonKlimaBalance,
      polygonSKlimaBalance,
      trees,
      USDPrices,
      isPledged,
    )

    setFightData(fightData)
    setYourFight(
      isPledged
        ? (
            Number(utils.formatUnits(polygonBCTBalance || 0, 18)) +
            Number(utils.formatUnits(polygonNCTBalance || 0, 18)) +
            Number(utils.formatUnits(polygonMCO2Balance || 0, 18))
          ).toFixed(2)
        : 0,
    )

    const plightData = getPlightData(address, CO2TokenBalance, tonsPledged, isPledged)

    setPlightData(plightData)

    setYourPlight(
      isPledged
        ? (
            Number(utils.formatUnits(CO2TokenBalance || 0, 18)) + Number(utils.formatUnits(tonsPledged || 0, 9) * 70)
          ).toFixed(2)
        : 0,
    )
    setPledged(isPledged)
  }, [CO2TokenBalance, USDPrices, address, isPledged, polygonBCTBalance, polygonKlimaBalance, polygonMCO2Balance, polygonNCTBalance, polygonSKlimaBalance, tonsPledged, trees, yourKTBalance])

  return (
    <Row justify="center" className="my-sm">
      <Col xs={{ span: 24 }} md={{ span: 22 }}>
        <Row justify="space-between">
          <Col xs={{ span: 24 }} md={{ span: 11 }}>
            <CardInfo title="Your fight" items={fightData} />
          </Col>
          <Col xs={{ span: 24 }} md={{ span: 11 }}>
            <CardInfo title="Your plight" items={plightData} mode="reverse" />
          </Col>
        </Row>
        <Row justify="end" className="my-md">
          {pledged ? (
            <Col>
              <StyledButton $type="primary" onClick={() => router.push('/regen-art')}>
                Now Minting! Koywe Trees
              </StyledButton>
            </Col>
          ) : (
            <Col>
              <StyledButton className="mr-sm" onClick={() => router.push('/emission')}>
                Calculate my emissions
              </StyledButton>
              <StyledButton $type="primary" onClick={() => router.push('/pledge')}>
                Take the pledge
              </StyledButton>
            </Col>
          )}
        </Row>
        <Row className="my-md">
          <Col span={24}>
            <ProgressInfo
              above={
                <>
                  <Text className="mr-sm">Your Goal</Text>
                  <Image src={'icon/emoji-trophy.svg'} preview={false} />
                </>
              }
              below={<Text>{`${yourFight || 0} CO2 tons`}</Text>}
              title={'Your fight'}
              color="#3182CE"
              // percentage={}
              percentage={
                isPledged && yourFight > yourPlight ? 100 : Math.max((yourFight / yourPlight).toFixed(2) * 100, 10)
              }
            />
            <ProgressInfo
              title={'Your plight'}
              color="#E53E3E"
              above={
                <>
                  <Text className="mr-sm">Your Journey</Text>
                  <Image src={'icon/emoji-user.svg'} preview={false} />
                </>
              }
              below={<Text>Pledged {`${yourPlight || 0} CO2 tons over Lifetime`}</Text>}
              percentage={
                isPledged && yourFight < yourPlight ? 100 : Math.max((yourPlight / yourFight).toFixed(2) * 100, 10)
              }
            />
          </Col>
        </Row>
        {!isLoadingAccount && address && (
          <MyRegenArt artGallery={artGallery} isLoading={isLoading} title="Your regen art" />
        )}
        {!isLoadingAccount && address && <MyRegenPositions />}
      </Col>
      {isLoadingAccount && !address && <ConnectButton />}
    </Row>
  )
}

export default Dashboard
