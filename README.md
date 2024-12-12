# Linkly Documentation

## Part 1: Installation Guide

### Environment Setup Requirements

#### Prerequisites
- **Install Docker and Docker Compose**
- **Install Git**

#### Minimum Configuration Requirements
- **Available RAM:** 8GB
- **CPU:** 2.5 GHz

### Steps to Set Up the Environment

#### Step 1: Clone the Repository
Run the following command in your terminal:
```bash
git clone https://github.com/Z2426/Linkly
```

#### Step 2: Create the `.env` File
- Create a `.env` file.
- Populate it with the environment variables from the provided `env.BE` configuration file at the specified link.
#### Step 3: Navigate to the Services Directory
```bash
cd Linkly/services
```
#### Step 4: Build and Start Services
Run the following command:
```bash
docker-compose up --build
```

#### Step 5: Navigate Back to the Root Directory
```bash
cd ..
```

#### Step 6: Navigate to the Client Directory
```bash
cd client
```

#### Step 7: Create the `.env` File for the Client
- Create a `.env` file in the `client` directory.
- Populate it with the environment variables from the provided `env.FE` configuration file at the specified link.

#### Step 8: Install Dependencies
Run the following command:
```bash
npm i --legacy-peer-deps
```

#### Step 9: Start the Application
Run the following command:
```bash
npm start
```

#### Step 10: Access the Application
Open a browser and navigate to:
```
http://localhost:3000
```
You should now have access to the application.

---

## Part 2: Features Overview

### Implemented Features

1. **Friend Recommendation System**
   - Suggests friends by comparing faces in uploaded photos with faces already in the system.

2. **Content Moderation System**
   - Automatically moderates content using Wit.ai to detect sensitive words.

3. **User Search**
   - Allows searching for users based on personal information such as name, age, hometown, and interests using Wit.ai for natural language processing.

4. **Link Safety Check**
   - Verifies the safety of links before accessing them using VirusTotal and previews link content.

5. **Personalized News Feed**
   - Tailors the user’s feed by learning user behavior and predicting relevant posts.

6. **Content Creation Support**
   - Enables image and text content creation through commands.

7. **Admin Tools**
   - Integrates dashboards for data visualization, user management, report handling for violating posts, and account locking.

8. **Basic User Features**
   - Supports essential functionalities such as messaging, profile management, news feed browsing, post management, and friend management.

9. **Cloudinary Integration**
   - Utilizes Cloudinary to store images and videos.
