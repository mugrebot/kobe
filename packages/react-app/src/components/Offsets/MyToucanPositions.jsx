import React, { useContext, useEffect, useState } from 'react'
import { Col, Row, Typography } from 'antd'

import { IndexContext } from '../../contexts/IndexContext'
import { WalletContext } from '../../contexts/WalletContext'
import { createTableData } from '../../helpers/createTableData'
import { StyledButton } from '../common/StyledButton'

import { TableInfo } from './TableInfo'

const { Title } = Typography
const MyToucanPositions = ({ handleModalUp }) => {
  const [showAll, setShowAll] = useState(false)
  const { USDPrices, walletBalance } = useContext(WalletContext)
  const { indexUSDPrices } = useContext(IndexContext)
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
      const tableData = createTableData(USDPrices, BTC, MCO2, NCT, KLIMA, sKLIMA, CNBED, CBTC, indexUSDPrices)

      setTableData(tableData)
    }
  }, [USDPrices, BTC, MCO2, NCT, KLIMA, sKLIMA, CNBED, CBTC, indexUSDPrices])

  return (
    <>
      <Row>
        <Col span={24}>
          <TableInfo data={tableData} handleModalUp={handleModalUp} />
        </Col>
      </Row>
    </>
  )
}

export default MyToucanPositions
