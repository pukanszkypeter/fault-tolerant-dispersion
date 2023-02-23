CREATE TABLE IF NOT EXISTS `backend`.`results` (
    id INT  NOT NULL AUTO_INCREMENT PRIMARY KEY,
    algorithm_type VARCHAR(255) NOT NULL,
    graph_type VARCHAR(255) NOT NULL,
    nodes INT NOT NULL,
    robots INT NOT NULL,
    steps INT NOT NULL,
    robots_crashed INT
);