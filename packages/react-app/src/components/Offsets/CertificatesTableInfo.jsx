import { Link } from 'react-router-dom'
import { Image, Row, Table, Typography } from 'antd'
import styled from 'styled-components'

import { StyledButton } from '../common/StyledButton'

const { Text } = Typography
const StyledTable = styled(Table)`
  border: 1px solid rgba(0, 0, 0, 0.16);
  border-radius: 10px;
  overflow: hidden;
  width: 100%;
`

export const CertificatesTableInfo = ({ data }) => {
  const columns = [
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'CO2 Tons',
      dataIndex: 'co2',
      key: 'co2',
    },
    {
      title: 'Project Name',
      dataIndex: 'project',
      key: 'project',
    },
    {
      title: 'Details',
      dataIndex: 'details',
      key: 'details',
      render: props =>
        <StyledButton href={props.url} target="_blank" $type="primary">{props.title}</StyledButton>,
    },
  ]

  return <>{data.length > 0 && <StyledTable columns={columns} dataSource={data} pagination={false} />}</>
}
