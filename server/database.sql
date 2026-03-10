-- Table: public.users

-- DROP TABLE IF EXISTS public.users;

CREATE TABLE IF NOT EXISTS public.users
(
    id integer NOT NULL DEFAULT nextval('users_id_seq'::regclass),
    uuid uuid NOT NULL DEFAULT gen_random_uuid(),
    name character varying(100) COLLATE pg_catalog."default",
    email character varying(100) COLLATE pg_catalog."default",
    CONSTRAINT users_pkey PRIMARY KEY (uuid),
    CONSTRAINT users_email_key UNIQUE (email)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.users
    OWNER to postgres;









-- Table: public.queries

-- DROP TABLE IF EXISTS public.queries;

CREATE TABLE IF NOT EXISTS public.queries
(
    query_id integer NOT NULL DEFAULT nextval('queries_query_id_seq'::regclass),
    user_id uuid,
    query_text text COLLATE pg_catalog."default",
    query_solved boolean DEFAULT false,
    CONSTRAINT queries_pkey PRIMARY KEY (query_id),
    CONSTRAINT queries_user_id_fkey FOREIGN KEY (user_id)
        REFERENCES public.users (uuid) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.queries
    OWNER to postgres;



