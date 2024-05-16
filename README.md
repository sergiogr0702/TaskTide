<p align="center">
</p>
<p align="center">
    <h1 align="center">TaskTide</h1>
</p>
<p align="center">
		<em>Trello clone build with Next.js 18.</em>
</p>
<p align="center">
	<a href=""><img src="https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript"></a>
	<a href=""><img src="https://img.shields.io/badge/Next-black?style=for-the-badge&logo=next.js&logoColor=white" alt="Next JS"></a>
   <a href=""><img src="https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="TailwindCSS"></a>
</p>

<br><!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary><br>

- [ Overview](#-overview)
- [ Getting Started](#-getting-started)
  - [ Pre-Requisites](#-pre-requisites)
  - [ Installation](#-installation)
  - [ Usage](#-usage)
- [ Development](#-development)
  - [ Development Environment](#-development-environment)
  - [ Build](#-build)
  - [ Deployment](#-deployment)
- [ Contributing](#-contributing)
- [ Gallery](#-gallery)
- [ License](#-license)
</details>
<hr>

##  Overview

<p align="justify">
   TaskTide is a complete Trello clone built with Next.js.
   With TaskTide you can create organizations, boards, lists, cards and you can also reorder the cards and lists in any moment simply by dragging and dropping them.

   To handle these actions, TaskTide uses different third party APIs. For user register and login as well as organization selection and creation, this app uses [Clerk](https://clerk.com/). For image selection on board creation, TaskTide uses the [Unsplash API](https://unsplash.com/). Finally, TaskTide also implements a subcription based system to handle the creation of unlimited boards inside an organization. To handle this action, the app uses [Stripe](https://stripe.com/).
</p>

---

## Getting Started

In the next sections the requirements and installation instructions can be found:

### Pre-Requisites

To execute the application, you need to install in your system the next tools:

- At least Node 21.2.0
- At least NPM 10.2.0

You also need to create and configure the following accounts:

- Clerk Account
- Unsplash Account
- Stripe Account

### Installation

 1. Clone the TaskTide repository:
```bash
git clone https://github.com/sergiogr0702/TaskTide.git
```

2. Change to the project directory:
```bash
cd TaskTide
```

3. Install the dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

4. Create a PostgreSQL instance and run it on local or on cloud

5. Configure enviorment variables in .env file

6. Create the database migrations with prisma:
```bash
npmx prisma generate
# or
yarnx prisma generate
# or
pnpmx prisma generate
# or
bunx prisma generate
```

7. Run the migrations with prisma:
```bash
npmx prisma db push
# or
yarnx prisma db push
# or
pnpmx prisma db push
# or
bunx prisma db push
```

### Usage

To execute the project you need to go to the source folder and run the next command:

```bash
npm run dev
# or
yarn run dev
# or
pnpm run dev
# or
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Development

In order to deploy this project online, some configurations and commands are required to be run before:

### Development Environment

Before building the project you need to set the following environment variables in the configuration file inside the .env file:
- NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
- CLERK_SECRET_KEY
- NEXT_PUBLIC_CLERK_SIGN_IN_URL
- NEXT_PUBLIC_CLERK_SIGN_UP_URL
- DATABASE_URL
- NEXT_PUBLIC_UNSPLASH_ACCESS_KEY
- STRIPE_API_KEY
- NEXT_PUBLIC_APP_URL
- STRIPE_WEBHOOK_SECRET

### Build
To generate a production-ready build for the TaskTide project, follow these steps:

1. **Create a Production-Ready Environment File**: In the TaskTide project directory, modify the file called .env. This file will contain the variables for your production environment.

2. **Configure the Database**: Modify the PostgreSQL instance configuration to accept calls from outside your local device.

3. **Create a New Branch**: Create a new branch in your Git repository specifically for your production-ready build. This will allow you to keep your production environment separate from your development environment.

4. **Install Dependencies**: Install the dependencies listed in the package.json file by running:
```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

5. **Run Migrations**: Before you can run the project, you need to create the necessary database tables. To do this, run the following command:
```bash
npmx prisma generate
# or
yarnx prisma generate
# or
pnpmx prisma generate
# or
bunx prisma generate
```

6. **Apply Migrations**: After running makemigrations, apply the changes to the database by running:
```bash
npmx prisma db push
# or
yarnx prisma db push
# or
pnpmx prisma db push
# or
bunx prisma db push
```

7. **Generate the build version for the project**: Finally, run the following command to generate the production ready files:
```bash
npm build
# or
yarn build
# or
pnpm build
# or
bun build
```

8. **Test Your Application**: Before deploying your application, test it thoroughly to ensure that it is working as expected. You can use a service like Selenium or Postman to automate your testing process.

9. **Deploy Your Application**: Once you have tested your application and are satisfied with its performance, you can deploy it using a service like Heroku, AWS Elastic Beanstalk, or Google App Engine.

10. **Monitor Your Application**: After deploying your application, monitor its performance using a service like New Relic or Datadog. This will help you identify and fix any issues that may arise in your production environment.

### Deployment

The easiest way to deploy TaskTide Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out the [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

---

##  Contributing

Contributions are welcome! Here are several ways you can contribute:

- **[Report Issues](https://github.com/sergiogr0702/TaskTide/issues)**: Submit bugs found or log feature requests for the `TaskTide` project.
- **[Submit Pull Requests](https://github.com/sergiogr0702/TaskTide/blob/main/CONTRIBUTING.md)**: Review open PRs, and submit your own PRs.
- **[Join the Discussions](https://github.com/sergiogr0702/TaskTide/discussions)**: Share your insights, provide feedback, or ask questions.

<details closed>
<summary>Contributing Guidelines</summary>

1. **Fork the Repository**: Start by forking the project repository to your github account.
2. **Clone Locally**: Clone the forked repository to your local machine using a git client.
   ```sh
   git clone https://github.com/sergiogr0702/TaskTide
   ```
3. **Create a New Branch**: Always work on a new branch, giving it a descriptive name.
   ```sh
   git checkout -b new-feature-x
   ```
4. **Make Your Changes**: Develop and test your changes locally.
5. **Commit Your Changes**: Commit with a clear message describing your updates.
   ```sh
   git commit -m 'Implemented new feature x.'
   ```
6. **Push to github**: Push the changes to your forked repository.
   ```sh
   git push origin new-feature-x
   ```
7. **Submit a Pull Request**: Create a PR against the original project repository. Clearly describe the changes and their motivations.
8. **Review**: Once your PR is reviewed and approved, it will be merged into the main branch. Congratulations on your contribution!
</details>

<details closed>
<summary>Contributor Graph</summary>
<br>
<p align="center">
   <a href="https://github.com{/sergiogr0702/TaskTide/}graphs/contributors">
      <img src="https://contrib.rocks/image?repo=sergiogr0702/TaskTide">
   </a>
</p>
</details>

---

##  Gallery
In this section you can find some examples of the application running:

- Landing page: This page will show for users that aren't logged in the application:

![Landing]

- Register page: Page controlled by Clerk to handle the registration of new users:

![Register]

- Login page: Page controlled by Clerk to handle the login of users:

![Login]

- Profile page: Page controlled by Clerk to handle the profile updates and visualization:

![Profile]

- Organization creation and selection page: Page controlled by Clerk to handle the organization creation and selection:

![Create-org]

- Dashboard page: In this section the user can change between the different organizations and the boards of those organizations as well as view and handle the different actions relative to the board actions and navigation:

![Dashboard]

- Settings page: Page controlled by Clerk to handle the settings of the different organizations:

![Settings]

- Activity page: In this page the user can view the different actions done in the organization ordered from the most recent one to the least recently:

![Activity]

- Create board modal: This modal can be opened in different ways. With this modal the user can create new boards:

![Create-board]

- Board page: In this page the user can perform all the actions relative to boards, lists and cards. From here the user can create and update the board, lists and card name as well as delete these or reorder the lists and cards by dragging and dropping:

![Board]

- Upgrade modal: When the user tries to create more than 5 boards in an organization, this modal will show telling the user to upgrade to premium:

![Upgrade]

- New subscription page: Page is controlled by Stripe to handle the subscription to premium for one specific organization:

![Subscribe]

- View subscription page: Page is controlled by Stripe to handle the visualization of an already created subscription. This page also handles the deletation or upgrade of an already created premium subscription:

![Subscription-view]

---

##  License

This project is protected under the [Apache License 2.0](https://choosealicense.com/licenses/apache-2.0/) License. For more details, refer to the [LICENSE](https://github.com/sergiogr0702/TaskTide/blob/main/LICENSE/) file.


[**Return**](#-overview)

---

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[Landing]: https://github.com/sergiogr0702/TaskTide/blob/main/demo-images/landing.png
[Login]: https://github.com/sergiogr0702/TaskTide/blob/main/demo-images/login.png
[Register]: https://github.com/sergiogr0702/TaskTide/blob/main/demo-images/register.png
[Profile]: https://github.com/sergiogr0702/TaskTide/blob/main/demo-images/profile.png
[Create-org]: https://github.com/sergiogr0702/TaskTide/blob/main/demo-images/create_org.png
[Dashboard]: https://github.com/sergiogr0702/TaskTide/blob/main/demo-images/dashboard.png
[Settings]: https://github.com/sergiogr0702/TaskTide/blob/main/demo-images/settings.png
[Activity]: https://github.com/sergiogr0702/TaskTide/blob/main/demo-images/activity.png
[Create-board]: https://github.com/sergiogr0702/TaskTide/blob/main/demo-images/create_board.png
[Board]: https://github.com/sergiogr0702/TaskTide/blob/main/demo-images/board.png
[Upgrade]: https://github.com/sergiogr0702/TaskTide/blob/main/demo-images/upgrade.png
[Subscribe]: https://github.com/sergiogr0702/TaskTide/blob/main/demo-images/subcribe.png
[Subscription-view]: https://github.com/sergiogr0702/TaskTide/blob/main/demo-images/subscription_view.png
