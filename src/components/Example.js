import React, { useEffect, useState, useMemo } from 'react'
import extensibilitySdk from '@getoutreach/extensibility-sdk'

const Example = () => {
  const [context, setContext] = useState(null)

  /**
   * Initializes outreach SDK.
   * We'll use that to get the opportunity data
   */
  const initializeSDK = async () => {
    const ctx = await extensibilitySdk.init()
    setContext(ctx)
  }

  useEffect(() => {
    initializeSDK()
  }, [])

  const iframeSource = useMemo(() => {
    if (!context) return null

    /**
     * Here we'll compare opportunity stage and display correct URL based on that
     *
     * You can see all available fields in the SDK documentation:
     * https://developers.outreach.io/client-extensions/javascript-sdk/#the-outreachcontext-object
     *
     * To access opportunity data make sure to add it to the app manifest in the Outreach Developer Portal:
     * https://developers.outreach.io/client-extensions/javascript-sdk/#the-outreachcontext-object
     */

    if (context.opportunity && context.opportunity.stage === 'Prospecting') {
      return 'https://example.com'
    }

    if (context.opportunity && context.opportunity.stage === 'Closed Won') {
      return 'https://example.com'
    }

    if (context.opportunity && context.opportunity.stage === 'Closed Lost') {
      return 'https://example.com'
    }
  }, [context])

  /**
   * Wait before the SDK is initialized. We do not have opportunity data before that
   */
  if (!context) return null

  return (
    <iframe
      src={iframeSource}
      title="iframe"
      width="100%"
      height="100%"
      frameBorder="0"
      allowFullScreen
      style={{ position: 'absolute', top: 0, left: 0 }}
    />
  )
}

export default Example
