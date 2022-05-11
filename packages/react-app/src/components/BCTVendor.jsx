/* eslint-disable max-lines-per-function */
import { useEffect, useState } from 'react'
import { Button, Card, Input, Space } from 'antd'
import { useContractReader } from 'eth-hooks'

import { TokenBalance } from '../components'
import Balance from '../components/common/Balance'
import { HOOK_OPTIONS } from '../constants'

const { ethers } = require('ethers')

export default function BCTVendor({ address, readContracts, writeContracts, price, tx }) {
  const tabList = [
    {
      key: 'Buy',
      tab: 'Buy',
    },
    {
      key: 'Sell',
      tab: 'Sell',
    },
  ]
  const [activeTabKey, setActiveTabKey] = useState('Buy')
  const onTabChange = key => {
    setActiveTabKey(key)
  }

  const vendorAddress = readContracts && readContracts.BCTVendor && readContracts.BCTVendor.address

  const vendorTokenBalance = useContractReader(readContracts, 'BCT', 'balanceOf', [vendorAddress], HOOK_OPTIONS)

  const tokensPerEthSell = useContractReader(readContracts, 'BCTVendor', 'maticPerBCTSell', HOOK_OPTIONS)
  const tokensPerEthBuy = useContractReader(readContracts, 'BCTVendor', 'maticPerBCTBuy', HOOK_OPTIONS)

  const [tokenBuyAmount, setTokenBuyAmount] = useState()
  const [tokenSellAmount, setTokenSellAmount] = useState()

  const [isSellAmountApproved, setIsSellAmountApproved] = useState()
  const ethCostToPurchaseTokens =
    tokenBuyAmount && tokensPerEthBuy && ethers.utils.parseEther(`${tokenBuyAmount * parseFloat(tokensPerEthBuy)}`)
  const ethCostToSellTokens =
    tokenSellAmount && tokensPerEthSell && ethers.utils.parseEther(`${tokenSellAmount * parseFloat(tokensPerEthSell)}`)

  const vendorApproval = useContractReader(readContracts, 'BCT', 'allowance', [address, vendorAddress], HOOK_OPTIONS)

  useEffect(() => {
    const tokenSellAmountBN = tokenSellAmount && ethers.utils.parseEther(`${tokenSellAmount}`)

    setIsSellAmountApproved(vendorApproval && tokenSellAmount && vendorApproval.gte(tokenSellAmountBN))
  }, [tokenSellAmount, readContracts, vendorApproval])

  const [buying, setBuying] = useState()
  const [selling, setSelling] = useState()

  const contentList = {
    Buy: (
      <Space>
        <div style={{ padding: 8, marginTop: 32, width: 300, margin: 'auto' }}>
          <Card title="Buy Tokens" extra={<>{tokensPerEthBuy && tokensPerEthBuy.toNumber()} MATIC/BCT</>}>
            <div style={{ padding: 8 }}>
              <Input
                style={{ textAlign: 'center' }}
                placeholder={'amount of tokens to buy'}
                value={tokenBuyAmount}
                onChange={e => {
                  setTokenBuyAmount(e.target.value)
                }}
              />
              <Balance balance={ethCostToPurchaseTokens} dollarMultiplier={price} /> MATIC
            </div>

            <div style={{ padding: 8 }}>
              <Button
                type={'primary'}
                loading={buying}
                onClick={async () => {
                  setBuying(true)
                  await tx(writeContracts.BCTVendor.buyTokens({ value: ethCostToPurchaseTokens }))
                  setBuying(false)
                }}
              >
                Buy Tokens
              </Button>
            </div>
          </Card>
        </div>
      </Space>
    ),
    Sell: (
      <Space>
        <div style={{ padding: 8, marginTop: 32, width: 300, margin: 'auto' }}>
          <Card title="Sell Tokens" extra={<>{tokensPerEthSell && tokensPerEthSell.toNumber()} MATIC/BCT</>}>
            <div style={{ padding: 8 }}>
              <Input
                style={{ textAlign: 'center' }}
                placeholder={'amount of tokens to sell'}
                value={tokenSellAmount}
                onChange={e => {
                  setTokenSellAmount(e.target.value)
                }}
              />
              <Balance balance={ethCostToSellTokens} dollarMultiplier={price} /> MATIC
            </div>
            {isSellAmountApproved ? (
              <div style={{ padding: 8 }}>
                <Button
                  type={'primary'}
                  loading={selling}
                  onClick={async () => {
                    setSelling(true)
                    await tx(
                      writeContracts.BCTVendor.sellTokens(tokenSellAmount && ethers.utils.parseEther(tokenSellAmount)),
                    )
                    setSelling(false)
                  }}
                >
                  Sell Tokens
                </Button>
              </div>
            ) : (
              <div style={{ padding: 8 }}>
                <Button
                  type={'primary'}
                  loading={selling}
                  onClick={async () => {
                    setSelling(true)
                    await tx(
                      writeContracts.BCT.approve(
                        readContracts.BCTVendor.address,
                        tokenSellAmount && ethers.utils.parseEther(tokenSellAmount),
                      ),
                    )
                    setSelling(false)
                  }}
                >
                  Approve Tokens
                </Button>
              </div>
            )}
          </Card>
        </div>
      </Space>
    ),
  }

  return (
    <>
      <Space>
        <div style={{ padding: 8 }}>
          <div>Available Supply to Buy from Vendor:</div>
          <TokenBalance balance={vendorTokenBalance} fontSize={64} /> BCT
        </div>
      </Space>
      <Card
        style={{ padding: 8, marginTop: 32, width: 600, margin: 'auto' }}
        title="Buy/Sell BCT"
        tabList={tabList}
        activeTabKey={activeTabKey}
        onTabChange={key => {
          onTabChange(key)
        }}
      >
        {contentList[activeTabKey]}
      </Card>
    </>
  )
}
