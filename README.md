
This repo provides the source code files for PWA mega menu's storefront which helps you get familar with Magento PWA Studio. 

# Overview

PWA Mega Menu is an add-on that add the new mega menu functionality to the [UB Mega Menu](https://www.ubertheme.com/magento-extensions-2-x/ub-mega-menu/) - the paid version that allows you to set up mega menu on top of Magento PWA Studio project. 

The full package includes the following parts:

- Core mega menu:
  - *UbMegaMenu*
  - *MegaMenuGraphQl* (helps to handle declarative retrieval of menu data from GraphQL queries right within a single back-end of UB Mega Menu module)
- *UBMegaMenu-PWA* (the source code for PWA mega menu’s storefront)

# How to try PWA Mega Menu without purchasing the module? 

You simply pull the source code of PWA Mega Menu storefront (which is free) from this repo and follow the instruction below. Once done, you should have a Magento PWA Studio instance with UB PWA Mega Menu like the following screenshot: 

![PWA Mega Menu demo](https://static.ubertheme.com/blog/2020/2/pwa_megamenu_installation/pwa_megamenu.png) 

(All the sample content and UB Mega Menu's backend configuration are retrieved from our existing [UB Mega Menu demo](https://www.ubertheme.com/magento-news/magento-pwa-mega-menu/?utm_source=m2_tutorial&utm_medium=github&utm_campaign=magento_pwa_menu))

# Prerequisites

Make sure you have the following:
* NodeJS >= 10.14.1 LTS (NodeJS 11+ can cause problems)
* Yarn >= 1.13.0
* Python 2.7 and build tools, see the Installation instructions on node-gyp for your platform.
* unix based OS for example MacOS or Linux

# Steps to deploy PWA Menu project in Magento PWA Studio

### Step 1: Pull the code from Magento Studio PWA git repository.
Pull the specific a version, for example we will pull the 'v5.0.0' version:
```
git clone --branch v5.0.0 https://github.com/magento/pwa-studio.git
```
### Step 2: Pull the code of UB PWA Menu from git repository.
First, make sure you navigate to the pwa-studio folder you’ve just pulled in Step 1:
```
cd pwa-studio
```
Pull the specific a branch, for example we will pull the 'v5.0.0' branch:
```
git clone -b v5.0.0 --single-branch https://github.com/ubertheme/pwa-menu packages/pwa-menu
```
### Step 3: Setting, build and run the UB PWA Menu project.

3.1. First, you need to declare a new workspace by opening the file `pwa-studio/package.json` and find the lines:
```
"packages/venia-ui"
```
and replace it with:
```
"packages/venia-ui",
"packages/pwa-menu"
```
The next step is to add a new run script for UB PWA Menu project in the same package.json file:
Find:
```
"venia": "node ./packages/pwa-buildpack/bin/buildpack load-env ./packages/venia-concept && yarn workspace @magento/venia-concept",
```
Replace it with:
```
"venia": "node ./packages/pwa-buildpack/bin/buildpack load-env ./packages/venia-concept && yarn workspace @magento/venia-concept",
"pwa-menu": "node ./packages/pwa-buildpack/bin/buildpack load-env ./packages/pwa-menu && yarn workspace @ubertheme/pwa-menu", 
```
Then, install PWA Studio dependencies by running this command:
```
yarn install
```
Once done, create the .env file for PWA Menu project by run command:
```
CHECKOUT_BRAINTREE_TOKEN=sandbox_rzknz7v7_dbw5pyvbpn4bwhw9 MAGENTO_BACKEND_URL="https://pwabackend.demo.ubertheme.com/" yarn buildpack create-env-file packages/pwa-menu
```
3.2. Generate a unique, secure custom domain for your new project by running the command below (You need to run the following command by a user with administrative permission. This step requires administrative access, so it may prompt you for an administrative password at the command line):
```
yarn run buildpack create-custom-origin packages/pwa-menu/
```
3.3. Build your project by executing the following command (this step helps to create a new /dist directory in your project’s root directory with optimized assets):
```
yarn pwa-menu build
```
3.4. Run the PWA Menu project:

+ Dev mode: 
```
yarn pwa-menu watch
```
+ Stage mode: 
```
yarn pwa-menu start
```

Once done, your storefront should now show the newly installed PWA Mega Menu!

# Useful links

* [Tutorial] [How to create a custom PWA project](https://www.ubertheme.com/magento-news/how-to-create-custom-pwa-project-on-top-magento-pwa-studio/?utm_source=m2_tutorial&utm_medium=github&utm_campaign=magento_pwa_setup) on top of Magento PWA Studio﻿
* Live demo and features of [UB Mega Menu for Magento PWA Studio](https://www.ubertheme.com/magento-news/magento-pwa-mega-menu/?utm_source=m2_tutorial&utm_medium=github&utm_campaign=magento_pwa_menu)
* Have a question, reach us via info (at) ubertheme.com

