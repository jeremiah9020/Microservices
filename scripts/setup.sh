az login

az upgrade

az extension add --name containerapp --upgrade

az provider register --namespace Microsoft.App

az provider register --namespace Microsoft.OperationalInsights

az provider register -n Microsoft.ServiceLinker

az group create \
  --name recipes-rg \
  --location "westus"

az acr create \
  --resource-group recipes-rg \
  --name recipescr \
  --sku Basic \
  --admin-enabled true

az containerapp env create \
  --name recipes-env \
  --resource-group recipes-rg \
  --location "westus" \
  --internalOnly true

SUBSCRIPTION_ID=$(az account show --query id --output tsv)

echo "\n\n\nAdd the following as a repository secret in github, then create a new action that mimics the deploy_service.yml"

az ad sp create-for-rbac \
  --name azure_contributor_credentials \
  --role contributor \
  --scopes /subscriptions/$SUBSCRIPTION_ID/resourceGroups/recipes-rg \
  --json-auth \
  --output json