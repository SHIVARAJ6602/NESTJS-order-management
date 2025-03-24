import requests

BASE_URL = "http://localhost:3000"

def test_create_order():
    response = requests.post(f"{BASE_URL}/orders", json={"customerId": 1, "productId": 2})
    assert response.status_code == 201

def test_get_order():
    response = requests.get(f"{BASE_URL}/auth/login")
    
    # Print the status code and response content
    print("Status Code:", response.status_code)
    print("Response Body:", response.text)
    
    assert response.status_code == 200
    assert isinstance(response.json(), list)


test_get_order()
