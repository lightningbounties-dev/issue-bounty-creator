# Lightning Bounties - Automatic GitHub Issue Generator

<!-- You can replace this with a real screenshot URL later -->

This web application leverages the power of the Google Gemini AI to analyze public GitHub repositories and automatically generate actionable, well-structured issues for improvement. It's designed to help project maintainers and contributors quickly identify areas for enhancement, from refactoring and feature additions to addressing `TODO` comments left in the code.

## ✨ Features

* **🤖 AI-Powered Analysis:** Uses the Gemini API to intelligently scan a repository's structure and purpose to suggest meaningful improvements.
* **📝 Structured Issue Generation:** Creates detailed issue descriptions with "Problem," "Proposed Solution," and "Required Technologies" sections.
* **⚙️ Advanced Customization:** Allows users to provide specific project goals to tailor the AI's suggestions to their needs.
* **✅ TODO Scanning:** Includes an option to find `// TODO:` comments in the codebase and convert them into formal issues.
* **🔗 Direct GitHub Integration:** Provides a one-click button to open a pre-filled "New Issue" form on the target GitHub repository.
* **💅 Clean & Responsive UI:** A modern and easy-to-use interface built with Tailwind CSS.

## 🚀 How It Works

1.  **Enter URL:** Paste the URL of a public GitHub repository you want to analyze.
2.  **Customize (Optional):** Click "Advanced Settings" to add specific project goals or enable the "Scan for TODOs" option.
3.  **Analyze:** Click the "Analyze Repository" button and wait for the AI to work its magic.
4.  **Review Suggestions:** The AI-generated issues will appear in a card-based layout, complete with tags, descriptions, and icons.
5.  **Create Issue:** Click the "Create GitHub Issue" button on any suggestion to be taken directly to a pre-populated issue form on GitHub.

## 🛠️ Setup for Local Development

This project is currently a single, self-contained `index.html` file, making it very easy to run locally.

### Prerequisites

* A modern web browser (Chrome, Firefox, Edge).
* A Google Gemini API Key. You can get one from [Google AI Studio](https://aistudio.google.com/app/apikey).

### Running the Application

1.  **Add Your API Key:**
    * Open the `index.html` file in a code editor.
    * Find the `<script>` tag at the bottom of the file.
    * Locate the following line and replace the placeholder with your actual Gemini API key:
        ```javascript
        const GEMINI_API_KEY = "YOUR_GEMINI_API_KEY_HERE"; 
        ```

2.  **Run with a Local Server:**
    * For the best experience and to avoid potential browser security issues, it's recommended to run this file using a local web server.
    * If you are using Visual Studio Code, a great option is the **[Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer)** extension.
    * After installing the extension, simply right-click the `index.html` file and choose "Open with Live Server".

## 💻 Technologies Used

* **HTML5**
* **Tailwind CSS** for styling.
* **JavaScript (ES6+)** for application logic.
* **Google Gemini API** for AI-powered analysis.
* **Marked.js** for rendering Markdown in the issue descriptions.

> **⚠️ Security Warning:** The Gemini API key is currently stored directly in the client-side JavaScript for demonstration purposes. **Do not deploy this to a public server in its current state.** For a production application, the API key must be moved to a secure backend environment (e.g., a serverless function or a Node.js server) to prevent it from being exposed.