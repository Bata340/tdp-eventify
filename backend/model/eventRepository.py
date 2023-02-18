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
        

    def getEventWithId(self, id: str):
        event = self.database["events"].find_one({"_id": ObjectId(id)})
        if event is  None:
            raise exceptions.EventNotFound
        return json.loads(json_util.dumps(event))
        
    def getEvents(self, owner: Union[str, None] = None):
        filter = {}
        if owner is not None:
            filter['owner'] = owner
        returned_events = self.database["events"].find(filter=filter)
        events = list(json.loads(json_util.dumps(returned_events)))
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
        return events

    def getTransactionsFromUser(self, userId: str):
        filter = {'userId': userId}
        print(filter)
        returnedTransactions = self.transactions["transactions"].find(filter=filter)
        print(returnedTransactions)
        txs = list(json.loads(json_util.dumps(returnedTransactions)))
        return txs

    def createTransaction(self, tx: dict):
        transaction = self.transactions["transactions"].insert_one(tx)
        newTransaction = self.transactions["transactions"].find_one({"_id": transaction.inserted_id})
        return json.loads(json_util.dumps(newTransaction))

    def disconnectDB(self):
        self.mongo.close()