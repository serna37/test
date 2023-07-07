import axios from "axios"

const DOMAIN = window.location.host.startsWith("localhost") ? "http://localhost:8181" : "https://neras-sta.com"

export const URLs = {
  Signin: "/usr/signin"
}
export const Ajax = {
  POST: (uri: string, data: any, callback: any, err: any) => {
    console.debug(`${DOMAIN}/mk6v2${uri}`)
    axios.post(`${DOMAIN}/mk6v2${uri}`, data)
      .then(res => {
        callback(res.data)
      })
      .catch(e => {
        console.log(e.response.status)
        if (err === undefined || err === null) {
          return
        }
        err(e)
      })
  }
}

