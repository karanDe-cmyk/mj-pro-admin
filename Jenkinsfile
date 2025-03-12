@Library('Shared') _
pipeline {
    agent any

    environment {
        SONAR_HOME = tool "Sonar"
    }

    parameters {
        string(name: 'FRONTEND_DOCKER_TAG', defaultValue: '', description: 'Setting docker image for latest push')
    }

    stages {
        stage("Validate Parameters") {
            steps {
                script {
                    if (params.FRONTEND_DOCKER_TAG == '') {
                        error("FRONTEND_DOCKER_TAG must be provided.")
                    }
                }
            }
        }

        stage("Workspace Cleanup") {
            steps {
                cleanWs()
            }
        }

        stage('Git: Code Checkout') {
            steps {
                git credentialsId: 'Github-Cred', url: 'https://github.com/MaccoTechgit/Matka-Fronted.git', branch: 'jannat-frontend-admin'
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
                    docker_build("jannat-frontend-admin-prod", "${params.FRONTEND_DOCKER_TAG}", "saurav547")
                }
            }
        }

        stage("Docker: Push to DockerHub") {
            steps {
                script {
                    docker_push("jannat-frontend-admin-prod", "${params.FRONTEND_DOCKER_TAG}", "saurav547")
                }
            }
        }
    }

    post {
        success {
            build job: "Jannat-Fronted-Admin-CD", parameters: [
                string(name: 'FRONTEND_DOCKER_TAG', value: "${params.FRONTEND_DOCKER_TAG}")
            ]
        }
    }
}
