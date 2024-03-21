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


for name in $(ls ./shared/services)
do
  used_port=$(cat ./shared/services/$name)

  if [ $name == $1 ]; then
    >&2 echo "Service already created"
    exit 1
  fi;

  if [ $used_port == $2 ]; then
    >&2 echo "Port already in use"
    exit 1
  fi;
done




mkdir $1

cp -r template/ ./$1

sed -i '' "s/SERVICEPATH/$1/g" ./$1/src/Dockerfile
sed -i '' "s/SERVICEPORT/$2/g" ./$1/src/Dockerfile
sed -i '' "s/SERVICEPORT/$2/g" ./$1/src/bin/www
sed -i '' "s/PORT/$2/g" ./$1/deploy.yml
sed -i '' "s/SERVICE/$1/g" ./$1/deploy.yml

mv ./$1/deploy.yml .github/workflows/deploy_$1.yml

echo "$2 " > ./shared/services/$1

cd ./$1/src

npm install

echo If you would like to upload the service, run the upload_service script!