# Secure your Media Workloads with JWT Token with Lambda@Edge along Encryption with Amazon KMS(Key Management Service). 

Creating a video-on-demand (VOD) solution on AWS (Amazon Web Services) typically involves using various AWS services to store, transcode, and deliver video content to end-users.Also in some cases it becomes vulnearble for sensitive data.So data can not be simply kept in S3.It should be encrypted so that none can use it without proper authentication.

## Architecture overview

**<img src="/doc/architecture.png" alt="Architecture"/>**

## Solution components
The above architecture diagram illustrates highly secure infrastructure to streamline video on demand solution by automating the configuration and management of ingesting and encoding components for highly reliable delivery of video content.

The frontend and backend AWS resources are built using [AWS Amplify](https://docs.amplify.aws/), an end-to-end solution that enables mobile and front-end web developers to build and deploy secure, scalable full-stack applications. With Amplify, you can configure app backends in minutes, connect them to your app in just a few lines of code, and deploy static web apps in three steps.

The web app is built in React and uses Video.JS as the video player.

Utilizing AWS Amplify, a complete solution that enables front-end and back-end web developers to create and deploy safe, scalable full-stack apps, the frontend and backend AWS resources are constructed. With Amplify, you can launch static web apps in three easy steps and quickly configure app backends by connecting them to your app in a few lines of code. 

The web application was created using React, and the video player is Video.JS. After successful authentication, Amazon Cognito returns user pool tokens to your application. Then, you can use the token to grant access to the backend resources. In the proposed architecture, the token is used for signing the requests for media stream content, The Lambda@Edge function decodes and validates the token attributes, authenticating the spectator to watch the content. 


## Deployment Steps:

### 1. Project Dependencies

For building the integration with AWS components and host our web application we will be using AWS Amplify. 
For more complete steps of installing and configure AWS Amplify please visit the documentation (Amplify Documentation (https://docs.amplify.aws/start/getting-started/installation/q/integration/react#option-2-follow-the-instructions) for React). 

```sh
  npm install -g @aws-amplify/cli
  amplify configure
```
### 2. Clone the repository
We will clone using the amplify init app. AWS Amplify will create a sample implementation on your local environment and provision the AWS backend resources: (API and Authentication).

```sh
  git clone https://github.com/rits1309/cloudfront_encrypt_decrypt.git
  cd cloudfront-secure-media/
```

Now install the dependencies and start your backend environment with AWS Amplify.

```sh
  npm install   
```
```sh
  amplify init
  ? Enter a name for the environment dev
  ? Choose your default editor: Visual Studio Code
  Using default provider  awscloudformation
  ? Select the authentication method you want to use: AWS profile
  ? Please choose the profile you want to use default
```
*Please make sure to select correct aws profile created with amplify configure*

### 3. Create your cloud environment for authentication

```sh
  amplify status
```

It should list the following resources:

```
      Current Environment: dev
      
  ┌──────────┬──────────────────────────┬───────────┬───────────────────┐
  │ Category │ Resource name            │ Operation │ Provider plugin   │
  ├──────────┼──────────────────────────┼───────────┼───────────────────┤
  │ Auth     │ playerjwtcognito5d5d2eb2 │ Create    │ awscloudformation │
  ├──────────┼──────────────────────────┼───────────┼───────────────────┤
  │ Function │ jwtauth                  │ Create    │ awscloudformation │
  └──────────┴──────────────────────────┴───────────┴───────────────────┘
```

To create the Amazon Cognito user pool for authenticate our users, and provide the JWT token to protect your media resources, we need to push the local resources to the AWS cloud.

```sh
  amplify push
```

As we have a post-push script to retrieve the Amazon Cognito configuration, so to minimize the deployment steps, you need to push changes again in order to properly set the Lambda params.

```sh
  amplify push
```

## 4. Start your local environment 

Now you can start testig your application

```sh
  npm start
```
It should load the authentication page. Now you can create your first user account and sign in.
Click in *Create Account*

<img src="/doc/Auth01.png" alt="Create your Account" />

 *After the login, it should load the following local website:*
<img src="/doc/SimplePlayer.png" alt="Simple Player Demo" />

### 5. Setup the video workflow:

Deploy VOD solution follwing **https://aws.amazon.com/solutions/implementations/video-on-demand-on-aws/**.

**Test Transcoding**

Navigate to the S3 console. Amplify Video has deployed a few buckets into your environment. Select the input bucket and upload a .mp4 file you have stored locally on your computer.
Once the file has been successfully uploaded, navigate the MediaConvert Console to see your transcode job kicked off. This job takes the input file, transcodes it into the Apple HTTP Live Streaming Protocol (HLS), and outputs the segment files to the S3 bucket labeled output.

**Testing Media Playback**

After the MediaConvert job has reached a completed state, navigate back to the S3 Console, and locate the output bucket. When you step into the bucket you will see a folder with the name of the file you uploaded. Step into the folder and you will see the output files created by MediaConvert. Locate the HLS Manifest, the file with the .m3u8 extension, then replace the S3 domain with the Output URL of the content.

The format of the playable URL will be the Output URL for content + /name of the asset/ + name of the asset.m3u8
Example: https://someid.cloudfront.net/BigBuckBunny/BigBuckBunny.m3u8

### 6. Add JWT token authentication to your Amazon CloudFront distribution.

This step has been astracted by Amaplify Hooks, by creating a before push script.
If you need to configure manually [follow this guide](/Cognito_MANUAL.md)

### 7. Add MediaConvert encryption context.
 This step will encrypt contents inside S3 source bucket using KMS key.So anybody can see the encrypted content.

### 8. *Deploy to Lambda@Edge*

Now that we have pushed the function to check the JWT Token to the cloud, you have to deploy it to your distribution, which has been created at step 5.

*a. Go to the* *CloudFront console* (https://console.aws.amazon.com/cloudfront/)*, and get the distribution ARN created at step 5*
<img src="/doc/cloudfrontARN.png" alt="cloudfront arn" />


*b. Go to Lambda console (https://console.aws.amazon.com/lambda), and Deploy the function to Lambda@Edge*
<img src="/doc/DeploytoEDGE.png" alt="cloudfront arn" />

Then, select **Viewer Request**
<img src="/doc/DeploytoEDGE02.png" alt="cloudfront arn" />

*Note: AWS KMS should have permissions to encrypt and decrypt.* 

### 8. End-to-End Tests

Now open your web application and play some test content.
In the video URL field, add the full CloudFront URL of your output asset created at step 5.
<img src="/doc/SimplePlayer.png" alt="Simple Player Demo" />

### 9. Cleanup, removing the provisioned AWS resources.  
If you need to remove the resources deployed by this sample, you can use the command below:

```sh
  amplify delete
```


