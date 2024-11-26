pipeline {
    agent any

    environment {
        APP_PORT = '3000'
        DOCKER_IMAGE_NAME = 'nodejs-app'
        REPO_URL = 'https://github.com/shwetha-gowdaa/git-hub-actions.git'
        APP_PATH = '/home/ubuntu/node-app'
    }

    stages {
        stage('Clone Repository') {
            steps {
                git branch: 'main', url: env.REPO_URL
            }
        }

        stage('Install Docker') {
            steps {
                sh '''
                # Check if Docker is installed
                if ! command -v docker &> /dev/null; then
                  echo "Installing Docker..."
                  sudo apt update
                  sudo apt install -y docker.io
                  sudo systemctl start docker
                  sudo systemctl enable docker
                  sudo usermod -aG docker ubuntu || true
                  sudo usermod -aG docker jenkins || true
                else
                  echo "Docker already installed."
                fi
                '''
            }
        }

        stage('Build Docker Image') {
            steps {
                sh '''
                echo "Building Docker image..."
                docker build -t $DOCKER_IMAGE_NAME .
                '''
            }
        }

        stage('Run Application') {
            steps {
                sh '''
                echo "Stopping existing container..."
                docker stop $DOCKER_IMAGE_NAME || true
                docker rm $DOCKER_IMAGE_NAME || true

                echo "Running application on port $APP_PORT..."
                docker run -d --name $DOCKER_IMAGE_NAME -p $APP_PORT:$APP_PORT $DOCKER_IMAGE_NAME
                '''
            }
        }
    }

    post {
        always {
            echo "Pipeline execution completed."
        }
    }
}
