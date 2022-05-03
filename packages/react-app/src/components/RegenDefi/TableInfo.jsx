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

export const TableInfo = ({ data, handleModalUp }) => {
  const columns = [
    {
      title: 'Token',
      dataIndex: 'token',
      key: 'token',
      render: tokenProp => (
        <Row justify="space-between" align="middle">
          <a href={tokenProp.url} target="_blank">
            <Text>{tokenProp.title}</Text>
          </a>
          <a href={tokenProp.url} target="_blank">
            <Image src={tokenProp.icon} preview={false} height={42} />
          </a>
        </Row>
      ),
    },
    {
      title: 'Position (USD)',
      dataIndex: 'position',
      key: 'position',
    },
    {
      title: 'CO2 value (tons)',
      dataIndex: 'co2',
      key: 'co2',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Contract',
      dataIndex: 'contract',
      key: 'contract',
      render: contract => (
        <Row justify="space-between" align="middle">
          <Text>{contract.title}</Text>
          <a href={contract.url} target="_blank">
            <Image src="icon/leave.svg" preview={false} height={24} />
          </a>
        </Row>
      ),
    },
    {
      title: 'Action',
      dataIndex: 'buy',
      key: 'buy',
      render: props => handleModalUp && props.meta && props.meta === 'index' ?
      <StyledButton
        onClick={() => {
          handleModalUp(props.symbol)
        }}
        $type="primary">{props.title}
      </StyledButton>
      :
      <StyledButton href={props.url} target="_blank" $type="primary">{props.title}</StyledButton>,
    },
  ]

  return <>{data.length > 0 && <StyledTable columns={columns} dataSource={data} pagination={false} />}</>
}
