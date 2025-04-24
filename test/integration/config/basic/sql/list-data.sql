CREATE SCHEMA integrationtest;

CREATE TABLE integrationtest.list1 (
    id int NOT NULL,
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


CREATE TABLE integrationtest.list2 (
    id int NOT NULL,
    col1 boolean NOT NULL,
    col2 character varying NOT NULL,
    col3 int NOT NULL,
    col4 character varying NOT NULL
);

GRANT ALL ON TABLE integrationtest.list2 TO x0;

DELETE FROM integrationtest.list2;

INSERT INTO integrationtest.list2 (id, col1, col2, col3, col4) VALUES (1, true, 'row1-2', 10, 'row1-4');
INSERT INTO integrationtest.list2 (id, col1, col2, col3, col4) VALUES (2, true, 'row2-2', 10, 'row2-4');
INSERT INTO integrationtest.list2 (id, col1, col2, col3, col4) VALUES (3, false, 'row3-2', 20, 'row3-4');
INSERT INTO integrationtest.list2 (id, col1, col2, col3, col4) VALUES (4, false, 'row4-2', 20, 'row4-4');
INSERT INTO integrationtest.list2 (id, col1, col2, col3, col4) VALUES (5, true, 'row5-2', 30, 'row5-4');
INSERT INTO integrationtest.list2 (id, col1, col2, col3, col4) VALUES (6, false, 'row6-2', 10, 'row6-4');
INSERT INTO integrationtest.list2 (id, col1, col2, col3, col4) VALUES (7, false, 'row7-2', 30, 'row7-4');
INSERT INTO integrationtest.list2 (id, col1, col2, col3, col4) VALUES (8, true, 'row8-2', 30, 'row8-4');
INSERT INTO integrationtest.list2 (id, col1, col2, col3, col4) VALUES (9, true, 'row9-2', 10, 'row9-4');
INSERT INTO integrationtest.list2 (id, col1, col2, col3, col4) VALUES (10, true, 'row10-2', 10, 'row10-4');
INSERT INTO integrationtest.list2 (id, col1, col2, col3, col4) VALUES (11, false, 'row11-2', 20, 'row11-4');
INSERT INTO integrationtest.list2 (id, col1, col2, col3, col4) VALUES (12, true, 'row12-2', 30, 'row12-4');
INSERT INTO integrationtest.list2 (id, col1, col2, col3, col4) VALUES (13, false, 'row13-2', 30, 'row13-4');
INSERT INTO integrationtest.list2 (id, col1, col2, col3, col4) VALUES (14, false, 'row14-2', 20, 'row14-4');
INSERT INTO integrationtest.list2 (id, col1, col2, col3, col4) VALUES (15, false, 'row15-2', 10, 'row15-4');
INSERT INTO integrationtest.list2 (id, col1, col2, col3, col4) VALUES (16, true, 'row16-2', 10, 'row16-4');
