import { post, patch } from './helper/request.js';
import exec from 'k6/execution';

import params from './helper/parameters.js'
export const options = params

export default function() {
  const {iterationInInstance: iID, idInInstance: vID} = exec.vu;
  post(3002, 'login', {
      user:`${vID}-${iID}`,
      password:'pd'
  })

  patch(3003, '', {
    id: `${vID}-${iID}`,
    sections: [
      {
        title: 'Section',
        recipes: [
          {
            id: `${vID}-${iID}`,
            version: 'original'
          }
        ]
      }
    ]
  })
}
