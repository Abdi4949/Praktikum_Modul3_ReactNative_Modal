pipeline {
    agent any  // Ubah dari docker agent ke any

    environment {
        IMAGE_NAME = 'abdieeuh/praktikum_modul3_reactnative'
        REGISTRY = 'https://index.docker.io/v1/'
        REGISTRY_CREDENTIALS = 'dockerhub-credentials'
        CONTAINER_NAME = 'praktikum_modul3_reactnative'
    }

    stages {
        stage('Checkout') {
            steps {
                echo '📦 Melakukan checkout dari SCM...'
                checkout scm
            }
        }

        stage('Check Docker') {
            steps {
                script {
                    echo '🔍 Mengecek Docker installation...'
                    sh '''
                        echo "Docker version:"
                        docker --version
                        echo "Docker info:"
                        docker info || true
                        echo "Current user: $(whoami)"
                        echo "Docker socket permissions:"
                        ls -la /var/run/docker.sock
                    '''
                }
            }
        }

        stage('Install Node Dependencies') {
            agent {
                docker {
                    image 'node:18-bullseye'
                    args '-u root:root'
                    reuseNode true  // Gunakan workspace yang sama
                }
            }
            steps {
                echo '🛠️ Menginstal dependencies project...'
                sh '''
                    npm install --legacy-peer-deps
                    echo "✅ Dependencies terinstall"
                '''
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    echo '🐳 Membangun Docker image dari Dockerfile...'
                    sh '''
                        echo "📂 Current directory: $(pwd)"
                        echo "📋 Files:"
                        ls -la
                        echo "🔨 Building image..."
                    '''
                    
                    // Build dengan error handling
                    sh """
                        docker build -t ${IMAGE_NAME}:${BUILD_NUMBER} . || {
                            echo "❌ Docker build failed"
                            exit 1
                        }
                    """
                    
                    // Tag sebagai latest
                    sh "docker tag ${IMAGE_NAME}:${BUILD_NUMBER} ${IMAGE_NAME}:latest"
                    
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
                    echo '✅ Push berhasil!'
                }
            }
        }

        stage('Stop Old Container') {
            steps {
                script {
                    echo '🛑 Menghentikan container lama jika ada...'
                    sh '''
                        docker stop ${CONTAINER_NAME} || true
                        docker rm ${CONTAINER_NAME} || true
                        echo "✅ Container lama dihapus"
                    '''
                }
            }
        }

        stage('Deploy with Docker Compose') {
            steps {
                script {
                    echo '🚀 Deploy aplikasi dengan Docker Compose...'
                    sh '''
                        # Check docker compose command
                        if command -v docker compose &> /dev/null; then
                            COMPOSE_CMD="docker compose"
                        elif command -v docker-compose &> /dev/null; then
                            COMPOSE_CMD="docker-compose"
                        else
                            echo "❌ Docker Compose tidak ditemukan!"
                            exit 1
                        fi
                        
                        echo "📋 Using: $COMPOSE_CMD"
                        
                        # Stop existing containers
                        $COMPOSE_CMD down || true
                        
                        # Start new containers
                        $COMPOSE_CMD up -d --build
                        
                        echo "✅ Container berjalan di:"
                        echo "   - Metro Bundler: http://localhost:8081"
                        echo "   - Expo DevTools: http://localhost:19000"
                        echo "   - Web: http://localhost:19006"
                    '''
                }
            }
        }

        stage('Verify Container') {
            steps {
                script {
                    echo '🔍 Mengecek container yang berjalan...'
                    sh '''
                        sleep 5
                        echo "📊 Container status:"
                        docker ps -a | grep ${CONTAINER_NAME}
                        
                        echo ""
                        echo "📝 Container logs (last 20 lines):"
                        docker logs --tail 20 ${CONTAINER_NAME}
                        
                        # Check if container is running
                        if docker ps | grep -q ${CONTAINER_NAME}; then
                            echo "✅ Container berjalan dengan baik!"
                        else
                            echo "⚠️ Container tidak berjalan!"
                            exit 1
                        fi
                    '''
                }
            }
        }
    }

    post {
        success {
            echo """
╔════════════════════════════════════════════════════════╗
║        🎉 PIPELINE BERHASIL DIJALANKAN! 🎉            ║
╠════════════════════════════════════════════════════════╣
║                                                        ║
║  🌐 Akses aplikasi:                                   ║
║     • Metro Bundler: http://localhost:8081            ║
║     • Expo DevTools: http://localhost:19000           ║
║     • Web Version:   http://localhost:19006           ║
║                                                        ║
║  📱 Mobile Testing:                                    ║
║     1. Install Expo Go di smartphone                  ║
║     2. Scan QR code di http://localhost:19000         ║
║                                                        ║
║  🐳 Docker Image: ${IMAGE_NAME}:${BUILD_NUMBER}       ║
║                                                        ║
╚════════════════════════════════════════════════════════╝
"""
        }
        failure {
            echo """
╔════════════════════════════════════════════════════════╗
║           ❌ BUILD GAGAL ❌                            ║
╠════════════════════════════════════════════════════════╣
║                                                        ║
║  Silakan periksa:                                     ║
║  1. Log Jenkins untuk detail error                    ║
║  2. Docker daemon status                              ║
║  3. Permissions untuk Docker socket                   ║
║  4. Dockerfile syntax                                 ║
║                                                        ║
╚════════════════════════════════════════════════════════╝
"""
        }
        always {
            echo '🏁 Pipeline selesai dijalankan.'
            // Cleanup jika diperlukan
            sh 'docker system prune -f || true'
        }
    }
}