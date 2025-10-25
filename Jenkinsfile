pipeline {
    agent any

    environment {
        IMAGE_NAME = 'abdieeuh/praktikum_modul3_reactnative'
        CONTAINER_NAME = 'praktikum_modul3_reactnative'
    }

    stages {
        stage('Checkout') {
            steps {
                echo '📦 Checkout code...'
                checkout scm
            }
        }

        stage('Cleanup') {
            steps {
                echo '🧹 Cleanup...'
                sh '''
                    # Stop containers
                    docker compose down || true
                    docker rm -f ${CONTAINER_NAME} || true
                    
                    # Prune untuk clear cache
                    docker system prune -f
                    docker builder prune -f
                '''
            }
        }

        stage('Build & Deploy') {
            steps {
                echo '🚀 Build dan Deploy dengan Docker Compose...'
                sh '''
                    # Build dengan retry mechanism
                    MAX_RETRIES=3
                    RETRY_COUNT=0
                    
                    while [ $RETRY_COUNT -lt $MAX_RETRIES ]; do
                        echo "Attempt $((RETRY_COUNT + 1)) of $MAX_RETRIES"
                        
                        if docker compose up -d --build; then
                            echo "✅ Build successful!"
                            break
                        else
                            RETRY_COUNT=$((RETRY_COUNT + 1))
                            if [ $RETRY_COUNT -lt $MAX_RETRIES ]; then
                                echo "⚠️ Build failed, cleaning and retrying..."
                                docker compose down
                                docker system prune -f
                                sleep 5
                            else
                                echo "❌ Build failed after $MAX_RETRIES attempts"
                                exit 1
                            fi
                        fi
                    done
                    
                    # Tunggu container siap
                    sleep 10
                    
                    # Check status
                    docker ps | grep ${CONTAINER_NAME}
                '''
            }
        }

        stage('Verify') {
            steps {
                echo '✅ Verifikasi deployment...'
                sh '''
                    echo "Container Status:"
                    docker ps | grep ${CONTAINER_NAME}
                    
                    echo ""
                    echo "Container Logs:"
                    docker logs --tail 20 ${CONTAINER_NAME}
                '''
            }
        }
    }

    post {
        success {
            echo '''
╔═══════════════════════════════════════╗
║      ✅ DEPLOYMENT BERHASIL! ✅       ║
╠═══════════════════════════════════════╣
║                                       ║
║  🌐 Akses Aplikasi:                  ║
║     http://localhost:8081            ║
║     http://localhost:19000           ║
║     http://localhost:19006           ║
║                                       ║
║  📱 Scan QR di localhost:19000       ║
║     dengan Expo Go app               ║
║                                       ║
╚═══════════════════════════════════════╝
'''
        }
        failure {
            echo '''
╔═══════════════════════════════════════╗
║         ❌ DEPLOYMENT GAGAL ❌        ║
╠═══════════════════════════════════════╣
║                                       ║
║  Cek logs:                           ║
║  docker logs praktikum_modul3_reactnative
║                                       ║
║  Manual test:                        ║
║  docker compose up                   ║
║                                       ║
╚═══════════════════════════════════════╝
'''
        }
        always {
            echo '🏁 Pipeline selesai'
        }
    }
}