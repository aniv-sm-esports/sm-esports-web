--
-- PostgreSQL database dump
--

-- Dumped from database version 17.4
-- Dumped by pg_dump version 17.4

-- Started on 2025-04-26 17:52:12

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 4 (class 2615 OID 2200)
-- Name: public; Type: SCHEMA; Schema: -; Owner: pg_database_owner
--

CREATE SCHEMA public;


ALTER SCHEMA public OWNER TO pg_database_owner;

--
-- TOC entry 5048 (class 0 OID 0)
-- Dependencies: 4
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: pg_database_owner
--

COMMENT ON SCHEMA public IS 'standard public schema';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 237 (class 1259 OID 16707)
-- Name: Article; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Article" (
    "Id" integer NOT NULL,
    "UserId" integer NOT NULL,
    "Date" timestamp with time zone NOT NULL,
    "Title" character varying(500) NOT NULL,
    "Description" character varying(5000) NOT NULL,
    "Body" text,
    "BannerImageUrl" character varying(8000),
    "BannerYoutubeSourceId" character varying(100),
    "BannerLinkTypeId" integer NOT NULL
);


ALTER TABLE public."Article" OWNER TO postgres;

--
-- TOC entry 238 (class 1259 OID 16714)
-- Name: ArticleBannerLinkType; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."ArticleBannerLinkType" (
    "Id" integer NOT NULL,
    "Name" character varying(50) NOT NULL
);


ALTER TABLE public."ArticleBannerLinkType" OWNER TO postgres;

--
-- TOC entry 236 (class 1259 OID 16706)
-- Name: Article_Id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public."Article" ALTER COLUMN "Id" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public."Article_Id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 229 (class 1259 OID 16641)
-- Name: Chat; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Chat" (
    "Id" integer NOT NULL,
    "UserId" integer NOT NULL,
    "Text" text,
    "Date" timestamp with time zone NOT NULL,
    "Flagged" bit(1) NOT NULL,
    "FlaggedComments" text
);


ALTER TABLE public."Chat" OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 16589)
-- Name: ChatCategory; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."ChatCategory" (
    "Id" integer NOT NULL,
    "Name" character varying(50) NOT NULL,
    "Description" character varying(300) NOT NULL
);


ALTER TABLE public."ChatCategory" OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 16595)
-- Name: ChatCategoryGroupMap; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."ChatCategoryGroupMap" (
    "Id" integer NOT NULL,
    "ChatCategoryId" integer NOT NULL,
    "ChatGroupId" integer NOT NULL
);


ALTER TABLE public."ChatCategoryGroupMap" OWNER TO postgres;

--
-- TOC entry 224 (class 1259 OID 16594)
-- Name: ChatCategoryGroupMap_Id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public."ChatCategoryGroupMap" ALTER COLUMN "Id" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public."ChatCategoryGroupMap_Id_seq"
    START WITH 0
    INCREMENT BY 1
    MINVALUE 0
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 222 (class 1259 OID 16584)
-- Name: ChatGroup; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."ChatGroup" (
    "Id" integer NOT NULL,
    "Name" character varying(50) NOT NULL,
    "Description" character varying(300) NOT NULL
);


ALTER TABLE public."ChatGroup" OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 16601)
-- Name: ChatGroupRoomMap; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."ChatGroupRoomMap" (
    "Id" integer NOT NULL,
    "ChatGroupId" integer NOT NULL,
    "ChatRoomId" integer NOT NULL
);


ALTER TABLE public."ChatGroupRoomMap" OWNER TO postgres;

--
-- TOC entry 226 (class 1259 OID 16600)
-- Name: ChatGroupRoomMap_Id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public."ChatGroupRoomMap" ALTER COLUMN "Id" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public."ChatGroupRoomMap_Id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 221 (class 1259 OID 16579)
-- Name: ChatRoom; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."ChatRoom" (
    "Id" integer NOT NULL,
    "Name" character varying(50) NOT NULL,
    "Description" character varying(300) NOT NULL
);


ALTER TABLE public."ChatRoom" OWNER TO postgres;

--
-- TOC entry 231 (class 1259 OID 16654)
-- Name: ChatRoomChatMap; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."ChatRoomChatMap" (
    "Id" integer NOT NULL,
    "ChatRoomId" integer NOT NULL,
    "ChatId" integer NOT NULL
);


