pipeline {
    agent {
        docker {
            image 'node:18-bullseye'
            args '-u root:root --privileged -v /usr/local/bin/docker:/usr/local/bin/docker -v /var/run/docker.sock:/var/run/docker.sock'
        }
    }

    environment {
        IMAGE_NAME = 'abdieeuh/praktikum_modul3_reactnative'
        REGISTRY = 'https://index.docker.io/v1/'
        REGISTRY_CREDENTIALS = 'dockerhub-credentials'
        CONTAINER_NAME = 'praktikum_modul3_reactnative'
        PATH = "/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin"
        DOCKER_HOST = "unix:///var/run/docker.sock"
    }

    stages {
        stage('Checkout') {
            steps {
                echo '📦 Melakukan checkout dari SCM...'
                checkout scm
            }
        }

        stage('Verify Docker Access') {
            steps {
                sh '''
                    echo "🔍 Mengecek akses Docker dari dalam container agent..."
                    docker info > /dev/null 2>&1 && echo "✅ Docker dapat diakses" || (echo "❌ Docker tidak bisa diakses"; exit 1)
                '''
            }
        }

        stage('Build Node Project') {
            steps {
                echo '🛠️ Menginstal dependencies project...'
                sh '''
                    npm install --legacy-peer-deps
                    echo "✅ Build Node Project selesai"
                '''
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    echo '🐳 Membangun Docker image dari Dockerfile...'
                    sh '''
                        echo "📂 Current directory: $(pwd)"
                        ls -la
                    '''
                    sh "docker build -t ${IMAGE_NAME}:${BUILD_NUMBER} ."
                    echo "✅ Image berhasil dibuat: ${IMAGE_NAME}:${BUILD_NUMBER}"
                }
            }
        }

        stage('Push Docker Image') {
            steps {
                script {
                    echo '📤 Push image ke Docker Hub...'
                    docker.withRegistry(REGISTRY, REGISTRY_CREDENTIALS) {
                        docker.image("${IMAGE_NAME}:${BUILD_NUMBER}").push()
                        docker.image("${IMAGE_NAME}:${BUILD_NUMBER}").push('latest')
                    }
                }
            }
        }

        stage('Deploy with Docker Compose') {
            steps {
                script {
                    echo '🚀 Deploy aplikasi dengan Docker Compose...'
                    sh '''
                        if command -v docker compose &> /dev/null; then
                            docker compose down || true
                            docker compose up -d --build
                        else
                            docker-compose down || true
                            docker-compose up -d --build
                        fi
                        echo "✅ Container berjalan di port 8081, 19000, dan 19006"
                    '''
                }
            }
        }

        stage('Verify Container') {
            steps {
                sh '''
                    echo "🔍 Mengecek container yang berjalan..."
                    docker ps | grep praktikum_modul3_reactnative || echo "⚠️ Container tidak ditemukan!"
                '''
            }
        }
    }

    post {
        success {
            echo """
🎉 Pipeline selesai dengan sukses!
🌐 Akses app di: http://localhost:8081
📱 Scan QR code via Expo Go untuk testing mobile app
"""
        }
        failure {
            echo "❌ Build gagal, silakan periksa log di Jenkins."
        }
        always {
            echo '🏁 Pipeline selesai dijalankan.'
        }
    }
}
