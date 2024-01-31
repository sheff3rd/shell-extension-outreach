export async function getClientToken() {
  const clientId = 'EKFm2YBXTf5eRKfiogkupfgw4NOEcmnBUgthBD8luXLc'
  const clientSecret = ')e:DPqxvIr$K*520mS@P$g4VbzOYLMv8FViE3v(TMQa'
  const redirectUri = 'https://18d8-212-24-139-139.ngrok-free.app'

  const grantType = 'authorization_code'
  const code = 'read'

  const response = await fetch('https://api.outreach.io/oauth/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: grantType,
      code: code,
      state: 'dev',
    }),
  })

  if (!response.ok) {
    throw new Error('Network response was not ok')
  }

  const data = await response.json()
  return data.access_token
}

export async function fetchProspects() {
  const url = 'https://api.outreach.io/api/v2/prospects'
  const token = 'a0f67086-72d1-46b9-8d4c-94d5221dc369'

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  const data = await response.json()
  return data
}
