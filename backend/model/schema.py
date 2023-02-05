from typing import List, Optional, Union
from pydantic import BaseModel
from datetime import date, datetime


class User(BaseModel):
    name: str
    password: str
    email: str
    birth_date: date
    money: Optional[float] = 0
    profilePic: Optional[str] = None

class UserLogin(BaseModel):
    email: str
    password: str    

class Event(BaseModel):
    key: Optional[str]
    name: str
    owner: str
    price: int
    description: str
    location: str
    score: Optional[int]
    maxAvailability: Optional[int] = None #cupos. si es None es porque son ilimitados. Los cupos deberían ser los cupos para cada fecha.
    eventDates: Optional[List[datetime]] = None #Si la lista está vacía o es null, entonces puede hacerse todos los días.
    photos: Union[List[str], None] = None
    paymentsReceived: Optional[List]
    attendance: Optional[int] = 0
    category: str


class EventPatch(BaseModel):
    name: Optional[str] = None
    price: Optional[float] = None
    description: Optional[str] = None
    maxAvailability: Optional[int] = None
    location: Optional[str] = None
    maxAvailability: Optional[int] = None 
    eventDates: Optional[List[datetime]] = None
    photos: Optional[List[str]] = None
    category: str

class Reservation(BaseModel):
    id: Optional[str]
    event_id: Optional[str]
    userid: str
    dateReserved: datetime
    typeOfCard: str