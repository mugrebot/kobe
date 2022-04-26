import React, { useContext, useEffect, useState } from 'react'
import ReactGA from 'react-ga4'
import { Button, Col, Row, Space, Typography } from 'antd'
import { useGasPrice } from 'eth-hooks'
import Set from 'set.js'

import ConnectButton from '../components/common/ConnectButton'
import BuySetModal from '../components/RegenDefi/BuySetModal'
import MyRegenPositionsFull from '../components/RegenDefi/MyRegenPositionsFull'
import SimpleRamp from '../components/RegenDefi/SimpleRamp'
import { NetworkContext } from '../contexts/NetworkContext'
import { WalletContext } from '../contexts/WalletContext'
import { Transactor } from '../helpers'
import { getFightData } from '../helpers/dashboardData'

const { Title } = Typography

const SetJsPolygonAddresses = {
  controllerAddress: '0x75FBBDEAfE23a48c0736B2731b956b7a03aDcfB2',
  setTokenCreatorAddress: '0x14f0321be5e581abF9d5BC76260bf015Dc04C53d',
  basicIssuanceModuleAddress: '0x38E5462BBE6A72F79606c1A0007468aA4334A92b',
  debtIssuanceModuleV2Address: '0xf2dC2f456b98Af9A6bEEa072AF152a7b0EaA40C9',
  streamingFeeModuleAddress: '0x8440f6a2c42118bed0D6E6A89Bf170ffd13e21c0',
  tradeModuleAddress: '0xd04AabadEd11e92Fefcd92eEdbBC81b184CdAc82',
  protocolViewerAddress: '0x8D5CF870354ffFaE0586B639da6D4E4F6C659c69',
  integrationRegistryAddress: '0x4c4C649455c6433dC48ff1571C9e50aC58f0CeFA',
  priceOracleAddress: '0x9378Ad514c00E4869656eE27b634d852DD48feAD',
  setValuerAddress: '0x3700414Bb6716FcD8B14344fb10DDd91FdEA59eC',
}


const ReFi = () => {
  ReactGA.initialize('G-L9J2W0LSQS')
  ReactGA.send('pageview')

  const { contracts, USDPrices, walletBalance, isPledged, isLoadingBalances, writeContracts } = useContext(WalletContext)
  const { polygonMCO2Balance, polygonBCTBalance, polygonNCTBalance, polygonKlimaBalance, polygonSKlimaBalance } = walletBalance
  const { address, isLoadingAccount, injectedProvider, targetNetwork, userSigner } = useContext(NetworkContext)

  const [balance,setBalance] = useState(0)
  const [set,setSet] = useState()
  const [setName,setSetName] = useState('')
  const [modalUp, setModalUp] = useState(false)

  const gasPrice = useGasPrice(targetNetwork, 'fastest')
  const tx = Transactor(userSigner, gasPrice)

  const handleModalUp = set => {
    setModalUp(true)
    setSetName(set)
  }

  const handleModalDown = () => {
    setModalUp(false)
    setSetName('')
  }

  useEffect(() => {
    const getSet = async () => {
      if(injectedProvider) {
        const SetJsConfig = {
          ethersProvider: injectedProvider,
          ...SetJsPolygonAddresses,
        }

        setSet(new Set(SetJsConfig))

      }
    }

    getSet()
  }, [injectedProvider])

  useEffect(() => {
    const fightData = getFightData(
      polygonBCTBalance,
      polygonMCO2Balance,
      polygonNCTBalance,
      polygonKlimaBalance,
      polygonSKlimaBalance,
      0,
      USDPrices,
      isPledged,
    )

    setBalance(fightData[2].quantity)

  }, [isLoadingBalances])

  return (
    <Row justify="center" lassName="mb-md">
      {!isLoadingAccount && address && writeContracts && contracts &&
      <BuySetModal writeContracts={writeContracts} contracts={contracts} tx={tx} modalUp={modalUp} handleModalDown={handleModalDown} setName={setName} address={address} set={set} gasPrice={gasPrice} />}
      <Col span={24} style={{ textAlign:'center' }} >
        <Title level={2}>Total Portfolio Value: {balance} USD</Title>
      </Col>
      {/* <Col>
        {!isLoadingAccount && address && <PortfolioChart />}
      </Col> */}
      {/* <Col>
        {!isLoadingAccount && address && polyTransactions && <TokenTransactions polyTransactions={polyTransactions} address={address} />}
      </Col> */}
      <Col span={24}>
        {!isLoadingAccount && address && <MyRegenPositionsFull handleModalUp={handleModalUp} />}
      </Col>
      <Col>
        {!isLoadingAccount && address && <SimpleRamp address={address} />}
        {isLoadingAccount && !address && <ConnectButton />}
      </Col>
    </Row>
  )
}

export default ReFi
