import React, { useEffect, useRef } from 'react'
import extensibilitySdk, { NavigationDestination } from '@getoutreach/extensibility-sdk'

const Navigation = () => {
  const context = useRef(null)

  const initializeSDK = async () => {
    const ctx = await extensibilitySdk.init()
    context.current = ctx
  }

  useEffect(() => {
    initializeSDK()
  }, [])

  const handleRedirect = path => async () => {
    if (!context.current) return null

    const prospectId = context.current.prospect.id

    console.log('prospect', context.current.prospect.id)
    console.log('path', path)
    extensibilitySdk.navigate(path, `${prospectId}/apps/alex-test-20230428`)
  }

  return (
    <div>
      <button onClick={handleRedirect(NavigationDestination.PROSPECT)}>Prospects</button>
      <button onClick={handleRedirect(NavigationDestination.ACCOUNT)}>Accounts</button>
    </div>
  )
}

export default Navigation
