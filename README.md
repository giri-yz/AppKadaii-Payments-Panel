This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## AppKadaii Payments Panel

This is a client-side, offline-first Progressive Web App (PWA) for tracking project-based income and expenses. All data is stored locally on your device.

## Getting Started

Follow these instructions to get the project running on your local machine.

### 1. Install Dependencies

First, you must install the necessary dependencies. Navigate to the project directory in your terminal and run:

```bash
npm install
```

### 2. Run the Development Server

Once the installation is complete, you can run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application. The page will auto-update as you edit the files.

### 3. Build for Production (Static PWA)

This application is designed to be a static Progressive Web App that works offline. To create the production-ready version, run the following command:

```bash
npm run build
```

This command will generate a static version of the application in the `out` directory.

### 4. Run the Production App

The contents of the `out` folder are the complete application. You can serve these files with any static server. For example, you can use the `serve` package:

```bash
npx serve out
```

After running this, you can access the production application at the URL provided by the `serve` command. Once loaded, the app will work offline.

## Deployment to Google Cloud

This project includes an automated script (`deploy.sh`) to deploy the static PWA to a Google Cloud Storage bucket.

### Prerequisites

1.  A Google Cloud Platform (GCP) account.
2.  The [Google Cloud SDK](https://cloud.google.com/sdk/docs/install) (`gcloud` CLI) installed and authenticated on your local machine. You can authenticate by running `gcloud auth login`.

### Step 1: Create a GCS Bucket

You need a globally unique Google Cloud Storage bucket to host your application. You can create one via the GCP Console or with the `gcloud` CLI:

```bash
# Replace 'your-unique-bucket-name' with a globally unique name
gcloud storage buckets create gs://your-unique-bucket-name --public-access-prevention
```

### Step 2: Configure the Deployment Script

Open the `deploy.sh` file in the root of this project and replace the placeholder `YOUR_BUCKET_NAME_HERE` with the name of the bucket you just created.

### Step 3: Run the Deployment Script

Make sure the script is executable (it should be by default). Then, run it from your terminal:

```bash
./deploy.sh
```

The script will build the application, upload the files to your GCS bucket, and set the correct public permissions. You can then access your deployed application at `https://storage.googleapis.com/your-unique-bucket-name/index.html`.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!
