from . import exceptions
from typing import Union
from pymongo import MongoClient
from database import settings

class EventRepository:
    def __init__(self):
        self.mongo = MongoClient(settings.mongodb_uri, settings.mongodb_port)
        self.database = self.mongo["events"]

    def getEventWithId(self, id: str):
        event = self.database["events"].find_one({"_id": id})
        if event is  None:
            raise exceptions.EventNotFound
        return event
        
    def getEvents(self, owner: Union[str, None] = None):
        self.database["events"].find(filter=owner)
        
    def createEvent(self, event: dict):
        new_event = self.database["events"].insert_one(event)
        event_created = self.database["events"].find_one(
        {"_id": new_event.inserted_id})
        return event_created

    def deleteEventWithId(self, id: str):
        event = self.database["events"].delete_one({"_id": id})
        if event is None:
            raise exceptions.EventNotFound
        return event

    def editEventWithId(self, id: str, fields: dict):
        event = self.database["events"].find_one({"_id": id})
        if event is None:
            raise exceptions.EventNotFound
        update_result = self.database["events"].update_one(
                {"_id": id}, {"$set": fields}
        )
        return update_result
    
    def disconnectDB(self):
        self.mongo.close()