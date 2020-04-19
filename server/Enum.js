export const METHOD_NUM = { GET: 0, POST: 1, PUT: 2, DELETE: 3, OPTION: 4 }
export const NUM_METHOD = () => METHOD_NUM.keys().reduce((results, key) => (results[METHOD_NUM[key]] = key, results), {})
export const REQ_CONTEXT_TYPE_NUM = { 'application/json': 0, 'application/x-www-form-urlencoded': 1, 'multipart/form-data': 2 }
