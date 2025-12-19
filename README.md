## Getting Started

This is a [Next.js](https://nextjs.org) project. We outline a few conventions and the setup to setup development.

## Setup
First, install [nodejs](https://nodejs.org/en/download) in WSL (or use Linux):

#### Download and install nvm:
```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash`

# in lieu of restarting the shell
`\. "$HOME/.nvm/nvm.sh"`

# Download and install Node.js:
nvm install 24

# Verify the Node.js version:
node -v

# Download and install pnpm:
corepack enable pnpm

# Verify pnpm version:
pnpm -v
```

#### Now install the necessary packages and run
```bash
pnpm install
pnpm dev
```

## Conventions
All code in src, we use three main folders:
- app, here goes all of the pages
- components, the components used by the pages
- lib, all logic for pages go here

Code is formatted and linted by using:
```bash
pnpm format
pnpm lint
```

All code must first be reviewed by Copilot and SonarQube by using pull requests.
