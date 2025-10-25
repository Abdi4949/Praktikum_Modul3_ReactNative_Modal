pipeline {
    agent {
        docker {
            image 'node:18-bullseye'    // sama seperti di Dockerfile
            args '-u root:root'         // agar punya izin install & akses docker.sock
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
                    sh """
                        echo "📂 Current directory: $(pwd)"
                        ls -la
                        docker build -t ${IMAGE_NAME}:${env.BUILD_NUMBER} .
                    """
                    echo "✅ Image berhasil dibuat: ${IMAGE_NAME}:${env.BUILD_NUMBER}"
                }
            }
        }


        stage('Push Docker Image') {
            steps {
                script {
                    echo '📤 Push image ke Docker Hub...'
                    docker.withRegistry(REGISTRY, REGISTRY_CREDENTIALS) {
                        docker.image("${IMAGE_NAME}:${env.BUILD_NUMBER}").push()
                        docker.image("${IMAGE_NAME}:${env.BUILD_NUMBER}").push('latest')
                    }
                }
            }
        }

        stage('Deploy with Docker Compose') {
            steps {
                script {
                    echo '🚀 Deploy aplikasi dengan docker-compose...'
                    sh '''
                        docker compose down || true
                        docker compose up -d --build
                        echo "✅ Container berjalan di port 8081, 19000, dan 19006"
                    '''
                }
            }
        }

        stage('Verify Container') {
            steps {
                sh '''
                    echo "🔍 Mengecek container yang berjalan..."
                    docker ps | grep $CONTAINER_NAME || echo "⚠️ Container tidak ditemukan!"
                '''
            }
        }
    }

    post {
        success {
            echo """
🎉 Pipeline selesai dengan sukses!
🌐 Akses app di http://localhost:8081
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
