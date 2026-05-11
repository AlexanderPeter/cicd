pipeline {
    agent any

    options {
        disableConcurrentBuilds()
        timeout(time: 10, unit: 'MINUTES')
    }

    environment {
        PROJECT_NAME       = "cicd"
        TARGET_DIR         = "/var/jenkins_home/projects/${PROJECT_NAME}/${BRANCH_NAME}"
        SONAR_SCANNER_OPTS = "-Xmx512m"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build Frontend') {
            steps {
                dir('frontend') {
                    sh '''
		                npm ci
				        GENERATE_SOURCEMAP=false \
        		        NODE_OPTIONS="--max-old-space-size=1024" \
        		        PUBLIC_URL=/projects/${PROJECT_NAME}/${BRANCH_NAME} \
            		    REACT_APP_API_BASE=/api/${PROJECT_NAME}/${BRANCH_NAME}/api \
            		    npm run build
                    '''
                }
            }
        }
		
        stage('Deploy Frontend') {
            steps {
                sh '''
                    echo "Deploying frontend to $TARGET_DIR"

                    mkdir -p "$TARGET_DIR"
                    rm -rf "$TARGET_DIR"/*

                    cp -r frontend/build/* "$TARGET_DIR"/
                '''
            }
        }
    }

    post {
        always {
            cleanWs()
        }
    }
}
