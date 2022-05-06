import { Col, InputNumber, Row } from 'antd'

import { StyledDivider } from '../../components/StyledDivider'
import { InputLayout } from '../../layouts/InputLayout'
import { RowLayout } from '../../layouts/RowLayout'

// eslint-disable-next-line max-lines-per-function
export const EnergyForm = ({ formData, onChange }) => {
  const { peopleLive, homeBig, electricityConsume, liquefiedGasConsume, naturalGasConsume, waterConsume } = formData

  return (
    <>
      <RowLayout icon="icon/house.svg" title="Home">
        <Row align="middle">
          <Col span={10}>
            <InputLayout label="How many people live in your home?">
              <InputNumber
                min={0}
                placeholder="2"
                size="large"
                style={{ width: '100%' }}
                value={peopleLive}
                onChange={value => onChange(value, 'peopleLive')}
              />
            </InputLayout>
          </Col>
          <Col span={14}>
            <Col span={22}>
              <InputLayout label="How big is your house? (m2)" margin={false}>
                <InputNumber
                  min={0}
                  placeholder="200 m2"
                  size="large"
                  style={{ width: '100%' }}
                  value={homeBig}
                  onChange={value => onChange(value, 'homeBig')}
                />
              </InputLayout>
            </Col>
          </Col>
        </Row>
      </RowLayout>
      <StyledDivider />
      <RowLayout align="middle" icon="icon/electricity.svg" title="Electricity">
        <InputLayout
          label="How much electricity do you consume per month?"
          tooltip
          tooltipText="You can check on your electricity bill"
        >
          <InputNumber
            min={0}
            placeholder="200 kw"
            size="large"
            style={{ width: '100%' }}
            value={electricityConsume}
            onChange={value => onChange(value, 'electricityConsume')}
          />
        </InputLayout>
      </RowLayout>
      <StyledDivider />
      <RowLayout align="middle" icon="icon/gas.svg" title="Gas">
        <InputLayout label="How much liquefied gas do you consume per month?" tooltip tooltipText="">
          <InputNumber
            min={0}
            placeholder="15 kgs"
            size="large"
            style={{ width: '100%' }}
            value={liquefiedGasConsume}
            onChange={value => onChange(value, 'liquefiedGasConsume')}
          />
        </InputLayout>
        <InputLayout
          label="How much natural gas do you consume per month?"
          tooltip
          tooltipText="You can check on your gas bill"
        >
          <InputNumber
            min={0}
            placeholder="20 m3"
            size="large"
            style={{ width: '100%' }}
            value={naturalGasConsume}
            onChange={value => onChange(value, 'naturalGasConsume')}
          />
        </InputLayout>
      </RowLayout>
      <StyledDivider />
      <RowLayout align="middle" icon="icon/water.svg" title="Water">
        <InputLayout label="How much water do you consume per month?">
          <InputNumber
            min={0}
            placeholder="12 lts"
            size="large"
            style={{ width: '100%' }}
            value={waterConsume}
            onChange={value => onChange(value, 'waterConsume')}
          />
        </InputLayout>
      </RowLayout>
    </>
  )
}
