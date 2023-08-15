const request = require('supertest');
const  { expressApp } = require('../lib/index');
const _ = require("lodash")
const baseUrl = "http://127.0.0.1:5001";

let registerBody = {
    "email" : "bpippal@gmail.com",
    "password" : "bharat",
    "name" : "Bharat",
    "phone" : "9972608051",
    "address" : "Hyderabad"
};

let loginCredentials = _.pick(registerBody , ["email" , "password"]); 

describe('Register', () => {
  it('Registering first time with email', async () => {
    const response = await request(baseUrl).post('/willeder-4532a/asia-northeast1/api/auth/register').send(registerBody);
    expect(response.status).toBe(200);
  });


  it('Duplicate Register with same email', async () => {
    const response = await request(baseUrl).post('/willeder-4532a/asia-northeast1/api/auth/register').send(registerBody);
    expect(response.status).toBe(409);
    expect(response.body.errorMessage).toBe(`User already exists with email - ${registerBody.email} `);

  });

});

describe("Login" , () => {

    let tokens;
    let headers;

    it("Login with valid credentials" , async() => {
        const response = await request(baseUrl).put('/willeder-4532a/asia-northeast1/api/auth/login').send(loginCredentials);
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("accessToken");
        expect(response.body).toHaveProperty("refreshToken");
        tokens = response.body;
        headers = {
            authorization : tokens.accessToken
        }
    })

    it("Login with invalid credentials" , async() => {
        loginCredentials.password = 'randomValue'
        const response = await request(baseUrl).put('/willeder-4532a/asia-northeast1/api/auth/login').send(loginCredentials);
        expect(response.statusCode).toBe(401);
        expect(response.body.errorMessage).toBe("Invalid credentials")
    })

    it("Get account details with accessToken" , async() => {
        loginCredentials.password = registerBody.password;
        const response = await request(baseUrl).get('/willeder-4532a/asia-northeast1/api/account/').set(headers)
        expect(response.statusCode).toBe(200);
    })

    it("Get account details with random accessToken" , async() => {
        loginCredentials.password = registerBody.password;
        const response = await request(baseUrl).get('/willeder-4532a/asia-northeast1/api/account/').set({authorization : "randomToken"})
        expect(response.statusCode).toBe(401);
    })

    it("Testing refresh" , async () => {
        //Make refresh call
        let refreshBody = {
            "refreshToken" : tokens.refreshToken
        }
        const refreshResponse = await request(baseUrl).post('/willeder-4532a/asia-northeast1/api/auth/refresh/').send(refreshBody);
        expect(refreshResponse.statusCode).toBe(200);

        const accountDetailsResponse = await request(baseUrl).get('/willeder-4532a/asia-northeast1/api/account/').set({authorization : refreshResponse.body.accessToken});
        expect(accountDetailsResponse.statusCode).toBe(200);
    })
    
    
})

function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}