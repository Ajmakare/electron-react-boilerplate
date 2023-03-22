const http = require('http');
const url = require('url');
const querystring = require('querystring');
const SpotifyWebApi = require('spotify-web-api-node');

const client_id = '7c6d33c5e7054fa59ccc144b5633d01b';
const client_secret = '5670abe14e294058b4a2b5a78474bea9';
const redirect_uri = 'http://localhost:8888/callback';
const scopes = ['user-read-private', 'user-read-email'];

const spotifyApi = new SpotifyWebApi({
  clientId: client_id,
  clientSecret: client_secret,
  redirectUri: redirect_uri,
});

const server = http.createServer((req, res) => {
  const { pathname, query } = url.parse(req.url);
  const { code } = querystring.parse(query);

  if (pathname === '/callback' && code) {
    // Exchange the code for an access token and a refresh token
    spotifyApi.authorizationCodeGrant(code).then((data) => {
      const access_token = data.body.access_token;
      const refresh_token = data.body.refresh_token;

      // Use the access token to make API requests
      spotifyApi.setAccessToken(access_token);
      spotifyApi.getMe().then((data) => {
        console.log(data.body);
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.write(`Hello, ${data.body.display_name}!`);
        res.end();
      }).catch((error) => {
        console.error(error);
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.write('Error');
        res.end();
      });
    }).catch((error) => {
      console.error(error);
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.write('Error');
      res.end();
    });
  } else {
    // Redirect the user to the Spotify login page
    const authorizeURL = spotifyApi.createAuthorizeURL(scopes);
    res.writeHead(302, { 'Location': authorizeURL });
    res.end();
  }
});

server.listen(8888, () => {
  console.log('Server running on http://localhost:8888');
});
