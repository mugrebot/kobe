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
  data = data.filter(t => {
    return t.buy.symbol === 'BCT' || t.buy.symbol === 'NCT' || t.buy.symbol === 'TCO2'
  })

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
            <Image src={tokenProp.icon} preview={false} height={42} width={42} />
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
      title: 'Position (units)',
      dataIndex: 'co2',
      key: 'co2',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Action',
      dataIndex: 'buy',
      key: 'buy',
      render: props => handleModalUp && props.symbol ?
      <StyledButton
        onClick={() => {
          handleModalUp(props.symbol)
        }}
        $type="primary">Redeem for TCO2
      </StyledButton>
      :
      <StyledButton href={props.url} target="_blank" $type="primary">{props.title}</StyledButton>,
    },
  ]

  return <>{data.length > 0 && <StyledTable columns={columns} dataSource={data} pagination={false} />}</>
}
