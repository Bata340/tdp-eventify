from . import exceptions
from typing import Union
from pymongo import MongoClient
from database import settings
import json
from bson import json_util
from bson.objectid import ObjectId





class EventRepository:
    def __init__(self):
        self.mongo = MongoClient(settings.mongodb_uri, settings.mongodb_port)
        self.database = self.mongo["events"]
        self.reserveEvents = self.mongo["reservedEvents"]
        self.transactions = self.mongo["transactions"]
        self.favouriteEvents = self.mongo["favouriteEventes"]
        

    def getEventWithId(self, id: str):
        event = self.database["events"].find_one({"_id": ObjectId(id)})
        if event is  None:
            raise exceptions.EventNotFound
        return json.loads(json_util.dumps(event))
        
    def getEvents(self, owner: Union[str, None] = None, email_request: Union[str, None] = None):
        filter = {}
        if owner is not None:
            filter['owner'] = owner
        returned_events = self.database["events"].find(filter=filter)
        events = list(json.loads(json_util.dumps(returned_events)))
        if email_request is not None:
            for event in events:
                favEvent = self.favouriteEvents["favouriteEvents"].find_one({"user_email": email_request, "event_id": event["_id"]["$oid"]})
                if favEvent is not None:
                    event["is_favourite"] = True
                else:
                    event["is_favourite"] = False
        return events
        
    def createEvent(self, event: dict):
        
        new_event = self.database["events"].insert_one(event)
        event_created = self.database["events"].find_one({"_id": new_event.inserted_id})
        return json.loads(json_util.dumps(event_created))

    def deleteEventWithId(self, id: str):
        deleted_event = self.database["events"].delete_one({"_id": ObjectId(id)})
        if deleted_event.deleted_count == 0:
            raise exceptions.EventNotFound
        return deleted_event

    def editEventWithId(self, id: str, fields: dict):
        event = self.database["events"].find_one({"_id": ObjectId(id)})
        if event is None:
            raise exceptions.EventNotFound

        update_result = self.database["events"].update_one(
                {"_id": ObjectId(id)}, {"$set": fields}
        )           
        
        event = self.database["events"].find_one({"_id": ObjectId(id)})
        return json.loads(json_util.dumps(event))
    
    def create_reservation(self, reservation: dict):
        new_event_reservation = self.reserveEvents["reservedEvents"].insert_one(reservation)
        event_reservation_created = self.reserveEvents["reservedEvents"].find_one({"_id": new_event_reservation.inserted_id})
         
        return json.loads(json_util.dumps(event_reservation_created))
        
    def getEventsFromUser(self, userId: str):
        filter = {'userid': userId}
        reservedEvents = self.reserveEvents["reservedEvents"].find(filter=filter)
        events = list(json.loads(json_util.dumps(reservedEvents)))
        for event in events:
            event["event_data"] = self.getEventWithId(event["event_id"])
        return events

    def getTransactionsFromUser(self, userId: str):
        filter = {'userId': userId}
        returnedTransactions = self.transactions["transactions"].find(filter=filter)
        txs = list(json.loads(json_util.dumps(returnedTransactions)))
        return txs

    def createTransaction(self, tx: dict):
        transaction = self.transactions["transactions"].insert_one(tx)
        newTransaction = self.transactions["transactions"].find_one({"_id": transaction.inserted_id})
        return json.loads(json_util.dumps(newTransaction))

    def toggleFavourite(self, fields: dict):
        favouriteDocs = self.favouriteEvents["favouriteEvents"].find_one(fields)
        if favouriteDocs is not None:
            self.favouriteEvents["favouriteEvents"].delete_one({"_id": favouriteDocs["_id"]})
            return "El evento ha sido quitado de favoritos."
        else:
            self.favouriteEvents["favouriteEvents"].insert_one(fields)
            return "El evento ha sido añadido a favoritos."

    def getFavouriteEvents(self, user_email: str):
        favEvents = self.favouriteEvents["favouriteEvents"].find(filter={"user_email": user_email})
        if favEvents is None:
            return []
        else:
            listOfFavs = list(json.loads(json_util.dumps(favEvents)))
            listReturn = []
            for fav in listOfFavs:
                event = self.getEventWithId(fav["event_id"])
                event["is_favourite"] = True
                listReturn.append(event)
            return listReturn
        

    def disconnectDB(self):
        self.mongo.close()