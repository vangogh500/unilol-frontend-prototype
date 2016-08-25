import {getToken, updateCredentials} from './credentials';

/**
 * Properly configure+send an XMLHttpRequest with error handling, authorization token,
 * and other needed properties.
 * @prop errorCb: Optional argument -- called when the server responds with an error code.
 */
function sendXHR(verb, resource, body, cb) {
  var xhr = new XMLHttpRequest()
  xhr.open(verb, resource)
  xhr.setRequestHeader('Authorization', 'Bearer ');

  // The below comment tells ESLint that UnilolError is a global.
  // Otherwise, ESLint would complain about it! (See what happens in Atom if
  // you remove the comment...)
  /* global UnilolError */

  // Response received from server. It could be a failure, though!
  xhr.addEventListener('load', function() {
    var statusCode = xhr.status
    var resObj = JSON.parse(xhr.responseText)
    resObj.statusCode = statusCode
    console.log(resObj)
    if (statusCode >= 200 && statusCode < 300 && xhr.readyState == 4) {
      // Success: Status code is in the [200, 300) range.
      // Call the callback with the final XHR object.
      cb(true, resObj)
    } else {
      // Client or server error.
      cb(false, resObj)
    }
  });

  // Time out the request if it takes longer than 10,000 milliseconds (10 seconds)
  xhr.timeout = 10000;

  // Network failure: Could not connect to server.
  xhr.addEventListener('error', function() {
    cb(false, { statusCode: -106, msg: "Could not contact server. Please check your connection and try again." })
  });

  // Network failure: request took too long to complete.
  xhr.addEventListener('timeout', function() {
    cb(false, { statusCode: -105, msg: "The request has timed out. Please check your connection and try again."})
  });

  switch (typeof(body)) {
    case 'undefined':
      // No body to send.
      xhr.send()
      break
    case 'string':
      // Tell the server we are sending text.
      xhr.setRequestHeader("Content-Type", "text/plain;charset=UTF-8")
      xhr.send(body)
      break
    case 'object':
      // Tell the server we are sending JSON.
      xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8")
      // Convert body into a JSON string.
      xhr.send(JSON.stringify(body))
      break
    default:
      throw new Error('Unknown body type: ' + typeof(body))
  }
}

export function signUp(email, password, cb) {
  sendXHR('POST', '/emailVerificationToken', { email: email, password: password }, cb)
}

export function resendEmailVerification(email, cb) {
  sendXHR('GET', '/emailVerificationToken/' + email, {}, cb)
}

export function verifyEmail(token, cb) {
  sendXHR('POST', '/user', {token: token}, cb)
}

export function signIn(email, password, cb) {
  sendXHR('POST', '/login', { email: email, password: password }, cb)
}
