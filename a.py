import requests
import json
import uuid
import time
import base64
from datetime import datetime
from cryptography.hazmat.primitives import serialization, hashes
from cryptography.hazmat.primitives.asymmetric import padding

BASE_URL = "https://api.elections.kalshi.com/trade-api/v2"
KEY_ID = "________" 
PRIVATE_KEY_PATH = "path/to/your/private_key.key" 


def load_private_key(path):
    with open(path, "rb") as key_file:
        return serialization.load_pem_private_key(
            key_file.read(),
            password=None
        )

def sign_request(method, path, timestamp):
    """Generates the RSA-PSS signature required by Kalshi."""
 
    private_key = load_private_key(PRIVATE_KEY_PATH)
    msg_string = f"{timestamp}{method}{path}"
    signature = private_key.sign(
        msg_string.encode('utf-8'),
        padding.PSS(
            mgf=padding.MGF1(hashes.SHA256()),
            salt_length=padding.PSS.MAX_LENGTH
        ),
        hashes.SHA256()
    )
    return base64.b64encode(signature).decode('utf-8')

def make_request(method, endpoint, params=None, payload=None):
    """Handles headers and signing for authenticated requests."""
    url = f"{BASE_URL}{endpoint}"
    timestamp = str(int(time.time() * 1000))
    signature = sign_request(method, endpoint, timestamp)
    
    headers = {
        "KALSHI-ACCESS-KEY": KEY_ID,
        "KALSHI-ACCESS-SIGNATURE": signature,
        "KALSHI-ACCESS-TIMESTAMP": timestamp,
        "Content-Type": "application/json"
    }
    
    if method == "GET":
        response = requests.get(url, headers=headers, params=params)
    elif method == "POST":
        response = requests.post(url, headers=headers, json=payload)
    elif method == "DELETE":
        response = requests.delete(url, headers=headers)
        
    try:
        response.raise_for_status()
        return response.json()
    except requests.exceptions.HTTPError as err:
        print(f"Error: {err}")
        print(f"Response Body: {response.text}")
        return None

print("--- 1. FINDING MARKET ---")
markets_response = make_request("GET", "/markets", params={
    "series_ticker": "KXHIGHNY",
    "status": "open",
    "limit": 10 
})

if markets_response and markets_response.get("markets"):
    target_market = markets_response["markets"][0]
    ticker = target_market["ticker"]
    print(f"Found Market: {target_market['title']}")
    print(f"Ticker: {ticker}")
    print(f"Current YES Price: {target_market['yes_bid']} cents\n")
else:
    print("No open NYC weather markets found.")
    exit()

print(f"--- 2. GETTING ORDERBOOK FOR {ticker} ---")
orderbook_resp = make_request("GET", f"/markets/{ticker}/orderbook")

if orderbook_resp:
    ob = orderbook_resp["orderbook"]
    yes_bids = ob.get("yes", [])
    print(f"Orderbook Depth (YES Bids): {len(yes_bids)} levels")
    if yes_bids:
        best_bid = yes_bids[-1]
        print(f"Best YES Bid: {best_bid[1]} contracts at {best_bid[0]} cents\n")

print("--- 3. PLACING & CANCELLING ORDER ---")
order_id = str(uuid.uuid4()) 

order_payload = {
    "action": "buy",
    "client_order_id": order_id,
    "count": 1,
    "side": "yes",
    "ticker": ticker,
    "type": "limit",
    "yes_price": 1 
}

place_response = make_request("POST", "/portfolio/orders", payload=order_payload)

if place_response:
    kalshi_order_id = place_response["order"]["order_id"]
    print(f"Order Placed! ID: {kalshi_order_id}")
    print(f"Status: {place_response['order']['status']}")
  
    time.sleep(1)
    
    
    print(f"Cancelling Order {kalshi_order_id}...")
    cancel_resp = make_request("DELETE", f"/portfolio/orders/{kalshi_order_id}")
    
    if cancel_resp:
        print(f"Order Canceled. Final Status: {cancel_resp['order']['status']}")
