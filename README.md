
# CA Planner v4

## Overview 🚀

A full-stack, responsive to-do and planning application built as part of a learning project. This application helps users organize tasks, schedule deadlines, and manage personal or professional workflows.

## Features ✨

- **Task Management:** Create, read, update, and delete tasks.
- **Filtering:** Filter tasks by status (complete, incomplete) or due date.
- **Custom Styling:** Designed with **Tailwind CSS** for a utility-first, responsive interface.
- **State Management:** (Optional: Add your state management library here, e.g., Uses React Context for state management.)

## Tech Stack 🛠️

- **Frontend:** React (or your framework)
- **Styling:** Tailwind CSS
- **Package Manager:** npm

## Getting Started (Local Development) 💻

To run this project locally, follow these steps:

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/mdakilansari/Planner-v4.git](https://github.com/mdakilansari/Planner-v4.git)
    cd Planner-v4
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Run the application:**
    ```bash
    npm start
    ```
    The application will typically open at `http://localhost:3000`.

## Deployment

This application is automatically deployed to GitHub Pages using GitHub Actions whenever changes are pushed to the `main` branch.

**Live Demo:** [https://mdakilansari.github.io/Planner-v4/](https://mdakilansari.github.io/Planner-v4/)

---

## Final Step: Commit and Push

1.  Make all the file changes above (`package.json`, `.github/workflows/deploy.yml`, `README.md`).
2.  Commit the changes:

    ```bash
    git add .
    git commit -m "feat: Add GitHub Pages deployment configuration and README"
    git push origin main
    ```

After pushing, go to the **"Actions"** tab in your GitHub repository. You should see the `Deploy to GitHub Pages` workflow running. Once it completes, you must do one final setup step on GitHub:

### Final Configuration on GitHub

1.  Navigate to your repository on GitHub.
2.  Click on the **`Settings`** tab.
3.  In the left sidebar, click **`Pages`**.
4.  Under "Build and deployment":
    * Set **Source** to **`Deploy from a branch`**.
    * Set **Branch** to **`gh-pages`** and the folder to **`/ (root)`**.
5.  Click **`Save`**.

Your application should now be live at the URL specified in your `package.json`!
