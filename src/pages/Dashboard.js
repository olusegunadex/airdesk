/* This example requires Tailwind CSS v2.0+ */
import { Fragment, useEffect, useState } from 'react'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import {
  BellIcon,
  MenuIcon,
  PaperClipIcon,
  XIcon,
} from '@heroicons/react/outline'

import { useGeolocation } from 'rooks'
import axios from 'axios'
import { Listbox } from '@headlessui/react'
import { CheckIcon, SelectorIcon } from '@heroicons/react/solid'
import jeremyImg from '../assets/images/image-jeremy.png'
import airportIcon from '../assets/images/airport-edited.png'
import locationIcon from '../assets/images/locationIcon.jpg'
import infoIcon from '../assets/images/infoIcon.png'
import { DataGrid } from '@mui/x-data-grid'
import { makeStyles } from '@mui/material/styles'

// const useStyles = makeStyles({
//   root: {
//     '&.MuiDataGrid-root .MuiDataGrid-cell:focus': {
//       outline: 'none!important',
//     },
//   },
// })

const user = {
  name: 'Tom Cook',
  email: 'tom@example.com',
  imageUrl:
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
}

const navigation = [
  { name: 'Dashboard', href: '#', current: true },
  { name: 'Calendar', href: '#', current: false },
  { name: 'Weather Report', href: '#', current: false },
  { name: 'Airlines', href: '#', current: false },
  { name: 'Reports', href: '#', current: false },
]

const userNavigation = [
  { name: 'Your Profile', href: '#' },
  { name: 'Settings', href: '#' },
  { name: 'Sign out', href: '#' },
]

