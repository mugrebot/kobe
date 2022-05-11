import React, { useEffect, useState } from 'react'
import { Typography } from 'antd'
import { useContractReader } from 'eth-hooks'

const { Text } = Typography

export const Pledge = co2tons => {
  let valueEmmited = 0

  if (co2tons) valueEmmited = (co2tons.co2tons._hex.toString() * 1) / 10 ** 9

  return <Text>{valueEmmited} CO2e tons/year</Text>
}

export const Staked = ({ address, polyContracts, HOOK_OPTIONS }) => {
  const myPolyKlimaBalance = useContractReader(polyContracts, 'BCT', 'balanceOf', [address], HOOK_OPTIONS)

  const skilmaBalance = (
    (myPolyKlimaBalance && myPolyKlimaBalance > 0 ? myPolyKlimaBalance : 0) / Math.pow(10, 18)
  ).toFixed(4)

  return skilmaBalance
}

export const TokenTotal = ({ address, tokenName, contract, HOOK_OPTIONS }) => {
  const tokenBalance = useContractReader(contract, tokenName, 'balanceOf', [address], HOOK_OPTIONS)

  if (!tokenBalance) return '0.00'

  return (tokenBalance / Math.pow(10, 18)).toFixed(2)
}

export const Balance = ({ address, polyContracts, USDPrices, HOOK_OPTIONS }) => {
  // Polybalances
  const myPolyMCO2Balance = useContractReader(polyContracts, 'PMCO2', 'balanceOf', [address], HOOK_OPTIONS)

  const myPolyBCTBalance = useContractReader(polyContracts, 'BCT', 'balanceOf', [address], HOOK_OPTIONS)

  const myPolyNCTBalance = useContractReader(polyContracts, 'NCT', 'balanceOf', [address], HOOK_OPTIONS)

  const myPolyKlimaBalance = useContractReader(polyContracts, 'KLIMA', 'balanceOf', [address], HOOK_OPTIONS)

  const myPolySKlimaBalance = useContractReader(polyContracts, 'sKLIMA', 'balanceOf', [address], HOOK_OPTIONS)

  const [totalBalance, setTotalBalance] = useState(0)

  // read prices from coingecko
  useEffect(() => {
    // we will use async/await to fetch this data
    function getTotalBalance() {
      let sum = 0

      sum +=
        ((myPolyBCTBalance && myPolyBCTBalance > 0 ? myPolyBCTBalance : 0) / Math.pow(10, 18)) *
        (USDPrices &&
          USDPrices['toucan-protocol-base-carbon-tonne'] &&
          USDPrices['toucan-protocol-base-carbon-tonne'].usd)
      sum +=
        ((myPolyNCTBalance && myPolyNCTBalance > 0 ? myPolyNCTBalance : 0) / Math.pow(10, 18)) *
        (USDPrices &&
          USDPrices['toucan-protocol-nature-carbon-tonne'] &&
          USDPrices['toucan-protocol-nature-carbon-tonne'].usd)
      sum +=
        ((myPolyMCO2Balance && myPolyMCO2Balance > 0 ? myPolyMCO2Balance : 0) / Math.pow(10, 18)) *
        (USDPrices && USDPrices['moss-carbon-credit'] && USDPrices['moss-carbon-credit'].usd)
      sum +=
        ((myPolyKlimaBalance && myPolyKlimaBalance > 0 ? myPolyKlimaBalance : 0) / Math.pow(10, 9)) *
        (USDPrices && USDPrices['staked-klima'] && USDPrices['staked-klima'].usd)
      sum +=
        ((myPolySKlimaBalance && myPolySKlimaBalance > 0 ? myPolySKlimaBalance : 0) / Math.pow(10, 9)) *
        (USDPrices && USDPrices['klima-dao'] && USDPrices['klima-dao'].usd)
      // sum+=(myPolyMCO2Balance && myPolyMCO2Balance > 0 ? myPolyMCO2Balance : 0)/(Math.pow(10,18))*(prices && prices["moss-carbon-credit"] && prices["moss-carbon-credit"].usd);
      setTotalBalance(sum.toFixed(2))
    }

    getTotalBalance()
  }, [myPolyBCTBalance, myPolyMCO2Balance])

  return <Text>{totalBalance} USD</Text>
}
