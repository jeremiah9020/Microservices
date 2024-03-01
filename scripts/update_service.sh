if [ $# -eq 0 ]; then
    >&2 echo "Please provide the name of the service"
    exit 1
fi

cd "$(dirname "$(realpath -- "$0")")"/..;
DATE="$(date +"%Y-%m-%d-%H-%M-%S")"

az login

echo "\n\nBuilding image"
docker build -t recipescr.azurecr.io/$1:$DATE --platform linux/amd64 -f ./$1/src/Dockerfile .

echo "\n\nPushing image to registry"
az acr login --name recipescr   
docker push recipescr.azurecr.io/$1:$DATE   

echo "\n\nUpdating container app"
az containerapp update \
    --name $1 \
    --resource-group recipes-rg \
    --image recipescr.azurecr.io/$1:$DATE