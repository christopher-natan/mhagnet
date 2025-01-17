# Mhagnet App
The Mhagnet app is my another fun project to showcase my quality coding and robust architecture in building an app from scratch. It comprises four main sections. The source code provided here consists of sample codes sourced from my Mhagnet App, available at  http://www.mhagnet.com/admin/products, intended solely for demonstration purposes. The app is still a work in progress and may encounter some issues and this is quite a big personal project and doing only on my available time.

For Deployment: I am not using CI/CD here, mostly I am utilizing free resources except the google cloud platform, but for local development tool I am using Virtual Box with debian OS - simulating the google cloud compute.


## Sections

1. **Admin (Frontend)**
    - I built it with the latest version of Angular, offering a sleek and modern user experience.
    - https://github.com/christopher-natan/mhagnet/tree/dev/admin
    - I highly implemented here the Event-driven programming

2. **API (Backend Service)**
    - I developed the backend using NodeJS with NestJS framework, ensuring a robust and scalable backend infrastructure.
    - https://github.com/christopher-natan/mhagnet/tree/dev/api

3. **AI Reporter (AI Service)**
    - This feature allows you to upload PDF documents and extract desired information or answer questions contained within the PDFs, I wrote it using NodeJS with Express and using AI.
    - https://github.com/christopher-natan/mhagnet/tree/dev/ai-reporter
    - Using observables and  event-based
   
3. **Driver App (Mobile Service)**
   - For Driver App I am using Dart-Flutter with GetX state management. I've developed another fun project called Kitakits app and I will use it as the basis for the Mhagnet driver app,
     with just a few tweaks to make it compatible. Check it on PlayStore https://play.google.com/store/apps/details?id=com.cmnworks.kitakits
   - https://github.com/christopher-natan/mhagnet/tree/dev/drivers
   - Strictly Event-driven programming approach

## Database

The Mhagnet app utilizes MySQL, elegantly structured through an ORM (Object-Relational Mapping) for seamless database interactions.




