/*global chrome*/
import { useEffect, useMemo, useState } from 'react'
import './App.css'
import { DateTime } from 'luxon'
import { Button, Select, Stack, Text } from '@chakra-ui/react'
import ZoneCard from './Components/ZoneCard'
import SearchSelect from './Components/SearchSelect'

export const categoryColors = {
  "0": "#8DCFD0",
  "1": "#FFCC6D",
  "2": "#F98A7F",
}


function App() {

  const [localHour, setLocalHour] = useState(() => DateTime.now().toMillis())
  const [zonesList, setZonesList] = useState([])

  const timeBars = useMemo(() => {

    const start = DateTime.now().minus({ days: 1 }).startOf('day').toMillis()
    const end = DateTime.now().endOf('day').toMillis()
    const diffTime = end - start
    const timeBars = []
    let oldTime = 0
    let lastZone = 0

    const arr = [...zonesList, { zoneName: "local" }]

    for (let i = start; i < end + 1000; i += 15 * 60 * 1000) {

      let actualTime = 0

      arr.forEach((zone) => {
        const localTime = DateTime.fromMillis(i).setZone(zone.zoneName)
        const zoneTime = (localTime.hour >= 7 && localTime.hour <= 20) ? (localTime.hour >= 8 && localTime.hour <= 18) ? 0 : 1 : 2;
        actualTime = zoneTime > actualTime ? zoneTime : actualTime
      })

      if (i === start)
        lastZone = actualTime

      if (lastZone !== actualTime) {
        const compareTime = timeBars.length > 0 ? i : i - start
        timeBars.push({ zone: lastZone, percent: (compareTime - oldTime) / diffTime })
        oldTime = i
        lastZone = actualTime
      }

      if (i >= end) {
        timeBars.push({ zone: actualTime, percent: (i - oldTime) / diffTime })
      }

    }

    return timeBars

  }, [zonesList])


  useEffect(() => {
    chrome.storage?.local.get(['myZones'], (result) => {
      if (result.myZones)
        setZonesList(result.myZones)
    })
  }, [])

  const updateLocalStorage = (list) => {
    chrome.storage?.local.set({ myZones: list })
  }

  const addNewZone = (newZone) => {
    console.log("addNewZone", newZone)
    setZonesList([...zonesList, { name: newZone, zoneName: newZone }])
    updateLocalStorage([...zonesList, { name: newZone, zoneName: newZone }])
  }

  const editZoneName = (zoneIndex, name) => {

    console.log("editZoneName", zoneIndex, name)

    const newZonesList = JSON.parse(JSON.stringify(zonesList))
    newZonesList[zoneIndex].name = name
    setZonesList(newZonesList)
    updateLocalStorage(newZonesList)
  }

  const removeZoneCard = (zoneIndex) => {
    const newZonesList = [...zonesList]
    newZonesList.splice(zoneIndex, 1)
    setZonesList(newZonesList)
    updateLocalStorage(newZonesList)
  }

  return (
    <>
      <Stack direction='row' w={'100%'} justifyContent={'space-between'}>
        <Stack direction='column' w={'100%'} alignItems={"start"} margin={0}>

          <div
            style={{ width: '100%', position: 'relative', marginBottom: "2em" }}
          >
            <div style={{ width: '100%', display: 'flex', position: 'absolute', top: 0, left: 0, border: "solid 2px #545454", borderRadius: "0.5em" }}>
              {timeBars.map((bar) => {
                return <div style={{ width: `${bar.percent * 100}%`, backgroundColor: categoryColors[bar.zone], height: '1em', borderRight: "solid 2px #545454" }}></div>
              })}
            </div>
            <input
              style={{ width: '100%', position: 'absolute', top: 0, left: 0 }}
              type="range"
              step={15 * 60 * 1000}
              min={DateTime.now().minus({ days: 1 }).startOf('day').toMillis()}
              max={DateTime.now().endOf('day').toMillis()}
              value={localHour} onChange={(e) => { setLocalHour(e.target.valueAsNumber) }}
            />
          </div>
          <Text
            fontFamily={"Share , sans-serif"}
            fontSize={"20px"}
            color={"#545454"}
            fontWeight={"bold"}
            fontStyle={"italic"}
          >{DateTime.fromMillis(localHour).toLocaleString(DateTime.DATETIME_MED)} </Text>
        </Stack>
      <SearchSelect options={Intl.supportedValuesOf('timeZone')} onChange={(newZone) => { addNewZone(newZone) }} />
      </Stack>

      <ZoneCard key={"Local Time"} time={localHour} zoneName={DateTime.fromMillis(localHour).zoneName} name={"Hora Local"} />
      {zonesList.map((zone, index) => {
        return <ZoneCard
          key={zone.zoneName}
          time={localHour}
          zoneName={zone.zoneName}
          name={zone.name}
          editZoneName={editZoneName}
          removeZoneCard={removeZoneCard}
          zoneIndex={index} />
      })}

    </>
  )
}

export default App
