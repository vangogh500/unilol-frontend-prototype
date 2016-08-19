import {getToken} from './credentials';

/**
 * Properly configure+send an XMLHttpRequest with error handling, authorization token,
 * and other needed properties.
 * @prop errorCb: Optional argument -- called when the server responds with an error code.
 */
function sendXHR(verb, resource, body, cb, errorCb) {
  var xhr = new XMLHttpRequest();
  xhr.open(verb, resource);
  xhr.setRequestHeader('Authorization', 'Bearer ' + getToken());

  // The below comment tells ESLint that UnilolError is a global.
  // Otherwise, ESLint would complain about it! (See what happens in Atom if
  // you remove the comment...)
  /* global UnilolError */

  // Response received from server. It could be a failure, though!
  xhr.addEventListener('load', function() {
    var statusCode = xhr.status;
    var statusText = xhr.statusText;
    if (statusCode >= 200 && statusCode < 300 && xhr.readyState == 4) {
      // Success: Status code is in the [200, 300) range.
      // Call the callback with the final XHR object.
      cb(xhr);
    } else {
      // Client or server error.
      // The server may have included some response text with details concerning
      // the error.
      var responseText = xhr.responseText;
      if (errorCb) {
        // We were given a custom error handler.
        errorCb(xhr.status + ": " + xhr.responseText);
      }
    }
  });

  // Time out the request if it takes longer than 10,000 milliseconds (10 seconds)
  xhr.timeout = 10000;

  // Network failure: Could not connect to server.
  xhr.addEventListener('error', function() {
    errorCb("network failure: could not connect to server");
  });

  // Network failure: request took too long to complete.
  xhr.addEventListener('timeout', function() {
    errorCb("timeout: request timed out (please try again)");
  });

  switch (typeof(body)) {
    case 'undefined':
      // No body to send.
      xhr.send();
      break;
    case 'string':
      // Tell the server we are sending text.
      xhr.setRequestHeader("Content-Type", "text/plain;charset=UTF-8");
      xhr.send(body);
      break;
    case 'object':
      // Tell the server we are sending JSON.
      xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
      // Convert body into a JSON string.
      xhr.send(JSON.stringify(body));
      break;
    default:
      throw new Error('Unknown body type: ' + typeof(body));
  }
}

export function signup(email, password, cb) {
  sendXHR('POST', '/emailVerificationToken', { email: email, password: password }, () => {
    // Called when signup succeeds! Return true for success.
    cb(true, null);
  }, (msg) => {
    // Called when the server returns an error code!
    // Return false for failure.
    cb(false, msg);
  });
}

export function resendEmailVerification(email, cb) {
  sendXHR('GET', '/emailVerificationToken/' + email, {}, () => {
    // Called when signup succeeds! Return true for success.
    cb(true, null);
  }, (msg) => {
    // Called when the server returns an error code!
    // Return false for failure.
    cb(false, msg);
  });
}

export function verifyEmail(token, cb) {
  sendXHR('POST', '/user', {token: token}, () => {
    cb(true, null);
  }, (msg) => {
    cb(false, msg);
  })
}
