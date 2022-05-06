/* eslint-disable max-lines */
/* eslint-disable max-lines-per-function */
import React, { useEffect, useState } from 'react'
import { LoadingOutlined } from '@ant-design/icons'
import { Button, Card, Image, Input, Modal, Row, Table, Tooltip } from 'antd'
import { useContractReader, useUserProviderAndSigner } from 'eth-hooks'
import { parseBytes32String } from 'ethers/lib/utils'
import styled from 'styled-components'


const Web3 = require('web3')


import sushiTokenList from '../../sushiTL.json'
import { StyledButton } from '../common/StyledButton'

const { utils, toFixed, BigNumber, Signer, ethers } = require('ethers')
const qs = require('qs')

const StyledTable = styled(Table)`
  border: 1px solid rgba(0, 0, 0, 0.16);
  border-radius: 10px;
  overflow: hidden;
  width: 100%;
`
const ZERO_EX_ADDRESS = '0xdef1c0ded9bec7f1a1670819833240f027b25eff'



// TODO: Add prices to preview. Add option to get new quotes from 0x after some time has gone or do it automatically
export default function SwapSetModal({ writeContracts, contracts, tx, modalUp, handleModalDown, setDetails, address, set, gasPrice, USDPrices, wethBalance }) {
  const tokenTexts = {
    'MCO2' : {
      address: '0xAa7DbD1598251f856C12f63557A4C4397c253Cea',
      symbol: 'MCO2',
      description: 'Moss Certified CO2 Token. Each token represents the offset of 1 CO2e ton.',
      tokensetsURL: 'https://moss.earth',
    },
    'CBTC' : {
      address: '0x7958e9fa5cf56aebedd820df4299e733f7e8e5dd',
      symbol: 'CBTC',
      description: 'Clean Bitcoin lets you invest in the greatest store of value of our time, net-zero! The 1% of NCT tokens assures, at current prices, 38 years of green BTC hodling.',
      tokensetsURL: 'https://www.tokensets.com/v2/set/polygon/0x7958e9fa5cf56aebedd820df4299e733f7e8e5dd',
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

  const issuerAddress = ZERO_EX_ADDRESS
  const issuerApproval = useContractReader(contracts, 'WETH', 'allowance', [address, issuerAddress])

  const wethAddress = contracts?.WETH?.address

  const handleApproveTokens = async () => {
    setApproving(true)
    await tx(writeContracts.WETH.approve(issuerAddress, buyWethAmount && utils.parseEther(buyWethAmount)))
    setApproving(false)
  }

  const tokenDetails0x = []

  //   if(setDetails && !isNaN(Number(_indexAmount)) && Number(_indexAmount) > 0) {
         useEffect(() => {
             const getTokenData = async () => {
               const response = await fetch(
                `https://polygon.api.0x.org/swap/v1/quote?${qs.stringify(params)}`,
               )
               const tokdata = await response.json()

               setResponse(tokdata)

               console.log(tokenTexts.MCO2.address)
               console.log(`https://polygon.api.0x.org/swap/v1/quote?${qs.stringify(params)}`)


                tokenDetails0x.push ({
                    data: tokdata.data,
                    priceofEth: tokdata.price,
                    tokTo: tokdata.to,
                    value: tokdata.value,
                    gas: tokdata.gas,
                    _gasprice: tokdata.gasPrice,

                })





                console.log(tokdata)
                console.log(tokenDetails0x)

             }

             getTokenData()
           }, [])

  const handleWETHQuotes = async _indexAmount => {
    setQuoting(true)
    setIndexAmount(_indexAmount)




if(tokenDetails0x && !isNaN(Number(_indexAmount)) && Number(_indexAmount) > 0) {
      for(const token of tokenDetails0x) {
        const tokenDecimals = await set.erc20.getDecimalsAsync(tokenDetails0x.buyTokenAddress)

        console.log(tokenDecimals)


      }

     // const quotes = await set.utils.batchFetchSwapQuoteAsync(tokenDetails0x,true,tokenTexts[setDetails.symbol].address,set.setToken,gasPrice)

      setTradeQuotes(tokenDetails0x.data)

      let totalWeth = 0

      for(const quote of _indexAmount)
        // const slippage = isNaN(parseFloat(quote.slippagePercentage)) ? 0 : parseFloat(quote.slippagePercentage)/100
       totalWeth += Number(_indexAmount) * (1 + 0.03) // adding 3% worked better than the 0x slippage... TODO: a better way to calculate this

      setBuyWethAmount(totalWeth.toFixed(18))
    } else {
      setBuyWethAmount(null)
      setTradeQuotes([])
    }
    setQuoting(false)
  }

  const params = {

    buyToken: `${tokenTexts.MCO2.address}`,
    sellToken: `0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619`,
    sellAmount: `${indexAmount * 10**18}`,
    slippagePercentage: '0.03',
    feeRecipient: '0x4218A70C7197CA24e171d5aB71Add06a48185f6a',
    buyTokenPercentageFee: '0.02',

  }



     const handleIssuance = async () => {
      setBuying(true)// issueExactSetFromToken
      console.log(gasPrice)

      const newTx = {
        from: address,
        to: ZERO_EX_ADDRESS,
        data: _response.data,
      }

      console.log(newTx)

      await tx(newTx)
      setBuying(false)
    }





  useEffect(() => {
    const buyWethAmountBN = buyWethAmount && utils.parseEther(`${buyWethAmount}`)

    if (issuerApproval && buyWethAmountBN) setIsWethApproved(issuerApproval.gte(buyWethAmountBN))
  }, [buyWethAmount, issuerApproval])

  return (
    <div>
      <Modal title={`Buy ${tokenDetails0x.MCO2 && tokenDetails0x.MCO2.symbol}`}
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
            {tokenDetails0x.MCO2 && tokenDetails0x.MCO2.description}
          </Row>
          <Row justify="center" align="middle">
            <Card
              size="small"
              type="inner"
              title={`${tokenDetails0x.MCO2 && tokenDetails0x.MCO2.symbol} tokens to issue:`}
              style={{ width: 400, textAlign: 'left' }}
            >
              <Input
                style={{ textAlign: 'center' }}
                placeholder={'shares of the index to issue'}
                value={indexAmount}
                onChange={e => {
                  handleWETHQuotes(e.target.value)
                }}
              />
              <StyledTable columns={columns} dataSource={tokenDetails0x.MCO2} pagination={false} showHeader={false} />
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
              extra={wethFormated < buyWethAmount && 'Not Enough WETH Balance' || quoting && <LoadingOutlined />}
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
                  value={buyWethAmount && `$${(buyWethAmount*USDPrices?.weth?.usd).toFixed(2)}`}
                  disabled
                />
              </Input.Group>
            </Card>
            <br />
            <StyledButton loading={approving} $type="primary" disabled={isWethApproved || !buyWethAmount} onClick={handleApproveTokens}>
              Approve WETH
            </StyledButton>
            <StyledButton loading={buying} $type="primary" disabled={!isWethApproved || !buyWethAmount || wethFormated < buyWethAmount} onClick={handleIssuance}>
              Issue Index Tokens
            </StyledButton>
          </Row>
      </Modal>
    </div>
  )
}
