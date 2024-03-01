
HOME="$(dirname "$(realpath -- "$0")")"/..;

cd $HOME/scripts/services

TEST=$(ls)

for n in $TEST
do
    cd $HOME/$n/src
    npm start &
done


wait