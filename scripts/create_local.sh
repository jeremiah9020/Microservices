if [ $# -eq 0 ]; then
    >&2 echo "Please provide the name of the service and the path"
    exit 1
fi

cd "$(dirname "$(realpath -- "$0")")"/..;

mkdir $1