
import React, { useContext, useEffect,useState } from 'react'
import { ethers, utils } from 'ethers'
import Set from 'set.js'

import { NetworkContext } from './NetworkContext'

export const IndexContext = React.createContext({
  indexListed: {},
  indexContextDetails: {},
  WETHProportion: {},
  BTCProportion: {},
  DPIProportion: {},
  NCTProportion: {},
  CWBTCProportion: {},
  CNTCProportion: {},
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

  const [indexContextDetails, setIndexContextDetails] = useState(null)
  const [WETHProportion, setWethProportion] = useState(null)
  const [BTCProportion, setBTCProportion] = useState(null)
  const [DPIProportion, setDPIProportion] = useState(null)
  const [NCTProportion, setNCTProportion] = useState(null)

  const [CWBTCProportion, setCWBTCProportion] = useState(null)
  const [CNTCProportion, setCNTCProportion] = useState(null)


  const indexListed = ['0x0765425b334D7DB1f374D03f4261aC191172BEF7', '0x7958E9fa5cf56aEBeDd820df4299E733f7E8e5Dd']

  useEffect(() => {
      const getSet = async () => {
        if(injectedProvider && address) {
          const SetJsConfig = {
            ethersProvider: injectedProvider,
            ...SetJsPolygonAddresses,
          }

          const set = new Set(SetJsConfig)

          const indexDetails = []

          for(const index of indexListed) {
              const details = set && await set.setToken
              .fetchSetDetailsAsync(
              index,
              ['0x38E5462BBE6A72F79606c1A0007468aA4334A92b'],
              address,
              )

              indexDetails.push(details)

          }

          setIndexContextDetails(indexDetails)

          if(indexContextDetails) {
            setWethProportion(utils.formatUnits((indexContextDetails[0].positions[0].unit), 18) || 0)
            setBTCProportion(utils.formatUnits((indexContextDetails[0].positions[1].unit), 8) || 0)
            setDPIProportion(utils.formatUnits((indexContextDetails[0].positions[2].unit), 18) || 0)
            setNCTProportion(utils.formatUnits((indexContextDetails[0].positions[3].unit), 18) || 0)
            setCWBTCProportion(utils.formatUnits((indexContextDetails[1].positions[0].unit), 8) || 0)
            setCNTCProportion(utils.formatUnits((indexContextDetails[1].positions[1].unit), 18) || 0)
          }




        }
      }

      getSet()

    })



  const value = {

    indexListed,
    indexContextDetails,
    WETHProportion,
    BTCProportion,
    DPIProportion,
    NCTProportion,
    CWBTCProportion,
    CNTCProportion,


  }



return  <IndexContext.Provider value={value}>{children}</IndexContext.Provider>

}
