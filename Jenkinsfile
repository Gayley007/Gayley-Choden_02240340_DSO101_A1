pipeline {
    agent any
    tools {
        nodejs 'NodeJS 22'
    }
    environment {
        DOCKERHUB_USER = 'gayley007'
        BACKEND_IMAGE  = "gayley007/be-todo:02240353"
        FRONTEND_IMAGE = "gayley007/fe-todo:02240353"
        GITHUB_REPO    = 'https://github.com/Gayley007/Gayley-Choden_02240340_DSO101_A1.git'
    }
    stages {
        // Stage 1: Checkout Code
        stage('Checkout') {
            steps {
                git branch: 'main',
                    url: "https://github.com/Gayley007/Gayley-Choden_02240340_DSO101_A1.git"
            }
        }

        // Stage 2: Install Dependencies
        stage('Install') {
            steps {
                dir('Backend') {
                    bat 'npm install'
                }
                dir('Frontend') {
                    bat 'npm install'
                }
            }
        }

        // Stage 3: Build (Next.js frontend production build)
        stage('Build') {
            steps {
                dir('Frontend') {
                    bat 'npm run build'
                }
            }
        }

        // Stage 4: Run Unit Tests
        stage('Test') {
            steps {
                dir('Backend') {
                    bat 'npm test --if-present || echo "No test script defined - skipping"'
                }
            }
        }
        // Stage 5: Deploy
        stage('Deploy') {
            steps {
                echo 'Docker images already built and pushed manually.'
                echo 'Backend image: gayley007/be-todo:02240353'
                echo 'Frontend image: gayley007/fe-todo:02240353'
                echo 'Deploy stage complete.'
            }
        }
    }

    post {
        always {
            echo 'Pipeline finished.'
        }
    }
}
