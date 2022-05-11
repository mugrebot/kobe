/* eslint-disable max-lines-per-function */
import React, { useContext, useEffect, useState } from 'react'
import ReactGA from 'react-ga4'
import { Col, Row, Space, Typography } from 'antd'

import ConnectButton from '../components/common/ConnectButton'
import { StyledButton } from '../components/common/StyledButton'
import MyCertificates from '../components/Offsets/MyCertificates'
import MyTCOPositions from '../components/Offsets/MyTCOPositions'
import MyToucanPositions from '../components/Offsets/MyToucanPositions'
import OffsetsModal from '../components/Offsets/OffsetsModal'
import { IndexContext } from '../contexts/IndexContext'
import { NetworkContext } from '../contexts/NetworkContext'
import { WalletContext } from '../contexts/WalletContext'
import { Transactor } from '../helpers'
import { useToucanMintEvents } from '../hooks/usePolyscanAPI'

const { Title } = Typography
const { utils } = require('ethers')

const Offsets = () => {
  ReactGA.initialize('G-L9J2W0LSQS')
  ReactGA.send('pageview')

  const { contracts, USDPrices, walletBalance, isPledged, isLoadingBalances, writeContracts, yourTCBalance } = useContext(WalletContext)
  const { polygonBCTBalance, polygonNCTBalance, polygonWethBalance  } = walletBalance
  const { address, isLoadingAccount, targetNetwork, userSigner } = useContext(NetworkContext)
  const { setObject } = useContext(IndexContext)

  const [balance,setBalance] = useState(0)
  const [tcoBalances,setTtcoBalances] = useState()
  const [certificates,setCertificates] = useState()
  const [tcoLoading,setTcoLoading] = useState(false)
  const [currentToken,setCurrentToken] = useState(null)
  const [tcoContract,setTcoContract] = useState(null)
  const [gasSet,setGasSet] = useState()
  const [modalUp, setModalUp] = useState(false)

  const tx = gasSet && Transactor(userSigner, gasSet)

  const toucanCerts = useToucanMintEvents(address)

  // with tuple data, from certificate (ie 63), call
  // retirements function
  //

  useEffect(() => {
    const getCertificates = async () => {
      const _certificates = []

      if(yourTCBalance && yourTCBalance>0 && toucanCerts && contracts)
        for (const cert of toucanCerts) {
          const ownerOf = await contracts.TOUCANCERTS.ownerOf(cert.tokenID)

          if(ownerOf === cert.minter) { // we check if the minter is still the owner. only then, we add it to the list
            const _token = await contracts.TOUCANCERTS.certificates(cert.tokenID)
            const retiredAmount = await contracts.TOUCANCERTS.getRetiredAmount(cert.tokenID)

            _certificates.push({ ..._token,retiredAmount })
          }
        }

      setCertificates(_certificates)
    }

    getCertificates()
  }, [toucanCerts,yourTCBalance,contracts])

  const getTCOBalances = async () => {
    if(!address) return []
    setTcoLoading(true)

    const _tcoBalances = []

    try {
      const tcoContracts = contracts && contracts.TCO2FACTORY && await contracts.TCO2FACTORY.getContracts()

      await Promise.all(tcoContracts.map(async contract => {
        const currentContract = contracts.TCO2FACTORY.attach(contract)
        const _balance = currentContract && await currentContract.balanceOf(address)

        if(Number(utils.formatEther(_balance))>0) {
          const _symbol = currentContract && await currentContract.symbol()

          _tcoBalances.push({ address: contract, symbol:_symbol, balance: _balance })
        }
      }))
    } catch(e) {
      console.log(`Error while reading TCO Balances. ${e}`)
    }
    setTtcoBalances(_tcoBalances)
    setTcoLoading(false)
  }

  useEffect(() => {
    const getGas = async () => {
      const gas = setObject && await setObject.utils.fetchGasPriceAsync('fast')

      setGasSet(gas)
    }

    getGas()

  }, [setObject])

  useEffect(() => {
    if(address) getTCOBalances()

  }, [address])

  const handleModalUp = symbol => {
    setModalUp(true)
    setCurrentToken(symbol)
    setTcoContract(tcoBalances.find(tco => {
      return tco.symbol === symbol
    })?.address)
  }

  const handleModalDown = () => {
    setModalUp(false)
    setCurrentToken(null)
  }

  useEffect(() => {
    const _balance =
      utils.formatUnits(polygonBCTBalance || 0,18)*1 +
      utils.formatUnits(polygonNCTBalance || 0,18)*1

    setBalance(_balance)

  }, [isLoadingBalances, polygonBCTBalance, polygonNCTBalance])

  return (
    <>
      <Row justify="center" className="mb-md">
        {!isLoadingAccount && address && writeContracts && contracts &&
        <OffsetsModal
          symbol={currentToken}
          tcoContract={tcoContract}
          writeContracts={writeContracts}
          contracts={contracts}
          tx={tx}
          modalUp={modalUp}
          handleModalDown={handleModalDown}
          address={address}
          USDPrices={USDPrices}
        />}
        <Col span={18} style={{ textAlign:'center' }} >
          <Title level={2}>Toucan Protocol CO2 Fungible Tons: {balance.toFixed(2)}</Title>
        </Col>
        <Col span={18} style={{ textAlign:'center' }} >
          {!isLoadingAccount && address && <MyToucanPositions handleModalUp={handleModalUp} />}
        </Col>
      </Row>
      <Row justify="center" className="mb-md">
        <Col span={18} style={{ textAlign:'center' }} >
          {!isLoadingAccount && address && tcoBalances && <MyTCOPositions handleModalUp={handleModalUp} tcoBalances={tcoBalances} />}
          {!isLoadingAccount && address && <StyledButton loading={tcoLoading} $type="primary" onClick={getTCOBalances}>
            Refresh TCO Tokens (Could take a while)
          </StyledButton>}
        </Col>
      </Row>
      <Row justify="center" className="mb-md">
        <Col span={18} style={{ textAlign:'center' }} >
          {!isLoadingAccount && address && yourTCBalance > 0 && <MyCertificates data={certificates} />}
          {isLoadingAccount && !address && <ConnectButton />}
        </Col>
      </Row>
    </>
  )
}

export default Offsets
