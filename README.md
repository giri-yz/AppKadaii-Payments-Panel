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

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
