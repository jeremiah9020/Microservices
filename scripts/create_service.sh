if [ $# -eq 0 ]; then
    >&2 echo "Please provide the name of the service and the path"
    exit 1
fi

if [ $# -eq 1 ]; then
    >&2 echo "Please provide the path to the folder containing the docker file relative to the base directory"
    exit 1
fi

cd "$(dirname "$(realpath -- "$0")")"/..;
DATE="$(date +"%Y-%m-%d-%H-%M-%S")"

az login

echo "\n\nBuilding image"
docker build -t recipescr.azurecr.io/$1:$DATE --platform linux/amd64 -f ./$2/Dockerfile .

echo "\n\nPushing image to registry"
az acr login --name recipescr   
docker push recipescr.azurecr.io/$1:$DATE   

echo "\n\nCreating container app"
az containerapp create \
    --name $1 \
    --resource-group recipes-rg \
    --environment recipes-env \
    --image recipescr.azurecr.io/$1:$DATE \
    --target-port 3000 \
    --ingress 'external' \
    --env-vars KEYVAULT=https://recipes-keyvault.vault.azure.net/ DB=$1-db ONLINE=true \
    --registry-server recipescr.azurecr.io

RESOURCE_ID=$(az acr show --name recipescr --query id --output tsv)

echo "\n\nCreating system-assigned identity for container app"
az containerapp identity assign \
    --name $1 \
    --resource-group recipes-rg \
    --system-assigned \
    --output tsv

PRINCIPAL_ID=$(az containerapp identity show --name $1 --resource-group recipes-rg --query principalId --output tsv)

echo "\n\nCreating role assignment"
az role assignment create \
  --assignee $PRINCIPAL_ID \
  --role AcrPull \
  --scope $RESOURCE_ID

echo "\n\nSeting registry"
az containerapp registry set \
  --name $1 \
  --resource-group recipes-rg \
  --server recipescr.azurecr.io \
  --identity system

echo "\n\nCreating keyvault connection"
az containerapp connection create keyvault \
  -n $1 \
  -g recipes-rg \
  -c $1 \
  --tg recipes-rg \
  --vault recipes-keyvault \
  --system-identity \
  --client-type nodejs

echo "\n\nCreating database"
az sql db create -g recipes-rg -s recipes-database-server -e GeneralPurpose -f Gen5 -c 2 --compute-model Serverless --max-size 4GB -n $1-db

# I need to define swagger stuff first!
# az apim api create --service-name service2 -g recipes-rg --api-id service2 --path '/service2' --display-name 'service2' --api-type http --protocols https --subscription-required false
