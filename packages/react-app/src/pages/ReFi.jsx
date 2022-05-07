/* eslint-disable max-lines */
/* eslint-disable max-lines-per-function */
import React, { useContext, useEffect, useState } from 'react'
import ReactGA from 'react-ga4'
import { Button, Col, Row, Space, Typography } from 'antd'
import { useGasPrice } from 'eth-hooks'

import ConnectButton from '../components/common/ConnectButton'
import BuySetModal from '../components/RegenDefi/BuySetModal'
import MyRegenPositionsFull from '../components/RegenDefi/MyRegenPositionsFull'
import SimpleRamp from '../components/RegenDefi/SimpleRamp'
import SwapModal from '../components/RegenDefi/SwapModal'
import { IndexContext } from '../contexts/IndexContext'
import { NetworkContext } from '../contexts/NetworkContext'
import { WalletContext } from '../contexts/WalletContext'
import { Transactor } from '../helpers'
import { getFightData } from '../helpers/dashboardData'


const { Title } = Typography

const ReFi = () => {
  ReactGA.initialize('G-L9J2W0LSQS')
  ReactGA.send('pageview')

  const { contracts, USDPrices, walletBalance, isPledged, isLoadingBalances, writeContracts } = useContext(WalletContext)
  const { polygonMCO2Balance, polygonBCTBalance, polygonNCTBalance, polygonKlimaBalance, polygonSKlimaBalance, polygonCNBEDBalance, polygonCBTCBalance, polygonWethBalance, polygonContracts  } = walletBalance
  const { address, isLoadingAccount, targetNetwork, userSigner } = useContext(NetworkContext)
  const { setObject, indexContextDetails, indexUSDPrices } = useContext(IndexContext)

  const [balance,setBalance] = useState(0)
  const [currentSet,setCurrentSet] = useState(null)
  const [gasSet,setGasSet] = useState()
  const [modalUp, setModalUp] = useState(false)

  const tx = gasSet && Transactor(userSigner, gasSet)


  useEffect(() => {
    const getGas = async () => {
      const gas = setObject && await setObject.utils.fetchGasPriceAsync('fastest')

      setGasSet(gas)
    }

    getGas()

  }, [setObject])

  const handleModalUp = symbol => {
    setModalUp(true)

    if (indexContextDetails.find(set => {
      return set.symbol === symbol
    })) {
    const _currentSet = indexContextDetails.find(set => {
      return set.symbol === symbol
    })

    setCurrentSet(_currentSet)

    console.log('this is the current set', currentSet)

  } else {
    const _currentSet = [symbol]

    setCurrentSet(_currentSet)

    console.log('this is the current token', currentSet)

  }
}

  const handleModalDown = () => {
    setModalUp(false)
    console.log('this is the current token', currentSet)
    setCurrentSet(null)

  }

  useEffect(() => {
    const fightData = getFightData(
      polygonBCTBalance,
      polygonMCO2Balance,
      polygonNCTBalance,
      polygonKlimaBalance,
      polygonSKlimaBalance,
      0,
      USDPrices,
      polygonCNBEDBalance,
      polygonCBTCBalance,
      indexUSDPrices,
      isPledged,
    )

    setBalance(fightData[2].quantity)

  }, [isLoadingBalances])

  return (
    <Row justify="center" className="mb-md">
      {!isLoadingAccount && address && writeContracts && contracts &&
      <SwapModal
        set={setObject}
        setDetails={currentSet}
        writeContracts={writeContracts}
        contracts={contracts}
        tx={tx}
        modalUp={modalUp}
        handleModalDown={handleModalDown}
        address={address}
        gasPrice={gasSet}
        USDPrices={USDPrices}
        wethBalance={polygonWethBalance}
      />
      }
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
