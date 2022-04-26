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

// TODO: Add prices to preview. Add option to get new quotes from 0x after some time has gone or do it automatically
export default function BuySetModal({ writeContracts, contracts, tx, modalUp, handleModalDown, setName, address, set, gasPrice }) {
  const tokenTexts = {
    'Buy CNBED' : [
      'CNBED',
      'Carbon Negative BED combines the main names in crypto, BTC and ETH, with the best of DeFi, via DeFie Pulse, Carbon Neutral! Using Toucan NCT.',
      'https://www.tokensets.com/v2/set/polygon/0x0765425b334d7db1f374d03f4261ac191172bef7',
      '0x0765425b334d7db1f374d03f4261ac191172bef7',
    ],
    'Buy CBTC' : [
      'CBTC',
      'Clean Bitcoin lets you invest in the greatest store of value of our time, net-zero! The 1% of NCT tokens assures, at current prices, 38 years of green BTC hodling.',
      'https://www.tokensets.com/v2/set/polygon/0x7958e9fa5cf56aebedd820df4299e733f7e8e5dd',
      '0x7958e9fa5cf56aebedd820df4299e733f7e8e5dd',
    ],
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
  ]
  const [setPositions,setSetPositions] = useState()
  const [tradeQuotes,setTradeQuotes] = useState()
  const [quoting,setQuoting] = useState(false)
  const [setDetails,setSetDetails] = useState()
  const [indexAmount,setIndexAmount] = useState()
  const [approving, setApproving] = useState()
  const [buying, setBuying] = useState()
  const [buyWethAmount, setBuyWethAmount] = useState()
  const [isWethApproved, setIsWethApproved] = useState()

  const issuerAddress = contracts?.SETISSUER?.address
  const issuerApproval = useContractReader(contracts, 'WETH', 'allowance', [address, issuerAddress])

  const wethAddress = contracts?.WETH?.address

  const handleApproveTokens = async () => {
    setApproving(true)
    await tx(writeContracts.WETH.approve(issuerAddress, buyWethAmount && utils.parseEther(buyWethAmount)))
    setApproving(false)
  }

  const handleWETHQuotes = async _indexAmount => {
    setQuoting(true)
    setIndexAmount(_indexAmount)

    const _proportions = []

    if(setDetails && !isNaN(Number(_indexAmount)) && Number(_indexAmount) > 0) {
      for(const token of setDetails.positions) {
        const tokenDecimals = await set.erc20.getDecimalsAsync(token.component)

        _proportions.push({
          fromToken: wethAddress,
          toToken: token.component,
          rawAmount: utils.parseUnits(`${(utils.formatUnits(token.unit, tokenDecimals) * _indexAmount).toFixed(tokenDecimals)}`,tokenDecimals).toString(),
          ignore: wethAddress === token.component,
        })
        // console.log((utils.formatUnits(token.unit, tokenDecimals) * _indexAmount))
      }

      // console.log('_proportions',_proportions)

      const quotes = await set.utils.batchFetchSwapQuoteAsync(_proportions,true,tokenTexts[setName][3],set.setToken,gasPrice)

      setTradeQuotes(quotes.map(quote => {
        return quote.calldata
      }))

      let totalWeth = 0

      for(const quote of quotes)
        // const slippage = isNaN(parseFloat(quote.slippagePercentage)) ? 0 : parseFloat(quote.slippagePercentage)/100
        totalWeth += Number(utils.formatEther(quote.fromTokenAmount)) * (1 + 0.03) // adding 3% worked better than the 0x slippage... TODO: a better way to calculate this

      setBuyWethAmount(totalWeth.toFixed(18))

      // console.log('quotes',quotes)
    } else {
      setBuyWethAmount(0)
      setTradeQuotes([])
    }
    setQuoting(false)
  }

  const handleIssuance = async () => {
    setBuying(true)// issueExactSetFromToken
    await tx(writeContracts.SETISSUER.issueExactSetFromToken(
      tokenTexts[setName][3],
      wethAddress,
      indexAmount && utils.parseEther(`${indexAmount}`),
      buyWethAmount && utils.parseEther(`${buyWethAmount}`),
      tradeQuotes,
      '0x38E5462BBE6A72F79606c1A0007468aA4334A92b',
      false,
    ))
    setBuying(false)
  }

  useEffect(() => {
    const getSetDetails = async () => {
      if(set && setName) {
        const details = set && await set.setToken
        .fetchSetDetailsAsync(
          tokenTexts[setName][3],
          ['0x38E5462BBE6A72F79606c1A0007468aA4334A92b'],
          address,
        )

        const tokens = details.positions.map(token => {
          const _token = sushiTokenList.find(sushiToken => {
            return sushiToken.address === token.component
          })

          return {
            key: token.component,
            logoURI: _token.logoURI,
            position: utils.formatUnits(token.unit, _token.decimals),
            name: _token.name,
          }
        })

        setSetPositions(tokens)
        setSetDetails(details)
        // console.log('details',details)
        // console.log('tokens',tokens)
      }
    }

    getSetDetails()
  }, [address, set, setName])

  useEffect(() => {
    const buyWethAmountBN = buyWethAmount && utils.parseEther(`${buyWethAmount}`)

    if (issuerApproval && buyWethAmountBN) setIsWethApproved(issuerApproval.gte(buyWethAmountBN))
  }, [buyWethAmount, issuerApproval])

  return (
    <div>
      <Modal title={setName}
        visible={modalUp === true}
        onCancel={() => {
          handleModalDown()
          setBuyWethAmount(0)
          setTradeQuotes([])
        }}
        footer={[
          <Button
            key='back'
            onClick={() => {
              handleModalDown()
              setBuyWethAmount(0)
              setTradeQuotes([])
            }}
          >
            Close
          </Button>,
        ]}>
          <Row justify="center" align="middle">
            {setName && tokenTexts[setName][1]}
          </Row>
          <Row justify="center" align="middle">
            <Card
              size="small"
              type="inner"
              title={`${setName && tokenTexts[setName][0]} tokens to issue:`}
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
              title={`Paying in WETH:`}
              extra={quoting && <LoadingOutlined />}
              style={{ width: 400, textAlign: 'left' }}
            >
              <Input
                style={{ textAlign: 'center' }}
                placeholder={'Cost in WETH'}
                value={buyWethAmount}
                disabled
              />
            </Card>
            <br />
            {/* <StyledButton href={setName && tokenTexts[setName][2]} target='_blank' $type='primary'>Learn more and buy shares</StyledButton> */}
            <StyledButton loading={approving} $type="primary" disabled={isWethApproved || !buyWethAmount} onClick={handleApproveTokens}>
              Approve WETH
            </StyledButton>
            <StyledButton loading={buying} $type="primary" disabled={!isWethApproved || !buyWethAmount} onClick={handleIssuance}>
              Issue Index Tokens
            </StyledButton>
          </Row>
      </Modal>
    </div>
  )
}
