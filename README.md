# 🧩 Puzzlify

**Turn any image into an interactive puzzle game**

Puzzlify is a web-based puzzle maker that transforms your images into playable sliding puzzles. Upload any image, choose your difficulty level, and challenge yourself or share the puzzle with friends. Complete the puzzle to reveal the full image!

---

## ✨ Features

- **Custom Image Puzzles** – Upload any image and instantly create a puzzle
- **Multiple Difficulty Levels** – Choose from 3×3 up to 6×6 grid sizes
- **Solo & Multiplayer** – Play puzzles yourself or generate shareable links
- **Completion Reveal** – See the full image once you've solved the puzzle
- **Responsive Design** – Play on desktop, tablet, or mobile

---

## 🛠️ Tech Stack

**Frontend:**
- React
- Tailwind CSS

**Backend:**
- Node.js
- Express

**Database:**
- MongoDB (Mongoose)


---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:
- Node.js (v14 or higher)
- npm or yarn
- MongoDB (local or cloud instance)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/puzzlify.git
   cd puzzlify
   ```

2. **Install all dependencies**
   ```bash
   npm run install:all
   ```
   
   Or install individually:
   ```bash
   npm install              # Root dependencies
   cd client && npm install # Client dependencies
   cd ../server && npm install # Server dependencies
   ```

3. **Set up environment variables**
   
   **Server:** Create a `.env` file in the `server` folder:
   ```env
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://127.0.0.1:27017/puzzlify
   CORS_ORIGIN=*
   MAX_FILE_SIZE_MB=5
   ```
   
   **Client:** Create a `.env` file in the `client` folder (optional):
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```
   
   See `server/.env.example` and `client/.env.example` for reference.

4. **Run the application**
   
   **Option 1: Run both client and server together (recommended)**
   ```bash
   npm run dev
   ```
   
   **Option 2: Run separately**
   ```bash
   # Terminal 1 - Backend
   npm run dev:server
   
   # Terminal 2 - Frontend
   npm run dev:client
   ```

5. **Access the app**
   
   - Frontend: `http://localhost:5173` (or the port shown in your terminal)
   - Backend API: `http://localhost:5000/api`
   - Health Check: `http://localhost:5000/api/health`

---

## 📖 Usage

1. **Upload an Image** – Click the upload button and select an image from your device
2. **Choose Difficulty** – Select a grid size (3×3, 4×4, 5×5, or 6×6)
3. **Play or Share** – Solve the puzzle yourself or copy the shareable link
4. **Complete & Reveal** – Finish the puzzle to see the full image

---

## 📁 Folder Structure

```
puzzlify/
├── client/                    # React Frontend
│   ├── src/
│   │   ├── components/       # Shared UI components
│   │   ├── features/          # Feature-based modules
│   │   │   ├── create/        # Puzzle creation feature
│   │   │   └── game/          # Game play feature
│   │   ├── pages/             # Route pages
│   │   ├── services/          # API service layer
│   │   ├── hooks/             # Shared React hooks
│   │   ├── types/             # Client-specific types
│   │   ├── utils/             # Client utilities
│   │   └── constants/         # Client constants
│   ├── public/
│   └── package.json
│
├── server/                    # Express Backend
│   ├── src/
│   │   ├── config/            # Configuration files
│   │   │   ├── database.ts    # DB connection
│   │   │   ├── cors.ts        # CORS config
│   │   │   └── env.ts         # Environment validation
│   │   ├── controllers/       # Request handlers
│   │   ├── middleware/        # Express middleware
│   │   │   ├── errorHandler.ts
│   │   │   ├── validation.ts
│   │   │   └── upload.ts
│   │   ├── models/            # Database models
│   │   ├── routes/            # API routes
│   │   ├── app.ts             # Express app config
│   │   └── server.ts          # Server entry point
│   └── package.json
│
├── shared/                     # Shared Code
│   ├── types/                 # Shared TypeScript types
│   ├── constants/             # Shared constants
│   └── package.json
│
├── package.json               # Root workspace config
├── .gitignore
└── README.md
```

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- Thanks to all contributors who help improve Puzzlify
- Built using React and Node.js

---

## 📧 Contact

Have questions or suggestions? Feel free to open an issue or reach out!


---

Made with 🧩 by [Your Name]
