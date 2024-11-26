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
                echo "Checking Docker installation..."
                if ! command -v docker &> /dev/null; then
                  echo "Installing Docker..."
                  sudo apt update
                  sudo apt install -y docker.io
                  sudo systemctl start docker
                  sudo systemctl enable docker
                  sudo usermod -aG docker jenkins
                  sudo usermod -aG docker ubuntu
                  echo "Docker installed successfully."
                else
                  echo "Docker is already installed."
                fi

                echo "Ensuring correct permissions for Docker socket..."
                sudo chown root:docker /var/run/docker.sock
                sudo chmod 660 /var/run/docker.sock
                '''
            }
        }

        stage('Build Docker Image') {
            steps {
                sh '''
                echo "Building Docker image..."
                # Ensure Buildx is installed
                if ! docker buildx version &> /dev/null; then
                  echo "Installing Buildx..."
                  docker buildx install || true
                fi
                docker build -t $DOCKER_IMAGE_NAME .
                '''
            }
        }

        stage('Run Application') {
            steps {
                sh '''
                echo "Stopping existing container if running..."
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
        failure {
            echo "Pipeline failed. Check the logs for details."
        }
        success {
            echo "Pipeline executed successfully!"
        }
    }
}
