/* eslint-disable max-lines-per-function */
const { utils } = require('ethers')

// eslint-disable-next-line max-params
export const createTableData = (USDPrices, BTC, MCO2, NCT, KLIMA, sKLIMA, CNBED, CBTC, indexUSDPrices) => {

  const MCO2formated = utils.formatUnits(MCO2, 18)
  const BTCformated = utils.formatUnits(BTC, 18)
  const NCTformated = utils.formatUnits(NCT, 18)
  const KLIMAformated = utils.formatUnits(KLIMA, 9)
  const sKLIMAformated = utils.formatUnits(sKLIMA, 9)
  const CNBEDformated = utils.formatUnits(CNBED, 18)
  const CBTCformated = utils.formatUnits(CBTC, 18)

  const MCO2BalanceUSD = MCO2formated * USDPrices['moss-carbon-credit']?.usd || 0
  const BCTBalanceUSD = BTCformated * USDPrices['toucan-protocol-base-carbon-tonne']?.usd || 0
  const NCTBalanceUSD = NCTformated * USDPrices['toucan-protocol-nature-carbon-tonne']?.usd || 0
  const KLIMABalanceUSD = KLIMAformated * USDPrices['klima-dao']?.usd || 0
  const sKLIMABalanceUSD = sKLIMAformated * USDPrices['staked-klima']?.usd || 0
  const CNBEDBalanceUSD = CNBEDformated * indexUSDPrices?.CNBED || 0
  const CBTCBalanceUSD = CBTCformated * indexUSDPrices?.CBTC || 0

  const tableData = [
    {
      key: '1',
      token: {
        title: 'Clean Bitcoin',
        icon: 'icon/cbtc.png',
        url: 'https://koywe.eco/',
        symbol: 'CBTC',
      },
      position: `$${CBTCBalanceUSD.toFixed(2)}`,
      co2: Number(CBTCformated).toFixed(2),
      description: `Koywe's Clean BTC Index on Polygon Network. The ultimate store of value, carbon neutral. 99% WBTC, 1% NCT.`,
      contract: {
        title: '0x7958e9fa5cf56aebedd820df4299e733f7e8e5dd',
        url: 'https://polygonscan.com/address/0x7958e9fa5cf56aebedd820df4299e733f7e8e5dd',
      },
      buy: {
        meta: 'index',
        symbol: 'CBTC',
        title: 'Buy CBTC',
        url: 'https://www.tokensets.com/v2/set/polygon/0x7958e9fa5cf56aebedd820df4299e733f7e8e5dd',
      },
    },
    {
      key: '2',
      token: {
        title: 'Clean BED',
        icon: 'icon/bed.png',
        url: 'https://koywe.eco/',
        symbol: 'CNBED',
      },
      position: `$${CNBEDBalanceUSD.toFixed(2)}`,
      co2: Number(CNBEDformated).toFixed(2),
      description: `Sleep better at night with Koywe's Carbon Negative BED Index on Polygon Network. 33% WBTC, 33% WETH, 33% DeFi Pulse Index, 1% NCT.`,
      contract: {
        title: '0x0765425b334d7db1f374d03f4261ac191172bef7',
        url: 'https://polygonscan.com/address/0x0765425b334D7DB1f374D03f4261aC191172BEF7',
      },
      buy: {
        meta: 'index',
        symbol: 'CNBED',
        title: 'Buy CNBED',
        url: 'https://www.tokensets.com/v2/set/polygon/0x0765425b334d7db1f374d03f4261ac191172bef7',
      },
    },
    {
      key: '3',
      token: {
        title: 'Moss CO2 Token',
        icon: 'https://i.imgur.com/ZcOLkHe.jpg',
        url: 'https://moss.earth/',
        symbol: 'MCO2',
      },
      position: `$${MCO2BalanceUSD.toFixed(2)}`,
      co2: Number(MCO2formated).toFixed(2),
      description: 'Moss Certified CO2 Token. Each token represents the offset of 1 CO2e ton.',
      contract: {
        title: '0xAa7DbD1598251f856C12f63557A4C4397c253Cea',
        url: 'https://polygonscan.com/address/0xAa7DbD1598251f856C12f63557A4C4397c253Cea',
      },
      buy: {
        meta: 'token',
        title: 'Get MCO2',
        url: 'https://quickswap.exchange/#/swap?outputCurrency=0xAa7DbD1598251f856C12f63557A4C4397c253Cea&chain=polygon',
        symbol: 'MCO2',
      },
    },
    {
      key: '4',
      token: {
        title: 'Toucan CO2 Tokens (BCT)',
        icon: 'https://raw.githubusercontent.com/sushiswap/assets/master/blockchains/polygon/assets/0x2F800Db0fdb5223b3C3f354886d907A671414A7F/logo.png',
        url: 'https://toucan.earth/',
        symbol: 'BCT',
      },
      position: `$${BCTBalanceUSD.toFixed(2)}`,
      co2: Number(BTCformated).toFixed(2),
      description: 'Base Carbon Ton: Toucan credits bridged to blockchain on Polygon. Each token represents the offset of 1 CO2e ton.',
      contract: {
        title: '0x2F800Db0fdb5223b3C3f354886d907A671414A7F',
        url: 'https://polygonscan.com/address/0x2F800Db0fdb5223b3C3f354886d907A671414A7F',
      },
      buy: {
        meta: 'token',
        title: 'Get BCT',
        symbol: 'BCT',
        url: 'https://app.sushi.com/en/swap?outputCurrency=0x2F800Db0fdb5223b3C3f354886d907A671414A7F&chain=polygon',
      },
    },
    {
      key: '5',
      token: {
        title: 'Toucan CO2 Tokens (NCT)',
        icon: 'https://raw.githubusercontent.com/sushiswap/assets/master/blockchains/polygon/assets/0xD838290e877E0188a4A44700463419ED96c16107/logo.png',
        url: 'https://toucan.earth/',
        symbol: 'NCT',
      },
      position: `$${NCTBalanceUSD.toFixed(2)}`,
      co2: Number(NCTformated).toFixed(2),
      description: 'Nature Carbon Ton: Toucan premium credits bridged to blockchain on Polygon. Each token represents the offset of 1 CO2e ton.',
      contract: {
        title: '0xd838290e877e0188a4a44700463419ed96c16107',
        url: 'https://polygonscan.com/address/0xd838290e877e0188a4a44700463419ed96c16107',
      },
      buy: {
        meta: 'token',
        title: 'Get NCT',
        symbol: 'NCT',
        url: 'https://app.sushi.com/en/swap?outputCurrency=0xd838290e877e0188a4a44700463419ed96c16107&chain=polygon',
      },
    },
    {
      key: '6',
      token: {
        meta: 'token',
        title: 'Klima Tokens (KLIMA)',
        icon: 'https://raw.githubusercontent.com/sushiswap/assets/master/blockchains/polygon/assets/0x4e78011Ce80ee02d2c3e649Fb657E45898257815/logo.png',
        url: 'https://www.klimadao.finance/',
        symbol: 'KLIMA',
      },
      position: `$${KLIMABalanceUSD.toFixed(2)}`,
      co2: Number(KLIMAformated).toFixed(2),
      description: 'Klima DAO Tokens, unstaked on Polygon.',
      contract: {
        title: '0x4e78011ce80ee02d2c3e649fb657e45898257815',
        url: 'https://polygonscan.com/address/0x4e78011ce80ee02d2c3e649fb657e45898257815',
      },
      buy: {
        meta: 'token',
        title: 'Get KLIMA',
        url: 'https://app.sushi.com/en/swap?outputCurrency=0x4e78011ce80ee02d2c3e649fb657e45898257815&chain=polygon',
        symbol: 'KLIMA',
      },
    },
    {
      key: '7',
      token: {
        title: 'Staked Klima (sKLIMA)',
        icon: 'icon/klima.svg',
        url: 'https://www.klimadao.finance/',
        symbol: 'sKLIMA',
      },
      position: `$${sKLIMABalanceUSD.toFixed(2)}`,
      co2: Number(sKLIMAformated).toFixed(2),
      description: 'Staked Klima DAO Tokens on Polygon',
      contract: {
        title: '0xb0C22d8D350C67420f06F48936654f567C73E8C8',
        url: 'https://polygonscan.com/address/0xb0C22d8D350C67420f06F48936654f567C73E8C8',
      },
      buy: {
        title: 'Stake KLIMA',
        url: 'https://dapp.klimadao.finance/#/stake',
        symbol: 'sKLIMA',
      },
    },
  ]

  return tableData
}
