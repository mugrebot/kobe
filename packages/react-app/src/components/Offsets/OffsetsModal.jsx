/* eslint-disable max-lines */
/* eslint-disable max-lines-per-function */
import React, { useEffect, useState } from 'react'
import { LoadingOutlined } from '@ant-design/icons'
import { Button, Card, Image, Input, Modal, Row, Table, Tooltip } from 'antd'
import { useContractReader } from 'eth-hooks'
import styled from 'styled-components'

import sushiTokenList from '../../sushiTL.json'
import { StyledButton } from '../common/StyledButton'

const { utils } = require('ethers')
const StyledTable = styled(Table)`
  border: 1px solid rgba(0, 0, 0, 0.16);
  border-radius: 10px;
  overflow: hidden;
  width: 100%;
`

export default function OffsetsModal({ symbol, tcoContract, writeContracts, contracts, tx, modalUp, handleModalDown, address, USDPrices }) {
  const [token, setToken] = useState()
  const [quoting,setQuoting] = useState(false)
  const [approving, setApproving] = useState()
  const [buying, setBuying] = useState()
  const [inputAmount, setInputAmount] = useState()
  const [name, setName] = useState()
  const [beneficiaryAddress, setBeneficiaryAddress] = useState()
  const [beneficiaryString, setBeneficiaryString] = useState()
  const [retirementMessage, setRetirementMessage] = useState()

  const handleApproveTokens = async () => {
    setApproving(true)
    // await tx(writeContracts.WETH.approve(issuerAddress, buyWethAmount && utils.parseEther(buyWethAmount)))
    setApproving(false)
  }

  const handleWETHQuotes = async _indexAmount => {
    setQuoting(true)
    setQuoting(false)
  }

  const handleRetirement = async () => {
    setBuying(true)

    if(token)
      await tx(writeContracts[symbol].redeemAuto(inputAmount && utils.parseEther(inputAmount)))
    else {
      const tcoWriteContract = writeContracts.TCO2FACTORY.attach(tcoContract)

      await tx(tcoWriteContract.retireAndMintCertificate(
        name || 'Retirement via Koywe',
        beneficiaryAddress || '0x0000000000000000000000000000000000000000',
        beneficiaryString || `${address} retirement`,
        `${retirementMessage} (via Koywe)` || 'Retirement via Kowye',
        inputAmount&&utils.parseEther(inputAmount)))
    }
    setBuying(false)
    handleModalDown()
    setInputAmount(null)
  }

  // TODO: Get certificate context from projects. From the certificate contract, call getUserEvents to get all certificates associated to address, then call 'retirements' using the eventid to get the projectVintageTokenId

  useEffect(() => {
    const getToken = () => {
      setToken(sushiTokenList.find(t => {
        return t.symbol === symbol
      }))
    }

    getToken()
  }, [symbol])

  return (
    <div>
      <Modal title={token && `Redeem ${token.symbol}` || `Retire ${symbol}`}
        visible={modalUp === true}
        onCancel={() => {
          handleModalDown()
          setInputAmount(null)
          setName(null)
          setBeneficiaryAddress(null)
          setBeneficiaryString(null)
          setRetirementMessage(null)
        }}
        footer={[
          <Button
            key='back'
            onClick={() => {
              handleModalDown()
              setInputAmount(null)
              setName(null)
              setBeneficiaryAddress(null)
              setBeneficiaryString(null)
              setRetirementMessage(null)
            }}
          >
            Close
          </Button>,
        ]}>
          <Row justify="center" align="middle">
            {token && `Select the amount of ${token.symbol} tokens you want to redeem. Each token represents one (1) CO2 ton and you will get a specific project's carbon credit.`
            || `How many of your ${symbol} do you want to retire?`}
            <br />
            You will have to approve a MetaMask transaction interacting with the {symbol} contract.
          </Row>
          <Row justify="center" align="middle">
            <Card
              size="small"
              type="inner"
              title={token && `${symbol} Tokens to Redeem` || `Tokens to Retire`}
              style={{ width: 400, textAlign: 'left' }}
            >
              <Input
                addonBefore={'Amount'}
                style={{ textAlign: 'center' }}
                placeholder={'tokens to redeem'}
                value={inputAmount}
                onChange={e => {
                  setInputAmount(e.target.value)
                }}
              />
              {!token && <><Input
                addonBefore={'Name'}
                style={{ textAlign: 'center' }}
                placeholder={'your name or organization (optional)'}
                value={name}
                onChange={e => {
                  setName(e.target.value)
                }}
              />
              <Input
                addonBefore={'Ben. Address'}
                style={{ textAlign: 'center' }}
                placeholder={'beneficiary address (option)'}
                value={beneficiaryAddress}
                onChange={e => {
                  setBeneficiaryAddress(e.target.value)
                }}
              />
              <Input
                addonBefore={'Ben. Name'}
                style={{ textAlign: 'center' }}
                placeholder={'beneficiary name or organization (optional)'}
                value={beneficiaryString}
                onChange={e => {
                  setBeneficiaryString(e.target.value)
                }}
              />
              <Input
                addonBefore={'Message'}
                style={{ textAlign: 'center' }}
                placeholder={'retirement message'}
                value={retirementMessage}
                onChange={e => {
                  setRetirementMessage(e.target.value)
                }}
              /></>}
              {/* <StyledTable columns={columns} dataSource={setPositions} pagination={false} showHeader={false} /> */}
            </Card>
          </Row>
          <Row justify="center" align="middle">
            <span>↓</span>
          </Row>
          <Row justify="center" align="middle">
            <Card
              size="small"
              type="inner"
              title={`Output:`}
              extra={!token && inputAmount < 1 && 'You must retire at least 1 TCO2' || buying && <LoadingOutlined />}
              style={{ width: 400, textAlign: 'left' }}
            >
              <Input.Group compact>
                <Input
                  style={{ textAlign: 'center', width: token && '50%' || '100%' }}
                  placeholder={'CO2 Tons'}
                  value={inputAmount}
                  disabled
                />
                {token && <Input
                  style={{ textAlign: 'center', width: '50%' }}
                  placeholder={'Value in USD'}
                  value={token && inputAmount && USDPrices[token.coingeckoId] && USDPrices[token.coingeckoId].usd && `$${(inputAmount * USDPrices[token.coingeckoId].usd).toFixed(2)}`}
                  disabled
                />}
              </Input.Group>
            </Card>
            <br />
            <StyledButton loading={buying} $type="primary" onClick={handleRetirement} disabled={!token && inputAmount < 1} >
              {token && `Redeem ${symbol}` || `Retire ${symbol}`}
            </StyledButton>
          </Row>
      </Modal>
    </div>
  )
}
