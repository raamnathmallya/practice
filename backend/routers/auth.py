import os
import firebase_admin
from firebase_admin import credentials, auth
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import User

# Initialize Firebase Admin SDK
# This assumes firebase-service-account.json is in the backend directory
try:
    cred = credentials.Certificate(os.path.join(os.path.dirname(__file__), '..', 'firebase-service-account.json'))
    firebase_admin.initialize_app(cred)
except ValueError as e:
    print(f"Firebase initialization error: {e}. Ensure firebase-service-account.json is correctly placed.")
    # Exit or handle error appropriately in a real application

router = APIRouter()

class Token(BaseModel):
    token: str

@router.post("/google")
async def google_auth(token: Token, db: Session = Depends(get_db)):
    try:
        # Verify the Firebase ID token
        decoded_token = auth.verify_id_token(token.token)
        uid = decoded_token['uid']
        email = decoded_token['email']

        # Check if user exists in our database
        user = db.query(User).filter(User.email == email).first()

        if not user:
            # Create new user if they don't exist
            user = User(firebase_uid=uid, email=email, display_name=decoded_token.get('name', email.split('@')[0]))
            db.add(user)
            db.commit()
            db.refresh(user)

        return {"message": "Authentication successful", "user_id": str(user.id), "email": user.email}

    except auth.InvalidIdToken:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid Firebase ID token")
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Authentication failed: {e}")
