HOME="$(dirname "$(realpath -- "$0")")"/..;

cd $HOME/testing
npm install

cd $HOME/shared
npm install

cd $HOME/AuthService/src
npm install

cd $HOME/CookbookService/src
npm install

cd $HOME/FeedService/src
npm install

cd $HOME/RecipeService/src
npm install

cd $HOME/UserService/src
npm install