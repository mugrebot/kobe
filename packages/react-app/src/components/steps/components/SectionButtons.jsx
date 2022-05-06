import { Col, Row } from 'antd'

import { StyledButton } from '../../common/StyledButton'

/**
  type SectionButtonsProps = {
    nextStep: (value?: number) => void
    backStep: (value?: number) => void
  }
*/

export const SectionButtons = ({
  nextStep,
  backStep,
  loading,
}) => {
  return (
    <Row style={{ margin: '32px 0px' }}>
      <Col offset={6} span={16}>
        <Row justify="space-between">
          <Col span={10}>
            <StyledButton $type="gray" block onClick={() => backStep()} disabled={loading}>
              Volver
            </StyledButton>
          </Col>
          <Col span={10}>
            <StyledButton $type="primary" block onClick={() => nextStep()} disabled={loading}>
              Siguiente
            </StyledButton>
          </Col>
        </Row>
      </Col>
    </Row>
  )
}
