import React from 'react'
import { Route, Switch } from 'react-router-dom'

import { MainLayout } from './components/layouts/MainLayout'
import { IndexContextProvider } from './contexts/IndexContext'
import { IsPledgedProvider } from './contexts/IsPledgedContext'
import { WalletContextProvider } from './contexts/WalletContext'
import CalculatorPage from './pages/Calculator'
import Dashboard from './pages/Dashboard'
import DebugPage from './pages/DebugPage'
import EmissionPage from './pages/Emission'
import Journey from './pages/Journey'
import Metrics from './pages/metrics'
import Offsets from './pages/Offsets'
import Pledge from './pages/Pledge'
import Ranking from './pages/Ranking'
import ReFi from './pages/ReFi'
import RegenArt from './pages/RegenArt'

import 'antd/dist/antd.css'
import './styles/index.css'

const App = () => {
  return (
    <WalletContextProvider>
      <IsPledgedProvider>
        <IndexContextProvider>
          <MainLayout NETWORKCHECK>
            <Switch>
              <Route exact path={['/','/dashboard']}>
                <Dashboard />
              </Route>
              <Route exact path="/ranking">
                <Ranking />
              </Route>
              <Route exact path="/regen-art">
                <RegenArt />
              </Route>
              <Route exact path="/pledge">
                <Pledge />
              </Route>
              <Route exact path="/journey">
                <Journey />
              </Route>
              <Route path="/regen-defi">
                <ReFi />
              </Route>
              <Route exact path="/debug">
                <DebugPage />
              </Route>
              <Route exact path="/emission">
                <EmissionPage />
              </Route>
              <Route exact path="/calculator">
                <CalculatorPage />
              </Route>
              <Route exact path="/offsets">
                <Offsets />
              </Route>
              <Route exact path="/metrics">
                <Metrics />
              </Route>
            </Switch>
          </MainLayout>
        </IndexContextProvider>
      </IsPledgedProvider>
    </WalletContextProvider>
  )
}

export default App
