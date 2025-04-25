--
-- PostgreSQL database dump
--

-- Dumped from database version 17.4
-- Dumped by pg_dump version 17.4

-- Started on 2025-04-25 16:41:30

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
-- TOC entry 5003 (class 0 OID 0)
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
-- TOC entry 217 (class 1259 OID 16553)
-- Name: UserRoleType; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."UserRoleType" (
    "Id" integer NOT NULL,
    "Name" character varying(50) NOT NULL
);


ALTER TABLE public."UserRoleType" OWNER TO postgres;

--
-- TOC entry 4837 (class 2606 OID 16718)
-- Name: ArticleBannerLinkType ArticleBannerLinkType_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ArticleBannerLinkType"
    ADD CONSTRAINT "ArticleBannerLinkType_pkey" PRIMARY KEY ("Id");


--
-- TOC entry 4835 (class 2606 OID 16713)
-- Name: Article Article_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Article"
    ADD CONSTRAINT "Article_pkey" PRIMARY KEY ("Id");


--
-- TOC entry 4819 (class 2606 OID 16599)
-- Name: ChatCategoryGroupMap ChatCategoryGroupMap_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ChatCategoryGroupMap"
    ADD CONSTRAINT "ChatCategoryGroupMap_pkey" PRIMARY KEY ("Id");


--
-- TOC entry 4817 (class 2606 OID 16593)
-- Name: ChatCategory ChatCategory_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ChatCategory"
    ADD CONSTRAINT "ChatCategory_pkey" PRIMARY KEY ("Id");


--
-- TOC entry 4823 (class 2606 OID 16605)
-- Name: ChatGroupRoomMap ChatGroupRoomMap_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ChatGroupRoomMap"
    ADD CONSTRAINT "ChatGroupRoomMap_pkey" PRIMARY KEY ("Id");


--
-- TOC entry 4815 (class 2606 OID 16588)
-- Name: ChatGroup ChatGroup_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ChatGroup"
    ADD CONSTRAINT "ChatGroup_pkey" PRIMARY KEY ("Id");


--
-- TOC entry 4829 (class 2606 OID 16658)
-- Name: ChatRoomChatMap ChatRoomChatMap_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ChatRoomChatMap"
    ADD CONSTRAINT "ChatRoomChatMap_pkey" PRIMARY KEY ("Id");


--
-- TOC entry 4833 (class 2606 OID 16690)
-- Name: ChatRoomSecurityRule ChatRoomSecurityRule_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ChatRoomSecurityRule"
    ADD CONSTRAINT "ChatRoomSecurityRule_pkey" PRIMARY KEY ("Id");


--
-- TOC entry 4831 (class 2606 OID 16674)
-- Name: ChatRoomUserMap ChatRoomUserMap_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ChatRoomUserMap"
    ADD CONSTRAINT "ChatRoomUserMap_pkey" PRIMARY KEY ("Id");


--
-- TOC entry 4813 (class 2606 OID 16583)
-- Name: ChatRoom ChatRoom_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ChatRoom"
    ADD CONSTRAINT "ChatRoom_pkey" PRIMARY KEY ("Id");


--
-- TOC entry 4827 (class 2606 OID 16647)
-- Name: Chat Chat_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Chat"
    ADD CONSTRAINT "Chat_pkey" PRIMARY KEY ("Id");


--
-- TOC entry 4811 (class 2606 OID 16578)
-- Name: File File_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."File"
    ADD CONSTRAINT "File_pkey" PRIMARY KEY ("Id");


--
-- TOC entry 4807 (class 2606 OID 16564)
-- Name: PersonRoleType PersonRoleType_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PersonRoleType"
    ADD CONSTRAINT "PersonRoleType_pkey" PRIMARY KEY ("Id");


--
-- TOC entry 4805 (class 2606 OID 16557)
-- Name: UserRoleType UserRoleType_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."UserRoleType"
    ADD CONSTRAINT "UserRoleType_pkey" PRIMARY KEY ("Id");


--
-- TOC entry 4809 (class 2606 OID 16571)
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY ("Id");


--
-- TOC entry 4820 (class 1259 OID 16611)
-- Name: fki_ChatCategoryGroupMap_fkey_ChatCategory; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "fki_ChatCategoryGroupMap_fkey_ChatCategory" ON public."ChatCategoryGroupMap" USING btree ("ChatCategoryId");


--
-- TOC entry 4821 (class 1259 OID 16617)
-- Name: fki_ChatCategoryGroupMap_fkey_ChatGroup; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "fki_ChatCategoryGroupMap_fkey_ChatGroup" ON public."ChatCategoryGroupMap" USING btree ("ChatGroupId");


--
-- TOC entry 4824 (class 1259 OID 16623)
-- Name: fki_ChatGroupRoomMap_fkey_ChatGroup; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "fki_ChatGroupRoomMap_fkey_ChatGroup" ON public."ChatGroupRoomMap" USING btree ("ChatGroupId");


--
-- TOC entry 4825 (class 1259 OID 16629)
-- Name: fki_ChatGroupRoomMap_fkey_ChatRoom; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "fki_ChatGroupRoomMap_fkey_ChatRoom" ON public."ChatGroupRoomMap" USING btree ("Id");


