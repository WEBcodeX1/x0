--
-- PostgreSQL database dump
--

\connect ${SYS_DATABASE}


SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

CREATE USER x0 WITH ENCRYPTED PASSWORD '${SYS_x0_PWD}';
ALTER ROLE x0 WITH ENCRYPTED PASSWORD '${SYS_x0_PWD}' LOGIN;

CREATE SCHEMA webui;

ALTER SCHEMA webui OWNER TO postgres;
GRANT ALL ON SCHEMA webui TO x0;

CREATE SCHEMA system;

ALTER SCHEMA system OWNER TO postgres;
GRANT ALL ON SCHEMA system TO x0;

CREATE TABLE webui.text (
    id character varying NOT NULL,
    "group" character varying DEFAULT 'global'::character varying NOT NULL,
    value_de character varying,
    value_en character varying,
    orderby integer DEFAULT 1 NOT NULL
);

ALTER TABLE webui.text OWNER TO postgres;


CREATE TABLE system.config (
    id bigserial NOT NULL,
    app_id character varying NOT NULL DEFAULT 'default',
    config_group character varying NOT NULL,
    "value" character varying NOT NULL
);

ALTER TABLE system.config OWNER TO postgres;

ALTER TABLE ONLY webui.text
    ADD CONSTRAINT text_pkey PRIMARY KEY (id);

GRANT SELECT ON webui.text TO x0;

ALTER TABLE ONLY system.config
    ADD CONSTRAINT config_pkey PRIMARY KEY (id);

GRANT SELECT ON system.config TO x0;

CREATE UNIQUE INDEX sys_config_app_value ON system.config (app_id, config_group, "value");

COPY webui.text (id, "group", value_de, value_en, orderby) FROM stdin;
TXT.FORMFIELD.GLOBAL.YES	formfield	Ja	Yes	1
TXT.FORMFIELD.GLOBAL.NO	formfield	Nein	No	1
TXT.SYS.ERROR	sysinternal	Fehler	Global error	1
TXT.SYS.EDITNOTALLOWED	sysinternal	Bearbeitung nicht erlaubt.	Edit not allowed	1
TXT.CONTEXTMENU.EDIT	contextmenu	Bearbeiten	Edit	1
TXT.SYS.CONTEXTMENU.DISPLAY	sysinternal	Context Menü	Context Menu	1
TXT.SYS.INDICATOR.SYSTEMMSG	sysinternal	Systemnachricht	System message	1
TXT.SYS.INDICATOR.ACTIONPENDING	sysinternal	Vorgang in Bearbeitung	Process in progress	1
TXT.CONTEXTMENU.DELETE	contextmenu	Löschen	Delete	1
TXT.CONTEXTMENU.DETAIL	contextmenu	Detail	Detail	1
TXT.SYS.OBJECT.DEFAULT.TEXT	default	Default	Default	1
TXT.CONTEXTMENU.RESET	contextmenu	Alle Zeilen löschen	Delete all rows	1
TXT.CONTEXTMENU.REMOVE	contextmenu	Entfernen	Remove	1
TXT.CONTEXTMENU.APPLY	contextmenu	Zeile übernehmen	Accept line	1
TXT.SYS.INDICATOR.INCOMINGPHONECALL	indicatorheader	Eingehender Anruf	Incoming Call	1
\.