ALTER TABLE public."ChatRoomChatMap" OWNER TO postgres;

--
-- TOC entry 230 (class 1259 OID 16653)
-- Name: ChatRoomChatMap_Id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public."ChatRoomChatMap" ALTER COLUMN "Id" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public."ChatRoomChatMap_Id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 235 (class 1259 OID 16686)
-- Name: ChatRoomSecurityRule; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."ChatRoomSecurityRule" (
    "Id" integer NOT NULL,
    "ChatRoomId" integer NOT NULL,
    "UserRoleId" integer,
    "PersonRoleId" integer
);


ALTER TABLE public."ChatRoomSecurityRule" OWNER TO postgres;

--
-- TOC entry 234 (class 1259 OID 16685)
-- Name: ChatRoomSecurityRule_Id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public."ChatRoomSecurityRule" ALTER COLUMN "Id" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public."ChatRoomSecurityRule_Id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 233 (class 1259 OID 16670)
-- Name: ChatRoomUserMap; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."ChatRoomUserMap" (
    "Id" integer NOT NULL,
    "ChatRoomId" integer NOT NULL,
    "UserId" integer NOT NULL
);


ALTER TABLE public."ChatRoomUserMap" OWNER TO postgres;

--
-- TOC entry 232 (class 1259 OID 16669)
-- Name: ChatRoomUserMap_Id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public."ChatRoomUserMap" ALTER COLUMN "Id" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public."ChatRoomUserMap_Id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 228 (class 1259 OID 16640)
-- Name: Chat_Id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public."Chat" ALTER COLUMN "Id" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public."Chat_Id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 220 (class 1259 OID 16572)
-- Name: File; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."File" (
    "Id" integer NOT NULL,
    "Name" character varying NOT NULL,
    "Path" character varying NOT NULL
);


ALTER TABLE public."File" OWNER TO postgres;

--
-- TOC entry 218 (class 1259 OID 16558)
-- Name: PersonRoleType; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."PersonRoleType" (
    "Id" integer NOT NULL,
    "Name" character varying NOT NULL
);


ALTER TABLE public."PersonRoleType" OWNER TO postgres;

--
-- TOC entry 242 (class 1259 OID 16752)
-- Name: TableChangedView; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public."TableChangedView" AS
 SELECT relid AS "Id",
    relname AS "TableName",
    last_seq_scan AS "Timestamp"
   FROM pg_stat_user_tables;


ALTER VIEW public."TableChangedView" OWNER TO postgres;

--
-- TOC entry 5049 (class 0 OID 0)
-- Dependencies: 242
-- Name: VIEW "TableChangedView"; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON VIEW public."TableChangedView" IS 'Tracks table changes using last_seq_scan from pg_catalog.pg_stat_user_tables';


--
-- TOC entry 219 (class 1259 OID 16565)
-- Name: User; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."User" (
    "Id" integer NOT NULL,
    "Name" character varying(50) NOT NULL,
    "Email" character varying(100) NOT NULL,
    "EmailVisible" bit(1) NOT NULL,
    "CreatedDate" timestamp with time zone NOT NULL,
    "PictureUrl" character varying(1080),
    "ShortDescription" character varying(150),
    "LongDescription" text,
    "PersonRoleId" integer NOT NULL,
    "UserRoleId" integer NOT NULL
);


ALTER TABLE public."User" OWNER TO postgres;

--
-- TOC entry 240 (class 1259 OID 16729)
-- Name: UserCredential; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."UserCredential" (
    "Id" integer NOT NULL,
    "UserId" integer NOT NULL,
    "Password" character varying(50) NOT NULL
);


ALTER TABLE public."UserCredential" OWNER TO postgres;

--
-- TOC entry 5050 (class 0 OID 0)
-- Dependencies: 240
-- Name: TABLE "UserCredential"; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public."UserCredential" IS 'This may be offloaded to auth server for PROD (TBD)';


--
-- TOC entry 239 (class 1259 OID 16728)
-- Name: UserCredential_Id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public."UserCredential" ALTER COLUMN "Id" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public."UserCredential_Id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 241 (class 1259 OID 16739)
-- Name: UserJWT; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."UserJWT" (
    "Id" integer NOT NULL,
    "Token" text NOT NULL,
    "UserId" integer NOT NULL,
    "LoginTime" timestamp with time zone NOT NULL,
    "ExpirationTime" timestamp with time zone NOT NULL
);


