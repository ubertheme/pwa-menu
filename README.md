
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
git clone -b v5.0.0 --single-branch https://github.com/ubertheme/pwa-menu
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



