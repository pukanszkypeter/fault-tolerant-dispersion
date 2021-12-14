import sqlite3
import pandas as pd
from flask import Flask, jsonify



def executeQuery(algorithmType, graphType, groupBy):
    connection = sqlite3.Connection("db/memory.sqlite")
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

    return jsonify({'result': result_list})
