if [ $# -eq 0 ]; then
    >&2 echo "Please provide the name of the service"
    exit 1
fi

ROOTDIR="$(dirname "$(realpath -- "$0")")"/..;
cd $ROOTDIR

for name in $(ls ./shared/services)
do
  used_port=$(cat ./shared/services/$name)

  if [ $name == $1 ]; then
    DATE="$(date +"%Y-%m-%d-%H-%M-%S")"

    az login

    az acr login --name recipescr   

    echo "\n\nBuilding image"
    docker build -t recipescr.azurecr.io/$1:$DATE --platform linux/amd64 -f ./$1/src/Dockerfile .

    echo "\n\nPushing image to registry"
    docker push recipescr.azurecr.io/$1:$DATE   

    echo "\n\nCreating database"
    az sql db create -g recipes-rg -s recipes-database-server -e GeneralPurpose -f Gen5 -c 2 --compute-model Serverless --max-size 4GB -n $1-db

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
  fi;
  
done

echo No service with that name



