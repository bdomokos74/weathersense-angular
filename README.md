# WeathersenseAngular2

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Compressing, build and deploy SPA

Need to set Content-encoding of the zipped files to GZip.

```
# prereq
npm install gzipper --save-dev

# adds version string
npm run prebuild

npm run build-compress 

# for test build
#npm run build-test-compress 

$AZURE_GUI_STORAGE_ACCOUNT = 'weathersenseguitest'
$result = az storage blob upload-batch -s .\dist-compressed\weathersense-angular\browser -d '$web' --account-name $AZURE_GUI_STORAGE_ACCOUNT --overwrite
$fileList = $result | jq '.[].Blob'

foreach($f in $fileList) {
  $full=$f -replace '.*/', ''
  $full=$full -replace '"', ''
  $cmd="az storage blob update --account-name $AZURE_GUI_STORAGE_ACCOUNT -c '`$web' --content-encoding GZip -n $full"
  write-host "Calling $cmd"
  invoke-expression $cmd
}
```

## Export devices

Create a file with the below content:

```json
{
  "exportBlobContainerUri": "blobsasurl with read, write and delete access",
  "excludeKeys": true
}
```

Execute in az cli (after login):  

```bash
az rest -m get --header "Accept=application/json" -u 'https://management.azure.com/subscriptions/<subs id>/resourceGroups/<resourcegroup>/providers/Microsoft.Devices/IotHubs/<iothubname>/exportDevices?api-version=2018-04-01' --body @exportreq.json
```

This will create a devices.txt in the given container.


## Add d3

```bash
npm install d3 && npm install @types/d3 --save-dev
```

## Notes

https://docs.microsoft.com/en-us/azure/active-directory/develop/msal-client-application-configuration

https://docs.microsoft.com/en-us/azure/active-directory/develop/tutorial-v2-angular-auth-code

https://material.angular.io/components/table/examples#table-http

### Azure App Roles

* In App Registrations / App roles create an app role
* Go to the corresponding Enterprise Application, select Users and groups. Add user/group, then select the user, then select the role created in the first step.
* Update Token configuration

https://github.com/MicrosoftDocs/azure-docs/blob/main/articles/active-directory/develop/howto-add-app-roles-in-azure-ad-apps.md

https://github.com/Azure-Samples/active-directory-aspnetcore-webapp-openidconnect-v2/blob/master/4-WebApp-your-API/4-1-MyOrg/README.md

https://learn.microsoft.com/en-us/azure/active-directory/develop/howto-add-app-roles-in-azure-ad-apps

https://github.com/AzureAD/microsoft-authentication-library-for-js

https://learn.microsoft.com/en-us/azure/active-directory/develop/id-tokens

https://github.com/Azure-Samples/ms-identity-javascript-angular-tutorial/blob/main/5-AccessControl/1-call-api-roles/SPA/src/app/auth-config.ts

https://learn.microsoft.com/en-gb/azure/active-directory/develop/v2-oauth2-auth-code-flow

## Scratchpad

### IoT HUB query

```
SELECT deviceId, properties.desired.do[sensors.json](..%2F..%2FDownloads%2Fsensors.json)Sleep, properties.reported.fwVersion, properties.reported.gitRevision, properties.reported.$metadata.$lastUpdated
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
