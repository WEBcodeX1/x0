CREATE SCHEMA integrationtest;

CREATE TABLE integrationtest.list1 (
    id character varying NOT NULL,
    col1 character varying NOT NULL,
    col2 character varying NOT NULL
);

GRANT ALL ON SCHEMA integrationtest TO x0;
GRANT ALL ON TABLE integrationtest.list1 TO x0;

DELETE FROM integrationtest.list1;

INSERT INTO integrationtest.list1 (id, col1, col2) VALUES (1, 'row1-1', 'row1-2');
INSERT INTO integrationtest.list1 (id, col1, col2) VALUES (2, 'row2-1', 'row2-2');
INSERT INTO integrationtest.list1 (id, col1, col2) VALUES (3, 'row3-1', 'row3-2');
INSERT INTO integrationtest.list1 (id, col1, col2) VALUES (4, 'row4-1', 'row4-2');
INSERT INTO integrationtest.list1 (id, col1, col2) VALUES (5, 'row5-1', 'row5-2');
INSERT INTO integrationtest.list1 (id, col1, col2) VALUES (6, 'row6-1', 'row6-2');
INSERT INTO integrationtest.list1 (id, col1, col2) VALUES (7, 'row7-1', 'row7-2');
INSERT INTO integrationtest.list1 (id, col1, col2) VALUES (8, 'row8-1', 'row8-2');
INSERT INTO integrationtest.list1 (id, col1, col2) VALUES (9, 'row9-1', 'row9-2');
INSERT INTO integrationtest.list1 (id, col1, col2) VALUES (10, 'row10-1', 'row10-2');
INSERT INTO integrationtest.list1 (id, col1, col2) VALUES (11, 'row11-1', 'row11-2');
INSERT INTO integrationtest.list1 (id, col1, col2) VALUES (12, 'row12-1', 'row12-2');
INSERT INTO integrationtest.list1 (id, col1, col2) VALUES (13, 'row13-1', 'row13-2');
INSERT INTO integrationtest.list1 (id, col1, col2) VALUES (14, 'row14-1', 'row14-2');
INSERT INTO integrationtest.list1 (id, col1, col2) VALUES (15, 'row15-1', 'row15-2');
INSERT INTO integrationtest.list1 (id, col1, col2) VALUES (16, 'row16-1', 'row16-2');
INSERT INTO integrationtest.list1 (id, col1, col2) VALUES (17, 'row17-1', 'row17-2');
INSERT INTO integrationtest.list1 (id, col1, col2) VALUES (18, 'row18-1', 'row18-2');
INSERT INTO integrationtest.list1 (id, col1, col2) VALUES (19, 'row19-1', 'row19-2');
INSERT INTO integrationtest.list1 (id, col1, col2) VALUES (20, 'row20-1', 'row20-2');
INSERT INTO integrationtest.list1 (id, col1, col2) VALUES (21, 'row21-1', 'row21-2');
INSERT INTO integrationtest.list1 (id, col1, col2) VALUES (22, 'row22-1', 'row22-2');
INSERT INTO integrationtest.list1 (id, col1, col2) VALUES (23, 'row23-1', 'row23-2');
INSERT INTO integrationtest.list1 (id, col1, col2) VALUES (24, 'row24-1', 'row24-2');
INSERT INTO integrationtest.list1 (id, col1, col2) VALUES (25, 'row25-1', 'row25-2');
INSERT INTO integrationtest.list1 (id, col1, col2) VALUES (26, 'row26-1', 'row26-2');
INSERT INTO integrationtest.list1 (id, col1, col2) VALUES (27, 'row27-1', 'row27-2');
INSERT INTO integrationtest.list1 (id, col1, col2) VALUES (28, 'row28-1', 'row28-2');
INSERT INTO integrationtest.list1 (id, col1, col2) VALUES (29, 'row29-1', 'row29-2');
INSERT INTO integrationtest.list1 (id, col1, col2) VALUES (30, 'row30-1', 'row30-2');
INSERT INTO integrationtest.list1 (id, col1, col2) VALUES (31, 'row31-1', 'row31-2');
