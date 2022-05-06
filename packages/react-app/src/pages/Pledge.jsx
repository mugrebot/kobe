import React, { useContext } from 'react'
import ReactGA from 'react-ga4'
import { Col, Row, Typography } from 'antd'

import PledgeDisplay from '../components/pledge/PledgeDisplay'
import PledgedReduceCO2 from '../components/PledgedReduceCO2'
import { StyledIcon } from '../components/StyledIcon'
import { NetworkContext } from '../contexts/NetworkContext'
import { WalletContext } from '../contexts/WalletContext'

const { Title, Paragraph } = Typography

const Pledge = () => {
  ReactGA.initialize('G-L9J2W0LSQS')
  ReactGA.send('pageview')

  const { address } = useContext(NetworkContext)
  const { isPledged, tonsPledged } = useContext(WalletContext)

  return (
    <Row justify="center" style={{ marginBottom: '5rem' }}>
      {isPledged && tonsPledged && <PledgeDisplay tonsPledged={tonsPledged} />}
      <Col span={24}>
        <Title style={{ textAlign: 'center', fontSize: 36 }}>First... The Pledge</Title>
      </Col>
      <Col xl={13} xs={22}>
        <Paragraph style={{ fontSize: 24, lineHeight: '2.5rem' }}>
          This pledge is nothing more than a public commitment to do better. To be in charge of our emissions. To take
          ownership of a part of the effort. It doesn&apos;t need to be exact, but it does need to come from your heart.
          There are 60 million CO2e tons emitted every year. <br />
          We ask you to make a commitment, just like our nation&apos;s leaders have, to offset/reduce your annual CO2
          footprint. Now the important....your pledge
        </Paragraph>
      </Col>
      <Col xl={13} xs={22}>
        <Paragraph style={{ fontSize: 24, lineHeight: '3rem' }}>
          <ul>
            <li>
              I hereby pledge to do my best to save the planet. <StyledIcon src={'icon/planet.svg'} preview={false} />
            </li>
            <li>
              I pledge to do my best to reduce emissions, by consuming less or by being more conscious about my
              decisions.
              <StyledIcon src={'icon/burger.svg'} preview={false} />{' '}
              <StyledIcon src={'icon/recycle.svg'} preview={false} />
            </li>
            <li>
              I pledge to help others in their paths to help the planet.{' '}
              <StyledIcon src={'icon/humans.svg'} preview={false} />
            </li>
            <li>I pledge to contribute, with money or time as long as I am able, to other people in my community.</li>
          </ul>
        </Paragraph>
      </Col>
      <Col xl={13} xs={22}>
        <Paragraph style={{ fontSize: 24, lineHeight: '3rem' }}>
          <ul>
            <li>
              I pledge to grow a Forest, to be a Forest within my community, to take small, steady, and concrete steps
              to protect and help everyone adapt to the stormy weather.{' '}
              <StyledIcon src={'icon/tree.svg'} preview={false} />
              <StyledIcon src={'icon/tree.svg'} preview={false} />
              <StyledIcon src={'icon/tree.svg'} preview={false} />
            </li>
          </ul>
        </Paragraph>
      </Col>

      {address && (
        <Col xl={13} xs={22}>
          <PledgedReduceCO2 isPledged={isPledged} address={address} />
        </Col>
      )}
    </Row>
  )
}

export default Pledge
