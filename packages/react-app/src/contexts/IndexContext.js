/* eslint-disable max-lines-per-function */
import React, { useContext, useEffect,useState } from 'react'
import { utils } from 'ethers'
import Set from 'set.js'

import sushiTokenList from '../sushiTL.json'

import { NetworkContext } from './NetworkContext'
import { WalletContext } from './WalletContext'

export const IndexContext = React.createContext({
  setObject: undefined,
  indexListed: {},
  indexContextDetails: {},
  indexUSDPrices: {},
})

export const IndexContextProvider = ({ children }) => {

  const SetJsPolygonAddresses = {
    controllerAddress: '0x75FBBDEAfE23a48c0736B2731b956b7a03aDcfB2',
    setTokenCreatorAddress: '0x14f0321be5e581abF9d5BC76260bf015Dc04C53d',
    basicIssuanceModuleAddress: '0x38E5462BBE6A72F79606c1A0007468aA4334A92b',
    debtIssuanceModuleV2Address: '0xf2dC2f456b98Af9A6bEEa072AF152a7b0EaA40C9',
    streamingFeeModuleAddress: '0x8440f6a2c42118bed0D6E6A89Bf170ffd13e21c0',
    tradeModuleAddress: '0xd04AabadEd11e92Fefcd92eEdbBC81b184CdAc82',
    protocolViewerAddress: '0x8D5CF870354ffFaE0586B639da6D4E4F6C659c69',
    integrationRegistryAddress: '0x4c4C649455c6433dC48ff1571C9e50aC58f0CeFA',
    priceOracleAddress: '0x9378Ad514c00E4869656eE27b634d852DD48feAD',
    setValuerAddress: '0x3700414Bb6716FcD8B14344fb10DDd91FdEA59eC',
  }

  const { address, isLoadingAccount, injectedProvider, targetNetwork, userSigner } = useContext(NetworkContext)
  const { USDPrices } = useContext(WalletContext)

  const [setObject, setSetObject] = useState(null)
  const [indexContextDetails, setIndexContextDetails] = useState(null)
  const [indexUSDPrices, setIndexUSDPrices] = useState(null)

  const indexListed = ['0x0765425b334D7DB1f374D03f4261aC191172BEF7', '0x7958E9fa5cf56aEBeDd820df4299E733f7E8e5Dd']

  useEffect(() => {
      const getSet = async () => {
        if(injectedProvider && address && USDPrices) {
          const SetJsConfig = {
            ethersProvider: injectedProvider,
            ...SetJsPolygonAddresses,
          }

          const set = new Set(SetJsConfig)

          setSetObject(set)

          const indexDetails = []
          const indexPrices = {}

          for(const index of indexListed) {
            let price = 0
            const details = set && await set.setToken
            .fetchSetDetailsAsync(
            index,
            ['0x38E5462BBE6A72F79606c1A0007468aA4334A92b'],
            address,
            )

            details.positions.forEach(position => {
              const _token = sushiTokenList.find(sushiToken => {
                return sushiToken.address === position.component
              })

              price += utils.formatUnits(position.unit,_token.decimals) * USDPrices[_token.coingeckoId].usd
            })

            indexDetails.push(details)
            indexPrices[details.symbol] = price
          }

          setIndexUSDPrices(indexPrices)
          setIndexContextDetails(indexDetails)
        }
      }

      getSet()

    }, [USDPrices, address, injectedProvider])



  const value = {
    setObject,
    indexListed,
    indexContextDetails,
    indexUSDPrices,
  }



return  <IndexContext.Provider value={value}>{children}</IndexContext.Provider>

}
