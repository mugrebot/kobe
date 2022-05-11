import React, { useContext, useEffect, useState } from 'react'
import { Line } from 'react-chartjs-2'
import { Card, Col, Image, List, Row, Typography } from 'antd'
import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js'

import { usePriceHistory } from '../../hooks/useCoingeckoAPI'
import { useAccountTransactions, useOldBalance } from '../../hooks/usePolyscanAPI'
import sushiTokenList from '../../sushiTL.json'

const { Title: TypoTitle } = Typography
const { utils, BigNumber } = require('ethers')

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
)

const Investments = ({ address, contracts }) => {
  const transactions = useAccountTransactions(address)
  const oldBalanceNCT = useOldBalance(address,'0xD838290e877E0188a4A44700463419ED96c16107',30)
  const oldBalanceBCT = useOldBalance(address,'0x2F800Db0fdb5223b3C3f354886d907A671414A7F',30)
  const oldBalanceMCO2 = useOldBalance(address,'0xAa7DbD1598251f856C12f63557A4C4397c253Cea',30)
  const oldBalanceKLIMA = useOldBalance(address,'0x4e78011ce80ee02d2c3e649fb657e45898257815',30)
  const oldBalanceSKlIMA = useOldBalance(address,'0xb0C22d8D350C67420f06F48936654f567C73E8C8',30)
  const oldBalanceCBTC = useOldBalance(address,'0x7958e9fa5cf56aebedd820df4299e733f7e8e5dd',30)
  const oldBalanceCNBED = useOldBalance(address,'0x0765425b334d7db1f374d03f4261ac191172bef7',30)

  console.log('oldBalanceNCT',oldBalanceNCT)
  console.log('oldBalanceBCT',oldBalanceBCT)
  console.log('oldBalanceMCO2',oldBalanceMCO2)
  console.log('oldBalanceKLIMA',oldBalanceKLIMA)
  console.log('oldBalanceSKlIMA',oldBalanceSKlIMA)
  console.log('oldBalanceCBTC',oldBalanceCBTC)
  console.log('oldBalanceCNBED',oldBalanceCNBED)

  return (
    <Row justify="center" className="mb-md">
      {address && transactions && <List
        header={<TypoTitle level={4}>Recent Transactions</TypoTitle>}
        style={{ width: '100%' }}
        dataSource={transactions.slice(0,5)}
        renderItem={item => {
          const token = sushiTokenList.find(tok => {
            return  tok.address.toLowerCase() === item.contractAddress
          })

          return (
            <List.Item key={`${item.timeStamp+item.nonce}`}>
              <Image src={token?token.logoURI:'./icon/eth.svg'} preview={false} width={13} height={13} />
              <a href={`https://polygonscan.com/tx/${item.hash}`} target='_blank'>
                {address.toLowerCase() === item.from.toLowerCase() ? 'Sent ': 'Received '}
              </a>
              {(item.value/10**item.tokenDecimal).toFixed(2)} {item.tokenSymbol}
              {address.toLowerCase() === item.from.toLowerCase() ? ' to ':' from '}
              {address.toLowerCase() === item.from.toLowerCase() ? (item.to > 11 ? `${item.to.slice(0, 6)}...${item.to.substr(-3)}` : item.to) : (item.to > 11 ? `${item.from.slice(0, 6)}...${item.from.substr(-3)}` : item.from)}
              {' on '}{(new Date(item.timeStamp*1000)).toDateString()}
            </List.Item>
          )
        }}
      />}
    </Row>
  )
}

export default Investments
