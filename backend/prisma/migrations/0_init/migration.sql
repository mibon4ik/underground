-- CreateSchema

CREATE TABLE "Setting" (
    "id" SERIAL NOT NULL,
    "key" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    CONSTRAINT "Setting_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "Setting_key_key" UNIQUE ("key")
);

CREATE TABLE "Price" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "price" TEXT NOT NULL,
    CONSTRAINT "Price_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Coach" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "regalia" TEXT NOT NULL,
    "branch" TEXT NOT NULL,
    CONSTRAINT "Coach_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Branch" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "video" TEXT,
    CONSTRAINT "Branch_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ScheduleItem" (
    "id" SERIAL NOT NULL,
    "day" TEXT NOT NULL,
    "time" TEXT NOT NULL,
    "activity" TEXT NOT NULL,
    CONSTRAINT "ScheduleItem_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "NewsItem" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    CONSTRAINT "NewsItem_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "GalleryItem" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "caption" TEXT,
    CONSTRAINT "GalleryItem_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Review" (
    "id" SERIAL NOT NULL,
    "author" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "rating" TEXT NOT NULL,
    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "WorkoutProgram" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "goal" TEXT NOT NULL,
    CONSTRAINT "WorkoutProgram_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ShopItem" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "price" TEXT NOT NULL,
    CONSTRAINT "ShopItem_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Booking" (
    "id" SERIAL NOT NULL,
    "client" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "time" TEXT NOT NULL,
    CONSTRAINT "Booking_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Referral" (
    "id" SERIAL NOT NULL,
    "policy" TEXT,
    "bonus" TEXT,
    CONSTRAINT "Referral_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Promo" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "discount" TEXT NOT NULL,
    "ends" TEXT NOT NULL,
    CONSTRAINT "Promo_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Faq" (
    "id" SERIAL NOT NULL,
    "q" TEXT NOT NULL,
    "a" TEXT NOT NULL,
    CONSTRAINT "Faq_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Achievement" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "desc" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    CONSTRAINT "Achievement_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Lead" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT,
    "phone" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    CONSTRAINT "Lead_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "login" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "User_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "User_login_key" UNIQUE ("login")
);
