HOME="$(dirname "$(realpath -- "$0")")"/..;

cd $HOME/shared/services

TEST=$(ls)



for n in $TEST
do
    cd $HOME/$n/src
    npm start &
done

sleep 2

cd $HOME/testing/k6

# Register
k6 run  --summary-export=summary/POST.auth.register.json POST.auth.register.js > /dev/null

# Create Recipes
k6 run --summary-export=summary/POST.recipe.json POST.recipe.js  > /dev/null

# Create Cookbooks
k6 run --summary-export=summary/POST.cookbook.json POST.cookbook.js  > /dev/null

# Update Cookbooks
k6 run --summary-export=summary/PATCH.cookbook.json PATCH.cookbook.js  > /dev/null

# Copy Cookbooks
k6 run --summary-export=summary/POST.cookbook.copy.json POST.cookbook.copy.js  > /dev/null

# Save Recipes
k6 run --summary-export=summary/PATCH.user.recipes.json PATCH.user.recipes.js  > /dev/null

# Save Cookbooks
k6 run --summary-export=summary/PATCH.user.cookbooks.json PATCH.user.cookbooks.js  > /dev/null

# Home Feed
k6 run --summary-export=summary/GET.feed.home.json GET.feed.home.js  > /dev/null

# Query Feed
k6 run --summary-export=summary/GET.feed.query.json GET.feed.query.js  > /dev/null

# Delete
k6 run --summary-export=summary/POST.auth.delete.json POST.auth.delete.js  > /dev/null

# Running a bulk test!
k6 run --summary-export=summary/bulk.json bulk.js  > /dev/null

# Output results

node ./helper/output.js

kill $(jobs -p)
