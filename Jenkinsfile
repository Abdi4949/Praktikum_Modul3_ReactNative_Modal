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

        stage('Stop Old Container') {
            steps {
                echo '🛑 Stop container lama...'
                sh '''
                    docker compose down || true
                    docker rm -f ${CONTAINER_NAME} || true
                '''
            }
        }

        stage('Build & Deploy') {
            steps {
                echo '🚀 Build dan Deploy dengan Docker Compose...'
                sh '''
                    # Build dan jalankan
                    docker compose up -d --build
                    
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