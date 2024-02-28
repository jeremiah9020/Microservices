az login

az upgrade

az extension add --name containerapp --upgrade

az provider register --namespace Microsoft.App

az provider register --namespace Microsoft.OperationalInsights

az group create \
  --name recipesrg \
  --location "westus"

az acr create \
  --resource-group recipesrg \
  --name recipescr \
  --sku Basic \
  --admin-enabled true

az containerapp env create \
  --name recipesenv \
  --resource-group recipesrg \
  --location "westus"