# RideX API Documentation

Use these details to test your backend using Postman.

**Base URL**: `http://localhost:4000/api`

---

## 🔐 Authentication

### 1. Register User
**Create a new user account.**

- **Method**: `POST`
- **URL**: `http://localhost:4000/api/users/register`
- **Body** (JSON):
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

### 2. Login User
**Login to get an authentication token.**

- **Method**: `POST`
- **URL**: `http://localhost:4000/api/users/login`
- **Body** (JSON):
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```
- **Response**: Copy the `token` from the response. You will need it for the requests below.

### 3. Get User Profile
**Check who is currently logged in.**

- **Method**: `GET`
- **URL**: `http://localhost:4000/api/users/me`
- **Headers**:
    - `Authorization`: `Bearer <YOUR_TOKEN_HERE>`

---

## 🚖 Rides

### 4. Book a Ride (Find Driver)
**Create a new ride request.**

- **Method**: `POST`
- **URL**: `http://localhost:4000/api/rides/create`
- **Headers**:
    - `Authorization`: `Bearer <YOUR_TOKEN_HERE>`
- **Body** (JSON):
```json

{
  "pickup": {
    "address": "123 Main St, New York, NY",
    "lat": 40.7128,
    "lng": -74.0060
  },
  "destination": {
    "address": "456 Park Ave, New York, NY",
    "lat": 40.7688,
    "lng": -73.9580
  },
  "vehicleType": "auto",
  "fare": 150
}
```
*Note: `vehicleType` can be "auto", "car", or "moto".*
