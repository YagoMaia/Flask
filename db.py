import psycopg2
import psycopg2.extras

db_name = 'flask'
db_password = 'postgres'

class Singleton:
    def __init__(self, klass):
        self.klass = klass
        self.instance = None
    def __call__(self, *args, **kwargs):
        if self.instance == None:
            self.instance = self.klass(*args, **kwargs)
        return self.instance
    
@Singleton
class DataBase:
    def __init__(self):
        self.connection = psycopg2.connect(f"dbname = {db_name} user = {db_password} password = {db_password}")
        self.cursor = self.connection.cursor(cursor_factory=psycopg2.extras.DictCursor)
        
    def fetch_one(self, query:str, **kwargs):
        cursor = self.cursor
        if kwargs:
            cursor.execute(query, kwargs)
        else:
            cursor.execute(query)
        ret = cursor.fetchone()
        return dict(ret)
        