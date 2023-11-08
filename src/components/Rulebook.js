/* eslint-disable no-extend-native */
import React, { useEffect, useState, useRef, useMemo } from 'react'
import './Rulebook.css'

import extensibilitySdk from '@outreach/extensibility-sdk'

/**
 * This will be an array of stages, that your are using in your outreach app
 * Since stages can be custom and there are now way to get a full list of them so we'll define them here
 */
const STAGES = ['prospecting', 'qualify', 'propose', 'replied']

/**
 * We can add more fields for our rulebook, but for the sake of example I'll just be using stage
 */
const FIELDS = ['stage']

/**
 * I'm not gonna implement all of the operators, but I'll give you a few for the sake of the example
 */
const OPERATORS = ['equals', 'contains', 'starts with']

/**
 * Helper function to capitalize the first letter of a string
 * I'm extending native String object, but you can use any other way to do it
 */
String.prototype.capitalize = function () {
  return this.charAt(0).toUpperCase() + this.slice(1)
}

const Rulebook = () => {
  const [field, setField] = useState('stage')
  const [operator, setOperator] = useState(OPERATORS[0])
  const [stage, setStage] = useState(STAGES[0])
  const [url, setUrl] = useState('')

  /**
   * This piece of code helps to access state based on selected field, instead of using 'eval' function
   */
  const fieldValues = useMemo(() => ({ stage }), [stage])

  const [opportunity, setOpportunity] = useState(null)
  const outreachContext = useRef(null)

  /**
   * Initialize the SDK
   * Make sure that the SDK is configurted correctly on devportal, to get all the necessary fields
   *
   * https://developers.outreach.io/client-extensions/javascript-sdk/
   */
  const initializeSDK = async () => {
    const ctx = await extensibilitySdk.init()
    outreachContext.current = ctx

    setOpportunity(ctx.opportunity)
  }

  useEffect(() => {
    initializeSDK()
  }, [])

  /**
   * This does nothing but you can save your rules to the database or any other kind of storage
   */
  const handleSubmit = e => {
    e.preventDefault()
  }

  /**
   * here we deternine if the iframe should be rendered
   * based on the selected field, operator and field value
   */
  const shouldRenderIframe = useMemo(() => {
    if (!opportunity) return false

    const opportunityField = opportunity[field].toLowerCase()
    const fieldValue = fieldValues[field].toLowerCase()

    switch (operator) {
      case 'equals':
        return opportunityField === fieldValue

      case 'contains':
        return opportunityField.includes(fieldValue)

      case 'starts with':
        return opportunityField.startsWith(fieldValue)

      default:
        return false
    }
  }, [opportunity, field, operator, fieldValues])

  const renderIframe = () => (
    <iframe className="Iframe" title="iframe" src={url} width="100%" height="100%" frameBorder="0" allowFullScreen />
  )

  return (
    <div className="Rulebook">
      <form className="Form" onSubmit={handleSubmit}>
        <p>if</p>
        <FieldSelect onChange={e => setField(e.target.value)} value={field} />
        <OperatorSelect onChange={e => setOperator(e.target.value)} value={operator} />
        {field === 'stage' && <StageSelect onChange={e => setStage(e.target.value)} value={stage} />}

        <p>then show</p>

        <input className="Input" type="text" name="url" id="url" onChange={e => setUrl(e.target.value)} value={url} />
      </form>

      <p>
        <b>Current opportunity stage: </b>
        {opportunity && opportunity.stage}
      </p>

      {shouldRenderIframe && renderIframe()}
    </div>
  )
}

const FieldSelect = ({ onChange, value }) => (
  <select className="Select" name="fields" id="fields" onChange={onChange} value={value}>
    {FIELDS.map(field => (
      <option key={field} value={field}>
        {field.capitalize()}
      </option>
    ))}
  </select>
)

const OperatorSelect = ({ onChange, value }) => (
  <select className="Select" name="operators" id="operators" onChange={onChange} value={value}>
    {OPERATORS.map(operator => (
      <option key={operator} value={operator}>
        {operator}
      </option>
    ))}
  </select>
)

const StageSelect = ({ onChange, value }) => (
  <select className="Select" name="stages" id="stages" onChange={onChange} value={value}>
    {STAGES.map(stage => (
      <option key={stage} value={stage}>
        {stage.capitalize()}
      </option>
    ))}
  </select>
)

export default Rulebook
