import { post } from './helper/request.js';
import exec from 'k6/execution';

import params from './helper/parameters.js'
export const options = params

export default function() {
  const {iterationInInstance: iID, idInInstance: vID} = exec.vu;
  post(3002, 'login', {
      user:`${vID}-${iID}`,
      password:'pd'
  })
  
  const vus = exec.instance.vusInitialized

  post(3003, 'copy', {
    id: `${((vID % vus) + 1)}-${iID}`
  })
}