ALTER TABLE public."UserJWT" OWNER TO postgres;

--
-- TOC entry 5051 (class 0 OID 0)
-- Dependencies: 241
-- Name: TABLE "UserJWT"; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public."UserJWT" IS 'May be offloaded to auth server for PROD. (TBD)';


--
-- TOC entry 217 (class 1259 OID 16553)
-- Name: UserRoleType; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."UserRoleType" (
    "Id" integer NOT NULL,
    "Name" character varying(50) NOT NULL
);


ALTER TABLE public."UserRoleType" OWNER TO postgres;

--
-- TOC entry 5038 (class 0 OID 16707)
-- Dependencies: 237
-- Data for Name: Article; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Article" ("Id", "UserId", "Date", "Title", "Description", "Body", "BannerImageUrl", "BannerYoutubeSourceId", "BannerLinkTypeId") FROM stdin;
\.


--
-- TOC entry 5039 (class 0 OID 16714)
-- Dependencies: 238
-- Data for Name: ArticleBannerLinkType; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."ArticleBannerLinkType" ("Id", "Name") FROM stdin;
\.


--
-- TOC entry 5030 (class 0 OID 16641)
-- Dependencies: 229
-- Data for Name: Chat; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Chat" ("Id", "UserId", "Text", "Date", "Flagged", "FlaggedComments") FROM stdin;
\.


--
-- TOC entry 5024 (class 0 OID 16589)
-- Dependencies: 223
-- Data for Name: ChatCategory; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."ChatCategory" ("Id", "Name", "Description") FROM stdin;
\.


--
-- TOC entry 5026 (class 0 OID 16595)
-- Dependencies: 225
-- Data for Name: ChatCategoryGroupMap; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."ChatCategoryGroupMap" ("Id", "ChatCategoryId", "ChatGroupId") FROM stdin;
\.


--
-- TOC entry 5023 (class 0 OID 16584)
-- Dependencies: 222
-- Data for Name: ChatGroup; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."ChatGroup" ("Id", "Name", "Description") FROM stdin;
\.


--
-- TOC entry 5028 (class 0 OID 16601)
-- Dependencies: 227
-- Data for Name: ChatGroupRoomMap; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."ChatGroupRoomMap" ("Id", "ChatGroupId", "ChatRoomId") FROM stdin;
\.


--
-- TOC entry 5022 (class 0 OID 16579)
-- Dependencies: 221
-- Data for Name: ChatRoom; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."ChatRoom" ("Id", "Name", "Description") FROM stdin;
\.


--
-- TOC entry 5032 (class 0 OID 16654)
-- Dependencies: 231
-- Data for Name: ChatRoomChatMap; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."ChatRoomChatMap" ("Id", "ChatRoomId", "ChatId") FROM stdin;
\.


--
-- TOC entry 5036 (class 0 OID 16686)
-- Dependencies: 235
-- Data for Name: ChatRoomSecurityRule; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."ChatRoomSecurityRule" ("Id", "ChatRoomId", "UserRoleId", "PersonRoleId") FROM stdin;
\.


--
-- TOC entry 5034 (class 0 OID 16670)
-- Dependencies: 233
-- Data for Name: ChatRoomUserMap; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."ChatRoomUserMap" ("Id", "ChatRoomId", "UserId") FROM stdin;
\.


--
-- TOC entry 5021 (class 0 OID 16572)
-- Dependencies: 220
-- Data for Name: File; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."File" ("Id", "Name", "Path") FROM stdin;
\.


--
-- TOC entry 5019 (class 0 OID 16558)
-- Dependencies: 218
-- Data for Name: PersonRoleType; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."PersonRoleType" ("Id", "Name") FROM stdin;
0	General User
1	Board Member
\.


--
-- TOC entry 5020 (class 0 OID 16565)
-- Dependencies: 219
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."User" ("Id", "Name", "Email", "EmailVisible", "CreatedDate", "PictureUrl", "ShortDescription", "LongDescription", "PersonRoleId", "UserRoleId") FROM stdin;
\.


--
-- TOC entry 5041 (class 0 OID 16729)
-- Dependencies: 240
-- Data for Name: UserCredential; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."UserCredential" ("Id", "UserId", "Password") FROM stdin;
\.


