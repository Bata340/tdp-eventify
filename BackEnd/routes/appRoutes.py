from typing import Optional
from fastapi import APIRouter
from fastapi import APIRouter, Depends, HTTPException, status, Request
from model import schema
import uuid
import datetime


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
registeredEvents = {}
reservedEvents = {}

remainingAvailabilityEvents = {}


def thereIsAvailabilityLeft(event, dateRes):
    if event.maxAvailability is None:
        return True 
    if dateRes not in remainingAvailabilityEvents[event.key].keys():
        remainingAvailabilityEvents[event.key][dateRes] = event.maxAvailability - 1
        return True
    elif remainingAvailabilityEvents[event.key][dateRes] < event.maxAvailability:
        remainingAvailabilityEvents[event.key][dateRes] -= 1
        return True
    return False


def filterEventsByOwner(events, owner):
    ownersRegistryList = []
    for key in events:
        if events[key].owner == owner:
            ownersRegistryList.append(events[key])
    return ownersRegistryList


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
    if owner != None:
        return filterEventsByOwner(registeredEvents, owner)
    return registeredEvents


@router.post("/event")
async def publishEvent(event: schema.Event):
    id = str(uuid.uuid4())
    registeredEvents[id] = schema.Event(
        key = id, 
        name = event.name,
        owner = event.owner,
        price = event.price,
        description = event.description,
        location = event.location,
        score = event.score,
        eventDates = event.eventDates,
        maxAvailability = event.maxAvailability,
        photos = event.photos,
        paymentsReceived=[]
    )
    reservedEvents[id] = []
    remainingAvailabilityEvents[id] = {}
    return {"message" : "registered event with id: " + id}


@router.get("/event/{id}", status_code=status.HTTP_200_OK)
async def getEventWithId(id: str):
    if id not in registeredEvents.keys():
        return HTTPException(status_code=404, detail="Event with id " + id + " does not exist")
    
    return {"message": registeredEvents[id]}


@router.delete("/event/{id}", status_code=status.HTTP_200_OK)
async def deleteEvent(id: str):
    if id not in registeredEvents.keys():
        return HTTPException(status_code=404, detail="Event with id " + id + " does not exist")
    registeredEvents.pop(id, None)
    return {"message" : "ok"}


@router.patch("/event/{id}", status_code=status.HTTP_200_OK)
async def editEvent(id: str, event: schema.EventPatch):
    if id not in registeredEvents.keys():
        return HTTPException(status_code=404, detail="Event with id " + id + " does not exist")

    stored_event_data = registeredEvents[id]
    update_data = event.dict(exclude_unset=True)
    updated_event = stored_event_data.copy(update=update_data)
    registeredEvents[id] = updated_event
    return {"message" : "ok"}


@router.delete("/event/{eventId}/photos/{photoId}", status_code=status.HTTP_200_OK)
async def deleteEventPhotos(eventId: str, photoId: str):
    if eventId not in registeredEvents.keys():
        return HTTPException(status_code=404, detail="Event with id " + eventId + " does not exist")
    event = registeredEvents[eventId]
    if photoId not in event.photos:
        return HTTPException(status_code=404, detail="Photo with id " + photoId + " does not exist")

    event.photos.pop(event.photos.index(photoId))
    return {"message" : "ok"}
    

@router.post("/event/reserve/{id}", status_code=status.HTTP_200_OK)
async def reserveEvent(id: str, reservation: schema.Reservation):
    if id not in registeredEvents.keys():
        return HTTPException(status_code=404, detail="Event with id " + id + " does not exist")

    event = registeredEvents[id]

    if (len(event.eventDates) > 0) and (reservation.dateReserved not in event.eventDates):
        return HTTPException(status_code=404, detail="Event with id " + id + " has no date " + reservation.dateReserved.strftime("%Y/%m/%d"))

    if not thereIsAvailabilityLeft(event, reservation.dateReserved):
        return HTTPException(status_code=404, detail="Event with id " + id + " has no more availability for " + reservation.dateReserved.strftime("%Y/%m/%d"))

    reservation.event_id = reservation.id
    reservation.id = str(uuid.uuid4())
    reservedEvents[id].append(reservation)
    registeredUsers[event.owner].money += event.price
    registeredEvents[id].paymentsReceived.append({"payer": reservation.userid, "amount": event.price, "date_of_payment": datetime.datetime.now(), "reservation_id": reservation.id, "payment_method": reservation.typeOfCard})
    
    return {"message": "Reservation " + reservation.id  + " was succesfully bought in event " + id + " for " + reservation.dateReserved.strftime("%Y/%m/%d")}


@router.get("/user/event-reservations/{username}", status_code=status.HTTP_200_OK)
async def get_event_reservations_for_user(username: str):
    if username not in registeredUsers.keys():
        return HTTPException(status_code=404, detail="User with username " + username + " does not exist.")
    returnMessage = []
    for _, valueReservation in reservedEvents.items():
        for reservation in valueReservation:
            if reservation.userid == username:
                returnMessage.append({"reservation": reservation, "event": registeredEvents[reservation.event_id]})
    return returnMessage



        
