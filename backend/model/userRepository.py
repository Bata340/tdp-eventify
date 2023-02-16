from neo4j import GraphDatabase
from database.database import users_db_n4j, neo4j_driver


class UserRepository:

    def __init__(self):
        self.neo4j_driver = neo4j_driver
        self.usersDB = users_db_n4j

    def getUser(self, email: str):
        user = self.usersDB.execute_read(self._getUser, email)
        return user

    def getUserById(self, id: str):
        user = self.usersDB.execute_read(self._getUserById, id)
        return user

    def createUser(self, user: dict):
        message = self.usersDB.execute_write(self._createUser, user)
        return message

    def getUsersWithFilters(self, email: str, name: str):
        users = self.usersDB.execute_read(
            self._execute_get_users_with_filters, email, name)
        return users

    def sendRequest(self, fromUserId: str, toUserId: str):
        self.usersDB.execute_write(
            self._send_request, int(fromUserId), int(toUserId))

    def getFriendRequests(self, userId):
        return self.usersDB.execute_read(self._getFriendRequests, userId)

    @staticmethod
    def _getUser(tx, email: str):
        try:
            result = tx.run(
                "MATCH (user:User {email: $email}) return user",
                email=email
            )
        except:
            return None
        singleRes = result.single()
        if singleRes is None:
            return None
        else:
            return singleRes.value()

    @staticmethod
    def _getUserById(tx, id: str):
        id = int(id)
        try:
            result = tx.run(
                "MATCH (user:User) WHERE ID(user) = $id return user",
                id=id
            )
        except:
            return None
        singleRes = result.single()
        if singleRes is None:
            return None
        else:
            return singleRes.value()

    @staticmethod
    def _createUser(tx, user: dict):
        if UserRepository._getUser(tx, user.email) is not None:
            return {"status_code": 403, "message": "El usuario ya existe en la base de datos."}
        result = tx.run(
            "CREATE (user:User {name: $name, email: $email, password: $password, birth_date: $birth_date, profile_pic: $profile_pic, money: 0}) "
            "RETURN 'El usuario asociado al email ' + $email + ' ha sido creado correctamente.'",
            name=user.name.title(),
            email=user.email.lower(),
            password=user.password,
            birth_date=user.birth_date,
            profile_pic=user.profilePic
        )
        return {"message": result.single()[0]}

    @staticmethod
    def _execute_get_users_with_filters(tx, email, name):
        if email is None:
            email = ""
        if name is None:
            name = ""
        user_nodes = tx.run(
            "MATCH (user:User) "
            "WHERE user.name CONTAINS $name AND user.email CONTAINS $email "
            "RETURN user",
            name=name.title(),
            email=email.lower()
        )
        return _process_user_nodes(user_nodes)

    @staticmethod
    def _send_request(tx, fromUserId, toUserId):
        tx.run("MATCH"
               "(a:User),"
               "(b:User)"
               " WHERE ID(a) = $fromUserId AND ID(b) = $toUserId"
               " CREATE (a)-[r:REQUEST]->(b)"
               " RETURN type(r) ",
               fromUserId=fromUserId, toUserId=toUserId
               )

    @staticmethod
    def _getFriendRequests(tx, userId):
        user_nodes = tx.run("MATCH (user:User)-[r:REQUEST]->(u:User)"
                            " WHERE ID(u) = $userId"
                            " RETURN user", userId=int(userId))
        return _process_user_nodes(user_nodes)


def _process_user_nodes(user_nodes):
    results_list = []
    # print(user_nodes.data())
    for record in user_nodes.data():
        results_list.append(
            {
                "name": record["user"]["name"],
                "email": record["user"]["email"],
                "profilePic": record["user"]["profile_pic"]
            }
        )

    return results_list
