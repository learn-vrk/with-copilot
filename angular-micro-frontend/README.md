# Angular Micro Frontend with NgRX

This is a "Hello, World!" Angular v18 application that demonstrates micro-frontend architecture using Module Federation and NgRX store management.

## Project Structure

```
angular-micro-frontend/
├── projects/
│   ├── shell/          # Main shell application
│   └── mfe1/           # Micro frontend 1
├── package.json
├── angular.json
└── tsconfig.json
```

## Features

- **Angular v18**: Latest Angular framework with modern features
- **Micro Frontend Architecture**: Using Module Federation for scalable development
- **NgRX State Management**: Complete state management with actions, reducers, effects, and selectors
- **Responsive Design**: Modern UI with SCSS styling
- **Independent Deployment**: Each micro frontend can be deployed independently

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

### Development

1. Start the shell application:
   ```bash
   npm run serve:shell
   ```
   This will start the shell application on http://localhost:4200

2. Start the micro frontend:
   ```bash
   npm run serve:mfe1
   ```
   This will start MFE1 on http://localhost:4201

3. Open your browser and navigate to http://localhost:4200

### Build

Build all applications:
```bash
npm run build:shell
npm run build:mfe1
```

## Architecture

### Shell Application
- Main container application
- Handles routing and navigation
- Manages global state with NgRX
- Loads micro frontends dynamically

### Micro Frontend 1 (MFE1)
- Independent Angular application
- Exposed through Module Federation
- Can be developed and deployed independently
- Shares state with the shell application

### NgRX Store
- **Actions**: Define state changes
- **Reducers**: Handle state transitions
- **Effects**: Handle side effects (API calls, etc.)
- **Selectors**: Query state data

## Module Federation Configuration

The project uses Webpack Module Federation to enable micro frontend architecture:

- **Shell**: Acts as the host application
- **MFE1**: Acts as a remote application exposed to the shell

## State Management

The application uses NgRX for state management:

- Global state shared across micro frontends
- Actions for updating messages
- Effects for handling asynchronous operations
- Selectors for querying state

## Styling

- SCSS for styling
- Responsive design
- Modern UI components
- CSS Grid and Flexbox layouts

## Development Scripts

- `npm run serve:shell` - Start shell application
- `npm run serve:mfe1` - Start micro frontend 1
- `npm run build:shell` - Build shell application
- `npm run build:mfe1` - Build micro frontend 1
- `npm start` - Start shell application (default)

## Browser Support

This project supports all modern browsers that support ES2022.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License
