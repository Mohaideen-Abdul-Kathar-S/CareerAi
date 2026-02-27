# import os
# from pymongo import MongoClient
# from dotenv import load_dotenv

# load_dotenv()

# MONGO_URI = os.getenv("MONGO_URI")
# DB_NAME = os.getenv("DB_NAME")

# # Create MongoDB client
# client = MongoClient(MONGO_URI)

# # Access database
# db = client[DB_NAME]

# print("✅ MongoDB Connected Successfully!")

# auth_collection = db["auth"]

import os
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")
DB_NAME = os.getenv("DB_NAME")

try:
    client = MongoClient(MONGO_URI)
    client.admin.command("ping")
    print("✅ MongoDB Connected Successfully!")
except Exception as e:
    print("❌ Connection Failed:", e)

db = client[DB_NAME]
auth_collection = db["auth"]