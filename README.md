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

2. **Install backend dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../client
   npm install
   ```

4. **Set up environment variables**
   
   Create a `.env` file in the `server` folder with the following:
   ```
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   ```

5. **Run the backend**
   ```bash
   cd server
   npm run dev
   ```

6. **Run the frontend**
   ```bash
   cd client
   npm run dev
   ```

7. **Access the app**
   
   Open your browser and navigate to `http://localhost:5173` (or the port shown in your terminal)

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
├── client/           # React frontend
│   ├── src/
│   ├── public/
│   └── package.json
├── server/           # Node.js/Express backend
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   └── package.json
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
