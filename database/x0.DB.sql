--
-- PostgreSQL database dump
--

-- Dumped from database version 12.1
-- Dumped by pg_dump version 12.3

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

--
-- Name: x0; Type: DATABASE; Schema: -; Owner: postgres
--

CREATE DATABASE x0 WITH TEMPLATE = template0 ENCODING = 'UTF8' LC_COLLATE = 'de_DE.UTF-8' LC_CTYPE = 'de_DE.UTF-8';

ALTER DATABASE x0 OWNER TO postgres;

\connect x0

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

--
-- Name: webui; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA webui;

ALTER SCHEMA webui OWNER TO postgres;
GRANT ALL ON SCHEMA webui TO x0;

SET default_tablespace = '';


CREATE USER x0 WITH ENCRYPTED PASSWORD 'dummy';

--
-- Name: text; Type: TABLE; Schema: webui; Owner: postgres
--

CREATE TABLE webui.text (
    id character varying NOT NULL,
    "group" character varying DEFAULT 'global'::character varying NOT NULL,
    value_de character varying NOT NULL,
    value_en character varying,
    orderby integer DEFAULT 1 NOT NULL
);


ALTER TABLE webui.text OWNER TO postgres;


--
-- Data for Name: text; Type: TABLE DATA; Schema: webui; Owner: postgres
--

COPY webui.text (id, "group", value_de, value_en, orderby) FROM stdin;
TXT.FORMFIELD.GLOBAL.YES	formfield	ja	\N	1
TXT.FORMFIELD.GLOBAL.NO	formfield	nein	\N	1
TXT.SYS.ERROR	sysinternal	Fehler	\N	1
TXT.SYS.EDITNOTALLOWED	sysinternal	Bearbeitung nicht erlaubt.	\N	1
TXT.CONTEXTMENU.EDIT	contextmenu	bearbeiten	\N	1
TXT.SYS.CONTEXTMENU.DISPLAY	sysinternal	Context Menü	\N	1
TXT.SYS.INDICATOR.SYSTEMMSG	sysinternal	Systemnachricht	\N	1
TXT.SYS.INDICATOR.ACTIONPENDING	sysinternal	Vorgang in Bearbeitung	\N	1
TXT.CONTEXTMENU.DELETE	contextmenu	löschen	\N	1
TXT.CONTEXTMENU.DETAIL	contextmenu	Detail	\N	1
TXT.SYS.OBJECT.DEFAULT.TEXT	default	Default	\N	1
TXT.CONTEXTMENU.RESET	contextmenu	Alle Zeilen löschen	\N	1
TXT.CONTEXTMENU.REMOVE	contextmenu	Entfernen	\N	1
TXT.CONTEXTMENU.APPLY	contextmenu	Zeile übernehmen	\N	1
TXT.SYS.INDICATOR.INCOMINGPHONECALL	indicatorheader	Eingehender Anruf	\N	1
TXT.MENU.BASICEXAMPLE.ROOT	menu	MenuRoot	\N	1
TXT.MENU.BASICEXAMPLE.SCREEN1	menu	Screen1	\N	1
TXT.BASICEXAMPLE.TEXT1	sqltext	Hello World	\N	1
\.


--
-- Name: text text_pkey; Type: CONSTRAINT; Schema: webui; Owner: postgres
--

ALTER TABLE ONLY webui.text
    ADD CONSTRAINT text_pkey PRIMARY KEY (id);


GRANT ALL ON webui.text TO x0;

--
-- PostgreSQL database dump complete
--
