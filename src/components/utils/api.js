const devURL = "http://localhost:5000";
const liveURL = "https://t00axvabvb.execute-api.us-west-1.amazonaws.com/dev";
const baseURL = liveURL;

function timeoutPromise(ms, promise) {
  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      reject(new Error("promise timeout"));
    }, ms);
    promise.then(
      (res) => {
        clearTimeout(timeoutId);
        resolve(res);
      },
      (err) => {
        clearTimeout(timeoutId);
        reject(err);
      }
    );
  });
}

const get = async (path, token = null) => {
  const headers = {};
  if (token !== null) {
    headers.Authorization = `Bearer ${token}`;
  }
  const response = await timeoutPromise(
    10 * 60 * 1000,
    fetch(baseURL + path, {
      headers: headers,
    })
  );
  const data = await response.json();
  return data;
};

const post = async (path, body, token = null, files = null) => {
  let headers = {
    "content-type": "application/json",
  };
  let requestBody = JSON.stringify(body);
  if (files !== null) {
    headers = {};
    requestBody = new FormData();
    for (const key of Object.keys(body)) {
      requestBody.append(key, body[key]);
    }
  }
  if (token !== null) {
    headers.Authorization = `Bearer ${token}`;
  }
  const response = await timeoutPromise(
    10 * 60 * 1000,
    fetch(baseURL + path, {
      method: "POST",
      headers: headers,
      body: requestBody,
    })
  );
  const data = await response.json();
  return data;
};

const put = async (path, body, token = null, files = null) => {
  let headers = {
    "content-type": "application/json",
  };
  let requestBody = JSON.stringify(body);
  if (files !== null) {
    headers = {};
    requestBody = new FormData();
    for (const key of Object.keys(body)) {
      requestBody.append(key, body[key]);
    }
  }
  if (token !== null) {
    headers.Authorization = `Bearer ${token}`;
  }
  const response = await timeoutPromise(
    10 * 60 * 1000,
    fetch(baseURL + path, {
      method: "PUT",
      headers: headers,
      body: requestBody,
    })
  );

  const data = await response.json();
  return data;
};

export { get, post, put };
