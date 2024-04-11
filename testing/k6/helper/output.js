const fs = require('fs');
const path = require('path');


const summaryPath = path.join(__dirname,'../summary')
const results = fs.readdirSync(summaryPath);

console.log(`\n\nRoute\t\t\t\t| Average Duration`);
console.log(`--------------------------------+-------------------`);

for (const fileName of results) {
    const file = fs.readFileSync(path.join(summaryPath, fileName),{encoding:'utf-8'});

    const obj = JSON.parse(file);


    const name = (fileName.replace('.',' ').replace('.json','').replace(/\./g,' -> ') + ':').padEnd(31, ' ');
    console.log(`${name} | ${obj.metrics.iteration_duration.avg}`);
}

console.log('\n');

