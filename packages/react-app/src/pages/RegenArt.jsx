/* eslint-disable max-lines-per-function */
import React, { useContext, useEffect, useState } from 'react'
import ReactGA from 'react-ga4'
import { Col, Row, Space, Typography } from 'antd'
import { useContractReader, useGasPrice } from 'eth-hooks'

import ConnectButton from '../components/common/ConnectButton'
import MyRegenArt from '../components/dashboard/MyRegenArt'
import EntTrees from '../components/RegenArt/EntTrees'
import KoyweTrees from '../components/RegenArt/KoyweTrees'
import NftCard from '../components/RegenArt/NftCard'
import NftCardEnt from '../components/RegenArt/NftCardEnt'
import NftCardTreejer from '../components/RegenArt/NftCardTreejer'
import { HOOK_OPTIONS } from '../constants'
import { NetworkContext } from '../contexts/NetworkContext'
import { WalletContext } from '../contexts/WalletContext'
import { Transactor } from '../helpers'
import { useTreejerGraph } from '../hooks/useTreejerGraph'

const { Title, Text } = Typography

const RegenArt = () => {
  ReactGA.initialize('G-L9J2W0LSQS')
  ReactGA.send('pageview')

  const { address, targetNetwork, userSigner, isLoadingAccount } = useContext(NetworkContext)
  const { contracts, writeContracts, yourKTBalance, yourETBalance } = useContext(WalletContext)
  const [isBCTAmountApproved, setIsBCTAmountApproved] = useState()
  const [isDAIAmountApproved, setIsDAIAmountApproved] = useState()
  const [buying, setBuying] = useState()
  const [buyingEnt, setBuyingEnt] = useState()
  const [buyingTreejer, setBuyingTreejer] = useState()
  const [approvingBCT, setApprovingBCT] = useState()
  const [approvingDAI, setApprovingDAI] = useState()
  const { collection: artGallery, isLoading } = useTreejerGraph(address)
  const treeAddress = contracts?.KoyweCollectibles?.address
  const treejerAddress = contracts?.TREEJER?.address

  const mintPrice = useContractReader(contracts, 'KoyweCollectibles', 'bctPrice', HOOK_OPTIONS)
  const isOpen = useContractReader(contracts, 'KoyweCollectibles', 'mintOpen', HOOK_OPTIONS)

  const mintPriceEnt = useContractReader(contracts, 'ENT', 'mintPrice', HOOK_OPTIONS)
  const isEntOpen = useContractReader(contracts, 'ENT', 'saleIsActive', HOOK_OPTIONS)

  const mintPriceTreejer = useContractReader(contracts, 'TREEJER', 'price', HOOK_OPTIONS)

  const vendorApproval = useContractReader(contracts, 'PBCT', 'allowance', [address, treeAddress], HOOK_OPTIONS)
  const vendorApprovalDAI = useContractReader(contracts, 'DAI', 'allowance', [address, treejerAddress], HOOK_OPTIONS)

  const gasPrice = useGasPrice(targetNetwork, 'fast')
  const tx = Transactor(userSigner, gasPrice)

  const handleApproveBCT = async () => {
    setApprovingBCT(true)
    await tx(writeContracts.PBCT.approve(contracts.KoyweCollectibles.address, mintPrice))
    setApprovingBCT(false)
  }

  const handleApproveDAI = async () => {
    setApprovingDAI(true)
    await tx(writeContracts.DAI.approve(contracts.TREEJER.address, mintPriceTreejer))
    setApprovingDAI(false)
  }

  const handleMint = async () => {
    setBuying(true)
    await tx(writeContracts.KoyweCollectibles.mintItem())
    setBuying(false)
  }

  const handleMintEnt = async () => {
    setBuyingEnt(true)
    await tx(writeContracts.ENT.discoverEnt({ value: mintPriceEnt }))
    setBuyingEnt(false)
  }

  const handleMintTreejer = async () => {
    setBuyingTreejer(true)
    await tx(writeContracts.TREEJER.fundTree(1, '0x4218A70C7197CA24e171d5aB71Add06a48185f6a', address))
    setBuyingTreejer(false)
  }

  useEffect(() => {
    if (vendorApproval && mintPrice) setIsBCTAmountApproved(vendorApproval.gte(mintPrice))
  }, [mintPrice, vendorApproval])

  useEffect(() => {
    if (vendorApprovalDAI && mintPriceTreejer) setIsDAIAmountApproved(vendorApprovalDAI.gte(mintPriceTreejer))
  }, [mintPriceTreejer, vendorApprovalDAI])

  return (
    <Row className="flex-center">
      <Col span={20}>
        <Space direction="vertical" style={{ marginBottom: '1rem', marginTop: '1rem', width: '100%' }}>
          <Title>NFT Collections</Title>
          <Text>Choose your favorite collection and buy it from here</Text>
          <Space direction="vertical" style={{ marginTop: '1rem', width: '100%' }}>
            <NftCard
              title="Koywe Trees"
              mintPrice={mintPrice}
              address={address}
              isBCTAmountApproved={isBCTAmountApproved}
              buying={buying}
              handleApproveBCT={handleApproveBCT}
              handleMint={handleMint}
              approving={approvingBCT}
            />
          </Space>
          <Space direction="vertical" style={{ marginTop: '1rem', width: '100%' }}>
            <NftCardEnt
              title="Endangered Tokens"
              mintPrice={mintPriceEnt}
              address={address}
              buyingEnt={buyingEnt}
              handleMintEnt={handleMintEnt}
            />
          </Space>
          <Space direction="vertical" style={{ marginTop: '1rem', width: '100%' }}>
            <NftCardTreejer
              title="Treejer Protocol"
              mintPrice={mintPriceTreejer}
              address={address}
              isTokenAmountApproved={isDAIAmountApproved}
              buying={buyingTreejer}
              handleApproveToken={handleApproveDAI}
              handleMint={handleMintTreejer}
              approving={approvingDAI}
            />
          </Space>
          {address && (
            <>
              <h2 style={{ padding: 8, marginTop: 32 }}>Koywe Trees</h2>
              <KoyweTrees address={address} yourKTBalance={yourKTBalance} contracts={contracts} />
            </>
          )}
          {address && (
            <>
              <h2 style={{ padding: 8, marginTop: 32 }}>Endangered Keule Trees, by Ent Foundation</h2>
              <p>
                Also, check out your ENT collection.{' '}
                <a href="https://elders.tokents.org/" target="_blank">
                  If the list is empty or you want to get more, go here↗️
                </a>
                <br />This is very special project to protect endangered Keule trees in Chile. There will only be 25 NFTs, each of which represents a unique individual, ensuring its protection for a long time. Become a Keule Guardian.
              </p>
              <EntTrees address={'address'} yourETBalance={yourETBalance} contracts={contracts} />
            </>
          )}
          {address && (
            <>
              <h2 style={{ padding: 8, marginTop: 32 }}>Treejer Trees</h2>
              <p>
                Also, check out your Treejer collection.{' '}
                <a href="https://treejer.com/" target="_blank">
                  If the list is empty or you want to get more, go here↗️
                </a>
                <br />Treejer is an open protocol to fund trees around the world, initially in Perú and Argentina.
              </p>
              {!isLoadingAccount && address && <MyRegenArt artGallery={artGallery} isLoading={isLoading} />}
            </>
          )}
        </Space>
      </Col>
      {isLoadingAccount && !address && <ConnectButton />}
    </Row>
  )
}

export default RegenArt
