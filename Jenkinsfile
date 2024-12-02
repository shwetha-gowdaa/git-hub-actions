pipeline {
    agent any

    environment {
        APP_PORT = '3000'
        DOCKER_IMAGE_NAME = 'nodejs-app'
        REPO_URL = 'https://github.com/shwetha-gowdaa/git-hub-actions.git'
        SWARM_STACK_NAME = 'myapp'  // Docker Swarm Stack name
        DOCKER_HUB_REPO = 'shwethagowda16'  // Replace with your Docker Hub username
    }

    stages {
        stage('Clone Repository') {
            steps {
                script {
                    echo "Cloning repository from ${env.REPO_URL}"
                    retry(3) {
                        git branch: 'main', url: env.REPO_URL
                    }
                    sh 'git status'
                }
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
                        echo "Docker is already installed."
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
                sudo chmod 660 /var/run/docker.sock
                '''
            }
        }

        stage('Verify Docker Access') {
            steps {
                echo "Verifying Docker access..."
                sh 'docker ps || true'
            }
        }

        stage('Build Docker Image') {
            steps {
                echo "Building Docker image..."
                sh '''
                docker build -t $DOCKER_IMAGE_NAME .  // Build the image
                '''
            }
        }

        stage('Login to Docker Hub') {
            steps {
                echo "Logging in to Docker Hub..."
                script {
                    withCredentials([usernamePassword(credentialsId: 'docker-hub', usernameVariable: 'DOCKER_USERNAME', passwordVariable: 'DOCKER_PASSWORD')]) {
                        sh 'docker login -u $DOCKER_USERNAME -p $DOCKER_PASSWORD'
                    }
                }
            }
        }

        stage('Tag Docker Image for Docker Hub') {
            steps {
                echo "Tagging Docker image for Docker Hub..."
                sh '''
                docker tag $DOCKER_IMAGE_NAME $DOCKER_HUB_REPO/$DOCKER_IMAGE_NAME:latest
                '''
            }
        }

        stage('Push Docker Image to Docker Hub') {
            steps {
                echo "Pushing Docker image to Docker Hub..."
                sh '''
                docker push $DOCKER_HUB_REPO/$DOCKER_IMAGE_NAME:latest
                '''
            }
        }

        stage('Deploy to Docker Swarm') {
            steps {
                echo "Deploying to Docker Swarm..."
                script {
                    // Deploy to Swarm, using the built image
                    sh '''
                    docker stack deploy -c docker-compose.yml $SWARM_STACK_NAME
                    '''
                }
            }
        }

        stage('Check Service Status') {
            steps {
                echo "Checking Docker Swarm service status..."
                sh 'docker service ls'
                sh 'docker stack ps $SWARM_STACK_NAME' // More detailed status check
            }
        }
    }

    post {
        always {
            echo "Pipeline execution completed."
        }
        failure {
            echo "Pipeline failed. Check the logs."
        }
        success {
            echo "Pipeline executed successfully!"
        }
    }
}
