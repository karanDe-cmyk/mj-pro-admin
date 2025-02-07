@Library('Shared') _
pipeline {
    agent any

    environment {
        SONAR_HOME = tool "Sonar"
        DOCKER_IMAGE = "saurav547/matka-frontend"
    }

    stages {
        stage("Workspace Cleanup") {
            steps {
                cleanWs()
            }
        }

        stage("Git: Code Checkout") {
            steps {
                script {
                    git credentialsId: 'Github-Cred', url: 'https://github.com/MaccoTechgit/Matka-Fronted.git', branch: 'himanshu'
                }
            }
        }

        stage("Generate Version Tag") {
            steps {
                script {
                    def lastTag = sh(script: "git describe --tags --abbrev=0 || echo v1.0", returnStdout: true).trim()
                    def versionParts = lastTag.replace("v", "").tokenize('.')
                    def newTag = "v${versionParts[0]}.${versionParts[1].toInteger() + 1}"
                    env.NEW_FRONTEND_DOCKER_TAG = newTag
                    echo "Generated new tag: ${env.NEW_FRONTEND_DOCKER_TAG}"
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

        stage("Docker: Build Image") {
            steps {
                script {
                    docker_build("matka-frontend", "${env.NEW_FRONTEND_DOCKER_TAG}", "saurav547")
                }
            }
        }

        stage("Docker: Push to DockerHub") {
            steps {
                script {
                    docker_push("matka-frontend", "${env.NEW_FRONTEND_DOCKER_TAG}", "saurav547")
                }
            }
        }

        stage("Docker: Cleanup Local Images") {
            steps {
                script {
                    echo "Cleaning up local Docker images..."
                    sh """
                        docker rmi saurav547/matka-frontend:${env.NEW_FRONTEND_DOCKER_TAG} || true
                        docker image prune -af || true
                    """
                }
            }
        }
    }

    post {
        success {
            script {
                echo "Triggering Deployment Pipeline with TAG: ${env.NEW_FRONTEND_DOCKER_TAG}"
                build job: "Matka-Fronted-CD", parameters: [
                    string(name: 'FRONTEND_DOCKER_TAG', value: "${env.NEW_FRONTEND_DOCKER_TAG}")
                ]
            }
        }
    }
}
