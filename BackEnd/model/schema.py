from typing import List, Optional, Union
from pydantic import BaseModel
from datetime import date, datetime


class User(BaseModel):
    username: str
    password: str
    first_name: str
    last_name: str
    birth_date: date
    phone_number : Union[str, None] = None
    location: str
    login: bool

class UserLogin(BaseModel):
    username: str
    password: str    

class Event(BaseModel):
    key: Optional[str]
    name: str
    owner: str
    price: int
    description: str
    location: str
    score: Optional[int]
    maxAvailability: Union[int, None] = None #cupos. si es None es porque son ilimitados. Los cupos deberían ser los cupos para cada fecha.
    eventDates: Optional[List[datetime]] #Si la lista está vacía o es null, entonces puede hacerse todos los días.
    photos: Union[List[str], None] = None


class EventPatch(BaseModel):
    name: Optional[str] = None
    price: Optional[int] = None
    description: Optional[str] = None
    maxAvailability: Optional[int] = None
    location: Optional[str] = None
    photos: Optional[List[str]] = None

class Reservation(BaseModel):
    id: Optional[str]
    userid: str
    dateReserved: date