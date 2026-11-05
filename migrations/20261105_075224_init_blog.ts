import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  // Payload 는 DB 를 새로 만들 때만 스키마를 만든다. 기존 Neon DB(KPSC public 스키마)에 blog 스키마를 처음 추가하는 것이라 직접 만든다.
  await db.execute(sql`CREATE SCHEMA IF NOT EXISTS "blog";`)
  await db.execute(sql`
   CREATE TYPE "blog"."enum_posts_status" AS ENUM('draft', 'published');
  CREATE TYPE "blog"."enum__posts_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "blog"."enum_page_views_device" AS ENUM('mobile', 'tablet', 'desktop');
  CREATE TYPE "blog"."enum_page_views_event" AS ENUM('view', 'click');
  CREATE TYPE "blog"."enum_home_status" AS ENUM('draft', 'published');
  CREATE TYPE "blog"."enum__home_v_version_status" AS ENUM('draft', 'published');
  CREATE TABLE "blog"."posts_key_points" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "blog"."posts_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer
  );
  
  CREATE TABLE "blog"."posts_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" varchar
  );
  
  CREATE TABLE "blog"."posts_sources" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"href" varchar,
  	"description" varchar
  );
  
  CREATE TABLE "blog"."posts_tags" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"tag" varchar
  );
  
  CREATE TABLE "blog"."posts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"category_id" integer,
  	"author_id" integer,
  	"thumbnail_id" integer,
  	"published_at" timestamp(3) with time zone,
  	"slug" varchar,
  	"views" numeric DEFAULT 0,
  	"summary" varchar,
  	"content" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "blog"."enum_posts_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "blog"."posts_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"posts_id" integer
  );
  
  CREATE TABLE "blog"."_posts_v_version_key_points" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "blog"."_posts_v_version_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "blog"."_posts_v_version_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "blog"."_posts_v_version_sources" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"href" varchar,
  	"description" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "blog"."_posts_v_version_tags" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"tag" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "blog"."_posts_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_category_id" integer,
  	"version_author_id" integer,
  	"version_thumbnail_id" integer,
  	"version_published_at" timestamp(3) with time zone,
  	"version_slug" varchar,
  	"version_views" numeric DEFAULT 0,
  	"version_summary" varchar,
  	"version_content" jsonb,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "blog"."enum__posts_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "blog"."_posts_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"posts_id" integer
  );
  
  CREATE TABLE "blog"."categories" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"description" varchar,
  	"order" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "blog"."doctors_specialties" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "blog"."doctors_career" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "blog"."doctors" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"slug" varchar,
  	"title" varchar DEFAULT '원장' NOT NULL,
  	"photo_id" integer,
  	"bio" varchar,
  	"order" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "blog"."media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar NOT NULL,
  	"caption" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric,
  	"sizes_thumbnail_url" varchar,
  	"sizes_thumbnail_width" numeric,
  	"sizes_thumbnail_height" numeric,
  	"sizes_thumbnail_mime_type" varchar,
  	"sizes_thumbnail_filesize" numeric,
  	"sizes_thumbnail_filename" varchar,
  	"sizes_card_url" varchar,
  	"sizes_card_width" numeric,
  	"sizes_card_height" numeric,
  	"sizes_card_mime_type" varchar,
  	"sizes_card_filesize" numeric,
  	"sizes_card_filename" varchar,
  	"sizes_content_url" varchar,
  	"sizes_content_width" numeric,
  	"sizes_content_height" numeric,
  	"sizes_content_mime_type" varchar,
  	"sizes_content_filesize" numeric,
  	"sizes_content_filename" varchar,
  	"sizes_og_url" varchar,
  	"sizes_og_width" numeric,
  	"sizes_og_height" numeric,
  	"sizes_og_mime_type" varchar,
  	"sizes_og_filesize" numeric,
  	"sizes_og_filename" varchar
  );
  
  CREATE TABLE "blog"."users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "blog"."users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"reset_password_requested_at" timestamp(3) with time zone,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "blog"."page_views" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"session_id" varchar NOT NULL,
  	"path" varchar NOT NULL,
  	"referrer" varchar,
  	"source" varchar,
  	"medium" varchar,
  	"keyword" varchar,
  	"query" varchar,
  	"device" "blog"."enum_page_views_device",
  	"event" "blog"."enum_page_views_event" DEFAULT 'view',
  	"label" varchar,
  	"duration_ms" numeric,
  	"max_scroll" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "blog"."payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "blog"."payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "blog"."payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"posts_id" integer,
  	"categories_id" integer,
  	"doctors_id" integer,
  	"media_id" integer,
  	"users_id" integer,
  	"page_views_id" integer
  );
  
  CREATE TABLE "blog"."payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "blog"."payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "blog"."payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "blog"."home_popular_keywords" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar
  );
  
  CREATE TABLE "blog"."home_banners" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"mobile_image_id" integer,
  	"label" varchar,
  	"text" varchar
  );
  
  CREATE TABLE "blog"."home_key_points" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"value" varchar
  );
  
  CREATE TABLE "blog"."home_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" varchar
  );
  
  CREATE TABLE "blog"."home" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_title" varchar,
  	"hero_text" varchar,
  	"search_placeholder" varchar,
  	"doctors_show" boolean,
  	"doctors_title" varchar,
  	"doctors_text" varchar,
  	"doctors_button" varchar,
  	"doctors_link" varchar,
  	"summary_title" varchar,
  	"summary_text" varchar,
  	"_status" "blog"."enum_home_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "blog"."_home_v_version_popular_keywords" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "blog"."_home_v_version_banners" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"mobile_image_id" integer,
  	"label" varchar,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "blog"."_home_v_version_key_points" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"value" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "blog"."_home_v_version_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "blog"."_home_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_hero_title" varchar,
  	"version_hero_text" varchar,
  	"version_search_placeholder" varchar,
  	"version_doctors_show" boolean,
  	"version_doctors_title" varchar,
  	"version_doctors_text" varchar,
  	"version_doctors_button" varchar,
  	"version_doctors_link" varchar,
  	"version_summary_title" varchar,
  	"version_summary_text" varchar,
  	"version__status" "blog"."enum__home_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  ALTER TABLE "blog"."posts_key_points" ADD CONSTRAINT "posts_key_points_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "blog"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "blog"."posts_images" ADD CONSTRAINT "posts_images_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "blog"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "blog"."posts_images" ADD CONSTRAINT "posts_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "blog"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "blog"."posts_faq" ADD CONSTRAINT "posts_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "blog"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "blog"."posts_sources" ADD CONSTRAINT "posts_sources_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "blog"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "blog"."posts_tags" ADD CONSTRAINT "posts_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "blog"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "blog"."posts" ADD CONSTRAINT "posts_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "blog"."categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "blog"."posts" ADD CONSTRAINT "posts_author_id_doctors_id_fk" FOREIGN KEY ("author_id") REFERENCES "blog"."doctors"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "blog"."posts" ADD CONSTRAINT "posts_thumbnail_id_media_id_fk" FOREIGN KEY ("thumbnail_id") REFERENCES "blog"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "blog"."posts_rels" ADD CONSTRAINT "posts_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "blog"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "blog"."posts_rels" ADD CONSTRAINT "posts_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "blog"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "blog"."_posts_v_version_key_points" ADD CONSTRAINT "_posts_v_version_key_points_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "blog"."_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "blog"."_posts_v_version_images" ADD CONSTRAINT "_posts_v_version_images_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "blog"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "blog"."_posts_v_version_images" ADD CONSTRAINT "_posts_v_version_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "blog"."_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "blog"."_posts_v_version_faq" ADD CONSTRAINT "_posts_v_version_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "blog"."_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "blog"."_posts_v_version_sources" ADD CONSTRAINT "_posts_v_version_sources_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "blog"."_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "blog"."_posts_v_version_tags" ADD CONSTRAINT "_posts_v_version_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "blog"."_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "blog"."_posts_v" ADD CONSTRAINT "_posts_v_parent_id_posts_id_fk" FOREIGN KEY ("parent_id") REFERENCES "blog"."posts"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "blog"."_posts_v" ADD CONSTRAINT "_posts_v_version_category_id_categories_id_fk" FOREIGN KEY ("version_category_id") REFERENCES "blog"."categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "blog"."_posts_v" ADD CONSTRAINT "_posts_v_version_author_id_doctors_id_fk" FOREIGN KEY ("version_author_id") REFERENCES "blog"."doctors"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "blog"."_posts_v" ADD CONSTRAINT "_posts_v_version_thumbnail_id_media_id_fk" FOREIGN KEY ("version_thumbnail_id") REFERENCES "blog"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "blog"."_posts_v_rels" ADD CONSTRAINT "_posts_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "blog"."_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "blog"."_posts_v_rels" ADD CONSTRAINT "_posts_v_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "blog"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "blog"."doctors_specialties" ADD CONSTRAINT "doctors_specialties_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "blog"."doctors"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "blog"."doctors_career" ADD CONSTRAINT "doctors_career_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "blog"."doctors"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "blog"."doctors" ADD CONSTRAINT "doctors_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "blog"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "blog"."users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "blog"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "blog"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "blog"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "blog"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "blog"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "blog"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "blog"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "blog"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_doctors_fk" FOREIGN KEY ("doctors_id") REFERENCES "blog"."doctors"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "blog"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "blog"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "blog"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "blog"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "blog"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_page_views_fk" FOREIGN KEY ("page_views_id") REFERENCES "blog"."page_views"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "blog"."payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "blog"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "blog"."payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "blog"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "blog"."home_popular_keywords" ADD CONSTRAINT "home_popular_keywords_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "blog"."home"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "blog"."home_banners" ADD CONSTRAINT "home_banners_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "blog"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "blog"."home_banners" ADD CONSTRAINT "home_banners_mobile_image_id_media_id_fk" FOREIGN KEY ("mobile_image_id") REFERENCES "blog"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "blog"."home_banners" ADD CONSTRAINT "home_banners_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "blog"."home"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "blog"."home_key_points" ADD CONSTRAINT "home_key_points_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "blog"."home"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "blog"."home_faq" ADD CONSTRAINT "home_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "blog"."home"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "blog"."_home_v_version_popular_keywords" ADD CONSTRAINT "_home_v_version_popular_keywords_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "blog"."_home_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "blog"."_home_v_version_banners" ADD CONSTRAINT "_home_v_version_banners_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "blog"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "blog"."_home_v_version_banners" ADD CONSTRAINT "_home_v_version_banners_mobile_image_id_media_id_fk" FOREIGN KEY ("mobile_image_id") REFERENCES "blog"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "blog"."_home_v_version_banners" ADD CONSTRAINT "_home_v_version_banners_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "blog"."_home_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "blog"."_home_v_version_key_points" ADD CONSTRAINT "_home_v_version_key_points_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "blog"."_home_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "blog"."_home_v_version_faq" ADD CONSTRAINT "_home_v_version_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "blog"."_home_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "posts_key_points_order_idx" ON "blog"."posts_key_points" USING btree ("_order");
  CREATE INDEX "posts_key_points_parent_id_idx" ON "blog"."posts_key_points" USING btree ("_parent_id");
  CREATE INDEX "posts_images_order_idx" ON "blog"."posts_images" USING btree ("_order");
  CREATE INDEX "posts_images_parent_id_idx" ON "blog"."posts_images" USING btree ("_parent_id");
  CREATE INDEX "posts_images_image_idx" ON "blog"."posts_images" USING btree ("image_id");
  CREATE INDEX "posts_faq_order_idx" ON "blog"."posts_faq" USING btree ("_order");
  CREATE INDEX "posts_faq_parent_id_idx" ON "blog"."posts_faq" USING btree ("_parent_id");
  CREATE INDEX "posts_sources_order_idx" ON "blog"."posts_sources" USING btree ("_order");
  CREATE INDEX "posts_sources_parent_id_idx" ON "blog"."posts_sources" USING btree ("_parent_id");
  CREATE INDEX "posts_tags_order_idx" ON "blog"."posts_tags" USING btree ("_order");
  CREATE INDEX "posts_tags_parent_id_idx" ON "blog"."posts_tags" USING btree ("_parent_id");
  CREATE INDEX "posts_category_idx" ON "blog"."posts" USING btree ("category_id");
  CREATE INDEX "posts_author_idx" ON "blog"."posts" USING btree ("author_id");
  CREATE INDEX "posts_thumbnail_idx" ON "blog"."posts" USING btree ("thumbnail_id");
  CREATE UNIQUE INDEX "posts_slug_idx" ON "blog"."posts" USING btree ("slug");
  CREATE INDEX "posts_updated_at_idx" ON "blog"."posts" USING btree ("updated_at");
  CREATE INDEX "posts_created_at_idx" ON "blog"."posts" USING btree ("created_at");
  CREATE INDEX "posts__status_idx" ON "blog"."posts" USING btree ("_status");
  CREATE INDEX "posts_rels_order_idx" ON "blog"."posts_rels" USING btree ("order");
  CREATE INDEX "posts_rels_parent_idx" ON "blog"."posts_rels" USING btree ("parent_id");
  CREATE INDEX "posts_rels_path_idx" ON "blog"."posts_rels" USING btree ("path");
  CREATE INDEX "posts_rels_posts_id_idx" ON "blog"."posts_rels" USING btree ("posts_id");
  CREATE INDEX "_posts_v_version_key_points_order_idx" ON "blog"."_posts_v_version_key_points" USING btree ("_order");
  CREATE INDEX "_posts_v_version_key_points_parent_id_idx" ON "blog"."_posts_v_version_key_points" USING btree ("_parent_id");
  CREATE INDEX "_posts_v_version_images_order_idx" ON "blog"."_posts_v_version_images" USING btree ("_order");
  CREATE INDEX "_posts_v_version_images_parent_id_idx" ON "blog"."_posts_v_version_images" USING btree ("_parent_id");
  CREATE INDEX "_posts_v_version_images_image_idx" ON "blog"."_posts_v_version_images" USING btree ("image_id");
  CREATE INDEX "_posts_v_version_faq_order_idx" ON "blog"."_posts_v_version_faq" USING btree ("_order");
  CREATE INDEX "_posts_v_version_faq_parent_id_idx" ON "blog"."_posts_v_version_faq" USING btree ("_parent_id");
  CREATE INDEX "_posts_v_version_sources_order_idx" ON "blog"."_posts_v_version_sources" USING btree ("_order");
  CREATE INDEX "_posts_v_version_sources_parent_id_idx" ON "blog"."_posts_v_version_sources" USING btree ("_parent_id");
  CREATE INDEX "_posts_v_version_tags_order_idx" ON "blog"."_posts_v_version_tags" USING btree ("_order");
  CREATE INDEX "_posts_v_version_tags_parent_id_idx" ON "blog"."_posts_v_version_tags" USING btree ("_parent_id");
  CREATE INDEX "_posts_v_parent_idx" ON "blog"."_posts_v" USING btree ("parent_id");
  CREATE INDEX "_posts_v_version_version_category_idx" ON "blog"."_posts_v" USING btree ("version_category_id");
  CREATE INDEX "_posts_v_version_version_author_idx" ON "blog"."_posts_v" USING btree ("version_author_id");
  CREATE INDEX "_posts_v_version_version_thumbnail_idx" ON "blog"."_posts_v" USING btree ("version_thumbnail_id");
  CREATE INDEX "_posts_v_version_version_slug_idx" ON "blog"."_posts_v" USING btree ("version_slug");
  CREATE INDEX "_posts_v_version_version_updated_at_idx" ON "blog"."_posts_v" USING btree ("version_updated_at");
  CREATE INDEX "_posts_v_version_version_created_at_idx" ON "blog"."_posts_v" USING btree ("version_created_at");
  CREATE INDEX "_posts_v_version_version__status_idx" ON "blog"."_posts_v" USING btree ("version__status");
  CREATE INDEX "_posts_v_created_at_idx" ON "blog"."_posts_v" USING btree ("created_at");
  CREATE INDEX "_posts_v_updated_at_idx" ON "blog"."_posts_v" USING btree ("updated_at");
  CREATE INDEX "_posts_v_latest_idx" ON "blog"."_posts_v" USING btree ("latest");
  CREATE INDEX "_posts_v_autosave_idx" ON "blog"."_posts_v" USING btree ("autosave");
  CREATE INDEX "_posts_v_rels_order_idx" ON "blog"."_posts_v_rels" USING btree ("order");
  CREATE INDEX "_posts_v_rels_parent_idx" ON "blog"."_posts_v_rels" USING btree ("parent_id");
  CREATE INDEX "_posts_v_rels_path_idx" ON "blog"."_posts_v_rels" USING btree ("path");
  CREATE INDEX "_posts_v_rels_posts_id_idx" ON "blog"."_posts_v_rels" USING btree ("posts_id");
  CREATE UNIQUE INDEX "categories_slug_idx" ON "blog"."categories" USING btree ("slug");
  CREATE INDEX "categories_updated_at_idx" ON "blog"."categories" USING btree ("updated_at");
  CREATE INDEX "categories_created_at_idx" ON "blog"."categories" USING btree ("created_at");
  CREATE INDEX "doctors_specialties_order_idx" ON "blog"."doctors_specialties" USING btree ("_order");
  CREATE INDEX "doctors_specialties_parent_id_idx" ON "blog"."doctors_specialties" USING btree ("_parent_id");
  CREATE INDEX "doctors_career_order_idx" ON "blog"."doctors_career" USING btree ("_order");
  CREATE INDEX "doctors_career_parent_id_idx" ON "blog"."doctors_career" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "doctors_slug_idx" ON "blog"."doctors" USING btree ("slug");
  CREATE INDEX "doctors_photo_idx" ON "blog"."doctors" USING btree ("photo_id");
  CREATE INDEX "doctors_updated_at_idx" ON "blog"."doctors" USING btree ("updated_at");
  CREATE INDEX "doctors_created_at_idx" ON "blog"."doctors" USING btree ("created_at");
  CREATE INDEX "media_updated_at_idx" ON "blog"."media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "blog"."media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "blog"."media" USING btree ("filename");
  CREATE INDEX "media_sizes_thumbnail_sizes_thumbnail_filename_idx" ON "blog"."media" USING btree ("sizes_thumbnail_filename");
  CREATE INDEX "media_sizes_card_sizes_card_filename_idx" ON "blog"."media" USING btree ("sizes_card_filename");
  CREATE INDEX "media_sizes_content_sizes_content_filename_idx" ON "blog"."media" USING btree ("sizes_content_filename");
  CREATE INDEX "media_sizes_og_sizes_og_filename_idx" ON "blog"."media" USING btree ("sizes_og_filename");
  CREATE INDEX "users_sessions_order_idx" ON "blog"."users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "blog"."users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "blog"."users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "blog"."users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "blog"."users" USING btree ("email");
  CREATE INDEX "page_views_session_id_idx" ON "blog"."page_views" USING btree ("session_id");
  CREATE INDEX "page_views_path_idx" ON "blog"."page_views" USING btree ("path");
  CREATE INDEX "page_views_source_idx" ON "blog"."page_views" USING btree ("source");
  CREATE INDEX "page_views_updated_at_idx" ON "blog"."page_views" USING btree ("updated_at");
  CREATE INDEX "page_views_created_at_idx" ON "blog"."page_views" USING btree ("created_at");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "blog"."payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "blog"."payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "blog"."payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "blog"."payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "blog"."payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "blog"."payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "blog"."payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_posts_id_idx" ON "blog"."payload_locked_documents_rels" USING btree ("posts_id");
  CREATE INDEX "payload_locked_documents_rels_categories_id_idx" ON "blog"."payload_locked_documents_rels" USING btree ("categories_id");
  CREATE INDEX "payload_locked_documents_rels_doctors_id_idx" ON "blog"."payload_locked_documents_rels" USING btree ("doctors_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "blog"."payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "blog"."payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_locked_documents_rels_page_views_id_idx" ON "blog"."payload_locked_documents_rels" USING btree ("page_views_id");
  CREATE INDEX "payload_preferences_key_idx" ON "blog"."payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "blog"."payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "blog"."payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "blog"."payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "blog"."payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "blog"."payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "blog"."payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "blog"."payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "blog"."payload_migrations" USING btree ("created_at");
  CREATE INDEX "home_popular_keywords_order_idx" ON "blog"."home_popular_keywords" USING btree ("_order");
  CREATE INDEX "home_popular_keywords_parent_id_idx" ON "blog"."home_popular_keywords" USING btree ("_parent_id");
  CREATE INDEX "home_banners_order_idx" ON "blog"."home_banners" USING btree ("_order");
  CREATE INDEX "home_banners_parent_id_idx" ON "blog"."home_banners" USING btree ("_parent_id");
  CREATE INDEX "home_banners_image_idx" ON "blog"."home_banners" USING btree ("image_id");
  CREATE INDEX "home_banners_mobile_image_idx" ON "blog"."home_banners" USING btree ("mobile_image_id");
  CREATE INDEX "home_key_points_order_idx" ON "blog"."home_key_points" USING btree ("_order");
  CREATE INDEX "home_key_points_parent_id_idx" ON "blog"."home_key_points" USING btree ("_parent_id");
  CREATE INDEX "home_faq_order_idx" ON "blog"."home_faq" USING btree ("_order");
  CREATE INDEX "home_faq_parent_id_idx" ON "blog"."home_faq" USING btree ("_parent_id");
  CREATE INDEX "home__status_idx" ON "blog"."home" USING btree ("_status");
  CREATE INDEX "_home_v_version_popular_keywords_order_idx" ON "blog"."_home_v_version_popular_keywords" USING btree ("_order");
  CREATE INDEX "_home_v_version_popular_keywords_parent_id_idx" ON "blog"."_home_v_version_popular_keywords" USING btree ("_parent_id");
  CREATE INDEX "_home_v_version_banners_order_idx" ON "blog"."_home_v_version_banners" USING btree ("_order");
  CREATE INDEX "_home_v_version_banners_parent_id_idx" ON "blog"."_home_v_version_banners" USING btree ("_parent_id");
  CREATE INDEX "_home_v_version_banners_image_idx" ON "blog"."_home_v_version_banners" USING btree ("image_id");
  CREATE INDEX "_home_v_version_banners_mobile_image_idx" ON "blog"."_home_v_version_banners" USING btree ("mobile_image_id");
  CREATE INDEX "_home_v_version_key_points_order_idx" ON "blog"."_home_v_version_key_points" USING btree ("_order");
  CREATE INDEX "_home_v_version_key_points_parent_id_idx" ON "blog"."_home_v_version_key_points" USING btree ("_parent_id");
  CREATE INDEX "_home_v_version_faq_order_idx" ON "blog"."_home_v_version_faq" USING btree ("_order");
  CREATE INDEX "_home_v_version_faq_parent_id_idx" ON "blog"."_home_v_version_faq" USING btree ("_parent_id");
  CREATE INDEX "_home_v_version_version__status_idx" ON "blog"."_home_v" USING btree ("version__status");
  CREATE INDEX "_home_v_created_at_idx" ON "blog"."_home_v" USING btree ("created_at");
  CREATE INDEX "_home_v_updated_at_idx" ON "blog"."_home_v" USING btree ("updated_at");
  CREATE INDEX "_home_v_latest_idx" ON "blog"."_home_v" USING btree ("latest");
  CREATE INDEX "_home_v_autosave_idx" ON "blog"."_home_v" USING btree ("autosave");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "blog"."posts_key_points" CASCADE;
  DROP TABLE "blog"."posts_images" CASCADE;
  DROP TABLE "blog"."posts_faq" CASCADE;
  DROP TABLE "blog"."posts_sources" CASCADE;
  DROP TABLE "blog"."posts_tags" CASCADE;
  DROP TABLE "blog"."posts" CASCADE;
  DROP TABLE "blog"."posts_rels" CASCADE;
  DROP TABLE "blog"."_posts_v_version_key_points" CASCADE;
  DROP TABLE "blog"."_posts_v_version_images" CASCADE;
  DROP TABLE "blog"."_posts_v_version_faq" CASCADE;
  DROP TABLE "blog"."_posts_v_version_sources" CASCADE;
  DROP TABLE "blog"."_posts_v_version_tags" CASCADE;
  DROP TABLE "blog"."_posts_v" CASCADE;
  DROP TABLE "blog"."_posts_v_rels" CASCADE;
  DROP TABLE "blog"."categories" CASCADE;
  DROP TABLE "blog"."doctors_specialties" CASCADE;
  DROP TABLE "blog"."doctors_career" CASCADE;
  DROP TABLE "blog"."doctors" CASCADE;
  DROP TABLE "blog"."media" CASCADE;
  DROP TABLE "blog"."users_sessions" CASCADE;
  DROP TABLE "blog"."users" CASCADE;
  DROP TABLE "blog"."page_views" CASCADE;
  DROP TABLE "blog"."payload_kv" CASCADE;
  DROP TABLE "blog"."payload_locked_documents" CASCADE;
  DROP TABLE "blog"."payload_locked_documents_rels" CASCADE;
  DROP TABLE "blog"."payload_preferences" CASCADE;
  DROP TABLE "blog"."payload_preferences_rels" CASCADE;
  DROP TABLE "blog"."payload_migrations" CASCADE;
  DROP TABLE "blog"."home_popular_keywords" CASCADE;
  DROP TABLE "blog"."home_banners" CASCADE;
  DROP TABLE "blog"."home_key_points" CASCADE;
  DROP TABLE "blog"."home_faq" CASCADE;
  DROP TABLE "blog"."home" CASCADE;
  DROP TABLE "blog"."_home_v_version_popular_keywords" CASCADE;
  DROP TABLE "blog"."_home_v_version_banners" CASCADE;
  DROP TABLE "blog"."_home_v_version_key_points" CASCADE;
  DROP TABLE "blog"."_home_v_version_faq" CASCADE;
  DROP TABLE "blog"."_home_v" CASCADE;
  DROP TYPE "blog"."enum_posts_status";
  DROP TYPE "blog"."enum__posts_v_version_status";
  DROP TYPE "blog"."enum_page_views_device";
  DROP TYPE "blog"."enum_page_views_event";
  DROP TYPE "blog"."enum_home_status";
  DROP TYPE "blog"."enum__home_v_version_status";`)
}
