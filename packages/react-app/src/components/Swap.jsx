/* eslint-disable max-lines */
/* eslint-disable max-lines-per-function */
import React, { useEffect, useState } from 'react'
import { RetweetOutlined, SettingOutlined } from '@ant-design/icons'
import { ChainId, Fetcher, Percent, Token, TokenAmount, Trade, WETH } from '@uniswap/sdk'
import { abi as IUniswapV2Router02ABI } from '@uniswap/v2-periphery/build/IUniswapV2Router02.json'
import {
  Button,
  Card,
  Descriptions,
  Divider,
  Drawer,
  InputNumber,
  Modal,
  notification,
  Row,
  Select,
  Space,
  Tooltip,
  Typography,
} from 'antd'
import { useBlockNumber, usePoller } from 'eth-hooks'
import { ethers } from 'ethers'

import { useDebounce } from '../hooks'

const { Option } = Select
const { Text } = Typography
const { utils, BigNumber } = require('ethers')
const qs = require('qs')

// export const ROUTER_ADDRESS = '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D'
export const ROUTER_ADDRESS = '0xdef1c0ded9bec7f1a1670819833240f027b25eff'

export const ZERO_EX_ADDRESS = '0xdef1c0ded9bec7f1a1670819833240f027b25eff'

export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'

const erc20Abi = [
  'function balanceOf(address owner) view returns (uint256)',
  'function approve(address _spender, uint256 _value) public returns (bool success)',
  'function allowance(address _owner, address _spender) public view returns (uint256 remaining)',
]

const makeCall = async (callName, contract, args, metadata = {}) => {
  if (contract[callName]) {
    let result

    if (args) result = await contract[callName](...args, metadata)
    else result = await contract[callName]()

    return result
  }
  console.log('no call of that name!')

  return undefined
}

const defaultToken = 'WETH'
const defaultTokenOut = 'NCT'
const defaultSlippage = '0.5'
const defaultTimeLimit = 60 * 10

const tokenListToObject = array =>
  array.reduce((obj, item) => {
    obj[item.symbol] = new Token(item.chainId, item.address, item.decimals, item.symbol, item.name)

    return obj
  }, {})

