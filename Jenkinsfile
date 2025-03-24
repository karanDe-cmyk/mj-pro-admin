@Library('Shared') _
pipeline {
    agent any 

    environment {
        SONAR_HOME = tool "Sonar"
        IMAGE_NAME = "maccotech/jannat-frontend-admin-prod"
        K8S_REPO_URL = 'https://github.com/MaccoTechgit/aws-Kubernetes.git'
        K8S_BRANCH = 'jannat-matka'
        K8S_FOLDER = 'kubernetes'
        YAML_FILE = "${K8S_FOLDER}/frontend-admin.yaml"
        CODE_REPO_URL = 'https://github.com/MaccoTechgit/Matka-Fronted.git'
        CODE_BRANCH = 'jannat-frontend-admin'
        ARGOCD_SERVER = '15.207.103.107:31102'
        ARGOCD_TOKEN = credentials('argocd-api-token')
        APP_NAME = 'JANNAT-MATKA'
    }

    stages {
        stage('Git: Checkout Kubernetes Repo') {
            steps {
                script {
                    cleanWs()
                    git credentialsId: 'Github-Cred', url: "${K8S_REPO_URL}", branch: "${K8S_BRANCH}"
                    sh "ls -la ${K8S_FOLDER}" // Debug: Verify folder exists
                }
            }
        }

        stage('Extract & Increment Version') {
            steps {
                script {
                    def oldVersion = sh(script: "grep 'image:' ${YAML_FILE} | awk -F: '{print \$3}' | tr -d ' '", returnStdout: true).trim()

                    if (!oldVersion) {
                        error("❌ Could not extract version from YAML file!")
                    }

                    def versionParts = oldVersion.replace("v", "").tokenize('.')
                    def newVersion = "v${versionParts[0]}.${versionParts[1].toInteger() + 1}"

                    env.FRONTEND_DOCKER_TAG = newVersion
                    echo "✅ Old Version: ${oldVersion}, New Version: ${newVersion}"
                }
            }
        }

        stage('Git: Checkout Code Repo') {
            steps {
                script {
                    dir('code-repo') {
                        cleanWs()
                        git credentialsId: 'Github-Cred', url: "${CODE_REPO_URL}", branch: "${CODE_BRANCH}"
                    }
                }
            }
        }

        stage("Trivy: Security Scan") {
            steps {
                script {
                    trivy_scan()
                }
            }
        }
        stage("SonarQube: Code Analysis"){
            steps{
                script{
                    sonarqube_analysis("Sonar","jannat-frontend-admin","jannat-frontend-admin")
                }
            }
        }
        
        stage("SonarQube: Code Quality Gates"){
            steps{
                script{
                    sonarqube_code_quality()
                }
            }
        }

        stage('Docker: Build Image') {
            steps {
                script {
                    dir('code-repo') {
                        docker.build("${IMAGE_NAME}:${env.FRONTEND_DOCKER_TAG}")
                    }
                }
            }
        }

        stage('Docker: Push Image') {
            steps {
                script {
                    dir('code-repo') {
                        docker.withRegistry('https://index.docker.io/v1/', 'DockerHub-Cred') {
                            docker.image("${IMAGE_NAME}:${env.FRONTEND_DOCKER_TAG}").push()
                        }
                    }
                }
            }
        }

        stage('Git: Update Kubernetes YAML') {
            steps {
                script {
                    sh """
                        # Debug: Show original file content
                        echo "Before sed:"
                        cat ${YAML_FILE}

                        # Update the image tag, accounting for variable whitespace
                        sed -i 's#image:\\s*maccotech/jannat-frontend-admin-prod:.*#image: maccotech/jannat-frontend-admin-prod:${env.FRONTEND_DOCKER_TAG}#' ${YAML_FILE}

                        # Debug: Show updated file content
                        echo "After sed:"
                        cat ${YAML_FILE}

                        # Verify the change was applied
                        grep "image: maccotech/jannat-frontend-admin-prod:${env.FRONTEND_DOCKER_TAG}" ${YAML_FILE} || { echo "❌ Failed to update YAML file"; exit 1; }
                    """
                }
            }
        }

        stage('Git: Commit & Push Updated YAML') {
            steps {
                script {
                    withCredentials([gitUsernamePassword(credentialsId: 'Github-Cred', gitToolName: 'Default')]) {
                        sh """
                            git config --global user.email "sauravgarg5922@gmail.com"
                            git config --global user.name "sauravgarg547"

                            git status # Debug: Check staged changes
                            git add ${YAML_FILE}
                            git commit -m "Updated frontend image tag to ${env.FRONTEND_DOCKER_TAG}" || echo "No changes to commit"
                            git push origin ${K8S_BRANCH}
                        """
                    }
                }
            }
        }

        stage("Sync ArgoCD") {
            steps {
                script {
                    sh """
                        curl -k -X POST https://${ARGOCD_SERVER}/api/v1/applications/${APP_NAME}/sync \
                        -H "Authorization: Bearer ${ARGOCD_TOKEN}" \
                        -H "Content-Type: application/json" \
                        -d '{ "prune": true, "dryRun": false, "strategy": { "hook": { } } }'
                    """
                }
            }
        }

        stage("Docker Image Remove"){
            steps{
                script{
                    sh "docker rmi ${IMAGE_NAME}:${env.FRONTEND_DOCKER_TAG} || echo 'Image remove failed, might be in use or already deleted'"
                }
            }
        }

        stage("Workspace cleanup"){
            steps{
                script{
                    cleanWs()
                }
            }
        }

    }

    post {
        success {
            script {
                emailext attachLog: true,
                from: 'jenkins@maccotech.in',
                subject: "✅ SUCCESS: ${env.JOB_NAME} Deployment - Build ${env.BUILD_NUMBER}",
                body: """
                    <html>
                        <body style="font-family: Arial, sans-serif;">
                            <h2 style="color: green;">Deployment Successful</h2>
                            <p><b>Job:</b> ${env.JOB_NAME}</p>
                            <p><b>Build Number:</b> ${env.BUILD_NUMBER}</p>
                            <p><b>Image Version:</b> ${env.FRONTEND_DOCKER_TAG}</p>
                            <p><b>Build URL:</b> <a href="${env.BUILD_URL}">${env.BUILD_URL}</a></p>
                        </body>
                    </html>
                """,
                to: 'sauravgarg5922@gmail.com, sumit.in9625@gmail.com',
                mimeType: 'text/html'
            }
        }

        failure {
            script {
                emailext attachLog: true,
                from: 'jenkins@maccotech.in',
                subject: "❌ URGENT: ${env.JOB_NAME} Deployment Failed - Build ${env.BUILD_NUMBER}",
                body: """
                    <html>
                        <body style="font-family: Arial, sans-serif;">
                            <h2 style="color: red;">Deployment Failed</h2>
                            <p><b>Job:</b> ${env.JOB_NAME}</p>
                            <p><b>Build Number:</b> ${env.BUILD_NUMBER}</p>
                            <p><b>Image Version:</b> ${env.FRONTEND_DOCKER_TAG}</p>
                            <p><b>Build URL:</b> <a href="${env.BUILD_URL}">${env.BUILD_URL}</a></p>
                            <p><b>Check the logs for more details.</b></p>
                        </body>
                    </html>
                """,
                to: 'sauravgarg5922@gmail.com, sumit.in9625@gmail.com',
                mimeType: 'text/html'
            }
        }
    }
}
