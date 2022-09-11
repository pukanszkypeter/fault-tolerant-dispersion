import sqlite3
import pandas as pd

def groupByQuery(algorithmType, graphType, groupBy):
    connection = sqlite3.Connection("./database/database.sqlite")
    result = []
    
    if groupBy == 'nodes':
        sqlQuery = "Select nodes, AVG(steps) from algorithm_results where algorithm_type = :1 and graph_type = :2 group by nodes"
        result = pd.read_sql(sqlQuery, connection, params={"1": algorithmType, "2": graphType})
    elif groupBy == 'robots':
        sqlQuery = "Select robots, AVG(steps) from algorithm_results where algorithm_type = :1 and graph_type =:2 group by robots"
        result = pd.read_sql(sqlQuery, connection, params={"1": algorithmType, "2": graphType})
    elif groupBy == 'components':
        sqlQuery = "Select components, AVG(steps) from algorithm_results where algorithm_type = :1 and graph_type = :2 group by components"
        result = pd.read_sql( sqlQuery, connection, params={"1": algorithmType, "2": graphType})

    result_list = result.values.tolist()
    object_list = []
    for result in result_list:
        object_list.append({'name': str(result[0]), 'value': result[1]})

    return {'name': 'Group By', 'series': object_list}


def summaryByQuery(summaryBy):
    connection = sqlite3.Connection("./database/database.sqlite")
    result = []

    if summaryBy == 'max':
        sqlQuery = "Select MAX(steps), algorithm_type, graph_type from algorithm_results group by algorithm_type, graph_type"
        result = pd.read_sql(sqlQuery, connection)
    elif summaryBy == 'min':
        sqlQuery = "Select MIN(steps), algorithm_type, graph_type from algorithm_results group by algorithm_type, graph_type"
        result = pd.read_sql(sqlQuery, connection)
    elif summaryBy == 'tests':
        sqlQuery = "Select COUNT(*), algorithm_type, graph_type from algorithm_results group by algorithm_type, graph_type"
        result = pd.read_sql(sqlQuery, connection)
    elif summaryBy == 'average':
        sqlQuery = "Select AVG(steps), algorithm_type, graph_type from algorithm_results group by algorithm_type, graph_type"
        result = pd.read_sql(sqlQuery, connection)

    return result.values.tolist()

def detailByQuery(detailBy,  algorithmType, graphType):
    connection = sqlite3.Connection("./database/database.sqlite")
    result = []

    if detailBy == 'max':
        sqlQuery = "Select MAX(steps), nodes, robots, components from algorithm_results where algorithm_type = :1 and graph_type = :2 group by nodes, robots, components"
        result = pd.read_sql(sqlQuery, connection, params={"1": algorithmType, "2": graphType})
    elif detailBy == 'min':
        sqlQuery = "Select MIN(steps), nodes, robots, components from algorithm_results where algorithm_type = :1 and graph_type = :2 group by nodes, robots, components"
        result = pd.read_sql(sqlQuery, connection, params={"1": algorithmType, "2": graphType})
    elif detailBy == 'tests':
        sqlQuery = "Select COUNT(*), nodes, robots, components from algorithm_results where algorithm_type = :1 and graph_type = :2 group by nodes, robots, components"
        result = pd.read_sql(sqlQuery, connection, params={"1": algorithmType, "2": graphType})
    elif detailBy == 'average':
        sqlQuery = "Select AVG(steps), nodes, robots, components from algorithm_results where algorithm_type = :1 and graph_type = :2 group by nodes, robots, components"
        result = pd.read_sql(sqlQuery, connection, params={"1": algorithmType, "2": graphType})

    return result.values.tolist()
