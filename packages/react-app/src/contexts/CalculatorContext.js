import React, { useEffect,useState } from 'react'

const CalculatorContext = React.createContext({
  email: undefined,
  setEmail: () => undefined,
  country: 'Chile', // hay que usar el país determinado por IP
  setCountry: () => undefined,
  countryCode: 'CHL', // hay que usar el país determinado por IP
  setCountryCode: () => undefined,
  advanced: false,
  setAdvanced: () => undefined,
  accessToken: undefined,
  setToken: () => undefined,
  graphValues: {},
  setGraphValues: () => undefined,
})

export const CalculatorProvider = ({ children }) => {
  const [email, setEmail] = useState(null)
  const [country, setCountry] = useState('Chile')
  const [countryCode, setCountryCode] = useState('CHL')
  const [advanced, setAdvanced] = useState(false)
  const [accessToken, setToken] = useState(null)
  const [graphValues, setGraphValues] = useState({})

  useEffect(() => {
    fetch('https://ipapi.co/json/')
      .then(res => res.json())
      .then(response => {
        setCountry(response.country_name)
        setCountryCode(response.country_code_iso3)
      })
      .catch((data, status) => {
        console.log('Request failed:', data)
      })
  }, [setCountry, setCountryCode])

  const value = {
    email,
    setEmail,
    country,
    setCountry,
    countryCode,
    setCountryCode,
    advanced,
    setAdvanced,
    accessToken,
    setToken,
    graphValues,
    setGraphValues,
  }

  return <CalculatorContext.Provider value={value}>{children}</CalculatorContext.Provider>
}

export default CalculatorContext
