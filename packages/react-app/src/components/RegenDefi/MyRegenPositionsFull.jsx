import React, { useContext, useEffect, useState } from 'react'
import { Col, Row, Typography } from 'antd'
import { ethers, utils } from 'ethers'
import { BigNumber } from 'set.js'

import { IndexContext } from '../../contexts/IndexContext'
import { WalletContext } from '../../contexts/WalletContext'
import { createTableData } from '../../helpers/createTableData'
import { StyledButton } from '../common/StyledButton'

import { TableInfo } from './TableInfo'

const { Title } = Typography
const MyRegenPositions = ({ handleModalUp }) => {
  const [showAll, setShowAll] = useState(false)
  const { USDPrices, walletBalance } = useContext(WalletContext)
  const { indexListed, indexContextDetails, WETHProportion, BTCProportion, DPIProportion, NCTProportion, CWBTCProportion, CNTCProportion } = useContext(IndexContext)
  const {
    polygonBCTBalance: BTC,
    polygonMCO2Balance: MCO2,
    polygonNCTBalance: NCT,
    polygonKlimaBalance: KLIMA,
    polygonSKlimaBalance: sKLIMA,
    polygonCNBEDBalance: CNBED,
    polygonCBTCBalance: CBTC,
  } = walletBalance
  const [tableData, setTableData] = React.useState([])



  useEffect(() => {
    if (USDPrices && BTC && MCO2 && NCT && KLIMA && sKLIMA && CNBED && CBTC) {
      const tableData = createTableData(USDPrices, BTC, MCO2, NCT, KLIMA, sKLIMA, CNBED, CBTC, WETHProportion, BTCProportion, DPIProportion, NCTProportion, CWBTCProportion, CNTCProportion)



      setTableData(tableData)
     // console.log(indexListed, WETHProportion, BTCProportion, DPIProportion, NCTProportion, CWBTCProportion, CNTCProportion)

    }
  }, [USDPrices, BTC, MCO2, NCT, KLIMA, sKLIMA, CNBED, CBTC])

  return (
    <>
      <Row>
        <Col span={24}>
          <Title level={2}>Your regen positions</Title>
          <TableInfo data={showAll ? tableData : tableData.slice(0, 3)} handleModalUp={handleModalUp} />
        </Col>
      </Row>
      <Row justify="center" className="my-md">
        <StyledButton $type="primary" onClick={() => setShowAll(showAll => !showAll)}>
          {!showAll ? 'See all my tokens' : 'Hide some tokens'}
        </StyledButton>
      </Row>
    </>
  )
}

export default MyRegenPositions
