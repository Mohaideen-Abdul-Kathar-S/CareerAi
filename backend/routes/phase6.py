import base64
import hashlib
import hmac
import json
import os
import urllib.error
import urllib.request
from datetime import datetime

from fastapi import APIRouter, HTTPException

from models.schemas import PaymentCreateOrderRequest, PaymentVerifyRequest

router = APIRouter()


@router.post('/create-order')
def create_order(payload: PaymentCreateOrderRequest):
    key_id = os.getenv('RAZORPAY_KEY_ID')
    key_secret = os.getenv('RAZORPAY_KEY_SECRET')

    if not key_id or not key_secret:
        raise HTTPException(status_code=500, detail='Razorpay keys are not configured on backend.')

    if payload.amount <= 0:
        raise HTTPException(status_code=400, detail='Amount must be greater than 0.')

    amount_in_paise = int(payload.amount) * 100
    body = {
        'amount': amount_in_paise,
        'currency': 'INR',
        'receipt': f"receipt_{int(datetime.now().timestamp())}",
    }

    basic_auth = base64.b64encode(f'{key_id}:{key_secret}'.encode('utf-8')).decode('utf-8')
    request = urllib.request.Request(
        url='https://api.razorpay.com/v1/orders',
        data=json.dumps(body).encode('utf-8'),
        headers={
            'Content-Type': 'application/json',
            'Authorization': f'Basic {basic_auth}',
        },
        method='POST',
    )

    try:
        with urllib.request.urlopen(request, timeout=20) as response:
            response_body = response.read().decode('utf-8')
            return json.loads(response_body)
    except urllib.error.HTTPError as exc:
        error_text = exc.read().decode('utf-8') if exc.fp else 'Razorpay API error'
        raise HTTPException(status_code=exc.code, detail=error_text)
    except Exception:
        raise HTTPException(status_code=500, detail='Order creation failed.')


@router.post('/verify-payment')
def verify_payment(payload: PaymentVerifyRequest):
    key_secret = os.getenv('RAZORPAY_KEY_SECRET')

    if not key_secret:
        raise HTTPException(status_code=500, detail='Razorpay secret is not configured on backend.')

    body = f'{payload.razorpay_order_id}|{payload.razorpay_payment_id}'
    expected_signature = hmac.new(
        key_secret.encode('utf-8'),
        body.encode('utf-8'),
        hashlib.sha256,
    ).hexdigest()

    is_valid = hmac.compare_digest(expected_signature, payload.razorpay_signature)

    if not is_valid:
        raise HTTPException(status_code=400, detail='Invalid signature.')

    return {'success': True, 'message': 'Payment verified successfully.'}
