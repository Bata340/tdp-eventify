from pymongo import MongoClient
from neo4j import GraphDatabase
from database import settings

client = MongoClient(settings.mongodb_uri, settings.mongodb_port)
events_db_mdb = client['events']

# For knowing how to use Neo4J: https://neo4j.com/developer/python/
# https://console.neo4j.io/?language=Python&product=aura-db#how-to-connect
neo4j_driver = GraphDatabase.driver(settings.uriN4J, auth=(settings.userN4J, settings.passwordN4J))
users_db_n4j = neo4j_driver.session(database="neo4j")
