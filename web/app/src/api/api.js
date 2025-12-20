const API_BASE_URL = 'http://localhost:8001'

/**
 * Sends a GET request to the API
 * @param {string} endpoint - The API endpoint
 * @returns {Promise<any>} The response data
 */
export const apiGet = async (endpoint) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    const data = await response.json()
    return data
  } catch (error) {
    console.error(`GET request failed for ${endpoint}:`, error)
    throw error
  }
}

/**
 * Sends a POST request to the API
 * @param {string} endpoint - The API endpoint
 * @param {object} payload - The request payload
 * @returns {Promise<any>} The response data
 */
export const apiPost = async (endpoint, payload) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
    const data = await response.json()
    return data
  } catch (error) {
    console.error(`POST request failed for ${endpoint}:`, error)
    throw error
  }
}

/**
 * Ping endpoint to check connection
 * @returns {Promise<string>} "pong"
 */
export const pingConnection = async () => {
  return await apiGet('/ping')
}

/**
 * Get version information
 * @returns {Promise<object>} Version data
 */
export const getVersion = async () => {
  return await apiGet('/versions')
}

/**
 * Online facility location optimization
 * @param {object} demand - The newly placed demand point
 * @param {array} demands - List of previously placed demand points
 * @param {array} facilities - List of placed facility points
 * @param {object} parameter - Optimization parameters
 * @returns {Promise<object>} Optimization result
 */
export const onlineFacilityLocation = async (demand, demands, facilities, parameter) => {
  const payload = {
    demand,
    demands,
    facilities,
    parameter,
  }
  return await apiPost('/online_facility_location', payload)
}

/**
 * Offline facility location optimization
 * @param {array} demands - List of placed demand points
 * @param {array} facilities - List of placed facility points
 * @param {object} parameter - Optimization parameters
 * @returns {Promise<object>} Optimization result
 */
export const offlineFacilityLocation = async (demands, facilities, parameter) => {
  const payload = {
    demands,
    facilities,
    parameter,
  }
  return await apiPost('/offline_facility_location', payload)
}