--
-- TOC entry 5042 (class 0 OID 16739)
-- Dependencies: 241
-- Data for Name: UserJWT; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."UserJWT" ("Id", "Token", "UserId", "LoginTime", "ExpirationTime") FROM stdin;
\.


--
-- TOC entry 5018 (class 0 OID 16553)
-- Dependencies: 217
-- Data for Name: UserRoleType; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."UserRoleType" ("Id", "Name") FROM stdin;
0	General
1	Editor
2	Admin
\.


--
-- TOC entry 5052 (class 0 OID 0)
-- Dependencies: 236
-- Name: Article_Id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Article_Id_seq"', 1, false);


--
-- TOC entry 5053 (class 0 OID 0)
-- Dependencies: 224
-- Name: ChatCategoryGroupMap_Id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."ChatCategoryGroupMap_Id_seq"', 0, false);


--
-- TOC entry 5054 (class 0 OID 0)
-- Dependencies: 226
-- Name: ChatGroupRoomMap_Id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."ChatGroupRoomMap_Id_seq"', 1, false);


--
-- TOC entry 5055 (class 0 OID 0)
-- Dependencies: 230
-- Name: ChatRoomChatMap_Id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."ChatRoomChatMap_Id_seq"', 1, false);


--
-- TOC entry 5056 (class 0 OID 0)
-- Dependencies: 234
-- Name: ChatRoomSecurityRule_Id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."ChatRoomSecurityRule_Id_seq"', 1, false);


--
-- TOC entry 5057 (class 0 OID 0)
-- Dependencies: 232
-- Name: ChatRoomUserMap_Id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."ChatRoomUserMap_Id_seq"', 1, false);


--
-- TOC entry 5058 (class 0 OID 0)
-- Dependencies: 228
-- Name: Chat_Id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Chat_Id_seq"', 1, false);


--
-- TOC entry 5059 (class 0 OID 0)
-- Dependencies: 239
-- Name: UserCredential_Id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."UserCredential_Id_seq"', 1, false);


--
-- TOC entry 4850 (class 2606 OID 16718)
-- Name: ArticleBannerLinkType ArticleBannerLinkType_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ArticleBannerLinkType"
    ADD CONSTRAINT "ArticleBannerLinkType_pkey" PRIMARY KEY ("Id");


--
-- TOC entry 4848 (class 2606 OID 16713)
-- Name: Article Article_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Article"
    ADD CONSTRAINT "Article_pkey" PRIMARY KEY ("Id");


--
-- TOC entry 4832 (class 2606 OID 16599)
-- Name: ChatCategoryGroupMap ChatCategoryGroupMap_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ChatCategoryGroupMap"
    ADD CONSTRAINT "ChatCategoryGroupMap_pkey" PRIMARY KEY ("Id");


--
-- TOC entry 4830 (class 2606 OID 16593)
-- Name: ChatCategory ChatCategory_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ChatCategory"
    ADD CONSTRAINT "ChatCategory_pkey" PRIMARY KEY ("Id");


--
-- TOC entry 4836 (class 2606 OID 16605)
-- Name: ChatGroupRoomMap ChatGroupRoomMap_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ChatGroupRoomMap"
    ADD CONSTRAINT "ChatGroupRoomMap_pkey" PRIMARY KEY ("Id");


--
-- TOC entry 4828 (class 2606 OID 16588)
-- Name: ChatGroup ChatGroup_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ChatGroup"
    ADD CONSTRAINT "ChatGroup_pkey" PRIMARY KEY ("Id");


--
-- TOC entry 4842 (class 2606 OID 16658)
-- Name: ChatRoomChatMap ChatRoomChatMap_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ChatRoomChatMap"
    ADD CONSTRAINT "ChatRoomChatMap_pkey" PRIMARY KEY ("Id");


--
-- TOC entry 4846 (class 2606 OID 16690)
-- Name: ChatRoomSecurityRule ChatRoomSecurityRule_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ChatRoomSecurityRule"
    ADD CONSTRAINT "ChatRoomSecurityRule_pkey" PRIMARY KEY ("Id");


--
-- TOC entry 4844 (class 2606 OID 16674)
-- Name: ChatRoomUserMap ChatRoomUserMap_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ChatRoomUserMap"
    ADD CONSTRAINT "ChatRoomUserMap_pkey" PRIMARY KEY ("Id");


