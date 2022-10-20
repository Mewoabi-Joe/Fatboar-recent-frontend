pipeline {
  environment {
    imageName = "nexus.fatboar-burger.fr:8123/angular-staging"
    imageOption = "-f Dockerfile.Ssrdebug  ."
    nexusServer = "nexus.fatboar-burger.fr:8123"
         serviceName= "home"
             sshOption= " -o StrictHostKeyChecking=no"
             serverIp= "amine@51.159.66.150"
             composeFile= "docker-compose.Ssrdebug.yml"


  }
  tools {nodejs "nodeTool"}
  agent any
  stages {
    stage('Cloning Git') {
      steps {
        git([url: 'https://gogs.fatboar-burger.fr/DSP-O19/fronEnd-fatboar.git/', branch: 'develop', credentialsId: 'gogs-comp'])

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
                      /**     stage('SonarQube')
                               {
                                steps {
                                              script {

                                                  def scannerHome = tool  'sonarqube';

                                                          withSonarQubeEnv("sonarqube-server")
                                                          {
                                                                 sh "${tool("sonarqube")}/bin/sonar-scanner  \
                                                                 -Dsonar.projectKey=angular-app \
                                                                 -Dsonar.sources=. \
                                                                 -Dsonar.host.url=https://sonarqube.fatboar-burger.fr \
                                                                 -Dsonar.login=532fe6c590d068670908bda9de5f5c64c4dd4eb8"

                                                              }

                                                         }
                                               }
                               }
                               **/
  stage('Building image') {
      steps{
        script {
            sh "docker build  -t  $imageName:$BUILD_NUMBER $imageOption"
        }
      }
    }
    stage('Deploy Images to Nexus Registry')
           {
                steps {
                sh "docker push $imageName:$BUILD_NUMBER"

                }

            }

    stage('Remove Unused docker image') {
      steps{
        sh "docker rmi $imageName:$BUILD_NUMBER ||true"
         sh "docker rmi $imageName:latest ||true"

      }
    }
             stage("Deploy to docker swarm cluster"){
                  steps {

                    sshagent(['Docker_Swarm_Manager_Dev']) {

                                sh "ssh $sshOption $serverIp  docker rmi -f  $imageName:* ||true"
                                sh 'ssh $sshOption  $serverIp  docker stack rm $serviceName || true'
                                sh 'ssh $sshOption $serverIp docker system prune -f || true'
                                sh 'scp $sshOption  $composeFile $serverIp: '
                                sh "ssh $sshOption  $serverIp  docker pull  $imageName:$BUILD_NUMBER"
                                sh "ssh $sshOption  $serverIp  env VERSION=$BUILD_NUMBER IMAGE=$imageName docker stack deploy --prune --compose-file $composeFile $serviceName "


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




                     stage("Using curl") {
                                 steps {
                                     script {
                                         final String url = "https://staging.fatboar.fr/"

                                         final String response = sh(script: "curl -s $url", returnStdout: true).trim()

                                         echo response
                                     }
                                 }
                             }

                            /**  stage("Run jmeter Test")
                                             {
                                                  steps {
                                                 build job: 'staging-jmeter', parameters: [string(name: 'Thread', value: '1'), string(name: 'RampUp', value: '5'), string(name: 'Iterations', value: '1')]

                                                  }
                                             }**/
  }
}
