/* eslint-disable max-lines-per-function */
import React, { useContext, useEffect, useState } from 'react'
import { Line } from 'react-chartjs-2'
import { Card, Col, List, Row, Typography } from 'antd'
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

import { IndexContext } from '../contexts/IndexContext'
import { NetworkContext } from '../contexts/NetworkContext'
import { usePriceHistory } from '../hooks/useCoingeckoAPI'
import { useKoyweMintEvents, usePledgeEvents, useTokenTransaction } from '../hooks/usePolyscanAPI'
import sushiTokenList from '../sushiTL.json'
require('dotenv').config()

const { Title: TypoTitle } = Typography
const { utils, BigNumber } = require('ethers')
const admins = process.env.REACT_APP_ADMINS.split(',')

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
)

const Metrics = () => {
  const { address } = useContext(NetworkContext)
  const { indexContextDetails, indexUSDPrices } = useContext(IndexContext)

  const priceHistory = []
  const indexTransactions = []
  const [chartData, setChartData] = useState()
  const [totalTonsPledged, setTotalTonsPledged] = useState()
  const [pledgeChartData, setPledgeChartData] = useState()
  const [nftAddresses,setNftAddresses] = useState()

  const pledgePSEvents = usePledgeEvents()
  const mintPSEvents = useKoyweMintEvents()

  const wethAddress = '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619'
  const wbtcAddress = '0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6'
  const dfiAddress = '0x85955046DF4668e1DD369D2DE9f3AEB98DD2A369'
  const nctAddress = '0xD838290e877E0188a4A44700463419ED96c16107'

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: false,
        text: 'Last 30 Day Data',
      },
    },
  }

  priceHistory[wethAddress] = usePriceHistory(wethAddress,30,'daily')
  priceHistory[wbtcAddress] = usePriceHistory(wbtcAddress,30,'daily')
  priceHistory[dfiAddress] = usePriceHistory(dfiAddress,30,'daily')
  priceHistory[nctAddress] = usePriceHistory(nctAddress,30,'daily')

  const dates = priceHistory[nctAddress] && priceHistory[nctAddress].prices.reverse().map(entry => {
    return (new Date(entry[0]).toISOString().split('T')[0])
  })


  indexTransactions.CBTC = useTokenTransaction('0x7958e9fa5cf56aebedd820df4299e733f7e8e5dd',30)
  indexTransactions.CNBED = useTokenTransaction('0x0765425b334d7db1f374d03f4261ac191172bef7',30)

  useEffect(() => {
    const preparePledgeData = () => {
      let _totalTons = 0

      if (pledgePSEvents) {
        const oldestTimeStamp = Math.round((new Date()). getTime() / 1000) - 30 * 24 * 60 * 60
        const filteredEvents = pledgePSEvents
        .filter(event => {
          _totalTons += event.tonsCommitted*1

          return event.timestampPledge >= oldestTimeStamp
        })

        const pledgeDates = filteredEvents.map(event => {
          return new Date(event.timestampPledge*1000).toISOString().split('T')[0]
        })

        const newChartData = {
          labels: dates,
          datasets: [
            {
              label: 'Number of Pledges',
              data: dates.map(date => {
                let events = 0

                pledgeDates.forEach(event => {
                  return event === date ? events+=1 : events
                })

                return events
              }),
              borderColor: '#f5a442',
              backgroundColor: '#f5a442',
            },
          ],
        }

        setPledgeChartData(newChartData)
        setTotalTonsPledged(_totalTons)
      }
    }

    preparePledgeData()
  },[pledgePSEvents])

  useEffect(() => {
    const prepareTreeData = () => {
      if(mintPSEvents) {
        const _uniqueAddresses = []

        mintPSEvents.forEach(event => {
          _uniqueAddresses[event.minter] ? _uniqueAddresses[event.minter] +=1 : _uniqueAddresses[event.minter] = 1
        })

        setNftAddresses(Object.keys(_uniqueAddresses).length)
      }
    }

    prepareTreeData()
  },[mintPSEvents])

  useEffect(() => {
    const prepareChartData = () => {
      const _indexPriceHistory = []
      const _indexTransactions = []

      if(indexContextDetails && priceHistory[nctAddress]  && priceHistory[wethAddress] && priceHistory[wbtcAddress] && priceHistory[dfiAddress])
        indexContextDetails.forEach(index => {
          _indexPriceHistory[index.symbol] = []
          index.positions.forEach(position => {
            const token = sushiTokenList.find(_token => {
              return _token.address === position.component
            })

            priceHistory[position.component].prices.forEach((entry,i) => {
              _indexPriceHistory[index.symbol][i] ?
              _indexPriceHistory[index.symbol][i] += entry[1]*utils.formatUnits(position.unit,token.decimals)
              :
              _indexPriceHistory[index.symbol][i] = entry[1]*utils.formatUnits(position.unit,token.decimals)
            })
          })
        })

        const newChartData = {
          labels: dates,
          datasets: [
            {
              label: 'CBTC',
              data: _indexPriceHistory.CBTC,
              borderColor: '#3f9c49',
              backgroundColor: '#3f9c49',
            },
            {
              label: 'CNBED',
              data: _indexPriceHistory.CNBED,
              borderColor: '#4299E2',
              backgroundColor: '#4299E2',
            },
          ],
        }

        setChartData(newChartData)
    }

    prepareChartData()
  }, [indexContextDetails])

  return (
    <>
      { address && admins.includes(address) &&
      <>
        <Row justify="center" className="mb-md">
          <Col span={24} style={{ textAlign:'center' }} >
            <TypoTitle level={2}>Key Metrics</TypoTitle>
          </Col>
          <Col>
            <TypoTitle level={3}>{pledgePSEvents && pledgePSEvents.length || 0} Koywe Pledges, {totalTonsPledged || 0} tons committed</TypoTitle>
            <TypoTitle level={3}>{mintPSEvents && mintPSEvents.length || 0}/255 Koywe Trees Minted by {nftAddresses || 0} unique addresses</TypoTitle>
          </Col>
        </Row>
        <Row justify="center" className="mb-md">
          {indexContextDetails && <List
            style={{ width: '60%' }}
            dataSource={indexContextDetails}
            // itemLayout='horizontal'
            grid={{ gutter: 2, column: 2 }}
            renderItem={item => {
              return (
                <List.Item key={item.symbol}>
                  <Card
                    size="small"
                    type="inner"
                    title={`${item.name} (${item.symbol})`}
                    style={{ width: '100%', textAlign: 'left' }}
                    extra={`Fee: ${utils.formatUnits(item.streamingFeePercentage,18)*100}%`}
                  >
                    <TypoTitle level={4}>Market Cap: ${(utils.formatUnits(item.totalSupply,18) * indexUSDPrices[item.symbol]).toFixed(2)}</TypoTitle>
                    Total Supply: {(utils.formatUnits(item.totalSupply,18)*1).toFixed(2)}
                    <br />
                    Current Price: ${(indexUSDPrices[item.symbol]*1).toFixed(2)}
                    <br />
                    Unaccrued Fees: ${(utils.formatUnits(item.unaccruedFees,18) * indexUSDPrices[item.symbol]).toFixed(2)}
                    {indexTransactions[item.symbol]  && <List
                    header={<TypoTitle level={4}>Recent Transactions</TypoTitle>}
                    style={{ width: '100%' }}
                    dataSource={indexTransactions[item.symbol].slice(0, 5)}
                    renderItem={item => {
                      return (
                        <List.Item key={`${item.timeStamp+item.nonce}`}>
                          <a href={`https://polygonscan.com/tx/${item.hash}`} target='_blank'>
                            {item.from.toLowerCase() === '0x0000000000000000000000000000000000000000' ? 'Issuance of ': 'Transfer of '}
                          </a>
                          {(item.value/10**item.tokenDecimal).toFixed(2)} {item.tokenSymbol}
                          {' from '}
                          {(item.from.length > 11 ? `${item.from.slice(0, 6)}...${item.from.substr(-3)}` : item.from)}
                          {' to '}
                          {(item.to.length > 11 ? `${item.to.slice(0, 6)}...${item.to.substr(-3)}` : item.to)}
                          {' on '}{(new Date(item.timeStamp*1000)).toDateString()}
                        </List.Item>
                      )
                    }}
                  />}
                  </Card>
                </List.Item>
              )
            }}
          />}
        </Row>
        <Row justify="center" className="mb-md">
          <TypoTitle level={3}>Index Prices (last 30 days)</TypoTitle>
          {chartData ? <Line data={chartData} options={options}/> : '' }
        </Row>
        <Row justify="center" className="mb-md">
          <TypoTitle level={3}>Pledges per day (last 30 days)</TypoTitle>
          {pledgeChartData ? <Line data={pledgeChartData} options={options}/> : '' }
        </Row>
      </>
      }
    </>
  )
}

export default Metrics
