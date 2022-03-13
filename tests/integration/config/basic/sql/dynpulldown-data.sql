CREATE SCHEMA integrationtest;

CREATE TABLE integrationtest.dynpulldown (
    id character varying NOT NULL,
    "group" character varying NOT NULL,
    testkey character varying NOT NULL,
    testvalue character varying NOT NULL
);

GRANT ALL ON SCHEMA integrationtest TO x0;
GRANT ALL ON TABLE integrationtest.dynpulldown TO x0;

DELETE FROM integrationtest.dynpulldown;

INSERT INTO integrationtest.dynpulldown (id, "group", testkey, testvalue) VALUES (1, 'dynpulldown1', 'Key1', 'Value1');
INSERT INTO integrationtest.dynpulldown (id, "group", testkey, testvalue) VALUES (2, 'dynpulldown1', 'Key2', 'Value2');
INSERT INTO integrationtest.dynpulldown (id, "group", testkey, testvalue) VALUES (3, 'dynpulldown1', 'Key3', 'Value3');
INSERT INTO integrationtest.dynpulldown (id, "group", testkey, testvalue) VALUES (4, 'dynpulldown1', 'Key4', 'Value4');
INSERT INTO integrationtest.dynpulldown (id, "group", testkey, testvalue) VALUES (5, 'dynpulldown1', 'Key5', 'Value5');
