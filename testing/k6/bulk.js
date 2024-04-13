import { post, get } from './helper/request.js';
import params from './helper/parameters.js'
export const options = params

function generateRandomString(length) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}



export function setup() {
  post(3002, 'register', {
    username: 'bulk',
    email: 'bulk@mail.com',
    password:'pd'
  })

  for (let i = 0; i < 1000; i++) {
    post(3005, '', {
      id: `bulk-${i}`,
      data: {
        text: generateRandomString(10000),
        title: 'title'
      }
    })
  }
}

export default function() {
  post(3002, 'login', {
      user: 'bulk',
      password: 'pd'
  })

  get(3004, 'home?items=1000')
}
