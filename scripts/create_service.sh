if [ $# -eq 0 ]; then
    >&2 echo "Please provide the name of the service and the port"
    exit 1
fi

if [ $# -eq 1 ]; then
    >&2 echo "Please provide the port"
    exit 1
fi

ROOTDIR="$(dirname "$(realpath -- "$0")")"/..;
cd $ROOTDIR

mkdir $1

cp -r template/ ./$1

sed -i '' "s/SERVICEPATH/$1/g" ./$1/src/Dockerfile
sed -i '' "s/SERVICEPORT/$2/g" ./$1/src/Dockerfile
sed -i '' "s/SERVICEPORT/$2/g" ./$1/src/bin/www
sed -i '' "s/PORT/$2/g" ./$1/deploy.yml
sed -i '' "s/SERVICE/$1/g" ./$1/deploy.yml

mv ./$1/deploy.yml .github/workflows/deploy_$1.yml

touch ./scripts/services/$1

cd ./$1/src

npm install

cd $ROOTDIR

DATE="$(date +"%Y-%m-%d-%H-%M-%S")"

az login

az acr login --name recipescr   

echo "\n\nBuilding image"
docker build -t recipescr.azurecr.io/$1:$DATE --platform linux/amd64 -f ./$1/src/Dockerfile .

echo "\n\nPushing image to registry"
docker push recipescr.azurecr.io/$1:$DATE   

echo "\n\nCreating container app"
az containerapp create \
    --name $1 \
    --resource-group recipes-rg \
    --environment recipes-env \
    --image recipescr.azurecr.io/$1:$DATE \
    --target-port $2 \
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