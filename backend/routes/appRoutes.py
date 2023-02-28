from typing import Optional
from fastapi import APIRouter
from fastapi import APIRouter, Depends, HTTPException, status, Request
from model import schema
from model.eventRepository import EventRepository
from model.userRepository import UserRepository
import uuid
from fastapi.encoders import jsonable_encoder
import datetime
from model import exceptions


eventRepository = EventRepository()
userRepository = UserRepository()

router = APIRouter()


def thereIsAvailabilityLeft(event, dateRes):
    if event['maxAvailability'] is None:
        return True
    if event['attendance'] == event['maxAvailability']:
        return False
    return True


def convertDatetime(datimes):
    datetime_aux = []
    for date in datimes:
        #datetime_aux.append(date.__format__("%Y-%m-%dT%H:%M:%S %Z"))
        datetime_aux.append(date.isoformat())
    return datetime_aux


def removeNoneValues(dict_aux: dict):
    dict_aux2 = {}
    for key, value in dict_aux.items():
        if value is not None:
            dict_aux2[key] = value
    return dict_aux2


@router.post("/register", status_code=status.HTTP_200_OK)
async def register(user: schema.User):
    repoReturn = userRepository.createUser(user)
    if 'status_code' in repoReturn and repoReturn["status_code"] != 200:
        return HTTPException(status_code=repoReturn["status_code"], detail=repoReturn["message"])
    else:
        return {"message": repoReturn["message"]}


# Password received must be hashed...
@router.post("/login", status_code=status.HTTP_200_OK)
async def login(user: schema.UserLogin):
    repoReturn = userRepository.getUser(user.email)
    if repoReturn is None:
        return HTTPException(status_code=404, detail="El usuario no se encuentra en la base de datos.")
    if repoReturn.get("password") != user.password:
        return HTTPException(status_code=401, detail="Contraseña incorrecta. Intente nuevamente.")
    return {
        "message": "Inicio de sesión exitoso.",
        "user": {
            "name": repoReturn.get("name"),
            "email": repoReturn.get("email"),
            "profilePic": repoReturn.get("profile_pic"),
            "money": repoReturn.get("money"),
            "birth_date": str(repoReturn.get("birth_date")),
            "id": repoReturn.id
        }
    }


@router.get("/users", status_code=status.HTTP_200_OK)
async def getUser(email: str = None, name: str = None):
    usersFound = userRepository.getUsersWithFilters(email, name)
    if usersFound is None or len(usersFound) == 0:
        return HTTPException(status_code=404, detail="El usuario no se encuentra en la base de datos.")
    return usersFound

@router.get("/usersWithFriendship", status_code=status.HTTP_200_OK)
async def getUsersWithFriendship(userId: int ):
    usersFound = userRepository.getUsersWithFriendshipAndFilters(userId)
    return usersFound

@router.get("/events", status_code=status.HTTP_200_OK)
async def getEvents(owner: Optional[str] = None, email_request: Optional[str] = None):
    return eventRepository.getEvents(owner, email_request)


@router.post("/event")
async def publishEvent(event: schema.Event):
    event.eventDates = convertDatetime(event.eventDates)
    event_aux = jsonable_encoder(event)
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
        return {"message": "ok"}
    except (exceptions.EventInfoException) as error:
        raise HTTPException(**error.__dict__)


@router.patch("/event/{id}", status_code=status.HTTP_200_OK)
async def editEvent(id: str, eventEdit: schema.EventPatch):
    try:
        eventEdit.eventDates = convertDatetime(eventEdit.eventDates)
        updated_event = eventRepository.editEventWithId(
            id, jsonable_encoder(eventEdit))
        return {"message": updated_event}
    except (exceptions.EventInfoException) as error:
        raise HTTPException(**error.__dict__)


