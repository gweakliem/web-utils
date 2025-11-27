# Web Utilities project

I'm a Data Engineer in my day job and there's stuff I do all the time: convert unix timestamps, format some JSON to make it readable, base64 encode/decode stuff. There's a billion sites out there to do this but:

1. I wanted all that in one place
2. I wanted a project to work on
3. I wanted something I could deploy
4. I kinda wanted to do some front end work

All with a UI that only a backend engineer would come up with.

Deployed at https://meggie.be/

## Setup

Created using [Nuxt](https://nuxt.com/docs/getting-started/introduction). This section outlines what's required to build and work on this project.

### Prerequesites

- [Node.js](https://nodejs.org/en/download/)
- [npm](https://www.npmjs.com/get-npm)

It's probably a good idea to use [nvm](https://github.com/nvm-sh/nvm) to manage your Node.js versions.

### Installation
Make sure to install dependencies:

```bash
npm install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
npm run dev
```

## Production

Build the application for production:

```bash
npm run build
```

Locally preview production build:

```bash
npm run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.

This is deployed on AWS Amplify. The deployment relies on a Github PAT which needs to be regenerated periodically. The PAT gets stored in the AWS Amplify Secrets.

## Resources

Sounds downloaded from [SoundBible.com](https://soundbible.com/), licensed under [Creative Commons Attribution 3.0](https://creativecommons.org/licenses/by/3.0/)
* https://soundbible.com/2155-Text-Message-Alert-2.html