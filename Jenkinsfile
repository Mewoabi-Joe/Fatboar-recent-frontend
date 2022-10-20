node(){
    stage('cloning Git') {
           checkout scm
    }


    stage('Install dependencies') {
        nodejs('nodejs') {
            sh 'npm install'
            echo "Modules installed"
        }
  
    }
    stage('Build') {
       nodejs('nodejs') {
            sh 'npm run build'
            echo "Build completed"
       }
      
    }
  
  
    stage('Packge Build') {
        sh "tar -zcvf bundle.tar.gz dist/automationdemo/"
    }
  
    stage('Artifacts Creation') {
        fingerprint 'bundle.tar.gz'
        archieveArtifacts 'bundle.tar.gz'
        echo "Artifacts created"
    }
   
    stage('stash changes') {
        stash allowEmpty: true, includes: 'bundle.tar.gz', name:'buildArtifacts'
    }

    {
    echo 'Unstash'
    unstash 'buildArtifacts'
    echo 'Artifacts copied'
  
    echo 'copy'
    sh "yes | sudo cp -R bundle.tar.gz /var/www/html && cd /var/www/html && sudo tar -xvf bundle.tar.gz"
    echo 'copy completed'
    }
}
      
      
      
      
      
      