const nearbyColumns = [
  { field: 'country_code', headerName: 'Country Code', minwidth: 150, flex: 1 },
  { field: 'lat', headerName: 'Latitude', minwidth: 150, flex: 1 },
  { field: 'lng', headerName: 'Longitude', minwidth: 150, flex: 1 },
  {
    field: 'distance',
    headerName: 'Distance',
    minwidth: 150,
    flex: 1,
  },
  {
    field: 'name',
    headerName: 'Name',
    description: 'This column has a value getter and is not sortable.',
    sortable: false,
    minWidth: 330,
    flex: 1,
  },
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Dashboard() {
  const [when, setWhen] = useState(false)
  const geoObj = useGeolocation({
    when,
  })

  const [nearbyDataResponse, setNearbyDataResponse] = useState(null)
  const [nearbyAirportsInfo, setNearbyAirportsInfo] = useState(null)
  const [nearbyCitiesInfo, setNearbyCitiesInfo] = useState(null)
  const [selectedCityAirport, setSelectedCityAirport] = useState(null)
  const [airportStatus, setAirportStatus] = useState(false)
  // const classes = useStyles()

  async function getNearbyAirports() {
    if (geoObj.lat) {
      const api_base = 'https://airlabs.co/api/v9/'
      const api_key = 'api_key=04fc2b45-2071-4347-a147-2da4b7209633'
      const distance = '50'
      const latitude = geoObj.lat
      const longitude = geoObj.lng
      const nearbyData =
        api_base +
        'nearby?lat=' +
        latitude +
        '&lng=' +
        longitude +
        '&distance=' +
        distance +
        '&' +
        api_key
      try {
        axios.get(nearbyData).then((response) => {
          setNearbyDataResponse(response.data)
          setNearbyAirportsInfo(response.data.response.airports)
          setSelectedCityAirport(response.data.response.airports[0])
          setNearbyCitiesInfo(response.data.response.cities)
          if (response.data.response.airports) {
            setAirportStatus(true)
          }
        })
      } catch {
        console.log('An Error Just Occured')
      }
    }
  }

  console.log('nearbyAirports res:', nearbyAirportsInfo)
  console.log(nearbyDataResponse)

  console.log('airports info:', selectedCityAirport)

  useEffect(() => {
    getNearbyAirports()
  }, [geoObj])

  return (
    <>
      {/*
        This example requires updating your template:

        ```
        <html class="h-full bg-gray-100">
        <body class="h-full">
        ```
      */}
      <div className="min-h-full">
        <Disclosure as="nav" className="bg-gray-800">
          {({ open }) => (
            <>
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <img
                        className="h-8 w-8"
                        src="https://tailwindui.com/img/logos/workflow-mark-indigo-500.svg"
                        alt="Workflow"
                      />
                    </div>
                    <div className="hidden md:block">
                      <div className="ml-10 flex items-baseline space-x-4">
                        {navigation.map((item) => (
                          <a
                            key={item.name}
                            href={item.href}
                            className={classNames(
                              item.current
                                ? 'bg-gray-900 text-white'
                                : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                              'px-3 py-2 rounded-md text-sm font-medium'
                            )}
                            aria-current={item.current ? 'page' : undefined}
                          >
                            {item.name}
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="hidden md:block">
                    <div className="ml-4 flex items-center md:ml-6">
                      <button
                        type="button"
                        className="bg-gray-800 p-1 rounded-full text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
                      >
                        <span className="sr-only">View notifications</span>
                        <BellIcon className="h-6 w-6" aria-hidden="true" />
                      </button>

                      {/* Profile dropdown */}
                      <Menu as="div" className="ml-3 relative">
                        <div>
                          <Menu.Button className="max-w-xs bg-gray-800 rounded-full flex items-center text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
                            <span className="sr-only">Open user menu</span>
                            <img
                              className="h-8 w-8 rounded-full"
                              src={user.imageUrl}
                              alt=""
                            />
                          </Menu.Button>
                        </div>
                        <Transition
                          as={Fragment}
                          enter="transition ease-out duration-100"
                          enterFrom="transform opacity-0 scale-95"
                          enterTo="transform opacity-100 scale-100"
                          leave="transition ease-in duration-75"
                          leaveFrom="transform opacity-100 scale-100"
                          leaveTo="transform opacity-0 scale-95"
                        >
                          <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                            {userNavigation.map((item) => (
                              <Menu.Item key={item.name}>
                                {({ active }) => (
                                  <a
                                    href={item.href}
                                    className={classNames(
                                      active ? 'bg-gray-100' : '',
                                      'block px-4 py-2 text-sm text-gray-700'
                                    )}
                                  >
                                    {item.name}
                                  </a>
                                )}
                              </Menu.Item>
                            ))}
                          </Menu.Items>
                        </Transition>
                      </Menu>
                    </div>
                  </div>
                  <div className="-mr-2 flex md:hidden">
                    {/* Mobile menu button */}
                    <Disclosure.Button className="bg-gray-800 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
                      <span className="sr-only">Open main menu</span>
                      {open ? (
                        <XIcon className="block h-6 w-6" aria-hidden="true" />
                      ) : (
                        <MenuIcon
                          className="block h-6 w-6"
                          aria-hidden="true"
                        />
                      )}
                    </Disclosure.Button>
                  </div>
                </div>
              </div>

              <Disclosure.Panel className="md:hidden">
                <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                  {navigation.map((item) => (
                    <Disclosure.Button
                      key={item.name}
                      as="a"
                      href={item.href}
                      className={classNames(
                        item.current
                          ? 'bg-gray-900 text-white'
                          : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                        'block px-3 py-2 rounded-md text-base font-medium'
                      )}
                      aria-current={item.current ? 'page' : undefined}
                    >
                      {item.name}
                    </Disclosure.Button>
                  ))}
                </div>
                <div className="pt-4 pb-3 border-t border-gray-700">
                  <div className="flex items-center px-5">
                    <div className="flex-shrink-0">
                      <img
                        className="h-10 w-10 rounded-full"
                        src={user.imageUrl}
                        alt=""
                      />
                    </div>
                    <div className="ml-3">
                      <div className="text-base font-medium leading-none text-white">
                        {user.name}
                      </div>
                      <div className="text-sm font-medium leading-none text-gray-400">
                        {user.email}
                      </div>
                    </div>
                    <button
                      type="button"
                      className="ml-auto bg-gray-800 flex-shrink-0 p-1 rounded-full text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
                    >
                      <span className="sr-only">View notifications</span>
                      <BellIcon className="h-6 w-6" aria-hidden="true" />
                    </button>
                  </div>
                  <div className="mt-3 px-2 space-y-1">
                    {userNavigation.map((item) => (
                      <Disclosure.Button
                        key={item.name}
                        as="a"
                        href={item.href}
                        className="block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-gray-700"
                      >
                        {item.name}
                      </Disclosure.Button>
                    ))}
                  </div>
                </div>
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>

        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          </div>
        </header>
        <main>
          <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            {/* Replace with your content */}
            <div className="px-4 py-6 sm:px-0">
              <div>
                {airportStatus === false ? (
                  <div className="align-center">
                    <button
                      onClick={() => {
                        setWhen(true)
                      }}
                      className="location-button"
                    >
                      GET GEOLOCATION
                    </button>
                  </div>
                ) : (
                  <div></div>
                )}

                <div>
                  {airportStatus === true ? (
                    <div>
                      <div className="container">
                        <div className="box1">
                          <div>
                            <img
                              src={jeremyImg}
                              alt="jeremy"
                              width="100px"
                              className="userImage"
                            />
                          </div>
                          <div>
                            <p>Airport Locator</p>
                            <h2>Segun Adex</h2>
                          </div>
                        </div>

                        <div className="box2">
                          <img
                            src={locationIcon}
                            alt="airport"
                            width="100px"
                            className="airportImage"
                          />
                          <p>Your Current Location</p>
                          <h3>
                            Latitude: {geoObj.lat && JSON.stringify(geoObj.lat)}
                          </h3>
                          <h3>
                            Longitude:{' '}
                            {geoObj.lng && JSON.stringify(geoObj.lng)}
                          </h3>
                        </div>

                        <div className="box3">
                          <img
                            src={airportIcon}
                            alt="airport"
                            width="100px"
                            className="airportImage"
                          />
                          <p>Airport Closest to you</p>
                          <h3>{selectedCityAirport.name}</h3>
                        </div>

                        <div className="box4">
                          <img
                            src={infoIcon}
                            alt="airport"
                            width="100px"
                            className="airportImage"
                          />
                          <p>Airport Information</p>

                          <table>
                            <tr>
                              <td>
                                <b>IATA Code:</b>
                              </td>
                              <td>{selectedCityAirport.iata_code}</td>
                            </tr>
                            <tr>
                              <td>
                                <b>Latitude:</b>
                              </td>
                              <td>{selectedCityAirport.lat}</td>
                            </tr>
                            <tr>
                              <td>
                                <b>Longitude:</b>
                              </td>
                              <td>{selectedCityAirport.lng}</td>
                            </tr>
                          </table>
                        </div>
                      </div>
                      <div className="citiesBox">
                        <h2>Nearby Cities</h2>
                        <table className="cityTable">
                          <tr>
                            <th>City</th>
                            <th>Country Code</th>
                            <th>Latitude</th>
                            <th>Longitude</th>
                            <th>Distance</th>
                          </tr>
                          {nearbyCitiesInfo.map((cities) => (
                            <tr key={cities.popularity} value={cities}>
                              <td>{cities.name} </td>
                              <td>{cities.country_code} </td>
                              <td>{cities.lat} </td>
                              <td>{cities.lng} </td>
                              <td>{cities.distance} </td>
                            </tr>
                          ))}
                        </table>
                      </div>
                      <div
                        className="citiesBox"
                        style={{ height: 400, width: '100%' }}
                      >
                        <DataGrid
                          rows={nearbyCitiesInfo}
                          columns={nearbyColumns}
                          pageSize={5}
                          rowsPerPageOptions={[5]}
                          checkboxSelection
                          getRowId={(row) => row.distance}
                          // className={classes.root}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="align-center">
                      Turn on location to show airports near you
                    </div>
                  )}
                </div>

                {/* <p>{geoObj && JSON.stringify(geoObj)}</p> */}

                {/* {airportStatus === true ? (
                  <Listbox
                    value={selectedCityAirport}
                    onChange={setSelectedCityAirport}
                  >
                    <div className="relative mt-1">
                      <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
                        <span className="block truncate">
                          {selectedCityAirport.name}
                        </span>
                        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                          <SelectorIcon
                            className="h-5 w-5 text-gray-400"
                            aria-hidden="true"
                          />
                        </span>
                      </Listbox.Button>
                      <Listbox.Options>
                        {nearbyAirportsInfo.map((airport) => (
                          <Listbox.Option
                            key={airport.icao_code}
                            value={airport}
                          >
                            {airport.name}
                          </Listbox.Option>
                        ))}
                      </Listbox.Options>
                    </div>
                  </Listbox>
                ) : (
                  <div>Turn on location to show airports near you</div>
                )} */}
              </div>
            </div>
            {/* /End replace */}
          </div>
        </main>
      </div>
    </>
  )
}
