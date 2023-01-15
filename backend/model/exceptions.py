class EventInfoException(Exception):
    ...

class EventNotFound(EventInfoException):
    def __init__(self):
        self.status_code = 404
        self.detail = "The event does not exists"