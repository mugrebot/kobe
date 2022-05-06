import { useContext, useState } from 'react'

import CalculatorContext from '../../contexts/CalculatorContext'
import { useForm } from '../../hooks/useForm'

import { Header } from './components/Header'
import { Information } from './components/Information'
import { SectionButtons } from './components/SectionButtons'
import { Stats } from './components/Stats'
import { TransportForm } from './forms/transport/TransportForm'
import { TransportFormAdvanced } from './forms/transport/TransportFormAdvanced'
import { ContentLayout } from './layouts/content/ContentLayout'
import { LeftLayout } from './layouts/content/LeftLayout'
import { MiddleLayout } from './layouts/content/MiddleLayout'
import { RightLayout } from './layouts/content/RightLayout'

export const Transport = ({ nextStep, backStep }) => {
  const { advanced, accessToken, setGraphValues, graphValues } = useContext(CalculatorContext)
  const [loading, setLoading] = useState(false)

  const { formData, onChange } = useForm({})

  const handleNext = () => {
    const data = {
      kms_per_month: formData?.monthlyKms,
      fuel_type_auto: formData?.fuelType,
      weekly_kms_by_bus: formData?.weeklyBusKms,
      plane_trips_per_year: formData?.planeTrips,
      ...(!advanced && { airplane_trips_per_year: formData.airplaneTrips }),
      bearerToken: accessToken,
      ...(advanced && {
        average_consumption: formData?.averageConsumption,
        weekly_kms_in_uber_taxi_or_similar: formData?.weeklyTaxiKms,
        weekly_kms_by_metro_or_train: formData?.weeklyTrainKms,
        airplane_trips_per_year_1: formData.airplaneTripsA,
        air_travel_per_year_2: formData.airplaneTripsB,
        airplane_trips_per_year_3: formData.airplaneTripsC,
      }),
    }

    setLoading(true)

    const endpoint = advanced ? 'transportation-detailed' : 'transporte-simplificada'

    fetch(`https://koywecalc.herokuapp.com/api/v1/${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
      .then(async res => {
        const responseData = await res.json()

        if (responseData.success)
          // setGraphValues(prevState => ({ ...prevState, transport: 10 })) // reemplazar el valor por el de la api de 1 a 100

          nextStep()
        else return Promise.reject(responseData.message)
      })
      .catch(err => {
        console.log(err)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  return (
    <>
      <Header
        title="Section N° 1 - Transport"
        subtitle="This section is very important because transport is usually where we emmit the most."
      />
      <ContentLayout>
        <LeftLayout>
          <Stats graphValues={graphValues} />
        </LeftLayout>
        <MiddleLayout>
          {!advanced && <TransportForm formData={formData} onChange={onChange} />}
          {advanced && <TransportFormAdvanced formData={formData} onChange={onChange} />}
          <SectionButtons nextStep={handleNext} backStep={backStep} loading={loading} />
        </MiddleLayout>
        <RightLayout>
          <Information />
        </RightLayout>
      </ContentLayout>
    </>
  )
}
