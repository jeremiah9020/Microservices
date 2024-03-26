HOME="$(dirname "$(realpath -- "$0")")"/..;

cd $HOME/shared/services

TEST=$(ls)



for n in $TEST
do
    cd $HOME/$n/src
    npm start &
done

sleep 2

cd $HOME/testing

npm start &

wait $!

kill $(jobs -p)
