!/bin/bash
echo "this is from script"
echo -e "this is a new run\n" >>/var/jenkins_home/hello.txt
date>> /var/jenkins_home/hello.txt

