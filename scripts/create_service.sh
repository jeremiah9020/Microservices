cd "$(dirname "$(realpath -- "$0")")";

docker build --tag recipescr.azurecr.io/service --platform linux/amd64 ../service/src

az acr login --name recipescr   

docker push recipescr.azurecr.io/service      

az containerapp create \
    --name service \
    --resource-group recipesrg \
    --environment recipesenv \
    --image recipescr.azurecr.io/service \
    --target-port 3000 \
    --ingress 'external' \
    --registry-server recipescr.azurecr.io \
    --query properties.configuration.ingress.fqdn