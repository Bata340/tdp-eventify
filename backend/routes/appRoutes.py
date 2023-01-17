from typing import Optional
from fastapi import APIRouter
from fastapi import APIRouter, Depends, HTTPException, status, Request
from model import schema
from model.eventRepository import EventRepository
import uuid
from fastapi.encoders import jsonable_encoder
import datetime
from fastapi.encoders import jsonable_encoder
from model import exceptions


eventRepository = EventRepository()

router = APIRouter()
registeredUsers = {}
registeredUsers['generico'] =  schema.User(
        username = "generico",
        password = "generico",
        first_name = "Usuario",
        last_name = "Generico",
        birth_date = datetime.date(2000,6,30),
        phone_number = "2222-343434",
        location = "Argentina",
        login = False,
        money = 0
    )

def thereIsAvailabilityLeft(event, dateRes):
    if event['maxAvailability'] is None:
        return True 
    print(event['attendance'])
    print(event['maxAvailability'])
    if event['attendance'] == event['maxAvailability']:
        return False
    return True

def convertDatetime(datimes):
    datetime_aux = []
    for date in datimes:
        datetime_aux.append(date.__format__("%Y-%m-%d %H:%M"))
    return datetime_aux



def removeNoneValues(dict_aux: dict):
    dict_aux2 = {}
    for key, value in dict_aux.items():
        if value is not None:
            dict_aux2[key] = value
    return dict_aux2


@router.post("/register", status_code=status.HTTP_200_OK)
async def register(user: schema.User):
    if user.username in registeredUsers.keys():
        return HTTPException(status_code=500, detail="A user with name " + user["username"] + " already exists")
    user.login = False
    user.money = 0
    registeredUsers[user.username] = user
    return {"message" : "registered user " +  user.username}


@router.post("/login", status_code=status.HTTP_200_OK)
async def login(user: schema.UserLogin):

    if user.username not in registeredUsers.keys():
        return HTTPException(status_code=404, detail="User with name " + user.username + " does not exist")
    if registeredUsers[user.username].password != user.password:
        return HTTPException(status_code=401, detail="Wrong password")
    registeredUsers[user.username].login = True
    return {"message" : "ok"}


@router.get("/users/{username}", status_code=status.HTTP_200_OK)
async def getUser(username: str):
    if username not in registeredUsers.keys():
        return HTTPException(status_code=404, detail="User with name " + username + " does not exist")
    return {"message": registeredUsers[username]}


@router.get("/events", status_code=status.HTTP_200_OK)
async def getEvents(owner: Optional[str] = None):
    return eventRepository.getEvents(owner)

@router.post("/event")
async def publishEvent(event: schema.Event):
    event.eventDates = convertDatetime(event.eventDates)
    print(event.eventDates)
    event_aux = jsonable_encoder(event)
    print(event_aux)
    created_event = eventRepository.createEvent(event_aux)
    return {"message": created_event}


@router.get("/event/{id}", status_code=status.HTTP_200_OK)
async def getEventWithId(id: str):
    
    try:
        event = eventRepository.getEventWithId(id)
        return {"message": event}
    except (exceptions.EventInfoException) as error:
        raise HTTPException(**error.__dict__)


@router.delete("/event/{id}", status_code=status.HTTP_200_OK)
async def deleteEvent(id: str):
    try: 
        eventRepository.deleteEventWithId(id)
        return {"message" : "ok"}
    except (exceptions.EventInfoException) as error:
        raise HTTPException(**error.__dict__)


@router.patch("/event/{id}", status_code=status.HTTP_200_OK)
async def editEvent(id: str, eventEdit: schema.EventPatch):
    try: 
        eventEdit.eventDates = convertDatetime(eventEdit.eventDates)
        updated_event = eventRepository.editEventWithId(id, jsonable_encoder(eventEdit))
        return {"message" : updated_event}
    except (exceptions.EventInfoException) as error:
        raise HTTPException(**error.__dict__)
    

@router.post("/event/reserve/{id}", status_code=status.HTTP_200_OK)
async def reserveEvent(id: str, reservation: schema.Reservation):
    try: 
        event = eventRepository.getEventWithId(id)
    except (exceptions.EventInfoException) as error:
        raise HTTPException(**error.__dict__)
    reservation.dateReserved =  reservation.dateReserved.__format__("%Y-%m-%d %H:%M")   
    print(reservation.dateReserved)
    print(event['eventDates'])
    if (len(event['eventDates']) > 0) and (reservation.dateReserved not in event['eventDates']):
        raise HTTPException(status_code=404, detail="Event with id " + id + " has no date " + reservation.dateReserved)

    if not thereIsAvailabilityLeft(event, reservation.dateReserved):
        raise HTTPException(status_code=404, detail="Event with id " + id + " has no more availability for " + reservation.dateReserved)

    eventRepository.editEventWithId(id, {'attendance': event['attendance'] + 1})
    reservation.event_id = id
    reservation_event = jsonable_encoder(reservation)
    created_reservation = eventRepository.create_reservation(reservation_event)
    #TODO: falta cobrar el pago xq la base
    return {"message": created_reservation}


@router.get("/user/event-reservations/{userId}", status_code=status.HTTP_200_OK)
async def get_event_reservations_for_user(userId: str):
    #TODO: check user cuando exista la base
    #if username not in registeredUsers.keys():
        #return HTTPException(status_code=404, detail="User with username " + username + " does not exist.")
    userReservedEvents = eventRepository.getEventsFromUser(userId)
    return userReservedEvents



        
