<br />
<div align="center">
  <img src="public/logo_shadow.svg" alt="Logo" width="170" height="170">

  <h3 align="center">Clarix</h3>

  <p align="center">
    Build ChatGPT-like chatbots that are aware of your data
    <br />
    <a href="https://youtu.be/LxOjdis2g48"><strong>View Demo on YouTube (1.4 min) »</strong></a>
    <br />
    <br />
    <a href="#tech-stack">Tech Stack</a>
    ·
    <a href="#getting-started">Getting Started</a>
    ·
    <a href="#contributing">Contributing</a>
    <br />
    <a href="https://github.com/denbondd/clarix/issues">Report Bug</a>
    ·
    <a href="https://github.com/denbondd/clarix/issues">Request Feature</a>
  </p>
</div>

<details>
  <summary>Table of content</summary>

- [About the project](#about-the-project)
  - [Features](#features)
- [Tech Stack](#tech-stack)
  - [Technologies](#technologies)
  - [UI](#ui)
  - [Libraries](#libraries)
- [Getting started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Local Installation](#local-installation)
  - [Deployment](#deployment)
- [ToDo](#todo)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

</details>


## About the project
Full stack web application, written in Next.js App Router. Create custom ChatGPT-like chatbots for your data.

### Features

- Data organization - organize learning files in folders to easily tell Agents what to learn
- Fully customizable agents - choose AI model, write System Prompt, choose temperature, select folders it should know and start talking with it!
- Convenient chat interface - create separate chats for agents and start talking with them, with features like response streaming and answer regeneration
- Response sources - view which chunks of your data AI used to generate every answer and percentage value on how similar it was to the topic of your question

## Tech Stack

### Technologies
- [TypeScript](https://www.typescriptlang.org/)
- [React](https://react.dev/)
- [Next.js](https://nextjs.org/) - React framework for full-stack applications
- [Auth.js](https://authjs.dev/) - user authentication
- [Prisma](https://www.prisma.io/) - Typescript-first ORM
- [PostgreSQL](https://www.postgresql.org/) - SQL Database
- [Vercel](https://vercel.com/) - Complete CI/CD and deployment

### UI
- [TailwindCSS](https://tailwindcss.com/) - utility-first CSS framework
- [shadcn/ui](https://ui.shadcn.com/) - components template library on top of Radix-UI
- [Lucide](https://lucide.dev/) - icons library

### Libraries
- [ai](https://sdk.vercel.ai/docs) - Vercel AI SDK, used for AI Model response streaming from the backend
- [Langchain](https://www.langchain.com/) - library for AI, used for creating embeddings
- [Zod](https://zod.dev/) - TypeScript-first schema validation with static type inference
- [React Hook Form](https://react-hook-form.com/) - Performant, flexible and extensible forms with easy-to-use validation

## Getting started
The project is self-hosted only, we might enable cloud hosting later if there will be a demand for this.

### Prerequisites
To run the project, you will need the following env variables:

- URL string to connect to the database. The project is configured for PostgreSQL, but you can easily change it to any SQL database or MongoDB (the project was not tested with other databases). Prisma docs about database connectors: [..link..](https://www.prisma.io/docs/concepts/database-connectors)
- OpenAI API Key. You can change or add other providers in the code ([src/app/api/kb/files/[fileId]/embeddings/route.ts](/src/app/api/kb/files/%5BfileId%5D/embeddings/route.ts) and [src/app/api/chat/[chatId]/route.ts](/src/app/api/chat/%5BchatId%5D/route.ts) files)
- OAuth secrets for Auth.js. Project configured for GitHub OAuth, but you can easily change it to any other OAuth provider. email or credentials auth. Auth.js docs on providers: [..link..](https://next-auth.js.org/providers/)
  
### Local Installation
1.  Clone this project via
    ```sh
    git clone https://github.com/denbondd/clarix.git
    ```
2. Go to the project folder

   ```sh
   cd clarix
   ```

3. Install packages with npm

   ```sh
   npm install
   ```

4. Set up your `.env` file

   - Duplicate `.env.example` to `.env`
   - Use `openssl rand -base64 32` or https://generate-secret.vercel.app/32 to generate a key and add it under `NEXTAUTH_SECRET` in the `.env` file.

5. Set up your database running [/sql/schema.sql](/sql/schema.sql)

6. Start using with
   ```sh
   npm run dev
   ```
  
### Deployment
You can deploy it to Vercel with one click, but the free plan has only a 5s duration limit for serverless functions, which will throw 504 (Request Timeout) on embeddings creation (file creation) for large content. Also, keep in mind that your Database needs to be accessible from the web:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fdenbondd%2Fclarix)

## ToDo
- Store large files' content in the files in S3 or any other object storage. Currently, content is stored in the `files` table. The get-content endpoint is separated from the get-file for this reason
- Add the possibility to upload files in other formats (PDF, website crawl, video, etc)
- Add the possibility to create a prompt template for agents. Require {context} and {question} fields
- Configure adaptive mobile layout for every page (currently only for PC)
- Enforse Server Side Rendering everywhere and create child client components for interactivity where needed
- Your feature?

## Contributing

Contributions are what makes the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License
The source code in this repository is made available under the [MPL-2.0 License](/LICENSE).

## Contact
Denys Bondarenko - [@denbondd](https://twitter.com/denbondd) - [denbon04@gmail.com](mailto:denbon04@gmail.com)