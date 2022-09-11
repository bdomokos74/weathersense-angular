#!/usr/bin/env bash

az storage blob upload-batch -s dist/weathersense-angular -d '$web' --account-name $AZURE_GUI_STORAGE_TEST_ACCOUNT
