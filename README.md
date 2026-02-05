# Latis - Professional Medical Network

Latis is a specialized professional networking platform designed for medical practitioners. It enables doctors, specialists, and healthcare professionals to build their clinical graph, manage professional relationships, and facilitate secure consultations.

## 🚀 Key Features

*   **Professional Identity**: Create detailed profiles highlighting medical specialization, experience, education, and credentials.
*   **Clinical Graph**:
    *   **Connect**: Establish mutual connections with colleagues and peers.
    *   **Follow**: Stay updated with industry leaders and researchers via one-way follows.
    *   **Manage**: Detailed management of your "Clinical Nodes" (network) with real-time request handling.
*   **Search**: Advanced search capabilities to find professionals by name, specialty, or location.
*   **Privacy & Security**: Granular control over your network with blocking capabilities and secure data handling.

## 🛠️ Tech Stack

*   **Frontend**: React 19, TypeScript
*   **Build Tool**: Vite
*   **Routing**: React Router v7
*   **State & Data Fetching**: React Query (@tanstack/react-query)
*   **Styling**: Vanilla CSS / CSS Modules with a custom responsive design system.
*   **Authentication**: Firebase Auth (integrated)
*   **HTTP Client**: Axios

## 📦 Getting Started

### Prerequisites

*   Node.js (v18 or higher)
*   npm (v9 or higher)

### Installation

1.  **Clone the repository**
    ```bash
    git clone <repository-url>
    cd frontend_latis
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Environment Setup**
    Create a `.env` file in the root directory if one doesn't exist (copy from `.env.example` if available).
    ```env
    VITE_API_BASE_URL=http://localhost:3000/api
    ```

### Running Locally

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`.

## 🏗️ Build & Deploy

To create a production build:

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

To preview the production build locally:

```bash
npm run preview
```

## 📁 Project Structure

```
src/
├── assets/          # Static assets (images, fonts, JSONs)
├── components/      # Reusable UI components
├── features/        # Feature-specific components and pages
│   ├── auth/        # Authentication pages (Login, Signup)
│   ├── dashboard/   # Dashboard layout and widgets
│   ├── network/     # Network management (NodesPage)
│   ├── profile/     # User profile implementation
│   └── search/      # Search functionality
├── services/        # API services types (relationshipService, profileService)
├── styles/          # Global styles and variables
└── types/           # Shared TypeScript interfaces
```

## 🤝 Contributing

1.  Fork the repository.
2.  Create a feature branch (`git checkout -b feature/amazing-feature`).
3.  Commit your changes (`git commit -m 'Add some amazing feature'`).
4.  Push to the branch (`git push origin feature/amazing-feature`).
5.  Open a Pull Request.

## 📄 License

[License Name] - see the [LICENSE](LICENSE) file for details.
