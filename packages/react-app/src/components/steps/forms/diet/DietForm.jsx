import { Col, Select } from 'antd'

const { Option } = Select

import { RowLayout } from '../../layouts/RowLayout'
import { SelectLayout } from '../../layouts/SelectLayout'

export const DietForm = ({ formData, onChange }) => {
  const { averageDiet } = formData

  return (
    <RowLayout align="middle" icon="icon/diet.svg" title="Dieta">
      <Col span={24}>
        <SelectLayout label="How is your diet?">
          <Select
            placeholder="Choose"
            style={{ width: '100%' }}
            size="large"
            value={averageDiet}
            onChange={value => onChange(value, 'averageDiet')}
          >
            <Option value="Carnívoro">Carnivore</Option>
            <Option value="Omnívoro">Omnivore</Option>
            <Option value="Pescetariana">Pescatarian</Option>
            <Option value="Vegetariana">Vegetarian</Option>
            <Option value="Vegana">Vegan</Option>
          </Select>
        </SelectLayout>
      </Col>
    </RowLayout>
  )
}