--
-- TOC entry 4826 (class 2606 OID 16583)
-- Name: ChatRoom ChatRoom_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ChatRoom"
    ADD CONSTRAINT "ChatRoom_pkey" PRIMARY KEY ("Id");


--
-- TOC entry 4840 (class 2606 OID 16647)
-- Name: Chat Chat_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Chat"
    ADD CONSTRAINT "Chat_pkey" PRIMARY KEY ("Id");


--
-- TOC entry 4824 (class 2606 OID 16578)
-- Name: File File_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."File"
    ADD CONSTRAINT "File_pkey" PRIMARY KEY ("Id");


--
-- TOC entry 4820 (class 2606 OID 16564)
-- Name: PersonRoleType PersonRoleType_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PersonRoleType"
    ADD CONSTRAINT "PersonRoleType_pkey" PRIMARY KEY ("Id");


--
-- TOC entry 4852 (class 2606 OID 16733)
-- Name: UserCredential UserCredential_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."UserCredential"
    ADD CONSTRAINT "UserCredential_pkey" PRIMARY KEY ("Id");


--
-- TOC entry 4854 (class 2606 OID 16745)
-- Name: UserJWT UserJWT_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."UserJWT"
    ADD CONSTRAINT "UserJWT_pkey" PRIMARY KEY ("Id");


--
-- TOC entry 4818 (class 2606 OID 16557)
-- Name: UserRoleType UserRoleType_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."UserRoleType"
    ADD CONSTRAINT "UserRoleType_pkey" PRIMARY KEY ("Id");


--
-- TOC entry 4822 (class 2606 OID 16571)
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY ("Id");


--
-- TOC entry 4833 (class 1259 OID 16611)
-- Name: fki_ChatCategoryGroupMap_fkey_ChatCategory; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "fki_ChatCategoryGroupMap_fkey_ChatCategory" ON public."ChatCategoryGroupMap" USING btree ("ChatCategoryId");


--
-- TOC entry 4834 (class 1259 OID 16617)
-- Name: fki_ChatCategoryGroupMap_fkey_ChatGroup; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "fki_ChatCategoryGroupMap_fkey_ChatGroup" ON public."ChatCategoryGroupMap" USING btree ("ChatGroupId");


--
-- TOC entry 4837 (class 1259 OID 16623)
-- Name: fki_ChatGroupRoomMap_fkey_ChatGroup; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "fki_ChatGroupRoomMap_fkey_ChatGroup" ON public."ChatGroupRoomMap" USING btree ("ChatGroupId");


--
-- TOC entry 4838 (class 1259 OID 16629)
-- Name: fki_ChatGroupRoomMap_fkey_ChatRoom; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "fki_ChatGroupRoomMap_fkey_ChatRoom" ON public."ChatGroupRoomMap" USING btree ("Id");


--
-- TOC entry 4869 (class 2606 OID 16719)
-- Name: Article Article_BannerLinkType_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Article"
    ADD CONSTRAINT "Article_BannerLinkType_fkey" FOREIGN KEY ("BannerLinkTypeId") REFERENCES public."ArticleBannerLinkType"("Id");


--
-- TOC entry 4857 (class 2606 OID 16606)
-- Name: ChatCategoryGroupMap ChatCategoryGroupMap_fkey_ChatCategory; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ChatCategoryGroupMap"
    ADD CONSTRAINT "ChatCategoryGroupMap_fkey_ChatCategory" FOREIGN KEY ("ChatCategoryId") REFERENCES public."ChatCategory"("Id");


--
-- TOC entry 4858 (class 2606 OID 16612)
-- Name: ChatCategoryGroupMap ChatCategoryGroupMap_fkey_ChatGroup; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ChatCategoryGroupMap"
    ADD CONSTRAINT "ChatCategoryGroupMap_fkey_ChatGroup" FOREIGN KEY ("ChatGroupId") REFERENCES public."ChatGroup"("Id");


--
-- TOC entry 4859 (class 2606 OID 16618)
-- Name: ChatGroupRoomMap ChatGroupRoomMap_fkey_ChatGroup; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ChatGroupRoomMap"
    ADD CONSTRAINT "ChatGroupRoomMap_fkey_ChatGroup" FOREIGN KEY ("ChatGroupId") REFERENCES public."ChatGroup"("Id");