--
-- TOC entry 4852 (class 2606 OID 16719)
-- Name: Article Article_BannerLinkType_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Article"
    ADD CONSTRAINT "Article_BannerLinkType_fkey" FOREIGN KEY ("BannerLinkTypeId") REFERENCES public."ArticleBannerLinkType"("Id");


--
-- TOC entry 4840 (class 2606 OID 16606)
-- Name: ChatCategoryGroupMap ChatCategoryGroupMap_fkey_ChatCategory; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ChatCategoryGroupMap"
    ADD CONSTRAINT "ChatCategoryGroupMap_fkey_ChatCategory" FOREIGN KEY ("ChatCategoryId") REFERENCES public."ChatCategory"("Id");


--
-- TOC entry 4841 (class 2606 OID 16612)
-- Name: ChatCategoryGroupMap ChatCategoryGroupMap_fkey_ChatGroup; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ChatCategoryGroupMap"
    ADD CONSTRAINT "ChatCategoryGroupMap_fkey_ChatGroup" FOREIGN KEY ("ChatGroupId") REFERENCES public."ChatGroup"("Id");


--
-- TOC entry 4842 (class 2606 OID 16618)
-- Name: ChatGroupRoomMap ChatGroupRoomMap_fkey_ChatGroup; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ChatGroupRoomMap"
    ADD CONSTRAINT "ChatGroupRoomMap_fkey_ChatGroup" FOREIGN KEY ("ChatGroupId") REFERENCES public."ChatGroup"("Id");


--
-- TOC entry 4843 (class 2606 OID 16624)
-- Name: ChatGroupRoomMap ChatGroupRoomMap_fkey_ChatRoom; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ChatGroupRoomMap"
    ADD CONSTRAINT "ChatGroupRoomMap_fkey_ChatRoom" FOREIGN KEY ("Id") REFERENCES public."ChatRoom"("Id");


--
-- TOC entry 4849 (class 2606 OID 16696)
-- Name: ChatRoomSecurityRule ChatRoomSecurityRule_ChatRoom_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ChatRoomSecurityRule"
    ADD CONSTRAINT "ChatRoomSecurityRule_ChatRoom_fkey" FOREIGN KEY ("ChatRoomId") REFERENCES public."ChatRoom"("Id");


--
-- TOC entry 4850 (class 2606 OID 16701)
-- Name: ChatRoomSecurityRule ChatRoomSecurityRule_PersonRole_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ChatRoomSecurityRule"
    ADD CONSTRAINT "ChatRoomSecurityRule_PersonRole_fkey" FOREIGN KEY ("PersonRoleId") REFERENCES public."PersonRoleType"("Id");


--
-- TOC entry 4851 (class 2606 OID 16691)
-- Name: ChatRoomSecurityRule ChatRoomSecurityRule_UserRole_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ChatRoomSecurityRule"
    ADD CONSTRAINT "ChatRoomSecurityRule_UserRole_fkey" FOREIGN KEY ("UserRoleId") REFERENCES public."UserRoleType"("Id");


--
-- TOC entry 4847 (class 2606 OID 16675)
-- Name: ChatRoomUserMap ChatRoomUserMap_ChatRoom_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ChatRoomUserMap"
    ADD CONSTRAINT "ChatRoomUserMap_ChatRoom_fkey" FOREIGN KEY ("ChatRoomId") REFERENCES public."ChatRoom"("Id");


--
-- TOC entry 4848 (class 2606 OID 16680)
-- Name: ChatRoomUserMap ChatRoomUserMap_User_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ChatRoomUserMap"
    ADD CONSTRAINT "ChatRoomUserMap_User_fkey" FOREIGN KEY ("UserId") REFERENCES public."User"("Id");


--
-- TOC entry 4845 (class 2606 OID 16659)
-- Name: ChatRoomChatMap ChatRoom_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ChatRoomChatMap"
    ADD CONSTRAINT "ChatRoom_fkey" FOREIGN KEY ("ChatRoomId") REFERENCES public."ChatRoom"("Id");


--
-- TOC entry 4844 (class 2606 OID 16648)
-- Name: Chat Chat_User_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Chat"
    ADD CONSTRAINT "Chat_User_fkey" FOREIGN KEY ("UserId") REFERENCES public."User"("Id");


--
-- TOC entry 4846 (class 2606 OID 16664)
-- Name: ChatRoomChatMap Chat_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ChatRoomChatMap"
    ADD CONSTRAINT "Chat_fkey" FOREIGN KEY ("ChatId") REFERENCES public."Chat"("Id");


--
-- TOC entry 4838 (class 2606 OID 16630)
-- Name: User PersonRoleId_PersonRoleType; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "PersonRoleId_PersonRoleType" FOREIGN KEY ("PersonRoleId") REFERENCES public."PersonRoleType"("Id");


--
-- TOC entry 4839 (class 2606 OID 16635)
-- Name: User UserRoleId_UserRoleType; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "UserRoleId_UserRoleType" FOREIGN KEY ("UserRoleId") REFERENCES public."UserRoleType"("Id");


-- Completed on 2025-04-25 16:41:30

--
-- PostgreSQL database dump complete
--