function Swap({ selectedProvider, tokenList, tx, address }) {
  const [tokenIn, setTokenIn] = useState(defaultToken)
  const [tokenOut, setTokenOut] = useState(defaultTokenOut)
  const [exact, setExact] = useState()
  const [amountIn, setAmountIn] = useState()
  const [amountInMax, setAmountInMax] = useState()
  const [amountOut, setAmountOut] = useState()
  const [amountOutMin, setAmountOutMin] = useState()
  const [trades, setTrades] = useState()
  const [routerAllowance, setRouterAllowance] = useState()
  const [balanceIn, setBalanceIn] = useState()
  const [balanceOut, setBalanceOut] = useState()
  const [slippageTolerance, setSlippageTolerance] = useState()
  const [timeLimit, setTimeLimit] = useState(defaultTimeLimit)
  const [swapping, setSwapping] = useState(false)
  const [approving, setApproving] = useState(false)
  const [settingsVisible, setSettingsVisible] = useState(false)
  const [swapModalVisible, setSwapModalVisible] = useState(false)
  const [rawPrice, setRawPrice] = useState()
  const [zeroXError, setZeroXError] = useState()

  // const [tokenList, setTokenList] = useState([])
  const [tokens, setTokens] = useState()
  const [invertPrice, setInvertPrice] = useState(false)

  const blockNumber = useBlockNumber(selectedProvider, 3000)

  const signer = selectedProvider.getSigner()
  const routerContract = new ethers.Contract(ROUTER_ADDRESS, IUniswapV2Router02ABI, signer)

  // const _tokenListUri = tokenListURI || 'https://gateway.ipfs.io/ipns/tokens.uniswap.org'

  const debouncedAmountIn = useDebounce(amountIn, 500)
  const debouncedAmountOut = useDebounce(amountOut, 500)

  const activeChainId = 137 // process.env.REACT_APP_NETWORK === 'kovan' ? ChainId.KOVAN : ChainId.MAINNET

  useEffect(() => {
    const getTokenList = () => {
        const _tokens = tokenListToObject(tokenList)

        setTokens(_tokens)
    }

    getTokenList()
  }, [tokenList, activeChainId])

  const getTrades = async () => {
    if (tokenIn && tokenOut && (amountIn || amountOut)) {
      console.log(tokenIn, tokenOut, amountOut, amountIn, slippageTolerance)

      const _params = {
        buyToken: tokens[tokenOut].address,
        sellToken: tokens[tokenIn].address,
        takerAddres: address,
        feeRecipient: '0x4218A70C7197CA24e171d5aB71Add06a48185f6a',
        buyTokenPercentageFee: '0.02',
      }

      exact === 'out' ?
        _params.buyAmount = ethers.utils.parseUnits(`${amountOut}`,tokens[tokenOut].decimals).toString()
        :
        _params.sellAmount = ethers.utils.parseUnits(`${amountIn}`,tokens[tokenIn].decimals).toString()

      if(slippageTolerance) _params.slippagePercentage = slippageTolerance

      try{
        const response = await fetch(
          `https://polygon.api.0x.org/swap/v1/price?${qs.stringify(_params)}`,
        )
        const tokdata = await response.json()

        if(tokdata.code === 100) {
          let errorMsg = ''

          tokdata.validationErrors.forEach(error => {
            errorMsg+=` ${error.reason} |`
          })
          setZeroXError(`ERROR: |${errorMsg}`)
        } else
          if (exact === 'in') {
            setAmountInMax()
            setAmountOut(Number(ethers.utils.formatUnits(tokdata.buyAmount,tokens[tokenOut].decimals)).toFixed(6))
            setRawPrice(Number(tokdata.price).toFixed(6))
          } else if (exact === 'out') {
            setAmountOutMin()
            setAmountIn(Number(ethers.utils.formatUnits(tokdata.sellAmount,tokens[tokenIn].decimals)).toFixed(6))
            setRawPrice(Number(1/tokdata.price).toFixed(6))
          }

          console.log(tokdata)
      } catch(e) {
        console.log('Error while trying to get a 0x quote: ',e)
      }
    }
  }

  useEffect(() => {
    getTrades()
    // eslint-disable-next-line
  }, [tokenIn, tokenOut, debouncedAmountIn, debouncedAmountOut, slippageTolerance, selectedProvider])

  useEffect(() => {
    if (trades && trades[0])
      if (exact === 'in') setAmountOutMin(trades[0].minimumAmountOut(slippageTolerance))
      else if (exact === 'out') setAmountInMax(trades[0].maximumAmountIn(slippageTolerance))
  }, [slippageTolerance, amountIn, amountOut, trades, exact])

  const getBalance = async (_token, _account, _contract) => {
    let newBalance

    if (_token === 'ETH') newBalance = await selectedProvider.getBalance(_account)
    else newBalance = await makeCall('balanceOf', _contract, [_account])

    return newBalance
  }

  const getAccountInfo = async () => {
    if (tokens) {
      const accountList = await selectedProvider.listAccounts()

      if (tokenIn) {
        const tempContractIn = new ethers.Contract(tokens[tokenIn].address, erc20Abi, selectedProvider)
        const newBalanceIn = await getBalance(tokenIn, accountList[0], tempContractIn)

        setBalanceIn(newBalanceIn)

        let allowance

        if (tokenIn === 'ETH') setRouterAllowance()
        else {
          allowance = await makeCall('allowance', tempContractIn, [accountList[0], ROUTER_ADDRESS])
          setRouterAllowance(allowance)
        }
      }

      if (tokenOut) {
        const tempContractOut = new ethers.Contract(tokens[tokenOut].address, erc20Abi, selectedProvider)
        const newBalanceOut = await getBalance(tokenOut, accountList[0], tempContractOut)

        setBalanceOut(newBalanceOut)
      }
    }
  }

  usePoller(getAccountInfo, 6000)

  const route = trades
    ? trades.length > 0
      ? trades[0].route.path.map(item => {
          return item.symbol
        })
      : []
    : []

  const updateRouterAllowance = async newAllowance => {
    setApproving(true)

    try {
      const tempContract = new ethers.Contract(tokens[tokenIn].address, erc20Abi, signer)
      const result = await makeCall('approve', tempContract, [ROUTER_ADDRESS, newAllowance])

      console.log(result)
      setApproving(false)

      return true
    } catch (e) {
      notification.open({
        message: 'Approval unsuccessful',
        description: `Error: ${e.message}`,
      })
    }
  }

  const approveRouter = async () => {
    const approvalAmount =
      exact === 'in'
        ? ethers.utils.hexlify(ethers.utils.parseUnits(amountIn.toString(), tokens[tokenIn].decimals))
        : amountInMax.raw.toString()

    console.log(approvalAmount)

    const approval = updateRouterAllowance(approvalAmount)

    if (approval)
      notification.open({
        message: 'Token transfer approved',
        description: `You can now swap up to ${amountIn} ${tokenIn}`,
      })
  }

  const removeRouterAllowance = async () => {
    const approvalAmount = ethers.utils.hexlify(0)

    console.log(approvalAmount)

    const removal = updateRouterAllowance(approvalAmount)

    if (removal)
      notification.open({
        message: 'Token approval removed',
        description: `The router is no longer approved for ${tokenIn}`,
      })
  }

  const executeSwap = async () => {
    setSwapping(true)

    const accountList = await selectedProvider.listAccounts()
    const address = accountList[0]

    const _params = {
      buyToken: tokens[tokenOut].address,
      sellToken: tokens[tokenIn].address,
      takerAddres: address,
      feeRecipient: '0x4218A70C7197CA24e171d5aB71Add06a48185f6a',
      buyTokenPercentageFee: '0.02',
    }

    exact === 'out' ?
      _params.buyAmount = ethers.utils.parseUnits(`${amountOut}`,tokens[tokenOut].decimals).toString()
      :
      _params.sellAmount = ethers.utils.parseUnits(`${amountIn}`,tokens[tokenIn].decimals).toString()

    if(slippageTolerance) _params.slippagePercentage = slippageTolerance

    console.log(`https://polygon.api.0x.org/swap/v1/quote?${qs.stringify(_params)}`)

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
        setSwapping(false)
        notification.open({
          message: 'Swap unsuccessful',
          description: `Error: ${errorMsg}`,
        })
      } else{
        console.log(tokdata)

        const newTx = {
          to: ZERO_EX_ADDRESS,
          data: tokdata.data,
          value: Number(tokdata.value),
          from: address,
          gasPrice: Number(utils.parseUnits(tokdata.gasPrice,'wei')),
          gasLimit: Number(utils.parseUnits(tokdata.gas,'wei')),

        }

        console.log(newTx)
// https://polygon.api.0x.org/swap/v1/quote?buyToken=0x2F800Db0fdb5223b3C3f354886d907A671414A7F&sellToken=0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619&takerAddres=0x40f9bf922c23c43acdad71Ab4425280C0ffBD697&feeRecipient=0x4218A70C7197CA24e171d5aB71Add06a48185f6a&buyTokenPercentageFee=0.02&buyAmount=1000000000000000000

        // const result = { hash:'hash' }
       const result = await tx(newTx)

        console.log('this is the', newTx)

        notification.open({
          message: 'Swap complete 🌳',
          description: (
            <>
              <Text>{`Swapped ${tokenIn} for ${tokenOut}, transaction: `}</Text>

            </>
          ),
        })
        setSwapping(false)
      }
    } catch(e) {
      console.log('Error while executing swap: ',e)
      setSwapping(false)
      notification.open({
        message: 'Swap unsuccessful',
        description: `Error: ${e.message}`,
      })
    }
  }

  const showSwapModal = () => {
    setSwapModalVisible(true)
  }

  const handleSwapModalOk = () => {
    setSwapModalVisible(false)
    executeSwap()
  }

  const handleSwapModalCancel = () => {
    setSwapModalVisible(false)
  }

  const insufficientBalance = balanceIn
    ? parseFloat(ethers.utils.formatUnits(balanceIn, tokens[tokenIn].decimals)) < amountIn
    : null
  const inputIsToken = tokenIn !== 'ETH'
  const insufficientAllowance = !inputIsToken
    ? false
    : routerAllowance
    ? parseFloat(ethers.utils.formatUnits(routerAllowance, tokens[tokenIn].decimals)) < amountIn
    : null
  const formattedBalanceIn = balanceIn
    ? parseFloat(ethers.utils.formatUnits(balanceIn, tokens[tokenIn].decimals)).toPrecision(6)
    : null
  const formattedBalanceOut = balanceOut
    ? parseFloat(ethers.utils.formatUnits(balanceOut, tokens[tokenOut].decimals)).toPrecision(6)
    : null

  const metaIn =
    tokens && tokenList && tokenIn
      ? tokenList.filter(t => {
          return t.address === tokens[tokenIn].address
        })[0]
      : null
  const metaOut =
    tokens && tokenList && tokenOut
      ? tokenList.filter(t => {
          return t.address === tokens[tokenOut].address
        })[0]
      : null

  const cleanIpfsURI = uri => {
    try {
      return uri.replace('ipfs://', 'https://ipfs.io/ipfs/')
    } catch (e) {
      console.log(e, uri)

      return uri
    }
  }

  const logoIn = metaIn ? metaIn.logoURI : null
  const logoOut = metaOut ? metaOut.logoURI : null

  // const rawPrice = trades && trades[0] ? trades[0].executionPrice : null
  const price = rawPrice ? rawPrice : null
  const priceDescription = rawPrice
    ? invertPrice
      ? `${(1/rawPrice).toFixed(6)} ${tokenIn} per ${tokenOut}`
      : `${price} ${tokenOut} per ${tokenIn}`
    : null

  const priceWidget = (
    <Space>
      <Text type="secondary">{priceDescription}</Text>
      <Button
        type="text"
        onClick={() => {
          setInvertPrice(!invertPrice)
        }}
      >
        <RetweetOutlined />
      </Button>
    </Space>
  )

  const swapModal = (
    <Modal
      title="Confirm swap"
      visible={swapModalVisible}
      // onOk={handleSwapModalOk}
      // onCancel={handleSwapModalCancel}
      footer={[
        <Button
          key='cancel'
          onClick={handleSwapModalCancel}
        >
          Cancel
        </Button>,
        <Button
          key='ok'
          onClick={handleSwapModalOk}
        >
          Confirm with your Wallet
        </Button>,
      ]}>
      <Row>
        <Space>
          <img src={logoIn} alt={tokenIn} width="30" />
          {amountIn}
          {tokenIn}
        </Space>
      </Row>
      <Row justify="center" align="middle" style={{ width: 30 }}>
        <span>↓</span>
      </Row>
      <Row>
        <Space>
          <img src={logoOut} alt={tokenOut} width="30" />
          {amountOut}
          {tokenOut}
        </Space>
      </Row>
      <Divider />
      <Row>{priceWidget}</Row>
      <Row>
        {trades && ((amountOutMin && exact === 'in') || (amountInMax && exact === 'out'))
          ? exact === 'in'
            ? `Output is estimated. You will receive at least ${amountOutMin.toSignificant(
                6,
              )} ${tokenOut} or the transaction will revert.`
            : `Input is estimated. You will sell at most ${amountInMax.toSignificant(
                6,
              )} ${tokenIn} or the transaction will revert.`
          : null}
      </Row>
    </Modal>
  )

  return (
    <Card
      title={
        <Space>
          <img src="./icon/koywenft.png" width="40" alt="uniswapLogo" />
          <Typography>Koywe Swapper</Typography>
        </Space>
      }
      extra={
        <Button
          type="text"
          onClick={() => {
            setSettingsVisible(true)
          }}
        >
          <small>powered by 0x</small> <SettingOutlined />
        </Button>
      }
    >
      <Space direction="vertical">
        <Row justify="center" align="middle">
          <Card
            size="small"
            type="inner"
            title={`From${exact === 'out' && tokenIn && tokenOut ? ' (estimate)' : ''}`}
            extra={
              <>
                <img src={logoIn} alt={tokenIn} width="30" />
                <Button
                  type="link"
                  onClick={() => {
                    setAmountOut()
                    setAmountIn(ethers.utils.formatUnits(balanceIn, tokens[tokenIn].decimals))
                    setAmountOutMin()
                    setAmountInMax()
                    setExact('in')
                  }}
                >
                  {formattedBalanceIn}
                </Button>
              </>
            }
            style={{ width: 400, textAlign: 'left' }}
          >
            <InputNumber
              style={{ width: '160px' }}
              min={0}
              size="large"
              value={amountIn}
              onChange={e => {
                setAmountOut()
                setTrades()
                setAmountIn(e)
                setExact('in')
              }}
            />
            <Select
              showSearch
              value={tokenIn}
              style={{ width: '120px' }}
              size="large"
              bordered={false}
              defaultValue={defaultToken}
              onChange={value => {
                console.log(value)

                if (value === tokenOut) {
                  console.log('switch!', tokenIn)
                  setTokenOut(tokenIn)
                  setAmountOut(amountIn)
                  setBalanceOut(balanceIn)
                }
                setTokenIn(value)
                setTrades()
                setAmountIn()
                setExact('out')
                setBalanceIn()
              }}
              filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              optionFilterProp="children"
            >
              {tokenList.map(token => (
                <Option key={token.symbol} value={token.symbol}>
                  {token.symbol}
                </Option>
              ))}
            </Select>
          </Card>
        </Row>
        <Row justify="center" align="middle">
          <Tooltip title={route.join('->')}>
            <span>↓</span>
          </Tooltip>
        </Row>
        <Row justify="center" align="middle">
          <Card
            size="small"
            type="inner"
            title={`To${exact === 'in' && tokenIn && tokenOut ? ' (estimate)' : ''}`}
            extra={
              <>
                <img src={logoOut} width="30" alt={tokenOut} />
                <Button type="text">{formattedBalanceOut}</Button>
              </>
            }
            style={{ width: 400, textAlign: 'left' }}
          >
            <InputNumber
              style={{ width: '160px' }}
              size="large"
              min={0}
              value={amountOut}
              onChange={e => {
                setAmountOut(e)
                setAmountIn()
                setTrades()
                setExact('out')
              }}
            />
            <Select
              showSearch
              value={tokenOut}
              style={{ width: '120px' }}
              size="large"
              bordered={false}
              onChange={value => {
                console.log(value, tokenIn, tokenOut)

                if (value === tokenIn) {
                  console.log('switch!', tokenOut)
                  setTokenIn(tokenOut)
                  setAmountIn(amountOut)
                  setBalanceIn(balanceOut)
                }
                setTokenOut(value)
                setExact('in')
                setAmountOut()
                setTrades()
                setBalanceOut()
              }}
              filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              optionFilterProp="children"
            >
              {tokenList.map(token => (
                <Option key={token.symbol} value={token.symbol}>
                  {token.symbol}
                </Option>
              ))}
            </Select>
          </Card>
        </Row>
        <Row justify="center" align="middle">
          {priceDescription ? priceWidget : null}
        </Row>
        <Row justify="center" align="middle">
          <Space>
            {inputIsToken ? (
              <Button size="large" loading={approving} disabled={!insufficientAllowance} onClick={approveRouter}>
                {!insufficientAllowance && amountIn && amountOut ? 'Approved' : 'Approve'}
              </Button>
            ) : null}
            <Button
              size="large"
              loading={swapping}
              disabled={insufficientAllowance || insufficientBalance || !amountIn || !amountOut}
              onClick={showSwapModal}
            >
              {insufficientBalance ? 'Insufficient balance' : 'Swap!'}
            </Button>
            {swapModal}
          </Space>
        </Row>
      </Space>
      <Drawer
        visible={settingsVisible}
        onClose={() => {
          setSettingsVisible(false)
        }}
        width={500}
      >
        <Descriptions title="Details" column={1} style={{ textAlign: 'left' }}>
          <Descriptions.Item label="blockNumber">{blockNumber}</Descriptions.Item>
          <Descriptions.Item label="routerAllowance">
            <Space>
              {routerAllowance ? ethers.utils.formatUnits(routerAllowance, tokens[tokenIn].decimals) : null}
              {routerAllowance > 0 ? <Button onClick={removeRouterAllowance}>Remove Allowance</Button> : null}
            </Space>
          </Descriptions.Item>
          <Descriptions.Item label="route">{route.join('->')}</Descriptions.Item>
          <Descriptions.Item label="exact">{exact}</Descriptions.Item>
          <Descriptions.Item label="bestPrice">
            {trades ? (trades.length > 0 ? trades[0].executionPrice.toSignificant(6) : null) : null}
          </Descriptions.Item>
          <Descriptions.Item label="nextMidPrice">
            {trades ? (trades.length > 0 ? trades[0].nextMidPrice.toSignificant(6) : null) : null}
          </Descriptions.Item>
          <Descriptions.Item label="priceImpact">
            {trades ? (trades.length > 0 ? trades[0].priceImpact.toSignificant(6) : null) : null}
          </Descriptions.Item>
          <Descriptions.Item label="slippageTolerance">
            <InputNumber
              defaultValue={defaultSlippage}
              min={0}
              max={100}
              precision={2}
              formatter={value => `${value}%`}
              parser={value => value.replace('%', '')}
              onChange={value => {
                console.log(value)

                // const slippagePercent = new Percent(Math.round(value * 100).toString(), '10000')

                setSlippageTolerance(value)
              }}
            />
          </Descriptions.Item>
          <Descriptions.Item label="amountInMax">{amountInMax ? amountInMax.toExact() : null}</Descriptions.Item>
          <Descriptions.Item label="amountOutMin">{amountOutMin ? amountOutMin.toExact() : null}</Descriptions.Item>
          <Descriptions.Item label="timeLimitInSeconds">
            <InputNumber
              min={0}
              max={3600}
              defaultValue={defaultTimeLimit}
              onChange={value => {
                console.log(value)
                setTimeLimit(value)
              }}
            />
          </Descriptions.Item>
        </Descriptions>
      </Drawer>
    </Card>
  )
}

export default Swap
