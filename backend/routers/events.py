from fastapi import APIRouter, Depends, HTTPException, status, Query
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from sqlalchemy.orm import Session
from geoalchemy2.elements import WKTElement
from geoalchemy2.functions import ST_DWithin, ST_AsText
from sqlalchemy import func
from ..database import get_db
from ..models import Event, User

router = APIRouter()

class EventCreate(BaseModel):
    title: str
    description: Optional[str] = None
    start_time: datetime
    end_time: Optional[datetime] = None
    latitude: float
    longitude: float

class EventUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None

class EventResponse(BaseModel):
    id: str
    creator_id: str
    title: str
    description: Optional[str] = None
    start_time: datetime
    end_time: Optional[datetime] = None
    latitude: float
    longitude: float
    created_at: datetime

    class Config:
        orm_mode = True

@router.post("/", response_model=EventResponse, status_code=status.HTTP_201_CREATED)
async def create_event(event: EventCreate, db: Session = Depends(get_db)):
    # TODO: Implement authentication and get current user ID
    # For now, using a placeholder user ID. This needs to be replaced with actual authentication.
    # You would typically get the user ID from the authenticated user's token.
    # For demonstration, let's assume a user with firebase_uid 'test_uid' exists or is created.
    # In a real scenario, this would come from the Firebase token verification.
    
    # Placeholder for authenticated user (replace with actual user from token)
    # This part needs to be integrated with the authentication logic.
    # For now, let's assume a user exists or we create one for testing purposes.
    
    # This is a temporary placeholder. In a real application, the current_user would be
    # obtained from the authentication token after verification.
    # For now, we'll just use the first user in the database or create a dummy one.
    current_user = db.query(User).first()
    if not current_user:
        # Create a dummy user if no user exists for testing purposes
        dummy_firebase_uid = "dummy_firebase_uid_for_testing"
        dummy_email = "dummy@example.com"
        current_user = User(firebase_uid=dummy_firebase_uid, email=dummy_email, display_name="Dummy User")
        db.add(current_user)
        db.commit()
        db.refresh(current_user)
        print(f"Created dummy user: {current_user.email}")


    # Create a WKTElement for the location
    point = WKTElement(f'POINT({event.longitude} {event.latitude})', srid=4326)

    db_event = Event(
        title=event.title,
        description=event.description,
        start_time=event.start_time,
        end_time=event.end_time,
        location=point,
        creator_id=current_user.id # Assign the creator_id from the authenticated user
    )
    db.add(db_event)
    db.commit()
    db.refresh(db_event)

    # Convert the GeoAlchemy2 Point object back to latitude and longitude for the response
    # The location is stored as POINT(longitude latitude) in PostGIS
    # We need to parse it back for the response model
    # This is a simplified parsing, a more robust solution might be needed for complex geometries
    location_wkt = db.scalar(db_event.location.ST_AsText())
    # Example: POINT(10.0 20.0)
    coords_str = location_wkt.replace('POINT(', '').replace(')', '')
    lon, lat = map(float, coords_str.split(' '))

    return EventResponse(
        id=str(db_event.id),
        creator_id=str(db_event.creator_id),
        title=db_event.title,
        description=db_event.description,
        start_time=db_event.start_time,
        end_time=db_event.end_time,
        latitude=lat,
        longitude=lon,
        created_at=db_event.created_at
    )

@router.get("/{event_id}", response_model=EventResponse)
async def get_event(event_id: str, db: Session = Depends(get_db)):
    event = db.query(Event).filter(Event.id == event_id).first()
    if not event:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Event not found")
    
    location_wkt = db.scalar(event.location.ST_AsText())
    coords_str = location_wkt.replace('POINT(', '').replace(')', '')
    lon, lat = map(float, coords_str.split(' '))

    return EventResponse(
        id=str(event.id),
        creator_id=str(event.creator_id),
        title=event.title,
        description=event.description,
        start_time=event.start_time,
        end_time=event.end_time,
        latitude=lat,
        longitude=lon,
        created_at=event.created_at
    )

@router.put("/{event_id}", response_model=EventResponse)
async def update_event(event_id: str, event_update: EventUpdate, db: Session = Depends(get_db)):
    event = db.query(Event).filter(Event.id == event_id).first()
    if not event:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Event not found")
    
    # TODO: Add authorization check here (e.g., only creator can update)

    update_data = event_update.dict(exclude_unset=True)
    if "latitude" in update_data and "longitude" in update_data:
        point = WKTElement(f'POINT({update_data["longitude"]} {update_data["latitude"]})', srid=4326)
        event.location = point
        del update_data["latitude"]
        del update_data["longitude"]

    for key, value in update_data.items():
        setattr(event, key, value)
    
    db.add(event)
    db.commit()
    db.refresh(event)

    location_wkt = db.scalar(event.location.ST_AsText())
    coords_str = location_wkt.replace('POINT(', '').replace(')', '')
    lon, lat = map(float, coords_str.split(' '))

    return EventResponse(
        id=str(event.id),
        creator_id=str(event.creator_id),
        title=event.title,
        description=event.description,
        start_time=event.start_time,
        end_time=event.end_time,
        latitude=lat,
        longitude=lon,
        created_at=event.created_at
    )

@router.delete("/{event_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_event(event_id: str, db: Session = Depends(get_db)):
    event = db.query(Event).filter(Event.id == event_id).first()
    if not event:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Event not found")
    
    # TODO: Add authorization check here (e.g., only creator can delete)

    db.delete(event)
    db.commit()
    return

@router.get("/feed", response_model=List[EventResponse])
async def get_event_feed(
    latitude: float = Query(..., ge=-90, le=90),
    longitude: float = Query(..., ge=-180, le=180),
    radius: float = Query(25000, gt=0, description="Radius in meters"), # Default 25km
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db)
):
    # Create a WKTElement for the user's current location
    user_location = WKTElement(f'POINT({longitude} {latitude})', srid=4326)

    # Query events within the specified radius
    # ST_DWithin expects distance in meters for GEOGRAPHY type
    query = db.query(Event).filter(ST_DWithin(Event.location, user_location, radius))

    # Apply pagination
    offset = (page - 1) * limit
    events = query.offset(offset).limit(limit).all()

    # Convert GeoAlchemy2 Point objects back to latitude and longitude for each event
    response_events = []
    for event in events:
        location_wkt = db.scalar(ST_AsText(event.location))
        coords_str = location_wkt.replace('POINT(', '').replace(')', '')
        lon, lat = map(float, coords_str.split(' '))
        response_events.append(EventResponse(
            id=str(event.id),
            creator_id=str(event.creator_id),
            title=event.title,
            description=event.description,
            start_time=event.start_time,
            end_time=event.end_time,
            latitude=lat,
            longitude=lon,
            created_at=event.created_at
        ))
    return response_events
