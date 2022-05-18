import React, { useContext } from 'react'
import { Alert, Select } from 'antd'
import styled from 'styled-components'

import { networkOptions, NETWORKS } from '../../constants'
import { NetworkContext } from '../../contexts/NetworkContext'
import { checkNetwork } from '../../helpers/checkNetwork'

const { Option } = Select

const StyledSelect = styled(Select)`
  min-width: 7.5rem;
  width: 100%;
  margin-top: 0.188rem;
  text-transform: capitalize;
`
const NetworkSelect = ({ NETWORKCHECK }) => {
  const { localChainId, selectedChainId, setSelectedNetwork, targetNetwork } = useContext(NetworkContext)
  const networkError = checkNetwork(localChainId, selectedChainId, targetNetwork)

  return (
    <div style={{ position: 'relative', textAlign: 'right' }}>
      <div style={{ display: 'flex', flex: 1, alignItems: 'center' }}>
        <div style={{ marginRight: 20 }}>
        </div>
      </div>
      {networkError && NETWORKCHECK && (
        <div
          style={{
            zIndex: 2,
            position: 'fixed',
            right: 168,
            width: 100,
            top: 85,
            padding: 16,
          }}
        >
          <Alert
            message={networkError.message}
            description={networkError.description}
            type="error"
            closable={false}
            style={{ width: 250, textAlign: 'center' }}
          />
        </div>
      )}
    </div>
  )
}

export default NetworkSelect
