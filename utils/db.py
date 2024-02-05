import psycopg2
import psycopg2.extras

db_name = 'flask'
db_password = 'postgres'

class Singleton:
    """
    Classe responsável por deixar apenas uma isntância existênte, não irá criar outra conexão com banco
    """
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
        """
        Função responsável por retorna uma linha da consulta
        """
        try:
            cursor = self.cursor
            if kwargs:
                cursor.execute(query, kwargs)
            else:
                cursor.execute(query)
            self.connection.commit()
            ret = cursor.fetchone()
            return dict(ret)
        except Exception as error:
            return None

    def fetch_all(self, query:str, **kwargs):
        """
        Função responsável por retornar todas as linhas da consulta
        """
        try:
            cursor = self.cursor
            if kwargs:
                cursor.execute(query, kwargs)
            else:
                cursor.execute(query)
            self.connection.commit()
            ret = cursor.fetchall()
            return ret
        except Exception as error:
            return None
    
    def insert(self, query, **kwargs):
        """
        Função responsável por indicar se foi inserido ou não no banco de dados
        """
        cursor = self.cursor
        try:
            if kwargs:
                cursor.execute(query, kwargs)
            else:
                cursor.execute(query)
            self.connection.commit()
            return True
        except:
            return False
        
    def delete(self, query, **kwargs):
        """
        Função responsável por indicar se foi deletado ou não no banco de dados
        """
        cursor = self.cursor
        try:
            if kwargs:
                cursor.execute(query, kwargs)
            else:
                cursor.execute(query)
            self.connection.commit()
            return True
        except:
            return False
    