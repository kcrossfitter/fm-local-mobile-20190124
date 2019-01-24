const handleActionError = err => {
  if (err.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    console.log(err.response.data)
    return err.response.data
  } else if (err.request) {
    // The request was made but no response was received
    // `error.request` is an instance of XMLHttpRequest in the browser
    // and an instance of http.ClientRequest in node.js
    console.log(err.request)
    return err.request
  } else {
    // Something happened in setting up the request that triggered an Error
    console.log(err.message)
    return err.message
  }
}

export default handleActionError
