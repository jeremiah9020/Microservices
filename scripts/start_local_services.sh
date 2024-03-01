
HOME="$(dirname "$(realpath -- "$0")")"/..;

{
    cd $HOME/service/src
    npm start
}

wait