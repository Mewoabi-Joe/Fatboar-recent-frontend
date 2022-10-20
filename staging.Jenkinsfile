pipeline {

    agent any

    environment {
        EMAIL_TO = ' aminekhalifa92@hotmail.fr';



    }
    tools {nodejs "nodeTool"}


    stages {

            stage("Code Checkout from GOGS") {

                          steps {

                           git branch: 'develop',
                            credentialsId: '805d3920f20c13452e7864b9740b6881ded0a026',
                            url: 'https://gogs.fatboar-burger.fr/DSP-O19/fronEnd-fatboar.git/'

                          }

                    }

            stage("Run Unit Test")
                {
                     steps {

                         nodejs(nodeJSInstallationName: 'nodeTool'){
                             script {
                                 echo "run unit test"
                             }

                             }
                     }
                 }



              stage('Code Quality Check via SonarQube')
            {
             steps {
                           script {

                               def scannerHome = tool  'sonarqube';

                                       withSonarQubeEnv("sonarqube-server")
                                       {
                                              sh "${tool("sonarqube")}/bin/sonar-scanner  \
                                              -Dsonar.projectKey=angular-app \
                                              -Dsonar.sources=. \
                                              -Dsonar.host.url=http://sonarqube.fatboar-burger.fr \
                                              -Dsonar.login=532fe6c590d068670908bda9de5f5c64c4dd4eb8"

                                           }

                                      }
                            }
            }

             stage("Build Dokcer Image")
             {

                steps {
                     sh "docker build  -t  av-app-image:0.0.${BUILD_NUMBER} -f Dockerfile.debug  ."

                  }

             }

           stage('Push Docker Images to Nexus Registry')
           {
                steps {
               withCredentials([usernamePassword(credentialsId: 'nexus', passwordVariable: 'pwd', usernameVariable: 'username')])
               {
                sh "docker login -u ${username}  -p ${pwd}  nexus.fatboar-burger.fr:8123"
                sh "docker tag av-app-image:0.0.${BUILD_NUMBER} nexus.fatboar-burger.fr:8123/angular-staging:0.0.${BUILD_NUMBER}"
                sh "docker push nexus.fatboar-burger.fr:8123/angular-staging:0.0.${BUILD_NUMBER}"
                sh 'docker rmi -f $(docker images --filter=reference="av-app-image:0.0.${BUILD_NUMBER}*" -q)'
                }

                }

            }

             stage("Deploy to docker swarm cluster"){
                  steps {

                    sshagent(['Docker_Swarm_Manager_Dev']) {

                              sh 'scp -o StrictHostKeyChecking=no  docker-compose.debug.yml amine@51.159.66.150: '
                              sh "ssh -o StrictHostKeyChecking=no amine@51.159.66.150  docker rmi -f  nexus.fatboar-burger.fr:8123/angular-staging:0.0.* ||true"
                              sh "ssh -o StrictHostKeyChecking=no amine@51.159.66.150  docker login -u admin  -p amine1  nexus.fatboar-burger.fr:8123"
                              sh "ssh -o StrictHostKeyChecking=no amine@51.159.66.150  docker pull  nexus.fatboar-burger.fr:8123/angular-staging:0.0.${BUILD_NUMBER}"
                              sh 'ssh -o StrictHostKeyChecking=no amine@51.159.66.150 docker stack rm home || true'
                              sh "ssh -o StrictHostKeyChecking=no amine@51.159.66.150  env VERSION=${BUILD_NUMBER} docker stack deploy --prune --compose-file docker-compose.debug.yml home"


                    }
                  }
                }
                 stage ("wait_for_deploy")
                             {
                              steps {
                                     script {
                                          sh 'sleep 90'
                                          }
                                     }
                             }




                     stage("Using curl example") {
                                 steps {
                                     script {
                                         final String url = "https://staging.fatboar.fr/"

                                         final String response = sh(script: "curl -s $url", returnStdout: true).trim()

                                         echo response
                                     }
                                 }
                             }

       /**  stage("Run Katalon Test")
                {
                     steps {
                    build 'staging-katalon-fatboar-burger'

                     }
                }**/



    }


}
