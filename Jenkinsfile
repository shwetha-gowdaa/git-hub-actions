pipeline {
    agent any

    environment {
        APP_PORT = '3000'
        DOCKER_IMAGE_NAME = 'nodejs-app'
        REPO_URL = 'https://github.com/shwetha-gowdaa/git-hub-actions.git'
    }

    stages {
        stage('Clone Repository') {
            steps {
                git branch: 'main', url: env.REPO_URL
            }
        }

        stage('Check Docker Installation') {
            steps {
                script {
                    def dockerInstalled = sh(script: 'command -v docker', returnStatus: true) == 0
                    if (!dockerInstalled) {
                        echo "Docker is not installed. Installing Docker..."
                        sh '''
                        sudo apt update
                        sudo apt install -y docker.io
                        sudo systemctl start docker
                        sudo systemctl enable docker
                        '''
                    } else {
                        echo "Docker is already installed in server."
                    }
                }
            }
        }

        stage('Ensure Docker Permissions') {
            steps {
                echo "Ensuring Docker permissions for Jenkins user..."
                sh '''
                sudo usermod -aG docker $(whoami) || true
                sudo usermod -aG docker jenkins || true
                sudo chown root:docker /var/run/docker.sock
                sudo chmod 666 /var/run/docker.sock
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

        stage('Stop Old Container and Run New Application') {
            steps {
                sh '''
                echo "Stopping any existing containers..."
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
