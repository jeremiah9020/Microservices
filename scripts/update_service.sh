cd "$(dirname "$(realpath -- "$0")")";\

DATE="$(date +"%Y-%m-%d-%H-%M-%S")"

docker build --tag recipescr.azurecr.io/service-$DATE --platform linux/amd64 ../service/src

az acr login --name recipescr   

docker push recipescr.azurecr.io/service-$DATE   

az containerapp update \
  --name service \
  --resource-group recipes-rg \
  --image recipescr.azurecr.io/service-$DATE \
  --query properties.configuration.ingress.fqdn