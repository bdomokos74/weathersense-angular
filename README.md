# WeathersenseAngular2

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 14.1.1.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng g component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

```
ng build --configuration test
ng build --prod
```

### Compressing and build

```
npm run build-compress
```

Also need to set Content-encoding of the zipped files to GZip

```
$result =  npm run build-compress
$fileList = $result | jq '.[].Blob'
az storage blob update --account-name $AZURE_GUI_STORAGE_ACCOUNT -c '$web' --content-encoding GZip -n index.html
...
```

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.

### How to deploy the SPA

```
# for prod:
az storage blob upload-batch -s dist-compressed/weathersense-angular2 -d '$web' --account-name $AZURE_GUI_STORAGE_ACCOUNT

# for test:
az storage blob upload-batch -s dist/weathersense-angular2 -d '$web' --account-name $AZURE_GUI_TEST_STORAGE_ACCOUNT
```


### Add d3

```
npm install d3 && npm install @types/d3 --save-dev
```

### Notes


https://docs.microsoft.com/en-us/azure/active-directory/develop/msal-client-application-configuration

https://docs.microsoft.com/en-us/azure/active-directory/develop/tutorial-v2-angular-auth-code

https://mater`ial.angular.io/components/table/examples#table-http
`

### Scratchpad



#### IoT HUB query

```
SELECT deviceId, properties.desired.doSleep, properties.reported.fwVersion, properties.reported.gitRevision, properties.reported.$metadata.$lastUpdated
FROM devices
```


"target": "https://weathersensehub.azure-devices.net",

iothub api
89d10474-74af-4874-99a7-c23c2f643083
https://docs.microsoft.com/en-us/cli/azure/ad/app/permission?view=azure-cli-latest

az ad app permission list --id 5ee20736-5cc8-4466-acac-fe2062a9a1a7
[
{
"resourceAccess": [
{
"id": "03e0da56-190b-40ad-a80c-ea378c433f7f",
"type": "Scope"
}
],
"resourceAppId": "e406a681-f3d4-42a8-90b6-c2b029497af1" <- azure storage
},
{
"resourceAccess": [
{
"id": "e1fe6dd8-ba31-4d61-89e7-88639da4683d",
"type": "Scope"
}
],
"resourceAppId": "00000003-0000-0000-c000-000000000000"
}
]

az role definition list --query "[].{name: name, descr: description}[? contains(descr, 'IoT')]"




5ee20736-5cc8-4466-acac-fe2062a9a1a7 <- wstestapp
89d10474-74af-4874-99a7-c23c2f643083 <- iot hub
4ea46cd5-c1b2-4a8e-910b-273211f9ce47 <- device registry contributor

az ad app permission add --id 5ee20736-5cc8-4466-acac-fe2062a9a1a7 --api 89d10474-74af-4874-99a7-c23c2f643083 --api-permission 4ea46cd5-c1b2-4a8e-910b-273211f9ce47=Role

az ad app permission grant --id 5ee20736-5cc8-4466-acac-fe2062a9a1a7 --api 89d10474-74af-4874-99a7-c23c2f643083
{
"@odata.context": "https://graph.microsoft.com/v1.0/$metadata#oauth2PermissionGrants/$entity",
"clientId": "cb213c98-d380-4424-91e3-0e06669529b9",
"consentType": "AllPrincipals",
"id": "mDwhy4DTJESR4w4GZpUpufC2fU-zvJpBvtc65WxXgUw",
"principalId": null,
"resourceId": "4f7db6f0-bcb3-419a-bed7-3ae56c57814c",
"scope": "Resource"
}

https://blog.memoryleek.co.uk/apim/azure/identity/2021/08/13/using-managed-identity-to-connect-to-azure-services-from-api-management.html

https://docs.microsoft.com/en-us/azure/api-management/api-management-authentication-policies#ManagedIdentity
