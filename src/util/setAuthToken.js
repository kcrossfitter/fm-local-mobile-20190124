import axios from 'axios'

const setAuthToken = token => {
  if (token) {
    // Apply to every request, global axios defaults
    // token => Bearer token
    axios.defaults.headers.common['Authorization'] = token
  } else {
    // Delete auth header
    delete axios.defaults.headers.common['Authorization']
  }
}

export default setAuthToken
