import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
    vus: 15,  // Number of users
    duration: '30s', // Test duration
};

export default function () {
    let signupPayload = JSON.stringify({
        firstName: 'rororo',
        familyName: 'asbarr',
        email: `test${Math.random()}@example.com`,
        password: 'hahahahahaha'
    });

    let loginPayload = JSON.stringify({
        userName: `testidk${Math.random()}`,
        password: 'Test@1234'
    });

    let headers = { 'Content-Type': 'application/json' };

    // Test Signup API
    let signupRes = http.post('http://localhost:3005/api/users/signup-first-step', signupPayload, { headers });
    console.log(`Signup Response: ${signupRes.status} - ${signupRes.body}`);
    check(signupRes, { 'Signup Successful': (res) => res.status === 201 });

    // Test Login API
    let loginRes = http.post('http://localhost:3005/api/users/login', loginPayload, { headers });
    console.log(`Login Response: ${loginRes.status} - ${loginRes.body}`);
    check(loginRes, { 'Login Successful': (res) => res.status === 200 });

    sleep(1);
}
