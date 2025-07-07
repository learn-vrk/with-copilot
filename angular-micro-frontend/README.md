# Angular Micro Frontend with NgRX

This is a "Hello, World!" Angular v18 application that demonstrates micro-frontend architecture using Module Federation and NgRX store management.

## Project Structure

```
angular-micro-frontend/
├── projects/
│   └── shell/          # Main shell application
├── package.json
├── angular.json
└── tsconfig.json
```

## Features

- **Angular v18**: Latest Angular framework with modern features
- **Habitat Packages**: Browse and search Chef Habitat packages with NgRX state management
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

2. Open your browser and navigate to http://localhost:4200

### Build

Build the application:
```bash
npm run build:shell
```

## Architecture

### Shell Application
- Main application with routing and navigation
- Manages global state with NgRX
- Includes Habitat packages browser component
- Responsive design with modern UI

### NgRX Store
- **Actions**: Define state changes
- **Reducers**: Handle state transitions
- **Effects**: Handle side effects (API calls, etc.)
- **Selectors**: Query state data

## Features

### Habitat Packages Browser
- Browse Chef Habitat packages with mock data
- Search functionality with debouncing
- Pagination support
- Package details and install commands
- Responsive card-based layout

## State Management

The application uses NgRX for state management:

- Global state for application and habitat packages
- Actions for loading and searching packages
- Effects for handling asynchronous operations
- Selectors for querying state

## Styling

- SCSS for styling
- Responsive design
- Modern UI components
- CSS Grid and Flexbox layouts

## Development Scripts

- `npm run serve:shell` - Start shell application
- `npm run build:shell` - Build shell application
- `npm start` - Start shell application (default)

## Browser Support

This project supports all modern browsers that support ES2022.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

Apache License 2.0