@router.post("/event/reserve/{id}", status_code=status.HTTP_200_OK)
async def reserveEvent(id: str, reservation: schema.Reservation):
    try:
        event = eventRepository.getEventWithId(id)

        reservation.dateReserved = reservation.dateReserved.isoformat()#.__format__(
            #"%Y-%m-%dT%H:%M:%SZ")
        if (len(event['eventDates']) > 0) and (reservation.dateReserved not in event['eventDates']):
            raise HTTPException(status_code=404, detail="Event with id " +
                                id + " has no date " + reservation.dateReserved)

        if not thereIsAvailabilityLeft(event, reservation.dateReserved):
            raise HTTPException(status_code=404, detail="Event with id " +
                                id + " has no more availability for " + reservation.dateReserved)

        eventRepository.editEventWithId(
            id, {'attendance': event['attendance'] + 1})
        reservation.event_id = id
        reservation_event = jsonable_encoder(reservation)
        created_reservation = eventRepository.create_reservation(
            reservation_event)

        userRepository.updateMoneyAccount(event['owner'], event['price'])

        transactionDate = datetime.datetime.now()
        receiverTransaction = schema.Transaction(
            event_id=id,
            userId=event['owner'],
            date=transactionDate,
            typeOfCard=reservation.typeOfCard,
            paymentAmount=event['price'],
            
        )
        eventRepository.createTransaction(
            jsonable_encoder(receiverTransaction))
        # Iria para la segunda version
        #userRepository.updateMoneyAccount(reservation.userid, -event['price'])
        payerTransaction = schema.Transaction(
            event_id=id,
            userId=reservation.userid,
            date=transactionDate,
            typeOfCard=reservation.typeOfCard,
            paymentAmount=-event['price'],
            numberCard=reservation.numberCard
        )
        eventRepository.createTransaction(jsonable_encoder(payerTransaction))

        return {"message": created_reservation}
    except (exceptions.EventInfoException) as error:
        raise HTTPException(**error.__dict__)


@router.get("/user/event-reservations/{userId}", status_code=status.HTTP_200_OK)
async def get_event_reservations_for_user(userId: str):
    # TODO: check user cuando exista la base
    user = userRepository.getUser(userId)
    if user is None:
        return HTTPException(status_code=404, detail="El usuario no se encuentra en la base de datos.")
    userReservedEvents = eventRepository.getEventsFromUser(userId)
    return userReservedEvents


@router.post("/user/{fromUserId}/request", status_code=status.HTTP_200_OK,)
async def send_friendship_request(fromUserId: str, toUserId: str):
    repoReturn = userRepository.getUserById(toUserId)
    if repoReturn is None:
        return HTTPException(status_code=404, detail="El usuario al que desea hacer amigo no se encuentra en la base de datos.")
    userRepository.sendRequest(fromUserId, toUserId)
    return {"message": "request sent"}


@router.get("/user/{userId}/friendRequests")
async def get_friendship_requets(userId: str):
    repoReturn = userRepository.getUserById(userId)
    if repoReturn is None:
        return HTTPException(status_code=404, detail="No existe el usuario con id "+userId)
    usersFound = userRepository.getFriendRequests(userId)

    return usersFound


@router.get("/transactions/{userId}", status_code=status.HTTP_200_OK)
async def get_transactions(userId: str):
    return eventRepository.getTransactionsFromUser(userId)


@router.post("/user/{userId}/acceptRequest")
async def accept_friend_request(userId: str, friendId: str):
    res = ""
    try:
        res = userRepository.acceptFriendRequest(userId, friendId)
    except Exception as e:
        raise HTTPException(
            status_code=404, detail="Error mientras se acepta amistad: ")
    if len(res) == 0:
        raise HTTPException(status_code=400, detail="Request inexistente")
    return {"message": "Friend Added"}


@router.post("/events/favourites/toggle")
async def toggle_favourite_event(user_email: str, event_id: str):
    try:
        res = eventRepository.toggleFavourite({"user_email": user_email, "event_id": event_id})
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=e
        )
    return {"message": res}


@router.get("/events/favourites")
async def get_favourites(user_email: str):
    try:
        res = eventRepository.getFavouriteEvents(user_email)
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=e
        )
    return res


@router.get("/user/{userId}/friends")
async def get_user_friends(userId: str):
    return {"message": []}

