import sqlite3

class Logger:

    def __init__(self, json):
        self.algorithmType = json['algorithmType']
        self.graphType = json['graphType']
        self.nodes = json['nodes']
        self.robots = json['robots']
        self.components = json['components']
        self.steps = json['steps']

    def log(self):
        try:
            with sqlite3.connect("./db/memory.sqlite" , detect_types = sqlite3.PARSE_DECLTYPES | sqlite3.PARSE_COLNAMES) as connection:
                
                cursor = connection.cursor()
                sql_insert_query = """insert into algorithm_results (algorithm_type, graph_type, nodes, robots, components, steps) values (?, ?, ?, ?, ?, ?)"""
                connection.execute(sql_insert_query, (self.algorithmType, self.graphType, self.nodes, self.robots, self.components, self.steps))
                connection.commit()
                result = True
        except:
            connection.rollback()
            result = False
        finally:
            return result
            cursor.close()