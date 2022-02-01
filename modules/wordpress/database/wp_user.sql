CREATE SCHEMA modules;

ALTER SCHEMA modules OWNER TO postgres;

DROP TABLE modules.wpuser CASCADE;

CREATE TABLE modules.wpuser
(
    id bigserial NOT NULL,
    usertype int NOT NULL DEFAULT 10,
    registration_time timestamp without time zone NOT NULL DEFAULT now(),
    login_time timestamp without time zone NULL,
    user_login varchar NOT NULL,
    session_id varchar NULL,
    CONSTRAINT wpuser_pkey PRIMARY KEY (id),
    CONSTRAINT wpuser_usertype CHECK (usertype IN (10, 20))
);

CREATE UNIQUE INDEX "modules.idx_wpuser_unique_user_login" ON modules.wpuser (user_login);


ALTER TABLE crm.address
ADD COLUMN wpuser_id bigint NULL;

ALTER TABLE ONLY crm.address
    DROP CONSTRAINT wpuser_id_pkey;

ALTER TABLE ONLY crm.address
    ADD CONSTRAINT wpuser_id_pkey FOREIGN KEY (wpuser_id) REFERENCES modules.wpuser(id);
