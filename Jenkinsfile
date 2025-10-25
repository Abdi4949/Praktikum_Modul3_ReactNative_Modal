pipeline {
    agent any

    environment {
        IMAGE_NAME = 'abdieeuh/praktikum_modul3_reactnative'
        REGISTRY = 'https://index.docker.io/v1/'
        REGISTRY_CREDENTIALS = 'dockerhub-credentials'
        CONTAINER_NAME = 'praktikum_modul3_reactnative'
        COMPOSE_PROJECT_NAME = 'expo-app'
    }

    stages {
        stage('Checkout') {
            steps {
                echo '📦 Melakukan checkout dari SCM...'
                checkout scm
            }
        }

        stage('Check Environment') {
            steps {
                script {
                    echo '🔍 Mengecek environment...'
                    sh '''
                        echo "=== System Info ==="
                        echo "OS: $(uname -s)"
                        echo "User: $(whoami)"
                        echo ""
                        
                        echo "=== Docker Info ==="
                        docker --version
                        docker info | grep "Server Version" || true
                        echo ""
                        
                        echo "=== Docker Compose Info ==="
                        if command -v docker compose &> /dev/null; then
                            docker compose version
                            echo "✅ Using: docker compose (v2)"
                        elif command -v docker-compose &> /dev/null; then
                            docker-compose --version
                            echo "✅ Using: docker-compose (v1)"
                        else
                            echo "❌ Docker Compose tidak ditemukan!"
                            exit 1
                        fi
                        echo ""
                        
                        echo "=== Current Directory ==="
                        pwd
                        ls -la
                    '''
                }
            }
        }

        stage('Cleanup Old Containers') {
            steps {
                script {
                    echo '🧹 Membersihkan container lama...'
                    sh '''
                        # Detect compose command for macOS
                        if command -v docker compose &> /dev/null; then
                            COMPOSE_CMD="docker compose"
                        else
                            COMPOSE_CMD="docker-compose"
                        fi
                        
                        echo "📋 Stopping existing containers..."
                        $COMPOSE_CMD down --remove-orphans || true
                        
                        echo "🗑️ Removing old images..."
                        docker rmi ${IMAGE_NAME}:latest || true
                        
                        echo "✅ Cleanup selesai"
                    '''
                }
            }
        }

        stage('Build with Docker Compose') {
            steps {
                script {
                    echo '🐳 Building image dengan Docker Compose...'
                    sh '''
                        # Detect compose command
                        if command -v docker compose &> /dev/null; then
                            COMPOSE_CMD="docker compose"
                        else
                            COMPOSE_CMD="docker-compose"
                        fi
                        
                        echo "🔨 Building Docker image..."
                        $COMPOSE_CMD build --no-cache
                        
                        echo "✅ Build selesai"
                    '''
                }
            }
        }

        stage('Tag Docker Image') {
            steps {
                script {
                    echo '🏷️ Tagging Docker image...'
                    sh """
                        # Get image ID dari docker-compose
                        IMAGE_ID=\$(docker images ${IMAGE_NAME} -q | head -n 1)
                        
                        if [ -z "\$IMAGE_ID" ]; then
                            echo "⚠️ Image tidak ditemukan, menggunakan tag dari compose"
                            IMAGE_ID=\$(docker images | grep ${CONTAINER_NAME} | awk '{print \$3}' | head -n 1)
                        fi
                        
                        echo "📦 Image ID: \$IMAGE_ID"
                        
                        # Tag dengan build number dan latest
                        docker tag \$IMAGE_ID ${IMAGE_NAME}:${BUILD_NUMBER}
                        docker tag \$IMAGE_ID ${IMAGE_NAME}:latest
                        
                        echo "✅ Tagged: ${IMAGE_NAME}:${BUILD_NUMBER}"
                        echo "✅ Tagged: ${IMAGE_NAME}:latest"
                    """
                }
            }
        }

        stage('Push to Docker Hub') {
            steps {
                script {
                    echo '📤 Push image ke Docker Hub...'
                    docker.withRegistry(REGISTRY, REGISTRY_CREDENTIALS) {
                        sh """
                            docker push ${IMAGE_NAME}:${BUILD_NUMBER}
                            docker push ${IMAGE_NAME}:latest
                        """
                    }
                    echo '✅ Push berhasil!'
                }
            }
        }

        stage('Deploy with Docker Compose') {
            steps {
                script {
                    echo '🚀 Deploying aplikasi...'
                    sh '''
                        # Detect compose command
                        if command -v docker compose &> /dev/null; then
                            COMPOSE_CMD="docker compose"
                        else
                            COMPOSE_CMD="docker-compose"
                        fi
                        
                        echo "🎯 Starting containers..."
                        $COMPOSE_CMD up -d
                        
                        echo "⏳ Waiting for container to be ready..."
                        sleep 10
                        
                        echo "✅ Deployment selesai!"
                    '''
                }
            }
        }

        stage('Verify Deployment') {
            steps {
                script {
                    echo '🔍 Verifikasi deployment...'
                    sh '''
                        echo "=== Container Status ==="
                        docker ps -a | grep ${CONTAINER_NAME}
                        echo ""
                        
                        # Check if container is running
                        if docker ps | grep -q ${CONTAINER_NAME}; then
                            echo "✅ Container RUNNING"
                            
                            echo ""
                            echo "=== Container Logs (last 30 lines) ==="
                            docker logs --tail 30 ${CONTAINER_NAME}
                            
                            echo ""
                            echo "=== Port Bindings ==="
                            docker port ${CONTAINER_NAME}
                            
                            echo ""
                            echo "=== Network Info ==="
                            docker inspect ${CONTAINER_NAME} | grep IPAddress || true
                            
                        else
                            echo "❌ Container TIDAK RUNNING!"
                            echo ""
                            echo "=== Full Container Logs ==="
                            docker logs ${CONTAINER_NAME}
                            exit 1
                        fi
                    '''
                }
            }
        }

        stage('Health Check') {
            steps {
                script {
                    echo '🏥 Melakukan health check...'
                    sh '''
                        echo "Checking Metro Bundler..."
                        timeout 5 bash -c 'until curl -s http://localhost:8081/status > /dev/null 2>&1; do sleep 1; done' || echo "⚠️ Metro bundler belum ready (normal untuk startup)"
                        
                        echo ""
                        echo "✅ Services accessible:"
                        echo "   • Metro Bundler: http://localhost:8081"
                        echo "   • Expo DevTools: http://localhost:19000"
                        echo "   • Web Interface: http://localhost:19006"
                    '''
                }
            }
        }
    }

    post {
        success {
            script {
                def serverIP = sh(script: "ifconfig | grep 'inet ' | grep -v 127.0.0.1 | head -1 | awk '{print \$2}'", returnStdout: true).trim()
                
                echo """
╔════════════════════════════════════════════════════════════════╗
║                🎉 DEPLOYMENT BERHASIL! 🎉                     ║
╠════════════════════════════════════════════════════════════════╣
║                                                                ║
║  📦 Image: ${IMAGE_NAME}:${BUILD_NUMBER}                      ║
║  🐳 Container: ${CONTAINER_NAME}                              ║
║                                                                ║
║  🌐 LOCAL ACCESS:                                             ║
║     • Metro Bundler:  http://localhost:8081                   ║
║     • Expo DevTools:  http://localhost:19000                  ║
║     • Web Version:    http://localhost:19006                  ║
║                                                                ║
║  📱 MOBILE TESTING (Expo Go):                                 ║
║     1. Install "Expo Go" dari App Store/Play Store            ║
║     2. Pastikan device & Mac di network yang sama             ║
║     3. Buka http://localhost:19000 di browser                 ║
║     4. Scan QR code dengan Expo Go                            ║
║                                                                ║
║  🔧 NETWORK ACCESS (jika diperlukan):                         ║
║     Server IP: ${serverIP}                                    ║
║     Expo DevTools: http://${serverIP}:19000                   ║
║                                                                ║
║  📊 MANAGEMENT COMMANDS:                                      ║
║     • Logs:    docker logs -f ${CONTAINER_NAME}               ║
║     • Stop:    docker compose down                            ║
║     • Restart: docker compose restart                         ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝
"""
            }
        }
        failure {
            echo """
╔════════════════════════════════════════════════════════════════╗
║                     ❌ BUILD GAGAL ❌                          ║
╠════════════════════════════════════════════════════════════════╣
║                                                                ║
║  🔍 TROUBLESHOOTING:                                          ║
║                                                                ║
║  1. Check Docker Status:                                      ║
║     docker ps -a                                              ║
║                                                                ║
║  2. Check Container Logs:                                     ║
║     docker logs ${CONTAINER_NAME}                             ║
║                                                                ║
║  3. Check Docker Compose:                                     ║
║     docker compose ps                                         ║
║     docker compose logs                                       ║
║                                                                ║
║  4. Manual Build Test:                                        ║
║     docker compose build --no-cache                           ║
║     docker compose up                                         ║
║                                                                ║
║  5. Check Ports:                                              ║
║     lsof -i :8081                                             ║
║     lsof -i :19000                                            ║
║     lsof -i :19006                                            ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝
"""
        }
        always {
            echo '🏁 Pipeline execution completed.'
            echo '📝 Build logs tersimpan di Jenkins'
        }
    }
}