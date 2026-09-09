CREATE TABLE "signup_limits" (
	"key" text PRIMARY KEY NOT NULL,
	"attempts" integer DEFAULT 1 NOT NULL,
	"expires_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "testflight_signups" (
	"email" text PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"consent_version" text DEFAULT 'testflight-invite-v1' NOT NULL
);
