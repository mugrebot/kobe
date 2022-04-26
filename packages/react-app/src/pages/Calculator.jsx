import ReactGA from 'react-ga4'
import { Col, Row } from 'antd'

import EmailSection from '../components/CalculatorForms/EmailSection'
import { Diet } from '../components/steps/Diet'
import { Energy } from '../components/steps/Energy'
import Expense from '../components/steps/Expense'
import { Home } from '../components/steps/Home'
import { Property } from '../components/steps/Property'
import { Ready } from '../components/steps/Ready'
import { Transport } from '../components/steps/Transport'
import { CalculatorProvider } from '../contexts/CalculatorContext'
import useFormStep from '../hooks/useFormStep'

const Index = () => {
  ReactGA.initialize('G-L9J2W0LSQS')
  ReactGA.send('pageview')

  const { step, nextStep, backStep } = useFormStep()

  return (
    <CalculatorProvider>
      <Row justify="center">
        <Col span={24}>
          {step === 0 && <Home nextStep={nextStep} />}
          {step === 1 && <Ready nextStep={nextStep} />}
          {step === 2 && <Transport nextStep={nextStep} backStep={backStep} />}
          {step === 3 && <Energy nextStep={nextStep} backStep={backStep} />}
          {step === 4 && <Diet nextStep={nextStep} backStep={backStep} />}
          {step === 5 && <Property nextStep={nextStep} backStep={backStep} />}
          {step === 6 && <Expense nextStep={nextStep} backStep={backStep} />}
          {step === 7 && <EmailSection />}
        </Col>
      </Row>
    </CalculatorProvider>
  )
}

export default Index
