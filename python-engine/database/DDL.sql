-- Create a database in this folder with the name of 'database.sqlite' and run the following query.

DROP TABLE algorithm_results;

CREATE TABLE algorithm_results (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    algorithm_type TEXT NOT NULL,
    graph_type TEXT NOT NULL,
    nodes INTEGER NOT NULL,
    robots INTEGER NOT NULL,
    components INTEGER NOT NULL,
    steps INTEGER NOT NULL
);