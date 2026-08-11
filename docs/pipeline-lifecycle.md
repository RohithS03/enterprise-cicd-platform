# 7-Stage Pipeline Lifecycle Documentation

1. **Git Checkout**: Pulls latest commit from origin branch.
2. **Maven Build**: Executes `mvn clean compile`.
3. **Unit Tests**: Runs JUnit test suite.
4. **SonarQube Analysis**: Evaluates Quality Gate (Bugs, Vulnerabilities, Code Smells).
5. **Package WAR**: Packages compiled bytecode into `myweb.war`.
6. **Nexus Publish**: Uploads artifact to Sonatype Nexus releases repository.
7. **Tomcat Deployment**: Deploys `myweb.war` to Tomcat `webapps/` directory and restarts service.
