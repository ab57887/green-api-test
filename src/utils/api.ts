const ApiBaseUrl = 'https://4100.api.green-api.com'

export default (
  id: string,
  token: string,
  method: string,
  body?: Record<string, unknown>,
  httpMethod = 'GET',
  ...restpath: Array<unknown>
) => {
  let urlstr = `${ApiBaseUrl}/waInstance${id}/${method}/${token}`
  for (let i = 0, n = restpath.length; i < n; i++) {
    urlstr += `/${restpath[i]}`
  }

  if (httpMethod !== 'GET') {
    console.log(httpMethod, urlstr, body)

    return fetch(urlstr, {
      method: httpMethod,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
  } else {
    const url = new URL(urlstr)
    if (body) {
      for (const key in body) {
        url.searchParams.append(key, String(body[key]))
      }
    }

    console.log('GET', url, body)

    return fetch(url)
  }
}
