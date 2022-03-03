import { InputNumber } from 'antd'

/**
  type InputPriceProps = {
    placeholder?: string
    size?: SizeType
    prefix?: string
    min?: number
  }
*/

export const InputPrice = ({
  placeholder = '',
  size = 'large',
  prefix = '$',
  min = 0,
}) => {
  return (
    <>
      <InputNumber
        min={min}
        prefix={prefix}
        placeholder={placeholder}
        size={size}
        style={{ width: '100%' }}
      />
    </>
  )
}
