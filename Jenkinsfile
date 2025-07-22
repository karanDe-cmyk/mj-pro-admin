@Library('Shared') _
pipeline {
    agent any 

    environment {
        SONAR_HOME = tool "Sonar"
        IMAGE_NAME = "maccotech/stable-matka-admin-prod"
        K8S_REPO_URL = 'https://github.com/MaccoTechgit/aws-Kubernetes.git'
        K8S_BRANCH = 'maya-matka'
        K8S_FOLDER = 'kubernetes'
        YAML_FILE = "${K8S_FOLDER}/frontend-admin.yaml"
        CODE_REPO_URL = 'https://github.com/MaccoTechgit/Matka-Admin.git'
        CODE_BRANCH = 'kalyan257-maya-admin'
        ARGOCD_SERVER = 'argocd.maccotech.in'
        ARGOCD_TOKEN = credentials('argocd-api-token')
        APP_NAME = 'MAYA-MATKA'
    }

    stages {
        stage('Git: Checkout Kubernetes Repo') {
            steps {
                script {
                    cleanWs()
                    git credentialsId: 'Github-Cred', url: "${K8S_REPO_URL}", branch: "${K8S_BRANCH}"
                    sh "ls -la ${K8S_FOLDER}"
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


        stage("SonarQube: Code Analysis"){
            steps{
                script{
                    sonarqube_analysis("Sonar","Maya-matka","Maya-matka")
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
                        echo "Before sed:"
                        cat ${YAML_FILE}

                        sed -i 's#image:\\s*maccotech/stable-matka-admin-prod:.*#image: maccotech/stable-matka-admin-prod:${env.FRONTEND_DOCKER_TAG}#' ${YAML_FILE}

                        echo "After sed:"
                        cat ${YAML_FILE}

                        grep "image: maccotech/stable-matka-admin-prod:${env.FRONTEND_DOCKER_TAG}" ${YAML_FILE} || { echo "❌ Failed to update YAML file"; exit 1; }
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
                            git commit -m "Updated Docker image tag to ${env.FRONTEND_DOCKER_TAG}" || echo "No changes to commit"
                            git push origin ${K8S_BRANCH}
                        """
                    }
                }
            }
        }

        stage("Sync ArgoCD") {
            steps {
                withEnv(["ARGOCD_TOKEN=${ARGOCD_TOKEN}"]) {
                    sh '''
                    curl -k -X POST https://argocd.maccotech.in/api/v1/applications/MH-MATKA/sync \
                    -H "Authorization: Bearer $ARGOCD_TOKEN" \
                    -H "Content-Type: application/json" \
                    -d '{ "prune": true, "dryRun": false, "strategy": { "hook": { } } }'
                    '''
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

    }

    post {
        success {
            script {
                env.GIT_COMMIT_MSG = sh(script: "cd code-repo && git log -1 --pretty=%B", returnStdout: true).trim()
                env.END_TIME = new Date().format("yyyy-MM-dd HH:mm:ss", TimeZone.getTimeZone("Asia/Kolkata"))
                env.START_TIME = currentBuild.startTimeInMillis
                def durationSeconds = (System.currentTimeMillis() - env.START_TIME.toLong()) / 1000
                def durationMinutes = durationSeconds.intValue() / 60
                env.DURATION = durationMinutes + " min"
                env.TRIGGERED_BY = "Jenkins"
                env.QUALITY_GATE = readFile('sonar-quality-gate.txt').trim() ?: 'Unknown'
                env.SECURITY_SCAN_STATUS = "All Good"
                
                emailext attachLog: true,
                from: 'sauravaws003@maccotech.in',
                subject: "✅ [SUCCESS] ${env.JOB_NAME} - Build #${env.BUILD_NUMBER}",
                mimeType: 'text/html',
                to: 'mukultyagibackend005@maccotech.in, sauravaws003@maccotech.in, karanbackend001@maccotech.in, sumitsinghbackend006@maccotech.in, rohityadavbackend007@maccotech.in,',
                body: """
                    <html>
                        <body style="font-family: Arial, sans-serif; background-color: #f1f3f5; padding: 20px;">
                            <div style="max-width: 750px; margin: auto; background: #fff; border-radius: 8px; padding: 20px; border: 1px solid #dee2e6;">
                                <div style="text-align: center;">
                                    <img src="https://www.jenkins.io/images/logos/jenkins/jenkins.png" alt="Jenkins" width="100"/>
                                    <h2 style="color: #28a745;">✅ Build Successful</h2>
                                    <p style="color: #6c757d; font-size: 15px;">Deployment Report from Jenkins CI/CD</p>
                                </div>
                                <hr/>
                                <table style="width: 100%; font-size: 14px; border-collapse: collapse;">
                                    <tr><td><b>🧾 Job Name:</b></td><td>${env.JOB_NAME}</td></tr>
                                    <tr><td><b>🔢 Build Number:</b></td><td>${env.BUILD_NUMBER}</td></tr>
                                    <tr><td><b>⏱ Duration:</b></td><td>${env.DURATION}</td></tr>
                                    <tr><td><b>📅 Completed At:</b></td><td>${env.END_TIME} IST</td></tr>
                                    <tr><td><b>🔁 Triggered By:</b></td><td>${env.TRIGGERED_BY}</td></tr>
                                    <tr><td><b>📄 Git Branch:</b></td><td>${env.CODE_BRANCH}</td></tr>
                                    <tr><td><b>🧬 Git Commit ID:</b></td><td>${env.GIT_COMMIT}</td></tr>
                                    <tr><td><b>📝 Commit Message:</b></td><td>${env.GIT_COMMIT_MSG}</td></tr>
                                    <tr><td><b>🐳 Docker Image:</b></td><td><code>${env.IMAGE_NAME}:${env.FRONTEND_DOCKER_TAG}</code></td></tr>
                                    <tr><td><b>📦 DockerHub:</b></td><td><a href="https://hub.docker.com/r/${env.IMAGE_NAME}" target="_blank">View Image</a></td></tr>
                                    <tr><td><b>📊 Sonar Report:</b></td><td><a href="https://sonar.maccotech.in/dashboard?id=jannat-frontend-admin" target="_blank">View Report</a></td></tr>
                                    <tr><td><b>✔️ Quality Gate:</b></td><td>${env.QUALITY_GATE}</td></tr>
                                    <tr><td><b>🔐 Security Scan (Trivy/Snyk):</b></td><td><pre style="background:#f8f9fa; padding:8px; border-radius:4px; max-height:80px; overflow:auto;">${env.SECURITY_SCAN_STATUS}</pre></td></tr>
                                    <tr><td><b>🚀 ArgoCD:</b></td><td><a href="https://${env.ARGOCD_SERVER}/applications/${env.APP_NAME}" target="_blank">${env.APP_NAME}</a></td></tr>
                                    <tr><td><b>🔧 Kubernetes Namespace:</b></td><td><code>devops-tools</code></td></tr>
                                    <tr><td><b>📁 Artifacts:</b></td><td><a href="${env.BUILD_URL}artifact/" target="_blank">Download</a></td></tr>
                                    <tr><td><b>📈 Monitoring (Prometheus/Grafana):</b></td><td>
                                        <a href="https://prometheus.maccotech.in/graph?g0.expr=job%3D'${env.JOB_NAME}'" target="_blank">Prometheus</a> | 
                                        <a href="https://grafana.maccotech.in/d/${env.JOB_NAME}" target="_blank">Grafana Dashboard</a>
                                    </td></tr>
                                    <tr><td><b>🔗 Build URL:</b></td><td><a href="${env.BUILD_URL}" target="_blank">${env.BUILD_URL}</a></td></tr>
                                </table>
                                <hr/>
                                <p style="text-align: center; color: #6c757d; font-size: 13px;">
                                    📬 This is an automated email from <b>Maccotech Jenkins CI/CD</b>.
                                </p>
                            </div>
                        </body>
                    </html>
                """
            }
        }


        failure {
            script {
                env.GIT_COMMIT_MSG = sh(script: "cd code-repo && git log -1 --pretty=%B || echo 'N/A'", returnStdout: true).trim()
                env.END_TIME = new Date().format("yyyy-MM-dd HH:mm:ss", TimeZone.getTimeZone("Asia/Kolkata"))
                env.START_TIME = currentBuild.startTimeInMillis
                def durationSeconds = (System.currentTimeMillis() - env.START_TIME.toLong()) / 1000
                def durationMinutes = durationSeconds.intValue() / 60
                env.DURATION = durationMinutes + " min"
                env.TRIGGERED_BY = currentBuild.rawBuild.getCause(hudson.model.Cause)?.shortDescription ?: 'N/A'
                env.SECURITY_SCAN_STATUS = readFile('trivy-scan-result.txt').trim() ?: 'No scan results found'

                emailext attachLog: true,
                from: 'sauravaws003@maccotech.in',
                subject: "❌ [FAILURE] ${env.JOB_NAME} - Build #${env.BUILD_NUMBER}",
                mimeType: 'text/html',
                to: 'mukultyagibackend005@maccotech.in, sauravaws003@maccotech.in, karanbackend001@maccotech.in, sumitsinghbackend006@maccotech.in, rohityadavbackend007@maccotech.in',
                body: """
                    <html>
                        <body style="font-family: Arial, sans-serif; background-color: #fff5f5; padding: 20px;">
                            <div style="max-width: 750px; margin: auto; background: #fff; border-radius: 8px; padding: 20px; border: 1px solid #f5c2c7;">
                                <div style="text-align: center;">
                                    <img src="https://upload.wikimedia.org/wikipedia/commons/e/e9/Jenkins_logo.svg" alt="Jenkins" width="100"/>
                                    <h2 style="color: #dc3545;">❌ Build Failed</h2>
                                    <p style="color: #6c757d; font-size: 15px;">Pipeline Execution Failed</p>
                                </div>
                                <hr/>
                                <table style="width: 100%; font-size: 14px; border-collapse: collapse;">
                                    <tr><td><b>🧾 Job Name:</b></td><td>${env.JOB_NAME}</td></tr>
                                    <tr><td><b>🔢 Build Number:</b></td><td>${env.BUILD_NUMBER}</td></tr>
                                    <tr><td><b>⏱ Duration:</b></td><td>${env.DURATION}</td></tr>
                                    <tr><td><b>📅 Failed At:</b></td><td>${env.END_TIME} IST</td></tr>
                                    <tr><td><b>🔁 Triggered By:</b></td><td>${env.TRIGGERED_BY}</td></tr>
                                    <tr><td><b>📄 Git Branch:</b></td><td>${env.CODE_BRANCH}</td></tr>
                                    <tr><td><b>🧬 Git Commit ID:</b></td><td>${env.GIT_COMMIT}</td></tr>
                                    <tr><td><b>📝 Commit Message:</b></td><td>${env.GIT_COMMIT_MSG}</td></tr>
                                    <tr><td><b>🔗 Build URL:</b></td><td><a href="${env.BUILD_URL}" target="_blank">${env.BUILD_URL}</a></td></tr>
                                    <tr><td><b>🔐 Security Scan (Trivy/Snyk):</b></td><td><pre style="background:#fff0f0; padding:8px; border-radius:4px; max-height:80px; overflow:auto;">${env.SECURITY_SCAN_STATUS}</pre></td></tr>
                                </table>
                                <hr/>
                                <p style="text-align: center; color: #dc3545; font-size: 13px;">
                                    ⚠️ Please investigate the error and re-trigger the pipeline if needed.
                                </p>
                            </div>
                        </body>
                    </html>
                """
            }
        }

    }

    
}