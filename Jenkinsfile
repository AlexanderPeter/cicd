def withDbCredentials(body) {
    withCredentials([
        usernamePassword(
            credentialsId: "alexander-peter-db-credentials",
            usernameVariable: "DB_USER",
            passwordVariable: "DB_PASSWORD"
        )
    ]) {
        body()
    }
}

pipeline {
    agent any

    options {
        disableConcurrentBuilds()
        timeout(time: 10, unit: "MINUTES")
    }

    environment {
        PROJECT_NAME       = "cicd"
        TARGET_DIR         = "/var/jenkins_home/projects/${PROJECT_NAME}/${BRANCH_NAME}"
        SONAR_SCANNER_OPTS = "-Xmx512m"
        BACKEND_CONTAINER  = "${PROJECT_NAME}_${BRANCH_NAME}_backend"
        DB_CONTAINER       = "${PROJECT_NAME}_${BRANCH_NAME}_db"
        DB_VOLUME          = "${PROJECT_NAME}_${BRANCH_NAME}_db_data"
        DB_NAME            = "appdb"
    }

    stages {
        stage("Checkout") {
            steps {
                checkout scm
            }
        }
        
        stage("Start Database") {
            steps {
                withDbCredentials {
                    sh """
                        echo "Starting DB with workspace $WORKSPACE"
                        
                        docker stop $DB_CONTAINER || true
                        docker rm $DB_CONTAINER || true

                        docker run -d \
                            --name $DB_CONTAINER \
                            --restart unless-stopped \
                            --network infra-net \
                            -e POSTGRES_USER=$DB_USER \
                            -e POSTGRES_PASSWORD=$DB_PASSWORD \
                            -e POSTGRES_DB=$DB_NAME \
                            -v $DB_VOLUME:/var/lib/postgresql/data \
                            -v $WORKSPACE/database:/docker-entrypoint-initdb.d \
                            postgres:17
                    """
                }
            }
        }
        
        stage("Initialize Database") {
            steps {
                withDbCredentials {
                    sh """
                        TABLE_EXISTS=\$(docker exec $DB_CONTAINER psql -U $DB_USER -d $DB_NAME -tAc "SELECT to_regclass('public.poll')")
                        if [ "\$TABLE_EXISTS" = "" ]; then
                            echo "Initializing schema..."
                            docker exec -i $DB_CONTAINER psql -U $DB_USER -d $DB_NAME < database/schema.sql
                        else
                            echo "Database already initialized."
                        fi
                    """
                }
            }
        }

        stage("Build Frontend") {
            steps {
                dir("frontend") {
                    sh """
                        npm ci
                        GENERATE_SOURCEMAP=false \
                        NODE_OPTIONS="--max-old-space-size=1024" \
                        PUBLIC_URL=/projects/${PROJECT_NAME}/${BRANCH_NAME} \
                        REACT_APP_API_BASE=/api/${PROJECT_NAME}/${BRANCH_NAME}/api \
                        npm run build
                    """
                }
            }
        }

        stage("SonarQube Analysis") {
            when {
                branch "develop"
            }
            steps {
                sh """
                    echo "Starting SonarQube analysis of $PROJECT_NAME"
                    echo "SONAR_SCANNER_OPTS=$SONAR_SCANNER_OPTS"
                    echo "NODE_OPTIONS=$NODE_OPTIONS"
                """
                script {
                    def scannerHome = tool "sonar-scanner"
                    withSonarQubeEnv("SonarQube") {
                        sh """
                        ${scannerHome}/bin/sonar-scanner \
                          -Dsonar.projectKey=${PROJECT_NAME} \
                          -Dsonar.branch.name=${BRANCH_NAME}
                        """
                    }
                }
            }
        }
        
        stage("Deploy Frontend") {
            when {
                anyOf {
                    branch "master"
                    branch "develop"
                }
            }
            steps {
                sh """
                    echo "Deploying frontend to $TARGET_DIR"

                    mkdir -p "$TARGET_DIR"
                    rm -rf "$TARGET_DIR"/*

                    cp -r frontend/build/* "$TARGET_DIR"/
                """
            }
        }

        
        stage("Deploy Backend") {
            when {
                anyOf {
                    branch "master"
                    branch "develop"
                }
            }
            steps {
                withDbCredentials {
                    sh """
                        docker build -t $BACKEND_CONTAINER backend/
                        
                        docker stop $BACKEND_CONTAINER || true
                        docker rm $BACKEND_CONTAINER || true

                        docker run -d \
                            --name $BACKEND_CONTAINER \
                            --restart unless-stopped \
                            --network infra-net \
                            -e DATABASE_URL="postgresql://$DB_USER:$DB_PASSWORD@$DB_CONTAINER:5432/$DB_NAME" \
                            $BACKEND_CONTAINER
                    """
                }
            }
        }
    }

    post {
        always {
            deleteDir()
        }
    }
}
