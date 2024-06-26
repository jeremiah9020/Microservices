# Recipe App

## Description

This is a web application built for CPTS 499, Spring 2024, at Washington State University. The application was built on the microservices architecture, and therefore is built to be run in containers that can be changed and scaled independently.

## Getting Started

This app should be very easy to get running! Follow the instructions below

## Dependencies

* Node / NPM

* Brew (macOS) / Choco (Windows)

### Running the program

* Install all packages
    ```sh
    cd scripts
    sh install.sh
    ```
    
* Start the services
    ```sh
    cd scripts
    sh start_local_services.sh
    ```

* Run the tests
    ```sh
    cd scripts
    sh run_test.sh
    ```

* Run the load tests
    ```sh
    brew install k6      # macOS
    choco install k6     # Windows
    cd scripts
    sh run_load_tests.sh
    ```

## Authors

[JeremiahLynn](https://github.com/jeremiah9020)

## Documentation

[Swagger] (https://app.swaggerhub.com/apis-docs/JEREMIAH9020/test/1.0.0)

## License

Copyright (C) Jeremiah Lynn 2024. All Rights Reserved.

For internal use only. Do not redistribute.

Copyright laws and international treaties protect this app. Unauthorized redistribution of this app without express, written permission from our legal department may entail severe civil or criminal penalties.