--
-- TOC entry 4860 (class 2606 OID 16624)
-- Name: ChatGroupRoomMap ChatGroupRoomMap_fkey_ChatRoom; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ChatGroupRoomMap"
    ADD CONSTRAINT "ChatGroupRoomMap_fkey_ChatRoom" FOREIGN KEY ("Id") REFERENCES public."ChatRoom"("Id");


--
-- TOC entry 4866 (class 2606 OID 16696)
-- Name: ChatRoomSecurityRule ChatRoomSecurityRule_ChatRoom_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ChatRoomSecurityRule"
    ADD CONSTRAINT "ChatRoomSecurityRule_ChatRoom_fkey" FOREIGN KEY ("ChatRoomId") REFERENCES public."ChatRoom"("Id");


--
-- TOC entry 4867 (class 2606 OID 16701)
-- Name: ChatRoomSecurityRule ChatRoomSecurityRule_PersonRole_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ChatRoomSecurityRule"
    ADD CONSTRAINT "ChatRoomSecurityRule_PersonRole_fkey" FOREIGN KEY ("PersonRoleId") REFERENCES public."PersonRoleType"("Id");


--
-- TOC entry 4868 (class 2606 OID 16691)
-- Name: ChatRoomSecurityRule ChatRoomSecurityRule_UserRole_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ChatRoomSecurityRule"
    ADD CONSTRAINT "ChatRoomSecurityRule_UserRole_fkey" FOREIGN KEY ("UserRoleId") REFERENCES public."UserRoleType"("Id");


--
-- TOC entry 4864 (class 2606 OID 16675)
-- Name: ChatRoomUserMap ChatRoomUserMap_ChatRoom_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ChatRoomUserMap"
    ADD CONSTRAINT "ChatRoomUserMap_ChatRoom_fkey" FOREIGN KEY ("ChatRoomId") REFERENCES public."ChatRoom"("Id");


--
-- TOC entry 4865 (class 2606 OID 16680)
-- Name: ChatRoomUserMap ChatRoomUserMap_User_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ChatRoomUserMap"
    ADD CONSTRAINT "ChatRoomUserMap_User_fkey" FOREIGN KEY ("UserId") REFERENCES public."User"("Id");


--
-- TOC entry 4862 (class 2606 OID 16659)
-- Name: ChatRoomChatMap ChatRoom_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ChatRoomChatMap"
    ADD CONSTRAINT "ChatRoom_fkey" FOREIGN KEY ("ChatRoomId") REFERENCES public."ChatRoom"("Id");


--
-- TOC entry 4861 (class 2606 OID 16648)
-- Name: Chat Chat_User_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Chat"
    ADD CONSTRAINT "Chat_User_fkey" FOREIGN KEY ("UserId") REFERENCES public."User"("Id");


--
-- TOC entry 4863 (class 2606 OID 16664)
-- Name: ChatRoomChatMap Chat_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ChatRoomChatMap"
    ADD CONSTRAINT "Chat_fkey" FOREIGN KEY ("ChatId") REFERENCES public."Chat"("Id");


--
-- TOC entry 4855 (class 2606 OID 16630)
-- Name: User PersonRoleId_PersonRoleType; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "PersonRoleId_PersonRoleType" FOREIGN KEY ("PersonRoleId") REFERENCES public."PersonRoleType"("Id");


--
-- TOC entry 4870 (class 2606 OID 16734)
-- Name: UserCredential UserCredential_User_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."UserCredential"
    ADD CONSTRAINT "UserCredential_User_fkey" FOREIGN KEY ("UserId") REFERENCES public."User"("Id");


--
-- TOC entry 4871 (class 2606 OID 16746)
-- Name: UserJWT UserJWT_User_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."UserJWT"
    ADD CONSTRAINT "UserJWT_User_fkey" FOREIGN KEY ("UserId") REFERENCES public."User"("Id");


--
-- TOC entry 4856 (class 2606 OID 16635)
-- Name: User UserRoleId_UserRoleType; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "UserRoleId_UserRoleType" FOREIGN KEY ("UserRoleId") REFERENCES public."UserRoleType"("Id");


-- Completed on 2025-04-26 17:52:12

--
-- PostgreSQL database dump complete
--

