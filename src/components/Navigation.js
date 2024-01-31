import React, { useEffect, useRef } from 'react'
import extensibilitySdk from '@getoutreach/extensibility-sdk'

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

    const { navigateTo } = context.current
    await navigateTo(path)
  }

  return (
    <div>
      <button onClick={handleRedirect('prospects')}>Prospects</button>
      <button onClick={handleRedirect('accounts')}>Accounts</button>
    </div>
  )
}

export default Navigation
