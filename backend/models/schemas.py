from pydantic import BaseModel

class RoleRequest(BaseModel):
    role: str

class JDRequest(BaseModel):
    job_description: str

class CompanyRoleRequest(BaseModel):
    company_name: str
    job_role: str

class CareerSwitchRequest(BaseModel):
    current_role: str
    target_role: str


class AnswerRequest(BaseModel):
    session_id: str
    answer: str


class FinalReportRequest(BaseModel):
    session_id: str


class PaymentCreateOrderRequest(BaseModel):
    amount: int


class PaymentVerifyRequest(BaseModel):
    razorpay_order_id: str
    razorpay_payment_id: str
    razorpay_signature: str
