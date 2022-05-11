import React, { useContext, useEffect, useState } from 'react'
import { Col, Row, Typography } from 'antd'

// import { IndexContext } from '../../contexts/IndexContext'
// import { WalletContext } from '../../contexts/WalletContext'
// import { createTableData } from '../../helpers/createTableData'
// import { StyledButton } from '../common/StyledButton'
import { CertificatesTableInfo } from './CertificatesTableInfo'

const { Title } = Typography
const { utils, BigNumber } = require('ethers')
const MyCertificates = ({ data }) => {
  const [showAll, setShowAll] = useState(false)
  const [tableData, setTableData] = React.useState([])



  useEffect(() => {
    if (data) {
      let key = 0
      const tableData = data.map(token => {
        key++

        return ({
          key,
          'date': `${(new Date(token.createdAt.toString() * 1000)).toDateString()}, ${(new Date(token.createdAt.toString() * 1000)).toLocaleTimeString('es-ES')}`,
          co2: Number(utils.formatEther(token.retiredAmount)).toFixed(2),
          project: token.retiringEntityString,
          details: {
            url: 'https://toucan.earth/retirements',
            title: 'Show Details',
          },
        })
      })

      setTableData(tableData)
    }
  }, [data])

  return (
    <>
      <Row>
        <Col span={24}>
          <Title level={2}>Offset Certificates</Title>
          <CertificatesTableInfo data={tableData} />
        </Col>
      </Row>
    </>
  )
}

export default MyCertificates
