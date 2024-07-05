Here's a comprehensive list of common HTTP status codes along with their corresponding messages. This will cover the most frequently used status codes in APIs.

### 1xx Informational
- **100 Continue**: The server has received the request headers, and the client should proceed to send the request body.
- **101 Switching Protocols**: The requester has asked the server to switch protocols, and the server has agreed to do so.

### 2xx Success
- **200 OK**: The request has succeeded.
- **201 Created**: The request has been fulfilled, resulting in the creation of a new resource.
- **202 Accepted**: The request has been accepted for processing, but the processing has not been completed.
- **203 Non-Authoritative Information**: The request was successful but the returned metadata may be from another source.
- **204 No Content**: The server successfully processed the request and is not returning any content.
- **205 Reset Content**: The server successfully processed the request, asks that the requester reset its document view, and is not returning any content.
- **206 Partial Content**: The server is delivering only part of the resource due to a range header sent by the client.

### 3xx Redirection
- **300 Multiple Choices**: The request has more than one possible response.
- **301 Moved Permanently**: The URL of the requested resource has been changed permanently.
- **302 Found**: The URI of the requested resource has been changed temporarily.
- **303 See Other**: The response to the request can be found under another URI using a GET method.
- **304 Not Modified**: Indicates that the resource has not been modified since the version specified by the request headers.
- **307 Temporary Redirect**: The request should be repeated with another URI; however, future requests should still use the original URI.
- **308 Permanent Redirect**: The request and all future requests should be repeated using another URI.

### 4xx Client Errors
- **400 Bad Request**: The server could not understand the request due to invalid syntax.
- **401 Unauthorized**: The client must authenticate itself to get the requested response.
- **402 Payment Required**: This status code is reserved for future use.
- **403 Forbidden**: The client does not have access rights to the content.
- **404 Not Found**: The server can not find the requested resource.
- **405 Method Not Allowed**: The request method is known by the server but is not supported by the target resource.
- **406 Not Acceptable**: The server cannot produce a response matching the list of acceptable values defined in the request's proactive content negotiation headers.
- **407 Proxy Authentication Required**: The client must first authenticate itself with the proxy.
- **408 Request Timeout**: The server would like to shut down this unused connection.
- **409 Conflict**: The request conflicts with the current state of the server.
- **410 Gone**: The content has been permanently deleted from the server, with no forwarding address.
- **411 Length Required**: The server refuses to accept the request without a defined Content-Length header.
- **412 Precondition Failed**: The server does not meet one of the preconditions that the requester put on the request.
- **413 Payload Too Large**: The request entity is larger than limits defined by the server.
- **414 URI Too Long**: The URI requested by the client is longer than the server is willing to interpret.
- **415 Unsupported Media Type**: The media format of the requested data is not supported by the server.
- **416 Range Not Satisfiable**: The range specified by the Range header field in the request can't be fulfilled.
- **417 Expectation Failed**: The server cannot meet the requirements of the Expect header field.
- **418 I'm a teapot**: This code was defined in 1998 as an April Fools' joke. It is not expected to be implemented by actual HTTP servers.
- **421 Misdirected Request**: The request was directed at a server that is not able to produce a response.
- **422 Unprocessable Entity**: The request was well-formed but was unable to be followed due to semantic errors.
- **423 Locked**: The resource that is being accessed is locked.
- **424 Failed Dependency**: The request failed due to failure of a previous request.
- **426 Upgrade Required**: The client should switch to a different protocol.
- **428 Precondition Required**: The origin server requires the request to be conditional.
- **429 Too Many Requests**: The user has sent too many requests in a given amount of time ("rate limiting").
- **431 Request Header Fields Too Large**: The server is unwilling to process the request because its header fields are too large.
- **451 Unavailable For Legal Reasons**: The user-agent requested a resource that cannot legally be provided, such as a web page censored by a government.

### 5xx Server Errors
- **500 Internal Server Error**: The server has encountered a situation it doesn't know how to handle.
- **501 Not Implemented**: The request method is not supported by the server and cannot be handled.
- **502 Bad Gateway**: The server, while acting as a gateway or proxy, received an invalid response from the upstream server.
- **503 Service Unavailable**: The server is not ready to handle the request.
- **504 Gateway Timeout**: The server is acting as a gateway or proxy and did not get a response in time.
- **505 HTTP Version Not Supported**: The HTTP version used in the request is not supported by the server.
- **506 Variant Also Negotiates**: The server has an internal configuration error.
- **507 Insufficient Storage**: The server is unable to store the representation needed to complete the request.
- **508 Loop Detected**: The server detected an infinite loop while processing the request.
- **510 Not Extended**: Further extensions to the request are required for the server to fulfill it.
- **511 Network Authentication Required**: The client needs to authenticate to gain network access.

These status codes can be used to provide more informative responses in your API, and they help to communicate the status of the request and the outcome to the client.

### Example of Usage in Express

You can use these status codes in your Express application like this:

```javascript
app.get("/users", authMiddleware, adminCheckMiddleware, async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users); // 200 OK
  } catch (error) {
    res.status(500).send("Server error"); // 500 Internal Server Error
  }
});

app.post("/users/register", async (req, res) => {
  const { email, firstName, lastName, password } = req.body;
  if (!email || !firstName || !lastName || !password) {
    return res.status(400).send("Bad request, missing required fields"); // 400 Bad Request
  }
  
  try {
    const hashedPassword = bcrypt.hashSync(password, 10);
    const user = new User({ email, firstName, lastName, password: hashedPassword });
    await user.save();
    res.status(201).json({ message: "User registered successfully" }); // 201 Created
  } catch (error) {
    res.status(500).send("Server error"); // 500 Internal Server Error
  }
});

app.post("/users/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).send("Unauthorized, invalid credentials"); // 401 Unauthorized
  }

  const validPassword = bcrypt.compareSync(password, user.password);
  if (!validPassword) {
    return res.status(401).send("Unauthorized, invalid credentials"); // 401 Unauthorized
  }

  const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
  res.status(200).json({ token }); // 200 OK
});
```

By using these status codes and messages appropriately, you can make your API responses more consistent and informative.