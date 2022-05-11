/* eslint-disable max-lines */
import { useEffect, useState } from 'react'

const { utils, BigNumber } = require('ethers')

require('dotenv').config()

const PS_KEY = process.env.REACT_APP_POLYGONSCAN_KEY

export const usePledgeEvents = () => {
  const [events, setEvents] = useState()

  useEffect(() => {
    const urlEvents = `https://api.polygonscan.com/api?`
    +`module=logs&`
    +`action=getLogs&`
    +`fromBlock=1&`
    +`address=0x88d274a8917e6f7567c304467efbe9de3c985ba4&`
    +`topic0=0x206a56e153275ed69b28df77bb6d4facd5941b8169fcc233525cf56f0baa7fb2&`
    +`apikey=${PS_KEY}`

    const getEvents = async () => {
      try{
        const response = await fetch(
          urlEvents,
        )
        const data = await response.json()

        if(data.message === 'OK') {
          const processedEvents = data.result.map(event => {
            return {
              pledger: utils.hexZeroPad(utils.hexStripZeros(event.topics[1]),20),
              tonsCommitted : utils.formatUnits(utils.defaultAbiCoder.decode(['uint64','uint64'], event.data)[0],9),
              timestampPledge : utils.defaultAbiCoder.decode(['uint64','uint64'], event.data)[1].toString(),
            }
          })

          setEvents(processedEvents)
        }

      } catch(e) {
        console.log(`Error getting Polygonscan Transactions. ${e}`)
      }
    }

    getEvents()
  }, [])

  return events
}

export const useKoyweMintEvents = () => {
  const [events, setEvents] = useState()

  useEffect(() => {
    const urlEvents = `https://api.polygonscan.com/api?`
    +`module=logs&`
    +`action=getLogs&`
    +`fromBlock=1&`
    +`address=0x852be2756564b789509f9a04a9a57322a59124c7&`
    +`topic0=0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef&`
    +`topic0_1_opr=and&`
    +`topic1=0x0000000000000000000000000000000000000000000000000000000000000000&`
    +`apikey=${PS_KEY}`

    const getEvents = async () => {
      try{
        const response = await fetch(
          urlEvents,
        )
        const data = await response.json()

        if(data.message === 'OK') {
          const processedEvents = data.result.map(event => {
            return {
              minter: utils.hexZeroPad(utils.hexStripZeros(event.topics[2]),20),
              tokenID : BigNumber.from(event.topics[3]).toString(),
              block: BigNumber.from(event.timeStamp).toString(),
            }
          })

          setEvents(processedEvents)
        }

      } catch(e) {
        console.log(`Error getting Polygonscan Transactions. ${e}`)
      }
    }

    getEvents()
  }, [])

  return events
}

export const useToucanMintEvents = address => {
  const [events, setEvents] = useState()

  useEffect(() => {
    if(!address) return []

    const urlEvents = `https://api.polygonscan.com/api?`
    +`module=account&`
    +`action=tokennfttx&`
    +`fromBlock=1&`
    +`contractaddress=0x5e377f16E4ec6001652befD737341a28889Af002&`
    +`address=${address}&`
    +`sort=desc&`
    +`page=1&`
    +`offset=10000&`
    +`apikey=${PS_KEY}`

    const getEvents = async () => {
      try{
        const response = await fetch(
          urlEvents,
        )
        const data = await response.json()

        if(data.message === 'OK') {
          const processedEvents = data.result.map(event => {
            return {
              minter: address,
              tokenID : event.tokenID,
              block: event.timeStamp,
            }
          })

          setEvents(processedEvents)
        }

      } catch(e) {
        console.log(`Error getting Polygonscan Transactions. ${e}`)
      }
    }

    getEvents()
  }, [address])

  return events
}

export const useTokenTransaction = (assetAddress, days=30) => {
  const [transactions, setTransactions] = useState()
  const oldestTimeStamp = Math.round((new Date()). getTime() / 1000) - (days || 30) * 24 * 60 * 60

  useEffect(() => {
    if (!assetAddress) return []

    const getTransactions = async () => {
      const urlBlockN =
        `https://api.polygonscan.com/api?`
        +`module=block&`
        +`action=getblocknobytime&`
        +`timestamp=${oldestTimeStamp}&`
        +`closest=before&`
        +`apikey=${PS_KEY}`
      const urlTxs =
        `https://api.polygonscan.com/api?`
        +`module=account&`
        +`action=tokentx&`
        +`contractaddress=${assetAddress}&`
        +`startblock=BLOCKNUMBER&`
        +`endblock=9999999999&`
        +`page=1&`
        +`offset=10000&`
        +`sort=asc&`
        +`apikey=${PS_KEY}`

      let blockNumber = 1

      try{
        const response = await fetch(
          urlBlockN,
        )
        const data = await response.json()

        blockNumber = data.result

      } catch(e) {
        console.log(`Error getting oldest blocknumber. ${e}`)
      }

      try{
        const response = await fetch(
          urlTxs.replace('BLOCKNUMBER',blockNumber),
        )
        const data = await response.json()

        if(data.message === 'OK')
          setTransactions(data.result.reverse())

      } catch(e) {
        console.log(`Error getting Polygonscan Transactions. ${e}`)
      }
    }

    getTransactions()
  }, [assetAddress, oldestTimeStamp])

  return transactions
}

