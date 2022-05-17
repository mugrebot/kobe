/* eslint-disable max-lines */
/* eslint-disable max-lines-per-function */
import React, { useEffect, useState } from 'react'
import { LoadingOutlined } from '@ant-design/icons'
import { Button, Card, Image, Input, Modal, Row, Table, Tooltip } from 'antd'
import { useContractReader } from 'eth-hooks'
import styled from 'styled-components'

import sushiTokenList from '../../sushiTL.json'
import { StyledButton } from '../common/StyledButton'

const { utils, BigNumber } = require('ethers')
const qs = require('qs')

const StyledTable = styled(Table)`
  border: 1px solid rgba(0, 0, 0, 0.16);
  border-radius: 10px;
  overflow: hidden;
  width: 100%;
`
const ZERO_EX_ADDRESS = '0xdef1c0ded9bec7f1a1670819833240f027b25eff'

// TODO: Add prices to preview. Add option to get new quotes from 0x after some time has gone or do it automatically
export default function SwapModal({ writeContracts, contracts, tx, modalUp, handleModalDown, symbol, address, USDPrices, wethBalance, setDetails }) {
  const tokenTexts = {
    'MCO2' : {
      address: '0xAa7DbD1598251f856C12f63557A4C4397c253Cea',
      symbol: 'MCO2',
      description: 'Moss Certified CO2 Token. Each token represents the offset of 1 CO2e ton.',
      tokensetsURL: 'https://moss.earth',
    },
    'BCT' : {
      address: '0x2F800Db0fdb5223b3C3f354886d907A671414A7F',
      symbol: 'BCT',
      description: 'Base Carbon Ton: Toucan credits bridged to blockchain on Polygon. Each token represents the offset of 1 CO2e ton.',
      tokensetsURL: 'https://toucan.earth',
    },
    'NCT' : {
      address: '0xD838290e877E0188a4A44700463419ED96c16107',
      symbol: 'NCT',
      description: 'Nature Carbon Ton: Toucan premium credits bridged to blockchain on Polygon. Each token represents the offset of 1 CO2e ton.',
      tokensetsURL: 'https://toucan.earth',
    },
    'KLIMA' : {
      address: '0x4e78011Ce80ee02d2c3e649Fb657E45898257815',
      symbol: 'KLIMA',
      description: 'Klima DAO Tokens, unstaked on Polygon.',
      tokensetsURL: 'https://www.klimadao.finance',
    },
  }

  const columns = [
    {
      title: 'Logo',
      dataIndex: 'logoURI',
      key: 'logoURI',
      render: text => (
        <Image src={text} preview={false} width={24} height={24} />
      ),
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Position',
      dataIndex: 'position',
      key: 'position',
      render: text => (
        <>{(text * (indexAmount?indexAmount:1)).toFixed(6)}</>
      ),
    },
    {
      title: 'Value',
      dataIndex: 'value',
      key: 'value',
      render: text => (
        <>${(text * (indexAmount?indexAmount:1)).toFixed(2)}</>
      ),
    },
  ]
  const wethFormated = wethBalance && utils.formatUnits(wethBalance, 18)
  const [setPositions,setSetPositions] = useState()
  const [tradeQuotes,setTradeQuotes] = useState()
  const [quoting,setQuoting] = useState(false)
  const [indexAmount,setIndexAmount] = useState()
  const [approving, setApproving] = useState()
  const [buying, setBuying] = useState()
  const [buyWethAmount, setBuyWethAmount] = useState()
  const [isWethApproved, setIsWethApproved] = useState()
  const [_response, setResponse] = useState()
  const [zeroXError, setZeroXError] = useState()
  const [params, setParams] = useState()

  const issuerAddress = ZERO_EX_ADDRESS
  const issuerApproval = useContractReader(contracts, 'WETH', 'allowance', [address, issuerAddress])

  const wethAddress = contracts?.WETH?.address

  const handleApproveTokens = async () => {
    setApproving(true)
    await tx(writeContracts.WETH.approve(issuerAddress, buyWethAmount && utils.parseEther(buyWethAmount)))
    setApproving(false)
  }

  const tokenDetails0x = []

  const handleWETHQuotes = async _indexAmount => {
    setQuoting(true)
    setIndexAmount(_indexAmount)

    if(setDetails && !isNaN(Number(_indexAmount)) && Number(_indexAmount) > 0) {
      const _params = {
        buyToken: tokenTexts[setDetails]?.address,
        buyAmount: `${_indexAmount * 10**18}`,
        sellToken: `WETH`,
        takerAddress: address,
        feeRecipient: '0x4218A70C7197CA24e171d5aB71Add06a48185f6a',
        buyTokenPercentageFee: '0.02',

      }

      try{
        const response = await fetch(
          `https://polygon.api.0x.org/swap/v1/quote?${qs.stringify(_params)}`,
        )
        const tokdata = await response.json()

        if(tokdata.code === 100) {
          let errorMsg = ''


          tokdata.validationErrors.forEach(error => {
            errorMsg+=` ${error.reason} |`
          })
          setZeroXError(`ERROR: |${errorMsg}`)
        } else {
          setResponse(tokdata)
          setTradeQuotes(tokdata.data)
          setBuyWethAmount(utils.formatEther(tokdata.sellAmount))
          setZeroXError(null)
        }
      } catch(e) {
        console.log('Error while trying to get a 0x quote: ',e)
      }
    } else {
      setBuyWethAmount(null)
      setTradeQuotes([])
      setZeroXError(null)
    }
    setQuoting(false)
  }



  useEffect(() => {
    const getSetDetails = async () => {
      if(setDetails) {
        const tokens = setDetails.map(token => {
          const _token = sushiTokenList.find(sushiToken => {


            return sushiToken.address === tokenTexts[token].address
          })



          return {
            key: tokenTexts[token].address,
            logoURI: _token.logoURI,
            position: 1,
            name: _token.name,
            value: USDPrices[_token.coingeckoId].usd,
          }
        })

        setSetPositions(tokens)

      }
    }

    getSetDetails()


  }, [setDetails])

  const handleTrade = async () => {
    setBuying(true)

    const newTx = {
      to: ZERO_EX_ADDRESS,
      data: tradeQuotes,
      value: Number(_response.value),
      from: address,
      gasPrice: Number(utils.parseUnits(_response.gasPrice,'wei')),
      gasLimit: Number(utils.parseUnits(_response.gas,'wei')),
    }

    console.log(newTx)

    await tx(newTx)
    handleModalDown()
    setBuying(false)
  }

  useEffect(() => {
    const buyWethAmountBN = buyWethAmount && utils.parseEther(`${buyWethAmount}`)

    if (issuerApproval && buyWethAmountBN) setIsWethApproved(issuerApproval.gte(buyWethAmountBN))
  }, [buyWethAmount, issuerApproval])

  return (
    <div>
      <Modal title={0}
        visible={modalUp === true}
        onCancel={() => {
          handleModalDown()
          setBuyWethAmount(null)
          setIndexAmount(null)
          setTradeQuotes([])
        }}
        footer={[
          <Button
            key='back'
            onClick={() => {
              handleModalDown()
              setBuyWethAmount(null)
              setIndexAmount(null)
              setTradeQuotes([])
            }}
          >
            Close
          </Button>,
        ]}>
          <Row justify="center" align="middle">
            {setDetails && tokenTexts[setDetails]?.description}
          </Row>
          <Row justify="center" align="middle">
            <Card
              size="small"
              type="inner"
              title={`${setDetails && tokenTexts[setDetails] && tokenTexts[setDetails].symbol} tokens to issue:`}
              style={{ width: 400, textAlign: 'left' }}
            >
              <Input
                style={{ textAlign: 'center' }}
                placeholder={'shares of the token to issue'}
                value={indexAmount}
                onChange={e => {
                  handleWETHQuotes(e.target.value)
                }}
              />
              <StyledTable columns={columns} dataSource={setPositions} pagination={false} showHeader={false} />
            </Card>
          </Row>
          <Row justify="center" align="middle">
            <span>↓</span>
          </Row>
          <Row justify="center" align="middle">
            <Card
              size="small"
              type="inner"
              title={`Paying in WETH (Estimate):`}
              extra={zeroXError || wethFormated < buyWethAmount && 'Not Enough WETH Balance' || quoting && <LoadingOutlined />}
              style={{ width: 400, textAlign: 'left' }}
            >
              <Input.Group compact>
                <Input
                  style={{ textAlign: 'center', width: '50%' }}
                  placeholder={'Cost in WETH'}
                  value={buyWethAmount && (buyWethAmount*1).toFixed(6)}
                  disabled
                />
                <Input
                  style={{ textAlign: 'center', width: '50%' }}
                  placeholder={'Cost in USD'}
                  value={buyWethAmount && `$${(buyWethAmount * USDPrices?.weth?.usd).toFixed(2)}`}
                  disabled
                />
              </Input.Group>
            </Card>
            <br />
            <StyledButton loading={approving} $type="primary" disabled={isWethApproved || !buyWethAmount} onClick={handleApproveTokens}>
              Approve WETH
            </StyledButton>
            <StyledButton loading={buying} $type="primary" disabled={!isWethApproved || !buyWethAmount || wethFormated < buyWethAmount || zeroXError} onClick={handleTrade}>
              Swap WETH for {setDetails && tokenTexts[setDetails]?.symbol}
            </StyledButton>
          </Row>
      </Modal>
    </div>
  )
}
