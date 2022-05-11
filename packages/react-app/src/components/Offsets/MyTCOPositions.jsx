import React, { useContext, useEffect, useState } from 'react'
import { Col, Row, Typography } from 'antd'

import { IndexContext } from '../../contexts/IndexContext'
import { WalletContext } from '../../contexts/WalletContext'
import { createTableData } from '../../helpers/createTableData'
import { StyledButton } from '../common/StyledButton'

import { TCOTableInfo } from './TCOTableInfo'

const { Title } = Typography
const { utils } = require('ethers')
const MyTCOPositions = ({ handleModalUp, tcoBalances }) => {
  const [showAll, setShowAll] = useState(false)
  const [tableData, setTableData] = React.useState([])



  useEffect(() => {
    if (tcoBalances) {
      let key = 0
      const tableData = tcoBalances.map(token => {
        key++

        return ({
          key,
          'token': {
            title: token.symbol,
            url: 'https://toucan.earth/',
          },
          co2: Number(utils.formatEther(token.balance)).toFixed(2),
          contract: {
            title: token.address,
            url: `https://polygonscan.com/address/${token.address}`,
          },
          buy: {
            symbol: token.symbol,
          },
        })
      })

      setTableData(tableData)
    }
  }, [tcoBalances])

  return (
    <>
      <Row>
        <Col span={24}>
          <Title level={2}>TCO Tokens</Title>
          <TCOTableInfo data={tableData} handleModalUp={handleModalUp} />
        </Col>
      </Row>
    </>
  )
}

export default MyTCOPositions