export const useAccountTransactions = (address, days=30) => {
  const [transactions, setTransactions] = useState()
  const oldestTimeStamp = Math.round((new Date()). getTime() / 1000) - (days || 30) * 24 * 60 * 60

  useEffect(() => {
    if (!address) return []

    const getTransactions = async () => {
      const urlBlockN =
        `https://api.polygonscan.com/api?`
        +`module=block&`
        +`action=getblocknobytime&`
        +`timestamp=${oldestTimeStamp}&`
        +`closest=before&`
        +`apikey=${PS_KEY}`
      const urlTxs =
        `https://api.polygonscan.com/api?`
        +`module=account&`
        +`action=tokentx&`
        +`address=${address}&`
        +`startblock=BLOCKNUMBER&`
        +`endblock=9999999999&`
        +`page=1&`
        +`offset=10000&`
        +`sort=desc&`
        +`apikey=${PS_KEY}`

      let blockNumber = 1

      try{
        const response = await fetch(
          urlBlockN,
        )
        const data = await response.json()

        blockNumber = data.result

      } catch(e) {
        console.log(`Error getting oldest blocknumber. ${e}`)
      }

      try{
        const response = await fetch(
          urlTxs.replace('BLOCKNUMBER',blockNumber),
        )
        const data = await response.json()

        if(data.message === 'OK') {
          const filteredTransactions = data.result.filter(t => {
            return t.tokenSymbol === 'BCT' ||
              t.tokenSymbol === 'MCO2' ||
              t.tokenSymbol === 'NCT' ||
              t.tokenSymbol === 'KLIMA' ||
              t.tokenSymbol === 'sKLIMA' ||
              t.tokenSymbol === 'CBTC' ||
              t.tokenSymbol === 'CNBED' // probably should change symbols for addresses, to prevent showing trash data
          })

          setTransactions(filteredTransactions)
        }

      } catch(e) {
        console.log(`Error getting Polygonscan Transactions. ${e}`)
      }
    }

    getTransactions()
  }, [address, oldestTimeStamp])

  return transactions
}

export const useOldBalance = (address, assetAddress, days=30) => {
  const [balance, setBalance] = useState(0)
  const newestTimeStamp = Math.round((new Date()). getTime() / 1000) - (days || 30) * 24 * 60 * 60

  useEffect(() => {
    if (!address || !assetAddress) return 0

    const getTransactions = async () => {
      const urlBlockN =
        `https://api.polygonscan.com/api?`
        +`module=block&`
        +`action=getblocknobytime&`
        +`timestamp=${newestTimeStamp}&`
        +`closest=before&`
        +`apikey=${PS_KEY}`
      const urlTxs =
        `https://api.polygonscan.com/api?`
        +`module=account&`
        +`action=tokentx&`
        +`address=${address}&`
        +`contractaddress=${assetAddress}&`
        +`startblock=1&`
        +`endblock=BLOCKNUMBER&`
        +`page=1&`
        +`offset=10000&`
        +`sort=asc&`
        +`apikey=${PS_KEY}`

      let blockNumber = 1

      try{
        const response = await fetch(
          urlBlockN,
        )
        const data = await response.json()

        blockNumber = data.result

      } catch(e) {
        console.log(`Error getting oldest blocknumber. ${e}`)
      }

      try{
        const response = await fetch(
          urlTxs.replace('BLOCKNUMBER',blockNumber),
        )
        const data = await response.json()

        if(data.message === 'OK') {
          let _balance = 0

          data.result.forEach(tx => {
            if(tx.from === address.toLowerCase())
              _balance -= utils.formatUnits(tx.value,tx.tokenDecimal)*1
            else
              _balance += utils.formatUnits(tx.value,tx.tokenDecimal)*1
          })

          setBalance(_balance)
        }

      } catch(e) {
        console.log(`Error getting Polygonscan Transactions. ${e}`)
      }
    }

    getTransactions()
  }, [address, assetAddress, newestTimeStamp])

  return balance
}
